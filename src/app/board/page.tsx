"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import AuthModal from '@/components/auth/auth-modal';
import Board from '@/components/board/board';
import Header from '@/components/header';

export default function BoardPage() {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setAuthModalOpen(true);
    }
  }, [user, loading]);
  
  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
       <Header onSignInClick={() => setAuthModalOpen(true)} />
       <main className="flex-1 relative">
        {user ? (
            <Board user={user} />
        ) : (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                    <h1 className="text-3xl font-bold font-headline text-foreground">Welcome to your Board</h1>
                    <p className="text-lg text-muted-foreground mt-2">Sign in to start collaborating.</p>
                </div>
            </div>
        )}
       </main>
       <AuthModal isOpen={isAuthModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
