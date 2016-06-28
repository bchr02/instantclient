# instantclient v1.0.1
> A Node.js command line tool for downloading and installing Oracle Instant Client Packages (Basic and SDK).

This tool helps to automate the downloading and extracting of the correct Oracle Instant Client Basic and SDK Packages based on the  Operating System and Processor Architecture your running on. You must have an Oracle Account to use it and accept the [OTN Development and Distribution License Agreement for Instant Client](http://www.oracle.com/technetwork/licenses/instant-client-lic-152016.html). This is needed because all of the files come directly from Oracle. You can register for a free account [here](https://profile.oracle.com/myprofile/account/create-account.jspx). 

## Instructions
From the command prompt, navigate to the directory where you would like the instantclient folder placed. Then run ```npm install instantclient```. Finally, just follow the prompts. After the instantclient files are downloaded and extracted the instantclient npm installer is uninstalled. Therefore, you won't have any remnants of it in your node_modules folder.

**For Example:**
```shell
C:\nodeapps\app>npm install instantclient

Would you like to install the Oracle Instant Client files?
Press (Y) to Install, anything else to Cancel? y

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
First, using the above instructions, install the instantclient folder to the root folder of your program. Now just add the following lines to your app in the order provided:
```javascript
var path = require('path');
process.env['PATH'] = path.join(__dirname, '/instantclient') + ';' + process.env['PATH'];
var oracledb = require('oracledb');
```
The above will work to ensure that the instantclient folder appears first in the PATH environment variable every time node-oracledb is being used, ***however, you must set the OCI_LIB_DIR and OCI_INC_DIR environment variables manually in your environment when first installing node-oracledb. This is because they are needed for the compiling of the module.***
