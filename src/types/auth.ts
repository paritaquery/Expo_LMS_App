export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  tokens: AuthTokens;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
};
