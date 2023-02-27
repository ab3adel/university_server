"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("./mongoose"));
const authentication_1 = require("./routes/authentication");
const stuedents_1 = require("./routes/stuedents");
const express_1 = __importDefault(require("express"));
// Don't remove this comment. It's needed to format import lines nicely.
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//app.use(body_parser.json())
(0, mongoose_1.default)();
//app.use(cors());
//app.use(compress());
// Host the public folder
// Set up Plugins and providers
// Configure other middleware (see `middleware/index.ts`)
// Configure a middleware for 404s and the error handler
app.get('/getUser', authentication_1.getUser);
//app.configure(Authenticate);
app.post('/login', authentication_1.signIn);
app.get('/logout', authentication_1.logout);
app.post('/signup', authentication_1.signUp);
app.post('/resetpassword', authentication_1.resetPassword);
app.get('/students', stuedents_1.getStuents);
app.get('/student', stuedents_1.getOneStudent);
app.delete('/deletestudent', stuedents_1.deleteOne);
app.put('/updatestudent', stuedents_1.updateOneStudent);
app.post('/createstudent', stuedents_1.createOneStudent);
app.use('/', express_1.default.static(__dirname + '/public'));
exports.default = app;
