'use strict';
(async function () {
    navigator.serviceWorker.register('./serviceWorker.js');
    console.log('registered');
})();
