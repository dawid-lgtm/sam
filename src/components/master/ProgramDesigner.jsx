import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, X } from "lucide-react";
import { ALL_PRODUCTS, productByKey } from "@/lib/products";
import { ProductCard } from "@/components/master/ProductCard";

export function ProgramDesigner({ customer, saving, onSave }) {
  if (!customer) {
    return <p className="rounded-xl bg-background/40 p-4 text-[15px] text-muted-foreground">Add a customer first, then design their program.</p>;
  }

  const chosenKeys = (customer.products || []).filter((key) => productByKey(key));
  const chosen = chosenKeys.map(productByKey);
  const available = ALL_PRODUCTS.filter((p) => !chosenKeys.includes(p.key));

  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (source.droppableId === "cards" && destination.droppableId === "chosen") {
      const next = [...chosenKeys];
      next.splice(destination.index, 0, available[source.index].key);
      onSave(next);
      return;
    }
    if (source.droppableId === "chosen" && destination.droppableId === "cards") {
      const next = [...chosenKeys];
      next.splice(source.index, 1);
      onSave(next);
      return;
    }
    if (source.droppableId === "chosen" && destination.droppableId === "chosen") {
      const next = [...chosenKeys];
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);
      onSave(next);
    }
  };

  const remove = (key) => onSave(chosenKeys.filter((k) => k !== key));

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-[15px] font-semibold">Program cards</p>
            <p className="text-[14px] text-muted-foreground">{available.length} not on this customer</p>
          </div>
          <Droppable droppableId="cards">
            {(drop) => (
              <div ref={drop.innerRef} {...drop.droppableProps} className="min-h-[96px] space-y-2 rounded-xl bg-background/30 p-2">
                {available.map((p, index) => (
                  <Draggable key={p.key} draggableId={p.key} index={index}>
                    {(drag) => (
                      <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="cursor-grab rounded-xl bg-card p-3 active:cursor-grabbing">
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-[15px] font-semibold leading-snug">{p.name}</p>
                            <p className="mt-1 text-[14px] leading-snug text-muted-foreground">{p.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {drop.placeholder}
                {available.length ? null : (
                  <p className="p-2 text-[14px] text-muted-foreground">Every program is on this customer. Drag one back here to take it off.</p>
                )}
              </div>
            )}
          </Droppable>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-[15px] font-semibold">{customer.name} — their program</p>
            <p className="text-[14px] text-muted-foreground">{chosen.length} of {ALL_PRODUCTS.length}</p>
          </div>
          <Droppable droppableId="chosen">
            {(drop) => (
              <div ref={drop.innerRef} {...drop.droppableProps} className="min-h-[96px] space-y-2 rounded-xl bg-background/30 p-2">
                {chosen.map((p, index) => (
                  <Draggable key={p.key} draggableId={p.key} index={index}>
                    {(drag) => (
                      <div ref={drag.innerRef} {...drag.draggableProps} className="relative rounded-xl">
                        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
                          <span {...drag.dragHandleProps} className="grid h-8 w-8 cursor-grab place-items-center rounded-lg bg-card active:cursor-grabbing" aria-label="Drag">
                            <GripVertical className="h-4 w-4" />
                          </span>
                          <button type="button" onClick={() => remove(p.key)} className="grid h-8 w-8 place-items-center rounded-lg bg-card" aria-label={`Take ${p.name} off`}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <ProductCard product={p} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {drop.placeholder}
                {chosen.length ? null : (
                  <p className="p-2 text-[14px] text-muted-foreground">Drag a program card here to start this customer's program.</p>
                )}
              </div>
            )}
          </Droppable>
          <p className="mt-2 text-[14px] text-muted-foreground">{saving ? "Saving…" : "Order here is the order they run them."}</p>
        </div>
      </div>
    </DragDropContext>
  );
}