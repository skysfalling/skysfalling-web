const connectionSettings = {
  clientUrl: process.env.REACT_APP_CLIENT_URL,
  serverUrl: process.env.REACT_APP_SERVER_URL,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
};

const userSettings = {
  name:
  {
    minLength: 2,
    maxLength: 22,
  },
  password: {
    minLength: 8,
    maxLength: 22,
  }
}

export { connectionSettings as Connection, userSettings as User };
