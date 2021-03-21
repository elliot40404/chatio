import { EmojiButton } from './emoji-button.js';
const socket = io();
const status = performance.getEntriesByType("navigation")

if (status[0].type == 'reload') {
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

const rv = `${location.href.split('/')[0]}//${window.location.host}/chat?mode=join&&room=${room}`;

document.getElementById('room').setAttribute('href', rv);
const qr = new QRious({
    element: document.getElementById('qr'),
    size: 150,
    value: rv
});

// const append = (e, c) => {
//     const div = document.createElement('div');
//     div.className = c;
//     div.innerText = e;
//     document.getElementById('chat').appendChild(div);
//     scroll();
// }

//  ! link detection

const append = (e, c) => {
    if (e.startsWith('http')) {
        const link = document.createElement('a');
        link.href = e;
        link.setAttribute('target', '_blank');
        link.className = c;
        link.innerText = e;
        document.getElementById('chat').appendChild(link);
    } else {
        const div = document.createElement('div');
        div.className = c;
        div.innerText = e;
        document.getElementById('chat').appendChild(div);
    }
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


document.getElementById('link').addEventListener('click', (e) => {
    document.getElementById('image').click();
});

document.getElementById('image').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        document.getElementById('preview').src = reader.result
    }
    reader.readAsDataURL(document.getElementById('image').files[0])
    document.getElementById('over').style.display = 'block';
});

document.getElementById('over').addEventListener('click', (e) => {
    document.getElementById('over').style.display = 'none';
});

//  !compression

document.getElementById('imgsend').addEventListener('click', (e) => {
    const img = document.createElement('img');
    img.className = 'timg-s'
    img.src = document.getElementById('preview').src
    document.getElementById('chat').appendChild(img);
    scroll();
    const options = {
        targetSize: 0.2,
        quality: 0.70,
    };
    const compress = new Compress(options);
    const files = [...document.getElementById('image').files];
    compress.compress(files).then((conversions) => {
        const { photo, info } = conversions[0];
        const reader = new FileReader();
        reader.readAsDataURL(photo.data);
        reader.onloadend = function () {
            socket.emit('image', { room: room, msg: reader.result });
        }
    });
});

socket.on('img', (data) => {
    const img = document.createElement('img');
    img.className = 'timg'
    img.src = data
    document.getElementById('chat').appendChild(img);
    scroll();
});



//  ! emoji

const picker = new EmojiButton();
const trigger = document.querySelector('.trigger');

picker.on('emoji', selection => {
    document.getElementById('text').value += selection.emoji;
});

// trigger.addEventListener('click', () => picker.togglePicker(trigger));