"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOneStudent = exports.createOneStudent = exports.getOneStudent = exports.getStuents = void 0;
const students_service_1 = require("../services/students.service");
const authentication_1 = require("./authentication");
const students_model_1 = __importDefault(require("../models/students.model"));
let student = new students_service_1.Students({ model: (0, students_model_1.default)() });
async function getStuents(req, res) {
    let resu = await (0, authentication_1.checkAuthorization)(req.headers);
    if (resu && resu.authorized) {
        let { page, page_count, locale } = req.query;
        if (!locale) {
            res.send(400).json({ success: false, message: "you must send locale " });
        }
        let records = await student.getAllStudents({ page, limit: page_count, locale: locale ? locale : 'en' });
        if (records) {
            res.status(200).json({ success: true, data: records });
        }
        else {
            res.status(400).json({ success: false, message: 'page number is required' });
        }
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.getStuents = getStuents;
async function getOneStudent(req, res) {
    let resu = await (0, authentication_1.checkAuthorization)(req.headers);
    if (resu && resu.authorized) {
        let { id, locale } = req.body;
        if (!id) {
            res.status(400).json({ success: false, message: 'id is required' });
            return;
        }
        if (!locale) {
            res.status(400).json({ success: false, message: 'locale is required' });
            return;
        }
        let result = await student.getOne({ id, locale });
        if (result) {
            res.status(200).json({ success: true, data: result });
        }
        res.status(400).json({ success: false });
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.getOneStudent = getOneStudent;
async function createOneStudent(req, res) {
    let resu = await (0, authentication_1.checkAuthorization)(req.headers);
    if (resu && resu.authorized) {
        let obj = req.body;
        if (obj) {
            let result = await student.createOne(obj);
            res.json({ data: result });
        }
        else {
            res.status(400).json({ success: false });
        }
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.createOneStudent = createOneStudent;
async function updateOneStudent(req, res) {
    let resu = await (0, authentication_1.checkAuthorization)(req.headers);
    if (resu && resu.authorized) {
        let body = req.body;
        if (body) {
            let result = await student.updateOne(body, body.id);
            res.json({ data: result });
        }
        res.status(400).json({ success: false });
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.updateOneStudent = updateOneStudent;
async function deleteOne(req, res) {
    let result = await (0, authentication_1.checkAuthorization)(req.headers);
    if (result && result.authorized) {
        let { id } = req.body;
        if (id) {
            let result = await student.remove(id);
            console.log(result);
            if (result && result.success) {
                res.status(200).json({ success: true, message: 'student has been deleted' });
            }
            else {
                res.status(400).json({ success: false, message: 'failed' });
            }
        }
    }
    else {
        res.status(403).json({ message: 'unauthenticated' });
    }
}
exports.deleteOne = deleteOne;
