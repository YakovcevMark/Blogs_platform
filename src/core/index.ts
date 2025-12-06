import {SmtpService} from "./application/smpt.service";
import {SmtpManager} from "./application/smtp.manager";
import {UsersRepository} from "../models/users/repositories/repo";
import {UsersService} from "../models/users/application/users.service";
import {AuthService} from "../models/auth/application/auth.service";

export const smtpService = new SmtpService()
export const usersRepository = new UsersRepository()
export const smtpManager = new SmtpManager(smtpService)


export const usersService = new UsersService(usersRepository);
export const authService = new AuthService(usersRepository, smtpManager);
