import { useState, useEffect } from "react";

export default function VariationForm({
  productId,
  initialData, // undefined  ➜  “create” mode
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    option_name: "",
    option_value: "",
  });

  /* pre-fill in edit mode */
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, product_id: productId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg"
    >
      <input
        name="option_name"
        placeholder="Option name (e.g. Size)"
        value={form.option_name}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="option_value"
        placeholder="Option value (e.g. XL)"
        value={form.option_value}
        onChange={handleChange}
        required
        className="input"
      />

      <div className="flex gap-2 self-end">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs px-3 py-1 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white text-xs px-4 py-1 rounded"
        >
          {initialData ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
}
