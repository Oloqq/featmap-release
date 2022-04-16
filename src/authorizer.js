"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const { Base64 } = require('js-base64');
const urllib_1 = __importDefault(require("urllib"));
const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;
let token = '';
let expiration = new Date();
expiration.setMinutes(expiration.getMinutes() - 1);
async function getToken() {
    console.log('getting');
    let now = new Date();
    if (now < expiration) {
        return token;
    }
    return requestToken();
}
exports.token = getToken;
function authorize() {
    return 'Basic ' + Base64.encode(clientId + ':' + clientSecret);
}
async function requestToken() {
    console.log('reqiing');
    let result = await urllib_1.default.request('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': authorize(),
        },
        data: {
            grant_type: 'client_credentials'
        },
    });
    if (result.res.statusCode != 200) {
        throw 'bruh 1';
    }
    let data = JSON.parse(result.data.toString());
    console.log(data, data.access_token);
    expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + data.expires_in);
    token = data.access_token;
    return token;
}
