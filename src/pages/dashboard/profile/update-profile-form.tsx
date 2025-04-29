import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/store/store";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import {updateProfile} from "@/store/userSlice.ts";
import {User} from "@/types/entitiesType.ts";
import {toast} from "react-toastify";

const profileInfoSchema = z.object({
    firstName: z.string().min(1, "Required").max(100),
    lastName: z.string().min(1, "Required").max(100),
    email: z.string().email("Invalid email"),
    city: z.string().min(1, "Required"),
    street: z.string().min(1, "Required"),
    postalCode: z.string().min(1, "Required").max(10),
    phoneNumber: z.string().refine(val => validator.isMobilePhone(val, "sv-SE"), {
        message: "Invalid phone number"
    }),
});

const UpdateProfileForm = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        street: "",
        postalCode: "",
        phoneNumber: "",
    });

    useEffect(() => {
        if (user) {
            setInitialValues({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                city: user.city || "",
                street: user.street || "",
                postalCode: user.postalCode || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user]);

    const handleSubmit = async (values: typeof initialValues) => {
        console.log("Updated profile info:", values);
        const result = await dispatch(updateProfile(values as User));

        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated");
        } else {
            toast.error("Something went wrong during updating the profile");
        }

    };

    return (
        <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Edit Profile Info</h3>
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={toFormikValidationSchema(profileInfoSchema)}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                            <div className="auth-input-style">
                                <label htmlFor="firstName" className="auth-label-style">First name</label>
                                <Field name="firstName" as={Input} type="text" className="auth-field-style capitalize" />
                                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="auth-input-style">
                                <label htmlFor="lastName" className="auth-label-style">Last name</label>
                                <Field name="lastName" as={Input} type="text" className="auth-field-style capitalize" />
                                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>

                        <div className="auth-input-style">
                            <label htmlFor="email" className="auth-label-style">Email</label>
                            <Field name="email" as={Input} type="email" className="auth-field-style" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="auth-input-style">
                            <label htmlFor="phoneNumber" className="auth-label-style">Phone number</label>
                            <Field name="phoneNumber" as={Input} type="text" className="auth-field-style" />
                            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                            <div className="auth-input-style">
                                <label htmlFor="city" className="auth-label-style">City</label>
                                <Field name="city" as={Input} type="text" className="auth-field-style capitalize" />
                                <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="auth-input-style">
                                <label htmlFor="street" className="auth-label-style">Street</label>
                                <Field name="street" as={Input} type="text" className="auth-field-style capitalize" />
                                <ErrorMessage name="street" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="auth-input-style">
                                <label htmlFor="postalCode" className="auth-label-style">Postal code</label>
                                <Field name="postalCode" as={Input} type="text" className="auth-field-style" />
                                <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="custom-btn cursor-pointer mt-2">Update Profile</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateProfileForm;
