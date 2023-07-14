
// frontend esteblishing
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

// this tell go and connect
// 1..
        this.socket = io.connect('http://localhost:5000'); //io - is gloable variable by socket.io file

        if(this.userEmail){
            this.connectionHandler();
        }
    }

// 3.. 
    connectionHandler(){
        this.socket.on('connect', function(){
            console.log('connection esteblished using sockets...!');
        });
    }
}