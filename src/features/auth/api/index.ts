import { apiClient, ApiError } from '@/services/api';
import type { ApiEnvelope } from '@/types/api';
import type {
  AuthSession,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
} from '@/types/auth';
import type { UserProfile } from '@/types/user';

type AuthApiUser = {
  _id?: string;
  id?: string;
  email?: string;
  fullName?: string;
  username?: string;
};

type AuthApiTokens = {
  accessToken?: string;
  refreshToken?: string;
};

type AuthApiData = {
  user?: AuthApiUser;
  accessToken?: string;
  refreshToken?: string;
  tokens?: AuthApiTokens;
};

type AuthApiResponse = ApiEnvelope<AuthApiData> & {
  statusCode?: number;
};

function mapSessionFromResponse(response: AuthApiResponse): AuthSession {
  const data = response.data;
  const user = data?.user;
  const accessToken = data?.accessToken ?? data?.tokens?.accessToken;
  const refreshToken = data?.refreshToken ?? data?.tokens?.refreshToken;
  const userId = user?.id ?? user?._id;
  const email = user?.email;

  if (!userId || !email || !accessToken) {
    throw new ApiError({
      message: 'Authentication response was missing required session data.',
      code: 'INVALID_AUTH_RESPONSE',
    });
  }

  return {
    userId,
    email,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

function mapUserFromResponse(response: AuthApiResponse): UserProfile {
  const user = response.data?.user;
  const userId = user?.id ?? user?._id;
  const email = user?.email;
  const fullName = user?.fullName ?? user?.username ?? 'New User';

  if (!userId || !email) {
    throw new ApiError({
      message: 'Registration response was missing required user data.',
      code: 'INVALID_REGISTER_RESPONSE',
    });
  }

  return {
    id: userId,
    email,
    fullName,
  };
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post<AuthApiResponse>('/api/v1/users/login', payload);

  return mapSessionFromResponse(response);
}

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post<AuthApiResponse>('/api/v1/users/register', {
    ...payload,
    username: payload.email.split('@')[0],
  });

  return mapUserFromResponse(response);
}

export async function refreshAuthTokens(payload: RefreshTokenPayload) {
  const response = await apiClient.post<AuthApiResponse>(
    '/api/v1/users/refresh-token',
    payload
  );

  const session = mapSessionFromResponse(response);

  return session.tokens;
}
