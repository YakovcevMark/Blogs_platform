type Code = {
    expired_in: Date;
    code: string;
}


export type UserDb = {
    login: string;
    email: string;
    createdAt: string;
    password: string;
    emailConformation: {
        codes: Code[]
        isConfirmed: boolean;
    }
    refreshTokens: string[]
}