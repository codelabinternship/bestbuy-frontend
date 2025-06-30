import { useState } from "react";
import { useFilials } from "@/hooks/useFilials";
import FilialForm from "@/components/shared/Forms/FilialForm";
import { Pen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
export default function Filials() {
  const { data: filials = [], isLoading, deleteFilialMutation } = useFilials();
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingFilial, setEditingFilial] = useState(null);

  const handleEdit = (filial) => {
    setEditingFilial(filial);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this filial?")) {
      deleteFilialMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFilial(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Филиалы</h1>
        <button
          className="bg-green-600 text-white px-5 py-2 rounded"
          onClick={() => {
            setEditingFilial(null);
            setShowForm(true);
          }}
        >
          {editingFilial ? "Редактировать" : "Создать филиал"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <FilialForm
            initialData={editingFilial}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex mt-[230px] justify-center gap-5">
          <div class="three-body">
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="shadow-xl rounded p-3 dark:bg-[#222122] dark:text-white">
          <Table>
            <TableCaption>A list of your recent branches.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t("Name")}</TableHead>
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Tools")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filials.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <p>{cat.address}</p>
                  </TableCell>
                  <TableCell>{cat.phone}</TableCell>
                  <TableCell>{cat.description}</TableCell>
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
      )}
    </div>
  );
}
