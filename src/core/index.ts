import 'reflect-metadata'
import {SmtpService} from "./application/smpt.service";
import {SmtpManager} from "./application/smtp.manager";
import {UsersRepository} from "../models/users/repositories/repo";
import {UsersService} from "../models/users/application/users.service";
import {SessionDevicesRepository} from "../models/session-devices/repositories/repo";
import {SessionDevicesQueryRepository} from "../models/session-devices/repositories/query-repo";
import {SessionDevicesService} from "../models/session-devices/application/session-device.service";
import {RateLimitsService} from "./application/rate-limits-service";
import {RateLimitsRepository} from "./repositories/rate-limit/rate-limit-db-repository";
import {RateLimitsQueryRepository} from "./repositories/rate-limit/rate-limit-db-query-repository";
import {Container} from "inversify";
import {UsersQueryRepository} from "../models/users/repositories/query-repo";
import {BlogsService} from "../models/blogs/application/blogs.service";
import {BlogsRepository} from "../models/blogs/repositories/db-repository";
import {BlogsQueryRepository} from "../models/blogs/repositories/query.repository";
import {PostsRepository} from "../models/posts/repositories/db-repository";
import {CommentsService} from "../models/comments/application/comments.service";
import {CommentsQueryRepository} from "../models/comments/repositories/query-repo";
import {PostsQueryRepository} from "../models/posts/repositories/query-repo";
import {CommentsRepository} from "../models/comments/repositories/repo";
import {PostsService} from "../models/posts/application/posts.service";
import {JwtService} from "./application/jwt.service";
import {BcryptService} from "./application/bcrypt.service";
import {AuthService} from "../models/auth/application/auth.service";
import {PasswordRecoveryCodesService} from "./application/password-recovery-codes.service";
import {
    PasswordRecoveryCodesRepository
} from "./repositories/password-recovery-codes/password-recovery-codes-repository";
import {LikesRepository} from "../models/likes/repositories/likes.repository";
import {LikesQueryRepository} from "../models/likes/repositories/likes.query.repository";

export const ioc: Container = new Container();

ioc.bind(JwtService).to(JwtService);

ioc.bind(BcryptService).to(BcryptService);

ioc.bind(AuthService).to(AuthService);

ioc.bind(SmtpService).to(SmtpService);
ioc.bind(SmtpManager).to(SmtpManager);

ioc.bind(SessionDevicesQueryRepository).to(SessionDevicesQueryRepository);
ioc.bind(SessionDevicesRepository).to(SessionDevicesRepository);
ioc.bind(SessionDevicesService).to(SessionDevicesService);

ioc.bind(RateLimitsQueryRepository).to(RateLimitsQueryRepository);
ioc.bind(RateLimitsRepository).to(RateLimitsRepository);
ioc.bind(RateLimitsService).to(RateLimitsService);

ioc.bind(UsersQueryRepository).to(UsersQueryRepository);
ioc.bind(UsersRepository).to(UsersRepository);
ioc.bind(UsersService).to(UsersService);

ioc.bind(BlogsQueryRepository).to(BlogsQueryRepository);
ioc.bind(BlogsRepository).to(BlogsRepository);
ioc.bind(BlogsService).to(BlogsService);

ioc.bind(PostsQueryRepository).to(PostsQueryRepository);
ioc.bind(PostsRepository).to(PostsRepository);
ioc.bind(PostsService).to(PostsService);

ioc.bind(CommentsQueryRepository).to(CommentsQueryRepository);
ioc.bind(CommentsRepository).to(CommentsRepository);
ioc.bind(CommentsService).to(CommentsService);

ioc.bind(PasswordRecoveryCodesRepository).to(PasswordRecoveryCodesRepository);
ioc.bind(PasswordRecoveryCodesService).to(PasswordRecoveryCodesService);

ioc.bind(LikesRepository).to(LikesRepository)
ioc.bind(LikesQueryRepository).to(LikesQueryRepository)


