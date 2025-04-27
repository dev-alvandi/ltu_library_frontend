export type LoginValues = {
    email: string;
    password: string;
};

export type RegisterValues = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | undefined;
    phoneNumber: string;
    city: string;
    street: string;
    postalCode: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

export type AuthValues = LoginValues | RegisterValues;