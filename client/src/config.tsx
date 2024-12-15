export const NetworkConfig = {
  clientUrl: `http://${process.env.REACT_APP_CLIENT_URL}`,
  serverUrl: `http://${process.env.REACT_APP_SERVER_URL}`,
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