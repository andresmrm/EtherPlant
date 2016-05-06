**Check a much more ergonomic version [here](https://github.com/Orange-OpenSource/EtherPlant)!**

EtherPlant
==========

A fork of the projet https://github.com/andresmrm/EtherPlant : A simple web page to code in [Etherpad](http://etherpad.org) and visualize in [PlantUML](http://plantuml.com).

#### Use

You can test it here:

http://orange-opensource.github.io/EtherPlant/src/index.html

Add "?" and a link to a pad in the end of the url, like:

http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/etherplant

Changing the last word in the link you can change the pad! =D

http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/mypersonalplantuml

https://orange-opensource.github.io/EtherPlant/src/?https://annuel.framapad.org/p/plantuml

#### Install

Just serve the files in the folder **src** via an HTTP server.

#### Architecture

Diagram made by Andrés Martano (https://github.com/andresmrm) to try to show the architecture of EtherPlant:
http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/etherplant-architecture

#### Updates from original project

* Use jquery layout for GUI : http://layout.jquery-dev.com/ (panels can be resized or hidden)
* Add zoom support in diagram with mouse wheel
* Use single menu bar to load pad and get links for diagram
* Add item to set auto-refresh configuration in menu bar

#### Warning

The code is not big, but was made in a few hours, so it's not good to look at... Feel free to submit patches.

#### The same idea for Remark.js

The project [EtheRemark](http://github.com/Orange-OpenSource/EtheRemark) allow you to create collaborative slideshow with Remark.js.

