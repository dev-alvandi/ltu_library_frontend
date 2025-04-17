import { useState } from "react";
import { Card } from "@/components/ui/card";
import CartTableSection from "./cart-table-section";
import { useAppSelector } from "@/store/store.ts";



const Cart = () => {
    const cart = useAppSelector((state) => state.libraryActions.cart);

    const borrowingBooks = cart.borrowingBooks;
    const borrowingFilms = cart.borrowingFilms;
    const reservingBooks = cart.reservingBooks;
    const reservingFilms = cart.reservingFilms;

    const [borrowBooksPage, setBorrowBooksPage] = useState(1);
    const [borrowFilmsPage, setBorrowFilmsPage] = useState(1);
    const [reserveBooksPage, setReserveBooksPage] = useState(1);
    const [reserveFilmsPage, setReserveFilmsPage] = useState(1);

    const isCartEmpty =
        borrowingBooks.length === 0 &&
        borrowingFilms.length === 0 &&
        reservingBooks.length === 0 &&
        reservingFilms.length === 0;

    return (
        <div className="space-y-6">
            {isCartEmpty ? (
                <div className="text-center p-10 shadow-sm">
                    <h2 className="text-xl font-semibold text-muted-foreground">Your cart is empty</h2>
                    <p className="text-sm text-muted-foreground">
                        Browse the library and add books or films to borrow or reserve.
                    </p>
                </div>
            ) : (
                <>
                    <Card>
                        <h2 className="text-lg font-semibold p-4">Borrowing Items</h2>
                        <CartTableSection
                            label="Books"
                            items={borrowingBooks}
                            type="borrow"
                            kind="book"
                            currentPage={borrowBooksPage}
                            setPage={setBorrowBooksPage}
                        />
                        <CartTableSection
                            label="Films"
                            items={borrowingFilms}
                            type="borrow"
                            kind="film"
                            currentPage={borrowFilmsPage}
                            setPage={setBorrowFilmsPage}
                        />
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold p-4">Reservation Items</h2>
                        <CartTableSection
                            label="Books"
                            items={reservingBooks}
                            type="reserve"
                            kind="book"
                            currentPage={reserveBooksPage}
                            setPage={setReserveBooksPage}
                        />
                        <CartTableSection
                            label="Films"
                            items={reservingFilms}
                            type="reserve"
                            kind="film"
                            currentPage={reserveFilmsPage}
                            setPage={setReserveFilmsPage}
                        />
                    </Card>
                </>
            )}
        </div>
    );
};

export default Cart;
