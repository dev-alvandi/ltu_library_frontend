import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ReceivingBook } from "@/types/entitiesType.ts";
import {AppDispatch, useAppSelector} from "@/store/store.ts";
import { useNavigate } from "react-router";
import { UNAUTHENTICATED_NAVBAR_PATHS } from "@/constants.ts";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import {borrowBook} from "@/store/bookSlice.ts";
import {useDispatch} from "react-redux";
import {cn} from "@/lib/utils.ts";

interface Props {
    book: Pick<
        ReceivingBook,
        | "bookId"
        | "title"
        | "imageUrl"
        | "author"
        | "publisher"
        | "publishedYear"
        | "isbn"
        | "language"
        | "bookCategory"
        | "bookType"
        | "numberOfCopies"
        | "numberOfAvailableToBorrowCopies"
    >;
    userType: string;
}

const BookResource = ({ book, userType }: Props) => {
    const auth = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);

    const isBorrowable = book.numberOfAvailableToBorrowCopies > 0;

    const handleConfirmedAction = async () => {
        if (auth.user && auth.token) {
            if (isBorrowable) {
                const result = await dispatch(borrowBook(book.bookId));

                if (borrowBook.fulfilled.match(result)) {
                    toast.success("Successfully borrowed book!");
                } else if (borrowBook.rejected.match(result)) {
                    const error = result.payload || "Failed to borrow book!";
                    toast.error(error);
                }

            } else {
                toast.info(`Successfully reserved book!`);
            }
        } else {
            navigate(UNAUTHENTICATED_NAVBAR_PATHS["Login | Register"]);
            toast.info("Please login or register to borrow or reserve books.");
        }
        setOpen(false);
    };


    return (
        <Card
            className="rounded-xl shadow-md h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02]
      hover:shadow-lg hover:ring-2 hover:ring-primary hover:ring-offset-2"
        >
            <CardContent className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                    <div className="w-full overflow-hidden flex-shrink-0 rounded-md border">
                        <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-full aspect-[3/4] object-cover rounded-md border border-muted shadow-sm"
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">By {book.author}</p>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                <p>
                                    <strong>Publisher:</strong> {book.publisher} ({book.publishedYear})
                                </p>
                                <p>
                                    <strong>ISBN:</strong> {book.isbn}
                                </p>
                                <p>
                                    <strong>Language:</strong> {book.language}
                                </p>
                                <p>
                                    <strong>Category:</strong> {book.bookCategory.subject}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Badge variant="secondary">
                                {book.bookType === "COURSE_LITERATURE" ? "Course Literature" : "Public"}
                            </Badge>
                            <Badge variant={isBorrowable ? "default" : "destructive"}>
                                Available: {book.numberOfAvailableToBorrowCopies}/{book.numberOfCopies}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "mt-4 flex",
                        book.numberOfCopies > 0 && ["LIBRARIAN", "ADMIN"].includes(userType)
                            ? "justify-between"
                            : "justify-center"
                    )}
                >
                    {book.numberOfCopies > 0  && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="default"
                                    className={cn(!["LIBRARIAN", "ADMIN"].includes(userType) && "w-full" , "relative h-12 overflow-hidden group text-white font-semibold cursor-pointer")}
                                    onClick={() => !auth.user && navigate(UNAUTHENTICATED_NAVBAR_PATHS["Login | Register"])}
                                >
                                    {isBorrowable ? "Borrow" : "Reserve"}
                                    {/*/!* Original label *!/*/}
                                    {/*<span className="absolute inset-0 flex items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-full">*/}
                                    {/*    {isBorrowable ? "Borrow" : "Reserve"}*/}
                                    {/*</span>*/}
                                    {/*/!* Hover label *!/*/}
                                    {/*<span className="absolute inset-0 flex items-center justify-center transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">*/}
                                    {/*    Add to Cart*/}
                                    {/*</span>*/}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#030712] border-0">
                                <DialogHeader>
                                    <DialogTitle>
                                        {isBorrowable ? "Confirm Borrowing" : "Confirm Reservation"}
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-gray-300">
                                    Are you sure you want to {isBorrowable ? "borrow" : "reserve"} "{book.title}"?
                                </DialogDescription>
                                <DialogFooter className="mt-4">
                                    <Button className="cursor-pointer" variant="destructive" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button className="cursor-pointer" variant="default" onClick={handleConfirmedAction}>
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {userType && ["LIBRARIAN", "ADMIN"].includes(userType) && (
                        <Button
                            variant="default"
                            className="bg-[#3D90D7] relative h-12 overflow-hidden group text-white font-semibold cursor-pointer"
                            onClick={() => navigate(`/manage-resources/books/${book.bookId}`)}
                        >
                            Manage
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BookResource;