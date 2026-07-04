// "use client";
// import React from "react";

// import { motion } from "framer-motion";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { Container } from "lucide-react";
// import { ShinyButton } from "../ui/shiny-button";

// export const CTA = () => {
//     const { data: session } = authClient.useSession();
//     const router = useRouter();
//     return (
//         <section className="py-20 relative overflow-hidden bg-neutral-950">
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/50 pointer-events-none" />
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--primary),transparent_50%)] opacity-20 pointer-events-none" />

//             <Container className="relative z-10 flex flex-col items-center justify-center text-center">
//                 <motion.h2
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-6 pb-2"
//                 >
//                     Ready to automate your future?
//                 </motion.h2>
//                 <motion.p
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.1 }}
//                     className="text-neutral-400 max-w-xl mb-8 text-lg"
//                 >
//                     Join hundreds of developers building the next generation of automation tools. Start for free today.
//                 </motion.p>
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.2 }}
//                 >
//                     <ShinyButton onClick={() => router.push(session ? "/workflows" : "/signup")} className="bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70">
//                         Start Building Now
//                     </ShinyButton>
//                 </motion.div>
//             </Container>
//         </section>
//     );
// };


"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { ShinyButton } from "../ui/shiny-button";

export const CTA = () => {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    return (
        <section className="relative overflow-hidden bg-neutral-950 py-24">
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900/70" />

            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_top,var(--primary)_0%,transparent_65%)] opacity-20" />

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                >
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text pb-2 text-4xl font-bold text-transparent md:text-6xl"
                >
                    Ready to automate your workflow?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.15,
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400"
                >
                    Build powerful automation workflows with AI, APIs, Slack, Discord,
                    HTTP Requests, OpenAI, Gemini, Anthropic, and more—all in one visual
                    platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.3,
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="mt-10"
                >
                    <ShinyButton
                        onClick={() =>
                            router.push(session ? "/workflows" : "/signup")
                        }
                        className="border border-white/10 bg-black/60 px-8 py-6 text-base backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black/80"
                    >
                        Start Building Free
                    </ShinyButton>
                </motion.div>
            </div>
        </section>
    );
};