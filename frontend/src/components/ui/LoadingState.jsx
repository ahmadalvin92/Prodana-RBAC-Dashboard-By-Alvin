const LoadingState = ({ label = "Loading data..." }) => {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-md border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
        {label}
      </div>
    </div>
  );
};

export default LoadingState;
