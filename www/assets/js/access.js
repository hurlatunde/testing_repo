/**
 * Created by olatundeowokoniran on 11/21/16.
 */
(function ($) {
    "use strict";

    function showLoading(show, element) {
        if (show === 'true') {
            $('#' + element).hide(100);
            $('#spinner').show(100);
        } else {
            $('#' + element).show(100);
            $('#spinner').hide(100);
        }
    }

    function showAlert(message, alertType) {
        var type;
        switch (alertType) {
            case 1:
                type = 'alert-success';
                break;
            case 2:
                type = 'alert-info';
                break;
            case 3:
                type = 'alert-warning';
                break;
            default :
                type = 'alert-danger';
        }

        var alert = '<div class="alert ' + type + ' alert-dismissible fade in" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' + message + '</div>';
        $('#showAlert').html(alert);
    }

    $("#facebookLoginButton").click(function (e) {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;

            var formData = {};
            formData.email_address = user.email;
            formData.username = user.displayName;
            saveCreatedAccount(formData, user, true);

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    });

    $("#googleLoginButton").click(function (e) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;

            var formData = {};
            formData.email_address = user.email;
            formData.username = user.displayName;
            saveCreatedAccount(formData, user, true);

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    });

    /**
     * Create Account
     */
    $("#flextreamSignup").submit(function (e) {
        showLoading('true', 'signUpHolder');
        e.preventDefault();
        var formData = formToArray('flextreamSignup');

        var username = formData.username;
        var email = formData.email_address;
        var password = formData.password;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                updateUser(username, email);
            })
            .catch(function (error) {
                var errorCode = error.code;
                if (errorCode == 'auth/weak-password') {
                    showAlert('The password is too weak. Please try again');
                    showLoading('false', 'signUpHolder');
                } else if (errorCode == 'auth/email-already-in-use') {
                    showAlert('Email address already exists in the system. Please try again');
                    showLoading('false', 'signUpHolder');
                } else if (errorCode == 'auth/invalid-email') {
                    showAlert('Email address is not valid. Please try again');
                    showLoading('false', 'signUpHolder');
                } else if (errorCode == 'auth/operation-not-allowed') {
                    showAlert('Error Unable to create account at this time. Please try again');
                    showLoading('false', 'signUpHolder');
                }
            });

        function updateUser(displayName, email) {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: displayName,
            }).then(function() {
                saveCreatedAccount(formData, user);
            }, function(error) {
                showAlert('Error updating your account. Please login with your email "'+email+'"');
                showLoading('false', 'signUpHolder');
            });
        }

    });

    function saveCreatedAccount(setOfUserData, user, social) {
        var node_id = user.uid;
        setOfUserData.node_id = node_id;
        setOfUserData.likes = 0;

        if(social == true) {
            setOfUserData.photoURL = user.photoURL;
        }

        FirebaseService.saveData({
            path: 'users',
            data: setOfUserData
        }, function (data) {
            if (!data.error) {
                showAlert('Access successfully', 1);
                showLoading('false', 'signUpHolder');
                layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
                redirectUrl('discover');
            } else {
                showAlert('Error saving data. Please try again');
                showLoading('false', 'signUpHolder');
            }
        });
    }

    /**
     * Login User
     */
    $("#flextreamSignIn").submit(function (e) {
        showLoading('true', 'signInHolder');
        e.preventDefault();
        var formData = formToArray('flextreamSignIn');

        var email = formData.email_address;
        var password = formData.password;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {
                showAlert('Welcome back. Good to have you', 1);
                showLoading('false', 'signUpHolder');
                redirectUrl('discover');
            })
            .catch(function (error) {
                var errorCode = error.code;
                if (errorCode == 'auth/user-disabled') {
                    showAlert('Email address has been disabled. Please try again');
                    showLoading('false', 'signInHolder');
                } else if (errorCode == 'auth/user-not-found') {
                    showAlert('there is no user email address on the system. Please try again');
                    showLoading('false', 'signInHolder');
                } else if (errorCode == 'auth/invalid-email') {
                    showAlert('Email address is not valid. Please try again');
                    showLoading('false', 'signInHolder');
                } else if (errorCode == 'auth/wrong-password') {
                    showAlert('Password is not invalid for the given email. Please try again');
                    showLoading('false', 'signInHolder');
                }
            });
    });

    /**
     * Forget Password
     */
    $("#flextreamforgetPassword").submit(function (e) {
        showLoading('true', 'forgetPasswordHolder');
        e.preventDefault();
        var formData = formToArray('flextreamforgetPassword');

        var email = formData.email_address;
        email = email.trim();
        logMessage(email);

        FirebaseService.findOne({
            customRef: firebaseBaseDatabase.ref('/users').orderByChild('email').equalTo(email)
        }, function (data) {
            if (!data.error) {
                // success
                console.log(data);
            } else {
                // error
                console.log(data);
            }
        });

        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then(function (user) {
        //         showAlert('Welcome. Good to have you back', 1);
        //         showLoading('false', 'signUpHolder');
        //         redirectUrl('discover');
        //     })
        //     .catch(function (error) {
        //         var errorCode = error.code;
        //         if (errorCode == 'auth/user-disabled') {
        //             showAlert('Email address has been disabled. Please try again');
        //             showLoading('false', 'signInHolder');
        //         } else if (errorCode == 'auth/user-not-found') {
        //             showAlert('there is no user amail address on the system. Please try again');
        //             showLoading('false', 'signInHolder');
        //         } else if (errorCode == 'auth/invalid-email') {
        //             showAlert('Email address is not valid. Please try again');
        //             showLoading('false', 'signInHolder');
        //         } else if (errorCode == 'auth/wrong-password') {
        //             showAlert('Password is invalid for the given email. Please try again');
        //             showLoading('false', 'signInHolder');
        //         }
        //     });
    });

    // var user = firebase.auth().currentUser;
    //
    // user.updateProfile({
    //     displayName: "Jane Q. User",
    //     photoURL: "https://example.com/jane-q-user/profile.jpg"
    // }).then(function() {
    //     // Update successful.
    // }, function(error) {
    //     // An error happened.
    // });

})(jQuery);