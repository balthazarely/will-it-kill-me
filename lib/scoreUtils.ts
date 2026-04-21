export const getScoreColor = (score: number) => {
  if (score <= 2) return 'text-green-400';
  if (score === 3) return 'text-yellow-400';
  return 'text-red-400';
};

export const getScoreBgColor = (score: number) => {
  if (score <= 2) return 'bg-green-400/10 border-green-400/30';
  if (score === 3) return 'bg-yellow-400/10 border-yellow-400/30';
  return 'bg-red-400/10 border-red-400/30';
};
