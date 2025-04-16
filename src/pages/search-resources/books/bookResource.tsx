import {Card, CardContent} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ReceivingBook} from "@/types/entitiesType.ts";

interface Props {
    book: Pick<ReceivingBook,
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
}

const BookResource = ({book}: Props) => {
    return (
        <Card className="rounded-xl shadow-md h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02]
                    hover:shadow-lg hover:ring-2 hover:ring-primary hover:ring-offset-2">
            <CardContent className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                    {/* Book image */}
                    <div className="w-full overflow-hidden flex-shrink-0 rounded-md border">
                        <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-full aspect-[3/4] object-cover rounded-md border border-muted shadow-sm"
                            loading="lazy"
                        />
                    </div>

                    {/* Middle: Book info */}
                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">By {book.author}</p>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                <p><strong>Publisher:</strong> {book.publisher} ({book.publishedYear})</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Language:</strong> {book.language}</p>
                                <p><strong>Category:</strong> {book.bookCategory.subject}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Badge variant="secondary">
                                {book.bookType === "COURSE_LITERATURE" ? "Course Literature" : "Public"}
                            </Badge>
                            <Badge variant={book.numberOfAvailableToBorrowCopies > 0 ? "default" : "destructive"}>
                                Available: {book.numberOfAvailableToBorrowCopies}/{book.numberOfCopies}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Action/Status */}
                <div className="mt-4">
                    <Button variant="default" className="w-full cursor-pointer">
                        {book.numberOfAvailableToBorrowCopies > 0 ? "Borrow" : "Reserve"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BookResource;
