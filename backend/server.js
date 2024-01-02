const io = require("socket.io")(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    socket.on("game-room" , (roomId)=>{
        socket.join(roomId)
        console.log(socket.id , roomId)
        io.to(roomId).emit("room-join" , `${socket.id} joined the game`)
    })    
})