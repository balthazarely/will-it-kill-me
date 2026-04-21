export const VERDICT_CONFIG = {
  safe: {
    label: "You'll survive",
    textColor: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    dotColor: 'bg-green-400',
    tagBg: 'bg-green-400/15',
    tagBorder: 'border-green-400/30',
    tagText: 'text-green-400',
    icon: '✓',
  },
  caution: {
    label: 'Proceed with caution',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    dotColor: 'bg-amber-400',
    tagBg: 'bg-amber-400/15',
    tagBorder: 'border-amber-400/30',
    tagText: 'text-amber-400',
    icon: '⚠',
  },
  bad: {
    label: 'Questionable life choice',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    dotColor: 'bg-orange-400',
    tagBg: 'bg-orange-400/15',
    tagBorder: 'border-orange-400/30',
    tagText: 'text-orange-400',
    icon: '⚡',
  },
  danger: {
    label: 'Absolutely not',
    textColor: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
    dotColor: 'bg-red-400',
    tagBg: 'bg-red-400/15',
    tagBorder: 'border-red-400/30',
    tagText: 'text-red-400',
    icon: '☠',
  },
};

export const getVerdictKey = (score: number): keyof typeof VERDICT_CONFIG => {
  if (score <= 2) return 'safe';
  if (score === 3) return 'caution';
  if (score === 4) return 'bad';
  return 'danger';
};
