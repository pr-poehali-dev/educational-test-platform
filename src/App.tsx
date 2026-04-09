import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "profile" | "tests" | "results" | "subjects" | "rating" | "manage";
type Role = "student" | "teacher";

const NOTIFICATIONS = [
  { id: 1, text: "Новый тест по математике доступен", time: "5 мин назад", icon: "BookOpen", unread: true },
  { id: 2, text: "Ваш результат по физике проверен", time: "1 час назад", icon: "CheckCircle", unread: true },
  { id: 3, text: "Рейтинг обновлён — вы поднялись на 2 позиции!", time: "3 часа назад", icon: "TrendingUp", unread: false },
];

const SUBJECTS = [
  { name: "Математика", icon: "Calculator", color: "from-violet-500 to-purple-600", tests: 12, progress: 75 },
  { name: "Физика", icon: "Atom", color: "from-cyan-500 to-blue-600", tests: 8, progress: 60 },
  { name: "История", icon: "Landmark", color: "from-pink-500 to-rose-600", tests: 10, progress: 90 },
  { name: "Биология", icon: "Leaf", color: "from-green-500 to-emerald-600", tests: 6, progress: 45 },
  { name: "Химия", icon: "FlaskConical", color: "from-orange-500 to-amber-600", tests: 9, progress: 55 },
  { name: "Литература", icon: "BookOpen", color: "from-indigo-500 to-violet-600", tests: 7, progress: 80 },
];

const TESTS = [
  { id: 1, title: "Тест по алгебре №3", subject: "Математика", time: "30 мин", questions: 20, status: "new", due: "12 апр" },
  { id: 2, title: "Законы Ньютона", subject: "Физика", time: "25 мин", questions: 15, status: "progress", due: "10 апр" },
  { id: 3, title: "Вторая мировая война", subject: "История", time: "40 мин", questions: 25, status: "done", due: "8 апр" },
  { id: 4, title: "Клетки и органоиды", subject: "Биология", time: "20 мин", questions: 18, status: "new", due: "14 апр" },
];

const RESULTS = [
  { subject: "История", test: "ВМВ: ключевые события", score: 95, max: 100, date: "8 апр", grade: "5" },
  { subject: "Математика", test: "Квадратные уравнения", score: 78, max: 100, date: "5 апр", grade: "4" },
  { subject: "Физика", test: "Механика", score: 62, max: 100, date: "2 апр", grade: "3" },
  { subject: "Биология", test: "Фотосинтез", score: 88, max: 100, date: "30 мар", grade: "5" },
];

