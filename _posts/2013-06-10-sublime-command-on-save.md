---
id: 5014
title: Sublime Command-on-Save
author: Klaas Cuvelier
layout: post
guid: http://www.klaascuvelier.be/?p=5014
permalink: /2013/06/sublime-command-on-save/
categories:
  - Development
  - plugin
  - SublimeText
---
I just finished my Sublime Text 3 plugin: Command on Save.  
It executes given commands when you save files. From rsyncing to an other machine, pushing to GIT or generating documentation, everything is possible.

Just install the plugin in Sublime Text 3, configure some commands and you&#8217;re good to go.  
The easiest way to install the plugin is via Sublime Package Control by adding  
[https://github.com/klaascuvelier/SublimeCommandOnSave](https://github.com/klaascuvelier/SublimeCommandOnSave) as a new repository and installing the plugin &#8220;CommandOnSave&#8221;.  
Alternatively you can just clone the repository into your Sublime Text Packages folder.

Setting up a settings file is pretty straight forward. All you have to do is add a &#8220;commands&#8221; entry, with the paths you want to execute commands for and the commands themselves (in an array).  
Here are some examples:

<pre>{
  "commands": {
    // example 1: project is in folder /Users/klaascuvelier/Projects/example/
    // rsync files to other server on save
    "/Users/klaascuvelier/Projects/example/": [
        "rsync -avz /Users/klaascuvelier/Projects/example/ server@server:/home/server/projects/example/ &#038;"
    ],

    // example 2:
    // just run a bash script on save (you can put much more commands in there)
    "/Users/klaascuvelier/Projects/example2/": [
        "/Users/klaascuvelier/Projects/example2/command.sh &#038;"
    ],

    "/Users/klaascuvelier/Projects/Sublime3/SublimeCommandOnSave/": [
        "echo 'hi'",
        "echo 'aloha'"
    ]
  }
}
</pre>

Feel free to fork and improve, or contact me if you need any help

*Note*: this version is not compatible with Sublime Text 2, I do have an older version of this plugin available here: [ST2-CommandOnSave][1]. But that plugin is not longer maintained.

 [1]: https://github.com/klaascuvelier/ST2-CommandOnSave