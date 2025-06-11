"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePaymentMethods } from "@/hooks/usePaymentMethods"; // 👈 Hook yo'lini moslashtiring

export default function Loyality() {
  const {
    data: paymentMethods = [],
    isLoading,
    error,
    addPaymentMethodMutation,
    updatePaymentMethodMutation,
    deletePaymentMethodMutation,
  } = usePaymentMethods();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (!form.name || !form.description) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    const newData = {
      ...form,
    };

    if (isEditing) {
      updatePaymentMethodMutation.mutate({
        id: editingId,
        updatedData: newData,
      });
    } else {
      addPaymentMethodMutation.mutate(newData);
    }

    resetForm();
  };

  const handleEdit = (method) => {
    setForm({ ...method });
    setEditingId(method.payment_method_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      deletePaymentMethodMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      status: true,
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 dark:bg-background dark:text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">To'lov Servislar</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
        >
          {isEditing ? "Tahrirlash" : "Yangi Servis"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-muted dark:border dark:border-border p-6 rounded-lg shadow-sm mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nomi</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-border dark:bg-background dark:text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium">Qo'shimcha ma'lumot</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-border dark:bg-background dark:text-foreground px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            >
              {isEditing ? "Yangilash" : "Saqlash"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-muted dark:hover:bg-muted-foreground text-black dark:text-foreground px-6 py-2 rounded transition"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p>Xatolik yuz berdi: {error.message}</p>
      ) : paymentMethods.length > 0 ? (
        <div className="rounded-lg border dark:border-border overflow-x-auto">
          <Table>
            <TableCaption>Servislar ro'yxati</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Qo'shimcha ma'lumot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Instrumentlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map((method) => (
                <TableRow key={method.payment_method_id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={method.status === true}
                      onCheckedChange={(checked) =>
                        updatePaymentMethodMutation.mutate({
                          id: method.payment_method_id,
                          updatedData: {
                            ...method,
                            status: checked ? true : false,
                          },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(method)}
                        className="text-yellow-400 hover:text-yellow-500 flex items-center gap-1 transition"
                      >
                        <Pen className="w-4 h-4" /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(method.payment_method_id)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-4 h-4" /> O'chirish
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Hozircha hech qanday servis yo‘q.</p>
      )}
    </div>
  );
}
