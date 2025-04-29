import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store/store";
import { deleteAccount } from "@/store/authSlice"; // Assuming you will create this thunk
import { toast } from "react-toastify";
import {useNavigate} from "react-router";
import {UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";

const DeleteAccount = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteAccount()).unwrap(); // safer with unwrap
            toast.success("Your account has been deleted.");
            navigate(UNAUTHENTICATED_NAVBAR_PATHS["Login | Register"]);
        } catch (error) {
            toast.error("Failed to delete account. Please try again.");
        }
        setOpen(false);
    };

    return (
        <div className="mt-6">
            <Separator className="my-6" />
            <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(true)}
                className="w-full"
            >
                Delete Account
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Confirm Account Deletion</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Are you absolutely sure? This action cannot be undone.
                        Your account and all associated data will be permanently deleted.
                    </DialogDescription>
                    <DialogFooter className="flex flex-col-reverse md:flex-row md:justify-end gap-2 mt-6">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={handleDelete}
                        >
                            Yes, Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DeleteAccount;
