"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collaborations = void 0;
/*
FIXME if artist has several tracks with the same name (e.g. Intro)
only the first intro will be checked
*/
class Collaborations {
    root;
    feats = new Map(); // song to artists
    constructor(author) {
        this.root = author;
    }
    static artistLookup = new Map();
    static fillLastLayer(nodes, layer, layerN = 0) {
        layer.forEach((id) => {
            nodes.push({
                id: Collaborations.artistLookup.get(id).name,
                size: 1,
                layer: layerN
            });
        });
    }
    parseAlbum(tracks) {
        tracks.forEach((raw_track) => {
            let track_name = raw_track.name;
            this.feats.set(track_name, raw_track.artists
                .map((artist) => {
                let created = { name: artist.name, id: artist.id };
                Collaborations.artistLookup.set(created.id, created);
                return created;
            })
                .filter((artist) => { return artist.id !== this.root.id; }));
        });
    }
    resolve(current, next, closed, nodes, links, layer = 1) {
        current.delete(this.root.id);
        closed.add(this.root.id);
        nodes.push({
            id: this.root.name,
            size: 1,
            layer
        });
        let collaborators = new Map();
        this.feats.forEach((feats, _name) => {
            feats.forEach((artist) => {
                if (closed.has(artist.id))
                    return;
                if (!collaborators.has(artist.id)) {
                    collaborators.set(artist.id, 1);
                    if (!current.has(artist.id)) {
                        next.add(artist.id);
                    }
                }
                else {
                    collaborators.set(artist.id, collaborators.get(artist.id) + 1);
                }
            });
        });
        collaborators.forEach((size, colleague) => {
            links.push({
                source: this.root.name,
                target: Collaborations.artistLookup.get(colleague).name,
                size
            });
        });
    }
    // NOTE zeby sie pozbyc producentow na featach mozna by patrzec czy ktorys z wykonawcow nie jest wpisany jako producent
    // TODO check if song is unique by checking name and artists
    getTrackNum() {
        return this.feats.size;
    }
}
exports.Collaborations = Collaborations;
