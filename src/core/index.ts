import {SmtpService} from "./application/smpt.service";
import {SmtpManager} from "./application/smtp.manager";
import {UsersRepository} from "../models/users/repositories/repo";
import {UsersService} from "../models/users/application/users.service";
import {AuthService} from "../models/auth/application/auth.service";
import {RefreshTokensService} from "./application/refrest-tokens.service";
import {RefreshTokensRepository} from "./repositories/refresh-token-db-repository";
import {RefreshTokensQueryRepository} from "./repositories/query.repository";

export const smtpService = new SmtpService()
export const usersRepository = new UsersRepository()
export const smtpManager = new SmtpManager(smtpService)
export const refreshTokensRepository = new RefreshTokensRepository();

export const refreshTokensQueryRepository = new RefreshTokensQueryRepository();
export const refreshTokensService = new RefreshTokensService(refreshTokensRepository);

export const usersService = new UsersService(usersRepository, refreshTokensService);
export const authService = new AuthService(usersRepository, smtpManager, refreshTokensService);
