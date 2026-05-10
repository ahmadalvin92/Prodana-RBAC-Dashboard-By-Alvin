const EmptyState = ({ title = "No data found", description = "Try adjusting your search criteria." }) => {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
};

export default EmptyState;
