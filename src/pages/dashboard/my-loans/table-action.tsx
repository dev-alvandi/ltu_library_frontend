import {
    Dialog,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TableActionProps {
    id: string;
    title: string;
    status: "RETURNED" | "NOT_RETURNED" | "OVERDUE";
}

const TableAction = ({ id, title, status }: TableActionProps) => {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const isDialogOpen = openDialogId === id;

    if (status) return null;

    const isOverdue = !status;

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setOpenDialogId(open ? id : null)}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant={isOverdue ? "destructive" : "secondary"}
                    className="cursor-pointer"
                >
                    {isOverdue ? "Pay Fine" : "Extend"}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#030712] border-0">
                <DialogHeader>
                    <DialogTitle>{isOverdue ? "Pay Overdue Fine" : "Extend Loan"}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-300">
                    {isOverdue
                        ? `This loan is overdue. Are you sure you want to pay the fine for "${title}"?`
                        : `Are you sure you want to extend the loan for "${title}"?`}
                </DialogDescription>
                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={() => setOpenDialogId(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            console.log(isOverdue ? `Paid fine for: ${title}` : `Extended: ${title}`);
                            setOpenDialogId(null);
                        }}
                    >
                        {isOverdue ? "Pay Now" : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TableAction;
