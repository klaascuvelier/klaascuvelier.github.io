---
title: Internationalization in Angular 2
author: Klaas Cuvelier
layout: post
permalink: /2016/09/internationalization-in-angular2/
categories:
  - development
tags:
  - angular2
  - internationalization
  - localization
---

On September 21 [Victor Berchet](https://twitter.com/vberchet) gave a presentation on the state of internationalization in Angular 2 at BigCommerce's offices in San Francisco.
This is a small summary on that presentation.

#### TL;DR
Angular 2 has i18n and l10n features built into its core package. Currently the implementation is ready, but the configuration is quite cumbsersome and there are some 
 trade-offs that have been made. From what Victor said I assume some changes are coming (probably mostly configuration related).

# Internationalization in Angular 2
Angular 2 final got released last week, and with its core package it shipped internationalization and localization features, which lets you do translations and localized formatting 
of your application.
What is not ready however is the documentation for it, but the [PR](https://github.com/angular/angular.io/pull/2340) for the documentation is already pending, so it should be available on [Angular.io](https://www.angular.io) quite soon.

You can easily mark DOM elements that need to be internationalized by adding the `i18n` directive (as an attribute).
The `i18n` attribute can be used without a value, or you can add a description and a meaning as value (separated by a pipe), these are just metadata for the person doing the translations.

Everything you'd expect from i18n is available. The parser won't translate your HTML tags, but will replace them by placeholders in the 
translation dictionary (so if the syntax of a language is different and the HTML tag needs to be in a different place for a certain language, that's possible). 
It is possible to translate element attributes as well, by adding `i18n-[the attribute]` to your element, 
you can mark a whole group of elements to be translated by wrapping them in a i18n-comment or using the `ng-container` component and there is also 
support for pluralization.
Angular uses the standardized [ICU format](http://userguide.icu-project.org/formatparse/messages) for that.

Have a look at some of the syntax:

{% highlight ts %}
{% raw %}
// example.html
<span i18n>to be translated</span>

<span i18n="some description|this is a bird">Crane</span>
<span i18n="other description|this is a machine">Crane</span>

<p>Hello <span class="some-class">Angular</span></p>

<a href="#" title="link to some website" i18n-title>the link</a>

<!-- i18n -->
<div>Translate by comment</div>
<!--/i18n-->

<ng-container i18n>
  <span>some text</span>
  <span>more text</span>
</ng-container>

<div i18n>
  { appleCount, plural,
    =0  { no apples at all }
    one { one apple }
    =17 { seventeen apples }
    other { some apples ({{appleCount}}) }
  }
</div>
{% endraw %}
{% endhighlight %}

When all of your templates have the necessary internationalization tags it's time to generate the 
library with strings using the `ng-xi18n` binary that comes with Angular. 

{% highlight bash %}
{% raw %}
$ ./node_modules/.bin/ng-xi18n
{% endraw %}
{% endhighlight %}

<small>I did run into some problems running this command, more on that at the end.</small> 

Running this command will generate a `messages.xlf` file in your application root. 
Currently `XMB` and `XLF` formats are supported. 

When all of your message strings have been translated, you can let your application know it can use them by 
adding the translation providers when bootstrapping.

{% highlight bash %}
{% raw %}
// main.ts
import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { TRANSLATION } from './messages.en';

// ...

platformBrowserDynamic().bootstrapModule(
    AppModule,
    {
      providers: [
        { provide: TRANSLATIONS, useValue: TRANSLATION },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: LOCALE_ID, useValue: 'en' }
      ]
    }
);
{% endraw %}
{% endhighlight %}

The current implementation of internationalization requires you to define the locale you want to use when bootstrapping. 
There are some plans to move this to the angularCompilerOptions (for AoT).

The obvious advantage here is the speed, in the build phase all of the strings are compiled in.
The downside is that you'll need to generate a bundle per locale you want to support, and figure out how to know which bundle to serve...

The Angular team is aware of this and has supporting multiple locales on the roadmap, but they haven't quite figured out yet how they
will accomplish this.

## Localization in Angular 2

Victor also touched the subject of localization a little. 
There are some build in pipes like `shortDate` and `currency` which will take in to account the locale you specified. 

{% highlight bash %}
{% raw %}
// test.html
{{ cartTotal | currency }}
{{ today | date:'shortDate' }}
{% endraw %}
{% endhighlight %}

## Issues I ran in to:

### ng-xi18n command
The generation of the `xlf` file did not go very smooth for me. 

Running the command from the root folder did not use the `tsconfig.json` file 
from the `src` folder. It would make sense that I have to run this command from the `src` folder, as that is the source root and that's the place 
I would want the `messages.xlf` file to live. 

I tried running `../node_modules/.bin/ng-xi18n` form the `src` folder but that did not work out, neither 
did running `./node_modules/.bin/ng-xi18n --project src`. In the end I copied over the `tsconfig.json` file to the root which made the command run.
Currently the `messages.xlf` file is outside the `src` folder, but I put the translated file `messages.en.xlf` in the `src` folder.

### currency and locale
I was not able to make the currency pipe take in to account the specified locale. The result kept being in US locale. 
This was something Victor actually had as well in his slides.
Looking at the [CurrencyPipe implementation](https://github.com/angular/angular/blob/master/modules/@angular/common/src/pipes/number_pipe.ts) 
it looks like USD is the default currency and it's not really taking into account the locale yet<small>
 
## Summary

I think the implementation of i18n and l10n in the Angular core looks promising, but it also looks unfinished. 
The lack of multiple locale support and the upcoming configuration changes are a sign of this (and the possible locale bug?).

I don't think the `i18n` directive is going to change (a lot), so it is definitely usable at this time, that is if your application only supports  
one locale (or if you want to go through the pain of building and serving multiple bundles).

If your application needs support for multiple locales already, I'd suggest you use [ng2-translate](https://github.com/ocombe/ng2-translate) by [Olivier Combe](https://twitter.com/ocombe)

The code I used in my examples is available at [ng2-i18n on Github](https://github.com/klaascuvelier/ng2-i18n) and while doing some research I stumbled upon [this example](https://github.com/StephenFluin/i18n-sample) as well.
