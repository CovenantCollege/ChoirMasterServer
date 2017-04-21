# sheet-JSON

## Overview

This is a proof of concept that accepts a spreadsheet file
and converts it into readable JSON.

### Spreadsheet requirements
* File must have extension: `.ods | .xml | .xls | .xlsx`
* Choir name will be based off of the sheet name
* File name and sheet name should be the same
* Row 1 contains singer attribute labels
* Following rows contain singer specific attributes, correlating to row 1

### Running the app
1. Install [Node.js](https://nodejs.org/en/) \(or `sudo pip3 install node`\) latest version
2. Open sheet-JSON directory in bash
3. Run `node sheet-json.js`
4. Open browser [sheet-JSON](http://localhost:8675/)
5. Upload spreadsheet
  * Make sure spreadsheet has an accepted extension
  * Spreadsheet contents should be displayed in bash after upload

#### Notice
* Make sure to delete all files in `uploads` directory after use
* Currently does not store values into db
* Currently does not handle errors elegantly

#### Planned changes
* Make downloadable default template
* Change convention to: choir equivalent to sheet; and organization to workbook \(file\)
* Integrate with Choirmaster project
* Handle errors elegantly
* Automatically clean uploads/ directory after use