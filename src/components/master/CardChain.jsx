import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { CARD_FORMATS } from "@/lib/cardFormats";
import { CardPreview } from "@/components/master/CardPreview";

export function CardChain({ cards, onAdd, onEdit, onDelete, onReorder }) {
  const handleDrag = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = [...cards];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onReorder(next.map((card) => card.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[15px] font-semibold">The chain ({cards.length})</p>
        {cards.length ? (
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="chain">
              {(drop) => (
                <div ref={drop.innerRef} {...drop.droppableProps} className="space-y-2">
                  {cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(drag) => (
                        <div ref={drag.innerRef} {...drag.draggableProps} className="rounded-xl">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                {...drag.dragHandleProps}
                                className="grid h-9 w-9 cursor-grab place-items-center rounded-lg bg-card active:cursor-grabbing"
                                aria-label="Drag to reorder"
                              >
                                <GripVertical className="h-4 w-4" />
                              </span>
                              <p className="text-[14px] font-semibold text-gold">Day {index + 1}</p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => onEdit(card)}
                                className="grid h-9 w-9 place-items-center rounded-lg bg-card"
                                aria-label={`Edit ${card.title || "card"}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDelete(card)}
                                className="grid h-9 w-9 place-items-center rounded-lg bg-card"
                                aria-label={`Remove ${card.title || "card"}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <CardPreview card={card} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {drop.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <p className="rounded-xl bg-background/40 p-4 text-[15px] text-muted-foreground">
            Nothing in this chain yet. Add the first card below — it becomes day 1.
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-[15px] font-semibold">Add a card</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CARD_FORMATS.map((format) => (
            <button
              key={format.key}
              type="button"
              onClick={() => onAdd(format.key)}
              className="rounded-xl bg-background/40 p-3 text-left transition hover:ring-2 hover:ring-gold"
            >
              <span className="block text-[15px] font-semibold">{format.label}</span>
              <span className="mt-0.5 block text-[14px] text-muted-foreground">{format.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}