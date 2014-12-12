var MonadService = function() {
};

MonadService.prototype.getQuestion = function() {
    var url = '/index/get-question';
    var promise = new Promise(function (resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                resolve(resp.data);
            }
        };

        xhr.open('GET', url, true);
        xhr.send();
    });

    return promise;
};

MonadService.prototype.verify = function(adId, x, y) {
    var url = '/index/verify';
    var promise = new Promise(function (resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                resolve(resp.status);
            }
        };

        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send('id=' + adId + '&resp=' + x + ',' + y);
    });

    return promise;
};

/**
 *
 * @param {MonadService} service
 * @constructor
 */
var MonadWidget = function(service) {
    var tmpl = '<div style="box-shadow: 0 5px 10px #aaa; width: 640px; margin: 0 auto;">' +
        '<h3 id="monadTitle" style="margin: 0; padding: 10px 20px; color: #fff; font-family: serif; font-weight: bold; font-size: 2em;">MONAD</h3>' +
        '<div id="monadScreen" style="margin: 0; padding: 0;">' +
        '<img src="http://media.ksl.com/monad-002.jpg" style="display: block; margin: 0 auto;">' +
        '</div>' +
        '<div id="monadAction">' +
        '<p style="padding: 10px 20px; border-top: 4px solid #1E4D8C; font-weight: 300; font-family: sans-serif; font-size: 1.5em; color: #fff"></p>' +
        '</div>' +
        '</div>';

    /** @type {MonadService} */
    this.service = service;
    this.colors = {
        default: '#1E4D8C',
        success: '#1E8C5E',
        fail: '#8C1E1E'
    };

    this.widget = document.createElement('div');
    this.widget.innerHTML = tmpl;

    this.titleBar = this.widget.querySelector('#monadTitle');
    this.titleBar.style.backgroundColor = this.colors.default;
    this.img = this.widget.querySelector('#monadScreen img');
    this.img.style.display = 'none';
    this.actionBar = this.widget.querySelector('#monadAction');
    this.actionBarContent = this.widget.querySelector('#monadAction p');
    this.actionBar.style.backgroundColor = this.colors.default;
    this.actionBar.style.display = 'none';

    this.currentQuestion = {};

    this.init();
};

/**
 *
 * @param {HTMLElement} container
 */
MonadWidget.prototype.bindTo = function(container) {
    container.appendChild(this.widget);
};

/**
 *
 */
MonadWidget.prototype.init = function() {
    var scope = this;
    var attempts = 0;
    var maxAttempts = 3;
    var solved = false;

    this.service.getQuestion().then(function(question){
        scope.currentQuestion = question;
        scope.img.src = question.image;
        scope.img.style.display = 'block';

        scope.actionBarContent.textContent = question.question;
        scope.actionBar.style.display = 'block';
    });

    this.img.addEventListener('click', function(event){
        if (solved) {
            return;
        }

        attempts += 1;

        if (attempts < maxAttempts) {
            var x = event.offsetX;
            var y = event.offsetY;

            scope.actionBar.style.backgroundColor = scope.colors.default;
            scope.titleBar.style.backgroundColor = scope.colors.default;

            scope.service.verify(scope.currentQuestion.id, x, y).then(function(status){
                if(status) {
                    scope.titleBar.style.backgroundColor = scope.colors.success;
                    scope.actionBar.style.backgroundColor = scope.colors.success;

                    solved = true;

                    var successElement = document.createElement('input');
                    successElement.type = 'hidden';
                    successElement.name = 'monadStatus';
                    successElement.value = 'valid';
                    scope.widget.parentElement.appendChild(successElement);
                } else {
                    scope.titleBar.style.backgroundColor = scope.colors.fail;
                    scope.actionBar.style.backgroundColor = scope.colors.fail;
                }
            });
        } else {
            scope.widget.style.opacity = 0.25;
        }
    });
};

/**
 *
 * @param {MonadService} service
 * @param {string} img
 * @param {string} target
 * @param {string} imgEl
 * @constructor
 */
var MonadBuilder = function(service, img, target, imgEl) {
    /** @type {MonadService} */
    this.service = service;

    this.img = document.getElementById(img);
    this.target = document.getElementById(target);
    this.imgIn = document.getElementById(imgEl);

    this.mouseDown = false;
    this.ptStart = {x: 0, y: 0};
    this.ptEnd = {x: 0, y: 0};

    this.init();
};

/**
 *
 */
MonadBuilder.prototype.init = function(){
    var scope = this;
    this.imgIn.addEventListener('blur', function(event){
        scope.img.src = event.target.value;
    });

    this.img.parentElement.addEventListener('mousedown', function(event){
        event.preventDefault();

        scope.mouseDown = true;
        scope.target.style.display = 'block';
        scope.ptStart.x = event.offsetX;
        scope.ptStart.y = event.offsetY;
        scope.ptEnd.x = event.offsetX;
        scope.ptEnd.y = event.offsetY;
    });

    this.img.parentElement.addEventListener('mouseup', function(event){
        event.preventDefault();

        scope.mouseDown = false;
        scope.ptEnd.x = event.offsetX;
        scope.ptEnd.y = event.offsetY;
    });

    this.img.parentElement.addEventListener('mousemove', function(event){
        event.preventDefault();

        if (scope.mouseDown) {
            scope.ptEnd.x = event.offsetX;
            scope.ptEnd.y = event.offsetY;
        }
    });

    this.render(0);
};

/**
 *
 * @param {number} dt Delta time
 */
MonadBuilder.prototype.render = function(dt) {
    window.requestAnimationFrame(this.render.bind(this));

    this.target.style.left = this.ptStart.x + 'px';
    this.target.style.top = this.ptStart.y + 'px';
    this.target.style.width = (this.ptEnd.x - this.ptStart.x) + 'px';
    this.target.style.height = (this.ptEnd.y - this.ptStart.y) + 'px';
};

MonadBuilder.prototype.save = function(){
    console.log('saved');
};
