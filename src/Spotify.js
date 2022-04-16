"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
const log_1 = require("./log");
let log = (0, log_1.newLog)("logs/spotify.log");
const urllib_1 = __importDefault(require("urllib"));
const TokenManager_1 = require("../src/TokenManager");
const albumLimit = 1;
const trackLimit = 1;
class APIError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }
        this.name = 'APIError';
    }
}
class Spotify {
    token;
    constructor(client_id, secret_key) {
        this.token = new TokenManager_1.TokenManager(client_id, secret_key);
    }
    async getArtist(id) {
        var result = await urllib_1.default.request(`https://api.spotify.com/v1/artists/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + await this.token.get()
            },
        });
        if (result.res.statusCode != 200) { // didn't succeed
            log.error(`Getting artist failed: `, `${result.res.statusCode}: ${result.res.statusMessage} `, `${result.data.toString()}`);
            throw new APIError(result.res.statusCode);
        }
        var info = JSON.parse(result.data.toString());
        return info;
    }
    async getAlbumsOfArtist(id, include_groups) {
        var result = await urllib_1.default.request(`https://api.spotify.com/v1/artists/${id}/albums?`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + await this.token.get()
            },
            data: {
                include_groups: include_groups,
                market: 'PL',
                limit: albumLimit, // TODO handle excessively active artists (over 50 albums)
            }
        });
        if (result.res.statusCode != 200) { // didn't succeed
            log.error(`Getting recent albums of an artist failed: `, `${result.res.statusCode}: ${result.res.statusMessage} `, `${result.data.toString()}`);
            throw new APIError(result.res.statusCode);
        }
        var albums = JSON.parse(result.data.toString()).items;
        // TODO use next to get all of the tracks
        // log.info(albums);
        return albums;
    }
    async getTracksFromAlbum(id) {
        var result = await urllib_1.default.request(`https://api.spotify.com/v1/albums/${id}/tracks?`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + await this.token.get()
            },
            data: {
                limit: trackLimit,
                market: "PL"
            }
        });
        if (result.res.statusCode != 200) { // didn't succeed
            log.error(`Getting tracks from album failed: ${result.res.statusCode}: ${result.res.statusMessage}. ${result.data.toString()}
      id: ${id}`);
            throw new APIError(result.res.statusCode?.toString());
        }
        var tracks = JSON.parse(result.data.toString()).items;
        // log.info(tracks);
        return tracks;
    }
}
exports.Spotify = Spotify;
