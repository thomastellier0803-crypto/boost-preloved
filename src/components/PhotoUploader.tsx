import { useRef } from "react";
import { Camera, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PHOTO_SLOTS } from "@/lib/resell-data";

export type Photos = Record<string, string | undefined>;

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1024;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function PhotoUploader({
  photos,
  onChange,
}: {
  photos: Photos;
  onChange: (photos: Photos) => void;
}) {
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className="grid grid-cols-2 gap-3">
      {PHOTO_SLOTS.map((slot) => {
        const src = photos[slot.key];
        return (
          <div key={slot.key} className="group relative">
            <input
              ref={(el) => {
                inputs.current[slot.key] = el;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onChange({ ...photos, [slot.key]: await fileToDataUrl(file) });
                e.target.value = "";
                toast.success(`Photo « ${slot.label} » ajoutée`);
              }}
            />
            <button
              type="button"
              onClick={() => inputs.current[slot.key]?.click()}
              className={
                src
                  ? "relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform active:scale-[0.97]"
                  : "flex aspect-square w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-primary/35 bg-card/60 text-center shadow-card backdrop-blur transition-all hover:border-primary hover:bg-accent/40 active:scale-[0.97]"
              }
            >
              {src ? (
                <img src={src} alt={slot.label} className="size-full object-cover" />
              ) : (
                <>
                  <span className="relative flex size-11 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:scale-110">
                    <Camera className="size-5" strokeWidth={1.75} />
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Plus className="size-2.5" strokeWidth={3} />
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{slot.label}</span>
                  <span className="text-[11px] text-muted-foreground">{slot.hint}</span>
                </>
              )}
            </button>
            {src ? (
              <>
                <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
                  {slot.label}
                </span>
                <button
                  type="button"
                  aria-label={`Retirer ${slot.label}`}
                  onClick={() => onChange({ ...photos, [slot.key]: undefined })}
                  className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow-card backdrop-blur transition-transform active:scale-90"
                >
                  <X className="size-3.5" />
                </button>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
