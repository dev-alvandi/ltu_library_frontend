import { Card, CardContent } from "@/components/ui/card";
import UpdateProfileForm from "@/pages/dashboard/profile/update-profile-form.tsx";
import ChangePasswordForm from "@/pages/dashboard/profile/change-password-form.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useAppSelector} from "@/store/store.ts";
import DeleteAccount from "@/pages/dashboard/profile/delete-account.tsx";

const Profile = () => {

    const userType = useAppSelector((state) => state.auth.user?.userType?.toUpperCase().trim());

    return (
        <div className="flex justify-center items-center ">
            <Card className="max-w-3xl w-full bg-transparent border-0 rounded-[4px]">
                <CardContent className="p-6 md:p-10 gap-2">
                    <UpdateProfileForm />
                    <Separator className="my-6" />
                    <ChangePasswordForm />
                    {
                        userType && !["LIBRARIAN", "ADMIN"].includes(userType) && (
                            <DeleteAccount />
                        )
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
