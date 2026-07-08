{
    let addFriend = function(){
    let newFriendLink = $('.add-friend-btn');
    newFriendLink.click(function(e){
        e.preventDefault();
        let self = this;

        $.ajax({
            type: 'post',
            url: $(self).attr('href'),
        }).done(function(data){
            let newFriend = newFriendDom(data.data.toUser, data.data.friendshipId);
            $('#user-friends>ul').prepend(newFriend);
            deleteFriend($(' .remove-friend', newFriend));

            new Noty({
                theme: 'relax',
                text: 'Friend Added!!!',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }).fail(function(err){
            console.log('error in completing the request');
        });
    })
}

    let newFriendDom = function(friend, friendshipId){
        return $(`<li id="friend-${ friendshipId }">
                    <img src="${ friend.avatar }" alt="${ friend.name }">

                    <a href="/users/profile/${ friend._id }" class="user-friend-name">${ friend.name }</a>

                    <a href="#" class="chat-with-friend remove-add-btn"
                        data-friend-id="${ friend._id }"
                        data-friend-name="${ friend.name }">Chat</a>

                    <a href="/friends/friendship/remove/${ friendshipId }" class="remove-friend remove-add-btn">Remove</a>
                </li>`);
    }

    let deleteFriend = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log('freind request delete:: ',data);
                    $(`#friend-${ data.data.to_user }`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Friend Deleted !!!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    let convertFriendToAjax = function(){
        $('#user-friends>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .remove-friend', self);
            deleteFriend(deleteButton);

        })
    }


    addFriend();
    convertFriendToAjax();
}
