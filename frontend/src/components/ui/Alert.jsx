const Alert = ({ message, tone = "danger" }) => {
  if (!message) {
    return null;
  }

  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";

  return <div className={`rounded-md border px-4 py-3 text-sm ${styles}`}>{message}</div>;
};

export default Alert;
