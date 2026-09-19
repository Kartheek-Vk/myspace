import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, LogOut, Save, CheckCircle2, Camera, Sparkles, Bell, Palette, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore, AVATAR_PRESETS, REWARD_TYPES } from '../store/profileStore';
import { LoginButtons } from '../components/auth/LoginButtons';

type SettingsTab = 'profile' | 'avatar' | 'wish' | 'rewards' | 'notifications' | 'account';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, guestId, logout } = useAuthStore();
  const { profile, updateProfile } = useProfileStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleLogout = () => { logout(); navigate('/'); };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'avatar', label: 'Avatar', icon: Camera },
    { id: 'wish', label: 'Wish & Motto', icon: Sparkles },
    { id: 'rewards', label: 'Rewards', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Personalize your MySpace experience.</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {saved && <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2"><CheckCircle2 size={14} /> Saved!</div>}

          {/* Profile */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800 text-lg">Personal Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input value={profile.name} onChange={e => updateProfile({ name: e.target.value })} placeholder="Your full name" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nickname</label>
                  <input value={profile.nickname} onChange={e => updateProfile({ nickname: e.target.value })} placeholder="What should MySpace call you?" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Favorite Quote</label>
                <input value={profile.favoriteQuote} onChange={e => updateProfile({ favoriteQuote: e.target.value })} placeholder="Your favorite motivational quote" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Bio</label>
                <textarea value={profile.bio} onChange={e => updateProfile({ bio: e.target.value })} placeholder="A few words about you..." rows={2} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Birthday</label>
                  <input type="date" value={profile.birthday} onChange={e => updateProfile({ birthday: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Favorite Color</label>
                  <input type="color" value={profile.favoriteColor} onChange={e => updateProfile({ favoriteColor: e.target.value })} className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer" />
                </div>
              </div>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={14} /> Save Profile</button>
            </motion.div>
          )}

          {/* Avatar */}
          {activeTab === 'avatar' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Choose Your Avatar</h2>
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-slate-50">
                <span className="text-5xl">{profile.avatar}</span>
                <div>
                  <p className="font-medium text-slate-800">Current Avatar</p>
                  <p className="text-xs text-slate-500">Click any avatar below to select it</p>
                </div>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                {AVATAR_PRESETS.map((a, i) => (
                  <button key={i} onClick={() => { updateProfile({ avatar: a.emoji, avatarType: 'preset' }); handleSave(); }} className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all hover:scale-110 ${profile.avatar === a.emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    {a.emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Wish & Motto */}
          {activeTab === 'wish' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800 text-lg">Personal Wish & Motto</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Motto</label>
                <input value={profile.motto} onChange={e => updateProfile({ motto: e.target.value })} placeholder="e.g., Plan • Do • Grow" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">My Wish / Vision</label>
                <textarea value={profile.personalWish} onChange={e => updateProfile({ personalWish: e.target.value })} placeholder="What are you working toward? e.g., Become a strong software engineer, get a great internship..." rows={4} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
                <p className="text-xs text-slate-400 mt-1">This will appear on your Dashboard as a personal reminder.</p>
              </div>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={14} /> Save</button>
            </motion.div>
          )}

          {/* Rewards */}
          {activeTab === 'rewards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800 text-lg">Daily Reward System</h2>
              <p className="text-sm text-slate-600">When you finish your daily plan, your entertainment reward unlocks.</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">Reward System</span>
                <button onClick={() => { updateProfile({ rewardEnabled: !profile.rewardEnabled }); handleSave(); }} className={`w-12 h-6 rounded-full transition-colors ${profile.rewardEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${profile.rewardEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {profile.rewardEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reward Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {REWARD_TYPES.map(r => (
                        <button key={r.label} onClick={() => { updateProfile({ rewardType: `${r.emoji} ${r.label}` }); handleSave(); }} className={`p-3 rounded-xl text-center transition-all ${profile.rewardType === `${r.emoji} ${r.label}` ? 'bg-purple-50 ring-2 ring-purple-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                          <span className="text-2xl">{r.emoji}</span>
                          <p className="text-[10px] text-slate-600 mt-1">{r.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                    <input type="number" value={profile.rewardDuration} onChange={e => { updateProfile({ rewardDuration: Number(e.target.value) }); handleSave(); }} min={10} max={300} className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Completion Message</label>
                    <input value={profile.rewardMessage} onChange={e => { updateProfile({ rewardMessage: e.target.value }); handleSave(); }} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm font-medium text-slate-700">Require 100% completion</span>
                    <button onClick={() => { updateProfile({ requireFullCompletion: !profile.requireFullCompletion }); handleSave(); }} className={`w-12 h-6 rounded-full transition-colors ${profile.requireFullCompletion ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${profile.requireFullCompletion ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800 text-lg">Email Notifications</h2>
              {isGuest ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-800">Sign in with Google to enable email notifications.</p>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-sm text-green-800">Sending to: <strong>{user?.email}</strong></span>
                  </div>
                  {(['dailyComplete', 'tomorrowReminder', 'individualTask', 'overdueTask'] as const).map(key => {
                    const labels = { dailyComplete: 'Daily plan completed', tomorrowReminder: 'Tomorrow reminder', individualTask: 'Individual task completed', overdueTask: 'Overdue task' };
                    return (
                      <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                        <span className="text-sm text-slate-700">{labels[key]}</span>
                        <button onClick={() => { updateProfile({ emailNotifications: { ...profile.emailNotifications, [key]: !profile.emailNotifications[key] } }); handleSave(); }} className={`w-12 h-6 rounded-full transition-colors ${profile.emailNotifications[key] ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${profile.emailNotifications[key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </motion.div>
          )}

          {/* Account */}
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800 text-lg">Account</h2>
              {isGuest ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><User size={18} className="text-amber-600" /></div>
                    <div>
                      <p className="font-medium text-slate-800">Guest Mode</p>
                      <p className="text-xs text-slate-500">Data stored locally • {guestId}</p>
                    </div>
                  </div>
                  <LoginButtons onSuccess={() => window.location.reload()} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
                    {user?.picture ? <img src={user.picture} className="w-10 h-10 rounded-full" alt="" /> : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><User size={18} className="text-blue-600" /></div>}
                    <div>
                      <p className="font-medium text-slate-800">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <p className="text-[10px] text-green-600 mt-0.5">✓ Google Account</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium"><LogOut size={14} /> Logout</button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
