// frontend esteblishing
class ChatEngine{
    constructor(chatBoxId, userEmail, userName, userId){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;
        this.userId = userId;
        this.receiverId = null;
        this.
        
        currentRoom = null;

        this.socket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin, {transports: ['websocket']});

        if (this.userEmail || this.userName){
            this.connectionHandler();
        }
    }

    // builds a deterministic room name shared by exactly these two users
    getRoomName(userA, userB){
        return [userA, userB].sort().join('_');
    }

    openChatWith(receiverId, receiverName){
        this.receiverId = receiverId;
        this.currentRoom = this.getRoomName(this.userId, receiverId);

        $('#chat-messages-list').empty(); // clear previous friend's messages from view

        this.socket.emit('join_room', {
            sender: this.userId,
            receiver: this.receiverId,
            chatroom: this.currentRoom
        });
    }

    connectionHandler(){
        let self = this;

        self.socket.on('user_joined', function(data){
            console.log('a user joined!', data);
        });

        this.socket.on('connect', function(){
            console.log('connection esteblished using sockets...!');
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val().trim();

            if (msg != '' && self.receiverId){
                self.socket.emit('send_message', {
                    message: msg,
                    sender: self.userId,
                    receiver: self.receiverId,
                    chatroom: self.currentRoom
                });
                $('#chat-message-input').val('');
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            self.renderMessage(data);
        });

        self.socket.on('chat_history', function(messages){
            messages.forEach(function(m){
                self.renderMessage({
                    message: m.message,
                    sender: m.sender._id || m.sender,
                    user_name: m.sender.name
                });
            });
        });
    }

    renderMessage(data){
        let newMessage = $('<li>');
        let messageType = (data.sender == this.userId) ? 'self-message' : 'other-message';

        newMessage.append($('<span>', { 'text': data.message }));
        newMessage.append($('<sub>', { 'html': data.user_name || this.userName }));
        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);
    }
}