import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { isAuthenticated, isAuthenticating, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@prodana.test",
    password: "AdminPass123",
  });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (exception) {
      setError(exception.message);
    }
  };

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-ink px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-brand">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Prodana RBAC</p>
            <p className="text-sm text-slate-300">Enterprise Administration</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-normal text-blue-200">Secure Operations</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Role-aware control for users and products.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            A production-style dashboard with JWT authentication, protected routes, and role-based permissions.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
          <span className="rounded-md bg-white/10 px-3 py-2">Admin</span>
          <span className="rounded-md bg-white/10 px-3 py-2">Editor</span>
          <span className="rounded-md bg-white/10 px-3 py-2">Viewer</span>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-7 shadow-soft">
          <div className="mb-8">
            <p className="text-sm font-medium text-brand">Welcome back</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Sign in to dashboard</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Alert message={error} />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
            <Button type="submit" className="w-full" disabled={isAuthenticating}>
              {isAuthenticating ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-ink">Demo accounts</p>
            <p className="mt-2">admin@prodana.test / AdminPass123</p>
            <p>editor@prodana.test / EditorPass123</p>
            <p>viewer@prodana.test / ViewerPass123</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
