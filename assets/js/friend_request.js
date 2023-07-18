class AddFriend{
    constructor(beFriends){
        this.beFriends = beFriends;
        this.AddFriend();
    }

    AddFriend(){
        $(this.beFriends).click(function(e){
            e.preventDefault();
            let self = this;

            console.log('add friend clicked');

            $.ajax({
                type: 'POST',
                url:$(self).attr('href'),
            }).done(function(data){
                console.log('Added friend data::: ',data.data.toUser.name);

                let addNewFriend = data.data.toUser;
                if(addNewFriend){
                    const friendList = document.getElementById('friend-list');
                    const friendListItem = document.createElement('li');
                    friendListItem.textContent = addNewFriend.name;
                    friendList.appendChild(friendListItem);
                }

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
        });
    }
}
