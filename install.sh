#!/bin/bash

npm install -g grunt grunt-cli bower
npm install
bower install

ln -s bower_components/bootstrap/less/ theme/
