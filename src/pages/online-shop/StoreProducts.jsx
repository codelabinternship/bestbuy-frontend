import ProductForm from "@/components/shared/Forms/ProductsForm";
import ProductWithVariations from "@/components/shared/Forms/prva";
import VariationManager from "@/components/shared/Variations/VariationManager";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useProducts } from "@/hooks/useProducts";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProductsList() {
  const { t } = useTranslation();
  const {
    data: products = [],
    isLoading,
    deleteProductMutation,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleFormSuccess = (createdProduct) => {
    setEditingProduct(null);
    setShowForm(false);
    setProductId(createdProduct.id); // yangi qo‘shilgan product id
    setShowVariationForm(true); // variations form ochiladi
  };

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-[#222122] dark:text-white">
      {isLoading ? (
        <div className="flex mt-[230px] justify-center gap-5">
          <div class="three-body">
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
          </div>
        </div>
      ) : products.length >= 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Продукты</h1>
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
              <ProductForm
                initialData={editingProduct}
                onSuccess={handleFormSuccess}
              />
              {/* <ProductWithVariations/> */}
            </div>
          )}
          <div className="shadow-xl rounded p-3 dark:bg-[#222122] dark:text-white">
            <Table>
              <TableCaption>A list of your recent products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t("Image")}</TableHead>
                  <TableHead>{t("Title")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Price")}</TableHead>
                  <TableHead className="text-right">{t("Tools")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        className="w-[60px] h-[60px] object-cover rounded"
                        src={product.media}
                        alt={product.name}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price} so'm</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-yellow-400 gap-1 flex items-center px-4 py-1 rounded"
                        >
                          <Pen className="w-4 h-4" /> Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
