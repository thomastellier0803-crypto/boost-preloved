import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallDialog({ open, onOpenChange }: PaywallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0 bg-slate-950 text-white rounded-3xl shadow-2xl">
        
        {/* Banner d'en-tête style App Store */}
        <div className="relative p-6 pt-8 bg-gradient-to-b from-indigo-600 via-indigo-900 to-slate-950 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md mb-3 border border-white/15">
            <Sparkles className="size-3.5 text-amber-300" /> ResellBoost Pro
          </div>
          
          <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Combien d'argent dort dans ton dressing ?
          </h2>
          
          <p className="text-xs text-indigo-100/80 font-medium px-2">
            En moyenne, <span className="text-amber-300 font-bold">300 € à 700 €</span> restent bloqués dans des vêtements non vendus.
          </p>
        </div>

        {/* Section Cartes d'avantages */}
        <div className="p-5 space-y-3 pt-0">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Vends 3x plus vite</h4>
              <p className="text-[11px] text-slate-400">Descriptions optimisées pour l'algorithme Vinted.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Maximise tes marges</h4>
              <p className="text-[11px] text-slate-400">Calcul automatique du prix idéal et des négociations.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Multi-publication express</h4>
              <p className="text-[11px] text-slate-400">Génère tes annonces en 5 secondes chrono.</p>
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="pt-2 text-center space-y-2">
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full py-6 text-sm font-bold rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              Débloquer mon dressing
              <ArrowRight className="size-4" />
            </Button>
            
            <p className="text-[10px] text-slate-500">
              Accès immédiat • Rentabilité dès la première vente
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaywallDialog;