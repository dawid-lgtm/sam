import { Image } from "@/components/ui/image";
import { BRAND_MARK } from "@/lib/brand";

// The brand mark in its gold circle. Size it from the outside — the artwork always fills the circle at any size.
export function BrandMark({ className = "" }) {
  return (
    <span className={`block overflow-hidden rounded-full bg-gold p-[6%] ${className}`}>
      <Image src={BRAND_MARK} alt="Sam" className="h-full w-full rounded-full" />
    </span>
  );
}