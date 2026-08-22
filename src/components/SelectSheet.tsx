import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export type SheetOption = {
  value: string;
  label: string;
  hint?: string;
};

export function SelectSheet({
  label,
  value,
  placeholder = "Choisir",
  options,
  onChange,
  columns = 3,
  disabled,
  clearable = true,
  description,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: SheetOption[];
  onChange: (v: string) => void;
  columns?: 1 | 2 | 3;
  disabled?: boolean;
  clearable?: boolean;
  description?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors active:bg-muted disabled:opacity-50",
          value && "border-primary/40",
        )}
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "block truncate text-sm font-semibold",
              !value && "font-medium text-muted-foreground",
            )}
          >
            {value || placeholder}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-3xl border-border pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left">
            <SheetTitle>{label}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
          <div
            className={cn(
              "mt-4 grid gap-2",
              columns === 1 && "grid-cols-1",
              columns === 2 && "grid-cols-2",
              columns === 3 && "grid-cols-3",
            )}
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-2xl border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{option.label}</span>
                    {option.hint ? (
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {option.hint}
                      </span>
                    ) : null}
                  </span>
                  {active ? <Check className="mt-0.5 size-4 shrink-0 text-primary" /> : null}
                </button>
              );
            })}
          </div>
          {clearable && value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="mt-4 w-full rounded-2xl border border-border py-2.5 text-sm font-medium text-muted-foreground"
            >
              Effacer la sélection
            </button>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
