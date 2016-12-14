/**
 * Created by olatundeowokoniran on 9/24/16.
 */
/**
 * ServerSide Connection
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.service.initializeServerSideConnection.js
 * @since         SwallowJs(tm) v 0.2.9
 */


function serverCall(key) {
    $.ajax({
        url: 'http://newsdeck-1ff08.appspot.com/BuildService/createBuild/' + key,
        cache: false,
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            logMessage(data);
        }
    });
    // loadAjax.error(function (data) {
    //     logMessage(data);
    // });
}

var ServerSideConnect;

ServerSide = function () {
};

$.extend(ServerSide.prototype, {

    /**
     *
     * @param params
     * @param callBackData
     */
    apiConnect: function (params, callBackData) {
        var url = params.endpoint;
        var requestType = params.requestType;
        var dataParams = params.data;

        if (!requestType || requestType == "undefined") {
            requestType = 'GET';
        }

        // $.ajaxSetup({
        // headers: {"Access-Control-Request-Headers": "Content-Type"},
        // });

        $.ajax({
            beforeSend: function (xhr) {
                logMessage('sending')
            },
            url: url,
            cache: false,
            type: requestType,
            data: dataParams,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                callBackData(data);
            },
            error: function (e) {
                callBackData({error: e.responseText});
            },
            complete: function () {
            },
            fail: function (e) {
            }
        })
    }
});

ServerSideConnect = new ServerSide();
