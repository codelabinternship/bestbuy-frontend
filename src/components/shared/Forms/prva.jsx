import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import api from "@/lib/axios";

/**
 * ProductWithVariations.jsx
 * A two‑step wizard: 1) create product, 2) create variations for that product.
 * After the product POST succeeds, we retrieve the productId from the response
 * and pass it to the variations step so that each variation is saved under
 * the newly created product.
 */

export default function ProductWithVariations() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    brand: "",
    category: "",
    image: null,
  });
  const [productId, setProductId] = useState(null);

  const [variations, setVariations] = useState([
    { option_name: "", option_value: "" },
  ]);

  // ------------ Handlers for Product Step ------------ //
  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/products/", productData);

      if (res.ok) throw new Error("Failed to create product");
      console.log(res.data);

      const id = await res.data.id; // { id: 123 }
      setProductId(id);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------ Handlers for Variations Step ------------ //
  const handleVariationChange = (e) => {
    setVariations((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const addVariation = () => {
    setVariations([...variations, { option_name: "", option_value: "" }]);
  };

  const removeVariation = (index) => {
    if (variations.length === 1) return; // keep at least one
    setVariations(variations.filter((_, i) => i !== index));
  };

  const submitVariations = async (e) => {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setError("");

    try {
      const newVariations = {
        product_id: productId,
        ...variations,
      };
      const res = await api.post(`/variations/`, newVariations);
      if (!res.data) throw new Error("Failed to create variations");
      // Optionally reset or navigate away
      alert("Variations created successfully!");
      setStep(1);
      setProductData({ name: "", price: "", description: "" });
      setVariations([{ option_name: "", option_value: "" }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------ Render ------------ //
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
                    value={productData.name}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save & Continue to Variations"}
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
                    <Label htmlFor={`color-${1}`}>Color</Label>
                    <Input
                      id={`color-${1}`}
                      name="option_name"
                      value={variations.option_name}
                      onChange={(e) => handleVariationChange(e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`size-${2}`}>Size</Label>
                    <Input
                      id={`size-${2}`}
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
                  </Button>
                  {/* ))} */}
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
