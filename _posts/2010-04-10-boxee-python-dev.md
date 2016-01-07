---
id: 156
title: Boxee python dev
author: Klaas Cuvelier
layout: post
guid: http://www.cuvedev.net/?p=156
permalink: /2010/04/boxee-python-dev/
categories:
  - development
tags:
  - Boxee
  - development
  - dialog
  - error
  - errors
  - import
  - onload
  - python
  - setlabel
  - textbox
---
Boxee may be *&#8220;the best way to enjoy entertainment from the Internet and computer on your TV&#8221;* (according tor <a href="http://www.boxee.tv" target="_blank">their website</a>), the developers documentation isn&#8217;t all that great. Not everything is well-documented and the (python) API doesn&#8217;t always do what&#8217;s expected, which makes developing own plugins not that easy.  
It isn&#8217;t also always possible to find the right solution with Google. Maybe because not all that much people are developing plugins for Boxee (or the don&#8217;t care to share) or because Google doesn&#8217;t index it well.

So I decided to share the things I found. Let&#8217;s hope google indexes them well and I&#8217;m able to help some fellow developers.

**Textbox + SetLabel:**  
If you have a [textbox][1], it is not possible to change the label via python in an easy way.

<pre lang="python">mc.GetActiveWindow().GetLabel([id]).SetLabel('text')</pre>

and

<pre lang="python">mc.GetActiveWindow().GetControl([id]).SetLabel('text')</pre>

don&#8217;t work on a Textbox, and

<pre lang="python">GetTextbox([id])</pre>

doesn&#8217;t exist.  
Setting the label can be done this way:

<pre lang="python">xbmc.executebuiltin('Control.SetLabel([id],[text])')</pre>

and you&#8217;ll have to replace every comma (,) with $COMMA

**Onload-tag with a dialog**  
I&#8217;ve experienced some troubles with the onload-tag in windows with type=&#8221;dialog&#8221;. If you have a *normal* window, and load a dialog-window in a onclick method with this code, the onload of the dialog won&#8217;t work until you close the dialog:

<pre lang="xml"> mc.ActivateWindow(14001) </pre>

The way to solve this is to dump the python code to load the dialog and just do this:

<pre lang="xml">ActivateWindow(14001)</pre>

**Python import gives errors:**

It took me a while to figure out, but this error:

<pre lang="xml">18:54:51 T:2963869696 M:410439680  NOTICE: --&gt;Python Interpreter Initialized&lt;--
18:54:51 T:2963869696 M:410439680  NOTICE: Traceback (most recent call last):
18:54:51 T:2963869696 M:410439680  NOTICE:   File "", line 2, in ?
18:54:51 T:2963869696 M:410439680  NOTICE: ImportError
18:54:51 T:2963869696 M:410439680  NOTICE: :
18:54:51 T:2963869696 M:410439680  NOTICE: No module named xxxxxxx
18:54:51 T:2963869696 M:410439680   ERROR: Scriptresult: Error</pre>

Was caused by a bad window-id. Boxee window-id&#8217;s should be between 14000 and 14099

**Close a window with type=&#8221;dialog&#8221;:**  
If you have opened a window with type=&#8221;dialog&#8221;, it isn&#8217;t possible to close the window with this code:

<pre lang="xml">CloseWindow(14001)</pre>

Instead you have to do this:

<pre lang="xml">Dialog.Close(14001)</pre>

You can also add the &#8220;force&#8221; option (True/False), adding this option will skip all animations.

 [1]: http://developer.boxee.tv/Textbox_Control