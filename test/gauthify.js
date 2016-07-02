var GAuthify = require('../lib/gauthify.js');
var chai = require("chai");
var assert = chai.assert;
global.user_info;
global.timeout_val = 30000;

before(function(){
  api_key = "<api key>";
  gauthify = new GAuthify(api_key);
  account_name = email = 'imadeajay@gmail.com';
  sms_number = voice_number = '9168135913';
});


describe('Gauthify module testSuites', function() {

  it('Testing Creating a User', function(done) {
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.create_user(account_name, account_name,
      email='imadeajay@gmail.com',sms_number=sms_number, voice_number=voice_number, function(res){
        assert.equal(res.unique_id, account_name, "Account unique_id not same");
        assert.equal(res.display_name, account_name, "Account display_name not same");
        assert.equal(res.email, email, "Account email id not same");
        assert.equal(res.sms_number, '+1' + sms_number, "Account sms_number not same");
        assert.equal(res.voice_number, '+1' + voice_number, "Account voice_number not same");
        done();
      });
  });

  it('Retrieving User by unique_id', function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.get_user(account_name, function(res){
      user_info=res;
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.unique_id, account_name, "Account unique_id not same");
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.email, email, "Account email id not same");
      assert.equal(res.sms_number, '+1' + sms_number, "Account sms_number not same");
      assert.equal(res.voice_number, '+1' + voice_number, "Account voice_number not same");
      done();
    });
  });

  it('Retrieving User by token', function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.get_user_by_token("account_name", function(res){
      assert.throws(res, "NotFoundError", "token not found.");
      done();
    });
  });


  it('Retrieving All Users', function(done){
    this.timeout(timeout_val);
   setTimeout(done, timeout_val);
    gauthify.get_all_users(function(res){
      assert.instanceOf(res, Array, 'response is not a array of users');
      assert.isAbove(res.length, 0, 'Error:response is not a array of users is empty');
      done();
    });
  });

  it("Checking wrong auth code", function(done){
    gauthify.check_auth(account_name, "123456", function(res){
      assert.equal(typeof(res), 'boolean', "response has not boolean type");
      assert.equal(res, false, "return true for worng otp");
      done();
    });
  });

  it("Testing correct auth code",function(done){
    gauthify.check_auth(account_name, user_info.otp, function(res){
      assert.equal(typeof(res), 'boolean', "response has not boolean type");
      assert.equal(res, true, "return false for correct otp");
      done();
    });
  });

  it("Sending OTP on email", function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.send_email(account_name, user_info.email, function(res) {
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.unique_id, account_name, "Account unique_id not same");
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.email, email, "Account email id not same");
      done();
    });
  });

  it("Sending OTP on mobile", function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.send_sms(account_name, user_info.sms_number, function(res) {
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.unique_id, account_name, "Account unique_id not same");
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.sms_number,'+1' + sms_number, "Account mobile number not same");
      done();
    });
  });

  it("Sending OTP on voice", function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.send_voice(account_name, user_info.voice_number, function(res) {
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.voice_number,  '+1' + voice_number, "Account voice number not same");
      done();
    });
  });

  it("Updating user info", function(done){
    email='ajaysggs@gmail.com';
    sms_number='+19168135913';
    gauthify.update_user(account_name, email, sms_number, function(res){
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.unique_id, account_name, "Account unique_id not same");
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.email, email , "Account email not same");
      assert.equal(res.sms_number, sms_number , "Account sms_number not same");
      gauthify.update_user(account_name, account_name);
      email='imadeajay@gmail.com';
      done();
    });
  });

  it("Deleting user", function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.delete_user(account_name, function(res){
      assert.instanceOf(res, Object, 'response is not object instance');
      assert.equal(res.unique_id, account_name, "Account unique_id not same");
      assert.equal(res.display_name, account_name, "Account display_name not same");
      assert.equal(res.email, email, "Account email id not same");
      assert.equal(res.sms_number,  sms_number, "Account sms_number not same");
      assert.equal(res.voice_number,  '+1' + voice_number, "Account voice_number not same");
      done();
    });
  });

  it("Getting all error code", function(done){
    this.timeout(timeout_val);
    setTimeout(done, timeout_val);
    gauthify.api_errors(function(res){
       assert.instanceOf(res, Object, 'response is not object instance');
    });
  });

});
