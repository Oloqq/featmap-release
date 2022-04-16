"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLog = exports.log = void 0;
const simpleNodeLogger = require('simple-node-logger');
const logger = simpleNodeLogger.createSimpleLogger('logs/basic.log');
exports.log = logger;
function newLog(path) {
    return simpleNodeLogger.createSimpleLogger(path);
}
exports.newLog = newLog;
