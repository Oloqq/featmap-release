"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractId = void 0;
let extractId = {
    fromUri: function (uri) {
        let tmp = uri.split(':');
        if (tmp[0] !== 'spotify' || tmp[1] !== 'artist') {
            throw new Error('Bad uri');
        }
        return tmp[2];
    },
    fromLink: function (link) {
        let re = /^http.+artist\/(.+)\?si=.+$/;
        let matches = link.match(re);
        if (matches) {
            return matches[1];
        }
        else {
            throw new Error('Bad link');
        }
    },
    fromAny: function (input) {
        if (input.startsWith('http')) {
            return this.fromLink(input);
        }
        else {
            return this.fromUri(input);
        }
    }
};
exports.extractId = extractId;
