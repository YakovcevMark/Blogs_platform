// tests/mongo.integration.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

// типы можно импортировать как type — они не выполняют реальный import на рантайме
import type { SmtpService } from '../src/core/application/smpt.service';
import type { UsersRepository } from '../src/models/users/repositories/repo';
import type { SmtpManager } from '../src/core/application/smtp.manager';
import type { UsersService } from '../src/models/users/application/users.service';
import type { AuthService } from '../src/models/auth/application/auth.service';
import request from "supertest";
import {authRouter} from "../src/models/auth/routes";
import {UserDb} from "../src/models/users/types/user.db.model";
import {WithId} from "mongodb";
import {BcryptService} from "../src/core/application/bcrypt.service";

let mongoServer: MongoMemoryServer;
let dbModule: typeof import('../src/db-settings');

let smtpService: SmtpService;
let usersRepository: UsersRepository;
let smtpManager: SmtpManager;
let usersService: UsersService;
let authService: AuthService;
let usersQueryRepository: typeof import('../src/models/users/repositories/query-repo')['usersQueryRepository'];

const email = 'email@gmail.com';
let login = 'login';
const password = 'password';
let user:WithId<UserDb> | null;
describe('integration with MongoMemoryServer', () => {
    beforeAll(async () => {
        // 1. Поднимаем in-memory Mongo
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // 2. Прокидываем URI в env
        process.env.MONGO_URL = uri;
        process.env.DB_NAME = 'test-db';

        // 3. Импортируем db-settings ПОСЛЕ установки env
        dbModule = await import('../src/db-settings');
        await dbModule.connectToDatabase(); // если тут ошибка — тест упадёт сразу

        // 4. Импортируем все сервисы/репы, которые зависят от БД
        const { SmtpService } = await import('../src/core/application/smpt.service');
        const { UsersRepository } = await import('../src/models/users/repositories/repo');
        const { SmtpManager } = await import('../src/core/application/smtp.manager');
        const { UsersService } = await import('../src/models/users/application/users.service');
        const { AuthService } = await import('../src/models/auth/application/auth.service');
        const { usersQueryRepository: uqr } = await import('../src/models/users/repositories/query-repo');

        smtpService = new SmtpService();
        usersRepository = new UsersRepository();
        smtpManager = new SmtpManager(smtpService);
        usersService = new UsersService(usersRepository);
        authService = new AuthService(usersRepository, smtpManager);
        usersQueryRepository = uqr;
    });

    afterAll(async () => {
        await dbModule.client.close();
        await mongoServer.stop();
    });

    it('should send email to user and create him in db', async () => {
        await authService.register({ email, login, password });

        const isUserWithLoginExist = await usersQueryRepository.isUserWithLoginExist(login);
        const isUserWithEmailExist = await usersQueryRepository.isUserWithEmailExist(email);
        user = await usersRepository.getUserByLoginOrEmail(email);

        expect(isUserWithEmailExist).toBe(true);
        expect(isUserWithLoginExist).toBe(true);
        expect(user!.emailConformation.isConfirmed).toBe(false);
    });

    it('resend email to exist user', async () => {
        expect(await authService.resendEmailConfirmationCode({email})).toBe(true);
    });


});
