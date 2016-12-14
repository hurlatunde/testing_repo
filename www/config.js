/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       config.js
 * @since         SwallowJs(tm) v 0.2.9
 */

/**
 * !Warning ## Most not be a string and most not contain [space] ##
 * @type {{private, layoutTemplate, firebaseConfig, constants}}
 */

var app = {
    lastFmApikey:'228d8be2ce3d0847e3df01e057681476',
    lastFmApiSecret: '0d0bec98a992d0bbccb121431c12df1c'
};

var CONFIG = (function () {
    var SwallowJs = {
        'main_container': 'swallow',
        'view_container': 'viewContainer',
        'view_access_container': 'accessContainer',
        'admin_access_container': 'admin_body',
        'beta': true,
        'loading': true,
        'debug': true
    };

    // Templates
    var layout = {
        'home':              'layouts/home.html',
        'page_loading':      'layouts/page_loading.html',
        '404':               'layouts/error/404.html',
        'discover':          'layouts/discover.html',
        'browse':            'layouts/browse.html',
        'albums':            'layouts/albums.html',
        'videos':            'layouts/videos.html',
        'charts':            'layouts/charts.html',
        'artists':           'layouts/artists.html',
        'signup':            'layouts/access/signup.html',
        'signin':            'layouts/access/signin.html',
        'signout':           'layouts/access/signout.html',
        'forgot-password':   'layouts/access/forgot-password.html',
        'track_detail':      'layouts/track_detail.html',
        'artist_detail':     'layouts/artist_detail.html',
        'playlist_detail':   'layouts/playlist_detail.html',
        'gener':             'layouts/gener.html',
        'explore_geners':    'layouts/explore_geners.html',
        'genres':            'layouts/genres.html',
        'profile':           'layouts/profile.html',
        'picks':             'layouts/picks.html',
        'backend_login':                  'layouts/backend/login.html',
        'backend_create_playlist':        'layouts/backend/create_playlist.html',
        'backend_upload_artist':          'layouts/backend/upload_artist.html',
        'backend_upload_track_music':     'layouts/backend/upload_track_music.html',
        'backend_upload_artist_album':    'layouts/backend/upload_artist_album.html',
        'backend_list_playlists':         'layouts/backend/list_playlists.html',
        'backend_list_artists':           'layouts/backend/list_artists.html',
        'backend_list_tracks':            'layouts/backend/list_tracks.html',
        'backend_list_albums':            'layouts/backend/list_albums.html',
        'backend_edit_artist':            'layouts/backend/edit_artist.html',
        'backend_view_artist':            'layouts/backend/view_artist.html',
        'backend':                        'layouts/backend/index.html',
    };

    var constants = {
        // define constants here
        'true': '1',
    };

    var firebase_config = {
        apiKey: 'AIzaSyCxMNsSXdcNcBIMzS_53XE-kh4NtaV94_A',
        authDomain: 'flexmuzik-app-2016-gen.firebaseapp.com',
        databaseURL: 'https://flexmuzik-app-2016-gen.firebaseio.com',
        storageBucket: 'flexmuzik-app-2016-gen.appspot.com',
        messagingSenderId: '323367340984',
    };

    return {
        private: function (name) {
            return SwallowJs[name];
        },
        layoutTemplate: function (name) {
            return layout[name];
        },
        firebaseConfig: function () {
            return firebase_config;
        },
        constants: function (name) {
            return constants[name];
        }
    };
})();

/**
 * Default SwallowJs main container
 */
var swallowJsContainer = $('#' + CONFIG.private('main_container'));
var viewContainer      = $('#' + CONFIG.private('view_container'));
var viewAccessContainer = $('#' + CONFIG.private('view_access_container'));
var adminContainer = $('#' + CONFIG.private('admin_access_container'));


/**
 *
 * @type {any}
 */
var debug = CONFIG.private('debug');


/**
 * Default SwallowJs firebaseConfig
 */
var firebaseConfig = CONFIG.firebaseConfig('firebase_config');