// Combined ProductForm with Variation Step
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import api from "@/lib/axios";

export default function ProductWithVariationsForm({
  initialData = null,
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productId, setProductId] = useState(initialData?.id || null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    brand: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [variations, setVariations] = useState({
    option_name: "",
    option_value: "",
  });

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
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        fd.append(key, value);
      }
    });

    try {
      let id = productId;
      if (initialData) {
        await updateProductMutation.mutateAsync({
          id: initialData.id,
          formData: fd,
        });
        id = initialData.id;
      } else {
        const res = await addProductMutation.mutateAsync(fd);
        id = res?.id;
        setProductId(id);
      }
      setStep(2);
    } catch (err) {
      setError("Failed to save product.");
    }
  };

  const handleVariationChange = (e) => {
    const { name, value } = e.target;

    setVariations((prev) => ({ ...prev, [name]: value }));
  };

  // const addVariation = () => {
  //   setVariations([...variations, { option_name: "", option_value: "" }]);
  // };

  // const removeVariation = (index) => {
  //   if (variations.length === 1) return;
  //   setVariations(variations.filter((_, i) => i !== index));
  // };

  const submitVariations = async (e) => {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      console.log(variations);
      const newData = {
        product_id: productId,
        ...variations,
      };
      const res = await api.post(`/variations/`, newData);
      if (!res.data) throw new Error("Failed to create variations");
      alert("Variations created successfully!");
      setStep(1);
      setFormData({ name: "", price: "", description: "" });
      setVariations([{ option_name: "", option_value: "" }]);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 grid gap-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl shadow">
          {error}
        </div>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Create Product</h2>
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={submitProduct} className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="discount_price">Discount price</Label>
                  <Input
                    id="discount_price"
                    name="discount_price"
                    type="number"
                    value={formData.discount_price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock quantity</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving.." : "Save & Continue to Variations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Add Variations</h2>
          <p className="text-sm text-gray-500">Product ID: {productId}</p>
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={submitVariations} className="space-y-6">
                {/* {variations.map((variation, index) => ( */}
                <div className="grid md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-b-0">
                  <div>
                    <Label htmlFor={`option_name-${1}`}>Option Name</Label>
                    <Input
                      id={`option_name-${1}`}
                      name="option_name"
                      value={variations.option_name}
                      onChange={(e) => handleVariationChange(e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`option_value-${2}`}>Option Value</Label>
                    <Input
                      id={`option_value-${2}`}
                      name="option_value"
                      value={variations.option_value}
                      onChange={(e) => handleVariationChange(e)}
                    />
                  </div>
                  {/* <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeVariation(index)}
                      className="self-center text-red-600"
                    >
                      Remove
                    </Button> */}
                </div>

                {/* <Button
                  type="button"
                  variant="secondary"
                  onClick={addVariation}
                  className="w-full"
                >
                  + Add Another Variation
                </Button> */}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save Variations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
