module.exports.home = function(request, respond){
    
    console.log(request.cookie);
    respond.cookie('user_id', 25);


    return respond.render('home', {
        title: "home"
    });
    // return respond.end('<h1>Express is up for Codeal!</h1>');
}

//module.exports.actionName = function(request, respond){}