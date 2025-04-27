import {ErrorMessage, Field, Form, Formik} from "formik";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {z} from "zod";

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Required"),
    password: z.string().min(6, "Too short"),
    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            code: "custom",
            message: "Passwords must match",
        });
    }
});

const ChangePasswordForm = () => {
    const initialValues = {
        oldPassword: "",
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = (values: typeof initialValues) => {
        console.log("Password change values:", values);
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-semibold text-white mb-4">Change Password</h3>
            <Formik
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(changePasswordSchema)}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-4">
                        <div className="auth-input-style">
                            <label htmlFor="oldPassword" className="auth-label-style">Old Password</label>
                            <Field name="oldPassword" as={Input} type="password" className="auth-field-style"/>
                            <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm"/>
                        </div>

                        <div className="auth-input-style">
                            <label htmlFor="password" className="auth-label-style">New Password</label>
                            <Field name="password" as={Input} type="password" className="auth-field-style"/>
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
                        </div>

                        <div className="auth-input-style">
                            <label htmlFor="confirmPassword" className="auth-label-style">Confirm Password</label>
                            <Field name="confirmPassword" as={Input} type="password" className="auth-field-style"/>
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm"/>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" className="custom-btn cursor-pointer mt-2">Change Password</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePasswordForm;
