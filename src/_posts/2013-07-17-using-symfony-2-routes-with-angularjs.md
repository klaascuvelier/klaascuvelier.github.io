---
id: 5022
title: Using Symfony 2 routes with AngularJS
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.klaascuvelier.be/?p=5022
permalink: /2013/07/using-symfony-2-routes-with-angularjs/
categories:
  - Development
tags:
  - posts
  - angular
  - js
  - routing
  - symfony
---

## About Symfony2 Routes

Symfony has a great implementation of <a title="Symfony routing" href="http://symfony.com/doc/current/book/routing.html" target="_blank">routing</a> where you can assign names to routes. This way you can generate an URL by referencing this route via the name and giving some parameters (if needed) both in another method and in your views.

### **An example:**

[symfony-controller.php on Github](https://gist.github.com/klaascuvelier/6018279)

This is a view where the routes are used  
[symfony-routing.html.twig on Github](https://gist.github.com/klaascuvelier/6018261)

Using a name to reference to a specific route is very useful, if you decide later on that the url to fetch assets should be changed to */prefix/asset/{type} *or whatever, there is no need to do a search-replace over the code base.

## **Bringing this flexibility to the front-end**

There are various reasons why you&#8217;d need URLs in your JavaScript (AngularJS); fetching data, performing actions, &#8230;  
By hardcoding URLs you lose the flexibility Symfony provided, this is a construction to keep it in the front-end:

- Create a service where all routes are stored in key/value-pairs, which can generate URLs by providing the route name and optional parameters
- Create a directive to define all available routes in the URL service

### **The service**

[url-service.js on Github](https://gist.github.com/klaascuvelier/6018363)

### **The directive**

The easiest way to define the available routes in the service, is via a directive.  
An HTML element (in this case a script-tag) with a special attribute can be used to define all routes. In the pre-compile method, the element&#8217;s innerHTML is parsed to add all routes to the service.  
[url-directive.js on Github](https://gist.github.com/klaascuvelier/6018424)

**Using the URL directive**  
[url-example.html.twig on Github](https://gist.github.com/klaascuvelier/6018540)

### Using URLs in an AngularJS controller

Using a route you defined earlier in a controller is pretty straight forward:  
[example-controller.js on Github](https://gist.github.com/klaascuvelier/6018397)

## Remarks

In the URL directive and service *:parameter* is used to add parameters in the url, it would also be possible to use *{parameter}* to make it more like the routes in PHP, but this would require to do an urldecode of the generated URL

The *:parameter* placeholder has one downside, it limits your options for <a href="http://symfony.com/doc/current/book/routing.html#required-and-optional-placeholders" target="_blank">parameter requirements</a>.  
It&#8217;s not possible to add numeric or advanced regular expressions as requirements, as the placeholder is a fixed string.

&nbsp;
