import { useEffect, useState } from "react";
import { useBotConfigs } from "@/hooks/useBotConfigs";

export default function BotConfigForm({ initialData, onSuccess }) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    bot_token: "",
    bot_name: "",
    settings: "{}",
    status: true,
  });

  const { addMutation, updateMutation } = useBotConfigs();

  useEffect(() => {
    if (initialData) {
      setFormData({
        bot_token: initialData.bot_token || "",
        bot_name: initialData.bot_name || "",
        settings: "{}",
        status: initialData.status ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate(
        { id: initialData.bot_id, data: formData },
        {
          onSuccess: () => onSuccess?.(),
        }
      );
    } else {
      addMutation.mutate(formData, {
        onSuccess: () => {
          setFormData({
            bot_token: "",
            bot_name: "",
            settings: "{}",
            status: true,
          });
          onSuccess?.();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4  px-10 py-5 mt-10 border rounded shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Bot Toke</label>
        <input
          name="bot_token"
          value={formData.bot_token}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Bot Name</label>
        <input
          name="bot_name"
          value={formData.bot_name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          name="status"
          value={formData.status ? "true" : "false"}
          onChange={(e) =>
            handleChange({
              target: { name: "status", value: e.target.value === "true" },
            })
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEdit ? "Update Bot" : "Create Bot"}
      </button>
    </form>
  );
}