const RATING = [
  { rank: 1, name: "Анна Соколова", score: 2840, trend: "+120", avatar: "А", color: "from-yellow-400 to-orange-500" },
  { rank: 2, name: "Иван Петров", score: 2710, trend: "+85", avatar: "И", color: "from-slate-400 to-slate-600" },
  { rank: 3, name: "Мария Козлова", score: 2650, trend: "+200", avatar: "М", color: "from-amber-600 to-yellow-700" },
  { rank: 4, name: "Алексей Смирнов", score: 2480, trend: "-30", avatar: "А", color: "from-violet-500 to-purple-600" },
  { rank: 5, name: "Дарья Новикова", score: 2310, trend: "+45", avatar: "Д", color: "from-cyan-500 to-blue-600" },
  { rank: 6, name: "Кирилл Волков", score: 2190, trend: "+10", avatar: "К", color: "from-pink-500 to-rose-600" },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-violet-100 text-violet-700" },
  progress: { label: "В процессе", color: "bg-cyan-100 text-cyan-700" },
  done: { label: "Завершён", color: "bg-green-100 text-green-700" },
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [role, setRole] = useState<Role>("student");
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  const navItems: { id: Page; label: string; icon: string; teacherOnly?: boolean }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "profile", label: "Кабинет", icon: "User" },
    { id: "subjects", label: "Предметы", icon: "BookOpen" },
    { id: "tests", label: "Тесты", icon: "ClipboardList" },
    { id: "results", label: "Результаты", icon: "BarChart3" },
    { id: "rating", label: "Рейтинг", icon: "Trophy" },
    { id: "manage", label: "Управление", icon: "Settings2", teacherOnly: true },
  ];

  const visibleNav = navItems.filter((item) => !item.teacherOnly || role === "teacher");

  return (
    <div className="min-h-screen gradient-bg dot-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="GraduationCap" size={18} className="text-white" />
            </div>
            <span className="font-unbounded font-bold text-lg text-gradient hidden sm:block">EduPulse</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === item.id
                    ? "nav-active"
                    : "text-foreground/70 hover:bg-white/60 hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Role switcher */}
            <div className="hidden sm:flex items-center glass rounded-xl p-1 gap-1">
              <button
                onClick={() => setRole("student")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${role === "student" ? "gradient-primary text-white shadow" : "text-foreground/60"}`}
              >
                Ученик
              </button>
              <button
                onClick={() => setRole("teacher")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${role === "teacher" ? "gradient-warm text-white shadow" : "text-foreground/60"}`}
              >
                Учитель
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/80 transition-all"
              >
                <Icon name="Bell" size={18} className="text-foreground/70" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50 border border-white/60">
                  <div className="p-4 border-b border-white/40">
                    <p className="font-semibold text-sm">Уведомления</p>
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`flex gap-3 p-4 border-b border-white/30 last:border-0 hover:bg-white/40 transition-colors cursor-pointer ${n.unread ? "bg-violet-50/60" : ""}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.unread ? "gradient-primary" : "bg-muted"}`}>
                        <Icon name={n.icon} size={16} className={n.unread ? "text-white" : "text-muted-foreground"} />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition shadow-lg">
              <span className="text-white font-bold text-sm">АС</span>
            </div>

            {/* Mobile menu */}
            <button
              className="lg:hidden w-10 h-10 glass rounded-xl flex items-center justify-center"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Icon name="Menu" size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {showMobileMenu && (
          <div className="lg:hidden glass border-t border-white/40 p-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {visibleNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setPage(item.id); setShowMobileMenu(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    page === item.id ? "nav-active" : "hover:bg-white/60"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {page === "home" && <HomePage setPage={setPage} role={role} />}
        {page === "profile" && <ProfilePage role={role} />}
        {page === "tests" && <TestsPage />}
        {page === "results" && <ResultsPage />}
        {page === "subjects" && <SubjectsPage />}
        {page === "rating" && <RatingPage />}
        {page === "manage" && <ManagePage />}
      </main>
    </div>
  );
}

