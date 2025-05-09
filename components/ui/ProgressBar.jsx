export const ProgressBar = ({ value, max = 100, color = "blue" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${colorClasses[color]}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
