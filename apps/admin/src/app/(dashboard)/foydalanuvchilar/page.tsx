"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Shield, Mail, User as UserIcon, X, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Container from "@/components/shared/Container";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  created_at?: string;
}

interface FormData {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: "super-admin" | "admin" | "editor";
  phone?: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  "super-admin": { label: "Super Admin", color: "bg-purple-100 text-purple-800 border-purple-200" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-800 border-blue-200" },
  editor: { label: "Editor", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export default function UsersPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await api.get<{ data: AdminUser[] }>("users");
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await api.post("users", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Foydalanuvchi yaratildi");
      closeModal();
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(msg || "Xatolik yuz berdi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const { id, password, ...rest } = payload;
      const body: Partial<FormData> = { ...rest };
      if (password) body.password = password;
      const { data } = await api.put(`users/${id}`, body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Yangilandi");
      closeModal();
    },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`users/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("O'chirildi");
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(msg || "O'chirishda xatolik");
    },
  });

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "editor" });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setForm({
      id: u.id,
      name: u.name,
      email: u.email,
      password: "",
      role: (u.roles[0] as FormData["role"]) || "editor",
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const confirmDelete = (u: AdminUser) => {
    if (confirm(`"${u.name}" (${u.email}) foydalanuvchini o'chirasizmi?`)) {
      deleteMutation.mutate(u.id);
    }
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
            <p className="text-sm text-gray-500 mt-1">
              Admin foydalanuvchilarini boshqarish (faqat super-admin)
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi foydalanuvchi
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ism</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.roles.map((r) => {
                        const cfg = ROLE_LABELS[r] || { label: r, color: "bg-gray-100 text-gray-700" };
                        return (
                          <span key={r} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                            <Shield className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => confirmDelete(u)}
                        className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        O&apos;chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editUser ? "Tahrirlash" : "Yangi foydalanuvchi"}
              </h2>
              <button type="button" onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ism</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Parol {editUser && <span className="text-gray-400">(bo&apos;sh qoldirsa o&apos;zgarmaydi)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editUser}
                  minLength={8}
                  placeholder={editUser ? "Bo'sh qoldirsa o'zgarmaydi" : "Kamida 8 belgi"}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rol</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as FormData["role"] })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="editor">Editor (kontent tahrirlash)</option>
                <option value="admin">Admin (to&apos;liq boshqaruv)</option>
                <option value="super-admin">Super Admin (foydalanuvchilar ham)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editUser ? "Saqlash" : "Yaratish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}
