const express = require('express');
const webPush = require('web-push');
const vapidKey = require('../../vapidPublicKey.json'); // generateKey.tsで生成したキーペア
const bodyParser = require('body-parser').json();

var router = express.Router();

webPush.setVapidDetails(
  'mailto:hoge@example.com',
  vapidKey.publicKey,
  vapidKey.privateKey,
);

/**
 * ブラウザにキーを公開するためのメソッド
 * (必ずしもapiで公開する必要はない。手順簡略化のため)
 */
router.get('/vapidPublicKey', bodyParser, async (req, res, next) => {
  return res.send(vapidKey.publicKey);
});

// endPoint保存用(Push通知送信先)
let endPoint = '';

/**
 * endPointをサーバに保存後するApi
 * (保存後、送信画面へリダイレクト)
 */
router.post('/registEndpoint', bodyParser, async (req, res, next) => {
  console.log('registEndpoint', req.body);
  endPoint = req.body['endpoint'];
  res.send();
});

/**
 * 登録されたendpointへメッセージを送信するApi
 * sendPush.jsから呼び出される
 */
router.post('/sendMessage', async (req, res, next) => {
  console.log('sendMessage', endPoint);
  console.log(req.body);
  try {
    const response = await webPush.sendNotification(
        endPoint,
        JSON.stringify(req.body['payload']),
    );

    return res.json({
      statusCode: response.statusCode || -1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;