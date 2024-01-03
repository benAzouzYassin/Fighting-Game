const io = require("socket.io")(3000, {
        cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    socket.on("join-room" , (roomId)=>{
        const room = io.sockets.adapter.rooms.get(roomId) || { size: 0 };
        if(room.size < 2){
            currentRoom = roomId
            io.to(socket.id).emit("player", room.size === 1 ? "rightPlayer" : "leftPlayer")
            socket.join(roomId)
            io.to(roomId).emit("room-joined" , "player joined")
        }
        if(room.size === 2 ){
            io.to(roomId).emit("start-game")
        }
    })   

    socket.on("keydown" ,({playerSide , key , gameRoom})=>{
        
        io.to(gameRoom).emit("movement", {playerSide , key , action : "keydown"})
    }) 
    
    socket.on("keyup" ,({ playerSide , key , gameRoom})=>{
        io.to(gameRoom).emit("movement", {playerSide , key , action : "keyup"})
    }) 
})