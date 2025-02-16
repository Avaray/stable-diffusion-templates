interface Rating {
  [key: string]: [string, string];
}

export const ratings: Rating = {
  u: ["⏳", "Needs more testing."],
  a: ["🔥", "It's fire!"],
  b: ["👍", "It's OK."],
  c: ["👎", "It's bad. Will be deleted probably."],
  d: ["💩", "It's crap"],
};
