const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    maxHttpBufferSize: 1e20,
    pingTimeout: 7000,
    cors: { origin: "*" }
});
const { nanoid } = require('nanoid');
app.set('view engine', 'ejs');
const pino = require('pino-http')();
app.use(pino)
app.use(express.urlencoded({ extended: false, limit: '150mb' }));
app.use(express.static(__dirname + '/public'));

let users = []
let rooms = []
let rid

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat', { id: rid });
});

app.post('/chat', (req, res) => {
    if (req.query.mode === 'create') {
        rid = nanoid(6);
        rooms.push(rid);
        res.send({ id: 'okay' });
    } else if (req.query.mode === 'join') {
        if (rooms.includes(req.query.room)) {
            rid = req.query.room;
            res.send({ id: 'okay' });
        } else {
            res.send({ id: 'noroom' });
        }
    }
});

app.get('/join', (req, res) => {
    rid = req.query.room;
    res.redirect('/chat');
});

io.on('connection', (socket) => {
    socket.on('joinroom', (code) => {
            socket.join(code)
            console.log(`${socket.id} joined room ${code}`)
            users.push({ id: socket.id, room: code });
            // console.log(users);
            // console.log(socket.rooms);
    });
    socket.on('chat', (data) => {
        // console.log(data);
        // io.to(data.room).emit('alert', data.msg);
        // socket.broadcast.emit(data.msg);
        socket.to(data.room).broadcast.emit('alert', data.msg);
    });
    socket.on('image', (data) => {
        socket.to(data.room).broadcast.emit('img', data.msg);
    });
})

// http.listen(process.env.PORT || 3000, '192.168.0.8', () => {
//     console.log(`Started server at ${Date()}`)
// });

http.listen(process.env.PORT || 3000, () => {
    console.log(`Started server at ${Date()}`)
});