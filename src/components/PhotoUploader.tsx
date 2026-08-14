import { useRef } from "react";
import { Camera, X } from "lucide-react";
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
          <div key={slot.key} className="relative">
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
              }}
            />
            <button
              type="button"
              onClick={() => inputs.current[slot.key]?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-dashed border-border bg-card text-center transition-colors hover:border-primary"
            >
              {src ? (
                <img src={src} alt={slot.label} className="size-full object-cover" />
              ) : (
                <>
                  <Camera className="size-6 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{slot.label}</span>
                  <span className="text-[11px] text-muted-foreground">{slot.hint}</span>
                </>
              )}
            </button>
            {src ? (
              <>
                <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-medium">
                  {slot.label}
                </span>
                <button
                  type="button"
                  aria-label={`Retirer ${slot.label}`}
                  onClick={() => onChange({ ...photos, [slot.key]: undefined })}
                  className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-foreground shadow-sm"
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
