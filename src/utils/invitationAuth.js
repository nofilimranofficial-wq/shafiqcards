const COOKIE_NAME = 'invitationAuth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getCookieValue = (name) => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!found) return null;
  return found.split('=')[1] || null;
};

export const getInvitationAuth = () => {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem(COOKIE_NAME);
  if (local) {
    const parsed = safeParse(local);
    if (parsed) return parsed;
  }

  const cookieValue = getCookieValue(COOKIE_NAME);
  if (!cookieValue) return null;

  const parsed = safeParse(decodeURIComponent(cookieValue));
  if (parsed) {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(parsed));
  }
  return parsed;
};

export const setInvitationAuth = (auth) => {
  if (typeof window === 'undefined') return;
  const value = JSON.stringify(auth);
  localStorage.setItem(COOKIE_NAME, value);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
};

export const clearInvitationAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_NAME);
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; samesite=lax`;
};
