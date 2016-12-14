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

    //var GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();

    // $('#googleAdminLogin').click(function (a) {
    //     GoogleAuthProvider.addScope('https://www.googleapis.com/auth/plus.login');
    //     $('#loading_word').html('Accessing user details.');
    //     firebase.auth().signInWithPopup(GoogleAuthProvider).then(function (result) {
    //         //var token = result.credential.accessToken;
    //         var user = result.user;
    //         var currentUserId = user.uid;
    //         var currentUserEmail = user.email;
    //
    //         logMessage(currentUserId);
    //         logMessage(currentUserEmail);
    //
    //         FirebaseService.findOne({
    //             customRef: firebaseBaseDatabase.ref('/users').orderByChild('email_address').equalTo(currentUserEmail)
    //         }, function (data) {
    //             if (!data.error) {
    //                 logMessage(data);
    //             } else {
    //                 logMessage(data);
    //             }
    //         });
    //
    //     }).catch(function (error) {
    //         // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         // The email of the user's account used.
    //         var email = error.email;
    //         // The firebase.auth.AuthCredential type that was used.
    //         var credential = error.credential;
    //         // ...
    //     });
    // });


    $("#flextreamAdminSignIn").submit(function (e) {
        showLoading('true', 'adminAccess');
        e.preventDefault();
        var formData = formToArray('flextreamAdminSignIn');

        var email = formData.email_address;
        var password = formData.password;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {
                var currentUserEmail = user.email;

                FirebaseService.findOne({
                    customRef: firebaseBaseDatabase.ref('/users').orderByChild('email_address').equalTo(currentUserEmail)
                }, function (data) {
                    var key = getKey(data);
                    var userData = data[key];
                    if (userData.admin == true) {
                        showAlert('Welcome. Good to have you back', 1);
                        showLoading('false', 'adminAccess');
                        redirectUrl('backend');
                    } else {
                        showAlert('Error, Invalid user not an admin');
                        showLoading('false', 'adminAccess');
                        firebase.auth().signOut().then(function () {
                            // Sign-out successful.
                        });
                    }
                });

            })
            .catch(function (error) {
                var errorCode = error.code;
                if (errorCode == 'auth/user-disabled') {
                    showAlert('Email address has been disabled. Please try again');
                    showLoading('false', 'adminAccess');
                } else if (errorCode == 'auth/user-not-found') {
                    showAlert('there is no user email address on the system. Please try again');
                    showLoading('false', 'adminAccess');
                } else if (errorCode == 'auth/invalid-email') {
                    showAlert('Email address is not valid. Please try again');
                    showLoading('false', 'adminAccess');
                } else if (errorCode == 'auth/wrong-password') {
                    showAlert('Password is invalid for the given email. Please try again');
                    showLoading('false', 'adminAccess');
                }
            });
    });

    function getKey(data) {
        for (var prop in data)
            return prop;
    }

    /**
     * update artist album
     */
    $('#uploadAlbum').click(function (e) {

        e.preventDefault();
        var formData = formToArray('uploadArtistAlbum');
        var tags = formData.album_tags;
        var artistId = formData.album_artist;
        tags = tags.split(',');

        var t = {};
        for (var i = 0; i < tags.length; i++) {
            var name = tags[i];
            t[name] = true;
        }
        formData.album_tags = t;

        var albumArt;
        var albumId;

        FirebaseService.saveData({
            path: '/albums',
            data: formData
        }, function (data) {
            if (!data.error) {
                albumId = data.node_id;
                uploadAlbumArt();
            } else {
                console.log(data);
            }
        });

        function uploadAlbumArt() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('album_art'),
                'path': '/artists/'+artistId+'/albums'
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    albumArt = data.downloadURL;
                    updateAlbum();
                }
            });
        }

        function updateAlbum() {
            FirebaseService.updateData({
                path: '/albums/' + albumId,
                data: ({album_art: albumArt})
            }, function (data) {
                if (!data.error) {
                    increAlbumCount();
                } else {
                    console.log(data);
                }
            });
        }

        function increAlbumCount() {
            FirebaseService.incrementValue({
                path: '/artists/' + artistId + '/albums_count',
                incrementBy: 1
            }, function (data) {
                redirectUrl('backend/view_artist/'+artistId);
            });
        }

    });

    /**
     * update tracks
     */
    $('#genPlaylist').click(function (e) {
        e.preventDefault();
        var formData = formToArray('createPlaylist');
        var tags = formData.playlist_tags;
        //var artistId = formData.track_artist;
        tags = tags.split(',');


        var t = {};
        for (var i = 0; i < tags.length; i++) {
            var name = tags[i];
            t[name] = true;
        }
        formData.track_tags = t;

        var playlistId;
        var playlistArt;

        FirebaseService.saveData({
            path: '/playlists',
            data: formData
        }, function (data) {
            if (!data.error) {
                playlistId = data.node_id;
                uploadPlaylistArt();
            } else {
                console.log(data);
            }
        });

        function uploadPlaylistArt() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('playlist_art'),
                'path': '/playlists'
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    playlistArt = data.downloadURL;
                    updatePlaylist();
                }
            });
        }

        function updatePlaylist() {
            FirebaseService.updateData({
                path: '/playlists/' + playlistId,
                data: ({playlist_art: playlistArt})
            }, function (data) {
                if (!data.error) {
                    createPlaylistPath();
                } else {
                    console.log(data);
                }
            });
        }
        
        function createPlaylistPath() {
            FirebaseService.saveData({
                path: '/playlists_tracks',
                data: ({node_id: playlistId})
            }, function (data) {
                if (!data.error) {
                    redirectUrl('backend/list_playlists');
                } else {
                    console.log(data);
                }
            });
        }
    });

    /**
     * save artist details
     */
    $("#uploadArtistButton").click(function (e) {
        e.preventDefault();
        var formData = formToArray('uploadArtist');

        var tags = formData.artist_tags;
        tags = tags.split(',');

        var t = {};
        for (var i = 0; i < tags.length; i++) {
            var name = tags[i];
            t[name] = true;
        }

        formData.artist_tags = t;

        var artistArt;
        var artistPoster;
        var artistId;

        FirebaseService.saveData({
            path: '/artists',
            data: formData
        }, function (data) {
            if (!data.error) {
                //console.log(data);
                artistId = data.node_id;
                uploadArt();
            } else {
                console.log(data);
            }
        });

        function uploadArt() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('art'),
                'path': '/artists/' + artistId
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    artistArt = data.downloadURL;
                    uploadPoster();
                }
            });
        }

        function uploadPoster() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('poster'),
                'path': '/artists/' + artistId
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    artistPoster = data.downloadURL;
                    updateArtist();
                }
            });
        }

        function updateArtist() {
            FirebaseService.updateData({
                path: '/artists/' + artistId,
                data: ({artist_image: artistArt, artist_poster: artistPoster})
            }, function (data) {
                if (!data.error) {
                    console.log(data);
                    redirectUrl('backend/view_artist/'+artistId);
                } else {
                    // error
                    console.log(data);
                }
            });
        }
    });

    /**
     * update artist details
     */
    $("#updateArtist").submit(function (e) {
        e.preventDefault();
        var formData = formToArray('updateArtist');
        var tags = formData.artist_tags;
        tags = tags.split(',');

        var t = {};
        for (var i = 0; i < tags.length; i++) {
            var name = tags[i];
            t[name] = true;
        }
        var artistId = formData.node_id;
        formData.artist_tags = t;

        FirebaseService.updateData({
            path: '/artists/' + artistId,
            data: formData
        }, function (data) {
            if (!data.error) {
                console.log(data);
            } else {
                console.log(data);
            }
        });
    });

    /**
     *
     */
    $("#updateArtistGallery").submit(function (e) {
        e.preventDefault();
        var formData = formToArray('updateArtistGallery');
        var input = document.getElementById('art');
        var artistId = formData.node_id;

        // logMessage(input.files);
        // return;

        for (var i = 0; i < input.files.length; ++i) {
            logMessage(input.files[i]);

            FirebaseService.fireBaseImageUpload({
                'file': input.files[i],
                'path': '/artists/' + artistId
            }, function (data) {
                if (data.downloadURL) {
                    logMessage(data);
                    artistGallery(data.downloadURL);
                }
            });
        }

        function artistGallery(url) {
            FirebaseService.saveData({
                path: '/artists_galleries/' + artistId,
                data: ({src: url})
            }, function (data) {
                if (!data.error) {
                    console.log(data);
                } else {
                    // error
                    console.log(data);
                }
            });
        }
    });

    /**
     * update tracks
     */
    $('#uploadTracks').click(function (e) {
        e.preventDefault();
        var formData = formToArray('uploadTrackMusic');
        var tags = formData.track_tags;
        var artistId = formData.track_artist;
        tags = tags.split(',');

        var t = {};
        for (var i = 0; i < tags.length; i++) {
            var name = tags[i];
            t[name] = true;
        }
        formData.track_tags = t;
        var trackSrc;
        var trackArt;
        var trackId;

        if (formData.track_album === "1"){
            delete formData["album_image"];
        }

        FirebaseService.saveData({
            path: '/uploads',
            data: formData
        }, function (data) {
            if (!data.error) {
                trackId = data.node_id;
                uploadTrack();
            } else {
                console.log(data);
            }
        });

        function uploadTrack() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('track_source'),
                'path': '/artists/'+artistId+'/uploads/' + trackId
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    trackSrc = data.downloadURL;
                    if (formData.track_album === "1"){
                        uploadTrackArt();
                    } else {
                        trackArt = formData.album_image;
                        updateTrack();
                    }
                }
            });
        }

        function uploadTrackArt() {
            FirebaseService.fireBaseImageUpload({
                'file': getInputFile('track_art'),
                'path': '/artists/'+artistId+'/albums'
            }, function (data) {
                logMessage(data);
                if (data.downloadURL) {
                    trackArt = data.downloadURL;
                    updateTrack();
                }
            });
        }

        function updateTrack() {
            FirebaseService.updateData({
                path: '/uploads/' + trackId,
                data: ({track_source: trackSrc,track_art: trackArt})
            }, function (data) {
                if (!data.error) {
                    console.log(data);
                    increTracksCount();
                } else {
                    console.log(data);
                }
            });
        }

        function increTracksCount() {
            FirebaseService.incrementValue({
                path: '/artists/' + artistId + '/tracks_count',
                incrementBy: 1
            }, function (data) {
                redirectUrl('backend/view_artist/'+artistId);
            });
        }
    });

})(jQuery);