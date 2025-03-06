import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { removeFromLocalStorage } from "@/lib/local-storage";
import { LogInIcon, UserPlusIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface AuthBannerProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onDismiss: () => void;
  visible: boolean;
  onLogout?: () => void; // Add this line for the logout callback
}

export default function AuthBanner({
  onSignUp,
  visible,
  onLogout,
}: AuthBannerProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user && !visible) return null;

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Close dropdown after logout
    onLogout();
    window.location.reload();
  };

  const handleResetProgress = () => {
    removeFromLocalStorage("localSave");
    window.location.reload();
  };

  return (
    <div className="top-0 left-0 right-0 bg-primary/95 backdrop-blur-sm text-primary-foreground py-2 px-4 z-50 flex items-center justify-between">
      <div className="text-sm">
        Sign in to save your progress to the cloud and compete on leaderboards!
      </div>
      <div className="flex items-center gap-2">
        {!user ? (
          <Button
            size="sm"
            variant="secondary"
            className="h-8"
            onClick={onSignUp}
          >
            <LogInIcon className="h-3.5 w-3.5 mr-1.5" />
            Join us
          </Button>
        ) : (
          <div className="relative">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 flex items-center gap-2"
              onClick={handleDropdownToggle}
            >
              <span>{user.name || user.email}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md w-40">
                <Button
                  variant="ghost"
                  className="w-full text-left px-4 py-2"
                  onClick={handleResetProgress}
                >
                  Reset local progress
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left px-4 py-2"
                  onClick={() => console.log("Go to settings")}
                >
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left px-4 py-2"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
