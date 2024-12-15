export const NetworkConfig = {
  clientUrl: `https://${process.env.REACT_APP_CLIENT_URL}`,
  serverUrl: `https://${process.env.REACT_APP_SERVER_URL}`,
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