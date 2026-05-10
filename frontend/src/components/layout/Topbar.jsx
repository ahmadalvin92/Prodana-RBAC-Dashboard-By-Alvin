import { LogOut, Menu } from "lucide-react";
import Button from "../ui/Button";

const Topbar = ({ user, onLogout, onOpenSidebar }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onOpenSidebar} className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-sm font-semibold text-ink">{user?.name}</p>
          <p className="text-xs text-muted">{user?.email}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  );
};

export default Topbar;
