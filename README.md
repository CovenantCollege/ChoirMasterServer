# ChoirMaster Server

## Overview
This is the server repository for Choir Master, a project started by Covenant College to help choir directors arrange their singers.

## Getting Started
1. Clone the git repository.
2. Install [Node.js](https://nodejs.org/en/) v7.4.0.
3. Open a command prompt in the cloned directory and run `npm install`.
4. In the same command prompt run `npm install -g mocha eslint`.
5. Make a copy of `configuration.example.js` named `configuration.js` and fill in the credentials for your database server.

Once the installation is done, you can run some commands inside the project folder:

### `npm start`

Runs the server.  In order to use the server you'll need to build and run the client as well.  See [ChoirMasterClient](https://github.com/CovenantCollege/ChoirMasterClient) for more details.<br>

### `npm test`

Runs the complete suite of tests that have been written for the server.  We strongly encourage you to write tests for every new feature you write.
