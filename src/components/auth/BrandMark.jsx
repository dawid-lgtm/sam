import { Image } from "@/components/ui/image";
import { BRAND_MARK } from "@/lib/brand";

// The brand mark in its gold circle. Size it from the outside — the artwork always fills the circle at any size.
export function BrandMark({ className = "" }) {
  return (
    <span className={`relative block overflow-hidden rounded-full bg-gold ${className}`}>
      <Image src={BRAND_MARK} alt="Sam" fittingType="fill" className="absolute inset-0 h-full w-full" />
    </span>
  );
}