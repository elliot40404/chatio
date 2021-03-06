// document.getElementById('join').addEventListener('click', () => {
//     const code = document.getElementById('code').value
//     if (code.length == 6) {
//         location.href = `/chat?mode=join&&room=${code}`
//     } else {
//         alert(`${code} invalid`);
//     }
// });

// document.getElementById('cr').addEventListener('click', () => {
//     location.href = '/chat?mode=create'
// });

//  !test code

import { qr } from'./scan.js';

document.getElementById('cr').addEventListener('click', async () => {
    // const req = await fetch(`http://192.168.0.8:3000/chat?mode=create`, {
    const req = await fetch(`https://50649e5267da.ngrok.io/chat?mode=create`, {
        method: 'POST',
    });
    const res = await req.json()
    if (res.id == 'okay') {
        location.href = '/chat';
    }
});

document.getElementById('join').addEventListener('click', async () => {
    const code = document.getElementById('code').value
    if (code.length == 6) {
        // const req = await fetch(`http://192.168.0.8:3000/chat?mode=join&room=${code}`, {
        const req = await fetch(`https://50649e5267da.ngrok.io/chat?mode=join&room=${code}`, {
            method: 'POST',
        });
        const res = await req.json()
        if (res.id == 'okay') {
            location.href = '/chat';
        } else {
            alert('No such room');
        }
    } else {
        alert(`${code} invalid`);
    }
});

document.getElementById('scan').addEventListener('click', (e) => {
    // location.href = '/qr';
    document.getElementById('ov').style.display = "grid"
    qr();
});

document.getElementById('ov').addEventListener('click', () => {
    document.getElementById('ov').style.display = "none"
})