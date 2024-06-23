import pool from "../configs/database";
import User from "../models/userModel";
import bcrypt from "bcrypt";

export const authUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const query = "SELECT * FROM pipeline.pipeline_users WHERE email = $1";
    const result = await pool.query(query, [email]);

    const user = result.rows[0] as User | null;

    // Check user password
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error("Error when validate user:", error);
    throw error;
  }
};
