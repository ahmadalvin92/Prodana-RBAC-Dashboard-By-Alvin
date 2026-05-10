import { Boxes, LayoutDashboard, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { permissions } from "../../utils/roles";

const getNavigation = (role) => [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    visible: permissions.canAccessDashboard(role),
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
    visible: permissions.canReadUsers(role),
  },
  {
    label: "Products",
    path: "/products",
    icon: Boxes,
    visible: permissions.canAccessProducts(role),
  },
];

const Sidebar = ({ role, isOpen, onClose }) => {
  const items = getNavigation(role).filter((item) => item.visible);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <img src="/brand/prodana-crowdfunding.png" alt="Prodana Crowdfunding" className="h-12 w-auto object-contain" />
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                    isActive ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-normal text-muted">Current Role</p>
          <p className="mt-1 text-sm font-semibold text-ink">{role}</p>
          <p className="mt-3 text-xs leading-5 text-muted">Powered by Protemus Capital</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
