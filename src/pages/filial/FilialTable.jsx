import { useState } from "react";
import { useFilials } from "@/hooks/useFilials";
import FilialForm from "@/components/shared/Forms/FilialForm";
import { Pen, Trash2 } from "lucide-react";

export default function Filials() {
  const { data: filials = [], isLoading, deleteFilialMutation } = useFilials();

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
        <p>Loading filials...</p>
      ) : (
        <div className="shadow rounded border p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Working Hours</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filials.map((filial) => (
                <tr key={filial.id} className="border-t">
                  <td>{filial.name}</td>
                  <td>{filial.address}</td>
                  <td>{filial.phone}</td>
                  <td>{filial.working_hours}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(filial)}
                        className="text-yellow-500 flex items-center gap-1"
                      >
                        <Pen className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(filial.branch_id)}
                        className="text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filials.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No filials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
