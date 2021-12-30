---
id: 4681
title: "Sublime Text 2 &#8211; rsync on save"
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.cuvedev.net/?p=4681
permalink: /2011/12/sublime-text-2-rsync-on-save/
categories:
  - Development
  - plugin
  - Python
tags:
  - posts
  - background
  - development
  - nfs
  - plugin
  - python
  - remote
  - rsync
  - server
  - sublime
  - subprocess
  - test
  - text
---

As I&#8217;m running an Ubuntu Server in a virtual machine as development test server and I develop on my local environment, I need to keep both repositories in sync.  
Before, I shared the code on the development server to my local environment via NFS. The setup worked, but gave some complications with svn, and the auto mounting of the NFS-share after rebooting. So I started looking for a new way to keep all files in sync. I considered sharing via NFS the other way around, but that would make my test server very slow; all php files need to be loaded through NFS and all assets (images, css, javascript) too.  
The easiest way to solve my problem was through the good old rsync. As I&#8217;m too lazy to run an rsync command every time before I want to load a page from my test-server, I wanted it to be done automatically when I saved a file.  
As Sublime Text 2 is an awesome editor which supports plugins, I started surfing around looking for some examples which I then adapted for my own use..  
This is the plugin I now use:

> import sublime, sublime_plugin, subprocess
>
> class RsyncOnSave(sublime_plugin.EventListener):  
> def on_post_save(self, view):
>
> syncProject = &#8220;&#8221;&#8221;rsync -avz localpath remotepath &&#8221;&#8221;&#8221;  
> subprocess.call([syncProject],shell=True)

This code is put in a file named *RsyncOnSave.py* which is saved a folder named _RsyncOnSave_, in the Packages folder (for OSX thats: _~/Library/Application\ Support/Sublime\ Text\ 2/Packages/_). The plugin should automatically be loaded when you (re-)start Sublime Text.  
localpath and remotepath obviously are the paths in your case. Note the ampersand at the end of the sync command, which makes sure your editor doesn&#8217;t freeze while the command is being executed.

Make sure you&#8217;ve put your public ssh-key in the authorized_keys on your server, so you don&#8217;t have to give your password when rsyncing.
