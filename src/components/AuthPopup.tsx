import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudIcon, TrophyIcon, SaveIcon } from "lucide-react";

interface AuthPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
  onSignIn: () => void;
  onDismiss: () => void;
}

export default function AuthPopup({
  isOpen,
  onOpenChange,
  onSignUp,
  onSignIn,
  onDismiss,
}: AuthPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-molle text-boba-brown">
            Unlock More Features!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Sign up to enjoy these premium benefits:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <CloudIcon className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-medium">Cloud Saves</h4>
              <p className="text-sm text-muted-foreground">
                Never lose your progress again
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrophyIcon className="h-6 w-6 text-amber-500" />
            <div>
              <h4 className="font-medium">Leaderboards</h4>
              <p className="text-sm text-muted-foreground">
                Compete with other boba enthusiasts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SaveIcon className="h-6 w-6 text-green-500" />
            <div>
              <h4 className="font-medium">Cross-device Sync</h4>
              <p className="text-sm text-muted-foreground">
                Play on any device, anytime
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onSignUp} className="flex-1">
            Sign Up
          </Button>
          <Button onClick={onSignIn} variant="outline" className="flex-1">
            Sign In
          </Button>
        </div>
        <Button
          onClick={onDismiss}
          variant="ghost"
          className="mt-2 text-xs text-muted-foreground"
        >
          Continue without account
        </Button>
      </DialogContent>
    </Dialog>
  );
}
