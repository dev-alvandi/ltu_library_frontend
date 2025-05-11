import {Card, CardContent} from "@/components/ui/card";
import {useNavigate} from "react-router";
import {UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";

const Home = () => {
    const navigate = useNavigate();

    return (
        <main className="relative min-h-[80vh] text-foreground pt-20">
            {/* Desktop layout */}
            <div className="px-2">
                <div className="relative hidden md:flex min-h-[40vh]">
                    <img src="/home.jpg" alt="Home Image" className="absolute w-full h-full clip-left object-cover"/>
                    <div className="w-full bg-blue-100 clip-right px-5 flex flex-col justify-center">
                        <h1 className="lg:text-4xl text-2xl font-extrabold roboto text-(--color-blue-theme) flex justify-end">
                            Welcome to Luleå University Library
                        </h1>
                        <p className="lg:text-xl text-base open-sans mt-4 text-black dark:text-gray-300 flex justify-end text-end">
                            Your digital hub for borrowing books and films, <br/>
                            managing reservations, and exploring <br/>
                            academic resources.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col md:hidden space-y-6 p-6">
                <Card className="shadow-2xl border-none py-6 bg-(--color-blue-theme)">
                    <CardContent className="flex flex-col">
                        <h1 className="text-4xl font-bold font-librebaskerville text-white">
                            Welcome to Luleå University Library
                        </h1>
                        <p className="text-xl text-gray-300 dark:text-gray-300 mt-4">
                            Your digital hub for borrowing books and films,
                            managing reservations, and exploring
                            academic resources.
                        </p>
                    </CardContent>
                </Card>
                <img
                    src="/home.jpg"
                    alt="Students reading"
                    className="w-full rounded-xl shadow-md"
                />
            </div>

            {/* Feature Cards Section */}
            <section className="w-full px-4 lg:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Book Card */}
                    <Card
                        className="transition-transform duration-300 hover:scale-105 cursor-pointer shadow-xl"
                        onClick={() =>  navigate(UNAUTHENTICATED_NAVBAR_PATHS["Books"])}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <img src="/books.jpg" alt="Books" className="h-36 w-36 mb-4" />
                            <h2 className="text-xl font-semibold">Books</h2>
                            <p className="text-gray-500">Browse and borrow from a wide collection of academic and leisure books.</p>
                        </CardContent>
                    </Card>

                    {/* Film Card */}
                    <Card
                        className="transition-transform duration-300 hover:scale-105 cursor-pointer shadow-xl"
                        onClick={() =>  navigate(UNAUTHENTICATED_NAVBAR_PATHS["Films"])}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <img src="/films.jpg" alt="Films" className="h-36 w-36 mb-4" />
                            <h2 className="text-xl font-semibold">Films</h2>
                            <p className="text-gray-500">Access documentaries, educational videos, and entertainment films.</p>
                        </CardContent>
                    </Card>

                    {/* Magazine Card */}
                    <Card
                        className="transition-transform duration-300 hover:scale-105 cursor-pointer shadow-xl"
                        onClick={() =>  navigate(UNAUTHENTICATED_NAVBAR_PATHS["Magazines"])}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <img src="/magazines.jpg" alt="Magazines" className="h-36 w-36 mb-4" />
                            <h2 className="text-xl font-semibold">Magazines</h2>
                            <p className="text-gray-500">Stay updated with the latest academic journals and digital magazines.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

        </main>
    );

};

export default Home;