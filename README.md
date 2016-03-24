# instantclient v0.0.3
> A Node.js command line tool for downloading and installing Oracle Instant Client Packages (Basic and SDK).

This tool helps to automate the downloading and extracting of the correct Oracle Instant Client Basic and SDK Packages based on the  Operating System and Processor Architecture your running on. You must have an Oracle Account to use it and accept the [OTN Development and Distribution License Agreement for Instant Client](http://www.oracle.com/technetwork/licenses/instant-client-lic-152016.html). This is needed because all of the files come directly from Oracle. You can register for a free account [here](https://profile.oracle.com/myprofile/account/create-account.jspx). 

## Install
```shell
npm install -g instantclient
```

## Instructions
From the command prompt, navigate to the directory where you would like the instantclient folder placed and run ```instantclient```. Now just follow the prompts.

**For Example:**
```shell
C:\nodeapps\app>instantclient

You must accept the OTN Development and Distribution License Agreement for Instant Client to download this software.
URL to Agreement: http://www.oracle.com/technetwork/licenses/instant-client-lic-152016.html
Press (Y) to Accept the License Agreement, anything else to Cancel? y

You must have an Oracle Account to continue.
You can register for a free account here: https://profile.oracle.com/myprofile/account/create-account.jspx
Please enter your username: youemailaddress@email.com
Please enter your password: xxxxxxxxx
Directory (instantclient) created.
instantclient-sdk-nt-12.1.0.2.0.zip downloaded - 2 MB
instantclient-sdk-nt-12.1.0.2.0.zip extracted
instantclient-sdk-nt-12.1.0.2.0.zip deleted
instantclient-basic-nt-12.1.0.2.0.zip downloaded - 64 MB
instantclient-basic-nt-12.1.0.2.0.zip extracted
instantclient-basic-nt-12.1.0.2.0.zip deleted
```

## Bootstrap for node-oracledb
First, using the above instructions, install the instantclient folder to the root folder of your program. Now just add the following four lines to your app:
```javascript
process.env['ORACLE_HOME'] = path.join(__dirname, '../instantclient');
process.env['OCI_LIB_DIR'] = path.join(process.env.ORACLE_HOME, '/sdk/lib/msvc');
process.env['OCI_INC_DIR'] = path.join(process.env.ORACLE_HOME, '/sdk/sdk/include');
process.env['PATH'] = process.env.ORACLE_HOME + ';' + process.env['PATH'];
```

## Alternative Setup
If you wish, you could set this command line tool to automatically install by editing the scripts object of your package.json to include a preinstall section like so:
```shell
"scripts": {
  "preinstall": "npm i -g instantclient"
}
```
This could be useful if you wish to automatically give people this tool upon installation of your own program.
