
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";

const words = ["Connected", "Organized", "Smarter", "Seamless"];

export default function LandingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen scroll-smooth overflow-hidden bg-gradient-to-br from-white via-orange-50/40 to-blue-50 text-slate-900">
      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <GraduationCap className="h-9 w-9 text-blue-600" />
          <span>
            Edu<span className="text-blue-600">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-blue-600">
            Features
          </a>
          <a href="#about" className="transition hover:text-blue-600">
            About
          </a>
        </nav>

        <Link
          to="/login"
          className="rounded-full border border-blue-200 bg-white/80 px-6 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50"
        >
          Sign In <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-12 pt-10 lg:grid-cols-2 lg:px-12 lg:pt-16">
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-2 text-sm font-medium text-orange-700">
            <Sparkles className="h-4 w-4" />
            Smarter Campus Management
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-[64px]">
            A smarter campus
            <span className="mt-2 flex min-h-[1.2em] items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            starts here.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            One platform for students, faculty, and campus operations.
            Everything your college needs, connected in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              to="/login"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 font-semibold text-white shadow-lg shadow-orange-200/60 transition hover:-translate-y-1 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="font-semibold text-slate-700 underline decoration-blue-400 underline-offset-8 transition hover:text-blue-600"
            >
              Explore
            </a>
          </div>
        </motion.section>

        {/* Student Visual */}
        <motion.section
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex min-h-[400px] items-center justify-center lg:min-h-[540px]"
        >
          <div className="absolute right-0 top-8 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-8 left-8 h-64 w-64 rounded-full bg-orange-200/50 blur-3xl" />

          <div className="relative w-full max-w-lg">
            <div className="absolute inset-8 rounded-[45%] bg-gradient-to-br from-amber-100 via-orange-100 to-blue-100 blur-sm" />

            <img
              src="https://media.gettyimages.com/id/1498105403/photo/female-student-working-on-the-laptop.jpg?s=612x612&w=0&k=20&c=WX3CBJAGU72tkrxgJVS63gWfhGjSzd1GuMo7JFg-sh8="
              alt="College students on campus"
              className="relative h-[420px] w-full rounded-[2.5rem] object-cover object-center shadow-2xl shadow-blue-200/40"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-5 top-16 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur"
            >
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold">Students</p>
                <p className="text-xs text-slate-500">One connected campus</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 bottom-14 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur"
            >
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold">Learning</p>
                <p className="text-xs text-slate-500">Made simpler</p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Minimal Highlights */}
      <section className="border-t border-white/80 bg-white/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 px-6 py-8 sm:gap-16">
          {[
            { icon: Users, label: "Students", color: "text-blue-600" },
            { icon: GraduationCap, label: "Faculty", color: "text-orange-500" },
            { icon: BookOpen, label: "Courses", color: "text-rose-500" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="font-semibold text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="font-semibold text-orange-600">ONE PLATFORM</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything your campus needs
            </h2>
            <p className="mt-4 text-slate-600">
              Simple tools designed to bring your entire college together.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: LayoutDashboard,
                title: "Admin Dashboard",
                description:
                  "Manage colleges, departments, courses, faculty, and students from one place.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: GraduationCap,
                title: "Faculty Workspace",
                description:
                  "Access assigned courses and view enrolled students with ease.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: BookOpen,
                title: "Student Portal",
                description:
                  "Explore enrolled courses and manage your academic profile.",
                color: "bg-rose-100 text-rose-600",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-white bg-white/80 p-7 shadow-sm transition hover:shadow-xl"
              >
                <div className={`mb-5 inline-flex rounded-xl p-3 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 bg-white/70 px-6 py-20 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <span className="font-semibold text-blue-600">ABOUT EDUSPHERE</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Making campus management simpler
            </h2>
          </div>
          <div className="text-lg leading-8 text-slate-600">
            EduSphere brings administrators, faculty, and students into one
            connected digital campus. It simplifies academic management and
            makes essential college information easier to access.
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 px-8 py-14 text-center text-white shadow-xl sm:px-14">
          <ShieldCheck className="mx-auto mb-5 h-10 w-10" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to simplify campus management?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Bring your college community together with EduSphere.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-orange-600 transition hover:-translate-y-1 hover:shadow-lg"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EduSphere · Smarter Campus Management
      </footer>
    </div>
  );
}
