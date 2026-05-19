import { useAuthStore } from '../auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'anonymous', session: null });
  });

  it('initializes with anonymous status', () => {
    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('setSession updates status to authenticated', () => {
    const session = {
      userId: '1',
      email: 'test@example.com',
      tokens: { accessToken: 'access', refreshToken: 'refresh' },
    };
    useAuthStore.getState().setSession(session);
    
    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().session).toEqual(session);
  });

  it('clearSession resets to anonymous', () => {
    const session = {
      userId: '1',
      email: 'test@example.com',
      tokens: { accessToken: 'access', refreshToken: 'refresh' },
    };
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(useAuthStore.getState().session).toBeNull();
  });
});
