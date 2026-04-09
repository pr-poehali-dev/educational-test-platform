import { useState, useEffect, useCallback } from "react";
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

type Question = { q: string; options: string[]; correct: number };

const TEST_QUESTIONS: Record<number, Question[]> = {
  1: [
    { q: "Решите уравнение: x² - 5x + 6 = 0", options: ["x = 2, x = 3", "x = -2, x = -3", "x = 1, x = 6", "x = 2, x = -3"], correct: 0 },
    { q: "Чему равно значение выражения 2³ + 3²?", options: ["13", "17", "15", "19"], correct: 1 },
    { q: "Найдите НОД чисел 36 и 48", options: ["6", "12", "18", "24"], correct: 1 },
    { q: "Угол треугольника равен 40° и 70°. Чему равен третий угол?", options: ["60°", "70°", "80°", "90°"], correct: 1 },
    { q: "Вычислите: log₂(32)", options: ["4", "5", "6", "8"], correct: 1 },
  ],
  2: [
    { q: "Первый закон Ньютона гласит:", options: ["F = ma", "Тело сохраняет состояние покоя или равномерного движения, если на него не действуют силы", "Сила действия равна силе противодействия", "Работа равна произведению силы на путь"], correct: 1 },
    { q: "Единица измерения силы в системе СИ:", options: ["Джоуль", "Ватт", "Ньютон", "Паскаль"], correct: 2 },
    { q: "Ускорение свободного падения на Земле равно:", options: ["8,9 м/с²", "9,8 м/с²", "10,8 м/с²", "11 м/с²"], correct: 1 },
    { q: "Какая из формул выражает второй закон Ньютона?", options: ["E = mc²", "F = ma", "P = mv", "A = Fs"], correct: 1 },
    { q: "Скорость света в вакууме приблизительно равна:", options: ["3 × 10⁶ м/с", "3 × 10⁸ м/с", "3 × 10¹⁰ м/с", "3 × 10⁴ м/с"], correct: 1 },
  ],
  3: [
    { q: "В каком году началась Вторая мировая война?", options: ["1937", "1938", "1939", "1940"], correct: 2 },
    { q: "Операция «Барбаросса» — это:", options: ["Высадка союзников в Нормандии", "Немецкий план нападения на СССР", "Битва за Сталинград", "Освобождение Берлина"], correct: 1 },
    { q: "В каком году завершилась Вторая мировая война?", options: ["1944", "1945", "1946", "1947"], correct: 1 },
    { q: "Какой город был столицей Третьего рейха?", options: ["Мюнхен", "Вена", "Берлин", "Гамбург"], correct: 2 },
    { q: "Конференция в Ялте проходила в:", options: ["1943", "1944", "1945", "1946"], correct: 2 },
  ],
  4: [
    { q: "Что является структурной и функциональной единицей живого?", options: ["Орган", "Ткань", "Клетка", "Молекула"], correct: 2 },
    { q: "Где в клетке происходит синтез белка?", options: ["Митохондрии", "Рибосомы", "Ядро", "Вакуоль"], correct: 1 },
    { q: "Какой органоид является «энергетической станцией» клетки?", options: ["Рибосома", "Аппарат Гольджи", "Лизосома", "Митохондрия"], correct: 3 },
    { q: "ДНК хранится в:", options: ["Рибосомах", "Цитоплазме", "Ядре", "Митохондриях"], correct: 2 },
    { q: "Процесс деления клетки называется:", options: ["Мейоз", "Митоз", "Метаболизм", "Фотосинтез"], correct: 1 },
  ],
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [role, setRole] = useState<Role>("student");
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          <button onClick={() => setPage("home")} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="GraduationCap" size={18} className="text-white" />
            </div>
            <span className="font-unbounded font-bold text-lg text-gradient hidden sm:block">EduPulse</span>
          </button>

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

            {/* Avatar + User Menu */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
                className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center hover:opacity-90 transition shadow-lg"
              >
                <span className="text-white font-bold text-sm">АС</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 glass rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50 border border-white/60">
                  <div className="p-4 border-b border-white/40">
                    <p className="font-semibold text-sm">{role === "student" ? "Алексей Смирнов" : "Анна Ивановна"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{role === "student" ? "10-А класс · Ученик" : "Учитель"}</p>
                  </div>
                  <div className="p-2">
                    {[
                      { label: "Личный кабинет", icon: "User", action: () => { setPage("profile"); setShowUserMenu(false); } },
                      { label: "Настройки", icon: "Settings", action: () => setShowUserMenu(false) },
                      { label: "Помощь", icon: "HelpCircle", action: () => setShowUserMenu(false) },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/60 transition-colors text-left"
                      >
                        <Icon name={item.icon} size={16} className="text-muted-foreground" />
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-white/40 mt-1 pt-1">
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors text-red-500 text-left"
                      >
                        <Icon name="LogOut" size={16} />
                        Выйти
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
  const [activeTest, setActiveTest] = useState<typeof TESTS[0] | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<number>>(
    () => new Set(TESTS.filter((t) => t.status === "done").map((t) => t.id))
  );

  const isDone = (id: number) => completedIds.has(id);

  const filtered = filter === "all" ? TESTS : TESTS.filter((t) =>
    filter === "done" ? isDone(t.id) : filter === "new" ? !isDone(t.id) && t.status === "new" : !isDone(t.id) && t.status === filter
  );

  if (activeTest) {
    return (
      <TestRunPage
        test={activeTest}
        onBack={() => setActiveTest(null)}
        onComplete={() => {
          setCompletedIds((prev) => new Set([...prev, activeTest.id]));
          setActiveTest(null);
        }}
      />
    );
  }

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
              <button
                onClick={() => !isDone(test.id) && setActiveTest(test)}
                className={`gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-lg ${isDone(test.id) ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {isDone(test.id) ? "✓ Завершён" : test.status === "progress" ? "Продолжить" : "Начать тест"}
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

/* ───── TEST RUN ───── */
function TestRunPage({ test, onBack, onComplete }: { test: typeof TESTS[0]; onBack: () => void; onComplete: () => void }) {
  const questions = TEST_QUESTIONS[test.id] ?? [];
  const totalTime = parseInt(test.time) * 60;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const finish = useCallback(() => {
    setFinished(true);
  }, []);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); finish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finished, finish]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerColor = timeLeft < 60 ? "text-red-500" : timeLeft < 180 ? "text-orange-500" : "text-foreground";

  const handleSelect = (idx: number) => {
    if (finished) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      finish();
    } else {
      setCurrent(current + 1);
    }
  };

  const correctCount = Object.entries(answers).filter(
    ([qi, ans]) => questions[Number(qi)]?.correct === ans
  ).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const grade = score >= 90 ? "5" : score >= 70 ? "4" : score >= 50 ? "3" : "2";
  const gradeColor = score >= 90 ? "from-green-500 to-emerald-600" : score >= 70 ? "from-cyan-500 to-blue-600" : score >= 50 ? "from-orange-400 to-yellow-500" : "from-red-500 to-rose-600";

  /* ── RESULT SCREEN ── */
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <div className="glass rounded-3xl border border-white/60 overflow-hidden">
          <div className="gradient-primary p-8 text-center text-white">
            <div className={`w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-xl`}>
              <span className="font-unbounded font-bold text-5xl">{grade}</span>
            </div>
            <h2 className="font-unbounded font-bold text-2xl mb-1">Тест завершён!</h2>
            <p className="text-white/80">{test.title}</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/60 rounded-2xl p-4">
                <p className="font-unbounded font-bold text-2xl text-gradient">{score}%</p>
                <p className="text-xs text-muted-foreground mt-1">Результат</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4">
                <p className="font-unbounded font-bold text-2xl text-green-600">{correctCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Правильных</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4">
                <p className="font-unbounded font-bold text-2xl text-red-500">{questions.length - correctCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Ошибок</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">Правильных ответов</span>
                <span className="font-bold">{correctCount} / {questions.length}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradeColor} rounded-full transition-all duration-1000`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Question breakdown */}
            <div>
              <p className="font-semibold text-sm mb-3">Разбор ответов</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {questions.map((q, i) => {
                  const userAns = answers[i];
                  const isCorrect = userAns === q.correct;
                  const notAnswered = userAns === undefined;
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                        <Icon name={isCorrect ? "Check" : "X"} size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{q.q}</p>
                        {!isCorrect && (
                          <p className="text-green-700 text-xs mt-1">
                            Правильно: {q.options[q.correct]}
                            {notAnswered ? " (не отвечено)" : ` · Вы ответили: ${q.options[userAns]}`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition shadow-lg"
            >
              Вернуться к тестам
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  /* ── CONFIRM EXIT ── */
  if (showConfirm) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-scale-in">
        <div className="glass rounded-3xl p-8 border border-white/60 text-center shadow-2xl">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={28} className="text-orange-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Выйти из теста?</h3>
          <p className="text-muted-foreground text-sm mb-6">Прогресс не сохранится. Вы точно хотите прервать тест?</p>
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 bg-red-100 text-red-700 font-semibold py-3 rounded-xl text-sm hover:bg-red-200 transition">
              Выйти
            </button>
            <button onClick={() => setShowConfirm(false)} className="flex-1 gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition shadow">
              Продолжить
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION SCREEN ── */
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={() => setShowConfirm(true)}
          className="glass border border-white/60 text-foreground/70 font-medium px-4 py-2 rounded-xl text-sm hover:bg-white/60 transition flex items-center gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Выйти
        </button>
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground font-medium">{test.subject}</p>
          <p className="font-semibold text-sm">{test.title}</p>
        </div>
        <div className={`glass border border-white/60 px-4 py-2 rounded-xl font-unbounded font-bold text-sm ${timerColor} flex items-center gap-2`}>
          <Icon name="Clock" size={14} />
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Вопрос {current + 1} из {questions.length}</span>
          <span>{Math.round(progress)}% пройдено</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-1.5 mt-3">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i < current ? "gradient-primary" : i === current ? "bg-violet-300" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="glass rounded-3xl border border-white/60 p-8 shadow-xl">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-5 shadow">
          <span className="text-white font-bold text-sm">{current + 1}</span>
        </div>
        <h3 className="font-bold text-lg leading-snug mb-7">{q.q}</h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium flex items-center gap-3 ${
                selected === i
                  ? "border-violet-500 bg-violet-50 text-violet-800 shadow-lg"
                  : "border-white/60 bg-white/40 hover:bg-white/70 hover:border-violet-300 text-foreground"
              }`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all ${
                selected === i ? "gradient-primary text-white shadow" : "bg-muted text-muted-foreground"
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`mt-7 w-full font-semibold py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
            selected !== null
              ? "gradient-primary text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {current + 1 >= questions.length ? "Завершить тест" : "Следующий вопрос"}
          <Icon name={current + 1 >= questions.length ? "CheckCircle" : "ArrowRight"} size={16} />
        </button>
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