import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PriceAlertDialogProps {
  productId: number;
  productName: string;
  currentPrice: number;
}

export function PriceAlertDialog({
  productId,
  productName,
  currentPrice,
}: PriceAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(currentPrice.toFixed(2));
  const [alertType, setAlertType] = useState<"above" | "below">("below");
  const [email, setEmail] = useState("");

  const createAlertMutation = trpc.alerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alert създаден успешно!");
      setOpen(false);
      // Reset form
      setTargetPrice(currentPrice.toFixed(2));
      setAlertType("below");
      setEmail("");
    },
    onError: (error) => {
      toast.error(`Грешка: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Моля, въведете валидна цена");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Моля, въведете валиден email адрес");
      return;
    }

    createAlertMutation.mutate({
      productId,
      targetPrice: price,
      alertType,
      email,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 transition-opacity hover:bg-accent"
          title="Задай известие за цена"
        >
          <Bell className="h-4 w-4 text-muted-foreground hover:text-primary" />
          <span className="sr-only">Задай alert</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Задай известие за цена</DialogTitle>
            <DialogDescription>
              Ще получите email когато цената на "{productName}" достигне вашата целева цена.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-price">Текуща цена</Label>
              <Input
                id="current-price"
                value={`${currentPrice.toFixed(2)} €`}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-price">
                Целева цена (EUR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="target-price"
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Въведете целева цена"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alert-type">
                Тип известие <span className="text-destructive">*</span>
              </Label>
              <Select value={alertType} onValueChange={(v) => setAlertType(v as "above" | "below")}>
                <SelectTrigger id="alert-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below">Падне под целевата цена</SelectItem>
                  <SelectItem value="above">Надхвърли целевата цена</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email адрес <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                На този адрес ще получите известие при промяна на цената
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createAlertMutation.isPending}
            >
              Отказ
            </Button>
            <Button type="submit" disabled={createAlertMutation.isPending}>
              {createAlertMutation.isPending ? "Създаване..." : "Създай Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
