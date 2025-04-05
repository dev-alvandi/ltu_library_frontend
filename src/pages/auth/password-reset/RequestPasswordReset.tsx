import {z} from "zod";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {RequestPasswordResetValues} from "@/pages/auth/password-reset/type.ts";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {requestResetPassword} from "@/store/Authentication/authSlice.ts";
import {toast} from "react-toastify";

const requestPasswordResetSchemaZod = z.object({
    email: z.string().email("Invalid email"),
})

const requestPasswordResetValues = {
    email: ""
}

const fieldStyle = "border-[#27272a] rounded-[4px] text-white !px-2";
const labelStyle = "text-gray-500";
const inputStyle = "flex flex-col gap-2";

const RequestPasswordReset = () => {

    const dispatch = useAppDispatch();
    const { status } = useAppSelector((state) => state.auth);

    const handleSubmit = async (values: RequestPasswordResetValues) => {
        console.log(values)

        const result = await dispatch(requestResetPassword(values));

        if (requestResetPassword.fulfilled.match(result)) {
            toast.success('Registration successful!');
            // Redirect if needed, e.g., navigate("/login")
        } else if (requestResetPassword.rejected.match(result)) {
            console.log(result.payload)
            toast.error(`Registration failed: ${result.payload}`);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#030712]">
            <Card className="max-w-md bg-transparent rounded-[4px] border-[#27272a]">
                <CardContent className="!md:p-8 !p-3">
                    <div>
                        <h2 className="text-4xl font-extrabold text-(--color-text-white)
                            libre-baskerville !py-3">
                            Reset Your Password
                        </h2>
                        <p className="text-gray-400">Submit your email and check your inbox for further instructions.</p>
                    </div>
                    <Formik
                        enableReinitialize
                        initialValues={requestPasswordResetValues}
                        validationSchema={toFormikValidationSchema(requestPasswordResetSchemaZod)}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="flex flex-col gap-4 !pt-4">
                                <div className={inputStyle}>
                                    <label htmlFor="email" className={labelStyle}>Email</label>
                                    <Field
                                        name="email"
                                        as={Input}
                                        type="text"
                                        className={fieldStyle}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <Button type="submit"
                                        disabled={status === 'loading'}
                                        className="cursor-pointer bg-(--color-blue-theme) hover:bg-(--color-blue-theme)/50">
                                    Send the link
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequestPasswordReset;