"use strict";
// students-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcrypt"));
const SALT_WORK_FACTOR = 10;
function default_1() {
    const modelName = 'users';
    const schema = new mongoose_1.default.Schema({
        id: { type: mongoose_1.Types.ObjectId },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        creationDate: { type: Date, default: Date.now() },
        authenticated: { type: Boolean, default: false }
    }, {
        timestamps: true
    });
    schema.pre('save', function (next) {
        console.log('hashing password');
        var user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password'))
            return next();
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err)
                return next(err);
            // hash the password using our new salt
            if (user.password) {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err)
                        return next(err);
                    // override the cleartext password with the hashed 
                    console.log(hash, 'hashed');
                    user.password = hash;
                    next();
                });
            }
        });
    });
    schema.methods.comparePassword = function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err)
                return cb(err);
            cb(null, isMatch);
        });
    };
    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongoose_1.default.modelNames().includes(modelName)) {
        mongoose_1.default.deleteModel(modelName);
    }
    return mongoose_1.default.model(modelName, schema);
}
exports.default = default_1;
