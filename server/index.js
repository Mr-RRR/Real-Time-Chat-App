const express = require('express')
const app = express()
const cors = require("cors")

const { createServer } = require('http')
const { Server } = require('socket.io');
const httpServer = createServer(app)

app.use(cors())

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// io.attach(httpServer, {
//   pingInterval: 10000,
//   pingTimeout: 5000,
//   cookie: false
// });

// server.listen(5000);

io.on('connection', (socket) => {
    const id = socket.handshake.query.id
    console.log(id)
    socket.join(id)

    socket.on("send-message", ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit("receive-message", {
                recipients: newRecipients, sender: id, text
            })
        });
    })
})

httpServer.listen(5000, () => console.log("Server running on port 5000"))


// const io = require('socket.io')(5000)

// io.on('connection', socket => {
//   const id = socket.handshake.query.id
//   socket.join(id)

//   socket.on('send-message', ({ recipients, text }) => {
//     recipients.forEach(recipient => {
//       const newRecipients = recipients.filter(r => r !== recipient)
//       newRecipients.push(id)
//       socket.broadcast.to(recipient).emit('receive-message', {
//         recipients: newRecipients, sender: id, text
//       })
//     })
//   })
// })
