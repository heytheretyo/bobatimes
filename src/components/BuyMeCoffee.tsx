import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

export default function BuyMeCoffee() {
  return (
    <a
      href="https://www.buymeacoffee.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50"
    >
      <Button
        className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
        size="sm"
      >
        <Coffee className="h-4 w-4" />
        Buy me coffee boba
      </Button>
    </a>
  );
}
