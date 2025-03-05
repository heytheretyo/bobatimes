import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  SettingsIcon,
  VolumeIcon,
  Volume2Icon,
  MoonIcon,
  SunIcon,
  SaveIcon,
  TrashIcon,
  LogOutIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";

interface SettingsDialogProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetProgress: () => void;
}

export default function SettingsDialog({
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleDarkMode,
  onResetProgress,
}: SettingsDialogProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      onResetProgress();
      toast({
        title: "Progress Reset",
        description: "All game progress has been reset.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/80 hover:bg-white/90"
        >
          <SettingsIcon className="h-5 w-5 text-boba-brown" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-molle text-boba-brown">
            Settings
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Customize your boba experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2Icon className="h-5 w-5" />
                ) : (
                  <VolumeIcon className="h-5 w-5" />
                )}
                <Label htmlFor="sound">Sound Effects</Label>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={onToggleSound}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>
            <div className="pt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleResetProgress}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="account" className="space-y-4 py-4">
            {user ? (
              <>
                <div className="space-y-1">
                  <h4 className="font-medium">Signed in as</h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" className="w-full">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Progress to Cloud
                  </Button>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Sign in to sync your progress across devices
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => {}}>Sign In</Button>
                  <Button variant="outline" onClick={() => {}}>
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
