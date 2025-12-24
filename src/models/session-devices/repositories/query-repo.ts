import {WithId} from "mongodb";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {SessionDeviceDB} from "../types/session-devices-db.model";
import {SessionDeviceViewModel} from "../types/session-device.output.model";
import {sessionDevicesCollection} from "../../../db-settings";
import {injectable} from "inversify";

@injectable()
export class SessionDevicesQueryRepository {

    static getViewModel = (session: WithId<SessionDeviceDB>): SessionDeviceViewModel => {
        const sessionDB = getMongoViewModel(session)
        return {
            deviceId: sessionDB.deviceId,
            title: sessionDB.title,
            ip: sessionDB.ip,
            lastActiveDate: new Date(sessionDB.lastActiveDate).toISOString(),
        }
    }


    public getAll = async (userId:string): Promise<SessionDeviceViewModel[]> => {

        const items = await sessionDevicesCollection
            .find({userId})
            .toArray()


        return items.map(SessionDevicesQueryRepository.getViewModel)
    }

    public getByDeviceId = async (deviceId: string): Promise<SessionDeviceViewModel | null> => {
        const sessionDB = await sessionDevicesCollection.findOne({deviceId: deviceId});
        if (!sessionDB) return null;
        return SessionDevicesQueryRepository.getViewModel(sessionDB)

    }

    public isPersistInDb = async (deviceId: string): Promise<boolean> => {
        const result = await sessionDevicesCollection.countDocuments({deviceId})
        return result > 0
    }
}

