interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  googleId: string;
  avatar: string;
  role: "user" | "admin" | "super-admin";
}

export type { User };
