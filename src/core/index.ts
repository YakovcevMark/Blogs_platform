import {SmtpService} from "./application/smpt.service";
import {SmtpManager} from "./application/smtp.manager";
import {UsersRepository} from "../models/users/repositories/repo";
import {UsersService} from "../models/users/application/users.service";
import {AuthService} from "../models/auth/application/auth.service";
import {RefreshTokensService} from "./application/refrest-tokens.service";
import {RefreshTokensRepository} from "./repositories/refresh-token/refresh-token-db-repository";
import {RefreshTokensQueryRepository} from "./repositories/refresh-token/refresh-token-db.query-repository";
import {rateLimitsCollection, sessionDevicesCollection} from "../db-settings";
import {SessionDeviceRepository} from "../models/session-devices/repositories/repo";
import {SessionDeviceQueryRepository} from "../models/session-devices/repositories/query-repo";
import {SessionDevicesService} from "../models/session-devices/application/session-device.service";
import {RateLimitsService} from "./application/rate-limits-service";
import {RateLimitsRepository} from "./repositories/rate-limit/rate-limit-db-repository";
import {RateLimitsQueryRepository} from "./repositories/rate-limit/rate-limit-db-query-repository";

export const smtpService = new SmtpService()
export const usersRepository = new UsersRepository()
export const smtpManager = new SmtpManager(smtpService)
export const refreshTokensRepository = new RefreshTokensRepository();

export const refreshTokensQueryRepository = new RefreshTokensQueryRepository();
export const refreshTokensService = new RefreshTokensService(refreshTokensRepository);

export const sessionDevicesRepository = new SessionDeviceRepository(sessionDevicesCollection);
export const sessionDevicesQueryRepository = new SessionDeviceQueryRepository(sessionDevicesCollection);
export const sessionDevicesService = new SessionDevicesService(sessionDevicesRepository);



export const rateLimitsRepository = new RateLimitsRepository(rateLimitsCollection);
export const rateLimitsQueryRepository = new RateLimitsQueryRepository(rateLimitsCollection);
export const rateLimitsService = new RateLimitsService(rateLimitsRepository);



export const usersService = new UsersService(usersRepository);
export const authService = new AuthService(usersRepository, smtpManager, refreshTokensService, sessionDevicesService);
