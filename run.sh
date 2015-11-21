#!/bin/bash

#cp -r public/ ./

npm start &
grunt

# rm -rf app/ assets/ bower_components/ theme/ 404.html index.html humans.txt robots.txt

trap "pkill npm; pkill node;"
