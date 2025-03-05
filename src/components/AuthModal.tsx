"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onOpenChange,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
          duration: 3000,
        });
      } else {
        await signUp(email, password, name);
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
          duration: 3000,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "There was a problem with your request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-molle text-boba-brown">
            {mode === "signin" ? "Welcome Back!" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Sign up to save your progress and compete on leaderboards"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setMode("signup")}
              >
                Sign up
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setMode("signin")}
              >
                Sign in
              </Button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
