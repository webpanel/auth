export type AuthFormProps = {
  authorize: (username: string, password: string) => Promise<void>;
  isAuthorizing: boolean;
  authorizationError?: Error;
};

export interface AuthBaseProps {
  form: (props: AuthFormProps) => React.ReactNode;
  // deprecated, please use children
  content?: (props: AuthContentProps) => React.ReactNode;
  children?: (props: AuthContentProps) => React.ReactNode;
}

export type AuthContentProps = {
  logout: () => void;
  accessToken: string;
  userName?: string;
};

export { Auth, Auth as OAuth2Auth } from "./Auth";
export { DummyAuth } from "./DummyAuth";
export { AuthSession } from "./AuthSession";

export { hasAccess, hasRole } from "./permissions";
