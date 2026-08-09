"use client";

export type Category = "bank" | "government" | "insurance" | "custom";

interface CategoryOption {
  id: Category;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "bank", label: "Bank" },
  { id: "government", label: "Government Scheme" },
  { id: "insurance", label: "Insurance" },
  { id: "custom", label: "Upload my form" },
];

interface CategoryPickerProps {
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <h2 style={{ fontSize: 26 }}>Which application are you looking for?</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            style={{
              fontSize: 20,
              padding: "24px 32px",
              borderRadius: 12,
              border: "1px solid #d9dce1",
              background: "white",
              minWidth: 200,
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
