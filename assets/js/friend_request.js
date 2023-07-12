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
                console.log('inside friend data::: ',data);
                
                let addNewFriend = data.toUser;
                if(addNewFriend){
                    const friendList = document.getElementById('friend-list');
                    const friendListItem = document.createElement('li');
                    friendListItem.textContent = addNewFriend.name;
                    friendList.appendChild(listItem);
                }
            }).fail(function(err){
                console.log('error in completing the request');
            });
        });
    }
}


// function addFriend(userId) {
//     console.log('add friend');

//     // Find the selected user in the user list
//     const selectedUser = User.find(user => user.id === userId);

//     // Check if the user exists
//     if(selectedUser){
//         // Add the friend to the friend list
//         const friendList = document.getElementById('friend-list');
//         const listItem = document.createElement('li');
//         listItem.textContent = selectedUser.name;
//         friendList.appendChild(listItem);
//     }
// }