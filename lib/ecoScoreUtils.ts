export const getEcoScoreBgColor = (grade?: string | null): string => {
  if (!grade || grade === "unknown") {
    return "bg-zinc-900 border-zinc-700";
  }

  const lowerGrade = grade.toLowerCase();
  switch (lowerGrade) {
    case "a":
      return "bg-emerald-950 border-emerald-700";
    case "b":
      return "bg-green-950 border-green-700";
    case "c":
      return "bg-amber-950 border-amber-700";
    case "d":
      return "bg-orange-950 border-orange-700";
    case "e":
      return "bg-red-950 border-red-700";
    default:
      return "bg-zinc-900 border-zinc-700";
  }
};

export const getEcoScoreColor = (grade?: string | null): string => {
  if (!grade || grade === "unknown") {
    return "text-gray-400";
  }

  const lowerGrade = grade.toLowerCase();
  switch (lowerGrade) {
    case "a":
      return "text-emerald-400";
    case "b":
      return "text-green-400";
    case "c":
      return "text-amber-400";
    case "d":
      return "text-orange-400";
    case "e":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export const getEcoScoreLabel = (grade?: string | null): string => {
  if (!grade || grade === "unknown") {
    return "No environmental data";
  }

  const lowerGrade = grade.toLowerCase();
  switch (lowerGrade) {
    case "a":
      return "🌱 Eco superstar";
    case "b":
      return "🌿 Eco-friendly";
    case "c":
      return "⚖️ Neutral impact";
    case "d":
      return "🔥 Also killing the planet";
    case "e":
      return "💀 Environmental disaster";
    default:
      return "No environmental data";
  }
};

export const getEcoScoreBadgeEmoji = (grade?: string | null): string => {
  if (!grade || grade === "unknown") {
    return "❓";
  }

  const lowerGrade = grade.toLowerCase();
  switch (lowerGrade) {
    case "a":
      return "🌍";
    case "b":
      return "🌱";
    case "c":
      return "⚖️";
    case "d":
      return "⚠️";
    case "e":
      return "🚨";
    default:
      return "❓";
  }
};
