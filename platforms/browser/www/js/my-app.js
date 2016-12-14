// Initialize your app
var myApp = new Framework7(
    {
        template7Pages: true,
        material: true
    }
);

// Export selectors engine
var $$ = Dom7;

// Add view

var mainView = myApp.addView('.view-main');

myApp.hideNavbar();
// localStorage.clear();
console.log(localStorage.getItem('church'));

if(!localStorage.getItem('loggedin')){
    mainView.router.loadPage("login.html");
}else{
    var church = localStorage.getItem('church');
    mainView.router.loadPage("dashboard.html");
}



myApp.onPageInit('login', function (page) {
    $$('#submit_login').on('click', function () {
        var queryForm = myApp.formToJSON('#login_form');
        if(!queryForm.email || !queryForm.password){

            myApp.addNotification({
                message: 'Validation Error, kindly complete the Login form',
            });

        }else{
            myApp.showPreloader('Processing...');

            //do post request
            $$.post(CONFIG.get('LOGIN_SUBMIT'), queryForm, function (result) {
                var result = JSON.parse(result);
                console.log(result);
                if(result.code != "200"){
                    myApp.hidePreloader();
                    myApp.addNotification({
                        message: 'Invalid Credential, kindly try again'
                    });
                }else{
                    myApp.hidePreloader();

                    localStorage.setItem('loggedin', result.data.token);
                    localStorage.setItem('church', JSON.stringify(result));
                    console.log(result);

                    mainView.router.loadPage("dashboard.html");
                }
            });

        }
        console.log(JSON.stringify(queryForm));
    });
});


myApp.onPageInit('dashboard', function (page) {
    var church =JSON.parse(localStorage.getItem('church'));
    $$('.title_head').html('Welcome ' + church.data.full_name);
    $$('.church_name').html(church.data.church.name);
    var request_online = localStorage.getItem('config');
    console.log(church.data.church.id);
    if(!request_online) {
        console.log(CONFIG.get('GET_CHURCH')+"?token="+localStorage.getItem('loggedin'));
        $$.post(CONFIG.get('GET_CHURCH')+"?token="+localStorage.getItem('loggedin'), {'church_id': church.data.church.id}, function (result) {
            console.log(result);
            localStorage.setItem("config",result);
            request_online = JSON.parse(localStorage.getItem('config'));
            $$(".members").html(request_online.data.members);
            $$(".sms_unit").html(request_online.data.sms_unit);
            $$(".groups").html(request_online.data.groups);
            $$(".males").html(request_online.data.males);
            $$(".female").html(request_online.data.females);
            $$(".married").html(request_online.data.married);
            $$(".single").html(request_online.data.single);
        });
    }else{

    var d_data = JSON.parse(request_online);

        $$(".members").html(d_data.data.members);
        $$(".sms_unit").html(d_data.data.sms_unit);
        $$(".groups").html(d_data.data.groups);
        $$(".males").html(d_data.data.males);
        $$(".female").html(d_data.data.females);
        $$(".married").html(d_data.data.married);
        $$(".single").html(d_data.data.single);

    }

});


