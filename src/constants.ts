const UNAUTHENTICATED_NAVBAR_PATHS = {
    "Home": "/",
    "Search Resources": "search-resources",
    "Contact Us": "/contact-us",
    "Login | Register": "/auth"
}

type UNAUTHENTICATED_NAVBAR_PATHS_TYPE = typeof UNAUTHENTICATED_NAVBAR_PATHS;

const AUTHENTICATED_NAVBAR_PATHS = {
    "Home": "/",
    "Search Resources": "search-resources",
    "My Loans": "my-loans",
    "My Reservations": "/my-reservations",
    "Contact Us": "/contact-us",
    "Logout": "/auth"
}

type AUTHENTICATED_NAVBAR_PATHS_TYPE = typeof AUTHENTICATED_NAVBAR_PATHS;

export {
    UNAUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS
}

export type {
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE,
    AUTHENTICATED_NAVBAR_PATHS_TYPE
}
