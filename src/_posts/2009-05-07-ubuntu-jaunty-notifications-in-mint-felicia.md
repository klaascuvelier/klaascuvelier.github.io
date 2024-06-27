---
id: 89
title: Ubuntu Jaunty notifications in Mint (Felicia)
author: Klaas Cuvelier
layout: layouts/post.njk
guid: http://www.cuvedev.net/?p=89
permalink: /2009/05/ubuntu-jaunty-notifications-in-mint-felicia/
tags:
    - post
    - tech
    - felicia
    - linux
    - mint
    - notification
    - notify-osd
    - popup
---

As some of you might already have seen, Ubuntu Jaunty Jackalope has a new popup notifier, called &#8216;notify osd&#8217;.  
It looks, in my opinion, much like Mac OS X&#8217;s Growl which I like very much (I&#8217;ve been using OS X for over 3 months now at Netlog NV) so I decided to try and install it on my Mint desktop and laptop at home.  
Apparently some people already managed to install it in Ubuntu Intrepid and because Mint Felicia is based on Intrepid, I thought it would be a peace of cake following their instructions. Turned out it wasn&#8217;t. I had to install much more stuff to get it working and that&#8217;s why I&#8217;d like to share it.

First of all, these instructions below are based on two tutorials I found using Google, namely http://www.stefanoforenza.com/how-to-get-the-new-notifications-on-intrepid/ and http://blog.alexrybicki.com/2009/02/how-to-install-notify-osd-in-intrepid.html. Also, this is what I had to do to get it working, it is possible this won&#8217;t work for you.

So, let&#8217;s get started.  
First of all, you&#8217;ll have to install a bunch of needed files:

<p style="font-family: monospace; font-size: 11px">
  $ sudo apt-get install bzr gnome-common automake gconf2 libgconf2-4 libgconf2-dev libdbus-glib-1-dev libwnck-dev mono-gmcs libnotify-dev
</p>

The package bzr (short for &#8216;bazaar&#8217;) is needed to get the source from launchpad.  
Next step is actually getting the source:

<p style="font-family: monospace; font-size: 11px">
  $ bzr branch lp:notify-osd
</p>

Just to make sure you have it right, LP, first char is an &#8216;L&#8217; ;-)  
Before we can start compiling, we&#8217;ll have to fix something (I had to do it, not sure you&#8217;ll need to):  
To successfully complete the build, the command &#8216;gmcs&#8217; is needed. As you might have noticed, we installed the packet above, but for me that wasn&#8217;t enough. Apparently installing that package creates a file in /usr/bin named &#8216;gmcs2&#8242; instead of just &#8216;gmcs&#8217;.  
I fixed this by making a softlink:

<p style="font-family: monospace; font-size: 11px">
  $ sudo ln -s /usr/bin/gmcs2 /usr/bin/gmcs
</p>

So, we can start compiling now, as always, first run the &#8216;autogen&#8217; script followed by the &#8216;make&#8217; command:

<p style="font-family: monospace; font-size: 11px">
  $ cd ~/notify-osd<br /> $ ./autogen.sh<br /> $ ./make
</p>

If you have errors, it&#8217;s probably a dependencies problem, on both of the mentioned sites above they advised to make install some more packes:

<p style="font-family: monospace; font-size: 11px">
  $ sudo apt-get install libc6 libcairo2 libdbus-1-3 libdbus-glib-1-2 libgconf2-4 libglib2.0-0 libgtk2.0-0 libpango1.0-0 libpixman-1-0 libx11-6
</p>

Installing above packets wasn&#8217;t necessary for my, but it might be for you.  
So, when you don&#8217;t have any errors (anymore) it means your build was successful, and so you can start using the new notification pop-ups.  
First of all, you&#8217;ll have to end the current notifier and then you&#8217;ll be able to start notify-osd like this:

<p style="font-family: monospace; font-size: 11px">
  $ killall notification-daemon<br /> $ cd src<br /> $ ./notify-osd
</p>

Now to the check out your new notifier, you can run the test script in the same directory (you&#8217;ll have to open a new tab because notify-osd is still running):

<p style="font-family: monospace; font-size: 11px">
  $ ./send-test-notification.sh
</p>

This show a whole bunch of nice pop-ups, demonstrating the possibilities of notify-osd.

Just like me, you might like this notifier very much, and you&#8217;d like to have this running the next time you start up you&#8217;re machine.  
As we didn&#8217;t make any permanent changes to the system, and the default notifier will be started when you restarted your system, we&#8217;ll have to write a little script to fix this:

<p style="font-family: monospace; font-size: 11px">
  $ touch ~/notify-osd/startup.sh<br /> $ nano ~/notify-osd/startup.sh
</p>

Using the editor (nano) add these lines to the file:

<p style="font-family: monospace; font-size: 11px">
  #!/bin/bash<br /> killall notification-daemon<br /> sleep 1<br /> ~/notify-osd/src/notify-osd
</p>

<p style="font-family: monospace; font-size: 11px">
  Now all you have to do is make the script runnable and add the script to you&#8217;re startup scripts in ~/.config/startup:
</p>

<p style="font-family: monospace; font-size: 11px">
  $ sudo chmod a+x ~/notify-osd/startup.sh<br /> $ touch ~/.config/startup/notify-osd.desktop<br /> $ nano ~/.config/startup/notify-osd.desktop
</p>

This what you should put in the file (replace [USER] with your username):

<p style="font-family: monospace; font-size: 11px">
  Type=Application<br /> Name=notify-osd<br /> Exec=/home/[USER]/.config/autostart/notify-osd.sh<br /> Icon=system-run<br /> Comment=<br /> X-GNOME-Autostart-enabled=tru
</p>

This worked out for me, I hope it does for you too!
