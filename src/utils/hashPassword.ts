import bcrypt from "bcrypt";

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve: any, reject) => {
    // Generate salt
    bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
      if (err) {
        reject(err);
      } else {
        // Hash the password
        bcrypt.hash(password, salt, (err: Error | undefined, hash: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};
