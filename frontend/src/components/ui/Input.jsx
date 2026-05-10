const Input = ({ label, error, className = "", ...props }) => {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        className={`h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-sm text-danger">{error}</span>}
    </label>
  );
};

export default Input;
