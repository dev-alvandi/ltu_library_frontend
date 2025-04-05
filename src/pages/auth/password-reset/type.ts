export type RequestPasswordResetValues = {
    email: string;
}

export type PasswordResetValues = {
    token?: string | undefined;
    password: string;
    confirmPassword: string;
}