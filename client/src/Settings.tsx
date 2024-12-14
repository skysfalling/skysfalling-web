export const NetworkSettings = {
  clientUrl: "http://localhost:3000",
  serverUrl: "http://junction.proxy.rlwy.net:42891",
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