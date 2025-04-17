import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { removeFromCart } from "@/store/libraryActionsSlice"; // Adjust this import to your actual path

interface CartItem {
    id: string;
    title: string;
    imageUrl: string;
}

interface SectionProps {
    label: string;
    items: CartItem[];
    type: "borrow" | "reserve";
    kind: "book" | "film";
    currentPage: number;
    setPage: (page: number) => void;
}

const ITEMS_PER_PAGE = 5;

const CartTableSection = ({
                              label,
                              items,
                              type,
                              kind,
                              currentPage,
                              setPage
                          }: SectionProps) => {
    const dispatch = useDispatch();

    const handleRemove = (id: string) => {
        dispatch(removeFromCart({ id, type, kind }));
    };

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    }, [items, currentPage]);

    if (items.length === 0) return null;

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-2">
            <h3 className="text-md font-semibold p-2 pl-4 text-muted-foreground">{label}</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell className="text-right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded" />
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => handleRemove(item.id)}>
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => setPage(i + 1)}
                                    isActive={currentPage === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default CartTableSection;
