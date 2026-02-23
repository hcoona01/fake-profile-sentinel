import ProgressBar from "./ProgressBar";

interface ResultProps {
  result: {
    username: string;
    trust_score: number;
    risk_level: string;
    bot_probability: number;
    reasons: string[];
  };
}

export default function ResultCard({ result }: ResultProps) {
  const getRiskBadge = () => {
    if (result.risk_level === "LOW")
      return "bg-green-500/20 text-green-400 border border-green-500/50";
    if (result.risk_level === "MEDIUM")
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
    return "bg-red-500/20 text-red-400 border border-red-500/50";
  };

  const getRiskEmoji = () => {
    if (result.risk_level === "LOW") return "🟢";
    if (result.risk_level === "MEDIUM") return "🟡";
    return "🔴";
  };

  const getScoreColor = () => {
    if (result.trust_score >= 70) return "text-green-400";
    if (result.trust_score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6 backdrop-blur-sm shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">@{result.username}</h2>
          <p className="text-gray-400 text-sm mt-0.5">Analysis Complete</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskBadge()}`}>
          {getRiskEmoji()} {result.risk_level} RISK
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar score={result.trust_score} />

      {/* Score Cards */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Trust Score</p>
          <p className={`text-3xl font-bold ${getScoreColor()}`}>
            {result.trust_score}%
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Bot Probability</p>
          <p className={`text-3xl font-bold ${getScoreColor()}`}>
            {(result.bot_probability * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Reasons */}
      <div className="mt-5">
        <p className="text-gray-400 text-sm mb-3 font-semibold uppercase tracking-wider">
          🔍 Detection Analysis
        </p>
        <ul className="space-y-2">
          {result.reasons.map((reason, index) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300"
            >
              <span>
                {reason.startsWith("ML model strongly predicts bot") ? "🤖" :
                 reason.startsWith("ML model indicates human") ? "✅" :
                 reason.startsWith("ML model indicates moderate") ? "⚠️" : "❌"}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}