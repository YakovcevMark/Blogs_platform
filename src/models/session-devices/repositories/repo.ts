import {WithId} from "mongodb";
import {SessionDeviceDB} from "../types/session-devices-db.model";
import {injectable} from "inversify";
import {SessionDeviceModel} from "../schemas/session-schema";

@injectable()
export class SessionDevicesRepository {

    public getByDeviceId = async (deviceId: string): Promise<WithId<SessionDeviceDB> | null> => {
        return SessionDeviceModel.findOne({deviceId: deviceId});
    }

    public create = async (dto: SessionDeviceDB): Promise<string> => {
        const session = new SessionDeviceModel(dto);
        await session.save();
        return session.id;
    }

    public update = async (body: SessionDeviceDB): Promise<boolean> => {
        const resp = await SessionDeviceModel.updateOne({deviceId: body.deviceId},
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
        const response = await SessionDeviceModel.deleteOne({deviceId: deviceId});
        return response.deletedCount > 0
    }

    public removeAllSessionsExceptCurrent = async (currentSessionDeviceId: string, userId: string): Promise<boolean> => {
        const response = await SessionDeviceModel.deleteMany({
            userId,
            deviceId: {$ne: currentSessionDeviceId}
        });
        return response.deletedCount > 0
    }
}


