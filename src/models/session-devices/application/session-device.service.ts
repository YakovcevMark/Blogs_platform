import {SessionDeviceRepository} from "../repositories/repo";
import {SessionDeviceDB} from "../types/session-devices-db.model";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";

export class SessionDevicesService {

    constructor(protected sessionDeviceRepository: SessionDeviceRepository) {
    }

    public create = async (body: SessionDeviceDB): Promise<string> => {
        return await this.sessionDeviceRepository.create(body);
    }

    public update = async (body: SessionDeviceDB): Promise<boolean> => {
        return await this.sessionDeviceRepository.update(body);
    }

    public remove = async (deviceId: string, userId: string): Promise<Result<{ isRemoved: boolean } | null>> => {
        const sessionDB = await this.sessionDeviceRepository.getByDeviceId(deviceId);

        if (!sessionDB) {
            return {
                status: SERVICE_RESULT_CODES.NOT_FOUND,
                errorMessage: 'not found',
                extensions: [{field: 'deviceId', message: 'not found'}]
            }
        }

        if (userId !== sessionDB.userId) {
            return {
                status: SERVICE_RESULT_CODES.FORBIDDEN,
                errorMessage: 'this session is not yours',
            }
        }

        const isRemoved = await this.sessionDeviceRepository.remove(deviceId);
        return {
            status: SERVICE_RESULT_CODES.OK,
            data: {isRemoved},
        }
    }

    public removeAllSessionsExceptCurrent = async (currentSessionDeviceId: string, userId:string): Promise<boolean> => {
        return await this.sessionDeviceRepository.removeAllSessionsExceptCurrent(currentSessionDeviceId, userId);
    }

    public clearDB = async () => {
        return await this.sessionDeviceRepository.clearDB();
    }

}
