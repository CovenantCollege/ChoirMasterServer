# sheet-JSON

## Overview

This is a proof of concept that accepts a spreadsheet file
and converts it into readable JSON.

## Getting Started
1. Install [Node.js](https://nodejs.org/en/) \(or `sudo pip3 install node`\) latest version
2. Open sheet-JSON directory in bash
3. Run `node sheet-json.js`
4. Open browser [sheet-JSON](http://localhost:8675/)
5. Upload spreadsheet
 * make sure spreadsheet has an accepted extension
 * spreadsheet contents should be displayed in bash after upload

optional \(but still important\):
* Make sure to delete all files in `uploads` directory after use
 * I am currently researching how to do this
* currently does not store values into db
 * calling correct functions existent in project will enable
* currently does not handle errors elegantly
 * integration with project will fix this
