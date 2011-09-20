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

var Creatary = Creatary ? Creatary : {};

/*  Initialization of Creatary library. Your html document must contain a tag with 'creatary-root' id.
 *    consumer_key: Your application's consumer key
 *    callback: Either a URL your page will be redirected to, or a function to be called after authorization completes
 */
Creatary.init = function(consumer_key, callback) {
    
    document.getElementById("creatary-root").innerHTML = "<iframe src='https://telcoassetmarketplace.com/web/authorize2?consumer_key=" + consumer_key + "'></iframe>";

    var receiveMessage = function(event) {
        if (event.origin !== "https://telcoassetmarketplace.com")
            return;
            
        if (typeof callback === "function") {
            callback.call(event.data);
        } else {
            document.location.href = callback + "?oauth_token=" + event.data;
        }
    }
    
    window.addEventListener("message", receiveMessage, false);  

}
