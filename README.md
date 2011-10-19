# creatary-js

A Javascript SDK that provides a simple API to connect your web application with the Creatary platform.

_Receive & send SMS, query location and charge subscribers all through their mobile operator, in a revenue share, no upfront investment model._

http://creatary.com

# How to use

You need to put the following HTML snippets somewhere in your document `<body>`. If you use
the iframe in-page authorization (renderIframe: true), the iframe will be rendered in the
creatary-root div element. You should set the div size to 500px x 220px, for example like:

```css
#creatary-root {
    width: 500px;
    height: 220px;
}
```

If you want to use the iFrame in-page authorization flow:

```html
<div id="creatary-root"></div>
<script type="text/javascript">
  var creataryAsyncInit = function() {
    Creatary.init('client_id', {
        // Use the iFrame in-page authorization
        renderIframe : true,
        // Login with pincode via sms
        login_method: 'sms',
        // The preset number for login method with sms
        pre_set_msisdn: '18008291040',
        // Authorized callback
        callback : function(code) {
            $('#result').html('Thanks for enabling my app!');
            $.post('ajax.php?code_arrived=1', { code: code });
        },
        // Rejected callback
        error_callback : function() {
            $('#result').html('You will not be able to use my app. Are you sure?');
        }
    });
  };
  
  (function(){
     var js = document.createElement('script'); js.async = true;
     js.src = "//telcoassetmarketplace.com/web/lib/creatary.js";
     document.getElementsByTagName('head')[0].appendChild(js);
  })();
</script>
```

If you want to use the popup authorization flow:

```html
<div id="creatary-root"></div>
<script type="text/javascript">
  var creataryAsyncInit = function() {
    Creatary.init('client_id', {
        // Authorized callback
        callback : function(code) {
            $('#result').html('Thanks for enabling my app!');
            $.post('ajax.php?code_arrived=1', { code: code });
        },
        // Rejected callback
        error_callback : function() {
            $('#result').html('You will not be able to use my app. Are you sure?');
        }
    });
    
    // Bind the authorization handler function to the click of a button
    $('#auth').click( Creatary.auth );
  };
  
  (function(){
     var js = document.createElement('script'); js.async = true;
     js.src = "//telcoassetmarketplace.com/web/lib/creatary.js";
     document.getElementsByTagName('head')[0].appendChild(js);
  })();
</script>
```
