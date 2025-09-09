import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Client = {
  id: number;
  name: string;
  phone: string;
  group?: string;
};

export default function ClientsPage() {
  // читаем ?group= из URL и подставляем в форму
  const [params] = useSearchParams();
  const prefillGroup = useMemo(() => params.get("group") ?? "", [params]);

  const [form, setForm] = useState<{ name: string; phone: string; group: string }>({
    name: "",
    phone: "",
    group: prefillGroup,
  });

  const [items, setItems] = useState<Client[]>([]);

  function addClient(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const group = form.group.trim();

    if (!name || !phone) return;

    const newClient: Client = {
      id: Date.now(),
      name,
      phone,
      group: group || undefined,
    };

    setItems((prev) => [newClient, ...prev]);
    // очищаем имя/телефон, группу сохраняем (удобно при добавлении нескольких клиентов в одну группу)
    setForm((f) => ({ ...f, name: "", phone: "" }));
  }

  function removeClient(id: number) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Clients</h1>

      {/* Форма добавления */}
      <form
        onSubmit={addClient}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          maxWidth: 1000,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder="Group ID (optional)"
          value={form.group}
          onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
          style={inputStyle}
        />
        <button type="submit" style={primaryBtnStyle}>
          Add client
        </button>
      </form>

      {/* Таблица клиентов */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", color: "#6b7280" }}>
              <th style={thTd}>#</th>
              <th style={thTd}>Name</th>
              <th style={thTd}>Phone</th>
              <th style={thTd}>Group</th>
              <th style={thTd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td style={emptyCell} colSpan={5}>
                  no clients yet
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={thTd}>{c.id}</td>
                  <td style={thTd}>{c.name}</td>
                  <td style={thTd}>{c.phone}</td>
                  <td style={thTd}>{c.group ?? "—"}</td>
                  <td style={thTd}>
                    <button style={secondaryBtnStyle} onClick={() => alert("Open client card (stub)")}>
                      Open
                    </button>{" "}
                    <button style={secondaryBtnStyle} onClick={() => removeClient(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
};

const thTd: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  verticalAlign: "middle",
};

const emptyCell: React.CSSProperties = {
  padding: "16px",
  color: "#6b7280",
  textAlign: "left",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};
