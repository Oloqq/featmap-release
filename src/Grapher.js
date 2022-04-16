"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grapher = void 0;
const Collaborations_1 = require("../src/Collaborations");
const log_1 = require("./log");
class Grapher {
    spotify;
    current = new Set();
    next = new Set();
    closed = new Set();
    nodes = [];
    links = [];
    layer = 1;
    depth;
    curLayer = 0;
    static ApiPause = 100;
    constructor(spotify) {
        this.spotify = spotify;
        this.depth = 2;
    }
    async graph(id) {
        this.current.add(id);
        for (; this.curLayer < this.depth; this.curLayer++) {
            for (let artist of this.current) {
                await this.goThroughArtist(artist);
            }
            this.current = this.next;
            this.next = new Set();
        }
        Collaborations_1.Collaborations.fillLastLayer(this.nodes, this.current, this.depth);
        return {
            nodes: this.nodes,
            links: this.links
        };
    }
    async goThroughArtist(id) {
        let root, albums;
        try {
            root = (await this.spotify.getArtist(id));
            albums = await this.spotify.getAlbumsOfArtist(id);
        }
        catch (error) {
            return;
        }
        let collab = new Collaborations_1.Collaborations(root);
        for (let album of albums) {
            try {
                let tracks = await this.spotify.getTracksFromAlbum(album.id);
                collab.parseAlbum(tracks);
            }
            catch (APIError) {
                log_1.log.error(`oops ${album.id}`);
            }
            await new Promise(r => setTimeout(r, Grapher.ApiPause));
        }
        collab.resolve(this.current, this.next, this.closed, this.nodes, this.links, this.curLayer);
    }
}
exports.Grapher = Grapher;
