import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Task } from '../lib/types';

type Payment = { id: string; client_id: string };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    async function loadFromPayments() {
      const { data, error } = await supabase
        .from('payments')
        .select('id, client_id');
      if (!error && data) {
        const paymentTasks: Task[] = (data as Payment[]).map((p) => ({
          id: `payment-${p.id}`,
          title: `Обработать оплату клиента ${p.client_id}`,
          completed: false,
          payment_id: p.id,
        }));
        setTasks((prev) => [...prev, ...paymentTasks]);
      }
    }
    loadFromPayments();
  }, []);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      completed: false,
      payment_id: null,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle('');
  };

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-2 py-1 rounded flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggle(task.id)}
              className="mr-2"
            />
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.title}
            </span>
          </li>
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-500">no tasks yet</div>
        )}
      </ul>
    </div>
  );
}

