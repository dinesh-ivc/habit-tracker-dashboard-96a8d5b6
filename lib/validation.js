export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateName(name) {
  return name && name.trim().length >= 2;
}