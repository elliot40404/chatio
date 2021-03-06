const socket = io();
const status = performance.getEntriesByType("navigation")

if (status[0].type = 'reload') {
    const lroom = localStorage.getItem('room')
    socket.emit('joinroom', lroom);
    // document.getElementById('room').innerText = lroom
}

const room = document.getElementById('room').innerText;
socket.emit('joinroom', room);

document.getElementById('send').addEventListener('click', (e) => {
    const text = document.getElementById('text').value;
    if (text !== '') {
        socket.emit('chat', { room: room, msg: text });
        document.getElementById('text').value = '';
        append(text, 'msg-s');
        scroll();
    }
});

const scroll = () => {
    const scroll = document.getElementById('chat');
    scroll.scrollTop = scroll.scrollHeight;
}

socket.on('alert', (data) => {
    append(data, 'msg');
});

const div = document.createElement('div');
div.className = 'msg-s';
const src = document.createElement('img');
src.id = 'qr'
div.appendChild(src)
document.getElementById('chat').appendChild(div);
document.getElementById('room').setAttribute('href', `https://50649e5267da.ngrok.io/chat?mode=join&&room=${room}`);
// document.getElementById('room').setAttribute('href', `http://192.168.0.8:3000/chat?mode=join&&room=${room}`);
const qr = new QRious({
    element: document.getElementById('qr'),
    size: 150,
    // value: `http://192.168.0.8:3000/chat?mode=join&&room=${room}`
    value: `https://50649e5267da.ngrok.io/join?mode=join&&room=${room}`
});

const append = (e, c) => {
    const div = document.createElement('div');
    div.className = c;
    div.innerText = e;
    document.getElementById('chat').appendChild(div);
    scroll();
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
}); 
localStorage.setItem('room', room);

// window.addEventListener('focus', (e) => {
//     document.title = "ONLINE"
// })
// window.addEventListener('blur', (e) => {
//     document.title = "OFFLINE"
// })

document.getElementById('text').addEventListener('keypress', (e) => {
    if (e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault()
        document.getElementById('send').click()
    }
    if (e.key == 'Enter' && e.shiftKey) {
        e.preventDefault();
        console.log("insertLineBreak");
        const txtArea = document.getElementById('text');
        txtArea.value += '\r\n';
    }
})