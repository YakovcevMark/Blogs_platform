import {Collection, WithId} from "mongodb";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {SessionDeviceDB} from "../types/session-devices-db.model";
import {SessionDeviceViewModel} from "../types/session-device.output.model";


export class SessionDeviceQueryRepository {
    constructor(protected sessionDevicesCollection: Collection<SessionDeviceDB>) {
    }
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

        const items = await this.sessionDevicesCollection
            .find({userId})
            .toArray()


        return items.map(SessionDeviceQueryRepository.getViewModel)
    }

    public getByDeviceId = async (deviceId: string): Promise<SessionDeviceViewModel | null> => {
        const sessionDB = await this.sessionDevicesCollection.findOne({deviceId: deviceId});
        if (!sessionDB) return null;
        return SessionDeviceQueryRepository.getViewModel(sessionDB)

    }

    public isPersistInDb = async (deviceId: string): Promise<boolean> => {
        const result = await this.sessionDevicesCollection.countDocuments({deviceId})
        return result > 0
    }
}

