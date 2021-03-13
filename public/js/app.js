import { qr } from './scan.js';

document.getElementById('cr').addEventListener('click', async () => {
    const req = await fetch('/chat?mode=create', {
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
        const req = await fetch(`/chat?mode=join&room=${code}`, {
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
    import('./qr.js');
    document.getElementById('ov').style.display = "grid"
    qr();
});

document.getElementById('ov').addEventListener('click', () => {
    document.getElementById('ov').style.display = "none"
});

// ! PWA install

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // showInstallPromotion(); code for a install popup goes here
    console.log(`'beforeinstallprompt' event was fired.`);
});
const btn = document.getElementById('btn');
btn.addEventListener('click', async () => {
    // hideInstallPromotion(); hide popup
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
    // hideInstallPromotion();
    deferredPrompt = null;
    console.log('PWA was installed');
});