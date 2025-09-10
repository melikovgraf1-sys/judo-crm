import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DISTRICT_OPTIONS } from '../lib/districts'

type Props = {
  onCreated?: () => void
}

export default function AddGroupForm({ onCreated }: Props) {
  const [district, setDistrict] = useState<string>(DISTRICT_OPTIONS[0])
  const [ageBand, setAgeBand] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!district || !ageBand || !capacity) {
      setError('Заполни все поля')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('groups').insert({
      district,
      age_band: ageBand,
      capacity: Number(capacity),
    })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
    // очистим форму и обновим список
    setDistrict(DISTRICT_OPTIONS[0])
    setAgeBand('')
    setCapacity('')
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow">
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
          placeholder="Возраст (например, 4-6 лет)"
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2"
          type="number"
          min={1}
          placeholder="Вместимость"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <div className="mt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Добавляю…' : '+ Добавить группу'}
        </button>
      </div>
    </form>
  )
}
