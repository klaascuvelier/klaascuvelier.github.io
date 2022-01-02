---
id: 4673
title: Squeezebox server on Ubuntu Oneiric
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.cuvedev.net/?p=4673
permalink: /2011/11/squeezebox-server-on-ubuntu-oneiric/
categories:
  - Ubuntu
tags:
  - posts
  - Expat
  - JSON
  - oneiric
  - squeezebox
  - ubuntu
  - YAML
---

I had some problems with my squeezebox server installation after upgrading to Oneiric.  
When I tried starting the server, I got this error:

> Starting Squeezebox Server: Use of inherited AUTOLOAD for non-method YAML::Syck::DumpYAML() is deprecated at /usr/share/squeezeboxserver/CPAN/YAML/Syck.pm line 65.  
> The following modules failed to load: DBI EV XML::Parser::Expat HTML::Parser JSON::XS Digest::SHA1 YAML::Syck Sub::Name  
> \***\*\***  
> NOTE:  
> If you&#8217;re running some unsupported Linux/Unix platform, please use the buildme.s  
> script located here:
>
> http://svn.slimdevices.com/repos/slim/7.6/trunk/vendor/CPAN/
>
> If 7.6 is outdated by the time you read this, Replace &#8220;7.6&#8221; with the major versi  
> You should never need to do this if you&#8217;re on Windows or Mac OSX. If the install  
> don&#8217;t work for you, ask for help and/or report a bug.
>
> of Squeezebox Server you are running.
>
> \***\*\***  
> Exiting..

I read a lot on Google, about checking out a SVN repository and compiling stuff myself, but that failed for me.  
Installing a nightly version of the server is what solved my problems, version 7.7 that is.  
There doesn&#8217;t appear to be a &#8220;squeezeboxserver&#8221;, but installing &#8220;Logitech Media Server&#8221; instead worked perfectly in my case.

You can get it here:

http://downloads.slimdevices.com/nightly/?ver=7.7
