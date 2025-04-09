import {z} from "zod";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {PasswordResetValues} from "@/pages/auth/password-reset/type.ts";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {resetPassword} from "@/store/Authentication/authSlice.ts";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router";

const passwordResetSchemaZod = z.object({
    password: z.string().min(6, "Too short!"),
    confirmPassword: z.string(),
}).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            code: "custom",
            message: "Passwords must match",
        });
    }
});

const passwordResetValues = {
    password: "",
    confirmPassword: "",
}

const PasswordReset = () => {
    const dispatch = useAppDispatch();
    const {status} = useAppSelector((state) => state.auth);

    const { token } = useParams();
    const navigate = useNavigate();


    const handleSubmit = async (values: PasswordResetValues) => {
        const valuesWithToken = {...values, token}

        const result = await dispatch(resetPassword(valuesWithToken));

        if (resetPassword.fulfilled.match(result)) {
            toast.success('Password reset successful!');
            navigate("/auth");
        } else if (resetPassword.rejected.match(result)) {
            console.log(result.payload)
            toast.error(`Password reset failed: ${result.payload}`);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#030712]">
            <Card className="max-w-md bg-transparent rounded-[4px] border-[#27272a]">
                <CardContent className="md:p-8 p-3">
                    <div>
                        <h2 className="text-4xl font-extrabold text-(--color-text-white)
                            libre-baskerville py-3">
                            Reset Your Password
                        </h2>
                        <p className="text-gray-400">Submit your email and check your inbox for further
                            instructions.</p>
                    </div>
                    <Formik
                        enableReinitialize
                        initialValues={passwordResetValues}
                        validationSchema={toFormikValidationSchema(passwordResetSchemaZod)}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="flex flex-col gap-4 pt-4">
                                <div className="auth-input-style">
                                    <label htmlFor="password" className="auth-label-style">Password</label>
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
                                <Button type="submit"
                                        disabled={status === 'loading'}
                                        className="cursor-pointer custom-btn">
                                    Reset password
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordReset;