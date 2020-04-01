#!/bin/bash

git pull

npm install

npm start | tee -a output.log