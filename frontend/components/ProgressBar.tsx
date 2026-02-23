interface ProgressBarProps {
  score: number;
}

export default function ProgressBar({ score }: ProgressBarProps) {
  const getColor = () => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#eab308";
    return "#ef4444";
  };

  const getGlow = () => {
    if (score >= 70) return "0 0 20px rgba(34,197,94,0.4)";
    if (score >= 40) return "0 0 20px rgba(234,179,8,0.4)";
    return "0 0 20px rgba(239,68,68,0.4)";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">Trust Score</span>
        <span className="text-sm font-bold" style={{ color: getColor() }}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-1000"
          style={{
            width: `${score}%`,
            backgroundColor: getColor(),
            boxShadow: getGlow(),
          }}
        />
      </div>
    </div>
  );
}