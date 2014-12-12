(function(){
    var monadService = new MonadService();
    var builder = new MonadBuilder(monadService, 'monadImg', 'imgUrl', 'x1', 'y1', 'x2', 'y2');

    var submit = document.getElementById('submit');
    submit.addEventListener('click', function(event){
        builder.save();
    })
}());
