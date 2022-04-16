"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const urllib_1 = __importDefault(require("urllib"));
const { Base64 } = require("js-base64");
class TokenManager {
    expiration = new Date(0);
    token = "default-expired";
    basicAuth;
    constructor(client_id, secret_key) {
        this.basicAuth = "Basic " + Base64.encode(client_id + ":" + secret_key);
    }
    async get() {
        let now = new Date();
        if (now < this.expiration) {
            return this.token;
        }
        else {
            await this.refresh();
            return this.token;
        }
    }
    async refresh() {
        let result = await urllib_1.default.request("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": this.basicAuth,
            },
            data: {
                grant_type: "client_credentials"
            },
        });
        if (result.res.statusCode != 200) {
            throw new Error("Couldn't refresh token");
        }
        let data = JSON.parse(result.data.toString());
        this.expiration = new Date();
        this.expiration.setSeconds(this.expiration.getSeconds() + data.expires_in);
        this.token = data.access_token;
    }
}
exports.TokenManager = TokenManager;
