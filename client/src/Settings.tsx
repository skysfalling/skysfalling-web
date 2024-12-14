export const NetworkSettings = {
  clientUrl: "http://localhost:3000",
  serverUrl: "skysfalling-web-server-production.up.railway.app",
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
};

export const UserSettings = {
  name: {
    minLength: 2,
    maxLength: 22,
  },
  password: {
    minLength: 8,
    maxLength: 22,
  },
  accessTokenKey: "accessToken",
};