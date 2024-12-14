export const NetworkConfig = {
  clientUrl: process.env.REACT_APP_CLIENT_URL,
  serverUrl: process.env.REACT_APP_SERVER_URL,
  googleClientId: ""
};

export const UserConfig = {
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