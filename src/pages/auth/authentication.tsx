import {useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {z} from "zod";
import validator from "validator";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {Link, useNavigate} from "react-router";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import type {AuthValues, LoginValues, RegisterValues} from "@/pages/auth/type"
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {loginUser, registerUser} from "@/store/authSlice.ts";
import {toast} from "react-toastify";
import {UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";

const loginSchemaZod = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Too short!"),
});

const registerSchemaZod = z.object({
    firstName: z
        .string()
        .min(1, "Required")
        .max(100, "First name must be 100 characters or fewer"),
    lastName: z
        .string()
        .min(1, "Required")
        .max(100, "Last name must be 100 characters or fewer"),
    dateOfBirth: z.date({
        required_error: "Date of birth is required",
    }).nullable(),
    phoneNumber: z
        .string()
        .refine(val => validator.isMobilePhone(val, "sv-SE"), {
            message: "Invalid phone number"
        }),
    city: z
        .string()
        .min(1, "Required")
        .max(100, "City must be 100 characters or fewer"),
    street: z
        .string()
        .min(1, "Required")
        .max(100, "Street name must be 100 characters or fewer"),
    postalCode: z
        .string()
        .min(1, "Required")
        .max(10, "Postal code must be 10 characters or fewer"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Too short!"),
    confirmPassword: z.string(),
})
    .superRefine((values, ctx) => {
        if (values.password !== values.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                code: "custom",
                message: "Passwords must match",
            });
        }
    });

export default function Authentication() {
    const dispatch = useAppDispatch();
    const { loginStatus, registerStatus } = useAppSelector((state) => state.auth);


    const [isRegister, setIsRegister] = useState(false);
    const [date, setDate] = useState<Date>();

    const navigate = useNavigate();

    const registerInitialValues = {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        phoneNumber: "",
        city: "",
        street: "",
        postalCode: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const loginInitialValues = {
        email: "",
        password: "",
    };

    const handleSubmit = async (values: AuthValues) => {
        if (isRegister && date) {
            const registerValues = {...values as RegisterValues, dateOfBirth: format(date, "yyyy/MM/dd")};
            delete registerValues.confirmPassword;
            console.log(registerValues)
            const result = await dispatch(registerUser(registerValues));

            if (registerUser.fulfilled.match(result)) {
                toast.success('Registration successful!');
                // Redirect if needed, e.g., navigate("/login")
                // navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"]);
                setIsRegister(false)
            } else if (registerUser.rejected.match(result)) {
                console.log(result.payload)
                toast.error(`Registration failed: ${result.payload}`);
            }
            // console.log("Register:", submittingValues);
        } else {
            const submittingValues = values as LoginValues;

            const result = await dispatch(loginUser(submittingValues))

            if (loginUser.fulfilled.match(result)) {
                toast.success('Login successful!');
                navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"]);
                // Redirect if needed, e.g., navigate("/login")
            } else if (loginUser.rejected.match(result)) {
                console.log(result.payload)
                toast.error(`Login failed: ${result.payload}`);
            }
        }


    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#030712]">
            <Card className="max-w-md bg-transparent rounded-[4px] border-[#27272a]">
                <CardContent className="md:p-8 p-3">
                    <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <img className="w-1/3" src="/logo-white-background-transparent.png" alt="LTU"/>
                        <h2 className="text-4xl font-extrabold text-(--color-text-white)
                            libre-baskerville text-center">
                            Luleå University Library
                        </h2>
                    </div>
                    <Formik
                        enableReinitialize
                        initialValues={isRegister ? registerInitialValues : loginInitialValues}
                        validationSchema={toFormikValidationSchema(isRegister ? registerSchemaZod : loginSchemaZod)}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="flex flex-col gap-4 pt-4">
                                {isRegister && (
                                    <>
                                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                                            <div className="auth-input-style">
                                                <label htmlFor="firstName" className="auth-label-style">First name</label>
                                                <Field
                                                    name="firstName"
                                                    as={Input}
                                                    type="text"
                                                    className="auth-field-style"
                                                />
                                                <ErrorMessage
                                                    name="firstName"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                            </div>
                                            <div className="auth-input-style">
                                                <label htmlFor="lastName" className="auth-label-style">Last name</label>
                                                <Field
                                                    name="lastName"
                                                    as={Input}
                                                    type="text"
                                                    className="auth-field-style"
                                                />
                                                <ErrorMessage
                                                    name="lastName"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="auth-input-style">
                                            <label htmlFor="dob" className="auth-label-style">Date of birth</label>
                                            <div className="flex justify-center items-center">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-center text-left font-normal bg-transparent border border-[#2c2c2c] hover:bg-transparent cursor-pointer text-gray-400 hover:text-gray-400",
                                                                !date && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0 bg-[#111] border-[#2c2c2c]">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            className="bg-[#111] text-gray-400"
                                                            navClassName=""
                                                            monthClassName="flex flex-col gap-4"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="auth-input-style">
                                            <label htmlFor="phoneNumber" className="auth-label-style">Phone number</label>
                                            <Field
                                                name="phoneNumber"
                                                as={Input}
                                                type="text"
                                                className="auth-field-style"
                                            />
                                            <ErrorMessage
                                                name="phoneNumber"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">

                                            <div className="auth-input-style">
                                                <label htmlFor="city" className="auth-label-style">City</label>
                                                <Field
                                                    name="city"
                                                    as={Input}
                                                    type="text"
                                                    className="auth-field-style"
                                                />
                                                <ErrorMessage
                                                    name="city"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                            </div>
                                            <div className="auth-input-style">
                                                <label htmlFor="street" className="auth-label-style">Street</label>
                                                <Field
                                                    name="street"
                                                    as={Input}
                                                    type="text"
                                                    className="auth-field-style"
                                                />
                                                <ErrorMessage
                                                    name="street"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                            </div>
                                            <div className="auth-input-style">
                                                <label htmlFor="postalCode" className="auth-label-style">Postal code</label>
                                                <Field
                                                    name="postalCode"
                                                    as={Input}
                                                    type="text"
                                                    className="auth-field-style"
                                                />
                                                <ErrorMessage
                                                    name="postalCode"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="auth-input-style">
                                    <label htmlFor="email" className="auth-label-style">Email</label>
                                    <Field
                                        name="email"
                                        as={Input}
                                        type="email"
                                        className="auth-field-style"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div className="auth-input-style">
                                    <div className="flex justify-between">
                                        <label htmlFor="password" className="auth-label-style">Password</label>
                                        {!isRegister &&
                                            <Link to="/auth/password-reset" className="auth-label-style duration-200 hover:!text-white">Forgot password?</Link>}
                                    </div>
                                    <Field
                                        name="password"
                                        as={Input}
                                        type="password"
                                        className="auth-field-style"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                {isRegister && (
                                    <div className="auth-input-style">
                                        <label htmlFor="confirmPassword" className="auth-label-style">Confirm
                                            Password</label>
                                        <Field
                                            name="confirmPassword"
                                            as={Input}
                                            type="password"
                                            className="auth-field-style"
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                )}
                                <Button type="submit"
                                        disabled={isRegister ? registerStatus === 'loading' : loginStatus === 'loading'}
                                        className="cursor-pointer custom-btn">
                                    {isRegister ? "Create Account" : "Login"}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        return setIsRegister(!isRegister);
                                    }}
                                    className="text-sm duration-200 text-gray-400 hover:text-white mt-2 cursor-pointer"
                                >
                                    {isRegister
                                        ? "Already have an account? Login"
                                        : "Don't have an account? Register"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </div>
    );
}
