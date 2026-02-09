'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, clearSession } from '@/lib/auth';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TodosPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSessionState] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentSession = await getSession();
        setSessionState(currentSession);

        // Get auth header if session exists
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (currentSession?.token) {
          headers["Authorization"] = `Bearer ${currentSession.token}`;
        }

        const response = await fetch(`${API_URL}/api/tasks`, { headers });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Please login to see your tasks');
            return;
          }
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAuthHeaders = async () => {
    const currentSession = await getSession();
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (currentSession?.token) {
      headers["Authorization"] = `Bearer ${currentSession.token}`;
    }
    return headers;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleLogout = async () => {
    await clearSession();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-3xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
              📝
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Tasks</h1>
              <p className="text-gray-400 text-sm">Stay organized and productive</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session && (
              <div className="text-right bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                <p className="text-white text-sm font-medium">{session.user?.email || 'User'}</p>
                <p className="text-gray-500 text-xs">Logged in</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium shadow-lg shadow-red-600/20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Progress</h2>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{tasks.filter(t => t.completed).length} of {tasks.length}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/30"
                style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}% Complete</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg mb-6">
            <p className="text-red-400 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-5 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-8 py-3 rounded-lg font-bold transition duration-200 transform hover:scale-105 capitalize"
            >
              Add
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin text-5xl mb-4">⏳</div>
              <p className="text-white text-lg font-medium">Loading your tasks...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">No tasks yet</h2>
            <p className="text-gray-400 mb-8">Create your first task to get started!</p>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full mb-4 text-4xl animate-bounce shadow-lg shadow-cyan-500/20">
              ⬆️
            </div>
          </div>
        )}

        {/* Task List */}
        {!loading && tasks.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-5 border-b border-gray-800 hover:bg-gray-800 hover:border-cyan-500/30 transition group last:border-b-0 animate-in fade-in slide-in-from-top"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                  className="w-6 h-6 accent-cyan-500 rounded cursor-pointer transition hover:scale-110"
                />
                <span
                  className={`flex-1 text-lg font-medium transition-all ${
                    task.completed
                      ? 'line-through text-gray-600'
                      : 'text-white'
                  }`}
                >
                  {task.title}
                </span>
                {task.completed && <span className="text-2xl">✅</span>}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition duration-200 text-2xl hover:scale-125 transform"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state with animation */}
        {!loading && tasks.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-indigo-100 font-semibold">
              🎉 Keep going! You're doing great.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
