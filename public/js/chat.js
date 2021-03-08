const socket = io();
const status = performance.getEntriesByType("navigation")

if (status[0].type = 'reload') {
    const lroom = localStorage.getItem('room')
    socket.emit('joinroom', lroom);
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

const rv = `${window.location.host}/chat?mode=join&&room=${room}`;

document.getElementById('room').setAttribute('href', rv);
const qr = new QRious({
    element: document.getElementById('qr'),
    size: 150,
    value: rv
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


// document.getElementById('bt').addEventListener('click', (e) => {
//     const file = document.getElementById('file').files[0];
//     const reader = new FileReader();
//     reader.onloadend = function () {
//         console.log('RESULT', reader.result)
//         const i = document.createElement('img');
//         i.src = reader.result;
//         document.body.appendChild(i);
//     }
//     reader.readAsDataURL(file);
// });