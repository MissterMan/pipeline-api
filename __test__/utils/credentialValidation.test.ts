import {
  validatePassword,
  validateEmail,
} from "../../src/utils/credentialValidation";

describe("Password Validation", () => {
  it("should throw an error if password is less than 8 characters", () => {
    expect(() => validatePassword("Pass1!")).toThrow(
      "Password must be at least 8 characters long"
    );
  });

  it("should throw an error if password does not contain at least one number", () => {
    expect(() => validatePassword("Password!")).toThrow(
      "Password must contain at least one number"
    );
  });

  it("should throw an error if password does not contain at least one uppercase letter", () => {
    expect(() => validatePassword("password1!")).toThrow(
      "Password must contain at least one uppercase letter"
    );
  });

  it("should throw an error if password does not contain at least one lowercase letter", () => {
    expect(() => validatePassword("PASSWORD1!")).toThrow(
      "Password must contain at least one lowercase letter"
    );
  });

  it("should throw an error if password does not contain at least one special character", () => {
    expect(() => validatePassword("Password123")).toThrow(
      "Password must contain at least one special character"
    );
  });

  it("should return true for a valid password", () => {
    expect(validatePassword("Password123!")).toBe(true);
  });
});

describe("Email Validation", () => {
  it("should throw an error if email format is invalid", () => {
    expect(() => validateEmail("invalid-email")).toThrow(
      "Email format is invalid"
    );
  });

  it("should not throw an error for a valid email", () => {
    expect(() => validateEmail("test@example.com")).not.toThrow();
  });
});
