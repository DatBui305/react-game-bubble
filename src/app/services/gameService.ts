export const createBubbles = (point: number) => {
  return Array.from({ length: point }, (_, i) => ({
    id: Date.now() + i,
    number: i + 1,
    x: Math.random() * 80 + "%",
    y: Math.random() * 80 + "%",
    opacity: 1,
    timeDisappear: 3,
    isClick: false,
  })).sort((a, b) => a.number - b.number);
};
