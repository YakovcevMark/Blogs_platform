import {WithId} from "mongodb";
import {SessionDeviceDB} from "../types/session-devices-db.model";
import {injectable} from "inversify";
import {sessionDevicesCollection} from "../../../db-settings";

@injectable()
export class SessionDevicesRepository {

    public getByDeviceId = async (deviceId: string): Promise<WithId<SessionDeviceDB> | null> => {
        return await sessionDevicesCollection.findOne({deviceId: deviceId});
    }

    public create = async (entity: SessionDeviceDB): Promise<string> => {
        const result = await sessionDevicesCollection.insertOne(entity);
        return String(result.insertedId);
    }

    public update = async (body: SessionDeviceDB): Promise<boolean> => {
        const resp = await sessionDevicesCollection.updateOne({deviceId: body.deviceId},
            {
                $set: {
                    title: body.title,
                    expireAt: body.expireAt,
                    ip: body.ip,
                    lastActiveDate: body.lastActiveDate,
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (deviceId: string): Promise<boolean> => {
        const response = await sessionDevicesCollection.deleteOne({deviceId: deviceId});
        return response.deletedCount > 0
    }

    public removeAllSessionsExceptCurrent = async (currentSessionDeviceId: string, userId: string): Promise<boolean> => {
        const response = await sessionDevicesCollection.deleteMany({
            userId,
            deviceId: {$ne: currentSessionDeviceId}
        });
        return response.deletedCount > 0
    }
}


