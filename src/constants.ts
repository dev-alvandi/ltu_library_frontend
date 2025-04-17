const UNAUTHENTICATED_NAVBAR_PATHS = {
    "Home": "/",
    "Books": "/books",
    "Films": "/films",
    "Magazines": "/magazines",
    "Contact Us": "/contact-us",
    "Login | Register": "/auth"
}

type UNAUTHENTICATED_NAVBAR_PATHS_TYPE = typeof UNAUTHENTICATED_NAVBAR_PATHS;

const AUTHENTICATED_NAVBAR_PATHS = {
    "Home": "/",
    "Books": "/books",
    "Films": "/films",
    "Magazines": "/magazines",
    // "Cart": "/cart",
    "Dashboard": "/dashboard",
    "Contact Us": "/contact-us",
    "Logout": "/auth"
}

type AUTHENTICATED_NAVBAR_PATHS_TYPE = typeof AUTHENTICATED_NAVBAR_PATHS;

const ALL_POSSIBLE_RESOURCES = {
    books: "Books",
    films: "Films",
    magazines: "Magazines"
};













export {
    UNAUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS,
    ALL_POSSIBLE_RESOURCES
}

export type {
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE,
    AUTHENTICATED_NAVBAR_PATHS_TYPE
}
