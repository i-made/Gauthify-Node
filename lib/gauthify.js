var request = require('request');
var util = require('util');
var status_code;

function BaseError(message, error_code) {
  this.message = message;
  this.error_code = error_code;
  this.name = this.constructor.name;
  Error.captureStackTrace(this, this.constructor);
}


function ApiKeyError(message, error_code) {
  ApiKeyError.super_.call(this, message, error_code);
}
util.inherits(ApiKeyError, BaseError);


function RateLimitError(message, error_code) {
  RateLimitError.super_.call(this, message, error_code);
}
util.inherits(RateLimitError, BaseError);


function ParameterError(message, error_code) {
  ParameterError.super_.call(this, message, error_code);
}
util.inherits(ParameterError, BaseError);


function NotFoundError(message, error_code) {
  NotFoundError.super_.call(this, message, error_code);
}
util.inherits(NotFoundError, BaseError);


function ConflictError(message, error_code) {
  ConflictError.super_.call(this, message, error_code);
}
util.inherits(ConflictError, BaseError);

function ServerError(message, error_code) {
  ServerError.super_.call(this, message, error_code);
}
util.inherits(ServerError, BaseError);


function GAuthify(api_key){
  var headers = {
    'Authorization':util.format('Basic %s', new Buffer(util.format(':%s', api_key)).toString('base64')),
    'User-Agent': 'GAuthify-Node/1.0'};
  var access_points = [
    'https://alpha.gauthify.com/v1/',
    'https://beta.gauthify.com/v1/'];
  var ERROR_CODES = [401, 402, 406,404, 409];
  this.request_handler = function(type, url_addon, params, callback){
    if (typeof params === 'function') {
      callback = params;
      params = null;
    }
    var req = function(x){
      if (x == 2)
        throw new ServerError("Communication error with all access points. Please contact 'imadeajay@gmail.com' for help.", 500);
      var req_url = access_points[x] + url_addon;
      if( x < access_points.length) {
        request({url: req_url, method: type, json: true, qs: params, body: params, headers:headers, timeout: 5000},
          function (error, response, body) {
            if(error)
              return req(x + 1);
            status_code = response.statusCode;
            if(!(body instanceof Object) || (status_code > 400 && !(ERROR_CODES.indexOf(status_code) > -1))){
              return req(x + 1);
            }
            else{
              if(status_code == 401)
                throw new ApiKeyError(body.error_message, status_code);
              else if(status_code == 402)
                throw new RateLimitError(body.error_message, status_code);
              else if(status_code == 404)
                throw new NotFoundError(body.error_message, status_code);
              else if(status_code == 406)
                throw new ParameterError(body.error_message, status_code);
              else if(status_code == 409)
                throw new ConflictError(body.error_message, status_code);
              callback(body.data);
            }
          });
        }
      };
      req(0);
    };

  this.create_user= function(unique_id, display_name, email, sms_number, voice_number, meta, callback){
    var url_addon = "users/";
    if (arguments.length<3)
      throw new Error("Atleast 3 arguments required `<unique_id>, <display_name>, <email>`");
    var last_arg = arguments[(Object.keys(arguments).length - 1).toString()];
    callback = typeof last_arg == 'function' ? last_arg : function(){};
    var params = {'unique_id': unique_id, 'display_name': display_name, email: email};
    if(sms_number) params.sms_number = sms_number;
    if(voice_number) params.voice_number = voice_number;
    if(meta) params.meta = JSON.stringify(meta);
    this.request_handler('POST', url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.update_user = function(unique_id, email, sms_number, voice_number, meta, reset_key, callback){
    if (arguments.length<1)
      throw new Error("Atleast `<unique_id>` required to update user information");
    var last_arg = arguments[(Object.keys(arguments).length - 1).toString()];
    callback = typeof last_arg == 'function' ? last_arg : function(){};
    var params = {};
    if(email) params.email = email;
    if(sms_number) params.sms_number = sms_number;
    if(voice_number) params.voice_number = voice_number;
    if(meta) params.meta = JSON.stringify(meta);
    if(reset_key) params.reset_key = true;
    var url_addon = util.format("users/%s/", unique_id);
    this.request_handler('PUT', url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.delete_user = function(unique_id, callback){
    if (arguments.length<1)
      throw new Error("Required `<unique_id>` to delete user");
    var url_addon = util.format("users/%s/", unique_id);
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler('DELETE', url_addon, function(resp){
      callback(resp);
    });
  };

  this.get_user = function(unique_id, callback){
    if (arguments.length<1)
      throw new Error("Required `<unique_id>` to get user info");
    var url_addon = util.format("users/%s/", unique_id);
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler('GET', url_addon, function(resp){
      callback(resp);
    });
  };

  this.get_all_users = function(callback){
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler("GET", 'users/', function(resp){
      callback(resp);
    });
  };

  this.send_email = function(unique_id, email, callback){
    if (arguments.length<1)
      throw new Error("Atleast `<unique_id>` to send email ");
    if(typeof email =='function'){
      callback = email;
      email = null;
    }
    var url_addon = "email/";
    // var url_addon = "email/", unique_id);
    var params = {'unique_id': unique_id};
    if(email) params.email = email;
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler("post", url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.send_sms = function(unique_id, sms_number, callback){
    if (arguments.length<1)
      throw new Error("Atleast `<unique_id>` to send opt on mobile");
    if(typeof sms_number =='function'){
      callback = sms_number;
      sms_number = null;
    }
    var url_addon = "sms/";
    // var url_addon = "sms/", unique_id);
    var params = {'unique_id': unique_id};
    if(sms_number) params.sms_number = sms_number;
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler("post", url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.send_voice = function(unique_id, voice_number, callback){
    if (arguments.length<1)
      throw new Error("Atleast `<unique_id>` to calls voice_number with the one time auth_code");
    if(typeof voice_number =='function'){
      callback = voice_number;
      voice_number = null;
    }
    var url_addon = "voice/";
    // var url_addon = "voice/", unique_id);
    var params = {'unique_id': unique_id};
    if(voice_number) params.voice_number = voice_number;
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler("post", url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.get_user_by_token = function(token, callback){
    if (arguments.length<1)
      throw new Error("Required `<token>` to get user info");
    var url_addon = "token/";
    var params = {'token': token};
    callback = typeof callback == 'function' ? callback : function(){};
    this.request_handler('post', url_addon, params, function(resp){
      callback(resp);
    });
  };

  this.check_auth = function(unique_id, auth_code, safe_mode, callback){
    var url_addon = 'check/';
    if (arguments.length<2)
      throw new Error("Required 2 arguments `<unique_id>` <auth_code> to verify 2FA");
    if(typeof safe_mode =='function'){
      callback = safe_mode;
      safe_mode = false;
    }
    callback = typeof callback == 'function' ? callback : function(){};
    var params = {'auth_code': auth_code, 'unique_id': unique_id};
    try{
      this.request_handler('POST', url_addon, params, function(resp){
        callback(resp.authenticated);
      });
    }
    catch(err){
      if(safe_mode)
        callback(true);
      else
        throw err;
      }
  };

  this.api_errors = function(callback){
    callback = typeof callback == 'function' ? callback : function(){};
    var url_addon = "errors/";
    this.request_handler('GET', url_addon, function(resp){
      callback(resp);
    });
  };

}

module.exports=GAuthify;
