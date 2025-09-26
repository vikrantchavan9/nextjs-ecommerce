'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import AddressManager from '../components/AddressManager';

// UI CHANGE: A skeleton loader for a better loading experience
const ProfileSkeleton = () => (
    <div className="w-full max-w-lg p-8 space-y-6 animate-pulse">
      <div className="w-3/4 h-8 rounded bg-gray-200 dark:bg-slate-700"></div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="w-1/4 h-4 mb-2 rounded bg-gray-200 dark:bg-slate-700"></div>
            <div className="w-full h-12 rounded-md bg-gray-200 dark:bg-slate-700"></div>
          </div>
        ))}
        <div className="w-full h-12 mt-4 rounded-md bg-gray-200 dark:bg-slate-700"></div>
      </div>
    </div>
);

export default function PersonalInfoPage() {
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // LOGIC PRESERVED: Your original cookie-based data fetching logic
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));

      if (!userIdCookie) {
        setMessage({ type: 'error', text: 'Please log in to view your info.' });
        setLoading(false);
        return;
      }

      const id = userIdCookie.split('=')[1];
      setUserId(id);

      const { data: userData } = await supabase
        .from('users')
        .select('first_name, last_name, email, phone')
        .eq('id', id)
        .single();

      if (userData) {
        setForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  // LOGIC PRESERVED: Your original form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('users')
      .update(form)
      .eq('id', userId);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center pt-10">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    // UI CHANGE: Themed background and padding
    <div className="min-h-screen bg-background flex flex-col items-center gap-8 p-4 sm:p-6 lg:p-8">
      
      {/* Personal Info */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 border border-black/5">
        <h1 className="text-2xl font-bold mb-6 text-text-primary">Personal Information</h1>

        {/* UI CHANGE: Themed alert messages with Lucide icons */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg mb-6 text-sm ${
              message.type === 'error'
                ? 'bg-red-500/10 text-red-700 border border-red-500/20'
                : 'bg-green-500/10 text-green-700 border border-green-500/20'
            }`}
          >
            {message.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text-muted">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name} // Using value instead of placeholder to show fetched data
              onChange={handleChange}
              placeholder="Enter your first name"
              className="mt-1 block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="mt-1 block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* UI CHANGE: Themed button with loading state and icon */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-colors rounded-full shadow-lg bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-accent/50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Address Section */}
      <div className="w-full max-w-lg">
        <AddressManager userId={userId} />
      </div>
    </div>
  );
}