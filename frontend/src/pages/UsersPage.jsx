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
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import { formatDate } from "../utils/formatters";
import { permissions, ROLES } from "../utils/roles";

const initialForm = {
  name: "",
  email: "",
  password: "",
  roleName: ROLES.VIEWER,
  isActive: true,
};

const UsersPage = () => {
  const { role, user: currentUser } = useAuth();
  const canManageUsers = permissions.canManageUsers(role);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", record: null });
  const [form, setForm] = useState(initialForm);

  const loadUsers = async (params = {}) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await userService.list({ search, ...params });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    if (canManageUsers) {
      userService.listRoles().then((response) => setRoles(response.data)).catch(() => setRoles([]));
    }
  }, []);

  const openCreateModal = () => {
    setForm(initialForm);
    setModal({ open: true, mode: "create", record: null });
  };

  const openEditModal = (record) => {
    setForm({
      name: record.name,
      email: record.email,
      password: "",
      roleName: record.role.name,
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
      password: form.password || undefined,
    };

    try {
      if (modal.mode === "edit") {
        await userService.update(modal.record.id, payload);
        setSuccess("User updated successfully.");
      } else {
        await userService.create(payload);
        setSuccess("User created successfully.");
      }

      closeModal();
      await loadUsers();
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
      await userService.remove(record.id);
      setSuccess("User deleted successfully.");
      await loadUsers();
    } catch (exception) {
      setError(exception.message);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "name",
        header: "Name",
        render: (item) => (
          <div>
            <p className="font-medium text-ink">{item.name}</p>
            <p className="text-xs text-muted">{item.email}</p>
          </div>
        ),
      },
      { key: "role", header: "Role", render: (item) => <Badge>{item.role.name}</Badge> },
      {
        key: "status",
        header: "Status",
        render: (item) => <Badge tone={item.isActive ? "active" : "inactive"}>{item.isActive ? "Active" : "Inactive"}</Badge>,
      },
      { key: "createdAt", header: "Created", render: (item) => formatDate(item.createdAt) },
    ];

    if (!canManageUsers) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (item) => (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => openEditModal(item)} aria-label={`Edit ${item.name}`}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(item)}
              disabled={item.id === currentUser.id}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];
  }, [canManageUsers, currentUser.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">User Management</h1>
          <p className="mt-1 text-sm text-muted">Manage access identities and assigned roles.</p>
        </div>
        {canManageUsers && (
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            New User
          </Button>
        )}
      </div>
      <Alert message={error} />
      <Alert message={success} tone="success" />
      <form className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row" onSubmit={(event) => { event.preventDefault(); loadUsers({ page: 1 }); }}>
        <Input
          aria-label="Search users"
          placeholder="Search by name, email, or role"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button type="submit" variant="secondary" className="sm:w-auto">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
      {isLoading ? <LoadingState label="Loading users..." /> : users.length ? <Table columns={columns} data={users} /> : <EmptyState />}
      {meta && <p className="text-sm text-muted">Showing {users.length} of {meta.total} users</p>}

      <Modal
        open={modal.open}
        title={modal.mode === "edit" ? "Edit User" : "Create User"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving..." : "Save User"}</Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <Input label={modal.mode === "edit" ? "Password (optional)" : "Password"} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required={modal.mode === "create"} />
          <Select label="Role" value={form.roleName} onChange={(event) => setForm((current) => ({ ...current, roleName: event.target.value }))}>
            {roles.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </Select>
          <Select label="Status" value={String(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.value === "true" }))}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
