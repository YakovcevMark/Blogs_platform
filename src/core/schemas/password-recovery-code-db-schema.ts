import mongoose from "mongoose";
import {PasswordRecoveryCodeDb} from "../types/password-recovery-code-db";

const PasswordRecoveryCodeSchema = new mongoose.Schema<PasswordRecoveryCodeDb>({
    email: String,
    code: String,
    expireAt: {type: Date, required: true, expires: 0},
    isActive: Boolean,
});

export const PasswordRecoveryCodeModel = mongoose.model('PasswordRecoveryCodeDb', PasswordRecoveryCodeSchema);