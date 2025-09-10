import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Group } from './GroupCard'
import { DISTRICT_OPTIONS } from '../lib/districts'

type Props = {
  initial: Group
  onClose: () => void
  onSaved: () => void
}

export default function EditGroupDialog({ initial, onClose, onSaved }: Props) {
  const [district, setDistrict] = useState(initial.district)
  const [ageBand, setAgeBand] = useState(initial.age_band)
  const [capacity, setCapacity] = useState<number>(initial.capacity)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setLoading(true)
    const { error } = await supabase
      .from('groups')
      .update({ district, age_band: ageBand, capacity })
      .eq('id', initial.id)
    setLoading(false)
    if (error) { setError(error.message); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Редактировать группу</h3>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              className="border rounded-lg px-3 py-2"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Возраст"
              value={ageBand}
              onChange={(e) => setAgeBand(e.target.value)}
            />
            <input
              type="number"
              min={1}
              className="border rounded-lg px-3 py-2"
              placeholder="Вместимость"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Сохраняю…' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
