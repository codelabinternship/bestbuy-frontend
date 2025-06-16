import { useEffect, useState } from "react";
import { useFilials } from "@/hooks/useFilials";

export default function FilialForm({ initialData, onSuccess }) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    working_hours: "",
    description: "",
    geo_location: "",
  });

  const { addFilialMutation, updateFilialMutation } = useFilials();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        working_hours: initialData.working_hours || "",
        description: initialData.description || "",
        geo_location: initialData.geo_location || "",
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateFilialMutation.mutate(
        { id: initialData.branch_id, data: formData },
        {
          onSuccess: () => onSuccess?.(),
        }
      );
    } else {
      addFilialMutation.mutate(formData, {
        onSuccess: () => {
          setFormData({
            name: "",
            address: "",
            phone: "",
            working_hours: "",
            description: "",
            geo_location: "",
          });
          onSuccess?.();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max p-4 border rounded shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Working Hours</label>
        <input
          type="text"
          name="working_hours"
          value={formData.working_hours}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
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
        <label className="block mb-1 font-medium">Geo Location</label>
        <input
          type="text"
          name="geo_location"
          value={formData.geo_location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={addFilialMutation.isPending || updateFilialMutation.isPending}
      >
        {isEdit ? "Update Filial" : "Add Filial"}
      </button>
    </form>
  );
}
