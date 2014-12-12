(function(){
    var monadService = new MonadService();
    var builder = new MonadCanvasBuilder(monadService, 'monadCanvas', 'imgUrl', 'question');

    var submit = document.getElementById('submit');
    submit.addEventListener('click', function(event){
        builder.save();
    })
}());
