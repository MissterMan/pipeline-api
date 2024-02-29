export default interface User {
  name: string;
  email: string;
  role: string;
  birthdate: string;
  password: string;
  uuid: string;
  created_at?: Date;
  updated_at: Date;
}
