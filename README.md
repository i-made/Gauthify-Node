GAuthify-Node
===============
[Direct link to library](https://github.com/ajayimade/Gauthify-Node).

This is the Node API Client for [GAuthify](https://www.gauthify.com). The GAuthify REST api helps websites quickly add multi-factor authentication through Google Authenticator, SMS, and Email. This package is a simple wrapper around that api.


Installation
--------------
This library requires and automatically installs requests.

To install through NPM:

    npm install gauthify
    OR
    npm install -g gauthify
    OR
    npm install gauthify@1.1.3 #specific version

To install through GIT:

    npm install git+https://github.com/ajayimade/Gauthify-Node.git
    OR
    npm install git+https://github.com/ajayimade/Gauthify-Node.git#1.1.3 #specific version
    
Usage
--------------
####Initiate:####
First get an API key by signing up for an account [here](http://www.gauthify.com).

First instantiate a GAuthify object:

    var GAuthify = require('gauthify');
    auth_instance = new GAuthify(<api_key>);


####Create User:####

    auth_instance.create_user(<unique_id>, <display_name>, <email>, <sms_number> *optional, <voice_number> *optional, <meta> *optional, function(error, response){
    console.log(response)
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* display_name: Name that will be displayed on the library
* email: A valid email
* sms_number: A valid mobile phone number for sms (Currently US only!)
* voice_number: A valid mobile phone number for Voice calls (Currently US only!)
* meta: A dictionary of key/value pairs to be added to meta data
* callback: The user hash or raises Error

The user hash returned will have parameters outlined on the GAuthify.com dashboard page. You can show the user the QR code to scan in their google authenticator application or you can link/iframe the instructions url.

####Update User:####

    auth_instance.update_user(<unique_id>, <email>*optional, <sms_number> *optional, <meta> *optional, <reset_key> *optional, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* display_name: Name that will be displayed on the library
* sms_number: A valid mobile phone number for sms (Currently US only!)
* voice_number: A valid mobile phone number for voice calls (Currently US only!)
* email: A valid email
* meta: A dictionary of key/value pairs to be added to meta data
* reset_key: If set to any in ['true' ,'t', '1'] the Google Authenticator secret key will be reset to a new one.
* callback: The updated user hash or raises Error


####Delete User:####

    auth_instance.delete_user(<unique_id>, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* callback: True or raises Error

####Get All Users:####

    auth_instance.get_all_users(function(error, response){
    console.log(response);
    });
* callback: List of user hashes

####Get User:####

    auth_instance.get_user(<unique_id>, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* callback: User hash or raises Error

####Get User By Token:####

    auth_instance.get_user_by_token(<token>, function(error, response){
    console.log(response);
    });

* token: A 35 char token that starts with gat given by ezGAuth.
* callback: User hash or raises Error

####Check Auth Code:####

    auth_instance.check_auth(<unique_id>, <auth_code>, <safe_mode> *optional, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* auth_code: Code retrieved from Google Authenticator, SMS, EMail, or OTP
* safe_mode: If set to true , all exceptions during the request will be suppressed and the check will return True. This essentially temporary bypasses 2-factor authentication if there is a unusual server error. Default set to false.
* callback: True/False (bool) or raises Error

####Send Email:####

    auth_instance.send_email(<unique_id>, <email> *optional, <phone_number> *optional, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* email: A valid email
* callback: User hash or raises Error

####Send SMS:####

    auth_instance.send_sms(<unique_id>, <sms_number> *optional, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* sms_number: A valid us phone number for sms(Currently US only!)
* callback: User hash or raises Error

####Send Voice Call:####

    auth_instance.send_voice(<unique_id>, <voice_number> *optional, function(error, response){
    console.log(response);
    });

* unique_id: An id to identify user. Could be the PK used for the user in your db.
* voice_number: A valid us phone number for voice calls (Currently US only!)
* callback: User hash or raises Error



Errors
--------------
Up to-date json formatted errors can be grabbed from the server using:

    auth_instance.api_errors(function(error, response){
    console.log(response);
    });

They should rarely change and will be backward compatible.

The primary error class is GAuthifyError, it can be used as follows:

The following errors extend GAuthifyError:

* ApiKeyError - Wraps 401 responses (api key issues)
* RateLimitError - Wraps 402 responses (Plan limits, etc)
* ParameterError - Wraps 406 response (Bad formatted unique_id, sms, phone number ,etc)
* NotFoundError - Wraps 404 error (requesting a unique_id that doesnt exist)
* ConflictError - Wraps 409 (posting to an existing resource)
* ServerError - Wraps 500 and other server errors
