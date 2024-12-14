const Roles = ["STUDENT", "BDE", "BDA", "BDS", "I2C", "BDF", "ADMIN"] as const;
export type Role = (typeof Roles)[number];

export type SessionType = {
  userId: string;
  role: Role;
  connected: boolean;
};
