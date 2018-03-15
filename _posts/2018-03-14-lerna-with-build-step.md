---
title: Lerna monorepo with build step 
author: Klaas Cuvelier
layout: post
permalink: /2018/03/lerna-with-build-step/
categories:
  - development
tags:
  - angular
  - npm
  - lerna
  - monorepo
---

## Situation sketch
At [Showpad](https://www.showpad.com), we created quite a few libraries for internal use (a lot of them are Angular libraries). 
Most libraries have their own repository and get published separately to our private NPM registry.
Angular's short [release cycle](https://github.com/angular/angular/blob/master/docs/RELEASE_SCHEDULE.md) is great for the 
ecosystem, but it can be challenging to keep all your applications and libraries at the same, latest version. While a major release every 6 
months doesn't seem like a lot, keeping up can be a big challenge if you have multiple applications.

Recently, we decided to try moving some libraries to a monorepo to see if it would benefit us.
Setting up the repo was not very straightforward and advanced Lerna documentation is pretty scarce (at the time of writing) so I decided 
to share our set up.

## Creating the monorepo

We considered some different monorepo tools and eventually dediced to use [Lerna](https://github.com/lerna/lerna). We created a new repo 
and initialized lerna in it (without the `--independent` flag):

```bash
$ git clone https://github.com/showpad/angular-packages
$ cd angular-packages
$ lerna init
```

Most of the repositories we wanted to add to the monorepo had a build step; inlining templates and styles and generating an 
[AOT](https://angular.io/guide/aot-compiler) compiled library. We had a separate `package.json` file in our `src` folder only declaring 
`name`, `version` and `peerDependencies`, which we copied over to the dist folder. Results were published with `npm publish dist`, 
thus only publishing the 
generated files. 

Importing those repositories into Lerna like that was a bit of a problem; Lerna does not really have a build step, you can't specify 
a subfolder to be published and there would be quite some duplicated build code.
  
The problem could be solved by just copying over the `src` folder and `package.json` file from the original repos 
(so not using the `lerna import` function), and adding an `index.js` and `index.d.ts` file which export everything from the `src` folder 
and then publishing the whole folder (with source files instead of compiled files).  

```js
// index.js
export * from './src';
```

Publishing TypeScript source files was no problem while using Angular <= 4.x, but when Angular version 5 was released, a stricter 
version of tsconfig was introduced, which basically 
[disallowed having uncompiled files in your node modules](https://github.com/angular/angular-cli/issues/8284#issuecomment-341417325).
This Typescript config change forced us to add a build step again. 
 
## Adding a build step

It took us a while to figure how to do it, but apparently Lerna has `pre` and `post` 
publish scripts. It's not very well documented. 
[This was the only mention](https://github.com/lerna/lerna/issues/643#issuecomment-284888565) we could find about it. 
The word **synchronous** was also not very obvious in that comment.   

By adding a script named `prepublish.js` (or `postpublish.js`) in the `script` folder of any package, you can run **synchronous** 
scripts.

We ended up extracting the code for executing the script and showing some info into a file in the root directory,
and adding a small `script/prepublish.js` file into every package that needs to be built:

```js
// ./packages/package-name/scripts/prepublish.js

const path = require('path');
const prePublish = require('../../../bundling/prepublish');

prePublish('search', path.join(__dirname, '../'));
```

```js
// ./bundling/prepublish.js

const ora = require('ora');
const timeout = 1000 * 60 * 2;
const buildCommand = `npm run build`;

function prePublish(packageAlias, packagePath) {
    const spinner = ora({
        text: `Building "${packageAlias}" library`,
        spinner: {interval: 0, frames: ['…']}
    }).start();

    try {
        const result = require('child_process').execSync(buildCommand, {timeout, cwd: packagePath});
        // result.toString();
    } catch (error) {
        spinner.fail(`Could not finish building "${packageAlias}" library`);
        console.log(error.stdout.toString());
        process.exit();
    }

    spinner.succeed(`Finished building "${packageAlias}" library`);
}

module.exports = prePublish;
```

The bundling script runs the npm build script in the specified folder synchronously (with a timeout) and
shows some information in the terminal so we can see what step the `lerna publish` command is in. 
We're using [ora](https://github.com/sindresorhus/ora) for that, just for the ease of use. We replaced the default spinner 
with a static one, as it does not really spins because the command is ran synchronously.

The npm build script runs a Gulp script that inlines the templates and styles and then runs `ngc` on the generated files.

### Controlling the package contents

The last part of adding the build step was controlling the contents of the npm published package. We don't want to ship the 
source and script folders.
You can do this by specifying the `files` in the `package.json`. This is how a `package.json` file looks in most of our packages:

```json
// package.json

{
  "name": "@showpad/ng-package-name",
  "version": "x.x.x",
  "description": "package description",
  "scripts": {
    "lint": "tslint -c tslint.json './src/**/*.ts'",
    "unit": "karma start karma.conf.js",
    "test": "npm run lint && npm run unit",
    "build": "gulp build:esm"
  },
  "main": "index.js",
  "files": [
    "index.js",
    "index.d.ts",
    "dist",
    "README"
  ],
  "peerDendencies": {
    // required deps for the package
  },
  "devDependencies": {
    // required deps for development
  },
  "publishConfig": {
    "registry": "showpad npm package"
  }
}
``` 

Of course we also had to update the `index.js` file to point to the `dist` folder.

```js
// index.js
export * from './dist';
```

## Conclusion
While it was not very obvious how to move multiple existing repositories including a build step into a monorepo, we were able to figure it 
out with some digging in the code and quite some trial and error. 

Hopefully it might help you out as well and feel free to point out any improvements to our set-up.   
