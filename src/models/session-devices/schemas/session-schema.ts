import * as mongoose from "mongoose";
import {SessionDeviceDB} from "../types/session-devices-db.model";

const SessionDevicesSchema = new mongoose.Schema<SessionDeviceDB>({
    ip: {type: String, required:true},
    title: {type: String, required:true},
    deviceId: {type: String, required:true},
    lastActiveDate: {type: Date, required:true},
    expireAt: { type: Date, required: true, expires: 0 },
    userId: {type: String, required:true},
});

export const SessionDeviceModel = mongoose.model('SessionDevicesSchema', SessionDevicesSchema);