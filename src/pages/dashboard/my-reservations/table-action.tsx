// TableAction.tsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TableActionProps {
    id: string;
    title: string;
    type: "REMOVE" | "BORROW";
    handleAction: (id: string) => void;
}

const TableAction = ({ id, title, type, handleAction }: TableActionProps) => {
    const [openDialog, setOpenDialog] = useState(false);

    if (type === "BORROW") {
        return (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">Borrow</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#030712] border-0">
                    <DialogHeader>
                        <DialogTitle>Confirm Borrowing</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to borrow <strong>{title}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button variant="default" onClick={() => {
                            handleAction(id);
                            setOpenDialog(false);
                        }}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Remove</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#030712] border-0">
                <DialogHeader>
                    <DialogTitle>Confirm Reservation Removal</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Are you sure you want to remove your reservation for <strong>{title}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                        handleAction(id);
                        setOpenDialog(false);
                    }}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TableAction;
