/**
 * Monad - A monetizable ad-based captcha-like human verification system.
 */

// Load JS dependencies
var _http_protocol = location.protocol.contains('http') ? location.protocol : 'http:';
(function(deps){
    for(var i = 0; i < deps.length; i++) {
        var dep = document.createElement('script');
        dep.src = deps[i];
        document.head.appendChild(dep);
    }
})([
    _http_protocol + '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
]);

// Load Monad
Monad = function(el_id, form_var, api_base) {
    el_id = '#' + (el_id || 'monad'); 
    var el = $(el_id);
    el = el || $(document.currentScript).insertBefore($('<div/>').setAttr('id', el_id));
    this.el = el;
    this.form_var = form_var || 'monad_token';
    this.api_base = api_base || '';
}