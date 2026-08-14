import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const perks = [
  "Générations d'annonces illimitées",
  "Analyse photo prioritaire",
  "Export multi-plateformes",
  "Historique illimité et sauvegardé",
];

export function PaywallDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>ResellBoost Pro</DialogTitle>
          <DialogDescription>
            Vous avez utilisé vos 3 annonces gratuites du jour.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-2xl font-semibold tracking-tight">
            4,99 € <span className="text-sm font-normal text-muted-foreground">/ mois</span>
          </p>
          <ul className="mt-3 space-y-2">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full">Passer à Pro</Button>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Continuer demain avec le quota gratuit
        </button>
      </DialogContent>
    </Dialog>
  );
}
