"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
class Users {
    constructor(options) {
        this.model = undefined;
        this.model = options.model;
    }
    async findOne(query) {
        try {
            let record = await this.model.find({ username: query.username });
            if (record && record.length > 0) {
                return { success: true, data: record[0] };
            }
            else {
                return { success: false, data: 'anauthenticated' };
            }
        }
        catch (err) {
            return null;
        }
    }
    async createOne(data) {
        try {
            let record = new this.model(data);
            let res = await record.save();
            return { success: true, data: res };
        }
        catch (err) {
            return { success: false, data: err };
        }
    }
    async remove(id) {
        if (id) {
            try {
                let res = await this.model.deleteOne({ id });
                return { success: true, data: res };
            }
            catch (err) {
                return { success: false, data: err };
            }
        }
        else {
            return null;
        }
    }
    async isAuthenticated(username) {
        let record = null;
        try {
            record = await this.model.findOne({ username }, 'authenticated username');
            return { success: true, data: record };
        }
        catch (err) {
            return { success: false, data: err };
        }
    }
    async setAuthecticate(username, value) {
        let record = await this.model.findOneAndUpdate({ username }, { $set: { authenticated: value } });
        return { success: true, data: record };
    }
    async passwordReset(username, password) {
        try {
            let record = await this.model.findOneAndUpdate({ username }, { $set: { password } }, { returnOriginal: false });
            return { success: true, data: 'success' };
        }
        catch (err) {
            return { success: false, data: err };
        }
    }
    async getUser(username) {
        let res = await this.model.find({ username });
        return res;
    }
}
exports.Users = Users;
