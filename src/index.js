"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const log_1 = require("./log");
const express_1 = __importDefault(require("express"));
const Spotify_1 = require("../src/Spotify");
const extractId_1 = require("../src/extractId");
const path_1 = __importDefault(require("path"));
const Grapher_1 = require("./Grapher");
// import { BodyParser } from "body-parser";
const app = (0, express_1.default)();
const session = require('express-session');
const useragent = require('express-useragent');
if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET) {
    throw new Error('Missing SPOTIFY_ID or SPOTIFY_SECRET environement variable');
}
const spotify = new Spotify_1.Spotify(process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET);
log_1.log.info('Booting up... ', Date());
// App config
app.use(express_1.default.static("public"));
app.use(useragent.express());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// app.use()
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
}));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, './views'));
// Routing
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});
app.post('/gimmedata', (req, res) => {
    console.log(req.body);
    let input_id = req.body['artist'];
    if (input_id) {
        input_id = input_id.toString();
        let id = extractId_1.extractId.fromAny(input_id);
        let g = new Grapher_1.Grapher(spotify);
        g.graph(id).then((data) => {
            // res.render('graph', {data: JSON.stringify(data)});
            res.send(data);
        });
    }
    // let kacp = fs.readFileSync(`${__dirname}/../data/Kacperczyk.json`);
    // res.send(kacp);
});
app.get('/featmap', (req, res) => {
    let input_id = req.query['artist'];
    if (input_id) {
        input_id = input_id.toString();
        let id = extractId_1.extractId.fromAny(input_id);
        let g = new Grapher_1.Grapher(spotify);
        g.graph(id).then((data) => {
            res.render('graph', { data: JSON.stringify(data) });
        });
    }
});
// Start the server
var listener = app.listen(process.env.PORT, () => {
    log_1.log.info(`App is listening on port ${listener.address().port}`);
});
// (async () => {
//   log.info('bruh');
//   log.info(await spotify.getTracksFromAlbum('7nySql4UFcZP60opHqnAMv'));
// })();
