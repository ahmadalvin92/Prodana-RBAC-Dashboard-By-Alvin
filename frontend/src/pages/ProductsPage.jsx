import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import Table from "../components/ui/Table";
import { productService } from "../services/productService";
import { formatCurrency, formatDate } from "../utils/formatters";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stock: 0,
  isActive: true,
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", record: null });
  const [form, setForm] = useState(initialForm);

  const loadProducts = async (params = {}) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await productService.list({ search, ...params });
      setProducts(response.data);
      setMeta(response.meta);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setForm(initialForm);
    setModal({ open: true, mode: "create", record: null });
  };

  const openEditModal = (record) => {
    setForm({
      name: record.name,
      sku: record.sku,
      description: record.description || "",
      price: record.price,
      stock: record.stock,
      isActive: record.isActive,
    });
    setModal({ open: true, mode: "edit", record });
  };

  const closeModal = () => {
    setModal({ open: false, mode: "create", record: null });
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (modal.mode === "edit") {
        await productService.update(modal.record.id, payload);
        setSuccess("Product updated successfully.");
      } else {
        await productService.create(payload);
        setSuccess("Product created successfully.");
      }

      closeModal();
      await loadProducts();
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete ${record.name}?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await productService.remove(record.id);
      setSuccess("Product deleted successfully.");
      await loadProducts();
    } catch (exception) {
      setError(exception.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Product",
        render: (item) => (
          <div>
            <p className="font-medium text-ink">{item.name}</p>
            <p className="text-xs text-muted">{item.sku}</p>
          </div>
        ),
      },
      { key: "price", header: "Price", render: (item) => formatCurrency(item.price) },
      { key: "stock", header: "Stock" },
      {
        key: "status",
        header: "Status",
        render: (item) => <Badge tone={item.isActive ? "active" : "inactive"}>{item.isActive ? "Active" : "Inactive"}</Badge>,
      },
      { key: "createdAt", header: "Created", render: (item) => formatDate(item.createdAt) },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (item) => (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => openEditModal(item)} aria-label={`Edit ${item.name}`}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(item)} aria-label={`Delete ${item.name}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Product Management</h1>
          <p className="mt-1 text-sm text-muted">Maintain sellable products, SKU details, and inventory status.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>
      <Alert message={error} />
      <Alert message={success} tone="success" />
      <form className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row" onSubmit={(event) => { event.preventDefault(); loadProducts({ page: 1 }); }}>
        <Input
          aria-label="Search products"
          placeholder="Search by name, SKU, or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button type="submit" variant="secondary" className="sm:w-auto">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
      {isLoading ? <LoadingState label="Loading products..." /> : products.length ? <Table columns={columns} data={products} /> : <EmptyState />}
      {meta && <p className="text-sm text-muted">Showing {products.length} of {meta.total} products</p>}

      <Modal
        open={modal.open}
        title={modal.mode === "edit" ? "Edit Product" : "Create Product"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving..." : "Save Product"}</Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Input label="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} required />
          <Input label="Price" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
          <Input label="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} required />
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-100"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <Select label="Status" value={String(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.value === "true" }))}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
