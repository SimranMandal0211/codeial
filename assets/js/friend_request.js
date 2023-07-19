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
                    const image = document.createElement('img');
                    const aTag = document.createElement('a');
                    const remove = document.createElement('a');
                    // friendListItem.textContent = addNewFriend.name;
                    image.src=addNewFriend.avatar;
                    friendListItem.appendChild(image);


                    aTag.textContent=addNewFriend.name;
                    friendListItem.appendChild(aTag);
                    aTag.classList.add('user-friend-name');


                    remove.textContent = 'Remove';
                    friendListItem.appendChild(remove); 
                    remove.classList.add('remove-add-btn');                   

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
