import {setupApp} from "../src/setup-app";
import express from "express";
import request from 'supertest'
import {HTTP_STATUS_CODES} from "../src/core/enums/http-status-codes";
import {RoutePaths} from "../src/models/paths";
import {passwordRecoveryCodesCollection} from "../src/db-settings";
describe(RoutePaths.devices, () => {
    const app = express();



    beforeAll(async () => {
        await setupApp(app);
        await request(app).delete("/testing/all-data").expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    it('show login in user with new password', async () => {

        const api = request.agent(app);
        const pass = 'awdzxca123';
        const newPassword = 'new_password';

        const email = 'test@mail.com';
        const registrationResult = await api
            .post(`${RoutePaths.auth}registration`)
            .send({ password: pass, login: 'awd1', email });

        const recoverPassResult = await api.post(`${RoutePaths.auth}password-recovery`).send({email})

        const codes = await passwordRecoveryCodesCollection.find({}).toArray()

        const newPasswordResult = await api.post(`${RoutePaths.auth}new-password`).send({recoveryCode: codes[0].code, newPassword})

        const loginResult = await api.post(`${RoutePaths.auth}login`).send({loginOrEmail:email, password: newPassword})

        expect(registrationResult.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204)
        expect(recoverPassResult.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204)
        expect(codes.length).toBe(1)
        expect(newPasswordResult.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204)
        expect(loginResult.status).toBe(HTTP_STATUS_CODES.OK_200)
    });

})

