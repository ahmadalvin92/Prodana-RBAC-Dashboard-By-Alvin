const Select = ({ label, children, className = "", ...props }) => {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        className={`h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
