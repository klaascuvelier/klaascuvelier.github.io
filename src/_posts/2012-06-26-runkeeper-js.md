---
id: 4872
title: Runkeeper.js
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.cuvedev.net/?p=4872
permalink: /2012/06/runkeeper-js/
tags:
    - post
    - tech
    - data
    - database
    - export
    - gpx
    - ios
    - IOS6
    - node
    - Runkeeper
    - sqlite
    - trip
---

This is a NodeJS script I wrote to export data (trips) from the <a title="Runkeeper" href="http://www.runkeeper.com/" target="_blank">Runkeeper</a> (iOS)database file.  
I originally wrote this, because I couldn&#8217;t sync my trips anymore since I&#8217;m using IOS6 beta.

The Runkeeper data is stored in an SQLite file on the device, so it was pretty easy to write a script to export data and put it into <a title="GPX" href="http://www.topografix.com/gpx.asp" target="_blank">GPX</a> format.  
The script can list all trips in the database, and export a specified trip to GPX. You can either print the data in the console (and pipe, grep, awk whatever with it) or you can specify a path to write the output to.

Source and usage can be found here at Github: <a title="klaascuvelier/runkeeper.js" href="https://github.com/klaascuvelier/runkeeper.js" target="_blank">klaascuvelier/runkeeper.js</a>

&nbsp;

**Update**: since the last update of the RunKeeper app, this problem is solved.  
But feel free to keep using the code to export data from the RunKeeper db on your iPhone