myApp.onPageInit('sendsms', function (page) {
    var church = JSON.parse(localStorage.getItem('church'));
    var phone_base_groups = localStorage.getItem('phone_base_group');
    console.log(phone_base_groups);
    var church_groups = localStorage.getItem('c_church_groups');
    console.log(phone_base_groups);
    if (!phone_base_groups) {
        var phone_b = localStorage.getItem('option_phonebase');
        if (!phone_b) {
            $$.post(CONFIG.get('PHONE_BASE') + "?token=" + localStorage.getItem('loggedin'), {'church_id': church.data.church.id}, function (result) {
                console.log(result);
                if (result.code == "302") {
                    localStorage.clear();
                    ;
                    mainView.router.loadPage("login.html");
                }
                localStorage.setItem("option_phonebase", result);
                result = JSON.parse(result);
                var myOptions = result.data;
                var mySelect = $$('#phone_base');
                var i = 0;
                $$.each(myOptions, function (val, text) {
                    if (text == "") {
                        mySelect.append(
                            "<option value='" + val + "' selected>Default</option>"
                        );
                    } else {
                        mySelect.append(
                            "<option value='" + val + "'>" + text + "</option>"
                        );
                    }
                });
            });
        } else {
            result = JSON.parse(phone_b);
            if (result.code == "302") {
                localStorage.clear();
                ;
                mainView.router.loadPage("login.html");
            }
            var myOptions = result.data;
            var mySelect = $$('#phone_base');
            $$.each(myOptions, function (val, text) {
                mySelect.append(
                    "<option value='" + val + "'>" + text + "</option>"
                );
            });
        }
    }

    if (!church_groups) {
        var church_groups = localStorage.getItem('church_groups');
        if (!church_groups) {
            $$.post(CONFIG.get('CHURCH_GROUP') + "?token=" + localStorage.getItem('loggedin'), {'church_id': church.data.church.id}, function (result) {
                console.log("church group" + result);

                if (result.code == "302") {
                    localStorage.clear();
                    mainView.router.loadPage("login.html");
                }
                localStorage.setItem("church_groups", result);
                result = JSON.parse(result);
                var myOptions = result.data;
                var mySelect = $$('#church_group');
                var i = 0;
                $$.each(myOptions, function (val, text) {
                    if (text == "") {
                        mySelect.append(
                            "<option value='" + val + "' selected>Default</option>"
                        );
                    } else {
                        mySelect.append(
                            "<option value='" + val + "'>" + text + "</option>"
                        );
                    }
                });
            });
        } else {
            result = JSON.parse(church_groups);
            console.log("church group" + result);

            if (result.code == "302") {
                localStorage.clear();
                mainView.router.loadPage("login.html");
            }
            var myOptions = result.data;
            var mySelect = $$('#church_group');
            $$.each(myOptions, function (val, text) {
                mySelect.append(
                    "<option value='" + val + "'>" + text + "</option>"
                );
            });
        }
    }

    var $remaining = $$('#remaining'),
        $messages = $remaining.next();

    $$('#message').keyup(function () {
        var chars = this.value.length,
            messages = Math.ceil(chars / 160),
            remaining = messages * 160 - (chars % (messages * 160) || messages * 160);

        $remaining.text(remaining + ' characters remaining');
        $messages.text(messages + ' message(s)');
    });

    var $remaining1 = $$('#remaining1'),
        $messages1 = $remaining.next();

    $$('#message1').keyup(function () {
        var chars = this.value.length,
            messages1 = Math.ceil(chars / 160),
            remaining1 = messages1 * 160 - (chars % (messages1 * 160) || messages1 * 160);

        $remaining1.text(remaining1 + ' characters remaining');
        $messages1.text(messages1 + ' message(s)');
    });
    $$('#btn_group_form').click(function () {
        var data = myApp.formToJSON("#sendGrp");
        console.log(data);
        myApp.showPreloader('Sending Sms...');
        $$.post(CONFIG.get('SEND_SMS') + "?token=" + localStorage.getItem('loggedin'), data, function (result) {
            console.log(result);
            if (result.code != "200") {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: result.message
                });
            } else {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: "Message has been sent"
                });
            }
        });

    });

    $$('#btn_group_form1').click(function () {
        var data = myApp.formToJSON("#sendGrp1");
        console.log(data);
        myApp.showPreloader('Sending Sms...');
        $$.post(CONFIG.get('SEND_SMS') + "?token=" + localStorage.getItem('loggedin'), data, function (result) {
            if (result.code == "302") {
                localStorage.clear();
                ;
                mainView.router.loadPage("login.html");
            }
            console.log(result);
            if (result.code != "200") {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: result.message
                });
            } else {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: "Message has been sent"
                });
            }
        });

    });

    $$('#btn_group_form2').click(function () {
        var data = myApp.formToJSON("#sendGrp2");
        console.log(data);
        myApp.showPreloader('Sending Sms...');
        $$.post(CONFIG.get('SEND_SMS') + "?token=" + localStorage.getItem('loggedin'), data, function (result) {
            if (result.code == "302") {
                localStorage.clear();
                ;
                mainView.router.loadPage("login.html");
            }
            console.log(result);
            if (result.code != "200") {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: result.message
                });
            } else {
                myApp.hidePreloader();
                myApp.addNotification({
                    message: "Message has been sent"
                });
            }
        });
    });
});



