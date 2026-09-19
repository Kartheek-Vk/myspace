import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Target,
  BookOpen,
  BarChart3,
  PenTool,
  FolderOpen,
  TrendingUp,
  ArrowDown,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronUp,
  Shield,
  Lock,
  User,
  ListTodo,
  CalendarDays,
  Rocket,
  Code2,
  GraduationCap,
  Briefcase,
  FileText,
} from 'lucide-react';
import { LoginButtons } from '../components/auth/LoginButtons';
import { useAuthStore } from '../store/authStore';
import { ProgressBar } from '../components/common/ProgressBar';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">MySpace</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('workflow')} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">How it works</button>
            <button onClick={() => scrollToSection('progress')} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Progress</button>
            <button onClick={() => scrollToSection('login')} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Sign in</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-6">
                <Sparkles size={12} />
                Plan • Do • Grow
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                A better you,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  one day at a time.
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                Plan your days, organize your learning, track your progress, and build the future you're working toward.
              </p>

              <div className="mt-8" id="login">
                <LoginButtons onSuccess={() => navigate('/app/dashboard')} />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Explore MySpace <ArrowDown size={14} />
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Shield size={12} /> Private</span>
                <span className="flex items-center gap-1"><Lock size={12} /> Personal</span>
                <span className="flex items-center gap-1"><User size={12} /> Simple</span>
              </div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Dashboard Preview */}
      <div className="lg:hidden px-4 pb-16">
        <DashboardPreview />
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Everything you need in one place.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                One personal space for your tasks, learning, college work, projects and career.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: 'Plan',
                  desc: 'Organize your day, tomorrow and upcoming work. You decide what matters.',
                  color: '#3b82f6',
                  bg: '#eff6ff',
                },
                {
                  icon: GraduationCap,
                  title: 'Learn',
                  desc: 'Keep B.Tech, DSA, Java, Python and other learning in one place.',
                  color: '#8b5cf6',
                  bg: '#f5f3ff',
                },
                {
                  icon: BarChart3,
                  title: 'Track',
                  desc: 'Break tasks into subtasks and watch your progress increase.',
                  color: '#22c55e',
                  bg: '#f0fdf4',
                },
                {
                  icon: PenTool,
                  title: 'Reflect',
                  desc: 'Record what you did, what you learned and what needs improvement.',
                  color: '#f97316',
                  bg: '#fff7ed',
                },
                {
                  icon: FolderOpen,
                  title: 'Build',
                  desc: 'Track projects, skills and career progress all in one view.',
                  color: '#06b6d4',
                  bg: '#ecfeff',
                },
                {
                  icon: TrendingUp,
                  title: 'Grow',
                  desc: 'Look back at your consistency and see how far you\'ve come.',
                  color: '#ec4899',
                  bg: '#fdf2f8',
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <feature.icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your day. Your way.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                MySpace doesn't decide what you should do. <strong>You do.</strong>
              </p>
            </motion.div>

            <div className="max-w-md mx-auto">
              {[
                { step: 'Plan', desc: 'Decide what matters today', icon: Target },
                { step: 'Create Task', desc: 'Add what you need to do', icon: ListTodo },
                { step: 'Break into Subtasks', desc: 'Make it manageable', icon: ArrowDown },
                { step: 'Work', desc: 'Focus and do the work', icon: Rocket },
                { step: 'Check Off', desc: 'Mark subtasks complete', icon: CheckCircle2 },
                { step: 'See Progress', desc: 'Watch your progress grow', icon: BarChart3 },
                { step: 'Reflect', desc: 'Learn from your day', icon: PenTool },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="flex items-center gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                      <item.icon size={20} className="text-blue-600" />
                    </div>
                    {idx < 6 && (
                      <div className="w-px h-8 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold text-slate-800">{item.step}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Task Progress Section */}
      <section id="progress" className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Turn big goals into small wins.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Break any task into smaller steps and see exactly how much you've completed.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div variants={fadeInUp}>
                <TaskProgressCard />
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ListTodo size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Break it down</h4>
                    <p className="text-sm text-slate-600 mt-1">Any task can be split into manageable subtasks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Check off progress</h4>
                    <p className="text-sm text-slate-600 mt-1">Each completed subtask updates your progress automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">See the big picture</h4>
                    <p className="text-sm text-slate-600 mt-1">Your dashboard reflects real progress from real work done.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your personal command center.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                See today's tasks, progress and plans at a glance.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <DashboardFullPreview />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Learning Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your learning. Organized.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Keep your learning organized without forcing yourself into someone else's roadmap.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'B.Tech', icon: GraduationCap, color: '#06b6d4', tasks: 12 },
                { name: 'DSA', icon: Code2, color: '#f97316', tasks: 8 },
                { name: 'Java / DAA', icon: Code2, color: '#ef4444', tasks: 15 },
                { name: 'Python', icon: Code2, color: '#22c55e', tasks: 6 },
                { name: 'Backend', icon: Briefcase, color: '#8b5cf6', tasks: 4 },
                { name: 'Cloud', icon: Rocket, color: '#3b82f6', tasks: 3 },
                { name: 'Projects', icon: FolderOpen, color: '#ec4899', tasks: 7 },
                { name: 'Career', icon: Briefcase, color: '#eab308', tasks: 5 },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color + '15' }}
                    >
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{item.tasks} tasks</p>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((item.tasks / 15) * 100)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                See your plans together.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Tasks, deadlines and plans — all visible in one calendar view.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <CalendarPreview />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Journal Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Remember what actually happened.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Not just what you planned, but what you completed, learned and what went wrong.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <JournalPreview />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Career Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Keep your long-term direction visible.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Track skills, projects and career goals while working on today's tasks.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <CareerPreview />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <motion.div variants={fadeInUp}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl" />
                <div className="relative p-12 sm:p-16">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    <Zap size={28} className="text-white" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                    Start building your days.
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    Small steps every day become something much bigger.
                  </p>

                  <LoginButtons onSuccess={() => navigate('/app/dashboard')} />

                  <p className="mt-8 text-sm text-slate-500 italic">
                    "Your plans. Your tasks. Your progress. Your journey."
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-800">MySpace</span>
                <p className="text-xs text-slate-500">Plan • Do • Grow</p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Your plans. Your progress. Your journey.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>© 2026 MySpace</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Sub-components --- */

function DashboardPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Mini header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Zap size={10} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700">MySpace</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-300" />
          <div className="w-2 h-2 rounded-full bg-yellow-300" />
          <div className="w-2 h-2 rounded-full bg-green-300" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Today's Progress */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="68, 100"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: '68, 100' }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">68%</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Today's Progress</p>
            <p className="text-sm font-semibold text-slate-700">12 / 18 subtasks</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Tasks</p>
          {[
            { title: 'Learn Java Loops', progress: 60, done: true },
            { title: 'DAA Revision', progress: 100, done: true },
            { title: 'Python Practice', progress: 40, done: false },
            { title: 'Project Work', progress: 20, done: false },
          ].map((task) => (
            <div key={task.title} className="flex items-center gap-3">
              {task.done ? (
                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              ) : (
                <Circle size={14} className="text-slate-300 flex-shrink-0" />
              )}
              <span className={`text-xs flex-1 ${task.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                {task.title}
              </span>
              <span className="text-[10px] font-medium text-slate-500">{task.progress}%</span>
            </div>
          ))}
        </div>

        {/* Tomorrow */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tomorrow</p>
          {['Complete Java practice', 'Python arrays', 'Project backend'].map((item) => (
            <div key={item} className="flex items-center gap-2 mb-1.5">
              <ArrowRight size={10} className="text-blue-400" />
              <span className="text-xs text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskProgressCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">Learn Java Loops</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Java / DAA</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Progress</span>
        <span className="text-sm font-bold text-blue-600">60%</span>
      </div>

      <ProgressBar percentage={60} height={8} />

      <p className="text-xs text-slate-500 mt-2 mb-4">3 / 5 subtasks completed</p>

      <div className="space-y-2.5">
        {[
          { title: 'Understand for loop', done: true },
          { title: 'Understand while loop', done: true },
          { title: 'Understand do-while', done: true },
          { title: 'Practice nested loops', done: false },
          { title: 'Solve pattern problems', done: false },
        ].map((st) => (
          <div key={st.title} className="flex items-center gap-3">
            {st.done ? (
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            ) : (
              <Circle size={16} className="text-slate-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${st.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {st.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardFullPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Today's Dashboard</h3>
            <p className="text-xs text-slate-500">Friday, September 19</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Tasks', value: '8', color: '#3b82f6' },
            { label: 'Completed', value: '2', color: '#22c55e' },
            { label: 'In Progress', value: '4', color: '#8b5cf6' },
            { label: 'Not Started', value: '2', color: '#94a3b8' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { title: 'Learn Java Loops', category: 'Java / DAA', progress: 60, color: '#ef4444' },
            { title: 'Solve Array Problems', category: 'DSA', progress: 40, color: '#f97316' },
            { title: 'Read DBMS Notes', category: 'B.Tech', progress: 0, color: '#06b6d4' },
            { title: 'Update Project UI', category: 'Project', progress: 100, color: '#3b82f6' },
          ].map((task) => (
            <div key={task.title} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-slate-800 truncate">{task.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: task.color + '15', color: task.color }}>
                    {task.category}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${task.progress}%`, backgroundColor: task.color }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700 flex-shrink-0">{task.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarPreview() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [
    [0, 0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 0, 0, 0],
  ];

  const taskDays = [5, 8, 12, 15, 19, 22, 25];

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <h3 className="font-bold text-slate-800 mb-4">September 2026</h3>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map((d) => (
            <span key={d} className="text-[10px] font-medium text-slate-400 py-1">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {dates.flat().map((date, idx) => (
            <div
              key={idx}
              className={`text-xs py-2 rounded-lg ${
                date === 0 ? 'text-transparent' :
                date === 19 ? 'bg-blue-600 text-white font-bold' :
                taskDays.includes(date) ? 'bg-blue-50 text-blue-700 font-medium' :
                'text-slate-600'
              }`}
            >
              {date || ''}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">19 September</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tasks</p>
            {['Java Practice', 'DAA Revision', 'Project Work'].map((t) => (
              <div key={t} className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-700">{t}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Events</p>
            {['College', 'Study Session'].map((t) => (
              <div key={t} className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-sm text-slate-700">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-amber-600" />
        <h3 className="font-bold text-slate-800">Daily Journal</h3>
        <span className="text-xs text-slate-500 ml-auto">September 19</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">What I planned</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /><span className="text-sm text-slate-600">Java loops</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /><span className="text-sm text-slate-600">DAA revision</span></div>
            <div className="flex items-center gap-2"><Circle size={14} className="text-slate-300" /><span className="text-sm text-slate-600">Project</span></div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">What I learned</p>
          <p className="text-sm text-slate-600 italic">"Finally understood nested loops."</p>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 mt-4">What went wrong</p>
          <p className="text-sm text-slate-600 italic">"Didn't have enough time for project."</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tomorrow</p>
        <div className="space-y-1.5">
          {['Continue project', 'Practice Python arrays'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <ArrowRight size={12} className="text-blue-400" />
              <span className="text-sm text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerPreview() {
  const skills = [
    { name: 'Java', level: 70, color: '#ef4444' },
    { name: 'Spring Boot', level: 50, color: '#22c55e' },
    { name: 'DSA', level: 60, color: '#f97316' },
    { name: 'SQL', level: 65, color: '#3b82f6' },
    { name: 'Git', level: 80, color: '#8b5cf6' },
    { name: 'Docker', level: 30, color: '#06b6d4' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <h3 className="font-bold text-slate-800 mb-4">Skills</h3>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700">{skill.name}</span>
                <span className="text-xs font-medium text-slate-500">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <h3 className="font-bold text-slate-800 mb-4">Projects</h3>
        <div className="space-y-3 mb-6">
          {['ProfitIQ', 'Smart Farmer AI', 'RAACO'].map((project) => (
            <div key={project} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
              <FolderOpen size={14} className="text-blue-500" />
              <span className="text-sm text-slate-700">{project}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-slate-800 mb-3">Career Goals</h3>
        <div className="space-y-2">
          {['Internships', 'Applications', 'Portfolio'].map((goal) => (
            <div key={goal} className="flex items-center gap-2">
              <ArrowRight size={12} className="text-amber-500" />
              <span className="text-sm text-slate-600">{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
