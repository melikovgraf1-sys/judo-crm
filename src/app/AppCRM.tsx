import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Users, Settings, LayoutDashboard, Group } from "lucide-react";
import Link from "next/link";
import ClientsPage from "../../pages/clients";

/*
  How to use in your project
  --------------------------
  1) Ensure you have react-router-dom and lucide-react installed.
     npm i react-router-dom lucide-react
  2) Ensure Tailwind is configured (or replace classes with your CSS).
  3) Replace <GroupsPage /> with your existing groups component if you already have CRUD done.
  4) Mount <AppCRM /> at your root (e.g., in main.tsx/tsx or index.tsx).
*/

export default function AppCRM() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <TopNav />
        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Главная", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/groups", label: "Группы", icon: <Group className="w-4 h-4" /> },
    { to: "/clients", label: "Клиенты", icon: <Users className="w-4 h-4" /> },
    { to: "/settings", label: "Настройки", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}> 
          <div className="w-8 h-8 rounded-2xl bg-gray-900 text-white grid place-items-center font-semibold">CJ</div>
          <div className="font-semibold">CRM Judo</div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavItem key={l.to} to={l.to} icon={l.icon} label={l.label} />
          ))}
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-2 bg-white">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} icon={l.icon} label={l.label} onClick={() => setOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, label, icon, onClick }: { to: string; label: string; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition border ${
          isActive
            ? "bg-gray-900 text-white border-gray-900"
            : "border-transparent hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

// -------------------- Pages --------------------
function DashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Добро пожаловать 👋</h1>
      <p className="text-gray-600">Здесь будет краткий обзор: количество групп, клиентов, ближайшие тренировки и задачи.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Группы" value="7" />
        <KPI title="Клиенты" value="63" />
        <KPI title="Тренировки сегодня" value="3" />
        <KPI title="Задачи" value="5" />
      </div>
    </section>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function GroupsPage() {
  // Полноценный CRUD без поля «Название», как ты просил ранее
  type Group = { id: number; age: string; coach: string; loc: string };

  const [items, setItems] = useState<Group[]>([
    { id: 1, age: "4–6", coach: "Русскоязычный", loc: "Центр" },
    { id: 2, age: "6–8", coach: "Русскоязычный", loc: "Джикджилли" },
  ]);

  const [form, setForm] = useState<{ age: string; coach: string; loc: string }>({ age: "", coach: "", loc: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ age: string; coach: string; loc: string }>({ age: "", coach: "", loc: "" });
  const navigate = useNavigate();

  function resetForm() {
    setForm({ age: "", coach: "", loc: "" });
  }

  function addGroup(e: React.FormEvent) {
    e.preventDefault();
    const age = form.age.trim();
    const coach = form.coach.trim();
    const loc = form.loc.trim();
    if (!age || !coach || !loc) return;
    const newItem: Group = { id: Date.now(), age, coach, loc };
    setItems((prev) => [newItem, ...prev]);
    resetForm();
  }

  function startEdit(id: number) {
    const g = items.find((x) => x.id === id);
    if (!g) return;
    setEditingId(id);
    setDraft({ age: g.age, coach: g.coach, loc: g.loc });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: number) {
    const age = draft.age.trim();
    const coach = draft.coach.trim();
    const loc = draft.loc.trim();
    if (!age || !coach || !loc) return;
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, age, coach, loc } : x)));
    setEditingId(null);
  }

  function removeGroup(id: number) {
    if (!confirm("Удалить группу?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Группы</h1>
      </div>

      {/* Форма добавления */}
      <form onSubmit={addGroup} className="rounded-2xl border bg-white p-4 grid sm:grid-cols-4 gap-3">
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="Возраст (например 4–6)"
          value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
        />
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="Тренер"
          value={form.coach}
          onChange={(e) => setForm((f) => ({ ...f, coach: e.target.value }))}
        />
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="Локация"
          value={form.loc}
          onChange={(e) => setForm((f) => ({ ...f, loc: e.target.value }))}
        />
        <button className="px-3 py-2 rounded-xl bg-gray-900 text-white">+ Добавить</button>
      </form>

      {/* Таблица */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Возраст</th>
              <th className="text-left p-3">Тренер</th>
              <th className="text-left p-3">Локация</th>
              <th className="text-left p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>групп пока нет</td>
              </tr>
            )}
            {items.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="p-3">{g.id}</td>
                <td className="p-3">
                  {editingId === g.id ? (
                    <input
                      className="px-2 py-1 rounded-lg border w-full"
                      value={draft.age}
                      onChange={(e) => setDraft((d) => ({ ...d, age: e.target.value }))}
                    />
                  ) : (
                    g.age
                  )}
                </td>
                <td className="p-3">
                  {editingId === g.id ? (
                    <input
                      className="px-2 py-1 rounded-lg border w-full"
                      value={draft.coach}
                      onChange={(e) => setDraft((d) => ({ ...d, coach: e.target.value }))}
                    />
                  ) : (
                    g.coach
                  )}
                </td>
                <td className="p-3">
                  {editingId === g.id ? (
                    <input
                      className="px-2 py-1 rounded-lg border w-full"
                      value={draft.loc}
                      onChange={(e) => setDraft((d) => ({ ...d, loc: e.target.value }))}
                    />
                  ) : (
                    g.loc
                  )}
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  {editingId === g.id ? (
                    <>
                      <button className="px-2 py-1 rounded-lg border" onClick={() => saveEdit(g.id)}>Сохранить</button>
                      <button className="px-2 py-1 rounded-lg border" onClick={cancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button className="px-2 py-1 rounded-lg border" onClick={() => startEdit(g.id)}>Редактировать</button>
                      <button className="px-2 py-1 rounded-lg border" onClick={() => removeGroup(g.id)}>Удалить</button>
                      <button className="px-2 py-1 rounded-lg border" onClick={() => navigate(`/clients?group=${g.id}`)}>Клиенты</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <ToggleRow label="Тёмная тема" />
        <ToggleRow label="Уведомления" />
        <ToggleRow label="Автосохранение" defaultOn />
      </div>
    </section>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-12 h-7 rounded-full border relative transition ${on ? "bg-gray-900 border-gray-900" : "bg-white"}`}
      >
        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="text-center py-16">
      <h1 className="text-2xl font-semibold mb-2">Страница не найдена</h1>
      <p className="text-gray-600">Проверь адрес или вернись на главную.</p>
      <div className="mt-6">
        <Link href="/" className="px-3 py-2 rounded-xl border">
          На главную
        </Link>
      </div>
    </section>
  );
}
