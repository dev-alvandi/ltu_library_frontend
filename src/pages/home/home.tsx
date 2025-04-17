import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, User } from "lucide-react";
import {useAppSelector} from "@/store/store.ts";

const Home = () => {

    return (
        <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 bg-background text-foreground space-y-8">
            <Card className="w-full max-w-3xl shadow-2xl rounded-2xl bg-card border-muted p-6 text-center space-y-6">
                <h1 className="text-4xl font-bold libre-baskerville text-[--color-blue-theme]">
                    Welcome to Luleå University Library
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Your digital hub for borrowing books, managing reservations, and exploring academic resources.
                </p>

                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <Button size="lg" className="bg-[--color-blue-theme] text-white hover:brightness-110">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Browse Books
                    </Button>
                    <Button variant="outline" size="lg" className="border-[--color-blue-theme] text-[--color-blue-theme]">
                        <User className="mr-2 h-5 w-5" />
                        Log In
                    </Button>
                </div>

                <Separator className="my-6" />

                <CardContent className="flex justify-center">
                    <img
                        src="/reading-illustration.svg"
                        alt="Students reading"
                        className="max-h-64 rounded-xl shadow-md"
                    />
                </CardContent>
            </Card>
        </main>
    );

};

export default Home;