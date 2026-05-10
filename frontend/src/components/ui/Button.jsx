const variants = {
  primary: "bg-brand text-white hover:bg-blue-700 focus:ring-blue-200",
  secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
  danger: "bg-danger text-white hover:bg-red-700 focus:ring-red-200",
  ghost: "bg-transparent text-muted hover:bg-slate-100 focus:ring-slate-200",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

const Button = ({ children, className = "", variant = "primary", size = "md", type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus:ring-4 disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
