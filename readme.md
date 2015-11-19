# Forge UX

The aim of this project is to provide a centralized repository for Forge's user interface.


## Install

You'll need node.js of course. As this guide is for **OSX only**, here is the command using homebrew:

	$ brew install node

Make sure you are in the top level directory and run

	$ ./install.sh

To install everything.

## Run

	$ ./run.sh

Closing run will automatically kill the sub processes. If they don't die for whatever reason, use

	$ pkill npm; pkill node

To get rid of the background processes.


## Todos

* Get reporting page to a presentable and configurable state
* Integrate Forge UX as submodule and kill old frontend
* New forge theme (Rara)
* Test capabilities (in particular <video>, <canvas>, and <audio>) with QtWebkit.
