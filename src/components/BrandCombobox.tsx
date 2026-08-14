import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BRANDS } from "@/lib/resell-data";
import { cn } from "@/lib/utils";

export function BrandCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || "Choisir une marque"}
          </span>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Rechercher une marque"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>Aucune marque trouvée.</CommandEmpty>
            {query.trim() ? (
              <CommandGroup heading="Saisir une marque">
                <CommandItem
                  value={`custom-${query}`}
                  onSelect={() => {
                    onChange(query.trim());
                    setOpen(false);
                  }}
                >
                  Utiliser « {query.trim()} »
                </CommandItem>
              </CommandGroup>
            ) : null}
            <CommandGroup heading="Marques populaires">
              {BRANDS.map((brand) => (
                <CommandItem
                  key={brand}
                  value={brand}
                  onSelect={() => {
                    onChange(brand === value ? "" : brand);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("size-4", value === brand ? "opacity-100" : "opacity-0")}
                  />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
