import * as mongoose from "mongoose";
import {RateLimitRecordDB} from "../types/rate-limit-record";

const RateLimitRecordSchema = new mongoose.Schema<RateLimitRecordDB>({
    ip: String,
    url: String,
    date: {type: Date, required: true, expires: 10},
});

export const RateLimitRecordModel = mongoose.model('RateLimitRecordSchema', RateLimitRecordSchema);