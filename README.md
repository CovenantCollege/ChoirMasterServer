# ChoirMaster Server

[![Build Status](https://travis-ci.org/CovenantCollege/ChoirMasterServer.svg?branch=master)](https://travis-ci.org/CovenantCollege/ChoirMasterServer)
[![Code Climate](https://codeclimate.com/github/CovenantCollege/ChoirMasterServer/badges/gpa.svg)](https://codeclimate.com/github/CovenantCollege/ChoirMasterServer)

## Overview

This is the server repository for Choir Master, a project started by Covenant College to help choir directors arrange their singers.

## Getting Started
1. Install [Node.js](https://nodejs.org/en/) v7.4.0 and clone this git repository
2. Open git bash in the cloned directory and run `npm run setup`
3. Install mysql and run migrations/demo.sql
4. To enable creating users, edit configuration.js and enter your gmail credentials.  You might have to configure your gmail account to [allow less secure apps](https://www.google.com/settings/security/lesssecureapps) and complete the [captcha challenge](https://accounts.google.com/b/0/displayunlockcaptcha)

Once the installation is done, you can run some commands inside the project folder:

### `npm start`

Runs the server.  In order to use the server you'll need to build and run the client as well.  See [ChoirMasterClient](https://github.com/CovenantCollege/ChoirMasterClient) for more details.<br>

### `npm test`

Runs the complete suite of tests that have been written for the server.  We strongly encourage you to write tests for every new feature you write.

### `npm run client:update`

Downloads and compiles the latest client version
