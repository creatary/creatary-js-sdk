/**
 * Creatary Javascript Library
 *
 * @author Attila Incze <attila.incze@nsn.com>
 * 
 * Copyright (c) 2011 Nokia Siemens Networks
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Global Creatary object
 */
var Creatary = {

    /*
     * Creatary website URL
     */
    origin: 'https://telcoassetmarketplace.com',
    
    /*
     * Preset Msisdn
     */
    pre_set_msisdn: null,
    
    /*
     * Login method
     */
    login_method: 'sms',
    
    /*
     * Authorization callbacks
     */
    callback: null,
    error_callback: null,

    /**
     * Initialization of Creatary library.
     * If your document contains a 'creatary-root' ID html tag, the OAuth2 iframe fashioned flow will be enabled (and inserted)
     * In this case providing callback functions is a must. Otherwise you can pass it also to the Creatary.auth() function.
     * 
     * @param client_id   Your application's client id (also called consumer key)
     * @param options = {   Optional javascript object
     *          callback         Function to be called if authorization succeeds. Only callback parameter will be the OAuth2 code.
     *          error_callback   Function to be called if authorization fails. (for example user rejects application)
     *          loglevel        Log level that this library will use. Possible values are: Creatary.log.DEBUG / ERROR / OFF.
     *                           Default level: ERROR
     *        }
     * @return Nothing.
     */
    init: function(client_id, options) {

        Creatary.client_id = client_id;

        options = options || {};
        Creatary.log.init(options.loglevel || Creatary.log.ERROR);
        Creatary.callback = options.callback || Creatary.callback;
        Creatary.error_callback = options.error_callback || Creatary.error_callback;
        Creatary.pre_set_msisdn = options.pre_set_msisdn || Creatary.pre_set_msisdn;
        Creatary.login_method = options.login_method || Creatary.login_method;

        // Cannot proceed without this dom elememt present
        if (document.getElementById("creatary-root") === null) {
            Creatary.log.error('The `creatary-root` element is not present.');
            return;
        }

        var receiveMessage = function(event) {
            // check the source of message
            if (event.origin !== Creatary.origin) {
                Creatary.log.error('Possible breach attempt, event origin: ', event.origin);
                return;
            }

            // is it rejected ?
            if (event.data === 'rejected') {
                Creatary.log.debug('Request rejected, trying to call cb.');
                if (typeof Creatary.error_callback === 'function') {
                    Creatary.error_callback.call();
                }
            // or approved ?
            } else {
                Creatary.log.debug('Request approved, trying to call cb.');
                if (typeof Creatary.callback === 'function') {
                    Creatary.callback.call(this, event.data);
                }
            }
        }

        // Bind the postMessage listener
        if (typeof window['postMessage'] !== 'undefined' && typeof window['addEventListener'] !== 'undefined') {
            // Chrome, etc.
            window.addEventListener("message", receiveMessage, false);
        } else if (typeof window['postMessage'] !== 'undefined' && typeof window['attachEvent'] !== 'undefined') {
            // IE 8
            window.attachEvent('onmessage', receiveMessage);
        } else {
            // Stuff we don't support
            return false;
        }

        // Insert authorization page for iframe scenario
        if (options.renderIframe) {
            if (Creatary.callback === null) {
                Creatary.log.debug('No callback function exists for authorization.');
            }
            if (Creatary.error_callback === null) {
                Creatary.log.debug('No error_callback function exists for authorization.');
            }
            var url = Creatary.origin + '/web/authorize-iframe?client_id=' + Creatary.client_id;
            if(Creatary.pre_set_msisdn) {
                url += "&msisdn=" + encodeURIComponent(Creatary.pre_set_msisdn);
            }
            url += Creatary.login_method === 'password' ? "&w=p" : "&w=s";
            Creatary.log.debug('Inserting iframe auth page with following URL: ', url);
            document.getElementById("creatary-root").innerHTML = '<iframe src="' + url + '" style="width: 100%; height: 100%; border: none; overflow: hidden;"></iframe>';
        }
        
        // We need this helper iframe for popup scenario in IE8 (shame!!)
        document.getElementById("creatary-root").innerHTML += '<iframe src="' + Creatary.origin + '/web/html/xss_proxy.html' + '" style="width: 1px; height: 1px; display: none;" id="creatary_xss_proxy" name="creatary_xss_proxy"></iframe>';
        
        return true;
    },

    /**
     * Call to this function triggers an authorization flow in a popup window fashion
     * Only call this from a user-initiated context, for example a button click (otherwise popup may be blocked)
     * 
     * @param callback   Function to be called if authorization succeeds. Only callback parameter will be the OAuth2 code.
     *                   If not provided, or null, the callback provided in Creatary.init will be used.
     * @param error_callback   Function to be called if authorization fails. (for example user rejects application)
     *                         If not provided, or null, the callback provided in Creatary.init will be used.
     * @return Nothing.
     */
    auth: function(callback, error_callback) {
        Creatary.callback = callback || Creatary.callback;
        Creatary.error_callback = error_callback || Creatary.error_callback;
        
        if (Creatary.callback === null) {
            Creatary.log.debug('No callback function exists for authorization.');
        }
        if (Creatary.error_callback === null) {
            Creatary.log.debug('No error_callback function exists for authorization.');
        }
        
        var url = Creatary.origin + '/web/authorization?client_id=' + Creatary.client_id;
        if(Creatary.pre_set_msisdn) {
            url += "&msisdn=" + encodeURIComponent(Creatary.pre_set_msisdn);
        }
        url += Creatary.login_method === 'password' ? "&w=p" : "&w=s";
        Creatary.log.debug('Opening popup auth page with following URL: ', url);
        window.open(url, 'creataryAuthPopup', 'location=1,scrollbars=1,width=435,height=495');
    },
    
    /**
     * Logging responsible code part
     */
    log: {
        /**
         * Different log levels to be used at logging initilization
         */
        DEBUG: 1,
        ERROR: 1,
        OFF: 2,
        /**
         * Setup logging functions
         */
        init: function(level) {
            
            // If console.log not supported, don't even try
            if (typeof console === 'undefined' || typeof console['log'] === 'undefined') {
                level = Creatary.log.OFF;
            }
            
            var doLog = function(prepend) {
                return function() {
                    var args = [prepend].concat([].slice.call(arguments));
                    return console.log.apply(console, args);
                };
            };
            var doNothing = function() {
            };

            Creatary.log.debug = (level <= Creatary.log.DEBUG) ? doLog('Creatary debug: ') : doNothing;
            Creatary.log.error = (level <= Creatary.log.ERROR) ? doLog('Creatary ERROR: ') : doNothing;
        }
    }
};

// Call the async init defined by developer
if (typeof creataryAsyncInit === 'function') {
    creataryAsyncInit();
}
