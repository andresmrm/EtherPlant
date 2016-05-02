EtherPlant
==========

A fork of the projet https://github.com/andresmrm/EtherPlant : A simple web page to code in [Etherpad](http://etherpad.org) and visualize in [PlantUML](http://plantuml.com).

#### Use

You can test it here:

http://orange-opensource.github.io/EtherPlant/src/index.html

Add "?" and a link to a pad in the end of the url, like:

http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/etherplant

Changining the last word in the link you can change the pad! =D

http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/mypersonalplantuml

https://orange-opensource.github.io/EtherPlant/src/?https://annuel.framapad.org/p/plantuml

https://orange-opensource.github.io/EtherPlant/src/?https://annuel.framapad.org/p/r.d3e8f95fbc4485399e90101b07b08a63

#### Install

Just serve the files in the folder **src** via an HTTP server.

#### Architecture

I'm no good at UML, but I made a diagram to try to show the architecture of EtherPlant:
http://orange-opensource.github.io/EtherPlant/src/index.html?https://pad.okfn.org/p/etherplant-architecture

#### Updates from original project

* Use jquery layout for GUI : http://layout.jquery-dev.com/ (panels can be resized or hidden)
* Add zoom support in diagram with mouse wheel
* Use single menu bar to load pad and get links for diagram
* Add item to set auto-refresh configuration in menu bar

#### Warning

The code is not big, but was made in a few hours, so it's not good to look at... Feel free to submit patches.

