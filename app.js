'use strict';
(async () => {
    const swReg = await navigator.serviceWorker.getRegistration();
    if(swReg){
        const currentSubscription = await swReg.pushManager.getSubscription();
        if (currentSubscription) {
        await currentSubscription.unsubscribe();
        }
        await swReg.unregister();
    }
    await navigator.serviceWorker.register('./serviceWorker.js');
    console.log('registered');
    const publicKey = await(await fetch('http://localhost:3000/api/vapidPublicKey')).text();
    const subscription = (
        await (await navigator.serviceWorker.ready)
        .pushManager.subscribe(
            { userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(publicKey) }
        )
    ).toJSON();
    await fetch('http://localhost:3000/api/registEndpoint', {
        method: 'POST',
        body: JSON.stringify({
            endpoint: subscription
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
})();

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

/**
 * 公開鍵(base64)をUint8Arrayに変換する(subscribeの引数用)
 * @param {*} base64String
 * @returns
 */
 const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };