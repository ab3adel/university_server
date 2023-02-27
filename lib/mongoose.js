"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
//etMEmPCgLqQovT8j
const MONGODB_URL = `mongodb+srv://mohammadismael78:etMEmPCgLqQovT8j@cluster0.l5on1r8.mongodb.net/?retryWrites=true&w=majority`;
const test = 'mongodb://127.0.0.1:27017';
async function default_1() {
    console.log('start connecting');
    await mongoose_1.default.connect(MONGODB_URL)
        .catch(err => {
        logger_1.default.error('err', err);
        process.exit(1);
    });
}
exports.default = default_1;
