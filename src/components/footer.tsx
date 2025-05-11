import {Facebook, Instagram, Linkedin, Youtube} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";

export default function Footer() {
    return (
        <footer className="bg-[#002e5d] text-white text-sm">
            <div className="w-[60%] mx-auto py-12">
                <div className="flex flex-wrap justify-center items-center">
                    {/* LTU logo and description */}
                    <div>
                        <div className="flex justify-between items-center gap-12">
                            <div className="">
                                <img
                                    src="/logo-white-background-transparent.png"
                                    alt="Luleå University of Technology"
                                    className="h-36 object-contain"
                                />
                            </div>
                            <p className="text-base">
                                Luleå University of Technology is in strong growth with world-leading
                                competence in several research areas. We have a total turnover of SEK 2.1 billion per
                                year,
                                1,900 employees, and 18,700 students.
                            </p>
                        </div>
                    </div>

                    <Separator />


                    <div className="flex flex-wrap justify-between gap-6 mt-6">
                        {/* Contact column */}
                        <div>
                            <h3 className="font-semibold mb-2">Contact</h3>
                            <ul className="text-white space-y-1">
                                <li>Luleå University of Technology</li>
                                <li>97187 Luleå, Sweden</li>
                                <li>Phone: +46 (0)920-491000</li>
                                <li>Registration number: 202100-2841</li>
                                <li><a href="#" className="underline">Contact us</a></li>
                                <li><a href="#" className="underline">Directions</a></li>
                                <li><a href="#" className="underline">LTU maps</a></li>
                            </ul>
                        </div>

                        {/* Shortcuts column */}
                        <div>
                            <h3 className="font-semibold mb-2">Shortcuts</h3>
                            <ul className="text-white space-y-1 [&>li]:underline">
                                <li><a href="#">In case of incident or emergency</a></li>
                                <li><a href="#">Report faulty facilities or equipment</a>
                                </li>
                                <li><a href="#">Governing documents</a></li>
                                <li><a href="#">Press</a></li>
                                <li><a href="#">Organisation</a></li>
                                <li><a href="#">University Library</a></li>
                                <li><a href="#">Job vacancies</a></li>
                            </ul>
                        </div>

                        {/* About the website column */}
                        <div>
                            <h3 className="font-semibold mb-2">About this website</h3>
                            <ul className="text-white space-y-1 [&>li]:underline">
                                <li><a href="#">Whistleblowing</a></li>
                                <li><a href="#">Processing of personal data, GDPR</a></li>
                                <li><a href="#">Accessibility</a></li>
                                <li><a href="#">Cookies</a></li>
                                <li><a href="#">Contact for website</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3></h3>
                            <ul className="text-white space-y-1 [&>li]:underline">
                                <li className="pt-2"><a href="#">På svenska</a></li>
                                <li><a href="#">Staff</a></li>
                                <li><a href="#" className="whitespace-nowrap">Student website</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
                    {/* Footer icons */}
                    <div className="mt-10 flex justify-start space-x-6">
                        <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook size={20}/></a>
                        <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram size={20}/></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin size={20}/></a>
                        <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube size={20}/></a>
                    </div>
            </div>
        </footer>
    );
}
