#!/bin/bash

npm start &
grunt

trap "pkill npm; pkill node"
