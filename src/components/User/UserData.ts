interface UserData {
  email: string;
  verified: boolean;

  name?: string | undefined;
  img?: string | undefined;
  password?: string | undefined;
}

interface EmailSignupData {
  email: string;
  password: string;
  verified?: boolean;
}

export { UserData, EmailSignupData };
