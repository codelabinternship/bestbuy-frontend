// DeliveryDepartmentForm.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeliveryDepartments } from "@/hooks/useDeliveryDepartments";

export default function DeliveryDepartmentForm({
  initialData = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const { addDepartment, updateDepartment } = useDeliveryDepartments();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await updateDepartment({ id: initialData.id, updatedData: formData });
      } else {
        await addDepartment(formData);
      }
      alert("Saqlandi");
      onSuccess?.();
      setFormData({ name: "", address: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Bo‘lim nomi"
            required
          />
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Manzili"
            required
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon raqami"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
