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
    // "Edit Resources": "/edit-resources",
    "Contact Us": "/contact-us",
    "Logout": "/auth"
}

type AUTHENTICATED_NAVBAR_PATHS_TYPE = typeof AUTHENTICATED_NAVBAR_PATHS;


const DASHBOARD_NAVBAR_PATHS = {
    "Profile": "/dashboard/profile",
    "My Loans": "/dashboard/my-loans",
    "My Reservations": "/dashboard/my-reservations",
    "Manage Resources": "/dashboard/manage-resources",
    // "Employee Management": "/dashboard/employee-management",
    // "Settings": "/dashboard/settings"
}

const ALL_POSSIBLE_RESOURCES = {
    books: "Books",
    films: "Films",
    magazines: "Magazines"
};













export {
    UNAUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS,
    ALL_POSSIBLE_RESOURCES,
    DASHBOARD_NAVBAR_PATHS
}

export type {
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE,
    AUTHENTICATED_NAVBAR_PATHS_TYPE
}
