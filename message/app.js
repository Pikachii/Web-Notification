'use strict';
async function pushNotification() {
    if((await Notification.requestPermission() !== 'granted')) return;

    const titleInputElem = document.getElementById('title');
    const bodyInputElem = document.getElementById('body');
    const res = await fetch('http://localhost:3000/api/sendMessage', {
        method: 'POST',
        body: JSON.stringify({ 
            payload: {
                title: titleInputElem.value || 'システムインテグレータで仕事してみない？',
                body: bodyInputElem.value || 'こちらから応募できるよ！',
                actions: [
                    { title: '新卒で応募する', action: 'https://recruit.sint.co.jp/newgraduate/' },
                    { title: '中途で応募する', action: 'https://recruit.sint.co.jp/career/' }
                ]
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(res);
}
