const PALETTE = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#10ac84', '#ee5a24', '#0abde3', '#c44569', '#f368e0',
  '#3742fa', '#2f3542', '#ff3838', '#70a1ff', '#7bed9f',
];

const assignedColors = new Map<string, string>();

export const getColorForFilterValue = (value: string): string => {
  const existing = assignedColors.get(value);
  if (existing) return existing;

  const usedColors = new Set(assignedColors.values());
  const availableColors = PALETTE.filter((color) => !usedColors.has(color));
  const color = availableColors.length > 0
    ? availableColors[assignedColors.size % availableColors.length]
    : PALETTE[assignedColors.size % PALETTE.length];

  assignedColors.set(value, color);
  return color;
};
