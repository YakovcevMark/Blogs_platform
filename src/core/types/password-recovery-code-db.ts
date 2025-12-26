export type PasswordRecoveryCodeDb = {
    email: string;
    code: string;
    expireAt: Date,
    isActive: boolean;
}