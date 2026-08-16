import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
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
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="size-4 text-primary" />
            ResellBoost Pro
          </DialogTitle>
          <DialogDescription>
            Vous avez utilisé vos 3 annonces gratuites du jour.
          </DialogDescription>
        </DialogHeader>
        <div
          className="sheen relative overflow-hidden rounded-2xl p-5"
          style={{ background: "var(--gradient-brand)" }}
        >
          <p className="text-3xl font-bold tracking-tight text-white">
            4,99 € <span className="text-sm font-medium text-white/80">/ mois</span>
          </p>
          <ul className="mt-3 space-y-2">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-white">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Paiement bientôt disponible")}
          className="cta-glow pulse-glow w-full rounded-2xl py-3.5 text-sm font-bold"
        >
          Passer à Pro
        </button>
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
