let express = require('express');
let socketIO = require('socket.io');

const PORT = 8081;
const app = express();
app.use(express.static('public'));
const handleListening = () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
};

app.get('/', (req, res) => {
  //   res.send('231')
  //   res.sendFile('index.html');
  //   res.end();
});
const server = app.listen(PORT, handleListening);
const io = socketIO.listen(server);

let sockets = [];
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});


setInterval(() => {
  console.log(sockets);
}, 3000);
