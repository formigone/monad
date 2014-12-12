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
 * @param {string} imgUrl
 * @param {string} question
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 *
 * @returns {Promise}
 */
MonadService.prototype.insert = function(imgUrl, question, x1, y1, x2, y2) {
    var url = '/index/insert-question';
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
        xhr.send('imageUrl=' + encodeURIComponent(imgUrl) + '&question=' + question + '&validPoints=' + x1 + ',' + y1 + ',' + x2 + ',' + y2);
    });

    return promise;
};

/**
 *
 * @param {MonadService} service
 * @constructor
 */
var MonadWidget = function(service) {
    var tmpl = '<div style="box-shadow: 0 5px 10px #aaa; width: 100%; margin: 0 auto;">' +
        '<h3 id="monadTitle" style="margin: 0; padding: 10px 20px; color: #fff; font-family: serif; font-weight: bold; font-size: 2em;">MONAD</h3>' +
        '<div id="monadScreen" style="margin: 0; padding: 0;">' +
        '<img src="http://media.ksl.com/monad-002.jpg" style="display: block; margin: 0 auto; width: 100%">' +
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
 * @param {HTMLElement} container
 */
MonadWidget.prototype.calculateXY = function(event) {
    var cumulativeOffset = function(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left
        };
    };
    var el = event.target;
    var offset = cumulativeOffset(el);
    var x_r = el.naturalWidth / el.width;
    var y_r = el.naturalHeight / el.height;
    var x = Math.round((event.pageX - offset.left) * x_r);
    var y = Math.round((event.pageY - offset.top) * y_r);

    return [x, y];
}

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

    this.img.addEventListener('mousemove', function(event){
        event.preventDefault();
    });

    this.img.addEventListener('click', function(event){
        event.preventDefault();

        if (solved) {
            return;
        }

        attempts += 1;

        if (attempts <= maxAttempts) {
            var cords = scope.calculateXY(event);
            var x = cords[0], y = cords[1];
            console.log(cords);

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
 * @param {string} questionEl
 * @constructor
 */
var MonadBuilder = function(service, img, target, imgEl, questionEl) {
    /** @type {MonadService} */
    this.service = service;

    this.img = document.getElementById(img);
    this.target = document.getElementById(target);
    this.imgIn = document.getElementById(imgEl);
    this.questionIn = document.getElementById(questionEl);

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
    this.service.insert(this.img.src, this.questionIn.value, this.ptStart.x, this.ptStart.y, this.ptEnd.x, this.ptEnd.y).then(function(res){
        alert('Success!');
    });
};

/**
 *
 * @param {MonadService} service
 * @param {string} canvas
 * @param {string} imgEl
 * @param {string} questionEl
 * @constructor
 */
var MonadCanvasBuilder = function(service, canvas, imgEl, questionEl) {
    /** @type {MonadService} */
    this.service = service;

    this.canvas = document.getElementById(canvas);
    this.imgIn = document.getElementById(imgEl);
    this.questionIn = document.getElementById(questionEl);

    this.mouseDown = false;
    this.ptStart = {x: 0, y: 0};
    this.ptEnd = {x: 0, y: 0};
    this.ptPoly = [];

    this.ctx = null;
    this.img = null;

    this.init();
};

/**
 *
 */
MonadCanvasBuilder.prototype.init = function(){
    var scope = this;
    this.imgIn.addEventListener('blur', scope.resetImage.bind(scope));

    this.canvas.addEventListener('dblclick', function(event){
        event.preventDefault();

        scope.mouseDown = false;
        scope.ptStart.x = 0;
        scope.ptStart.y = 0;
        scope.ptEnd.x = 0;
        scope.ptEnd.y = 0;
        scope.ptPoly = [];
    });

    this.canvas.addEventListener('mousedown', function(event){
        event.preventDefault();

        if (event.shiftKey) {
            scope.mouseDown = false;
            scope.ptStart.x = 0;
            scope.ptStart.y = 0;
            scope.ptEnd.x = 0;
            scope.ptEnd.y = 0;

            scope.ptPoly.push({x: event.offsetX, y: event.offsetY});
        } else {
            scope.mouseDown = true;
            scope.ptStart.x = event.offsetX;
            scope.ptStart.y = event.offsetY;
            scope.ptEnd.x = event.offsetX;
            scope.ptEnd.y = event.offsetY;

            scope.ptPoly = [];
        }

        scope.render();
    });

    this.canvas.addEventListener('mouseup', function(event){
        event.preventDefault();

        scope.mouseDown = false;

        if (!event.shiftKey) {
            scope.ptEnd.x = event.offsetX;
            scope.ptEnd.y = event.offsetY;
        }

        scope.render();
    });

    this.canvas.addEventListener('mousemove', function(event){
        event.preventDefault();

        if (scope.mouseDown) {
            scope.ptEnd.x = event.offsetX;
            scope.ptEnd.y = event.offsetY;

            scope.render();
        }
    });

    this.imgIn.focus();
};

/**
 *
 */
MonadCanvasBuilder.prototype.resetImage = function(){
    var img = new Image();
    var scope = this;

    img.onload = function(event){
        scope.img = event.target;
        scope.canvas.width = scope.img.naturalWidth;
        scope.canvas.height = scope.img.naturalHeight;
        scope.ctx = scope.canvas.getContext('2d');

        scope.ctx.drawImage(scope.img, 0, 0, scope.img.width, scope.img.height);
    };

    img.src = this.imgIn.value;
};

/**
 *
 * @param {number} dt Delta time
 */
MonadCanvasBuilder.prototype.render = function() {
    var poly = this.ptPoly;
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    if (poly.length > 0) {

        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.75)';
        this.ctx.fillRect(0, 0, this.img.width, this.img.height);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(poly[0].x, poly[0].y);

        for (var i = 1, len = poly.length; i < len; i++) {
            this.ctx.lineTo(poly[i].x, poly[i].y);
        }

        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
        this.ctx.restore();
    } else {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.75)';
        this.ctx.fillRect(0, 0, this.img.width, this.img.height);

        this.ctx.drawImage(this.img, this.ptStart.x, this.ptStart.y, (this.ptEnd.x - this.ptStart.x), (this.ptEnd.y - this.ptStart.y), this.ptStart.x, this.ptStart.y, (this.ptEnd.x - this.ptStart.x), (this.ptEnd.y - this.ptStart.y));
    }
};

MonadCanvasBuilder.prototype.save = function(){
    this.service.insert(this.img.src, this.questionIn.value, this.ptStart.x, this.ptStart.y, this.ptEnd.x, this.ptEnd.y).then(function(res){
        alert('Success!');
    });
};
