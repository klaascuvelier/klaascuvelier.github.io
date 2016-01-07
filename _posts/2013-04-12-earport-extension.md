---
id: 4954
title: 'Earport.fm drag &#8216;n drop extension'
author: Klaas Cuvelier
layout: post
guid: http://www.klaascuvelier.be/?p=4954
permalink: /2013/04/earport-extension/
categories:
  - Cuvedev
---
For people who don&#8217;t know <a href="http://www.earport.fm" target="_blank">Earport</a>, it is a service to listen to music together.

**Short**: Members can create their own &#8220;music room&#8221; and create a playlist. All people joining (other members, friends, colleagues, &#8230;) will be hearing the same music at the same time.

![Screenshot of Earport](/public/2013/04/earport.png)

I use the service from time to time, but it takes some time to create a nice, big playlist. Also, I have some playlists on my computer, I didn&#8217;t like it that I had to recreate them on another service.  
So I came up with to idea to drag an existing playlist (m3u-file) or a list of mp3 files on the Earport window, and let a script automatically add all tracks to the playlist.

The script is on <a href="https://gist.github.com/klaascuvelier/5370520#file-earport-extension-js" target="_blank">GitHub</a> (source below)

&nbsp;

**Bookmarklet:**  
You can, for the ease of use, put the code below in a bookmark, to use the script as a bookmarklet:  
Url:

<pre>javascript:(function(){var k=$(''),c=$("body"),d=[],j=[];c.append('');Earport.Api.socket.on("search.query",e);Earport.Api.socket.on("playlist.queue",h);k.on("dragleave",function(l){k.remove()});c.on("dragenter dragover",function(l){l.preventDefault();l.stopPropagation();var m=l.dataTransfer?l.dataTransfer:l.originalEvent.dataTransfer;if(!m||$.inArray("Files",m.types)0){a()}return}var l=j.pop(),m=void 0;if(l){m=l.type;if(m==="audio/mp3"){i(l)}else{if(m==="audio/x-mpegurl"){g(l)}else{if(!!window.console){console.log("unsupported type "+m);f()}}}}}function g(m){var l=new FileReader();l.onload=function(r){var p=this.result.split("\n"),o=p.length,n=void 0,q=void 0;for(q=0;q1){useFilename=n.substr(0,1)!=="#";if(!useFilename){try{info=n.split(",")[1].split("-");b(info[0],info[1]);q++}catch(r){n=p[++q]}}if(useFilename){filename=n.substr(0,n.lastIndexOf("."));song=filename.replace(/[0-9\-_\.]/gi," ").replace(/  /g," ");b("",song)}}}f()};l.onerror=function(n){f()};l.readAsText(m)}function i(m){var l=new FileReader();l.onload=function(r){var p=new jDataView(this.result);if(p.getString(3,p.byteLength-128)=="TAG"){var s=p.getString(30,p.tell()),n=p.getString(30,p.tell()),o=p.getString(30,p.tell()),q=p.getString(4,p.tell());b(n,s,o)}else{console.log("could not parse")}f()};l.onerror=function(n){f()};l.readAsArrayBuffer(m)}function b(n,t,p){var r=$.trim([n,t,p].join(" ")),s=r.split("\u0000"),o=s.length,q=void 0,m="";for(q=0;q0){m+=s[q]}}d.push(m)}function a(){if(d.length===0){return}var l=d.pop();if(!!l){console.log("finding song "+l);Earport.Api.socket.emit("search.query",{query:l})}a()}function e(m){if(m&&m.results&&m.results.length){var l=m.results[0];Earport.Api.socket.emit("playlist.queue",{track:l})}}function h(l){}})();</pre>

&nbsp;

**Source:**  
[earport-extension.js on Github](https://gist.github.com/klaascuvelier/5370520)