/* ───── HOME ───── */
function HomePage({ setPage, role }: { setPage: (p: Page) => void; role: Role }) {
  const stats = role === "student"
    ? [
        { label: "Пройдено тестов", value: "24", icon: "ClipboardCheck", color: "from-violet-500 to-purple-600" },
        { label: "Средний балл", value: "82%", icon: "Star", color: "from-pink-500 to-rose-600" },
        { label: "Место в рейтинге", value: "#4", icon: "Trophy", color: "from-yellow-400 to-orange-500" },
        { label: "Активных предметов", value: "6", icon: "BookOpen", color: "from-cyan-500 to-blue-600" },
      ]
    : [
        { label: "Всего учеников", value: "128", icon: "Users", color: "from-violet-500 to-purple-600" },
        { label: "Создано тестов", value: "47", icon: "ClipboardList", color: "from-pink-500 to-rose-600" },
        { label: "Активных тестов", value: "12", icon: "Play", color: "from-green-500 to-emerald-600" },
        { label: "Ожидают проверки", value: "8", icon: "Clock", color: "from-cyan-500 to-blue-600" },
      ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12 text-white shadow-2xl animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-16" />
        <div className="relative z-10">
          <p className="text-white/70 font-medium mb-2">Добро пожаловать! 👋</p>
          <h1 className="font-unbounded text-2xl md:text-4xl font-bold mb-3 leading-tight">
            {role === "student" ? "Алексей Смирнов" : "Анна Ивановна"}
          </h1>
          <p className="text-white/80 max-w-md text-sm md:text-base mb-6">
            {role === "student"
              ? "У вас 2 новых теста и обновлённый рейтинг. Продолжайте в том же духе!"
              : "12 учеников сдали тесты сегодня. Проверьте результаты в разделе управления."}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPage(role === "student" ? "tests" : "manage")}
              className="bg-white text-violet-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-all text-sm shadow-lg"
            >
              {role === "student" ? "Начать тест" : "Управление тестами"}
            </button>
            <button
              onClick={() => setPage("rating")}
              className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all text-sm border border-white/30"
            >
              Смотреть рейтинг
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-2xl p-5 card-hover border border-white/60`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <p className="font-unbounded font-bold text-2xl text-foreground">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <h2 className="font-unbounded font-bold text-lg mb-4 text-gradient">Быстрый доступ</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { page: "subjects" as Page, label: "Предметы", icon: "BookOpen", desc: "6 активных предметов", color: "from-violet-500 to-purple-600" },
            { page: "tests" as Page, label: "Мои тесты", icon: "ClipboardList", desc: "2 новых теста", color: "from-cyan-500 to-blue-600" },
            { page: "results" as Page, label: "Результаты", icon: "BarChart3", desc: "Последний: 95%", color: "from-pink-500 to-rose-600" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setPage(item.page)}
              className={`animate-fade-in stagger-${i + 3} glass rounded-2xl p-5 card-hover border border-white/60 text-left group`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon name={item.icon} size={22} className="text-white" />
              </div>
              <p className="font-semibold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent tests */}
      <div>
        <h2 className="font-unbounded font-bold text-lg mb-4 text-gradient">Актуальные тесты</h2>
        <div className="space-y-3">
          {TESTS.slice(0, 3).map((test, i) => (
            <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-2xl p-4 border border-white/60 flex items-center justify-between gap-4 card-hover`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow">
                  <Icon name="FileText" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{test.title}</p>
                  <p className="text-xs text-muted-foreground">{test.subject} · {test.questions} вопросов · {test.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_MAP[test.status].color}`}>
                  {STATUS_MAP[test.status].label}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">до {test.due}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── PROFILE ───── */
function ProfilePage({ role }: { role: Role }) {
  const achievements = [
    { icon: "Star", label: "Отличник", color: "from-yellow-400 to-orange-500" },
    { icon: "Zap", label: "Быстрый старт", color: "from-cyan-500 to-blue-600" },
    { icon: "Target", label: "Снайпер", color: "from-pink-500 to-rose-600" },
    { icon: "Flame", label: "Серия побед", color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-unbounded font-bold text-2xl text-gradient">Личный кабинет</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1 glass rounded-3xl p-6 border border-white/60 text-center card-hover">
          <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-3xl">А</span>
          </div>
          <h3 className="font-bold text-lg">{role === "student" ? "Алексей Смирнов" : "Анна Ивановна"}</h3>
          <p className="text-muted-foreground text-sm mt-1">{role === "student" ? "10-А класс · Ученик" : "Учитель математики"}</p>
          <div className="mt-4 flex justify-center">
            <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full">
              {role === "student" ? "🏆 Место #4 в рейтинге" : "⭐ Старший учитель"}
            </span>
          </div>
          <button className="mt-5 w-full gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition shadow-lg">
            Редактировать профиль
          </button>
        </div>

        {/* Stats + achievements */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass rounded-3xl p-6 border border-white/60">
            <h4 className="font-semibold mb-4">Статистика</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Тестов пройдено", value: "24", icon: "ClipboardCheck" },
                { label: "Средний балл", value: "82%", icon: "BarChart2" },
                { label: "Лучший результат", value: "98%", icon: "Award" },
                { label: "Активных дней", value: "45", icon: "Calendar" },
              ].map((s, i) => (
                <div key={i} className="bg-white/60 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow">
                    <Icon name={s.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/60">
            <h4 className="font-semibold mb-4">Достижения</h4>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a, i) => (
                <div key={i} className="bg-white/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow`}>
                    <Icon name={a.icon} size={18} className="text-white" />
                  </div>
                  <p className="font-medium text-sm">{a.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress per subject */}
      <div className="glass rounded-3xl p-6 border border-white/60">
        <h4 className="font-semibold mb-5">Прогресс по предметам</h4>
        <div className="space-y-4">
          {SUBJECTS.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow flex-shrink-0`}>
                <Icon name={s.icon} size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-sm font-bold text-gradient">{s.progress}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-700`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── TESTS ───── */
function TestsPage() {
  const [filter, setFilter] = useState<"all" | "new" | "progress" | "done">("all");
  const filtered = filter === "all" ? TESTS : TESTS.filter((t) => t.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-unbounded font-bold text-2xl text-gradient">Мои тесты</h2>
        <div className="flex gap-2 glass rounded-xl p-1">
          {(["all", "new", "progress", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filter === f ? "gradient-primary text-white shadow" : "text-foreground/60"}`}
            >
              {f === "all" ? "Все" : f === "new" ? "Новые" : f === "progress" ? "В процессе" : "Завершены"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((test, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-2xl p-6 border border-white/60 card-hover`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="FileText" size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{test.title}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-sm text-muted-foreground">{test.subject}</span>
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={12} /> {test.time}
                    </span>
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span className="text-sm text-muted-foreground">{test.questions} вопросов</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_MAP[test.status].color}`}>
                  {STATUS_MAP[test.status].label}
                </span>
                <span className="text-xs text-muted-foreground">до {test.due}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg">
                {test.status === "done" ? "Смотреть результат" : test.status === "progress" ? "Продолжить" : "Начать тест"}
              </button>
              <button className="glass border border-white/60 text-foreground/70 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-white/60 transition">
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── RESULTS ───── */
function ResultsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-unbounded font-bold text-2xl text-gradient">Мои результаты</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Всего тестов", value: "24", icon: "ClipboardList", color: "from-violet-500 to-purple-600" },
          { label: "Средний балл", value: "82%", icon: "TrendingUp", color: "from-pink-500 to-rose-600" },
          { label: "Лучший результат", value: "98%", icon: "Award", color: "from-green-500 to-emerald-600" },
          { label: "Пятёрок", value: "12", icon: "Star", color: "from-yellow-400 to-orange-500" },
        ].map((s, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-2xl p-5 border border-white/60 card-hover text-center`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <p className="font-unbounded font-bold text-xl">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl border border-white/60 overflow-hidden">
        <div className="p-6 border-b border-white/40">
          <h3 className="font-semibold">История результатов</h3>
        </div>
        <div className="divide-y divide-white/30">
          {RESULTS.map((r, i) => {
            const pct = r.score;
            const color = pct >= 90 ? "from-green-500 to-emerald-600" : pct >= 70 ? "from-cyan-500 to-blue-600" : "from-orange-500 to-red-500";
            return (
              <div key={i} className={`animate-fade-in stagger-${i + 1} p-5 flex items-center justify-between gap-4 hover:bg-white/30 transition-colors flex-wrap`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow font-unbounded font-bold text-white text-lg flex-shrink-0`}>
                    {r.grade}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.test}</p>
                    <p className="text-xs text-muted-foreground">{r.subject} · {r.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{r.score}<span className="text-muted-foreground text-sm font-normal">/{r.max}</span></p>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                    <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───── SUBJECTS ───── */
function SubjectsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-unbounded font-bold text-2xl text-gradient">Предметы</h2>
        <button className="gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg flex items-center gap-2">
          <Icon name="Plus" size={16} />
          Добавить предмет
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {SUBJECTS.map((s, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-3xl p-6 border border-white/60 card-hover group cursor-pointer`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform`}>
              <Icon name={s.icon} size={26} className="text-white" />
            </div>
            <h3 className="font-bold text-base mb-1">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{s.tests} тестов</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-bold text-gradient">{s.progress}%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-700`}
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            </div>
            <button className={`mt-4 w-full bg-gradient-to-r ${s.color} text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg`}>
              Открыть тесты
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── RATING ───── */
function RatingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-unbounded font-bold text-2xl text-gradient">Рейтинг учеников</h2>

      <div className="grid grid-cols-3 gap-4 mb-2">
        {[RATING[1], RATING[0], RATING[2]].map((p, i) => {
          const isFirst = i === 1;
          return (
            <div key={i} className={`glass rounded-3xl p-5 border border-white/60 text-center card-hover flex flex-col items-center ${isFirst ? "ring-2 ring-violet-400/50 shadow-xl" : ""}`}>
              <div className="text-2xl mb-2">{i === 1 ? "🥇" : i === 0 ? "🥈" : "🥉"}</div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3`}>
                {p.avatar}
              </div>
              <p className="font-bold text-sm leading-tight">{p.name}</p>
              <p className="font-unbounded text-lg font-bold text-gradient mt-1">{p.score.toLocaleString()}</p>
              <span className={`text-xs mt-1 font-semibold ${p.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{p.trend}</span>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-3xl border border-white/60 overflow-hidden">
        <div className="p-5 border-b border-white/40">
          <h3 className="font-semibold">Полная таблица</h3>
        </div>
        {RATING.map((p, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} flex items-center gap-4 p-4 border-b border-white/20 last:border-0 hover:bg-white/30 transition-colors ${p.rank === 4 ? "bg-violet-50/40" : ""}`}>
            <span className={`font-unbounded font-bold text-lg w-8 text-center ${p.rank <= 3 ? "text-gradient" : "text-muted-foreground"}`}>
              {p.rank}
            </span>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold shadow`}>
              {p.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{p.name}</p>
              {p.rank === 4 && <span className="text-xs text-violet-600 font-medium">Это вы</span>}
            </div>
            <div className="text-right">
              <p className="font-bold">{p.score.toLocaleString()}</p>
              <p className={`text-xs font-semibold ${p.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{p.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── MANAGE ───── */
function ManagePage() {
  const [showCreate, setShowCreate] = useState(false);

  const manageTests = [
    { title: "Тест по алгебре №3", subject: "Математика", students: 28, submitted: 12, deadline: "12 апр", status: "active" },
    { title: "Законы Ньютона", subject: "Физика", students: 24, submitted: 24, deadline: "10 апр", status: "closed" },
    { title: "Клетки и органоиды", subject: "Биология", students: 30, submitted: 5, deadline: "14 апр", status: "active" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-unbounded font-bold text-2xl text-gradient">Управление тестами</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Создать тест
        </button>
      </div>

      {showCreate && (
        <div className="glass rounded-3xl p-6 border border-white/60 animate-scale-in">
          <h3 className="font-bold mb-5">Новый тест</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Название теста", placeholder: "Введите название..." },
              { label: "Предмет", placeholder: "Выберите предмет..." },
              { label: "Время (мин)", placeholder: "30" },
              { label: "Дедлайн", placeholder: "дд.мм.гггг" },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  className="w-full bg-white/60 border border-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1.5">Описание</label>
            <textarea
              rows={3}
              placeholder="Описание теста..."
              className="w-full bg-white/60 border border-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition resize-none"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg">
              Сохранить тест
            </button>
            <button onClick={() => setShowCreate(false)} className="glass border border-white/60 text-foreground/70 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/60 transition">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Активных тестов", value: "12", icon: "Play", color: "from-violet-500 to-purple-600" },
          { label: "Ожидают проверки", value: "8", icon: "Clock", color: "from-pink-500 to-rose-600" },
          { label: "Завершено сегодня", value: "4", icon: "CheckCircle", color: "from-green-500 to-emerald-600" },
        ].map((s, i) => (
          <div key={i} className={`animate-fade-in stagger-${i + 1} glass rounded-2xl p-5 border border-white/60 card-hover text-center`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <p className="font-unbounded font-bold text-xl">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl border border-white/60 overflow-hidden">
        <div className="p-5 border-b border-white/40">
          <h3 className="font-semibold">Мои тесты</h3>
        </div>
        <div className="divide-y divide-white/20">
          {manageTests.map((t, i) => (
            <div key={i} className={`animate-fade-in stagger-${i + 1} p-5 flex items-center justify-between gap-4 hover:bg-white/30 transition-colors flex-wrap`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow flex-shrink-0 ${t.status === "active" ? "gradient-primary" : "bg-muted"}`}>
                  <Icon name="ClipboardList" size={18} className={t.status === "active" ? "text-white" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.subject} · до {t.deadline}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                <div className="text-center">
                  <p className="font-bold text-sm">{t.submitted}/{t.students}</p>
                  <p className="text-xs text-muted-foreground">сдали</p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${(t.submitted / t.students) * 100}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {t.status === "active" ? "Активен" : "Закрыт"}
                </span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 glass border border-white/60 rounded-lg flex items-center justify-center hover:bg-white/60 transition">
                    <Icon name="Pencil" size={14} className="text-violet-600" />
                  </button>
                  <button className="w-8 h-8 glass border border-white/60 rounded-lg flex items-center justify-center hover:bg-white/60 transition">
                    <Icon name="Eye" size={14} className="text-cyan-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
