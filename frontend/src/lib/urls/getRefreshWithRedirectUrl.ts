const getRefreshWithRedirectUrl = (redirectTo: string) =>
    `/api/token/refresh-redirect?returnTo=${encodeURIComponent(redirectTo)}`;

export default getRefreshWithRedirectUrl;