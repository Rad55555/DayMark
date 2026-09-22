'use client';

import { FormEvent, useEffect, useState } from 'react';

type Task = { id: number; title: string; isComplete: boolean; createdAt: string };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(setTasks)
      .catch(() => setError('Start the .NET backend to load your tasks.'))
      .finally(() => setIsLoading(false));
  }, []);

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true); setError('');
    try {
      const response = await fetch(`${API_URL}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      if (!response.ok) throw new Error();
      const task = await response.json();
      setTasks(current => [task, ...current]); setTitle('');
    } catch { setError('The task could not be saved. Check that the backend is running.'); }
    finally { setIsSaving(false); }
  }

  async function toggleTask(task: Task) {
    const response = await fetch(`${API_URL}/tasks/${task.id}`, { method: 'PATCH' });
    if (response.ok) { const updated = await response.json(); setTasks(current => current.map(item => item.id === updated.id ? updated : item)); }
  }

  async function deleteTask(id: number) {
    const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) setTasks(current => current.filter(task => task.id !== id));
  }

  const completed = tasks.filter(task => task.isComplete).length;
  return (
    <main className="shell">
      <section className="hero"><div className="eyebrow"><span className="status-dot" /> Connected workspace</div><h1>Make room for<br /><em>what matters.</em></h1><p className="intro">A calm place to collect the small commitments that move your day forward.</p></section>
      <section className="board" aria-label="Task board">
        <div className="board-header"><div><p className="kicker">Today&apos;s focus</p><h2>{completed} of {tasks.length} complete</h2></div><div className="count">{tasks.length.toString().padStart(2, '0')}</div></div>
        <form className="task-form" onSubmit={addTask}><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Add a new task..." aria-label="New task title" /><button type="submit" disabled={isSaving || !title.trim()}>{isSaving ? 'Saving' : 'Add task'} <span>↗</span></button></form>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="task-list">{isLoading ? <p className="empty">Loading your workspace...</p> : tasks.length === 0 ? <p className="empty">Nothing here yet. Add the first thing you want to finish.</p> : tasks.map(task => <article className={`task ${task.isComplete ? 'complete' : ''}`} key={task.id}><button className="check" onClick={() => toggleTask(task)} aria-label={`Mark ${task.title} ${task.isComplete ? 'incomplete' : 'complete'}`}><span>✓</span></button><span className="task-title">{task.title}</span><button className="delete" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button></article>)}</div>
        <p className="storage-note"><span>●</span> Saved to your local SQLite database</p>
      </section>
    </main>
  );
}