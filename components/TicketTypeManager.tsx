"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

type FormState = { name: string; price: string; totalQuantity: string; description: string };

export default function TicketTypeManager({ eventId, currency }: { eventId: Id<"events">; currency?: string }) {
  const types = useQuery(api.ticketTypes.getByEvent, { eventId });
  const createType = useMutation(api.ticketTypes.create);
  const updateType = useMutation(api.ticketTypes.update);
  const removeType = useMutation(api.ticketTypes.remove);

  const symbol = currency === "etb" ? "ETB" : currency === "usd" ? "$" : "£";

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"ticketTypes"> | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", price: "", totalQuantity: "", description: "" });

  const resetForm = () => {
    setForm({ name: "", price: "", totalQuantity: "", description: "" });
    setAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.totalQuantity) return;
    if (editingId) {
      await updateType({
        ticketTypeId: editingId,
        name: form.name,
        price: Number(form.price),
        totalQuantity: Number(form.totalQuantity),
        description: form.description || undefined,
      });
    } else {
      await createType({
        eventId,
        name: form.name,
        price: Number(form.price),
        totalQuantity: Number(form.totalQuantity),
        description: form.description || undefined,
      });
    }
    resetForm();
  };

  const startEdit = (t: NonNullable<typeof types>[0]) => {
    setEditingId(t._id);
    setForm({ name: t.name, price: String(t.price), totalQuantity: String(t.totalQuantity), description: t.description ?? "" });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Ticket Types</h3>
        {!adding && !editingId && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Type
          </button>
        )}
      </div>

      {/* Existing types */}
      {types?.map((t) => (
        <div key={t._id} className="border border-gray-200 rounded-lg p-3">
          {editingId === t._id ? (
            <TypeForm form={form} setForm={setForm} symbol={symbol} onSave={handleSave} onCancel={resetForm} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{symbol} {t.price.toFixed(2)} · {t.totalQuantity} tickets</p>
                {t.description && <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)} className="text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => removeType({ ticketTypeId: t._id })} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new form */}
      {adding && (
        <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
          <TypeForm form={form} setForm={setForm} symbol={symbol} onSave={handleSave} onCancel={resetForm} />
        </div>
      )}

      {types?.length === 0 && !adding && (
        <p className="text-sm text-gray-400 text-center py-2">No ticket types yet. Add VIP, General, Student etc.</p>
      )}
    </div>
  );
}

function TypeForm({ form, setForm, symbol, onSave, onCancel }: {
  form: FormState;
  setForm: (f: FormState | ((prev: FormState) => FormState)) => void;
  symbol: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Name (e.g. VIP)" value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full" />
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">{symbol}</span>
          <input type="number" placeholder="Price" value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-sm w-full" />
        </div>
      </div>
      <input type="number" placeholder="Total quantity" value={form.totalQuantity}
        onChange={(e) => setForm((f) => ({ ...f, totalQuantity: e.target.value }))}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full" />
      <input placeholder="Description (optional)" value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full" />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /> Cancel</button>
        <button onClick={onSave} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"><Check className="w-4 h-4" /> Save</button>
      </div>
    </div>
  );
}
