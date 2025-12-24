import {setupApp} from "../src/setup-app";
import express from "express";
import request from 'supertest'
import {HTTP_STATUS_CODES} from "../src/core/enums/http-status-codes";
import {RoutePaths} from "../src/models/paths";

const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));
describe(RoutePaths.devices, () => {
    const app = express();
    let sessionId: string | null = null;


    const getAll = async () => await request(app).get(RoutePaths.devices)

    beforeAll(async () => {
        await setupApp(app);
        await request(app).delete("/testing/all-data").expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    it('registration', async () => {

        const api = request.agent(app);
        const pass = 'awdzxca123';
        const registrationResult = await api
            .post(`${RoutePaths.auth}registration`)
            .send({ password: pass, login: 'awd1', email: 'test@mail.com' });

        const loginResult = await api
            .post(`${RoutePaths.auth}login`)
            .send({ password: pass, loginOrEmail: 'awd1' });

        const loginCookies = loginResult.headers['set-cookie'];

        const devicesListResult1= await api
            .get(`${RoutePaths.devices}`)
            .set('Cookie', loginCookies as any);

        expect(loginCookies).toBeDefined();

        await sleep(1100);

        const refreshTokenResult = await api
            .post(`${RoutePaths.auth}refresh-token`)
            .set('Cookie', loginCookies as any);

        const refreshTokenCookies = refreshTokenResult.headers['set-cookie'];

        expect(refreshTokenCookies).toBeDefined();

        const devicesListResult2 = await api
            .get(`${RoutePaths.devices}`)
            .set('Cookie', refreshTokenCookies as any);

        expect(devicesListResult1.body[0].deviceId).toBe(devicesListResult2.body[0].deviceId)
        expect(devicesListResult1.body.length).toBe(devicesListResult2.body.length)


        expect(registrationResult.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
        expect(loginResult.status).toBe(HTTP_STATUS_CODES.OK_200);
        expect(refreshTokenResult.status).toBe(HTTP_STATUS_CODES.OK_200);
        expect(devicesListResult2.status).toBe(HTTP_STATUS_CODES.OK_200);
    });

    // it('getAll', async () => {
    //     const resp = await getAll()
    //     expect(resp.status).toBe(HTTP_STATUS_CODES.OK_200)
    //     console.log(resp.body)
    //     sessionId = resp.body[0];
    //
    // })
    //
    // it('delete', async () => {
    //     const resp = await request(app).delete(`${RoutePaths.devices}123`)
    //     console.log(resp.status);
    //     expect(resp.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204)
    //
    // })
    // it('rate limit testing', async () => {
    //     const pass = 'awdzxca123'
    //     const resp1 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd1',
    //         email: 'test@mail.com'
    //     })
    //     const resp2 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd2',
    //         email: 'test1@mail.com'
    //     })
    //     const resp3 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd3',
    //         email: 'test2@mail.com'
    //     })
    //     const resp4 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd4',
    //         email: 'test3@mail.com'
    //     })
    //     const resp5 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd5',
    //         email: 'test4@mail.com'
    //     })
    //     const resp6 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //         password: pass,
    //         login: 'awd6',
    //         email: 'test5@mail.com'
    //     })
    //     let resp7;
    //     setTimeout(async () => {
    //         resp7 = await request(app).post(`${RoutePaths.auth}registration`).send({
    //             password: pass,
    //             login: 'awd8',
    //             email: 'test5@mail.com'
    //         })
    //         expect(resp7!.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204)
    //     },10000)
    //     expect(resp6.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429)
    //
    //
    // })

    // it('rate limit testing (login)', async () => {
    //     const pass = 'awdzxca123'
    //      await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     const resp2 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     const resp3 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     const resp4 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     const resp5 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     const resp6 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     await sleep(10000);
    //     let resp7 = await request(app).post(`${RoutePaths.auth}login`).send({
    //         password: pass,
    //         loginOrEmail: 'awd1',
    //     })
    //     expect(resp7.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401)
    //     expect(resp6.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429)
    //
    //
    // })


})

