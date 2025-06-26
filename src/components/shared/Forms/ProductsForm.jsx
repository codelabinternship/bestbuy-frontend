import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function ProductForm({ initialData = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    brand: "",
    category: "",
    image: null,
    variations: [{ option_name: "", option_value: "" }],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { addProductMutation, updateProductMutation } = useProducts();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        discount_price: initialData.discount_price || "",
        stock_quantity: initialData.stock_quantity || "",
        brand: initialData.brand || "",
        category: initialData.category || "",
        image: initialData.image || null,
        variations: initialData.variations || [
          { option_name: "", option_value: "" },
        ],
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

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev.variations];
      updated[index][name] = value;
      return { ...prev, variations: updated };
    });
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, { option_name: "", option_value: "" }],
    }));
  };

  const removeVariation = (index) => {
    if (formData.variations.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key == "variations") {
        payload.append(key, JSON.stringify(value));
      } else {
        payload.append(key, value);
      }
    });
    try {
      console.log(payload);

      if (initialData) {
        await updateProductMutation.mutateAsync({
          id: initialData.id,
          formData: payload, // JSON format
        });
      } else {
        await addProductMutation.mutateAsync(payload);
      }

      alert("Product saved successfully");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl shadow">
          {error}
        </div>
      )}

      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={submitProduct} className="grid gap-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
            <Input
              name="discount_price"
              type="number"
              value={formData.discount_price}
              onChange={handleChange}
              placeholder="Discount Price"
            />
            <Input
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="Stock Quantity"
            />
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
            />
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <Input type="file" name="image" onChange={handleChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
            )}

            <h3 className="font-bold text-lg mt-4">Variations</h3>
            {formData.variations.map((variation, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-end">
                <Input
                  name="option_name"
                  value={variation.option_name}
                  onChange={(e) => handleVariationChange(index, e)}
                  placeholder="Option Name"
                />
                <Input
                  name="option_value"
                  value={variation.option_value}
                  onChange={(e) => handleVariationChange(index, e)}
                  placeholder="Option Value"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => removeVariation(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addVariation}>
              + Add Another Variation
            </Button>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
