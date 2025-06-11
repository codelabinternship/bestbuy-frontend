import { useState } from "react";
import { Pen, Trash2, Plus } from "lucide-react";
import VariationForm from "./VariationForm";
import { useVariations } from "@/hooks/useVariations";

export default function VariationManager({ productId }) {
  const {
    data: variations,
    isLoading,
    addVariationMutation,
    updateVariationMutation,
    deleteVariationMutation,
  } = useVariations(productId);

  const [editing, setEditing] = useState(null); // null ➜ create
  const [open, setOpen] = useState(false);

  const close = () => {
    setEditing(null);
    setOpen(false);
  };

  /* ------------------------------------ */
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="text-xs text-teal-600 flex items-center gap-1"
      >
        <Plus size={12} /> {open ? "Hide variations" : "Manage variations"}
      </button>

      {open && (
        <div className="border rounded-lg mt-2 p-3">
          {isLoading && <p className="text-sm">Loading…</p>}

          {/* list */}
          {variations.map((v) => (
            <div
              key={v.variation_id}
              className="flex justify-between items-center py-1"
            >
              <span className="text-sm">
                {v.option_name}: <b>{v.option_value}</b>
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(v);
                    setOpen(true);
                  }}
                  className="text-yellow-500 p-1"
                >
                  <Pen size={14} />
                </button>
                <button
                  onClick={() => deleteVariationMutation.mutate(v.variation_id)}
                  className="text-red-500 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* create / edit form */}
          <VariationForm
            key={editing ? editing.variation_id : "new"}
            productId={productId}
            initialData={editing}
            onCancel={close}
            onSubmit={(payload) => {
              if (editing) {
                updateVariationMutation.mutate({
                  variation_id: editing.variation_id,
                  formData: payload,
                });
              } else {
                addVariationMutation.mutate(payload);
              }
              close();
            }}
          />
        </div>
      )}
    </div>
  );
}
