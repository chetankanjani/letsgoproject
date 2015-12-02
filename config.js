//module.exports={
//    'port':process.env.port||8888,
//    'database':'mongodb://127.0.0.1:27017/local1',
//    'superSecret':'itsasecret'
//};

var config = {
    'port': process.env.port || 80,
    'database':'mongodb://127.0.0.1:27017/local1',
    'superSecret':'itsasecret'
};
config.facebook = {
    appId: process.env.FACEBOOK_APPID || '1244317075594321',
    appSecret: process.env.FACEBOOK_APPSECRET || 'e3d8a1a5d37fbbf0bf0a6723d9fdad51',
    appNamespace: process.env.FACEBOOK_APPNAMESPACE || 'nodescrumptious',
    redirectUrl: process.env.FACEBOOK_REDIRECTURI || 'http://localhost:8888/api/auth/facebook/callback'
};
module.exports = config;
