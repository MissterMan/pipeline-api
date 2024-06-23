export const validatePassword = (password: string) => {
  const trimmedPassword = password.trim();

  if (trimmedPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/\d/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one number");
  }
  if (!/[A-Z]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one special character");
  }

  return true; // Password is valid
};

export const validateEmail = (email: string) => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValidate = email.trim();
  if (!emailRegex.test(emailValidate)) {
    throw new Error("Email format is invalid");
  }
};
