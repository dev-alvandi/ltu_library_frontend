// User DTO
export type User = {
    userId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // YYYY/MM/DD
    phoneNumber: string;
    city: string;
    street: string;
    postalCode: string;
    email: string;
    password: string;
    userType: "ADMIN" | "LIBRARIAN" | "STUDENT" | "RESEARCHER" | "UNIVERSITY STAFF" | "PUBLIC"; // admin, librarian, student, researcher, university staff, public
};

// Book DTO
export type ReceivingBook = {
    bookId: string;
    title: string;
    author: string;
    publisher: string;
    publishedYear: number;
    isbn: string;
    language: string;
    imageUrl: string;
    bookType: 'COURSE_LITERATURE' | 'PUBLIC';
    numberOfCopies: number;
    numberOfAvailableToBorrowCopies: number;
    bookCategory: {
        bookCategoryId: string;
        subject: string;
    };
};

export type SendingBook = {
    bookId: string;
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishedYear: number;
    bookType: 'COURSE_LITERATURE' | 'PUBLIC';
    language: string;
    bookCategory: string
    image: File | null;
}

// Loan
export type Loan = {
    loanId: number;
    userId: number;
    loanDate: string;
};

// ItemLoan
export type ItemLoan = {
    itemLoanId: number;
    loanId: number;
    bookCopyId?: number | null;
    filmCopyId?: number | null;
    dueDate: string;
};

// BookCopy
export type BookCopy = {
    bookCopyId: number;
    bookId: number;
    barcode: string;
    physicalLocation: string;
    status: 0 | 1 | 2; // 0 = available, 1 = lost, 2 = borrowed
    isReferenceCopy: 0 | 1;
};

// BookCategory
export type BookCategory = {
    bookCategoryId: number;
    subject: string;
};

// Film
export type Film = {
    filmId: number;
    title: string;
    director: string;
    ageRating: number;
    country: string;
    imageUrl: string;
    filmCategoryId: number;
};

// FilmCopy
export type FilmCopy = {
    filmCopyId: number;
    filmId: number;
    barcode: string;
    physicalLocation: string;
    status: 0 | 1 | 2; // 0 = available, 1 = lost, 2 = borrowed
    isReferenceCopy: 0 | 1;
};

// FilmCategory
export type FilmCategory = {
    filmCategoryId: number;
    genre: string;
};

// Magazine
export type Magazine = {
    magazineId: number;
    title: string;
    issueNumber: string;
    publicationDate: string;
    imageUrl: string;
    magazineCategoryId: number;
};

// MagazineCopy
export type MagazineCopy = {
    magazineCopyId: number;
    magazineId: number;
    barcode: string;
    physicalLocation: string;
    status: 0 | 1; // 0 = available, 1 = lost
};

// MagazineCategory
export type MagazineCategory = {
    magazineCategoryId: number;
    subject: string;
};

// Reservation
export type Reservation = {
    reservationId: number;
    userId: number;
    bookId?: number | null;
    filmId?: number | null;
    reservedAt: string;
    status: 0 | 1 | 2; // 1 = fulfilled, 0 = canceled, 2 = pending
};
