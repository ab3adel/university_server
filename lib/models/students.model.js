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
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
function default_1() {
    const modelName = 'students';
    const schema = new mongoose_1.default.Schema({
        id: { type: mongoose_1.Types.ObjectId },
        firstName_en: { type: String, required: true },
        firstName_ar: { type: String, required: true },
        lastName_en: { type: String, required: true },
        lastName_ar: { type: String, required: true },
        address_en: { type: String, required: true },
        address_ar: { type: String, required: true },
        CountryCode: { type: String, required: true },
        phoneNumber: { type: String, required: true, unique: true },
        creationDate: { type: Date, default: Date.now() },
        dateOfBirth: { type: Date, required: true },
    }, {
        timestamps: true
    });
    schema.plugin(mongoose_paginate_v2_1.default);
    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongoose_1.default.modelNames().includes(modelName)) {
        mongoose_1.default.deleteModel(modelName);
    }
    return mongoose_1.default.model(modelName, schema);
}
exports.default = default_1;
