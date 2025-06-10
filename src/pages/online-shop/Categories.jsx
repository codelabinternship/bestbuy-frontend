import CategoryForm from "@/components/shared/Forms/CategoryForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCategories } from "@/hooks/useCategories";
import { Pen, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProductsCategories() {
  const { t } = useTranslation();
  const {
    data: categories = [],
    isLoading,
    deleteCategoryMutation,
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-[#222122] dark:text-white">
      {isLoading ? (
        <div className="flex items-baseline justify-center gap-5">
          <div class="loader ">
            <div class="loader__bar "></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__ball"></div>
          </div>
          <p className="text-2xl">Loading categories</p>
          <div class="wrapper ">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </div>
      ) : categories.length >= 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Категории</h1>
            <button
              className="bg-green-600 text-white px-5 py-2 rounded"
              onClick={() => {
                setEditingCategory(null);
                X;
                setShowForm(true);
              }}
            >
              {editingCategory ? "Редактировать" : "Создать категорию"}
            </button>
          </div>

          {showForm && (
            <div className="mb-6">
              <CategoryForm
                initialData={editingCategory}
                onSuccess={handleFormSuccess}
              />
            </div>
          )}
          <div className="shadow-xl rounded p-3 dark:bg-[#222122] dark:text-white">
            <Table>
              <TableCaption>A list of your recent categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tools</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <img
                        className="w-[60px] h-[60px] object-cover rounded"
                        src={cat.image}
                        alt={cat.name}
                      />
                    </TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>
                      <p>{cat.description}</p>
                    </TableCell>
                    <TableCell>{cat.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-yellow-400 gap-1 flex items-center px-4 py-1 rounded"
                        >
                          <Pen className="w-4 h-4" /> Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-500 gap-1 flex items-center px-4 py-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" /> Удалить
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <p className="">No categories found.</p>
      )}
    </div>
  );
}
