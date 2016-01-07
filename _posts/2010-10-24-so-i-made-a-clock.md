---
id: 3776
title: So, I made a clock
author: Klaas Cuvelier
layout: post
guid: http://www.cuvedev.net/?p=3776
permalink: /2010/10/so-i-made-a-clock/
categories:
  - development
tags:
  - analog
  - clock
  - digit
  - html
  - javascript
---
So yes, I made a clock. In JavaScript (and HTML).  
It&#8217;s not just another JavaScript analog or digital clock, it&#8217;s actually a clock which is easy to read and it&#8217;s based on this design: <a href="http://www.qlocktwo.com/index.php?lang=en" target="_blank">QLOCKTWO by Biegert&Funk</a>.

I think it&#8217;s a cool way to display time. When I considered buying the clock, I was shocked when I saw the price. So I though it would be a nice challenge to make it myself, in JavaScript.

Here is the result:  
![Screenshot of the clock](/public/2010/10/clock.png)

And you can <a href="http://www.cuvedev.net/whattimeisit" target="_blank">see it in action here</a>.

I am in particular proud of the <a href="http://www.cuvedev.net/whattimeisit/clock.js" target="_blank">JavaScipt code</a>. 
The clock is &#8220;built&#8221; with text predefined text strings, and right strings are highlighted using a &#8220;logic&#8221; for the selected language. In this way it is fairly easy to add new languages (at this time only Dutch and English are available). I used the PrototypJS-library because I&#8217;m used to it, and it shortened my code drastically.


Update:  
And this is what it looks like on an iPad:  
![Photo of the clock on an iPad](/public/2010/10/clock-ipad.jpg)
  
still pretty expensive for &#8220;just a clock&#8221;, but already cheaper than the qlocktwo.
