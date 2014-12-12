(function(){
    var monadService = new MonadService();
    var builder = new MonadBuilder(monadService, 'monadImg', 'monadTarget', 'imgUrl', 'question');

    var submit = document.getElementById('submit');
    submit.addEventListener('click', function(event){
        builder.save();
    })
}());
