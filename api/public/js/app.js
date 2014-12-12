(function(){
    var container = document.querySelector('[data-monad]');
    var monadService = new MonadService();
    var monad = new MonadWidget(monadService);

    monad.bindTo(container);
}());
