import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 space-y-8 ">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Contact Us</h1>
                <p className="text-muted-foreground">
                    Reach out for help with book reservations, login issues, or general
                    library inquiries.
                </p>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>📍 Library Helpdesk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <strong>Address:</strong> Universitetsområdet, 971 87 Luleå, Sweden
                    </p>
                    <p>
                        <strong>Phone:</strong> +46 (0)920-49 10 00
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href="mailto:library@ltu.se"
                            className="text-blue-600 hover:underline"
                        >
                            randomEmailAddress@ltu.se
                        </a>
                    </p>
                    <p>
                        <strong>Opening Hours:</strong> Monday–Friday: 08:00–17:00
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>💻 Technical Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        For any issues related to the book borrowing system (e.g. login,
                        reservations), contact:
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href="mailto:libtechsupport@ltu.se"
                            className="text-blue-600 hover:underline"
                        >
                            RandomTechSupportEmailAddress@ltu.se
                        </a>
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>✉️ Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Your Name</Label>
                            <Input id="name" placeholder="Full name" />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Your Email</Label>
                            <Input id="email" type="email" placeholder="example@student.ltu.se" />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Write your message here..." />
                        </div>
                        <Button type="submit" className="cursor-pointer custom-btn">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Contact;