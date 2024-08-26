import dotenv from "dotenv";
import path from "path";
import pool, { checkConnection } from "../../src/configs/database";

// Mock dependencies
jest.mock("pg", () => {
  const mClient = {
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock("dotenv");
jest.mock("path");

describe("Database Connection", () => {
  let mockConnect: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      NODE_ENV: "test",
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_USERNAME: "user",
      DB_PASSWORD: "password",
      DB_DATABASE: "testdb",
    };
    mockConnect = pool.connect as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load environment variables correctly", () => {
    const dotenvSpy = jest.spyOn(dotenv, "config");
    const pathSpy = jest.spyOn(path, "resolve");

    // Re-import the module to apply the mocked environment variables
    jest.resetModules();
    require("../../src/configs/database");

    expect(dotenvSpy).toHaveBeenCalledWith({
      path: path.resolve(process.cwd(), ".env.test"),
    });
    expect(pathSpy).toHaveBeenCalledWith(process.cwd(), ".env.test");

    dotenvSpy.mockRestore();
    pathSpy.mockRestore();
  });

  it("should log error when connection fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("connection error");

    mockConnect.mockImplementationOnce((callback) => {
      callback(error, null, jest.fn());
    });

    // Re-run the database connection check
    checkConnection();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to connect to PostgreSQL:",
      error.stack
    );

    consoleErrorSpy.mockRestore();
  });

  it("should log success message when connection succeeds", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const mockRelease = jest.fn();

    mockConnect.mockImplementationOnce((callback) => {
      callback(null, {}, mockRelease);
    });

    // Re-run the database connection check
    checkConnection();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Connected to PostgreSQL database"
    );
    expect(mockRelease).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
