import { Card, CardContent } from "@/components/ui/card";
import UpdateProfileForm from "@/pages/dashboard/profile/update-profile-form.tsx";
import ChangePasswordForm from "@/pages/dashboard/profile/change-password-form.tsx";
import {Separator} from "@/components/ui/separator.tsx";

const Profile = () => {
    return (
        <div className="flex justify-center items-center ">
            <Card className="max-w-3xl w-full bg-transparent border-0 rounded-[4px]">
                <CardContent className="p-6 md:p-10 gap-2">
                    <UpdateProfileForm />
                    <Separator className="my-6" />
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
