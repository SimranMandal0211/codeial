const Chat = require('../models/chat');
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');

module.exports.chatSockets = function(socketServer, sessionStore, sessionSecret){
    let io = require('socket.io')(socketServer); //the object you use to broadcast to everyone, to specific rooms,  or to listen for new connections.


    // this is middleware -- session verification
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'codeial',
        secret: sessionSecret,
        store: sessionStore,
        success: function(data, accept){ accept(); },
        fail: function(data, message, error, accept){ accept(new Error(message)); }
    }));


    // this fires once per new client connecting.
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id, socket.request.user.email);



    socket.on('disconnect', function(){
        console.log('socket disconnected!');
    });



    // listen for this named event from this specific client
    socket.on('join_room', async function(data){
        console.log('joining request rec.', data);

        // adds this one socket to a named room. Rooms are just labels Socket.IO tracks internally - a socket can be in multiple rooms at once.

        socket.join(data.chatroom);
        io.in(data.chatroom).emit('user_joined', data);

        try {
            const history = await Chat.find({
                $or: [
                    { sender: data.sender, receiver: data.receiver },
                    { sender: data.receiver, receiver: data.sender }
                ]
            })
            .sort({ createdAt: 1 })
            .limit(50)
            .populate('sender');

            socket.emit('chat_history', history);
        } catch (err) {
            console.error('Error fetching chat history:', err);
        }
    });

    socket.on('send_message', async function(data){
        try {
            const msg = new Chat({
                sender: socket.request.user._id,  // trusted, from verified session
                receiver: data.receiver,
                message: data.message
            });

            await msg.save();

            // sends an event to every socket currently in the room
            io.in(data.chatroom).emit('receive_message', {
                message: data.message,
                sender: socket.request.user._id,
                user_name: socket.request.user.name,
                chatroom: data.chatroom
            });

            console.log('send_message:: ', data.message);
        } catch (err) {
            console.error('Error saving chat message:', err);
        }
    });
    });
}