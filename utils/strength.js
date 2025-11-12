export function checkStrength(password) {
  if (!password) return "weak";
  const strong = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
  const medium = /(?=.{6,})(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d)))/;
  if (strong.test(password)) return "strong";
  if (medium.test(password)) return "medium";
  return "weak";
}
