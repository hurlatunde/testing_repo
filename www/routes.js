/**
 * Required -- path.js 'Path={version:"0.8.4"}'
 * @pathLink   https://github.com/mtrpcic/pathjs
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * different URLs.
 *
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       routes.js
 * @since         SwallowJs(tm) v 0.2.9
 */

var appData = {};

// var name, email, photoUrl, userId;
//
// if (user != null) {
//     name = user.displayName;
//     email = user.email;
//     photoUrl = user.photoURL;
//     userId = user.uid;
// }
//

function checkIfUserIsLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            redirectUrl('discover');
        } else {
            logMessage('error');
            //redirectUrl('home');
        }
    });
}

function accessCurrentUser() {
    var user = firebase.auth().currentUser;
    var appDataSet = {};

    if(user != null) {
        if (!user.email || user == null) {
            appDataSet.user = false;
            return appDataSet;
        } else {
            appDataSet.userData = user;
            appDataSet.user = true;

            var image = user.photoURL;
            if (!image || image == null) {
                appDataSet.photo = false;
            } else {
                appDataSet.photo = true;
            }
            return appDataSet;
        }
    } else {
        logMessage('error here');
    }
}

// Swallow needed
Path.rescue(notFound);
Path.root("#/");

/**
 * notFound
 */
function notFound() {
    renderLayout('404', swallowJsContainer);
}

Path.map("#/").to(function () {
    renderLayout('home', swallowJsContainer);
}).enter(clearPanel);

Path.map("#/home").to(function () {
    renderLayout('home', swallowJsContainer);
}).enter(clearPanel);

Path.map("#/user_gener").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var userData = accessCurrentUser();
    FirebaseService.findAll({
        path: '/genres',
    }, function (data) {
        if (!data.error) {
            data.access = userData;
            logMessage(data);
            renderLayout('genres', swallowJsContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/discover").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    firebaseBaseDatabase.ref('uploads').limitToLast(18).orderByKey().once('value', function (snapshot) {
        var count = snapshot.numChildren();
        var response;

        var data = Array();
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            childData.key = key;
            data.push(childData);
        });

        data = data.reverse();
        shuffleArray(data);

        if (count > 0) {
            response = true;
        } else {
            response = false;
        }
        data.response = response;
        data.response_count = count;

        //access user
        var userData = accessCurrentUser();
        data.access = userData;
        //access User

        data.tracks = data;
        renderLayout('discover', viewContainer, data);
    });

}).enter(clearPanel);

Path.map("#/artists").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    FirebaseService.findAll({
        path: '/artists',
        listenerType: 'once',
        eventType: 'value',
        limit: 20
    }, function (data) {
        if (!data.error) {
            data.artistsDatas = data.data;
            renderLayout('artists', viewContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/video").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    firebaseBaseDatabase.ref('uploads').limitToLast(66).orderByKey().once('value', function (snapshot) {
        var data = Array();
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            childData.key = key;
            data.push(childData);
        });

        data.videos = data;
        renderLayout('videos', viewContainer, data);
    });

}).enter(clearPanel);

Path.map("#/browse").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var mPageEndOffset = 3;
    firebaseBaseDatabase.ref('uploads').limitToLast(66).orderByKey().once('value', function (snapshot) {
    // firebaseBaseDatabase.ref('uploads').orderByKey().limitToFirst(mPageEndOffset).startAt("0").once('value', function (snapshot) {
        var count = snapshot.numChildren();
        var response;

        var data = Array();
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            childData.key = key;
            data.push(childData);
        });

        //data = data.reverse();
        //shuffleArray(data);

        if (count > 0) {
            response = true;
        } else {
            response = false;
        }
        data.response = response;
        data.response_count = count;

        //access user
        var userData = accessCurrentUser();
        data.access = userData;
        //access User

        data.tracks = data;
        data.offset = mPageEndOffset;
        renderLayout('browse', viewContainer, data);
    });

}).enter(clearPanel);

