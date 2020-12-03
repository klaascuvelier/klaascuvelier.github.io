---
id: 4771
title: "Sublime Text 2 &#8211; Command on Save"
author: Klaas Cuvelier
layout: layouts/post.njk
permalink: /2012/02/sublime-text-2-command-on-save/
categories:
  - Cuvedev
tags:
  - posts
---

This is a plugin based on the one I wrote here: [sublime-text2-rsync-on-save][1]  
The problem with the rsync-on-save plugin, is that it doesn&#8217;t support project specific rsync commands, mainly because Sublime Text doesn&#8217;t support project specific settings for packages.

In this plugin I worked around it in a certain way. I created a  plugin which executes a command based on the folder path.  
The path-command mapping is stored in a settings file, so it can be edited from  within Sublime Text 2.

I put the project on GitHub, so to install it, [clone this repository][2] into your packages folder.

There are some examples of path-command mapping in the settings file, and FYI, this is how my settings file looks:

<div style="width: 90%; overflow: auto">
  <pre>{
  "commands": [
    "/Users/klaascuvelier/Projects/showpad/cms/::/Users/klaascuvelier/Projects/showpad/cms/commandonsave.sh &",
    "/Users/klaascuvelier/Projects/showpad/presentation/::/Users/klaascuvelier/Projects/showpad/presentation/commandonsave.sh &",
    "/Users/klaascuvelier/Projects/showpad/dashboard/::/Users/klaascuvelier/Projects/showpad/dashboard/commandonsave.sh &",
    "/Users/klaascuvelier/Projects/showpad/support/::/Users/klaascuvelier/Projects/showpad/support/commandonsave.sh &"
  ]
}</pre>
</div>

[1]: /2011/12/sublime-text-2-rsync-on-save/
[2]: https://github.com/klaascuvelier/ST2-CommandOnSave
