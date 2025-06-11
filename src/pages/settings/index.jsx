import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMe } from "@/hooks/useMe";
import { useUpdateMarket } from "@/hooks/useMarket";

export default function Settings() {
  const { data: profile, isLoading, isError } = useMe();
  const updateMarket = useUpdateMarket();

  const [form, setForm] = useState({
    name: "",
    address: "",
    working_hours_from: "09:00",
    working_hours_to: "18:00",
    is_daily: true,
    logo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (profile?.market) {
      const m = profile.market;
      setForm({
        name: m.name,
        is_daily: m.is_daily,
        working_hours_from: m.working_hours_from || "09:00",
        working_hours_to: m.working_hours_to || "18:00",
        address: m.address || "",
        logo: null || m.logo,
        user: profile.user.id,
      });
      console.log(m.logo);

      setImagePreview(`http://127.0.0.1:8000${m.logo}`);
    }
  }, [profile]);

  const handleTime = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSchedule = (val) =>
    setForm((p) => ({ ...p, is_daily: val === "daily" }));

  const saveSettings = () => {
    if (!profile?.market) return;
    const formdata = new FormData();

    formdata.append("name", form.name);
    formdata.append("is_daily", form.is_daily);
    formdata.append("working_hours_from", form.working_hours_from);
    formdata.append("working_hours_to", form.working_hours_to);
    formdata.append("address", form.address);
    formdata.append("logo", form.logo);
    formdata.append("user", form.user);
    updateMarket.mutate({
      id: profile.market.id,
      payload: formdata,
    });
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  if (isLoading) return <p className="m-4">Yuklanmoqda...</p>;
  if (isError) return <p className="m-4 text-red-600">Xatolik yuz berdi.</p>;

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-xl font-semibold">Boshqaruv paneli</h1>

      <section className="flex flex-wrap gap-6 items-end">
        <div>
          <p className="mb-2 font-medium">Ish vaqti</p>
          <Select
            defaultValue={form.is_daily ? "daily" : "weekdays"}
            onValueChange={handleSchedule}
          >
            <SelectTrigger className="w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Har kuni</SelectItem>
              <SelectItem value="weekdays">Dushanbadan Jumagacha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2 font-medium">Dan</p>
          <Input
            type="time"
            value={form.working_hours_from}
            onChange={handleTime("working_hours_from")}
            className="w-40"
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Gacha</p>
          <Input
            type="time"
            value={form.working_hours_to}
            onChange={handleTime("working_hours_to")}
            className="w-40"
          />
        </div>
      </section>

      {/* Manzil */}
      <section>
        <p className="mb-2 font-medium">Manzil</p>
        <Input
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          placeholder="Market manzilingiz"
        />
      </section>
      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input
          type="file"
          name="logo"
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
      <section>
        <p className="mb-2 font-medium">Do'kon Nomi</p>
        <Input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Market manzilingiz"
        />
      </section>

      {/* Saqlash */}
      <button
        onClick={saveSettings}
        disabled={updateMarket.isPending}
        className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {updateMarket.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>

      {updateMarket.isSuccess && (
        <p className="text-green-600">Sozlamalar saqlandi!</p>
      )}
      {updateMarket.isError && (
        <p className="text-red-600">Saqlashda xatolik yuz berdi.</p>
      )}
    </div>
  );
}
