import {Card, CardContent} from "@/components/ui/card";

const Home = () => {

    return (
        <main className="relative min-h-[80vh] text-foreground pt-12">
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
        </main>
    );

};

export default Home;