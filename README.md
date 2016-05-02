EtherPlant
==========

A fork of the projet https://github.com/andresmrm/EtherPlant : A simple web page to code in [Etherpad](http://etherpad.org) and visualize in [PlantUML](http://plantuml.com).

#### Use

You can test it here:

http://andresmrm.github.io/EtherPlant/src/etherplant.html

Add "?" and a link to a pad in the end of the url, like:

http://andresmrm.github.io/EtherPlant/src/etherplant.html?https://pad.okfn.org/p/etherplant

Changining the last word in the link you can change the pad! =D

http://andresmrm.github.io/EtherPlant/src/etherplant.html?https://pad.okfn.org/p/mypersonalplantuml

#### Install

Just serve the files in the folder **src** via an HTTP server.

#### Architecture

I'm no good at UML, but I made a diagram to try to show the architecture of EtherPlant:
http://andresmrm.github.io/EtherPlant/src/etherplant.html?https://pad.okfn.org/p/etherplant-architecture

#### Updates from original project

* Use jquery layout for GUI : http://layout.jquery-dev.com/ (panels can be resized or hidden)
* Add zoom support in diagram with mouse wheel
* Use single menu bar to load pad and get links for diagram
* Add item to set auto-refresh configuration in menu bar

#### Warning

The code is not big, but was made in a few hours, so it's not good to look at... Feel free to submit patches.

