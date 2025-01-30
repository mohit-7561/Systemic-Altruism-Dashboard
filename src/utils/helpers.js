export const shadeColor = (color, percent) => {
  const num = parseInt(color.replace("#",""),16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(1 << 24 | (R<255?R<1?0:R:255) << 16 | (G<255?G<1?0:G:255) << 8 | (B<255?B<1?0:B:255)).toString(16).slice(1)}`;
};

// You can add other utility functions here later 