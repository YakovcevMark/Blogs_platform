import {model, Schema} from "mongoose";

const CodeSchema = new Schema({
    expired_in: {type: Date, required: true, expires: 60},
    code: {type: String, required: true},
}, {_id: false})


const UserSchema =  new Schema({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    password: {type: String, required: true},
    emailConformation: {
        type: {
            codes: [CodeSchema],
            isConfirmed: {type: Boolean, required: true},
        }, required: true
    }
})
export const UserModel = model('UserSchema', UserSchema);