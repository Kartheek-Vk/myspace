import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ListTodo, CalendarDays, BookOpen, GraduationCap, Code2,
  Briefcase, FolderOpen, FileText, BarChart3, Settings, X, Zap,
  LogOut, User, Save, Shield, Target, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { GlobalSearch } from './GlobalSearch';

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/app/tomorrow', label: 'Tomorrow', icon: CalendarDays },
  { path: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/app/journal', label: 'Journal', icon: BookOpen },
  { path: '/app/learning', label: 'Learning', icon: GraduationCap },
  { path: '/app/btech', label: 'B.Tech', icon: GraduationCap },
  { path: '/app/dsa', label: 'DSA', icon: Code2 },
  { path: '/app/goals', label: 'Goals', icon: Target },
  { path: '/app/projects', label: 'Projects', icon: FolderOpen },
  { path: '/app/career', label: 'Career', icon: Briefcase },
  { path: '/app/notes', label: 'Notes', icon: FileText },
  { path: '/app/weekly-review', label: 'Weekly Review', icon: TrendingUp },
  { path: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate('/'); onClose(); };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">MySpace</h1>
          <p className="text-xs text-slate-500">Plan • Do • Grow</p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <GlobalSearch />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile / Guest */}
      <div className="p-4 border-t border-slate-100">
        {isGuest ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <User size={16} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">Guest Mode</p>
                <p className="text-[10px] text-slate-500">Data stored locally</p>
              </div>
            </div>
            <button
              onClick={() => { navigate('/app/settings'); onClose(); }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Save size={14} /> Save Progress
            </button>
          </div>
        ) : user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"><X size={20} className="text-slate-500" /></button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
