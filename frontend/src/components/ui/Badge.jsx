const roleStyles = {
  Admin: "bg-blue-50 text-blue-700 ring-blue-100",
  Editor: "bg-amber-50 text-amber-700 ring-amber-100",
  Viewer: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

const Badge = ({ children, tone = "default" }) => {
  const styles =
    roleStyles[children] ||
    {
      active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      inactive: "bg-slate-100 text-slate-600 ring-slate-200",
      default: "bg-slate-100 text-slate-700 ring-slate-200",
    }[tone];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles}`}>
      {children}
    </span>
  );
};

export default Badge;
