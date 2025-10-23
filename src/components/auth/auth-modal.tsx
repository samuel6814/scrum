"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-headline">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Welcome! Please sign in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
