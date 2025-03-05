import { Button } from "@/components/ui/button";
import { LogInIcon, UserPlusIcon, XIcon } from "lucide-react";
// import { useAuth } from "@/lib/auth-context";

interface AuthBannerProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onDismiss: () => void;
  visible: boolean;
}

export default function AuthBanner({
  onSignIn,
  onSignUp,
  onDismiss,
  visible,
}: AuthBannerProps) {
  //   const { user } = null;

  if (!visible) return null;

  return (
    <div className=" top-0 left-0 right-0 bg-primary/95 backdrop-blur-sm text-primary-foreground py-2 px-4 z-50 flex items-center justify-between">
      <div className="text-sm">
        Sign in to save your progress to the cloud and compete on leaderboards!
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="h-8"
          onClick={onSignUp}
        >
          <LogInIcon className="h-3.5 w-3.5 mr-1.5" />
          Join us
        </Button>
        {/* <Button
          size="sm"
          variant="outline"
          className="h-8 bg-transparent border-white/20 text-white hover:bg-white/10"
          onClick={onSignUp}
        >
          <UserPlusIcon className="h-3.5 w-3.5 mr-1.5" />
          Sign Up
        </Button> */}
        {/* <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={onDismiss}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button> */}
      </div>
    </div>
  );
}
