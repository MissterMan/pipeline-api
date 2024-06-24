export const validatePassword = (password: string): boolean => {
  const trimmedPassword = password.trim();

  const rules = [
    {
      test: (pwd: string) => pwd.length >= 8,
      message: "Password must be at least 8 characters long",
    },
    {
      test: (pwd: string) => /\d/.test(pwd),
      message: "Password must contain at least one number",
    },
    {
      test: (pwd: string) => /[A-Z]/.test(pwd),
      message: "Password must contain at least one uppercase letter",
    },
    {
      test: (pwd: string) => /[a-z]/.test(pwd),
      message: "Password must contain at least one lowercase letter",
    },
    {
      test: (pwd: string) => /[$&+,:;=?@#|'<>.^*()%!-]/.test(pwd),
      message: "Password must contain at least one special character",
    },
  ];

  for (const rule of rules) {
    if (!rule.test(trimmedPassword)) {
      throw new Error(rule.message);
    }
  }

  return true; // Password is valid
};

export const validateEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();

  if (!emailRegex.test(trimmedEmail)) {
    throw new Error("Email format is invalid");
  }

  return true; // Email is valid
};
