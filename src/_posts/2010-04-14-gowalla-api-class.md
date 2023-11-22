---
id: 181
title: Gowalla API Class (php)
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.cuvedev.net/?p=181
permalink: /2010/04/gowalla-api-class/
tags:
  - post
  - tech
  - api
  - class
  - gowalla
  - php
---

**Update:** Gowalla has been bought by Facebook and been discontinued.

I just quickly made a class for accessing the <a href="http://gowalla.com/" target="_blank">Gowalla</a> <a href="http://gowalla.com/api/explorer" target="_blank">API</a> because I needed it myself. I looked for an existing class on the internet but could only find some crappy stuff on Google Code.  
So I decided to make one myself.

**The use** of the class is fairly simple. Include the class file (don&#8217;t forget to add you <a href="http://gowalla.com/api/keys" target="_blank">API-key</a>), make an instance and do your calls.  
The class internally uses CURL to do the requests to the server and returns the data as an <a href="http://php.net/manual/en/language.types.array.php" target="_blank">associative array</a>.  
I tried to document the methods enough so it&#8217;s easy to use them.

**Example**:

<pre lang="php"><!--?php
include('./class.gowalla.php');
$gowalla = new GowallaAPI();
$events	 = $gowalla--->getSpotEvents(846403);
foreach ($events['activity'] as $event)
{ // do stuff }
?&gt;</pre>

[Download it here](/public/2010/04/gowalla.zip)
