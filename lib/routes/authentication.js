"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = exports.getUser = exports.resetPassword = exports.logout = exports.signUp = exports.signIn = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const users_service_1 = require("../services/users.service");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
let user = new users_service_1.Users({ model: (0, users_model_1.default)() });
let secretKey = "jkdaljskjlKEjlaeijf3rew9ofenpKjfldjs(#2u2nldknfL";
async function signIn(req, res) {
    let token = null;
    let { username, password } = req.body;
    if (!Boolean(username) || !Boolean(password)) {
        res.status(400).json({ message: 'username/ password are required' });
        return;
    }
    let result = await user.findOne({ username });
    if (result) {
        if (result.success) {
            let { data } = result;
            let matched = await comparePassword(password, username);
            if (!matched) {
                res.status(403).json({ succes: false, message: 'entered password is wrong' });
                return;
            }
            else {
                try {
                    //Creating jwt token
                    user.setAuthecticate(username, true);
                    token = jwt.sign({ username: data.username, firstname: data.firstname }, secretKey);
                }
                catch (err) {
                    console.log(err);
                    const error = new Error("Error! Something went wrong.");
                }
            }
        }
        else {
            res.status(401).json({ result });
        }
    }
    if (token) {
        res.status(200)
            .json({
            success: true,
            data: {
                data: result === null || result === void 0 ? void 0 : result.data,
                token: token,
            },
        });
    }
    else {
        res.status(400).json({ success: false });
    }
}
exports.signIn = signIn;
async function signUp(req, res, next) {
    let { username, password, firstname, lastname } = req.body;
    if (!Boolean(username)) {
        res.status(400).json({ success: false, message: 'you have to enter username' });
        return;
    }
    if (!Boolean(password)) {
        res.status(400).json({ success: false, message: 'you have to enter password' });
        return;
    }
    if (!Boolean(firstname)) {
        res.status(400).json({ success: false, message: 'you have to enter firstname' });
        return;
    }
    if (!Boolean(lastname)) {
        res.status(400).json({ success: false, message: 'you have to enter lastname' });
        return;
    }
    let token = null;
    let { success, data } = await user.createOne({ ...req.body, authenticated: true });
    if (success) {
        try {
            token = jwt.sign({ usename: data.username, firstname: data.firstname }, secretKey);
            if (token) {
                res.status(201).json({ success: true, data: {
                        data,
                        token: token,
                    }, });
            }
            else {
                res.status(500).json({});
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        res.status(400).json({ success, data });
    }
}
exports.signUp = signUp;
async function logout(req, res, next) {
    let result = await checkAuthorization(req.headers);
    if (result && result.authorized) {
        let new_res = user.setAuthecticate(result.data.username, false);
        res.status(200).json(new_res);
    }
    else {
        res.status(400).json({ success: false, message: 'unauthenticated' });
    }
}
exports.logout = logout;
async function resetPassword(req, res, next) {
    let { username, old_password, new_password } = req.body;
    let result = await checkAuthorization(req.headers);
    console.log(result, 'check auth');
    if (result && result.authorized) {
        let matched = await comparePassword(old_password, username);
        console.log('matched', matched);
        if (!matched) {
            res.status(400).json({ succes: false, message: 'your entered password is wrong' });
            return;
        }
        else {
            console.log('new password salting');
            bcrypt.genSalt(10, function (err, salt) {
                if (err)
                    return;
                // hash the password using our new salt
                if (new_password) {
                    bcrypt.hash(new_password, salt, async function (err, hash) {
                        if (err)
                            return;
                        // override the cleartext password with the hashed
                        let result = await user.passwordReset(username, hash);
                        console.log(result, 'result');
                        res.status(200).json(result);
                        return;
                    });
                }
            });
        }
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.resetPassword = resetPassword;
async function getUser(req, res) {
    console.log('get user', req.query);
    let { username } = req.query;
    let resu = await user.getUser(username);
    res.json({ data: resu });
}
exports.getUser = getUser;
async function checkAuthorization(headers) {
    var _a;
    const token = headers.authorization.split(' ')[1];
    if (!token) {
        return { authorized: false, data: { message: 'unauthorized' } };
    }
    else {
        try {
            let decoded = jwt.verify(token, secretKey);
            let result = null;
            if (decoded && decoded.username) {
                result = await user.isAuthenticated(decoded.username);
                return { authorized: result ? (_a = result.data) === null || _a === void 0 ? void 0 : _a.authenticated : false, data: decoded };
            }
        }
        catch (err) {
            return { authorized: false, data: null };
        }
    }
}
exports.checkAuthorization = checkAuthorization;
async function comparePassword(password, username) {
    let matched = false;
    let result = await user.findOne({ username });
    console.log('compare password', result);
    if (result === null || result === void 0 ? void 0 : result.success) {
        // bcrypt.compare(password, result.data.password, function(err, isMatch) {
        //     if (err) matched= false;
        //    return isMatch
        // });
        matched = await bcrypt.compare(password, result.data.password);
        return matched;
    }
    else {
        return false;
    }
}
