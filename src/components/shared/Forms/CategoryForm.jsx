import React, { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryForm({ initialData, onSuccess }) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const { addCategoryMutation, updateCategoryMutation } = useCategories();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        image: null,
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (formData.image) {
      form.append("image", formData.image);
    }

    if (isEdit) {
      updateCategoryMutation.mutate(
        { id: initialData.id, formData: form },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      addCategoryMutation.mutate(form, {
        onSuccess: () => {
          setFormData({ name: "", description: "", image: null });
          setImagePreview(null);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md p-4 border rounded shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-24 rounded object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={
          addCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      >
        {isEdit ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
}
