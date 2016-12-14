var CONFIG = (function() {

    var live_version = true;

    var local = {
        'LOGIN_SUBMIT': 'http://mychurchmember.dev/api/auth/login',
        'GET_CHURCH': 'http://mychurchmember.dev/api/get/church',
        'PHONE_BASE': 'http://mychurchmember.dev/api/get/phonebase',
        'CHURCH_GROUP': 'http://mychurchmember.dev/api/get/churchgroup',
        'SEND_SMS': 'http://mychurchmember.dev/api/get/send_sms'
    };

    var live = {
        'LOGIN_SUBMIT': 'https://mychurchmember.com/api/auth/login',
        'GET_CHURCH': 'https://mychurchmember.com/api/get/church',
        'PHONE_BASE': 'https://mychurchmember.com/api/get/phonebase',
        'CHURCH_GROUP': 'http://mychurchmember.com/api/get/churchgroup',
        'SEND_SMS': 'http://mychurchmember.com/api/get/send_sms'

    };



    return {
        get: function(name) {
            if(live_version){
                  return live[name];
            }else{
                  return local[name];
            }
        }
    };
})();


