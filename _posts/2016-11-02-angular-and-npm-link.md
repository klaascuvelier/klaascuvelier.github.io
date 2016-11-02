---
title: Angular and npm link
author: Klaas Cuvelier
layout: post
permalink: /2016/11/angular-and-npm-link/
comments: true
categories:
  - development
tags:
  - angular
  - angular2
  - npm
---

<p class="post-note">This article applies to Angular 2 and newer versions.</p>

#### TL;DR
Using `npm link` when developing Angular plugins might give you some headaches when trying to import Angular modules
from your linked package. It's related to the `node_modules` directory.

## About \`npm link\`

`npm link` makes it easy to use a package you are actively working on in an other project without having to
`npm publish` and `npm update` with every change. The [npm documentation](https://docs.npmjs.com/cli/link) on it is very
 clear, basically it just comes done to sym-linking your plugin package into the node_modules folder from the other
 project.

## The problem when developing Angular modules
I ran into this problem:
`VM6012:129 Uncaught Error: Unexpected value 'ExternalModule' imported by the module 'AppModule'`

[![Screenshot of the actual error](/public/2016-11-npm-link-angular-issue.png)](/public/2016-11-npm-link-angular-issue.png)

My external Angular module (linked through `npm link`) could not be imported by my host application.
Google did not turn up with much useful information on my problem, so I decided to dive into the Angular source code
to get a clue.

## Finding out why the external module is invalid
The specific error was thrown by the
 [metadata_resolver class](https://github.com/angular/angular/blob/234c5599f10c33e743594b556b63bc6fdd87e7eb/modules/%40angular/compiler/src/metadata_resolver.ts#L248-L250)
 and indicates that Angular could not find the metadata for the module.
The surrounding code led me to the [ng_module_resolver class](https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/ng_module_resolver.ts#L25),
 the [reflector class](https://github.com/angular/angular/blob/master/modules/%40angular/core/src/reflection/reflector.ts#L33)
 and the [reflection_capabilities class](https://github.com/angular/angular/blob/76dd026447011823770e23fb5c4168c7d96a494b/modules/%40angular/core/src/reflection/reflection_capabilities.ts#L92).

The external module seemed to have the right decorator data, but [ng_module_resolve](https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/ng_module_resolver.ts#L26)
 told me there was not `NgModuleMetadata` available for my module.
Stepping into the [_isNgModuleMetadata method](https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/ng_module_resolver.ts#L14-L16)
 showed me that my metadata looked very much like an `NgModule` instance, but was actually not.

Diving into the [DecoratorFactory method](https://github.com/angular/angular/blob/38e2203b24ba3657e92b51fae910915b481c2486/modules/%40angular/core/src/util/decorators.ts#L264-L288)
 reminded me that decorators are just functions.
 So when the metadata of my module very much looks like an `NgModule` (created by the `DecoratorFactory`) but in fact
  isn't, it might just be an instance of an `NgModule` created by another `DecoratorFactory`.

From there on it did not take me too long to figure out that the `import { NgModule } from "@angular/core";` in my
 linked package was using the angular package from the `node_modules` folder at it's original location, and not the
 ones from the host location.

## Wrapping up
In hindsight this all makes sense.

This issue can be explained by the fact that my external package is a symlink and because of
 [how Node modules are resolved](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders).
 So two instances of `NgModule` were created, and this explains why the
 [_isNgModuleMetadata method](https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/ng_module_resolver.ts#L14-L16),
 returned false.

Still, it took me quite a while to fully figure this out.
 I don't think we can blame Angular for the vague error message or `npm link` for the way it's implemented.
 It's just a stupid coincidence of symlinks and method instances (decorators).

I stopped using `npm link` for this specific project to fix this issue,
i hope this explanation makes sense and can help a few people resolving similar issues when running into them.

## The upside

I guess there is mostly always an upside on running into issues like this; I really learnt a lot on Angular 2.

I'm a big believer that knowing the internals of a framework can benefit you when using a framework.