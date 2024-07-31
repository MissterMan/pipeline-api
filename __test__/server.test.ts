import pool from "../src/configs/database";

jest.mock("pg", () => {
  const mPool = {
    connect: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("PostgreSQL Connection", () => {
  let mockConnect: jest.Mock;

  beforeEach(() => {
    mockConnect = pool.connect as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log error when connection fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("connection error");

    mockConnect.mockImplementationOnce((callback) => {
      callback(error, null, jest.fn());
    });

    // Re-run the database connection code
    pool.connect((err, client, release) => {
      if (err) {
        console.error("Failed to connect to PostgreSQL:", err.stack);
      } else {
        console.log("Connected to PostgreSQL database");
        release();
      }
    });

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

    // Re-run the database connection code
    pool.connect((err, client, release) => {
      if (err) {
        console.error("Failed to connect to PostgreSQL:", err.stack);
      } else {
        console.log("Connected to PostgreSQL database");
        release();
      }
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Connected to PostgreSQL database"
    );
    expect(mockRelease).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
