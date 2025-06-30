// DeliveryDepartmentsPage.jsx
import React, { useState } from "react";
import { useDeliveryDepartments } from "@/hooks/useDeliveryDepartments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Pen, Trash2 } from "lucide-react";

import DeliveryDepartmentForm from "../../components/shared/Forms/DeliveryDepartmentForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DeliveryDepartmentsPage = () => {
  const {
    data: departments = [],
    isLoading,
    error,
    deleteDepartment,
  } = useDeliveryDepartments();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleEdit = (dept) => {
    setShowForm(true);
    setEditData(dept);
  };

  const handleDelete = (id) => {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {isLoading ? (
        <div className="flex mt-[230px] justify-center gap-5">
          <div class="three-body">
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dostavka</h1>
            <button
              className="bg-green-600 text-white px-5 py-2 rounded"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              {editingProduct ? "Редактировать" : "Создать продукт"}
            </button>
          </div>
          {showForm && (
            <div className="mb-6">
              <DeliveryDepartmentForm
                initialData={editData}
                onSuccess={() => setEditData(null)}
              />
            </div>
          )}
          <div className="shadow-xl rounded p-3 dark:bg-[#222122] dark:text-white">
            <Table>
              <TableCaption>A list of your recent products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Tools</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{department.address}</TableCell>
                    <TableCell>{department.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-yellow-400 gap-1 flex items-center px-4 py-1 rounded"
                        >
                          <Pen className="w-4 h-4" /> Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
                          className="text-red-500 gap-1 flex items-center px-4 py-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" /> Удалить
                        </button>
                        {/* <VariationManager productId={product.id} /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryDepartmentsPage;
