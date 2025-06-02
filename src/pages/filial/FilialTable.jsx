import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addFilial,
  updateFilial,
  deleteFilial,
  updateProduct,
} from "../../features/filial/Filial";
import { Pen, Trash2, MapPin, Building2, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Switch } from "@/components/ui/switch";
import { getDate } from "date-fns";
import { GetData, PostData, PutData } from "@/api/authApi";

function Filials() {
  const dispatch = useDispatch();
  const [filials, setFilials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filialForm, setFilialForm] = useState({
    name: "",
    geo_location: "",
    address: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilialForm({ ...filialForm, [name]: value });
  };

  const handleSave = async () => {
    const { name, geo_location, address, status } = filialForm;
    if (!name || !geo_location || !address) {
      alert("Barcha maydonlarni to'ldiring.");
      return;
    }

    const newFilial = {
      ...filialForm,
      working_hours: "11",
      description: "dADSASS",
      phone: "1234567",
    };

    if (isEditing) {
      await PutData("/branches/", `${editingId}/`, newFilial);
      dispatch(updateFilial({ branch_id: editingId, ...newFilial }));
      fetchProducts;
    } else {
      await PostData(newFilial, "/branches/");
      dispatch(addFilial(newFilial));
    }
    resetForm();
  };

  const handleEdit = (filial) => {
    setFilialForm({
      name: filial.name,
      geo_location: filial.geo_location,
      address: filial.address,
      status: filial.status,
    });
    setEditingId(filial.branch_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    console.log(id);

    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      dispatch(deleteFilial(id));
    }
  };

  const resetForm = () => {
    setFilialForm({
      name: "",
      geo_location: "",
      address: "",
      status: "active",
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };
  const fetchProducts = async () => {
    const data = await GetData("/branches/");
    setFilials(data);
  };
  useEffect(() => {
    fetchProducts();
    console.log(filials);
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-[#222122] dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Filiallar</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          {isEditing ? "Tahrirlash" : "Yangi filial"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#222122] dark:text-white p-6 border rounded shadow mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold">Nomi</label>
              <input
                name="name"
                type="text"
                value={filialForm.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-[#222122] dark:text-white"
                placeholder="Filial nomi"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Shahar</label>
              <input
                name="geo_location"
                type="text"
                value={filialForm.geo_location}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-[#222122] dark:text-white"
                placeholder="Shahar nomi"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Manzil</label>
              <input
                name="address"
                type="text"
                value={filialForm.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-[#222122] dark:text-white"
                placeholder="Manzil"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Holat</label>
              <select
                name="status"
                value={filialForm.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-[#222122] dark:text-white"
              >
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              {isEditing ? "Yangilash" : "Saqlash"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-black px-6 py-2 rounded"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {filials.length > 0 && (
        <div className="shadow-xl rounded p-3 dark:bg-[#222122] dark:text-white">
          <Table>
            <TableCaption>Filiallar ro'yxati</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Filial</TableHead>
                <TableHead>Shahar</TableHead>
                <TableHead>Manzil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filials.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {f.name}
                  </TableCell>
                  <TableCell className="font-medium  ">
                    {f.geo_location}
                  </TableCell>
                  <TableCell>{f.address}</TableCell>
                  <TableCell>
                    {/* {f.status === "active" ? (
                      <span className="text-green-500">Faol</span>
                    ) : (
                      <span className="text-red-500">Nofaol</span>
                      )} */}
                    <Switch
                      checked={f.status === "active"}
                      id={`switch-${f.id}`}
                      onCheckedChange={(checked) => {
                        const updatedStatus = checked ? "active" : "inactive";
                        dispatch(
                          updateProduct({ ...f, status: updatedStatus })
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-yellow-400 gap-1 flex items-center px-4 py-1 rounded"
                      >
                        <Pen className="w-4 h-4" /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(f.branch_id)}
                        className="text-red-500 gap-1 flex items-center px-4 py-1 rounded"
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
      )}
    </div>
  );
}

export default Filials;
