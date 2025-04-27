import { motion } from "framer-motion";

const Loading = () => {
    return (
        <div className="fixed w-full h-full flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]  text-white z-50">
            <motion.img
                src="logo-white-background-transparent.png"
                alt="App Logo"
                className="w-24 h-24 md:w-32 md:h-32 drop-shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
            {/*<motion.p*/}
            {/*    className="mt-4 text-sm md:text-base text-muted-foreground"*/}
            {/*    initial={{ opacity: 0 }}*/}
            {/*    animate={{ opacity: 1 }}*/}
            {/*    transition={{*/}
            {/*        delay: 0.5,*/}
            {/*        duration: 1.2,*/}
            {/*        repeat: Infinity,*/}
            {/*        repeatType: "reverse",*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Loading...*/}
            {/*</motion.p>*/}
        </div>
    );
};

export default Loading;
