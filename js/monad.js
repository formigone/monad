/**
 * Monad - A monetizable ad-based captcha-like human verification system.
 */

// Load JS dependencies
var _http_protocol = location.protocol.contains('http') ? location.protocol : 'http:';
(function(deps){
    for(var i = 0; i < deps.length; i++) {
        /*var dep = document.createElement('script');
        dep.src = deps[i];
        document.head.appendChild(dep);*/

        // Forced synchronous approach
        var xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', deps[i], false);
        xhrObj.send('');
        var se = document.createElement('script');
        se.type = "text/javascript";
        se.text = xhrObj.responseText;
        document.head.appendChild(se);
    }
})([
    _http_protocol + '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
]);

// Load Monad
_Monad = function() {
    var _this = this;

    this.init = function(el_id, form_var, api_base) {
        el_id = '#' + (el_id || 'monad'); 
        var el = $(el_id);
        el = el || $($(document.currentScript).insertBefore($('<div/>').attr('id', el_id)));
        this.$el = el;
        this.form_var = form_var || 'monad_token';
        this.api_base = api_base || '/index/';

        this.build_monad();
        this.set_styles();
        this.set_events();

        return _this;
    }

    this.build_monad = function() {
        var img = $('<img/>');
        img.attr('id', 'monad_img');
        // For testing
        img.attr('src', '/img/monad/honda.jpg');
        this.$el.append(img);
    }

    this.set_styles = function() {
        this.$el.find('#monad_img').css({
            'max-width': '200px',
            'min-width': '200px',
            'width': '200px',
            'margin': '400px'
        });
    }

    this.set_events = function() {
        this.$el.find('#monad_img').click(function(ev) {
            _this.validate(_this.img_pos(ev));
        });
    }

    this.validate = function() {
        //
    }

    this.img_pos = function(ev) {
        var img = ev.target;
        var x, y;
        x_r = img.naturalWidth / img.width;
        y_r = img.naturalHeight / img.height;
        x = (ev.pageX - img.offsetLeft) * x_r;
        y = (ev.pageY - img.offsetTop) * y_r;
        return [x, y];
    }

    return this;
}

Monad = function() {
    var m = new _Monad();
    m.init.apply(m, arguments);
    document.Monad = m;
    return m;
}