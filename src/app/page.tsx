"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Header from "@/components/header";
import AuthModal from "@/components/auth/auth-modal";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";


export default function LandingPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === "hero-scrum");
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleGetStarted = () => {
        if (user) {
            router.push('/board');
        } else {
            setAuthModalOpen(true);
        }
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header onSignInClick={() => setAuthModalOpen(true)} />
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-foreground">
                                        Unleash Your Team’s Creativity with ScrumFlow
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        The intuitive and collaborative sticky note board for agile teams. Drag, drop, and organize your ideas in real-time.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button size="lg" onClick={handleGetStarted} className="bg-accent text-accent-foreground hover:bg-accent/90">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {heroImage && <Image
                                src={heroImage.imageUrl}
                                alt={heroImage.description}
                                width={600}
                                height={400}
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                                data-ai-hint={heroImage.imageHint}
                            />}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ScrumFlow. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                        Terms of Service
                    </Link>
                    <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                        Privacy
                    </Link>
                </nav>
            </footer>
            <AuthModal isOpen={isAuthModalOpen} onOpenChange={setAuthModalOpen} />
        </div>
    );
}
