import { ArrowRight, Clock3, MapPin } from "lucide-react";
import type { FoundItem } from "@workspace/api-client-react";

export function formatFoundDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function FoundItemRow({
  item,
  onSelect,
}: {
  item: FoundItem;
  onSelect?: () => void;
}) {
  const marker = item.category === "Keys & cards" ? "ID" : item.name.slice(0, 1).toUpperCase();
  const tone =
    item.category === "Electronics"
      ? "rose"
      : item.category === "Personal items"
        ? "gold"
        : "blue";

  return (
    <article className="item-row">
      <div className={`item-symbol ${tone}`} aria-hidden="true">
        {marker}
      </div>
      <div className="item-info">
        <div className="item-title-line">
          <h3>{item.name}</h3>
          <span className="found-pill">FOUND</span>
        </div>
        <p className="item-description">{item.publicDescription}</p>
        <div className="item-meta">
          <span><MapPin size={13} />{item.location}</span>
          <i />
          <span><Clock3 size={13} />{formatFoundDate(item.foundAt)}</span>
        </div>
      </div>
      <span className="category-label">{item.category}</span>
      {onSelect && (
        <button
          className="item-arrow"
          aria-label={`Browse listings for ${item.name}`}
          onClick={onSelect}
        >
          <ArrowRight size={17} />
        </button>
      )}
    </article>
  );
}
