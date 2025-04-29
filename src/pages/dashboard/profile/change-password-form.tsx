import {ErrorMessage, Field, Form, Formik} from "formik";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {z} from "zod";
import {updatePassword} from "@/store/userSlice.ts";
import {useAppDispatch} from "@/store/store.ts";
import {toast} from "react-toastify";

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(6, "Too short"),
    confirmNewPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            code: "custom",
            message: "Passwords must match",
        });
    }
});

const ChangePasswordForm = () => {
    const dispatch = useAppDispatch();

    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };

    const handleSubmit = async (values: typeof initialValues) => {

        const result = await dispatch(updatePassword(values));

        if (updatePassword.fulfilled.match(result)) {
            toast.success("Password updated");
        } else {
            toast.error("Something went wrong during updating the Password");
        }
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
                            <label htmlFor="newPassword" className="auth-label-style">New Password</label>
                            <Field name="newPassword" as={Input} type="password" className="auth-field-style"/>
                            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm"/>
                        </div>

                        <div className="auth-input-style">
                            <label htmlFor="confirmNewPassword" className="auth-label-style">Confirm Password</label>
                            <Field name="confirmNewPassword" as={Input} type="password" className="auth-field-style"/>
                            <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm"/>
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
