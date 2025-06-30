import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Trash2, X } from "lucide-react";

export default function ProductForm({ initialData = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    brand: "",
    category: "",
    media: null,
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
        media: initialData.media || null,
        variations: initialData.variations || [
          { option_name: "", option_value: "" },
        ],
      });
      setImagePreview(initialData.media || null);
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
    <div className=" mx-auto w-full p-6 space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl shadow">
          {error}
        </div>
      )}

      <div>
        <div>
          <p className="text-xl font-sans font-medium">Добавить продукт</p>
        </div>
        <div>
          <form onSubmit={submitProduct} className="grid gap-4">
            <Card className="shadow-[10px 10px 10px 10px] mt-6">
              <CardContent className="py-4 px-4 space-y-4">
                <div>
                  <Label>{t("Name")}</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
                <div>
                  <Label>{t("Description")}</Label>
                  <textarea
                    className="flex mt-1 h-20 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-[0px 0px 10px 10px] mt-6">
              <CardContent className="py-4 px-4 space-y-4">
                <div className="flex  items-center gap-1">
                  <p className="font-semibold">{t("Image")}</p>
                  <p className="bg-[#9ef2eb] rounded-full px-[7px] py-[2px] font-medium text-[11px]">
                    Реком. размер: 1080×1440
                  </p>
                </div>
                {imagePreview ? (
                  <div className="bg-gray-100 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-[200px] mx-auto h-full "
                    />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="bg-gray-500 font-extrabold shadow-2xl absolute top-2 left-2 text-white rounded-full p-[3px]"
                    >
                      <X className="w-3 h-3 font-extrabold" />
                    </button>
                  </div>
                ) : (
                  <div>
                    {" "}
                    <Input type="file" name="media" onChange={handleChange} />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="shadow-[0px 0px 10px 10px] mt-6">
              <CardContent className="py-4 px-4 space-y-4">
                <Label className="text-md">{t("Narx")}</Label>
                <div className="flex gap-10 ">
                  <div className="max-w-[300px] ">
                    <Label>{t("Цена продажи")}</Label>
                    <div className="flex relative">
                      <div className="absolute top-[10px]  pr-1 border-r-2 left-2">
                        UZS
                      </div>
                      <Input
                        name="price"
                        type="number"
                        className="pl-11 font-semibold placeholder:font-semibold "
                        value={formData.price}
                        onChange={handleChange}
                        placeholder={t("Price")}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t("Цена сравнения")}</Label>
                    <div className="flex relative">
                      <div className="absolute top-[10px]  pr-1 border-r-2 left-2">
                        UZS
                      </div>
                      <Input
                        name="discount_price"
                        type="number"
                        className="pl-11 font-semibold placeholder:font-semibold "
                        value={formData.discount_price}
                        onChange={handleChange}
                        placeholder={t("Цена сравнения")}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-[0px 0px 10px 10px] mt-6">
              <CardContent className="py-4 px-4 space-y-4">
                <Label className="text-md">{t("Детали продукта")}</Label>
                <div className="">
                  <div className="mb-5">
                    <Label>{t("Количество")}</Label>
                    <Input
                      name="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      placeholder={t("Количество")}
                    />
                  </div>
                  <div className="mb-5">
                    <Label>{t("Brand")}</Label>
                    <Input
                      name="brand"
                      type="number"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder={t("Brand")}
                    />
                  </div>
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
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-[0px 0px 10px 10px] mt-6">
              <CardContent className="py-4 px-4 space-y-4">
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
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addVariation}
                >
                  + Add Another Variation
                </Button>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
