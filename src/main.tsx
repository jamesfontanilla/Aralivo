/* eslint-disable @typescript-eslint/no-unused-vars -- route components are intentionally colocated in this scaffold. */
import * as React from "react";
import { StrictMode, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudOff,
  ExternalLink,
  FileDown,
  Flame,
  Focus,
  HelpCircle,
  Home,
  KeyRound,
  Leaf,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { appUrl, supabase } from "./lib/supabase";
import "./styles.css";

const subjects = [
  {
    id: "research",
    name: "Research Methods",
    code: "RES 201",
    color: "violet",
    icon: "⌁",
    progress: 62,
    next: "Sampling & bias",
    lessons: 12,
  },
  {
    id: "human-computer",
    name: "Human–Computer Interaction",
    code: "CS 204",
    color: "mint",
    icon: "⌘",
    progress: 38,
    next: "Affordances",
    lessons: 9,
  },
  {
    id: "ethics",
    name: "Technology & Society",
    code: "HUM 115",
    color: "coral",
    icon: "◌",
    progress: 24,
    next: "Who gets to decide?",
    lessons: 7,
  },
];

const units = [
  {
    id: "question",
    subjectId: "research",
    title: "From curiosity to question",
    label: "Unit 1",
    progress: 100,
    lessons: 4,
    duration: "42 min",
    state: "complete",
  },
  {
    id: "evidence",
    subjectId: "research",
    title: "Evidence you can trust",
    label: "Unit 2",
    progress: 60,
    lessons: 5,
    duration: "58 min",
    state: "current",
  },
  {
    id: "analysis",
    subjectId: "research",
    title: "Making sense of patterns",
    label: "Unit 3",
    progress: 0,
    lessons: 3,
    duration: "35 min",
    state: "locked",
  },
];

const lessons = [
  {
    id: "sampling-bias",
    unitId: "evidence",
    title: "Sampling & bias",
    eyebrow: "Lesson 2 of 5",
    duration: "8 min",
    state: "in-progress",
    progress: 68,
    outcome: "Recognize how a sample can quietly shape a conclusion.",
  },
  {
    id: "operationalize",
    unitId: "evidence",
    title: "Operationalize the idea",
    eyebrow: "Lesson 1 of 5",
    duration: "7 min",
    state: "practiced",
    progress: 100,
    outcome: "Turn a broad idea into something you can actually observe.",
  },
  {
    id: "correlation",
    unitId: "evidence",
    title: "Correlation is not causation",
    eyebrow: "Lesson 3 of 5",
    duration: "10 min",
    state: "not-started",
    progress: 0,
    outcome: "Separate a useful pattern from a causal claim.",
  },
  {
    id: "affordances",
    unitId: "human-computer",
    title: "Affordances",
    eyebrow: "Lesson 1 of 4",
    duration: "9 min",
    state: "not-started",
    progress: 0,
    outcome: "Spot the cues that help people understand what to do next.",
  },
];

const loopSteps = [
  { label: "Learn", text: "Build a small, useful mental model.", icon: BookOpen },
  { label: "Recall", text: "Pull it back from memory, gently.", icon: RotateCcw },
  { label: "Reflect", text: "Notice what needs another pass.", icon: Sparkles },
  { label: "Continue", text: "Keep the next action close.", icon: ArrowRight },
];

function getStoredFlag(key: string) {
  return window.localStorage.getItem(key) === "true";
}

function setStoredFlag(key: string, value: boolean) {
  window.localStorage.setItem(key, String(value));
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

type DemoProfile = {
  email: string;
  displayName: string;
  term: string;
  subject: string;
  verified: boolean;
};

type PlannerTask = {
  id: string;
  title: string;
  subject: string;
  minutes: number;
  due: string;
  done: boolean;
};

type FocusSession = {
  id: string;
  durationSeconds: number;
  startedAt: number | null;
  accumulatedSeconds: number;
  state: "active" | "paused" | "completed" | "ended";
};

const defaultProfile: DemoProfile = {
  email: "jamie@example.com",
  displayName: "Jamie Santos",
  term: "August–December 2026",
  subject: "Research Methods",
  verified: true,
};

const defaultTasks: PlannerTask[] = [
  {
    id: "task-evidence",
    title: "Review unit: Evidence you can trust",
    subject: "Research Methods",
    minutes: 20,
    due: "Today",
    done: false,
  },
  {
    id: "task-affordances",
    title: "Read: Affordances",
    subject: "Human–Computer Interaction",
    minutes: 9,
    due: "Tomorrow",
    done: false,
  },
  {
    id: "task-retrieval",
    title: "Write a retrieval note",
    subject: "Technology & Society",
    minutes: 10,
    due: "Friday",
    done: true,
  },
];

function getProfile() {
  return readStored<DemoProfile>("aralivo-profile", defaultProfile);
}

async function apiHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  return headers;
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T | null> {
  try {
    const requestHeaders = new Headers(await apiHeaders());
    if (init.headers)
      new Headers(init.headers).forEach((value, key) => requestHeaders.set(key, value));
    const response = await fetch(path, {
      ...init,
      headers: requestHeaders,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function syncProfile(user: User, updates: Partial<DemoProfile> = {}) {
  if (!supabase) return getProfile();
  const { data } = await supabase
    .from("profiles")
    .select("id,email,display_name,term,primary_subject,verified")
    .eq("id", user.id)
    .maybeSingle();
  const profile: DemoProfile = {
    email: data?.email ?? user.email ?? defaultProfile.email,
    displayName: data?.display_name ?? user.user_metadata?.display_name ?? defaultProfile.displayName,
    term: data?.term ?? defaultProfile.term,
    subject: data?.primary_subject ?? defaultProfile.subject,
    verified: Boolean(data?.verified ?? user.email_confirmed_at),
    ...updates,
  };
  writeStored("aralivo-profile", profile);
  return profile;
}

function getElapsedSeconds(session: FocusSession, now = Date.now()) {
  return Math.min(
    session.durationSeconds,
    session.accumulatedSeconds +
      (session.state === "active" && session.startedAt
        ? Math.floor((now - session.startedAt) / 1000)
        : 0),
  );
}

function App() {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!supabase) {
      setAuthState("unauthenticated");
      return;
    }
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setAuthState(data.session ? "authenticated" : "unauthenticated");
      if (data.session) void syncProfile(data.session.user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setAuthState(session ? "authenticated" : "unauthenticated");
      if (session) window.setTimeout(() => void syncProfile(session.user), 0);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
    window.localStorage.removeItem("aralivo-auth");
    window.localStorage.removeItem("aralivo-pending-signup");
    window.localStorage.removeItem("aralivo-pending-auth");
    setUser(null);
    setAuthState("unauthenticated");
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/forgot-password"
        element={<AuthPage mode="forgot" />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route path="/auth/error" element={<AuthErrorPage />} />
      <Route path="/app" element={<Navigate to="/today" replace />} />
      <Route path="/app/:section" element={<AppNamespaceRedirect />} />
      <Route
        element={
          authState === "loading" ? (
            <AuthLoadingPage />
          ) : authState === "authenticated" ? (
            <AppShell onSignOut={signOut} />
          ) : (
            <Navigate to="/sign-in" replace />
          )
        }
      >
        <Route path="/today" element={<TodayPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectPage />} />
        <Route path="/units/:unitId" element={<UnitPage />} />
        <Route path="/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/settings" element={<SettingsPage onSignOut={signOut} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AuthLoadingPage() {
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="loading-orb"><span /></div>
        <h1>Checking your session…</h1>
        <p>We’re securely opening your private workspace.</p>
      </div>
    </div>
  );
}

function AppNamespaceRedirect() {
  const { section } = useParams();
  const destination: Record<string, string> = {
    today: "/today",
    planner: "/planner",
    subjects: "/subjects",
    practice: "/practice",
    flashcards: "/flashcards",
    focus: "/focus",
    resources: "/resources",
    receipts: "/receipts",
    settings: "/settings",
  };
  return <Navigate to={destination[section ?? ""] ?? "/today"} replace />;
}

function NotFoundPage() {
  const destination = "/";
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="danger-orb">
          <X size={27} />
        </div>
        <p className="eyebrow">Page not found</p>
        <h1>That path wandered off.</h1>
        <p>Try the workspace home, or return to the public landing page.</p>
        <Link className="button button-primary button-full" to={destination}>
          Continue <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function Landing() {
  const [active, setActive] = useState(0);
  const ActiveIcon = loopSteps[active].icon;
  return (
    <div className="marketing-page">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="marketing-header">
        <Link className="brand" to="/" aria-label="Aralivo home">
          <span className="brand-mark">a</span>
          <span>aralivo</span>
        </Link>
        <nav className="marketing-nav" aria-label="Public navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy first</a>
          <Link to="/sign-in">Sign in</Link>
          <Link className="button button-small" to="/sign-up">
            Create account <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />A quieter way to keep learning
            </p>
            <h1>
              Keep the next useful thing <em>close.</em>
            </h1>
            <p className="hero-lede">
              Aralivo is a private learning workspace for college students who want a steady place
              to learn, practice, and come back to.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/sign-up">
                Start for free <ArrowRight size={17} />
              </Link>
              <a className="text-link" href="#how-it-works">
                See the study loop <ChevronDown size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <LockKeyhole size={16} /> Private by default
              </span>
              <span>
                <Leaf size={16} /> Free-first, always
              </span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of a study loop" role="img">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-pebble">
              <span>today</span>
              <strong>
                One good
                <br />
                next step.
              </strong>
              <small>8 min · Research Methods</small>
              <div className="art-progress">
                <span />
              </div>
            </div>
            <div className="art-note note-one">
              <Sparkles size={15} /> recall
            </div>
            <div className="art-note note-two">
              <Target size={15} /> focus
            </div>
            <div className="art-leaf">⌁</div>
          </div>
        </section>
        <section className="loop-section container" id="how-it-works">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A small loop that compounds</p>
              <h2>Learning has a rhythm.</h2>
            </div>
            <p>
              Keep the parts that matter close together: understanding, retrieval, and a next action
              that feels possible.
            </p>
          </div>
          <div className="loop-grid">
            <div className="loop-tabs" role="tablist" aria-label="Study loop steps">
              {loopSteps.map((step, index) => (
                <button
                  key={step.label}
                  className={active === index ? "loop-tab active" : "loop-tab"}
                  onClick={() => setActive(index)}
                  role="tab"
                  aria-selected={active === index}
                >
                  <span>0{index + 1}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <div className="loop-preview">
              <div className="loop-preview-icon">
                <ActiveIcon size={24} />
              </div>
              <p className="eyebrow">Step 0{active + 1}</p>
              <h3>{loopSteps[active].label}</h3>
              <p>{loopSteps[active].text}</p>
              <div className="loop-line">
                <span style={{ width: `${(active + 1) * 25}%` }} />
              </div>
            </div>
          </div>
        </section>
        <section className="privacy-strip container" id="privacy">
          <div className="privacy-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2>Your learning stays yours.</h2>
            <p>
              Aralivo is designed around private progress, honest feedback, and useful practice. No
              public leaderboards. No selling your notes. No claims about grades.
            </p>
          </div>
          <Link className="text-link" to="/sign-up">
            Make a space <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <footer className="marketing-footer container">
        <span>© 2026 Aralivo</span>
        <span>Built for steady progress, not performance theater.</span>
      </footer>
    </div>
  );
}

type AuthMode = "sign-in" | "sign-up" | "forgot";
function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const title =
    mode === "sign-in"
      ? "Welcome back."
      : mode === "sign-up"
        ? "Make room to learn."
        : "Reset your password.";
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "sign-up" && !name.trim()) {
      setError("Add a name so Aralivo knows how to greet you.");
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords do not match. Re-enter the same password in both fields.");
      return;
    }
    if (!supabase) {
      setError("Authentication is not configured yet. Add the Supabase URL and public key to this deployment.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl()}/reset-password`,
        });
        if (resetError) throw resetError;
        writeStored("aralivo-pending-auth", { action: "reset", email });
        navigate("/check-email");
      } else if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${appUrl()}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        writeStored("aralivo-pending-signup", {
          email,
          displayName: name.trim(),
          term: defaultProfile.term,
          subject: defaultProfile.subject,
          verified: Boolean(data.session),
        } satisfies DemoProfile);
        if (data.session) navigate("/onboarding");
        else navigate("/check-email");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.user) await syncProfile(data.user);
        navigate("/today");
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn’t complete that request.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card">
        <div className="auth-card-top">
          <p className="eyebrow">
            {mode === "sign-up" ? "Start with a private space" : "Your learning workspace"}
          </p>
          <h1>{title}</h1>
          <p>
            {mode === "forgot"
              ? "We’ll send a secure link if an account exists for this email."
              : "A calm place to pick up the thread."}
          </p>
        </div>
        {mode !== "forgot" && (
          <button
            className="button button-google"
            type="button"
            disabled={submitting || !supabase}
            onClick={async () => {
              if (!supabase) return;
              setError("");
              setSubmitting(true);
              const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${appUrl()}/auth/callback` },
              });
              if (oauthError) {
                setError(oauthError.message);
                setSubmitting(false);
              }
            }}
          >
            <span className="google-g">G</span> {submitting ? "Opening Google…" : "Continue with Google"}
          </button>
        )}
        {mode !== "forgot" && (
          <div className="or-divider">
            <span>or continue with email</span>
          </div>
        )}
        <form onSubmit={submit} noValidate>
          {mode === "sign-up" && (
            <Field
              label="Your name"
              value={name}
              onChange={setName}
              placeholder="How should Aralivo greet you?"
              autoComplete="name"
              name="name"
              required
            />
          )}
          {
            <Field
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              name="email"
              required
              error={error && (!email.includes("@") || !email.includes(".")) ? error : ""}
            />
          }
          {mode !== "forgot" && (
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="8 characters minimum"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              name="password"
              required
              showToggle
              error={error && email.includes("@") ? error : ""}
            />
          )}
          {mode === "sign-up" && (
            <>
              <ul className="password-requirements" aria-label="Password requirements">
                <li className={password.length >= 8 ? "met" : ""}>At least 8 characters</li>
                <li className={/[A-Z]/.test(password) ? "met" : ""}>One uppercase letter</li>
                <li className={/[0-9]/.test(password) ? "met" : ""}>One number</li>
              </ul>
              <Field
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repeat your password…"
                autoComplete="new-password"
                name="confirmPassword"
                required
                showToggle
                error={error && password !== confirmPassword ? error : ""}
              />
            </>
          )}
          <button className="button button-primary button-full" type="submit" disabled={submitting}>
            {mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create my space"
                : "Send reset link"}
            <ArrowRight size={17} />
          </button>
        </form>
        {mode === "sign-in" && (
          <Link className="center-link" to="/forgot-password">
            Forgot your password?
          </Link>
        )}
        {!supabase && (
          <p className="field-error" role="alert">
            This deployment is waiting for its Supabase public configuration.
          </p>
        )}
        {mode === "sign-in" ? (
          <p className="auth-switch">
            New here? <Link to="/sign-up">Create an account</Link>
          </p>
        ) : mode === "sign-up" ? (
          <p className="auth-switch">
            Already have a space? <Link to="/sign-in">Sign in</Link>
          </p>
        ) : (
          <p className="auth-switch">
            <Link to="/sign-in">Back to sign in</Link>
          </p>
        )}
      </div>
      <p className="auth-legal">
        By continuing, you agree to Aralivo’s <a href="#terms">Terms</a> and{" "}
        <a href="#privacy">Privacy Notice</a>.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  name,
  required = false,
  showToggle = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  name?: string;
  required?: boolean;
  showToggle?: boolean;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const inputId = `field-${(name ?? label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <span className="field-control">
        <input
          id={inputId}
          name={name}
          type={showToggle && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        {showToggle && (
          <button
            className="password-toggle"
            type="button"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </span>
      {error && (
        <small className="field-error" id={errorId} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

function CheckEmailPage() {
  const navigate = useNavigate();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const pendingSignup = readStored<DemoProfile | null>("aralivo-pending-signup", null);
  const pendingAuth = readStored<{ action: "reset"; email: string } | null>("aralivo-pending-auth", null);
  useEffect(() => {
    if (!pendingSignup && !pendingAuth) {
      navigate("/sign-up", { replace: true });
    }
  }, [navigate, pendingAuth, pendingSignup]);
  const resend = async () => {
    if (!supabase || !pendingSignup?.email) return;
    setError("");
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email: pendingSignup.email });
    if (resendError) setError(resendError.message);
    else setResent(true);
  };
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card centered-card">
        <div className="success-orb">
          <Mail size={27} />
        </div>
        <p className="eyebrow">One small step</p>
        <h1>Check your email.</h1>
        <p>
          {pendingAuth
            ? "We sent a secure password reset link to your inbox."
            : "We sent a secure verification link to your inbox. It expires soon, and you can request a new one if it gets lost."}
        </p>
        {pendingSignup && (
          <button className="button button-quiet button-full" onClick={() => void resend()} disabled={resent}>
            {resent ? "Verification email sent" : "Resend verification"}
          </button>
        )}
        {resent && (
          <p className="saved-message" role="status">
            A fresh verification link is on its way.
          </p>
        )}
        {error && <p className="field-error" role="alert">{error}</p>}
        {pendingAuth && (
          <Link className="button button-primary button-full" to="/sign-in">
            Back to sign in <ArrowRight size={17} />
          </Link>
        )}
        <Link className="center-link" to="/sign-up">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
function VerifyEmailPage() {
  const navigate = useNavigate();
  const pending = readStored<DemoProfile | null>("aralivo-pending-signup", null);
  useEffect(() => {
    navigate("/auth/callback", { replace: true });
  }, [navigate]);
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card centered-card">
        <div className="success-orb mint">
          <Check size={27} />
        </div>
        <p className="eyebrow">Email verified</p>
        <h1>You’re ready to begin.</h1>
        <p>
          Your space is private by default. Let’s choose what you’re learning and where to start.
        </p>
        <button
          className="button button-primary button-full"
          onClick={() => {
            writeStored("aralivo-pending-signup", { ...pending, verified: true });
            navigate("/onboarding");
          }}
          disabled={!pending}
        >
          Choose your first action <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [term, setTerm] = useState("August–December 2026");
  const [subject, setSubject] = useState("Research Methods");
  const [action, setAction] = useState("Start with a lesson");
  const steps = [
    {
      title: "Choose a term",
      text: "Give this season of learning a name. You can change it later.",
      content: (
        <label className="field">
          <span>Term name</span>
          <input value={term} onChange={(event) => setTerm(event.target.value)} />
        </label>
      ),
    },
    {
      title: "Add a subject",
      text: "Start with the catalog or make a private subject from scratch.",
      content: (
        <>
          <label className="field">
            <span>Subject name</span>
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>
          <button className="button button-quiet button-full">
            <Search size={16} /> Search catalog
          </button>
          <p className="muted-copy onboarding-fallback">
            <Plus size={14} /> Manual subject creation is always available.
          </p>
        </>
      ),
    },
    {
      title: "Choose your first action",
      text: "A clear first step makes returning easier.",
      content: (
        <div className="onboarding-actions">
          {["Start with a lesson", "Review flashcards", "Plan a focus session"].map((item) => (
            <button
              key={item}
              className={action === item ? "onboarding-action active" : "onboarding-action"}
              onClick={() => setAction(item)}
            >
              <span>
                {item === "Start with a lesson" ? (
                  <BookOpen size={17} />
                ) : item === "Review flashcards" ? (
                  <RotateCcw size={17} />
                ) : (
                  <Focus size={17} />
                )}
              </span>
              {item}
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      ),
    },
  ];
  const finish = async () => {
    const pending = readStored<DemoProfile>("aralivo-pending-signup", defaultProfile);
    const session = supabase ? (await supabase.auth.getSession()).data.session : null;
    if (session?.user && supabase) {
      const profile = await syncProfile(session.user, { term, subject, verified: true });
      await supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email,
        display_name: profile.displayName,
        term,
        primary_subject: subject,
        verified: true,
      });
    } else {
      writeStored("aralivo-profile", { ...pending, term, subject, verified: true });
    }
    window.localStorage.removeItem("aralivo-pending-signup");
    navigate("/today", { replace: true });
  };
  return (
    <div className="auth-page onboarding-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card onboarding-card">
        <div className="onboarding-progress">
          <span>Step {step + 1} of 3</span>
          <ProgressBar value={(step + 1) * 33.33} tone="mint" />
        </div>
        <div className="auth-card-top">
          <p className="eyebrow">Make it yours</p>
          <h1>{steps[step].title}</h1>
          <p>{steps[step].text}</p>
        </div>
        {steps[step].content}
        <div className="onboarding-footer">
          <button
            className="button button-quiet"
            onClick={() => setStep((value) => value - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="button button-primary"
            onClick={() => (step < 2 ? setStep((value) => value + 1) : finish())}
          >
            {step < 2 ? "Continue" : "Open Today"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
function ResetPasswordPage() {
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card">
        <div className="auth-card-top">
          <p className="eyebrow">New password</p>
          <h1>Choose a fresh start.</h1>
          <p>Use a password you don’t use anywhere else.</p>
        </div>
        {saved ? (
          <Notice
            tone="success"
            title="Password updated"
            text="Your old sessions have been signed out. You can sign in again now."
          />
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (password.length < 8) return setError("Use at least 8 characters for your password.");
              if (password !== confirmation) return setError("Passwords do not match.");
              if (!supabase) return setError("Authentication is not configured yet.");
              const { error: updateError } = await supabase.auth.updateUser({ password });
              if (updateError) setError(updateError.message);
              else {
                setSaved(true);
                window.setTimeout(() => navigate("/today", { replace: true }), 1000);
              }
            }}
          >
            <Field
              label="New password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="8 characters minimum"
            />
            <Field
              label="Confirm password"
              type="password"
              value={confirmation}
              onChange={setConfirmation}
              placeholder="Repeat your password"
            />
            {error && <p className="field-error" role="alert">{error}</p>}
            <button className="button button-primary button-full" type="submit">
              Update password <ArrowRight size={17} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const complete = async () => {
      if (!supabase) {
        setError("Authentication is not configured yet.");
        return;
      }
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (active) setError(exchangeError.message);
          return;
        }
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError || !data.session) {
        setError(sessionError?.message ?? "No active session was returned.");
        return;
      }
      await syncProfile(data.session.user);
      const isNewSignup = Boolean(readStored<DemoProfile | null>("aralivo-pending-signup", null));
      navigate(isNewSignup ? "/onboarding" : "/today", { replace: true });
    };
    void complete();
    return () => {
      active = false;
    };
  }, [navigate]);
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="loading-orb">
          <span />
        </div>
        <h1>Finishing sign in…</h1>
        <p>We’re bringing you back to your private workspace.</p>
        {error && <p className="field-error" role="alert">{error}</p>}
        <Link className="text-link" to="/today">
          Continue to Today <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
function AuthErrorPage() {
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="danger-orb">
          <X size={27} />
        </div>
        <p className="eyebrow">Couldn’t complete sign in</p>
        <h1>Let’s try that again.</h1>
        <p>The provider didn’t return a valid sign-in. No account was changed.</p>
        <Link className="button button-primary button-full" to="/sign-in">
          Back to sign in <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const profile = getProfile();
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const nav = [
    { to: "/today", label: "Today", icon: Home },
    { to: "/planner", label: "Planner", icon: CalendarDays },
    { to: "/subjects", label: "Subjects", icon: BookOpen },
    { to: "/practice", label: "Practice", icon: Target },
    { to: "/flashcards", label: "Flashcards", icon: RotateCcw },
    { to: "/focus", label: "Focus", icon: Focus },
    { to: "/resources", label: "Resources", icon: Search },
    { to: "/receipts", label: "Receipts", icon: ShieldCheck },
  ];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-content">
        Skip to main content
      </a>
      <aside className={mobileOpen ? "app-sidebar mobile-open" : "app-sidebar"}>
        <div className="sidebar-head">
          <Link className="brand" to="/today" onClick={() => setMobileOpen(false)}>
            <span className="brand-mark">a</span>
            <span>aralivo</span>
          </Link>
          <button
            className="icon-button mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="app-nav" aria-label="Authenticated navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "app-nav-link active" : "app-nav-link")}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-pebble">
          <span className="sidebar-pebble-icon">
            <Flame size={16} />
          </span>
          <div>
            <strong>4 day rhythm</strong>
            <small>Small steps count.</small>
          </div>
        </div>
        <NavLink
          to="/settings"
          className="app-nav-link settings-link"
          onClick={() => setMobileOpen(false)}
        >
          <SettingsIcon size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>
        <button
          className="profile-mini"
          onClick={onSignOut}
          aria-label={`${profile.displayName} Sign out`}
        >
          <span className="avatar">JS</span>
          <span>
            <strong>{profile.displayName}</strong>
            <small>Sign out</small>
          </span>
          <LogOut size={15} />
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              <CurrentPage />
            </strong>
          </div>
          <div className="topbar-actions">
            <span className={online ? "sync-pill" : "sync-pill sync-pill-offline"} role="status">
              <span className="sync-dot" /> {online ? "Online" : "Offline"}
            </span>
            <button className="icon-button" aria-label="Help">
              <HelpCircle size={19} />
            </button>
            <button className="avatar avatar-top" aria-label="Open profile menu">
              JS
            </button>
          </div>
        </header>
        <main className="app-content" id="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function CurrentPage() {
  const location = useLocation();
  const labels: Record<string, string> = {
    "/today": "Today",
    "/planner": "Planner",
    "/subjects": "Subjects",
    "/practice": "Practice",
    "/flashcards": "Flashcards",
    "/focus": "Focus",
    "/resources": "Resources",
    "/receipts": "Receipts",
    "/settings": "Settings",
  };
  return <>{labels[location.pathname] ?? "Learning"}</>;
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}
function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div>
        <h2>{title}</h2>
        {action}
      </div>
    </div>
  );
}
function Notice({
  tone,
  title,
  text,
}: {
  tone: "success" | "info" | "warning";
  title: string;
  text: string;
}) {
  return (
    <div className={`notice notice-${tone}`}>
      <span className="notice-icon">
        {tone === "success" ? (
          <CheckCircle2 size={17} />
        ) : tone === "warning" ? (
          <CloudOff size={17} />
        ) : (
          <Sparkles size={17} />
        )}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
function ProgressBar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "mint" | "coral";
}) {
  return (
    <div className={`progress-track progress-${tone}`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "mint" | "coral" | "yellow" | "violet";
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
function Card({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}) {
  const Tag = as;
  return <Tag className={`card ${className}`}>{children}</Tag>;
}

function TodayPage() {
  const navigate = useNavigate();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Thursday, 7 August"
        title="Good morning, Jamie."
        description="A useful next step is waiting for you."
        action={
          <button className="button button-quiet" onClick={() => navigate("/focus")}>
            <Focus size={16} /> Start focus
          </button>
        }
      />
      <div className="offline-banner" hidden={online || dismissed} role="status">
        <span>
          <CloudOff size={15} /> You’re viewing a saved snapshot. Changes will sync when you’re back
          online.
        </span>
        <button aria-label="Dismiss offline notice" onClick={() => setDismissed(true)}>
          <X size={15} />
        </button>
      </div>
      <div className="today-grid">
        <Card className="study-pebble-card">
          <div className="pebble-top">
            <div>
              <p className="eyebrow">Your next useful action</p>
              <Pill tone="mint">8 minutes</Pill>
            </div>
            <button className="icon-button" aria-label="More next action options">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <h2>
            Continue with <em>Sampling & bias</em>
          </h2>
          <p>See how the way you choose evidence can quietly shape what you find.</p>
          <div className="pebble-meta">
            <span>
              <BookOpen size={15} /> Research Methods
            </span>
            <span>
              <Target size={15} /> Lesson 2 of 5
            </span>
          </div>
          <div className="pebble-actions">
            <button
              className="button button-dark"
              onClick={() => navigate("/lessons/sampling-bias")}
            >
              Continue lesson <ArrowRight size={17} />
            </button>
            <button className="button button-ghost" onClick={() => navigate("/focus")}>
              Focus on this
            </button>
          </div>
          <div className="pebble-scribble">⌁</div>
        </Card>
        <Card className="goal-card">
          <div className="goal-card-head">
            <div>
              <p className="eyebrow">Today’s goal</p>
              <h2>
                25 <span>of 40 min</span>
              </h2>
            </div>
            <div className="goal-ring" style={{ "--progress": "62%" } as React.CSSProperties}>
              <strong>62%</strong>
            </div>
          </div>
          <ProgressBar value={62} tone="mint" />
          <p className="muted-copy">One focused session can close the gap.</p>
          <button className="text-link" onClick={() => navigate("/focus")}>
            Start a 15 min session <ArrowRight size={15} />
          </button>
        </Card>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-main">
          <SectionTitle
            eyebrow="Keep your place"
            title="Your subjects"
            action={
              <Link className="text-link" to="/subjects">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="subject-grid">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
          <SectionTitle eyebrow="A little momentum" title="Recent progress" />
          <Card className="recent-card">
            <div className="timeline-item">
              <span className="timeline-icon mint">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <strong>Operationalize the idea</strong>
                <p>Human–Computer Interaction · Practiced</p>
              </div>
              <span className="timeline-time">Yesterday</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-icon violet">
                <Zap size={17} />
              </span>
              <div>
                <strong>Added 35 XP</strong>
                <p>Lesson section + practice set</p>
              </div>
              <span className="timeline-time">Tue</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-icon coral">
                <Focus size={17} />
              </span>
              <div>
                <strong>25 minute focus session</strong>
                <p>Research Methods · Completed</p>
              </div>
              <span className="timeline-time">Mon</span>
            </div>
          </Card>
        </div>
        <aside className="dashboard-aside">
          <Card className="xp-card">
            <div className="xp-card-top">
              <span className="xp-icon">
                <Zap size={18} />
              </span>
              <Pill tone="yellow">Level 4</Pill>
            </div>
            <h2>
              425 <span>XP</span>
            </h2>
            <p className="muted-copy">160 XP to the next level</p>
            <ProgressBar value={68} tone="primary" />
            <div className="xp-foot">
              <span>
                <Flame size={15} /> 4 day rhythm
              </span>
              <span>68%</span>
            </div>
          </Card>
          <Card className="due-card">
            <SectionTitle
              title="Due soon"
              action={
                <button className="icon-button" aria-label="More due items">
                  <MoreHorizontal size={18} />
                </button>
              }
            />
            <div className="due-item">
              <span className="due-icon">
                <RotateCcw size={15} />
              </span>
              <div>
                <strong>3 flashcards</strong>
                <p>Research Methods</p>
              </div>
              <span className="due-time">Today</span>
            </div>
            <div className="due-item">
              <span className="due-icon">
                <CalendarDays size={15} />
              </span>
              <div>
                <strong>Review unit evidence</strong>
                <p>Estimated 20 min</p>
              </div>
              <span className="due-time">Fri</span>
            </div>
            <Link className="text-link" to="/planner">
              Open planner <ArrowRight size={15} />
            </Link>
          </Card>
          <Card className="receipt-mini">
            <div className="receipt-mini-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="eyebrow">Learning receipts</p>
              <h3>Private proof, on your terms.</h3>
              <p className="muted-copy">Opt in when a milestone is worth keeping.</p>
              <Link className="text-link" to="/receipts">
                Explore receipts <ArrowRight size={15} />
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SubjectCard({ subject }: { subject: (typeof subjects)[number] }) {
  return (
    <Link className={`subject-card subject-${subject.color}`} to={`/subjects/${subject.id}`}>
      <div className="subject-card-top">
        <span className="subject-symbol">{subject.icon}</span>
        <span className="subject-code">{subject.code}</span>
      </div>
      <h3>{subject.name}</h3>
      <div className="subject-progress">
        <ProgressBar
          value={subject.progress}
          tone={subject.color === "mint" ? "mint" : subject.color === "coral" ? "coral" : "primary"}
        />
        <span>{subject.progress}%</span>
      </div>
      <p>Next · {subject.next}</p>
    </Link>
  );
}

function SubjectsPage() {
  const [search, setSearch] = useState("");
  const filtered = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Your learning map"
        title="Subjects"
        description="Follow a clear path, or choose the next right-sized thing."
        action={
          <button className="button button-primary">
            <Plus size={17} /> Add subject
          </button>
        }
      />
      <div className="toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subjects"
            aria-label="Search subjects"
          />
        </label>
        <button className="button button-quiet">
          <MoreHorizontal size={17} /> Sort
        </button>
      </div>
      <div className="subject-grid subject-grid-large">
        {filtered.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="empty-state">
          <div className="empty-icon">
            <Search size={23} />
          </div>
          <h2>No subjects found</h2>
          <p>Try another search, or add your subject manually.</p>
          <button className="button button-primary">
            <Plus size={16} /> Add subject
          </button>
        </Card>
      )}
      <Card className="catalog-callout">
        <div className="catalog-icon">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="eyebrow">Build your own path</p>
          <h2>Can’t find a course in the catalog?</h2>
          <p className="muted-copy">
            Create a private subject with your own units and learning actions. Nothing needs to
            match a school system.
          </p>
        </div>
        <button className="button button-quiet">
          Create manually <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}

function SubjectPage() {
  const { subjectId } = useParams();
  const subject = subjects.find((item) => item.id === subjectId) ?? subjects[0];
  const subjectUnits = units.filter((unit) => unit.subjectId === subject.id);
  return (
    <div className="page-stack">
      <div className={`subject-hero subject-${subject.color}`}>
        <div className="subject-hero-symbol">{subject.icon}</div>
        <div>
          <p className="eyebrow">{subject.code} · 3 units</p>
          <h1>{subject.name}</h1>
          <p>Understand the ideas, practice the moves, keep what you learn.</p>
        </div>
        <div className="subject-hero-progress">
          <strong>{subject.progress}%</strong>
          <span>overall progress</span>
          <ProgressBar
            value={subject.progress}
            tone={
              subject.color === "mint" ? "mint" : subject.color === "coral" ? "coral" : "primary"
            }
          />
        </div>
      </div>
      <div className="subject-layout">
        <main>
          <SectionTitle
            eyebrow="The learning path"
            title="Units"
            action={
              <button className="text-link">
                Course overview <ArrowRight size={15} />
              </button>
            }
          />
          <div className="unit-list">
            {subjectUnits.map((unit, index) => (
              <UnitRow key={unit.id} unit={unit} index={index} />
            ))}
          </div>
        </main>
        <aside>
          <Card className="next-side-card">
            <p className="eyebrow">Recommended next</p>
            <h2>{subject.next}</h2>
            <p className="muted-copy">A small step into the ideas your next unit builds on.</p>
            <Link className="button button-dark button-full" to="/lessons/sampling-bias">
              Open lesson <ArrowRight size={16} />
            </Link>
          </Card>
          <Card className="outcome-card">
            <p className="eyebrow">By the end</p>
            <h3>You’ll be able to…</h3>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={16} /> ask a clearer question
              </li>
              <li>
                <CheckCircle2 size={16} /> notice weak evidence
              </li>
              <li>
                <CheckCircle2 size={16} /> explain your reasoning
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function UnitRow({ unit, index }: { unit: (typeof units)[number]; index: number }) {
  const locked = unit.state === "locked";
  return (
    <Link
      className={`unit-row ${locked ? "is-locked" : ""}`}
      to={locked ? "#" : `/units/${unit.id}`}
      onClick={(event) => locked && event.preventDefault()}
    >
      <div className={`unit-number ${unit.state}`}>
        {unit.state === "complete" ? (
          <Check size={16} />
        ) : locked ? (
          <LockKeyhole size={15} />
        ) : (
          `0${index + 1}`
        )}
      </div>
      <div className="unit-content">
        <div className="unit-row-top">
          <span className="eyebrow">{unit.label}</span>
          <Pill
            tone={
              unit.state === "complete" ? "mint" : unit.state === "locked" ? "neutral" : "violet"
            }
          >
            {unit.state === "complete"
              ? "Complete"
              : unit.state === "locked"
                ? "Locked"
                : "In progress"}
          </Pill>
        </div>
        <h3>{unit.title}</h3>
        <p>
          {unit.lessons} lessons · {unit.duration}
        </p>
        <ProgressBar value={unit.progress} tone={unit.state === "complete" ? "mint" : "primary"} />
      </div>
      <ChevronRight className="unit-arrow" size={20} />
    </Link>
  );
}

function UnitPage() {
  const { unitId } = useParams();
  const unit = units.find((item) => item.id === unitId) ?? units[1];
  const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.id);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={`Research Methods · ${unit.label}`}
        title={unit.title}
        description="A short path from a useful question to evidence you can trust."
        action={
          <button className="button button-primary" onClick={() => undefined}>
            <Target size={16} /> Review unit · 30 items
          </button>
        }
      />
      <div className="unit-overview-grid">
        <Card>
          <p className="eyebrow">Learning outcomes</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 size={16} /> explain why samples can mislead
            </li>
            <li>
              <CheckCircle2 size={16} /> compare common selection strategies
            </li>
            <li>
              <CheckCircle2 size={16} /> choose a useful next question
            </li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Unit progress</p>
          <div className="big-stat">
            {unit.progress}
            <span>%</span>
          </div>
          <ProgressBar value={unit.progress} tone="mint" />
          <p className="muted-copy">
            {unitLessons.filter((l) => l.state !== "not-started").length} of {unitLessons.length}{" "}
            lessons touched
          </p>
        </Card>
      </div>
      <SectionTitle eyebrow="The path" title="Lessons" />
      <div className="lesson-list">
        {unitLessons.map((lesson, index) => (
          <LessonRow key={lesson.id} lesson={lesson} index={index} />
        ))}
      </div>
      <Notice
        tone="info"
        title="Prerequisite note"
        text="You’ll get more from this unit if you can describe what makes a question observable. Revisit Operationalize the idea if you want a quick refresher."
      />
    </div>
  );
}
function LessonRow({ lesson, index }: { lesson: (typeof lessons)[number]; index: number }) {
  const stateLabel =
    lesson.state === "in-progress"
      ? "In progress"
      : lesson.state === "practiced"
        ? "Practiced"
        : "Not started";
  return (
    <Link className="lesson-row" to={`/lessons/${lesson.id}`}>
      <div className="lesson-index">
        {lesson.state === "practiced" ? <CheckCircle2 size={19} /> : <span>0{index + 1}</span>}
      </div>
      <div className="lesson-row-content">
        <div className="lesson-row-top">
          <span className="eyebrow">{lesson.eyebrow}</span>
          <Pill
            tone={
              lesson.state === "practiced"
                ? "mint"
                : lesson.state === "in-progress"
                  ? "violet"
                  : "neutral"
            }
          >
            {stateLabel}
          </Pill>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.outcome}</p>
        <span className="lesson-duration">
          <Clock3 size={14} /> {lesson.duration}
        </span>
        {lesson.progress > 0 && <ProgressBar value={lesson.progress} tone="primary" />}
      </div>
      <ChevronRight size={20} />
    </Link>
  );
}

function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const noteKey = `aralivo-notes-${getProfile().email}`;
  const [note, setNote] = useState(() => window.localStorage.getItem(noteKey) ?? "");
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [completed, setCompleted] = useState(lesson.state === "practiced");
  const saveNote = () => {
    window.localStorage.setItem(noteKey, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  const clearNote = () => {
    window.localStorage.removeItem(noteKey);
    setNote("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div className="lesson-page page-stack">
      <div className="lesson-breadcrumb">
        <Link to="/subjects">Subjects</Link>
        <ChevronRight size={14} />
        <Link to="/subjects/research">Research Methods</Link>
        <ChevronRight size={14} />
        <span>{lesson.title}</span>
      </div>
      <div className="lesson-header">
        <div>
          <p className="eyebrow">
            {lesson.eyebrow} · {lesson.duration}
          </p>
          <h1>{lesson.title}</h1>
          <p>{lesson.outcome}</p>
        </div>
        <div className="lesson-header-actions">
          <button className="button button-primary" onClick={() => setCompleted(true)}>
            {completed ? <CheckCircle2 size={17} /> : <Play size={17} />}
            {completed ? "Completed" : "Start lesson"}
          </button>
          <button className="button button-quiet" onClick={saveNote}>
            <KeyRound size={16} /> Save note
          </button>
          {note && (
            <button className="button button-quiet" onClick={clearNote}>
              Delete note
            </button>
          )}
        </div>
      </div>
      <div className="lesson-progress-row">
        <span>Lesson progress</span>
        <ProgressBar value={completed ? 100 : 68} />
        <strong>{completed ? 100 : 68}%</strong>
        {saved && (
          <span className="saved-message" role="status">
            <Check size={14} /> Saved
          </span>
        )}
      </div>
      <div className="lesson-layout">
        <article className="reading-surface">
          <h2>Why the first choice matters</h2>
          <p>
            When we ask a question, we rarely get to observe every person or situation we care
            about. Instead, we work with a sample. That makes the path from question to evidence
            more practical—and more fragile—than it first appears.
          </p>
          <div className="callout callout-mint">
            <Sparkles size={18} />
            <div>
              <strong>A useful pause</strong>
              <p>
                Before trusting a result, ask: who had a chance to be included, and who did not?
              </p>
            </div>
          </div>
          <h2>Sampling is a design decision</h2>
          <p>
            A sample is not just a smaller version of a population. It is a set of choices: where to
            look, when to look, and what counts as an eligible observation. Those choices can bring
            a perspective into view—or leave it out entirely.
          </p>
          <div className="worked-example">
            <div className="worked-example-label">
              <span>Worked example</span>
              <MoreHorizontal size={16} />
            </div>
            <h3>“Most students in our class prefer the new study space.”</h3>
            <p>
              If the question was asked at the study space, the answer may describe the people who
              already like using it. That does not make the result useless. It does mean the claim
              needs a narrower shape.
            </p>
            <div className="example-footer">
              <Pill tone="yellow">Watch for selection bias</Pill>
              <span>
                <Clock3 size={14} /> 2 min read
              </span>
            </div>
          </div>
          <h2>Try the retrieval cue</h2>
          <p>
            Without looking back, name one way a sample can become unrepresentative. Then write one
            question you would ask before trusting a conclusion.
          </p>
          <label className="note-field">
            <span>Your private note</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Capture the thought you want to find later…"
              rows={5}
            />
            <small>Only you can see this note. It won’t be included in receipts or emails.</small>
          </label>
          <div className="lesson-complete">
            <div>
              <Pill tone={completed ? "mint" : "violet"}>
                {completed ? "Lesson complete" : "Ready when you are"}
              </Pill>
              <h3>
                {completed
                  ? "Nice. The next useful step is practice."
                  : "Finish with a quick practice set."}
              </h3>
              <p>Retrieval is where this idea starts becoming yours.</p>
            </div>
            <Link className="button button-dark" to="/practice">
              Practice this lesson <ArrowRight size={17} />
            </Link>
          </div>
        </article>
        <aside className="lesson-aside">
          <Card>
            <p className="eyebrow">In this lesson</p>
            <ul className="lesson-outline">
              <li className="active">
                <span />
                Why the first choice matters
              </li>
              <li>
                <span />
                Sampling is a design decision
              </li>
              <li>
                <span />
                Try the retrieval cue
              </li>
            </ul>
          </Card>
          <Card className="source-card">
            <p className="eyebrow">Source context</p>
            <h3>Aralivo learning note</h3>
            <p>
              This lesson is an original learning aid, reviewed for clarity and provenance before
              publication.
            </p>
            <span className="source-meta">
              <ShieldCheck size={14} /> Source basis recorded
            </span>
            <button className="text-link" onClick={() => setReported(true)}>
              {reported ? "Report received" : "Report content"} <ArrowRight size={14} />
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type PracticeType =
  | "multiple_choice"
  | "multi_select"
  | "true_false"
  | "fill_blank"
  | "short_answer"
  | "matching"
  | "ordering"
  | "scenario";

type PracticeItem = {
  id: string;
  type: PracticeType;
  prompt: string;
  options?: string[];
  items?: string[];
  pairs?: string[];
};

const practiceItems: PracticeItem[] = [
  {
    id: "sampling-01",
    type: "multiple_choice",
    prompt: "Why can the way a sample is chosen affect a conclusion?",
    options: [
      "A smaller group always gives a more accurate answer.",
      "The people included can shape the conclusion.",
      "Sampling only matters in laboratory studies.",
      "A sample removes the need for a clear question.",
    ],
  },
  {
    id: "sampling-02",
    type: "multi_select",
    prompt: "Which choices can introduce selection bias?",
    options: [
      "Only asking people who are already nearby",
      "Including people from different relevant contexts",
      "Excluding people who cannot access the survey",
      "Writing down the inclusion rule before recruiting",
    ],
  },
  {
    id: "sampling-03",
    type: "true_false",
    prompt: "A sample is a set of design choices, not just a smaller population.",
  },
  {
    id: "sampling-04",
    type: "fill_blank",
    prompt: "A sample that systematically misses part of the population may be ________.",
    options: ["unrepresentative", "random", "complete"],
  },
  {
    id: "sampling-05",
    type: "short_answer",
    prompt: "Name one question you would ask before trusting a sample-based conclusion.",
  },
  {
    id: "sampling-06",
    type: "matching",
    prompt: "Match each idea with the useful question it invites.",
    pairs: [
      "Who was included?",
      "Who had a chance to be heard?",
      "Where was the question asked?",
      "Could the setting shape the answer?",
    ],
  },
  {
    id: "sampling-07",
    type: "ordering",
    prompt: "Put the review steps in a useful order.",
    items: [
      "Name the population",
      "Inspect how people were included",
      "Shape the conclusion",
      "Ask what remains unseen",
    ],
  },
  {
    id: "sampling-08",
    type: "scenario",
    prompt:
      "A campus survey is shared only in a popular study group. What is the most useful first concern?",
    options: [
      "The responses may overrepresent people already engaged with the group.",
      "The survey must be perfectly accurate.",
      "The sample size no longer matters.",
      "The conclusion can be widened without checking.",
    ],
  },
  {
    id: "sampling-09",
    type: "multiple_choice",
    prompt: "What makes a sampling decision easier to explain later?",
    options: [
      "A clear inclusion rule",
      "A more dramatic headline",
      "A hidden recruitment source",
      "A longer conclusion",
    ],
  },
  {
    id: "sampling-10",
    type: "true_false",
    prompt: "A narrow sample can still be useful when the conclusion is shaped to match it.",
  },
  {
    id: "sampling-11",
    type: "multi_select",
    prompt: "Which details belong in a transparent sampling note?",
    options: [
      "Where participants were found",
      "Who was excluded and why",
      "The exact claim the sample can support",
      "A promise that no bias exists",
    ],
  },
  {
    id: "sampling-12",
    type: "fill_blank",
    prompt: "Before trusting a result, ask who had a chance to be ________.",
    options: ["included", "impressed", "graded"],
  },
  {
    id: "sampling-13",
    type: "short_answer",
    prompt: "Write one way the setting of a question could affect who answers.",
  },
  {
    id: "sampling-14",
    type: "ordering",
    prompt: "Order the move from observation to a careful claim.",
    items: [
      "Describe the observed pattern",
      "Name the sampling limits",
      "Choose a narrower claim",
      "Identify the next question",
    ],
  },
  {
    id: "sampling-15",
    type: "scenario",
    prompt:
      "A result says ‘most students’ after asking only students in one class. What is the best next move?",
    options: [
      "Narrow the claim or gather a broader sample.",
      "Treat the class as every student.",
      "Remove the sampling details.",
      "Publish the broadest version first.",
    ],
  },
];

function PracticePage() {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [ordering, setOrdering] = useState<string[]>(practiceItems[6].items ?? []);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [attemptId, setAttemptId] = useState("demo-practice");
  const item = practiceItems[current];
  useEffect(() => {
    void apiRequest<{ attempt_id: string }>("/api/v1/assessments/select", {
      method: "POST",
      body: JSON.stringify({
        scope: "lesson_practice",
        question_bank: {
          questions: practiceItems.map((question) => ({
            ...question,
            outcome_id: "selection-bias",
            skill: "selection-bias",
            difficulty: "intro",
          })),
        },
        outcome_ids: ["selection-bias"],
        recently_seen_ids: [],
        seed: 2026,
      }),
    }).then((result) => {
      if (result?.attempt_id) setAttemptId(result.attempt_id);
    });
  }, []);
  const hasAnswer =
    item.type === "ordering"
      ? ordering.length > 0
      : Array.isArray(answer)
        ? answer.length > 0
        : answer.trim().length > 0;
  const selectOption = (value: string) => setAnswer(value);
  const toggleOption = (value: string) => {
    setAnswer((currentAnswer) => {
      const values = Array.isArray(currentAnswer) ? currentAnswer : [];
      return values.includes(value)
        ? values.filter((itemValue) => itemValue !== value)
        : [...values, value];
    });
  };
  const submit = async () => {
    if (!hasAnswer || submitting) return;
    setSubmitting(true);
    const idempotencyKey = `practice-${item.id}-${Date.now()}`;
    const result = await apiRequest<{ feedback?: { explanation?: string } }>(
      "/api/v1/assessments/submit",
      {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          attempt_id: attemptId,
          question_id: item.id,
          answer,
          idempotency_key: idempotencyKey,
        }),
      },
    );
    setStatus(
      result
        ? "Response synced. Moving to the next question."
        : "Response saved locally. Moving to the next question.",
    );
    setSubmitting(false);
    if (current === practiceItems.length - 1) setComplete(true);
    else {
      const next = current + 1;
      setCurrent(next);
      setAnswer("");
      setOrdering(practiceItems[next].items ?? []);
    }
  };
  const moveOrdering = (index: number, direction: -1 | 1) => {
    setOrdering((values) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= values.length) return values;
      const next = [...values];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };
  if (complete) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Lesson practice · 15 items"
          title="You made it through."
          description="The point was to notice what your reasoning does next."
        />
        <Card className="practice-summary">
          <div className="summary-orb">
            <Trophy size={27} />
          </div>
          <Pill tone="mint">Practice complete</Pill>
          <h2>You added 35 XP.</h2>
          <p>All 15 responses were recorded for this practice set.</p>
          <div className="summary-stats">
            <div>
              <strong>15 / 15</strong>
              <span>items answered</span>
            </div>
            <div>
              <strong>8</strong>
              <span>response types used</span>
            </div>
            <div>
              <strong>8 min</strong>
              <span>estimated time</span>
            </div>
          </div>
          <div className="summary-actions">
            <Link className="button button-primary" to="/lessons/sampling-bias">
              Review lesson <ArrowRight size={16} />
            </Link>
            <Link className="button button-quiet" to="/today">
              Back to Today
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="practice-page page-stack">
      <div className="practice-top">
        <div>
          <Link className="back-link" to="/lessons/sampling-bias">
            <ChevronRight size={15} className="rotate-180" /> Back to lesson
          </Link>
          <p className="eyebrow">Lesson practice · Exactly 15 items</p>
          <h1>Sampling & bias</h1>
        </div>
        <Link className="button button-quiet" to="/lessons/sampling-bias">
          Save & exit
        </Link>
      </div>
      <div className="practice-progress">
        <span>
          Question {current + 1} of {practiceItems.length}
        </span>
        <ProgressBar value={((current + 1) / practiceItems.length) * 100} tone="primary" />
        <strong>{Math.round(((current + 1) / practiceItems.length) * 100)}%</strong>
      </div>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="question-shell">
        <div className="question-meta">
          <Pill tone="violet">{item.type.replace("_", " ")}</Pill>
          <span>Outcome · recognize selection bias</span>
        </div>
        <h2>{item.prompt}</h2>
        {item.type === "multiple_choice" || item.type === "scenario" ? (
          <div className="option-list" role="radiogroup" aria-label="Answer options">
            {(item.options ?? []).map((option, index) => (
              <button
                key={option}
                className={answer === option ? "answer-option selected" : "answer-option"}
                onClick={() => selectOption(option)}
                role="radio"
                aria-checked={answer === option}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
                {answer === option && <Check size={17} />}
              </button>
            ))}
          </div>
        ) : item.type === "multi_select" ? (
          <div className="option-list" role="group" aria-label="Select all that apply">
            {(item.options ?? []).map((option, index) => {
              const checked = Array.isArray(answer) && answer.includes(option);
              return (
                <button
                  key={option}
                  className={checked ? "answer-option selected" : "answer-option"}
                  onClick={() => toggleOption(option)}
                  aria-pressed={checked}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                  {checked && <Check size={17} />}
                </button>
              );
            })}
          </div>
        ) : item.type === "true_false" ? (
          <div className="binary-options" role="radiogroup" aria-label="True or false">
            <button
              className={answer === "True" ? "answer-option selected" : "answer-option"}
              onClick={() => selectOption("True")}
              role="radio"
              aria-checked={answer === "True"}
            >
              True
            </button>
            <button
              className={answer === "False" ? "answer-option selected" : "answer-option"}
              onClick={() => selectOption("False")}
              role="radio"
              aria-checked={answer === "False"}
            >
              False
            </button>
          </div>
        ) : item.type === "fill_blank" ? (
          <label className="field answer-field">
            <span>Your answer</span>
            <input
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Complete the sentence…"
              autoComplete="off"
            />
          </label>
        ) : item.type === "short_answer" ? (
          <label className="field answer-field">
            <span>Your response</span>
            <textarea
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="A sentence is enough…"
              rows={4}
            />
          </label>
        ) : item.type === "matching" ? (
          <div className="matching-list">
            {(item.pairs ?? [])
              .filter((_, index) => index % 2 === 0)
              .map((left, index) => (
                <label className="field" key={left}>
                  <span>{left}</span>
                  <select
                    value={typeof answer === "string" ? "" : ""}
                    onChange={(event) => setAnswer(`${left} → ${event.target.value}`)}
                  >
                    <option value="">Choose a match…</option>
                    <option>{item.pairs?.[index * 2 + 1]}</option>
                  </select>
                </label>
              ))}
          </div>
        ) : (
          <div className="ordering-list" aria-label="Reorder the steps">
            {ordering.map((value, index) => (
              <div className="ordering-row" key={value}>
                <span>{index + 1}</span>
                <strong>{value}</strong>
                <button
                  className="icon-button"
                  aria-label={`Move ${value} up`}
                  onClick={() => moveOrdering(index, -1)}
                  disabled={index === 0}
                >
                  <ChevronDown className="rotate-180" size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Move ${value} down`}
                  onClick={() => moveOrdering(index, 1)}
                  disabled={index === ordering.length - 1}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="question-actions">
          <span className="muted-copy">
            <HelpCircle size={15} /> Your response is saved before the next item.
          </span>
          <button
            className="button button-dark"
            disabled={!hasAnswer || submitting}
            onClick={submit}
          >
            {submitting
              ? "Saving…"
              : current === practiceItems.length - 1
                ? "Finish practice"
                : "Check answer"}{" "}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PracticePageLegacy() {
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [complete, setComplete] = useState(false);
  const options = [
    "A smaller group always gives a more accurate answer.",
    "The people included can shape the conclusion.",
    "Sampling only matters in laboratory studies.",
    "A sample removes the need for a clear question.",
  ];
  if (complete)
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Lesson practice · 15 items"
          title="You made it through."
          description="The point was to notice what your reasoning does next."
        />
        <Card className="practice-summary">
          <div className="summary-orb">
            <Trophy size={27} />
          </div>
          <Pill tone="mint">Practice complete</Pill>
          <h2>You added 35 XP.</h2>
          <p>You reviewed the idea of selection bias and are ready for the next lesson.</p>
          <div className="summary-stats">
            <div>
              <strong>12 / 15</strong>
              <span>items answered</span>
            </div>
            <div>
              <strong>3</strong>
              <span>skills revisited</span>
            </div>
            <div>
              <strong>8 min</strong>
              <span>estimated time</span>
            </div>
          </div>
          <div className="summary-actions">
            <Link className="button button-primary" to="/lessons/sampling-bias">
              Review lesson <ArrowRight size={16} />
            </Link>
            <Link className="button button-quiet" to="/today">
              Back to Today
            </Link>
          </div>
        </Card>
      </div>
    );
  return (
    <div className="practice-page page-stack">
      <div className="practice-top">
        <div>
          <Link className="back-link" to="/lessons/sampling-bias">
            <ChevronRight size={15} className="rotate-180" /> Back to lesson
          </Link>
          <p className="eyebrow">Lesson practice · Exactly 15 items</p>
          <h1>Sampling & bias</h1>
        </div>
        <button className="button button-quiet" onClick={() => undefined}>
          Save & exit
        </button>
      </div>
      <div className="practice-progress">
        <span>Question {current} of 15</span>
        <ProgressBar value={(current / 15) * 100} tone="primary" />
        <strong>{Math.round((current / 15) * 100)}%</strong>
      </div>
      <div className="question-shell">
        <div className="question-meta">
          <Pill tone="violet">Concept check</Pill>
          <span>Outcome · recognize selection bias</span>
        </div>
        <h2>Why can the way a sample is chosen affect a conclusion?</h2>
        <div className="option-list" role="radiogroup" aria-label="Answer options">
          {options.map((option, index) => (
            <button
              key={option}
              className={selected === option ? "answer-option selected" : "answer-option"}
              onClick={() => {
                setSelected(option);
                setFeedback(false);
              }}
              role="radio"
              aria-checked={selected === option}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {selected === option && <Check size={17} />}
            </button>
          ))}
        </div>
        {feedback && (
          <Notice
            tone="success"
            title="Good reasoning."
            text="The group included can shape the pattern we see. That is the idea to carry into the next example."
          />
        )}
        <div className="question-actions">
          <span className="muted-copy">
            <HelpCircle size={15} /> You can revisit this question later.
          </span>
          <button
            className="button button-dark"
            disabled={!selected}
            onClick={() => {
              if (current === 15) setComplete(true);
              else {
                setFeedback(true);
                setSelected("");
                setCurrent((value) => value + 1);
              }
            }}
          >
            {current === 15 ? "Finish practice" : "Check answer"} <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FlashcardsPage() {
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Retrieval, at your pace"
        title="Flashcards"
        description="Three small reviews can be enough for today."
        action={
          <button className="button button-primary">
            <Plus size={17} /> New card
          </button>
        }
      />
      <div className="flashcards-layout">
        <Card className="flashcard-stage">
          <div className="flashcard-top">
            <span className="eyebrow">Due now · 1 of 3</span>
            <Pill tone="violet">Research Methods</Pill>
          </div>
          <button
            className={revealed ? "flashcard revealed" : "flashcard"}
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Card answer revealed" : "Reveal card answer"}
          >
            <span className="flashcard-label">{revealed ? "Answer" : "Recall"}</span>
            <strong>
              {revealed
                ? "The people included can shape the conclusion."
                : "Why can a sample quietly shape what you find?"}
            </strong>
            <small>
              {revealed
                ? "Tap a rating below to schedule your next review."
                : "Press Enter or tap to reveal"}
            </small>
          </button>
          {reviewed ? (
            <Notice
              tone="success"
              title="Card scheduled."
              text="We’ll bring this one back after a little space."
            />
          ) : (
            <div className="rating-row">
              <span className="muted-copy">How did that feel?</span>
              {["Again", "Hard", "Good", "Easy"].map((rating, index) => (
                <button
                  className={`rating-button rating-${index}`}
                  key={rating}
                  disabled={!revealed}
                  onClick={() => setReviewed(true)}
                >
                  {rating}
                  <small>{["1d", "3d", "7d", "14d"][index]}</small>
                </button>
              ))}
            </div>
          )}
        </Card>
        <aside className="flashcards-aside">
          <Card>
            <p className="eyebrow">Your review rhythm</p>
            <div className="big-stat">
              3 <span>due</span>
            </div>
            <ProgressBar value={66} tone="mint" />
            <p className="muted-copy">2 cards reviewed this week</p>
          </Card>
          <Card>
            <p className="eyebrow">Private cards</p>
            <h3>Make the prompt yours.</h3>
            <p className="muted-copy">
              Add a personal card from any lesson. Cards stay private unless you choose to export
              them.
            </p>
            <button className="text-link">
              <Plus size={15} /> Add a personal card
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function PlannerPage() {
  const storageKey = `aralivo-planner-${getProfile().email}`;
  const [tasks, setTasks] = useState<PlannerTask[]>(() => readStored(storageKey, defaultTasks));
  const [dialog, setDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const emptyDraft = { title: "", subject: "Research Methods", minutes: "20", due: "Today" };
  const [draft, setDraft] = useState(emptyDraft);
  useEffect(() => writeStored(storageKey, tasks), [storageKey, tasks]);
  const openNew = () => {
    setEditingIndex(null);
    setDraft(emptyDraft);
    setDialog(true);
  };
  const openEdit = (index: number) => {
    const task = tasks[index];
    setEditingIndex(index);
    setDraft({
      title: task.title,
      subject: task.subject,
      minutes: String(task.minutes),
      due: task.due,
    });
    setDialog(true);
    setMenuIndex(null);
  };
  const saveTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const nextTask: PlannerTask = {
      id: editingIndex === null ? `task-${Date.now()}` : tasks[editingIndex].id,
      title: draft.title.trim(),
      subject: draft.subject,
      minutes: Math.max(1, Number(draft.minutes) || 20),
      due: draft.due,
      done: editingIndex === null ? false : tasks[editingIndex].done,
    };
    setTasks((currentTasks) =>
      editingIndex === null
        ? [...currentTasks, nextTask]
        : currentTasks.map((task, index) => (index === editingIndex ? nextTask : task)),
    );
    setDialog(false);
    setStatus(editingIndex === null ? "Task added." : "Task updated.");
  };
  const toggleTask = (index: number) =>
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task,
      ),
    );
  const deleteTask = (index: number) => {
    setTasks((currentTasks) => currentTasks.filter((_, taskIndex) => taskIndex !== index));
    setMenuIndex(null);
    setStatus("Task deleted.");
  };
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Make space for the work"
        title="Planner"
        description="Private tasks, realistic time estimates, and a clean export when you need it."
        action={
          <button className="button button-primary" onClick={openNew}>
            <Plus size={17} /> Add task
          </button>
        }
      />
      <div className="planner-toolbar">
        <div className="date-switcher">
          <button className="icon-button" aria-label="Previous week">
            <ChevronRight className="rotate-180" size={18} />
          </button>
          <strong>7–13 August 2026</strong>
          <button className="icon-button" aria-label="Next week">
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          className="button button-quiet"
          onClick={() => {
            downloadTaskICS(tasks);
            setStatus("Calendar file downloaded.");
          }}
        >
          <FileDown size={16} /> Export .ics
        </button>
      </div>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="planner-layout">
        <Card className="task-card">
          <div className="task-list-head">
            <span className="eyebrow">This week</span>
            <Pill tone="mint">{tasks.filter((task) => task.done).length} complete</Pill>
          </div>
          {tasks.length === 0 ? (
            <div className="empty-inline">
              <CalendarDays size={22} />
              <strong>No tasks yet.</strong>
              <p>Add one small next action to make the week easier to enter.</p>
              <button className="button button-primary" onClick={openNew}>
                Add your first task
              </button>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div className={task.done ? "task-row done" : "task-row"} key={task.id}>
                <button
                  className="task-check"
                  aria-label={
                    task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`
                  }
                  aria-pressed={task.done}
                  onClick={() => toggleTask(index)}
                >
                  {task.done && <Check size={14} />}
                </button>
                <div className="task-main">
                  <strong>{task.title}</strong>
                  <span>{task.subject}</span>
                </div>
                <span className="task-minutes">
                  <Clock3 size={14} /> {task.minutes} min
                </span>
                <Pill tone={task.due === "Today" ? "coral" : "neutral"}>{task.due}</Pill>
                <button
                  className="icon-button"
                  aria-label={`More options for ${task.title}`}
                  aria-expanded={menuIndex === index}
                  onClick={() => setMenuIndex(menuIndex === index ? null : index)}
                >
                  <MoreHorizontal size={18} />
                </button>
                {menuIndex === index && (
                  <div className="task-menu">
                    <button onClick={() => openEdit(index)}>Edit task</button>
                    <button onClick={() => deleteTask(index)}>Delete task</button>
                  </div>
                )}
              </div>
            ))
          )}
        </Card>
        <aside className="planner-aside">
          <Card>
            <p className="eyebrow">Time available</p>
            <h2>
              {Math.floor(
                tasks
                  .filter((task) => !task.done)
                  .reduce((total, task) => total + task.minutes, 0) / 60,
              )}
              h{" "}
              {tasks.filter((task) => !task.done).reduce((total, task) => total + task.minutes, 0) %
                60}
              m
            </h2>
            <p className="muted-copy">Across your open tasks this week.</p>
            <div className="availability">
              <span style={{ height: "48%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "26%" }} />
              <span style={{ height: "50%" }} />
            </div>
            <div className="availability-labels">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </Card>
          <Notice
            tone="info"
            title="Calendar stays optional"
            text="You can export a private .ics file without connecting Google Calendar."
          />
        </aside>
      </div>
      {dialog && (
        <TaskDialog
          draft={draft}
          setDraft={setDraft}
          editing={editingIndex !== null}
          onClose={() => setDialog(false)}
          onSubmit={saveTask}
        />
      )}
    </div>
  );
}

function TaskDialog({
  draft,
  setDraft,
  editing,
  onClose,
  onSubmit,
}: {
  draft: { title: string; subject: string; minutes: string; due: string };
  setDraft: React.Dispatch<
    React.SetStateAction<{ title: string; subject: string; minutes: string; due: string }>
  >;
  editing: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const titleId = "task-dialog-title";
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button
          className="dialog-close icon-button"
          onClick={onClose}
          aria-label="Close task dialog"
        >
          <X size={18} />
        </button>
        <p className="eyebrow">Private planning</p>
        <h2 id={titleId}>{editing ? "Edit task" : "Add a task"}</h2>
        <p>Give the next useful action a clear shape.</p>
        <form onSubmit={onSubmit}>
          <label className="field">
            <span>Task title</span>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Review one useful idea…"
              required
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span>Subject</span>
            <select
              value={draft.subject}
              onChange={(event) =>
                setDraft((current) => ({ ...current, subject: event.target.value }))
              }
            >
              <option>Research Methods</option>
              <option>Human–Computer Interaction</option>
              <option>Technology & Society</option>
            </select>
          </label>
          <div className="task-form-grid">
            <label className="field">
              <span>Minutes</span>
              <input
                type="number"
                min="1"
                max="240"
                value={draft.minutes}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, minutes: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>Due</span>
              <select
                value={draft.due}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, due: event.target.value }))
                }
              >
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Friday</option>
                <option>Next week</option>
              </select>
            </label>
          </div>
          <div className="dialog-actions">
            <button className="button button-quiet" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button-dark" type="submit">
              {editing ? "Save task" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function downloadTaskICS(tasks: PlannerTask[]) {
  const events = tasks
    .filter((task) => !task.done)
    .map((task, index) => {
      const start = new Date(Date.UTC(2026, 7, 7 + index, 9, 0));
      const end = new Date(start.getTime() + task.minutes * 60_000);
      const format = (date: Date) =>
        date
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}Z$/, "Z");
      return [
        "BEGIN:VEVENT",
        `UID:${task.id}@aralivo`,
        `DTSTAMP:${format(new Date())}`,
        `DTSTART:${format(start)}`,
        `DTEND:${format(end)}`,
        `SUMMARY:Aralivo · ${task.title.replace(/[\r\n]/g, " ")}`,
        `DESCRIPTION:Private study task · ${task.subject}`,
        "END:VEVENT",
      ].join("\r\n");
    });
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aralivo//Planner//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "aralivo-planner.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PlannerPageLegacy() {
  const [tasks, setTasks] = useState([
    {
      title: "Review unit: Evidence you can trust",
      subject: "Research Methods",
      minutes: 20,
      due: "Today",
      done: false,
    },
    {
      title: "Read: Affordances",
      subject: "Human–Computer Interaction",
      minutes: 9,
      due: "Tomorrow",
      done: false,
    },
    {
      title: "Write a retrieval note",
      subject: "Technology & Society",
      minutes: 10,
      due: "Friday",
      done: true,
    },
  ]);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Make space for the work"
        title="Planner"
        description="Private tasks, realistic time estimates, and a clean export when you need it."
        action={
          <button className="button button-primary">
            <Plus size={17} /> Add task
          </button>
        }
      />
      <div className="planner-toolbar">
        <div className="date-switcher">
          <button className="icon-button">
            <ChevronRight className="rotate-180" size={18} />
          </button>
          <strong>7–13 August 2026</strong>
          <button className="icon-button">
            <ChevronRight size={18} />
          </button>
        </div>
        <button className="button button-quiet" onClick={() => downloadICS()}>
          <FileDown size={16} /> Export .ics
        </button>
      </div>
      <div className="planner-layout">
        <Card className="task-card">
          <div className="task-list-head">
            <span className="eyebrow">This week</span>
            <Pill tone="mint">1 complete</Pill>
          </div>
          {tasks.map((task, index) => (
            <div className={task.done ? "task-row done" : "task-row"} key={task.title}>
              <button
                className="task-check"
                aria-label={
                  task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`
                }
                onClick={() =>
                  setTasks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, done: !item.done } : item,
                    ),
                  )
                }
              >
                {task.done && <Check size={14} />}
              </button>
              <div className="task-main">
                <strong>{task.title}</strong>
                <span>{task.subject}</span>
              </div>
              <span className="task-minutes">
                <Clock3 size={14} /> {task.minutes} min
              </span>
              <Pill tone={task.due === "Today" ? "coral" : "neutral"}>{task.due}</Pill>
              <button className="icon-button" aria-label={`More options for ${task.title}`}>
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </Card>
        <aside className="planner-aside">
          <Card>
            <p className="eyebrow">Time available</p>
            <h2>1h 45m</h2>
            <p className="muted-copy">Across 3 open windows this week.</p>
            <div className="availability">
              <span style={{ height: "48%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "26%" }} />
              <span style={{ height: "50%" }} />
            </div>
            <div className="availability-labels">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </Card>
          <Notice
            tone="info"
            title="Calendar stays optional"
            text="You can export a private .ics file without connecting Google Calendar."
          />
        </aside>
      </div>
    </div>
  );
}
function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aralivo//Planner//EN",
    "BEGIN:VEVENT",
    "UID:aralivo-evidence-20260807",
    "DTSTAMP:20260807T000000Z",
    "DTSTART:20260807T090000Z",
    "DTEND:20260807T092000Z",
    "SUMMARY:Aralivo · Review unit: Evidence you can trust",
    "DESCRIPTION:Private study task from Aralivo",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "aralivo-planner.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

function FocusPage() {
  const focusKey = `aralivo-focus-${getProfile().email}`;
  const persisted = readStored<FocusSession | null>(focusKey, null);
  const [session, setSession] = useState<FocusSession | null>(persisted?.state ? persisted : null);
  const [duration, setDuration] = useState(
    Math.round((persisted?.durationSeconds ?? 25 * 60) / 60),
  );
  const [remaining, setRemaining] = useState(() =>
    persisted ? persisted.durationSeconds - getElapsedSeconds(persisted) : 25 * 60,
  );
  const [reflection, setReflection] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const state = session?.state ?? "planned";
  useEffect(() => {
    if (!session) {
      setRemaining(duration * 60);
      return;
    }
    const update = () =>
      setRemaining(Math.max(0, session.durationSeconds - getElapsedSeconds(session)));
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [duration, session]);
  useEffect(() => {
    if (session) writeStored(focusKey, session);
    else window.localStorage.removeItem(focusKey);
  }, [focusKey, session]);
  const start = () => {
    const next: FocusSession = {
      id: `focus-${Date.now()}`,
      durationSeconds: duration * 60,
      startedAt: Date.now(),
      accumulatedSeconds: 0,
      state: "active",
    };
    setSession(next);
  };
  const pause = () => {
    if (!session) return;
    const elapsed = getElapsedSeconds(session);
    setSession({ ...session, startedAt: null, accumulatedSeconds: elapsed, state: "paused" });
  };
  const resume = () => {
    if (!session) return;
    setSession({ ...session, startedAt: Date.now(), state: "active" });
  };
  const finish = async (nextState: "completed" | "ended") => {
    if (!session) return;
    const elapsed = getElapsedSeconds(session);
    const next = {
      ...session,
      startedAt: null,
      accumulatedSeconds: elapsed,
      state: nextState,
    } as FocusSession;
    setSession(next);
    const idempotencyKey = `focus-${session.id}`;
    const result = await apiRequest<{ xp_awarded?: number }>("/api/v1/focus/complete", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        session_id: session.id,
        elapsed_seconds: elapsed,
        state: nextState,
        idempotency_key: idempotencyKey,
      }),
    });
    setSyncStatus(
      result
        ? `Session synced · ${result.xp_awarded ?? 0} XP added.`
        : "Session saved locally and will sync when the API is available.",
    );
  };
  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Low-friction focus"
        title="Focus"
        description="Choose a small outcome, then let the timer fade into the background."
      />
      {state === "planned" && (
        <div className="focus-setup">
          <Card className="focus-setup-main">
            <div className="focus-setup-head">
              <div>
                <p className="eyebrow">Before you begin</p>
                <h2>What deserves your attention?</h2>
              </div>
              <span className="focus-spark">
                <Focus size={22} />
              </span>
            </div>
            <label className="field">
              <span>Subject</span>
              <select defaultValue="research">
                <option value="research">Research Methods</option>
                <option value="hci">Human–Computer Interaction</option>
                <option value="ethics">Technology & Society</option>
              </select>
            </label>
            <label className="field">
              <span>Intended outcome</span>
              <input defaultValue="Understand how selection bias can appear in a sample." />
            </label>
            <div className="duration-picker">
              <span className="eyebrow">Session length</span>
              <div>
                {[15, 25, 45, 60].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={duration === value ? "duration-button active" : "duration-button"}
                    onClick={() => setDuration(value)}
                  >
                    {value}
                    <small>min</small>
                  </button>
                ))}
              </div>
            </div>
            <label className="check-toggle" htmlFor="break-reminder">
              <input id="break-reminder" type="checkbox" />
              <span className="toggle-ui" /> Take a break reminder <small>optional</small>
            </label>
            <button className="button button-dark button-full" onClick={start}>
              <Play size={17} /> Start focus
            </button>
          </Card>
          <aside>
            <Card className="focus-why">
              <p className="eyebrow">Why this works</p>
              <h3>One clear intention is enough.</h3>
              <p className="muted-copy">
                Aralivo calculates elapsed time from timestamps, so a backgrounded tab won’t throw
                off your session.
              </p>
              <div className="focus-state-list">
                <span>
                  <CheckCircle2 size={15} /> Pauses are okay
                </span>
                <span>
                  <CheckCircle2 size={15} /> No forced breaks
                </span>
                <span>
                  <CheckCircle2 size={15} /> XP is awarded once
                </span>
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Recent focus</p>
              <div className="focus-history-item">
                <span>25</span>
                <div>
                  <strong>Research Methods</strong>
                  <small>Completed · Monday</small>
                </div>
              </div>
              <div className="focus-history-item">
                <span>15</span>
                <div>
                  <strong>HCI</strong>
                  <small>Ended early · Sunday</small>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
      {state !== "planned" && (
        <div className="focus-active">
          <Card className="focus-timer-card">
            <div className="focus-live">
              <span className="live-dot" />{" "}
              {state === "active"
                ? "In focus"
                : state === "paused"
                  ? "Paused"
                  : state === "completed"
                    ? "Completed"
                    : "Ended early"}
            </div>
            <div className="timer-display" data-testid="timer-display" aria-live="polite">
              {state === "completed"
                ? `${Math.floor((session?.durationSeconds ?? 0) / 60)
                    .toString()
                    .padStart(2, "0")}:00`
                : `${mins}:${secs}`}
            </div>
            <p>Research Methods</p>
            <h2>Understand how selection bias can appear in a sample.</h2>
            <div className="timer-actions">
              {state === "active" && (
                <button className="button button-quiet" onClick={pause}>
                  <Pause size={17} /> Pause
                </button>
              )}
              {state === "paused" && (
                <button className="button button-primary" onClick={resume}>
                  <Play size={17} /> Resume
                </button>
              )}
              {state === "active" && (
                <button className="button button-dark" onClick={() => finish("completed")}>
                  <CheckCircle2 size={17} /> Mark complete
                </button>
              )}
              {state === "paused" && (
                <button className="button button-quiet" onClick={() => finish("ended")}>
                  <X size={17} /> End early
                </button>
              )}
              {(state === "completed" || state === "ended") && (
                <Link className="button button-dark" to="/today">
                  Back to Today <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </Card>
          {(state === "completed" || state === "ended") && (
            <Card className="reflection-card">
              <p className="eyebrow">Session reflection</p>
              <h2>
                {state === "completed" ? "What will you carry forward?" : "What got in the way?"}
              </h2>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="A sentence is plenty…"
                rows={4}
              />
              <Notice
                tone="success"
                title={
                  syncStatus ||
                  (state === "completed" ? "Session complete." : "Session saved without a penalty.")
                }
                text="Your focus history is private, and this reflection stays out of receipts."
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function FocusPageLegacy() {
  const [state, setState] = useState<"planned" | "active" | "paused" | "completed" | "ended">(
    "planned",
  );
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(duration * 60);
  const [reflection, setReflection] = useState("");
  useEffect(() => {
    if (state !== "active") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setRemaining((value) => Math.max(0, value - elapsed));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state]);
  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Low-friction focus"
        title="Focus"
        description="Choose a small outcome, then let the timer fade into the background."
      />
      {state === "planned" && (
        <div className="focus-setup">
          <Card className="focus-setup-main">
            <div className="focus-setup-head">
              <div>
                <p className="eyebrow">Before you begin</p>
                <h2>What deserves your attention?</h2>
              </div>
              <span className="focus-spark">
                <Focus size={22} />
              </span>
            </div>
            <label className="field">
              <span>Subject</span>
              <select defaultValue="research">
                <option value="research">Research Methods</option>
                <option value="hci">Human–Computer Interaction</option>
                <option value="ethics">Technology & Society</option>
              </select>
            </label>
            <label className="field">
              <span>Intended outcome</span>
              <input defaultValue="Understand how selection bias can appear in a sample." />
            </label>
            <div className="duration-picker">
              <span className="eyebrow">Session length</span>
              <div>
                {[15, 25, 45, 60].map((value) => (
                  <button
                    key={value}
                    className={duration === value ? "duration-button active" : "duration-button"}
                    onClick={() => {
                      setDuration(value);
                      setRemaining(value * 60);
                    }}
                  >
                    {value}
                    <small>min</small>
                  </button>
                ))}
              </div>
            </div>
            <label className="check-toggle">
              <input type="checkbox" />
              <span className="toggle-ui" /> Take a break reminder <small>optional</small>
            </label>
            <button className="button button-dark button-full" onClick={() => setState("active")}>
              <Play size={17} /> Start focus
            </button>
          </Card>
          <aside>
            <Card className="focus-why">
              <p className="eyebrow">Why this works</p>
              <h3>One clear intention is enough.</h3>
              <p className="muted-copy">
                Aralivo calculates elapsed time from timestamps, so a backgrounded tab won’t throw
                off your session.
              </p>
              <div className="focus-state-list">
                <span>
                  <CheckCircle2 size={15} /> Pauses are okay
                </span>
                <span>
                  <CheckCircle2 size={15} /> No forced breaks
                </span>
                <span>
                  <CheckCircle2 size={15} /> XP is awarded once
                </span>
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Recent focus</p>
              <div className="focus-history-item">
                <span>25</span>
                <div>
                  <strong>Research Methods</strong>
                  <small>Completed · Monday</small>
                </div>
              </div>
              <div className="focus-history-item">
                <span>15</span>
                <div>
                  <strong>HCI</strong>
                  <small>Ended early · Sunday</small>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
      {state !== "planned" && (
        <div className="focus-active">
          <Card className="focus-timer-card">
            <div className="focus-live">
              <span className="live-dot" />{" "}
              {state === "active"
                ? "In focus"
                : state === "paused"
                  ? "Paused"
                  : state === "completed"
                    ? "Completed"
                    : "Ended early"}
            </div>
            <div className="timer-display" aria-live="polite">
              {state === "completed" ? "25:00" : `${mins}:${secs}`}
            </div>
            <p>Research Methods</p>
            <h2>Understand how selection bias can appear in a sample.</h2>
            <div className="timer-actions">
              {state === "active" && (
                <button className="button button-quiet" onClick={() => setState("paused")}>
                  <Pause size={17} /> Pause
                </button>
              )}
              {state === "paused" && (
                <button className="button button-primary" onClick={() => setState("active")}>
                  <Play size={17} /> Resume
                </button>
              )}
              {state === "active" && (
                <button className="button button-dark" onClick={() => setState("completed")}>
                  <CheckCircle2 size={17} /> Mark complete
                </button>
              )}
              {state === "paused" && (
                <button className="button button-quiet" onClick={() => setState("ended")}>
                  <X size={17} /> End early
                </button>
              )}
              {(state === "completed" || state === "ended") && (
                <Link className="button button-dark" to="/today">
                  Back to Today <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </Card>
          {(state === "completed" || state === "ended") && (
            <Card className="reflection-card">
              <p className="eyebrow">Session reflection</p>
              <h2>
                {state === "completed" ? "What will you carry forward?" : "What got in the way?"}
              </h2>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="A sentence is plenty…"
                rows={4}
              />
              <Notice
                tone="success"
                title={
                  state === "completed" ? "You added 25 XP." : "Session saved without a penalty."
                }
                text="Your focus history is private, and this reflection stays out of receipts."
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ResourcesPage() {
  const [query, setQuery] = useState("");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Bring good context with you"
        title="Resources"
        description="Low-volume, attributed discovery from public catalogs and scholarly metadata."
      />
      <Card className="resource-search">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books, papers, or ideas"
          aria-label="Search resources"
        />
        <button className="button button-primary">Search</button>
      </Card>
      <div className="resource-grid">
        <Card className="resource-card">
          <div className="resource-type">
            <BookOpen size={17} /> Open Library
          </div>
          <h2>Designing with the mind in mind</h2>
          <p>Simple, human-centered notes on how people perceive and use interfaces.</p>
          <div className="resource-footer">
            <span>Book metadata · 2014</span>
            <a href="https://openlibrary.org" target="_blank" rel="noreferrer">
              View source <ExternalLink size={14} />
            </a>
          </div>
        </Card>
        <Card className="resource-card">
          <div className="resource-type">
            <Leaf size={17} /> OpenAlex
          </div>
          <h2>Learning through retrieval practice</h2>
          <p>A scholarly work surfaced with context, not a claim of school approval.</p>
          <div className="resource-footer">
            <span>Open access · 2023</span>
            <a href="https://openalex.org" target="_blank" rel="noreferrer">
              View source <ExternalLink size={14} />
            </a>
          </div>
        </Card>
        <Card className="resource-card resource-card-muted">
          <div className="resource-type">
            <Sparkles size={17} /> AI assistant
          </div>
          <h2>Ask your lesson</h2>
          <p>Explain a concept or ask for a hint grounded in the lesson you’re reading.</p>
          <Pill tone="neutral">Not configured</Pill>
          <button className="text-link">
            Learn about privacy <ArrowRight size={14} />
          </button>
        </Card>
      </div>
      <Notice
        tone="info"
        title="Provider availability is optional"
        text="Aralivo keeps your core study loop available when an external catalog or AI provider is unavailable."
      />
    </div>
  );
}

function ReceiptsPage() {
  const [optedIn, setOptedIn] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Private proof, if you want it"
        title="Learning receipts"
        description="A verifiable learning record—not a degree, grade, or official credential."
        action={
          <Pill tone={optedIn ? "mint" : "neutral"}>{optedIn ? "Opted in" : "Opted out"}</Pill>
        }
      />
      <Card className="receipt-hero">
        <div className="receipt-hero-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <p className="eyebrow">Privacy-safe by design</p>
          <h2>Keep a milestone without sharing your history.</h2>
          <p>
            Receipts use a pseudonymous identifier and content hash. They never include your name,
            email, notes, detailed answers, or raw study history.
          </p>
        </div>
        <button
          className={optedIn ? "button button-quiet" : "button button-dark"}
          onClick={() => setOptedIn((value) => !value)}
        >
          {optedIn ? "Turn off receipts" : "Opt in to receipts"}
        </button>
      </Card>
      <div className="receipts-layout">
        <Card>
          <SectionTitle
            title="Issued receipts"
            action={
              <button className="icon-button" aria-label="More receipt options">
                <MoreHorizontal size={18} />
              </button>
            }
          />
          {optedIn ? (
            <div className="receipt-item">
              <div className="receipt-item-icon">
                <Trophy size={18} />
              </div>
              <div>
                <strong>Evidence you can trust · Unit complete</strong>
                <p>Issued 7 August 2026 · Testnet</p>
              </div>
              <button className="text-link">
                View <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>No receipts yet.</strong>
              <p>Opt in when a milestone is worth keeping.</p>
            </div>
          )}
        </Card>
        <Card>
          <p className="eyebrow">What is public?</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 size={16} /> content identifier
            </li>
            <li>
              <CheckCircle2 size={16} /> achievement type
            </li>
            <li>
              <CheckCircle2 size={16} /> timestamp and content version
            </li>
            <li>
              <X size={16} className="list-no" /> private notes or answers
            </li>
            <li>
              <X size={16} className="list-no" /> name, email, or school records
            </li>
          </ul>
          <button className="text-link">
            Read the privacy note <ArrowRight size={14} />
          </button>
        </Card>
      </div>
    </div>
  );
}

function SettingsPage({ onSignOut }: { onSignOut: () => void }) {
  const [section, setSection] = useState(() => window.location.hash.replace("#", "") || "profile");
  const [profile, setProfile] = useState(getProfile);
  const [saved, setSaved] = useState("Saved");
  const [dialog, setDialog] = useState(false);
  const [status, setStatus] = useState("");
  const sections = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "account", label: "Account & sign-in", icon: KeyRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "study", label: "Study preferences", icon: Target },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "receipts", label: "Receipts", icon: ShieldCheck },
    { id: "privacy", label: "Privacy & data", icon: LockKeyhole },
    { id: "appearance", label: "Appearance", icon: Sparkles },
    { id: "danger", label: "Danger zone", icon: Trash2 },
  ];
  const selectSection = (next: string) => {
    setSection(next);
    window.history.replaceState(null, "", `/settings#${next}`);
  };
  const saveProfile = async () => {
    writeStored("aralivo-profile", profile);
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("profiles").update({
          display_name: profile.displayName,
          term: profile.term,
          primary_subject: profile.subject,
        }).eq("id", data.user.id);
      }
    }
    setSaved("Saving…");
    window.setTimeout(() => setSaved("Saved"), 450);
    setStatus("Profile changes saved on this device.");
  };
  const exportData = () => {
    const payload = {
      profile,
      tasks: readStored<PlannerTask[]>(`aralivo-planner-${profile.email}`, defaultTasks),
      notes: window.localStorage.getItem(`aralivo-notes-${profile.email}`) ?? "",
      exportedAt: new Date().toISOString(),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aralivo-data.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Your private data export is ready.");
  };
  const clearLocalData = () => {
    window.localStorage.removeItem(`aralivo-notes-${profile.email}`);
    window.localStorage.removeItem(`aralivo-planner-${profile.email}`);
    window.localStorage.removeItem(`aralivo-focus-${profile.email}`);
    setStatus("Local study data cleared.");
  };
  return (
    <div className="settings-page">
      <PageHeader
        eyebrow="Your space, your choices"
        title="Settings"
        description="Keep the important controls findable, and the sensitive ones deliberate."
      />
      <div className="settings-layout">
        <aside className="settings-nav" aria-label="Settings sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                section === id
                  ? "settings-nav-item active"
                  : `settings-nav-item ${id === "danger" ? "danger-link" : ""}`
              }
              onClick={() => selectSection(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>
        <main className="settings-content">
          <div className="settings-save-state" role="status">
            <span className="sync-dot" /> {saved}
          </div>
          {status && (
            <div className="practice-status" role="status" aria-live="polite">
              {status}
            </div>
          )}
          {section === "profile" && (
            <SettingsSection
              eyebrow="Profile"
              title="How Aralivo knows you"
              description="These details shape your workspace, not your public identity."
            >
              <div className="profile-row">
                <div className="avatar avatar-large">JS</div>
                <div>
                  <strong>{profile.displayName}</strong>
                  <p className="muted-copy">Profile initials are used by default.</p>
                </div>
                <button className="button button-quiet" type="button">
                  Change avatar
                </button>
              </div>
              <div className="settings-form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={(event) =>
                      setProfile((current) => ({ ...current, displayName: event.target.value }))
                    }
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>Academic level</span>
                  <select defaultValue="undergraduate">
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                    <option>Independent learner</option>
                  </select>
                </label>
                <label className="field">
                  <span>Language</span>
                  <select defaultValue="en">
                    <option>English</option>
                  </select>
                </label>
                <label className="field">
                  <span>Timezone</span>
                  <select defaultValue="asia-manila">
                    <option value="asia-manila">Asia/Manila (UTC+8)</option>
                    <option value="utc">UTC</option>
                  </select>
                </label>
              </div>
              <SaveButton onClick={saveProfile} />
            </SettingsSection>
          )}
          {section === "account" && (
            <SettingsSection
              eyebrow="Account & sign-in"
              title="Ways to get back in"
              description="Keep at least one verified recovery method active."
            >
              <div className="settings-list">
                <SettingRow
                  icon={<Mail size={18} />}
                  title={profile.email}
                  description="Email address · Verified"
                  action={<Pill tone="mint">Verified</Pill>}
                />
                <SettingRow
                  icon={<span className="google-g">G</span>}
                  title="Google"
                  description="Connected for sign-in only"
                  action={
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() =>
                        setStatus("Google sign-in is available when a provider is configured.")
                      }
                    >
                      Disconnect
                    </button>
                  }
                />
                <SettingRow
                  icon={<KeyRound size={18} />}
                  title="Password"
                  description="Password managed by Supabase Auth"
                  action={
                    <Link className="button button-quiet" to="/forgot-password">
                      Change
                    </Link>
                  }
                />
              </div>
            </SettingsSection>
          )}
          {section === "security" && (
            <SettingsSection
              eyebrow="Security"
              title="Keep your account yours"
              description="Sensitive actions ask for deliberate confirmation before they change anything important."
            >
              <div className="security-callout">
                <ShieldCheck size={20} />
                <div>
                  <strong>Your account is in good shape.</strong>
                  <p>Your Supabase Auth session is active in this browser.</p>
                </div>
              </div>
              <SettingRow
                icon={<LogOut size={18} />}
                title="Current session"
                description="This browser · Current session"
                action={
                  <button className="button button-quiet" type="button" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
              <SettingRow
                icon={<TimerReset size={18} />}
                title="Password reset"
                description="Send a fresh reset link to your verified email"
                action={
                  <Link className="button button-quiet" to="/forgot-password">
                    Send link
                  </Link>
                }
              />
            </SettingsSection>
          )}
          {section === "study" && (
            <SettingsSection
              eyebrow="Study preferences"
              title="Make the default feel like you"
              description="Small defaults help you start without making decisions every time."
            >
              <SettingsToggle
                title="Daily goal"
                description="Keep a gentle target visible on Today."
                enabled
                onChange={() => setStatus("Study preference updated.")}
              />
              <label className="field">
                <span>Default session length</span>
                <select defaultValue="25">
                  <option>15 minutes</option>
                  <option>25 minutes</option>
                  <option>45 minutes</option>
                </select>
              </label>
              <SaveButton onClick={() => setStatus("Study preferences saved.")} />
            </SettingsSection>
          )}
          {section === "notifications" && (
            <SettingsSection
              eyebrow="Notifications"
              title="Only the useful nudges"
              description="Aralivo does not send marketing email by default."
            >
              <SettingsToggle
                title="Email verification and security"
                description="Important account messages only."
                enabled
                onChange={() => setStatus("Notification preference updated.")}
              />
              <SettingsToggle
                title="Study reminders"
                description="A gentle reminder when you asked for one."
                enabled
                onChange={() => setStatus("Notification preference updated.")}
              />
            </SettingsSection>
          )}
          {section === "integrations" && (
            <SettingsSection
              eyebrow="Integrations"
              title="Optional connections"
              description="Every provider is isolated. Your core study loop works without them."
            >
              <IntegrationRow
                name="Google Calendar"
                detail="Not connected · configure OAuth to enable"
                action="Connect"
                disabled
              />
              <IntegrationRow name="Open Library" detail="Available · low-volume" action="View" />
              <IntegrationRow name="OpenAlex" detail="Not configured" action="Learn" disabled />
              <IntegrationRow
                name="AI assistant"
                detail="Disabled · no key configured"
                action="Learn"
                disabled
              />
              <IntegrationRow
                name="Stellar receipts"
                detail="Testnet ready · opt-in"
                action="Open"
              />
            </SettingsSection>
          )}
          {section === "receipts" && (
            <SettingsSection
              eyebrow="Receipts"
              title="Decide what is worth keeping"
              description="Receipts are learning records, not degrees or official credentials."
            >
              <SettingsToggle
                title="Issue privacy-safe receipts"
                description="Never includes notes, answers, grades, email, or school records."
                enabled={false}
                onChange={() => setStatus("Receipt preference updated.")}
              />
              <Notice
                tone="info"
                title="Testnet first"
                text="Receipt registration is isolated behind a server-side adapter and never blocks study, practice, or planner features."
              />
            </SettingsSection>
          )}
          {section === "privacy" && (
            <SettingsSection
              eyebrow="Privacy & data"
              title="Take your data with you"
              description="Exports are private downloads. Clearing local data removes this device’s saved snapshot."
            >
              <SettingRow
                icon={<FileDown size={18} />}
                title="Export data"
                description="Download your profile, progress, tasks, and notes."
                action={
                  <button className="button button-quiet" type="button" onClick={exportData}>
                    Export JSON
                  </button>
                }
              />
              <SettingRow
                icon={<Trash2 size={18} />}
                title="Clear local data"
                description="Remove offline snapshots from this browser."
                action={
                  <button className="button button-quiet" type="button" onClick={clearLocalData}>
                    Clear
                  </button>
                }
              />
              <SettingRow
                icon={<LogOut size={18} />}
                title="Sign out"
                description="End this browser session."
                action={
                  <button className="button button-quiet" type="button" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
            </SettingsSection>
          )}
          {section === "appearance" && (
            <SettingsSection
              eyebrow="Appearance & accessibility"
              title="Make it easier to stay with"
              description="The visual system stays calm, with stronger contrast and less motion when you need it."
            >
              <SettingsToggle
                title="Reduced motion"
                description="Use quieter transitions and no progress animation."
                enabled={false}
                onChange={() => setStatus("Reduced motion preference updated.")}
              />
              <SettingsToggle
                title="High contrast support"
                description="System forced-colors preferences are respected."
                enabled
                onChange={() => setStatus("High contrast support is enabled.")}
              />
            </SettingsSection>
          )}
          {section === "danger" && (
            <SettingsSection
              eyebrow="Danger zone"
              title="Irreversible actions"
              description="These actions need deliberate confirmation and cannot be undone."
            >
              <div className="danger-zone">
                <div>
                  <h3>Delete account</h3>
                  <p>This permanently removes your account, notes, progress, and integrations.</p>
                </div>
                <button
                  className="button button-danger"
                  type="button"
                  onClick={() => setDialog(true)}
                >
                  <Trash2 size={16} /> Delete account
                </button>
              </div>
            </SettingsSection>
          )}
        </main>
      </div>
      {dialog && (
        <ConfirmDialog
          onClose={() => setDialog(false)}
          onConfirm={() => {
            [
              "aralivo-auth",
              "aralivo-profile",
              `aralivo-notes-${profile.email}`,
              `aralivo-planner-${profile.email}`,
              `aralivo-focus-${profile.email}`,
            ].forEach((key) => window.localStorage.removeItem(key));
            setDialog(false);
            onSignOut();
          }}
        />
      )}
    </div>
  );
}

function SettingsPageLegacy({ onSignOut }: { onSignOut: () => void }) {
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState("Saved");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dialog, setDialog] = useState(false);
  const sections = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "account", label: "Account & sign-in", icon: KeyRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "study", label: "Study preferences", icon: Target },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "receipts", label: "Receipts", icon: ShieldCheck },
    { id: "privacy", label: "Privacy & data", icon: LockKeyhole },
    { id: "appearance", label: "Appearance", icon: Sparkles },
    { id: "danger", label: "Danger zone", icon: Trash2 },
  ];
  const update = () => {
    setSaved("Saving…");
    window.setTimeout(() => setSaved("Saved just now"), 600);
  };
  return (
    <div className="settings-page">
      <PageHeader
        eyebrow="Your space, your choices"
        title="Settings"
        description="Keep the important controls findable, and the sensitive ones deliberate."
      />
      <div className="settings-layout">
        <aside className="settings-nav" aria-label="Settings sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                section === id
                  ? "settings-nav-item active"
                  : `settings-nav-item ${id === "danger" ? "danger-link" : ""}`
              }
              onClick={() => {
                setSection(id);
                window.history.replaceState(null, "", `/settings#${id}`);
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>
        <main className="settings-content">
          <div className="settings-save-state" role="status">
            <span className="sync-dot" /> {saved}
          </div>
          {section === "profile" && (
            <SettingsSection
              eyebrow="Profile"
              title="How Aralivo knows you"
              description="These details shape your workspace, not your public identity."
            >
              <div className="profile-row">
                <div className="avatar avatar-large">JS</div>
                <div>
                  <strong>Jamie Santos</strong>
                  <p className="muted-copy">Profile initials are used by default.</p>
                </div>
                <button className="button button-quiet">Change avatar</button>
              </div>
              <div className="settings-form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input defaultValue="Jamie Santos" onChange={update} />
                </label>
                <label className="field">
                  <span>Academic level</span>
                  <select defaultValue="undergraduate" onChange={update}>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="independent">Independent learner</option>
                  </select>
                </label>
                <label className="field">
                  <span>Language</span>
                  <select defaultValue="en" onChange={update}>
                    <option value="en">English</option>
                  </select>
                </label>
                <label className="field">
                  <span>Timezone</span>
                  <select defaultValue="asia-manila" onChange={update}>
                    <option value="asia-manila">Asia/Manila (UTC+8)</option>
                    <option value="utc">UTC</option>
                  </select>
                </label>
              </div>
              <SaveButton onClick={update} />
            </SettingsSection>
          )}
          {section === "account" && (
            <SettingsSection
              eyebrow="Account & sign-in"
              title="Ways to get back in"
              description="Keep at least one verified recovery method active."
            >
              <div className="settings-list">
                <SettingRow
                  icon={<Mail size={18} />}
                  title="jamie@example.com"
                  description="Email address · Verified"
                  action={<Pill tone="mint">Verified</Pill>}
                />
                <SettingRow
                  icon={<span className="google-g">G</span>}
                  title="Google"
                  description="Connected for sign-in only"
                  action={<button className="button button-quiet">Disconnect</button>}
                />
                <SettingRow
                  icon={<KeyRound size={18} />}
                  title="Password"
                  description="Last changed 14 days ago"
                  action={<button className="button button-quiet">Change</button>}
                />
              </div>
            </SettingsSection>
          )}
          {section === "security" && (
            <SettingsSection
              eyebrow="Security"
              title="Keep your account yours"
              description="Sensitive actions ask for re-authentication before they change anything important."
            >
              <div className="security-callout">
                <ShieldCheck size={20} />
                <div>
                  <strong>Your account is in good shape.</strong>
                  <p>No unusual activity detected in the last 30 days.</p>
                </div>
              </div>
              <SettingRow
                icon={<LogOut size={18} />}
                title="Active sessions"
                description="This browser · Current session"
                action={<button className="button button-quiet">Sign out others</button>}
              />
              <SettingRow
                icon={<TimerReset size={18} />}
                title="Password reset"
                description="Send a fresh reset link to your verified email"
                action={<button className="button button-quiet">Send link</button>}
              />
            </SettingsSection>
          )}
          {section === "study" && (
            <SettingsSection
              eyebrow="Study preferences"
              title="Make the default feel like you"
              description="Small defaults help you start without making decisions every time."
            >
              <SettingsToggle
                title="Daily goal"
                description="Keep a gentle target visible on Today."
                enabled
                onChange={update}
              />
              <label className="field">
                <span>Default session length</span>
                <select defaultValue="25" onChange={update}>
                  <option value="15">15 minutes</option>
                  <option value="25">25 minutes</option>
                  <option value="45">45 minutes</option>
                </select>
              </label>
              <label className="field">
                <span>Preferred study time</span>
                <select defaultValue="morning" onChange={update}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </label>
              <SaveButton onClick={update} />
            </SettingsSection>
          )}
          {section === "notifications" && (
            <SettingsSection
              eyebrow="Notifications"
              title="Only the useful nudges"
              description="Aralivo does not send marketing email by default."
            >
              <SettingsToggle
                title="Email verification and security"
                description="Important account messages only."
                enabled
                onChange={update}
              />
              <SettingsToggle
                title="Study reminders"
                description="A gentle reminder when you asked for one."
                enabled
                onChange={update}
              />
              <SettingsToggle
                title="Calendar notifications"
                description="Only for events you explicitly export or create."
                enabled={false}
                onChange={update}
              />
            </SettingsSection>
          )}
          {section === "integrations" && (
            <SettingsSection
              eyebrow="Integrations"
              title="Optional connections"
              description="Every provider is isolated. Your core study loop works without them."
            >
              <IntegrationRow name="Google Calendar" detail="Not connected" action="Connect" />
              <IntegrationRow name="Open Library" detail="Available · low-volume" action="View" />
              <IntegrationRow name="OpenAlex" detail="Not configured" action="Learn" />
              <IntegrationRow
                name="AI assistant"
                detail="Disabled · no key configured"
                action="Learn"
              />
              <IntegrationRow
                name="Stellar receipts"
                detail="Testnet ready · opt-in"
                action="Open"
              />
            </SettingsSection>
          )}
          {section === "receipts" && (
            <SettingsSection
              eyebrow="Receipts"
              title="Decide what is worth keeping"
              description="Receipts are learning records, not degrees or official credentials."
            >
              <SettingsToggle
                title="Issue privacy-safe receipts"
                description="Never includes notes, answers, grades, email, or school records."
                enabled={false}
                onChange={update}
              />
              <Notice
                tone="info"
                title="Testnet first"
                text="Receipt registration is isolated behind a server-side adapter and never blocks study, practice, or planner features."
              />
            </SettingsSection>
          )}
          {section === "privacy" && (
            <SettingsSection
              eyebrow="Privacy & data"
              title="Take your data with you"
              description="Exports are private downloads. Clearing local data removes this device’s saved snapshot."
            >
              <SettingRow
                icon={<FileDown size={18} />}
                title="Export data"
                description="Download your profile, progress, tasks, and notes."
                action={<button className="button button-quiet">Export JSON</button>}
              />
              <SettingRow
                icon={<Trash2 size={18} />}
                title="Clear local data"
                description="Remove offline snapshots from this browser."
                action={<button className="button button-quiet">Clear</button>}
              />
              <SettingRow
                icon={<LogOut size={18} />}
                title="Sign out"
                description="Private local state is cleared by default."
                action={
                  <button className="button button-quiet" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
            </SettingsSection>
          )}
          {section === "appearance" && (
            <SettingsSection
              eyebrow="Appearance & accessibility"
              title="Make it easier to stay with"
              description="The visual system stays calm, with stronger contrast and less motion when you need it."
            >
              <SettingsToggle
                title="Reduced motion"
                description="Use quieter transitions and no progress animation."
                enabled={reducedMotion}
                onChange={() => {
                  setReducedMotion((value) => !value);
                  update();
                }}
              />
              <SettingsToggle
                title="High contrast support"
                description="System forced-colors preferences are respected."
                enabled
                onChange={update}
              />
              <div className="theme-options">
                <button className="theme-option active">
                  <span className="theme-swatch swatch-system" /> System
                </button>
                <button className="theme-option">
                  <span className="theme-swatch swatch-light" /> Light
                </button>
                <button className="theme-option">
                  <span className="theme-swatch swatch-clay" /> Study clay
                </button>
              </div>
            </SettingsSection>
          )}
          {section === "danger" && (
            <SettingsSection
              eyebrow="Danger zone"
              title="Irreversible actions"
              description="These actions need deliberate confirmation and cannot be undone."
            >
              <div className="danger-zone">
                <div>
                  <h3>Delete account</h3>
                  <p>
                    This permanently removes your account, notes, progress, and integrations.
                    Receipts already registered on a public network cannot be edited, but they
                    contain no direct identity.
                  </p>
                </div>
                <button className="button button-danger" onClick={() => setDialog(true)}>
                  <Trash2 size={16} /> Delete account
                </button>
              </div>
            </SettingsSection>
          )}
        </main>
      </div>
      {dialog && (
        <ConfirmDialog
          onClose={() => setDialog(false)}
          onConfirm={() => {
            setDialog(false);
            onSignOut();
          }}
        />
      )}
    </div>
  );
}
function SettingsSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-section">
      <div className="settings-section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="settings-actions">
      <button className="button button-dark" onClick={onClick}>
        Save changes <Check size={16} />
      </button>
    </div>
  );
}
function SettingRow({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="setting-row">
      <span className="setting-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}
function SettingsToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  const [value, setValue] = useState(enabled);
  return (
    <div className="setting-row">
      <span className="setting-icon">
        <CheckCircle2 size={18} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        className={value ? "toggle active" : "toggle"}
        onClick={() => {
          setValue((current) => !current);
          onChange();
        }}
        role="switch"
        aria-checked={value}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}
function IntegrationRow({
  name,
  detail,
  action,
  disabled = false,
}: {
  name: string;
  detail: string;
  action: string;
  disabled?: boolean;
}) {
  return (
    <div className="setting-row">
      <span className="setting-icon">
        <Link2 size={18} />
      </span>
      <div>
        <strong>{name}</strong>
        <p>{detail}</p>
      </div>
      <button className="button button-quiet" disabled={disabled} aria-label={`${action} ${name}`}>
        {action}
      </button>
    </div>
  );
}
function ConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, input"),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className="dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
        <div className="danger-orb small">
          <Trash2 size={22} />
        </div>
        <p className="eyebrow">This cannot be undone</p>
        <h2 id="delete-title">Delete your Aralivo space?</h2>
        <p id="delete-description">
          Your profile, learning history, private notes, and integrations will be permanently
          removed. Type <strong>DELETE</strong> to continue.
        </p>
        <input
          ref={inputRef}
          className="dialog-input"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder="Type DELETE"
          aria-label="Type DELETE to confirm"
        />
        <div className="dialog-actions">
          <button className="button button-quiet" onClick={onClose}>
            Keep my space
          </button>
          <button
            className="button button-danger"
            disabled={typed !== "DELETE"}
            onClick={onConfirm}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="route-loading">
            <span className="loading-spinner" /> Loading your space…
          </div>
        }
      >
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
