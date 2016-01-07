---
id: 224
title: Boxee on Ubuntu Lucid Minimal on Asrock ION 330
author: Klaas Cuvelier
layout: post
guid: http://www.cuvedev.net/?p=224
permalink: /2010/06/boxee-on-ubuntu-lucid-minimal-on-asrock-ion-330/
categories:
  - Boxee
  - Bugs
  - Cuvedev
  - Linux
  - Ubuntu
tags:
  - 10.4
  - 330
  - asrock
  - Boxee
  - ion
  - lucid
  - minimal
  - modules
  - nvidia
  - nvidia.ko
  - restricted
  - ubuntu
---
<div>
  <p>
    Yesterday I performed a clean install from <a href="http://archive.ubuntu.com/ubuntu/dists/lucid/main/installer-i386/current/images/netboot/mini.iso">Ubuntu Lucid Lynx Minimal</a> on my Asrock Ion 330.<br /> I followed <a href="http://forums.boxee.tv/showthread.php?t=5644">this guide</a> like I did last time (for an earlier version of Ubuntu Minimal) but I encountered some problems.
  </p>
  
  <p>
    Here&#8217;s how I solved them.
  </p>
  
  <p>
    In chapter &#8220;Updating the computer&#8221;, change in the sources.list hardy or intreprid or jaunty by &#8220;lucid&#8221;.<br /> No problems in &#8220;Install sound&#8221;.
  </p>
  
  <p>
    The real problems came in &#8220;Installing the graphical environment&#8221;.<br /> When I wanted to install the latest driver for my <a href="http://uk.download.nvidia.com/XFree86/Linux-x86/256.35/NVIDIA-Linux-x86-256.35.run">ION graphics card</a> I always got this error:
  </p>
  
  <blockquote>
    <p>
      ERROR: Unable to load the kernel module &#8216;nvidia.ko&#8217;. This is most likely<br /> because the kernel module was built using the wrong kernel source files.<br /> Please make sure you have installed the kernel source files for your<br /> kernel; on Red Hat Linux systems, for example, be sure you have the<br /> &#8216;kernel-source&#8217; rpm installed. If you know the correct kernel source<br /> files are installed, you may specify the kernel source path with the<br /> &#8216;&#8211;kernel-source-path&#8217; commandline option.
    </p>
  </blockquote>
  
  <p>
    It took me a while before I found this solution:<br /> Make the file (or edit the file if it already exists)  /etc/default/linux-restricted-modules-common<br /> and add this content:
  </p>
  
  <blockquote>
    <p>
      DISABLED_MODULES=&#8221;nv nvidia_new&#8221;
    </p>
  </blockquote>
  
  <p>
    Now you should be able to run the installer without problems.
  </p>
  
  <p>
    Another small problem was, logging in automatically. In earlier releases of Ubuntu you had to change some commands in /etc/event.d/tty1 (according to the guide mentioned earlier), but in Ubuntu Lucid, the event.d folder doesn&#8217;t exist anymore, and you have to put it in /etc/init/ instead.
  </p>
  
  <p>
    Good Luck!
  </p>
</div>