Path.map("#/albums").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    FirebaseService.findAll({
        path: '/albums',
        listenerType: 'once',
        eventType: 'value',
        limit: 20
    }, function (data) {
        if (!data.error) {
            data.albumDatas = data.data;
            renderLayout('albums', viewContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/charts").to(function () {
    swallowLoading({element: 'viewContainer', show: true});
    renderLayout('charts', viewContainer);
}).enter(clearPanel);

Path.map("#/picks/:node_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var nodeId = this.params["node_id"];
    FirebaseService.findOne({
        path: 'playlists/' + nodeId,
        listenerType: 'on',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            if (jQuery.isEmptyObject(data)) {
                renderLayout('picks', viewContainer, data);
            } else {
                data.picks = data;
                renderLayout('picks', viewContainer, data);
            }
        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);


// Access
Path.map("#/signup").to(function () {
    checkIfUserIsLoggedIn();
    swallowLoading({element: 'accessContainer', show: true});
    renderLayout('signup', viewAccessContainer);
}).enter(clearPanel);

Path.map("#/sign_out").to(function () {
    checkIfUserIsLoggedIn();
    swallowLoading({element: 'accessContainer', show: true});
    firebase.auth().signOut().then(function() {
        redirectUrl('home');
    }, function(error) {
        logMessage(error);
    });
}).enter(clearPanel);

Path.map("#/signin").to(function () {
    checkIfUserIsLoggedIn();
    swallowLoading({element: 'accessContainer', show: true});
    renderLayout('signin', viewAccessContainer);
}).enter(clearPanel);

Path.map("#/forgot-password").to(function () {
    checkIfUserIsLoggedIn();
    swallowLoading({element: 'accessContainer', show: true});
    renderLayout('forgot-password', viewAccessContainer);
}).enter(clearPanel);
// Access

Path.map("#/profile/:user_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var userId = this.params["user_id"];
    userId = userId.split("#");
    userId = userId.splice(0,1);

    FirebaseService.findOne({
        path: 'users/' + userId
    }, function (data) {
        if (!data.error) {
            if (jQuery.isEmptyObject(data)) {
                renderLayout('profile', viewContainer, data);
            } else {
                data.profile = data;
                renderLayout('profile', viewContainer, data);
            }
        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/explore_geners").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    firebaseBaseDatabase.ref('genres').orderByPriority().once('value', function (snapshot) {
        var count = snapshot.numChildren();
        var response;

        var data = Array();
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            childData.key = key;
            data.push(childData);
        });

        if (count > 0) {
            response = true;
        } else {
            response = false;
        }
        data.response = response;
        data.response_count = count;

        data.genres = data;
        renderLayout('explore_geners', viewContainer, data);
    });

});

Path.map("#/gener/:genre_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var genreId = this.params["genre_id"];
    FirebaseService.findOne({
        path: 'genres/' + genreId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            if (jQuery.isEmptyObject(data)) {
                renderLayout('gener', viewContainer, data);
            } else {
                appData.genre = data;
                renderLayout('gener', viewContainer, appData);
            }
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/track_detail/:track_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var userId = this.params["track_id"];
    FirebaseService.findOne({
        path: 'uploads/' + userId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            if (jQuery.isEmptyObject(data)) {
                renderLayout('track_detail', viewContainer, data);
            } else {
                var tags = data.track_tags;
                var t = Array();
                for (var key in tags) {
                    t.push(key);
                }

                data.track_tags = t;
                appData.track = data;
                renderLayout('track_detail', viewContainer, appData);
            }
        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/playlist_detail/:playlist_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var playlistId = this.params["playlist_id"];
    FirebaseService.findOne({
        path: 'playlists/' + playlistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            if (jQuery.isEmptyObject(data)) {
                renderLayout('playlist_detail', viewContainer, data);
            } else {

                var tags = data.track_tags;
                var t = Array();
                for (var key in tags) {
                    t.push(key);
                }

                data.playlist_tags = t;
                appData.playlistDetails = data;
                renderLayout('playlist_detail', viewContainer, appData);
            }
        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/artist_detail/:artist_id").to(function () {

    swallowLoading({element: 'viewContainer', show: true});
    var artistId = this.params["artist_id"];
    FirebaseService.findOne({
        path: 'artists/' + artistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {

            if (jQuery.isEmptyObject(data)) {
                renderLayout('artist_detail', viewContainer, data);
            } else {
                var tags = data.artist_tags;
                var t = Array();
                for (var key in tags) {
                    t.push(key);
                }

                data.artist_tags = t;
                data.artistDetails = data;
                renderLayout('artist_detail', viewContainer, data);
            }
        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);



// backend
Path.map("#/backend").to(function () {
    var user = firebase.auth().currentUser;
    logMessage(user);
    renderLayout('backend', adminContainer);
}).enter(clearPanel);

Path.map("#/backend/login").to(function () {
    renderLayout('backend_login', adminContainer);
}).enter(clearPanel);

Path.map("#/backend/list_playlists").to(function () {

    swallowLoading({element: 'admin_access_container', show: true});
    FirebaseService.findAll({
        path: '/playlists',
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            data.playlistDatas = data.data;

            renderLayout('backend_list_playlists', adminContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/list_artists").to(function () {

    swallowLoading({element: 'admin_access_container', show: true});
    FirebaseService.findAll({
        path: '/artists',
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            data.artistsDatas = data.data;

            renderLayout('backend_list_artists', adminContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/list_tracks").to(function () {

    swallowLoading({element: 'admin_access_container', show: true});
    FirebaseService.findAll({
        path: '/artists',
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            data.artistsDatas = data.data;

            renderLayout('backend_list_tracks', adminContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/list_albums").to(function () {

    swallowLoading({element: 'admin_access_container', show: true});
    FirebaseService.findAll({
        path: '/albums',
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {
            data.albumsDatas = data.data;

            renderLayout('backend_list_albums', adminContainer, data);
        } else {
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/upload_track_music/:artist_id").to(function () {

    swallowLoading({element: 'admin_access_container'});
    var artistId = this.params["artist_id"];
    FirebaseService.findOne({
        path: 'artists/' + artistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {

            var tags = data.artist_tags;
            var t = Array();
            for (var key in tags) {
                t.push(key);
            }

            data.artist_tags = t;
            appData = data;
            renderLayout('backend_upload_track_music', adminContainer, appData);

        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/upload_artist_album/:artist_id").to(function () {

    swallowLoading({element: 'admin_access_container'});
    var artistId = this.params["artist_id"];
    FirebaseService.findOne({
        path: 'artists/' + artistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {

            var tags = data.artist_tags;
            var t = Array();
            for (var key in tags) {
                t.push(key);
            }

            data.artist_tags = t;
            appData = data;
            renderLayout('backend_upload_artist_album', adminContainer, appData);

        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/create_playlist").to(function () {
    renderLayout('backend_create_playlist', adminContainer);
}).enter(clearPanel);

Path.map("#/backend/upload_artist").to(function () {
    renderLayout('backend_upload_artist', adminContainer);
}).enter(clearPanel);

Path.map("#/backend/edit_artist/:artist_id").to(function () {

    var artistId = this.params["artist_id"];
    FirebaseService.findOne({
        path: 'artists/' + artistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {

            var tags = data.artist_tags;
            var t = Array();
            for (var key in tags) {
                t.push(key);
            }

            data.artist_tags = t;
            appData = data;
            renderLayout('backend_edit_artist', adminContainer, appData);

        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

Path.map("#/backend/view_artist/:artist_id").to(function () {

    var artistId = this.params["artist_id"];
    FirebaseService.findOne({
        path: 'artists/' + artistId,
        listenerType: 'once',
        eventType: 'value',
    }, function (data) {
        if (!data.error) {

            var tags = data.artist_tags;
            var t = Array();
            for (var key in tags) {
                t.push(key);
            }

            data.artist_tags = t;
            appData = data;
            renderLayout('backend_view_artist', adminContainer, appData);

        } else {
            // error
            console.log(data);
        }
    });

}).enter(clearPanel);

// Path.map("#/users/:user_ide/:user_family").to(function () {
//     var data = {
//         user_id: this.params["user_id"],
//         user_family: this.params["user_family"],
//     };
//     renderLayout('users', swallowJsContainer, data);
// }).enter(clearPanel);

/**
 * This is a route with optional components.  Optional components in a route are contained
 *  within brackets.  The route below will match both "#/about" and "#/about/author".
 */
// Path.map("#/about(/author)").to(function(){
//
// });

/**
 * clearPanel (You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.)
 */
function clearPanel() {
    // You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.
}

/**
 * listen (Always as to be at the bottom of this page)
 */
function initPath() {
    Path.listen();
    logMessage('**** SwallowJs is route is working perfectly ****');
}