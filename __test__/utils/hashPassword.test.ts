import bcrypt from "bcrypt";
import { hashPassword } from "../../src/utils/hashPassword";

// Mock bcrypt functions
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe("hashPassword", () => {
  it("should hash the password successfully", async () => {
    const password = "testPassword";
    const salt = "testSalt";
    const hashedPassword = "hashedTestPassword";

    (bcrypt.genSalt as jest.Mock).mockImplementation((saltRounds, callback) => {
      callback(undefined, salt);
    });

    (bcrypt.hash as jest.Mock).mockImplementation(
      (password, salt, callback) => {
        callback(undefined, hashedPassword);
      }
    );

    const result = await hashPassword(password);
    expect(result).toBe(hashedPassword);
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10, expect.any(Function));
    expect(bcrypt.hash).toHaveBeenCalledWith(
      password,
      salt,
      expect.any(Function)
    );
  });

  it("should handle errors in genSalt", async () => {
    const password = "testPassword";
    const error = new Error("genSalt error");

    (bcrypt.genSalt as jest.Mock).mockImplementation((saltRounds, callback) => {
      callback(error, undefined);
    });

    await expect(hashPassword(password)).rejects.toThrow("genSalt error");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10, expect.any(Function));
  });

  it("should handle errors in hash", async () => {
    const password = "testPassword";
    const salt = "testSalt";
    const error = new Error("hash error");

    (bcrypt.genSalt as jest.Mock).mockImplementation((saltRounds, callback) => {
      callback(undefined, salt);
    });

    (bcrypt.hash as jest.Mock).mockImplementation(
      (password, salt, callback) => {
        callback(error, undefined);
      }
    );

    await expect(hashPassword(password)).rejects.toThrow("hash error");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10, expect.any(Function));
    expect(bcrypt.hash).toHaveBeenCalledWith(
      password,
      salt,
      expect.any(Function)
    );
  });
});
