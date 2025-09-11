import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabaseClient';

/**
 * Integration tests for basic CRM entities.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
describe('CRM Supabase', () => {
  let clientId: string;
  let leadId: number;
  let taskId: string;
  const today = new Date().toISOString().slice(0, 10);

  it('adds a client', async () => {
    const { data, error } = await supabase
      .from('clients')
      .insert({ first_name: 'Иван' })
      .select()
      .single();
    expect(error).toBeNull();
    clientId = data!.id;
  });

  it('adds a lead', async () => {
    const { data, error } = await supabase
      .from('leads')
      .insert({ name: 'Петр', source: 'telegram', stage: 'queue' })
      .select()
      .single();
    expect(error).toBeNull();
    leadId = data!.id;
  });

  it('adds a task', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: 'Звонок',
        completed: false,
        payment_id: null,
        is_recurring: false,
        due_date: today,
        recurring_interval: null,
        tag: 'other',
        district: 'Центр',
        client_id: null,
      })
      .select()
      .single();
    expect(error).toBeNull();
    taskId = data!.id;
  });

  it('edits a client', async () => {
    const { data, error } = await supabase
      .from('clients')
      .update({ last_name: 'Петров' })
      .eq('id', clientId)
      .select()
      .single();
    expect(error).toBeNull();
    expect(data!.last_name).toBe('Петров');
  });

  it('edits a lead', async () => {
    const { data, error } = await supabase
      .from('leads')
      .update({ stage: 'trial' })
      .eq('id', leadId)
      .select()
      .single();
    expect(error).toBeNull();
    expect(data!.stage).toBe('trial');
  });

  it('edits a task', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ title: 'Перезвонить' })
      .eq('id', taskId)
      .select()
      .single();
    expect(error).toBeNull();
    expect(data!.title).toBe('Перезвонить');
  });

  it('adds attendance mark', async () => {
    const { error } = await supabase
      .from('attendance')
      .upsert({ client_id: clientId, date: today, present: true }, { onConflict: 'client_id,date' });
    expect(error).toBeNull();
  });

  it('removes attendance mark', async () => {
    const { error } = await supabase
      .from('attendance')
      .upsert({ client_id: clientId, date: today, present: false }, { onConflict: 'client_id,date' });
    expect(error).toBeNull();
  });

  it('deletes a client', async () => {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    expect(error).toBeNull();
  });

  it('deletes a lead', async () => {
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    expect(error).toBeNull();
  });

  it('deletes a task', async () => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    expect(error).toBeNull();
  });
});

