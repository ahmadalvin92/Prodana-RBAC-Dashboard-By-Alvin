import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted">The page you are trying to open is not available.</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
