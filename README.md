# instantclient v0.0.2
> A Node.js command line tool for downloading and installing Oracle Instant Client Packages (Basic and SDK).

This tool helps to automate the downloading and extracting of the Oracle Instant Client Basic and SDK Packages. You must have an Oracle Account to use it and accept the [OTN Development and Distribution License Agreement for Instant Client](http://www.oracle.com/technetwork/licenses/instant-client-lic-152016.html). This is needed because all of the files come directly from Oracle. You can register for a free account [here](https://profile.oracle.com/myprofile/account/create-account.jspx). 

## Install
```shell
npm install -g instantclient
```

## Instructions
From the command prompt, navigate to the directory where you would like the instantclient folder placed and run ```instantclient```. Now just follow the prompts.

## Alternative Setup
If you wish, you could set this command line tool to automatically install by editing the scripts object of your package.json to include a preinstall section like so:
```shell
"scripts": {
  "preinstall": "npm i -g instantclient"
}
```
This could be useful if you wish to automatically give people this tool upon installation of your own program.
