export function ProductCard({ product }) {
  return (
    <div className="rounded-xl bg-background/40 p-3">
      <p className="text-[15px] font-semibold leading-snug">{product.name}</p>
      <p className="mt-1 text-[14px] leading-snug text-muted-foreground">{product.description}</p>
      {product.for_whom ? (
        <p className="mt-2 text-[14px] leading-snug">
          <span className="font-semibold text-gold">For: </span>
          {product.for_whom}
        </p>
      ) : null}
      {product.inside ? (
        <p className="mt-1 text-[14px] leading-snug text-muted-foreground">
          <span className="font-semibold text-foreground">Inside: </span>
          {product.inside}
        </p>
      ) : null}
    </div>
  );
}