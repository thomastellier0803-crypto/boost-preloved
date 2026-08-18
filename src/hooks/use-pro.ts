import { useEffect, useState } from "react";
import { isCreator, setCreator } from "@/lib/local-store";

/**
 * Statut Pro : actif si le mode créateur est enregistré,
 * ou si l'URL contient ?admin=true (déblocage administrateur).
 */
export function usePro() {
  const [pro, setPro] = useState(false);

  useEffect(() => {
    const admin = new URLSearchParams(window.location.search).get("admin") === "true";
    if (admin) setCreator(true);
    setPro(admin || isCreator());
  }, []);

  return pro;
}
