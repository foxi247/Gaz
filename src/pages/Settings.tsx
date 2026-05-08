import { useState } from 'react';
import type { UserProfile } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { upsertUserProfile } from '../services/users';

interface SettingsProps { user: UserProfile; }

export function Settings({ user }: SettingsProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!isSupabaseConfigured) {
      setSaveMsg('Connect Supabase to save profile changes.');
      setTimeout(() => setSaveMsg(null), 3000);
      return;
    }
    setSaving(true);
    try {
      await upsertUserProfile({ id: user.id, fullName, email });
      setSaveMsg('Profile saved successfully.');
    } catch {
      setSaveMsg('Failed to save profile. Try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <section className="glass-card p-6">
        <h2 className="text-2xl font-extrabold">Profile</h2>
        <div className="mt-6 flex items-center gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="h-20 w-20 rounded-[24px] object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-[24px] bg-graphite text-2xl font-extrabold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xl font-extrabold">{user.fullName}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3"
            />
          </label>
          {saveMsg && (
            <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${saveMsg.includes('success') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {saveMsg}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="pressable rounded-2xl bg-graphite px-5 py-3 font-extrabold text-white shadow-card disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-2xl font-extrabold">Preferences</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            Currency
            <select className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3">
              <option>USD</option><option>EUR</option><option>UZS</option><option>RUB</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Theme
            <select className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3">
              <option>Light premium</option><option>System</option><option>Dark</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Monthly limit
            <input defaultValue="4200" className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Notifications
            <select className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3">
              <option>Enabled</option><option>Only security</option><option>Disabled</option>
            </select>
          </label>
        </div>
        <div className="mt-6 rounded-[24px] bg-neutral-100 p-5">
          <h3 className="font-extrabold">Security</h3>
          <p className="mt-1 text-sm text-muted">
            {isSupabaseConfigured
              ? 'MFA and device session management are available through Supabase Auth.'
              : 'Connect Supabase Auth to enable MFA, device sessions and password reset.'}
          </p>
          {/* TODO: Add MFA toggle, active sessions list, change password flow once Supabase Auth is fully wired */}
        </div>
      </section>
    </div>
  );
}
