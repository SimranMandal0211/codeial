{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostform = $('#new-post-form');
        newPostform.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostform.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                },error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    // method to create a post in DOM
    let newPostDom = function(post){

    }

    createPost();
}