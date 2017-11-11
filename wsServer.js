var app = require('http').createServer()
var io = require('socket.io')(app)

var PORT = 3000

// 客户端计数
var clientCount = 0

// 用来存储客户端socket
var socketMap = {}
app.listen(PORT)

var Events = ['gameData', 'nextData', 'gameTime', 'gameScore', 'gameOver']

io.on('connection', socket => {
  clientCount = clientCount + 1
  socket.clientNum = clientCount
  socketMap[clientCount] = socket

  if (clientCount % 2 === 1) {
    socket.emit('waiting')
  } else {
    socket.emit('start')
    if (socketMap[(clientCount - 1)]) {
      socketMap[(clientCount - 1)].emit('start')
    }
  }
  var otherIndex = socket.clientNum % 2 === 0 ? socket.clientNum - 1 : socket.clientNum + 1
  Events.forEach(event => {
    socket.on(event, str => {
      if (socketMap[otherIndex]) {
        socketMap[otherIndex].emit(event, str)
      }
    })
  })
  socket.on('disconnect', str => {
    if (socketMap[otherIndex]) {
      socketMap[otherIndex].emit('leave', str)
    }
    delete socketMap[socket.clientNum]
  })
})
console.log('websocket listening on port ' + PORT)
