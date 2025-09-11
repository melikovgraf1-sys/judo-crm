import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TASK_TAG_TITLES } from '../lib/types';
import type {
  Task,
  TaskTag,
  Client,
  District,
  RecurrenceInterval,
} from '../lib/types';
import { createTask, fetchTasks, updateTask, deleteTask } from '../lib/tasks';

type Payment = { id: string; client_id: string };

const INTERVAL_LABELS: Record<RecurrenceInterval, string> = {
  weekly: 'еженед.',
  monthly: 'ежемес.',
  yearly: 'ежегод.',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] =
    useState<RecurrenceInterval>('monthly');
  const [tag, setTag] = useState<TaskTag>('other');
  const [district, setDistrict] = useState<District>('Центр');
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const dbTasks = await fetchTasks();
        setTasks(dbTasks);
        const { data, error } = await supabase
          .from('payments')
          .select('id, client_id');
        if (!error && data) {
          const paymentTasks: Task[] = (data as Payment[]).map((p) => ({
            id: `payment-${p.id}`,
            title: `Обработать оплату клиента ${p.client_id}`,
            completed: false,
            payment_id: p.id,
            is_recurring: false,
            due_date: null,
            recurring_interval: null,
            tag: 'payment',
            district: null,
            client_id: p.client_id,
          }));
          setTasks((prev) => [...prev, ...paymentTasks]);
        }

        const { data: clientsData } = await supabase
          .from('clients')
          .select('id, first_name, last_name');
        if (clientsData) {
          setClients(clientsData as Client[]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      return;
    }
    try {
      const task = await createTask({
        title: title.trim(),
        completed: false,
        payment_id: null,
        is_recurring: isRecurring,
        due_date: dueDate || null,
        recurring_interval: isRecurring ? recurringInterval : null,
        tag,
        district,
        client_id: clientId || null,
      });
      setTasks((prev) => [...prev, task]);
      setTitle('');
      setDueDate('');
      setRecurringInterval('monthly');
      setIsRecurring(false);
      setTag('other');
      setDistrict('Центр');
      setClientId('');
      setShowForm(false);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const toggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: updated } : t))
    );
    if (!id.startsWith('payment-')) {
      await updateTask(id, { completed: updated });
    }
  };

  const remove = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (!id.startsWith('payment-')) {
      await deleteTask(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Задачи</h1>
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Добавить задачу
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded space-y-2 w-80">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название задачи"
              autoFocus
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  Регулярная
                </label>
                {isRecurring && (
                  <select
                    className="border px-2 py-1 rounded"
                    value={recurringInterval}
                    onChange={(e) =>
                      setRecurringInterval(e.target.value as RecurrenceInterval)
                    }
                  >
                    <option value="weekly">Раз в неделю</option>
                    <option value="monthly">Раз в месяц</option>
                    <option value="yearly">Раз в год</option>
                  </select>
                )}
              </div>
              <input
                type="date"
                className="border px-2 py-1 rounded w-full"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <select
              className="border px-2 py-1 rounded w-full"
              value={district}
              onChange={(e) => setDistrict(e.target.value as District)}
            >
              <option value="Центр">Центр</option>
              <option value="Джикджилли">Джикджилли</option>
              <option value="Махмутлар">Махмутлар</option>
            </select>
            <select
              className="border px-2 py-1 rounded w-full"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Клиент</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name ?? ''}
                </option>
              ))}
            </select>
            <select
              className="border px-2 py-1 rounded w-full"
              value={tag}
              onChange={(e) => setTag(e.target.value as TaskTag)}
            >
              <option value="rent">Аренда</option>
              <option value="payment">Платеж</option>
              <option value="birthday">День рождения</option>
              <option value="other">Другое</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setTitle('');
                  setDueDate('');
                  setRecurringInterval('monthly');
                  setIsRecurring(false);
                  setTag('other');
                  setDistrict('Центр');
                  setClientId('');
                }}
                className="px-3 py-1 border rounded"
              >
                Отмена
              </button>
              <button
                onClick={addTask}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggle(task.id)}
            />
            <span
              className={task.completed ? 'line-through text-gray-500' : ''}
            >
              {task.title}
            </span>
            {task.due_date && (
              <span className="text-sm text-gray-500">{task.due_date}</span>
            )}
            {task.is_recurring && task.recurring_interval && (
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                {INTERVAL_LABELS[task.recurring_interval]}
              </span>
            )}
            {task.district && (
              <span className="text-xs bg-green-100 px-2 py-0.5 rounded">
                {task.district}
              </span>
            )}
            {task.client_id && (
              <span className="text-xs bg-purple-100 px-2 py-0.5 rounded">
                {(() => {
                  const c = clients.find((c) => c.id === task.client_id);
                  return c
                    ? `${c.first_name} ${c.last_name ?? ''}`
                    : task.client_id;
                })()}
              </span>
            )}
            <span className="ml-auto text-xs bg-blue-100 px-2 py-0.5 rounded">
              {TASK_TAG_TITLES[task.tag]}
            </span>
            <button
              onClick={() => remove(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-500">Задач пока нет</div>
        )}
      </ul>
    </div>
  );
}

