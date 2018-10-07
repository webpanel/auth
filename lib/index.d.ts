/// <reference types="react" />
export declare type AuthFormProps = {
    authorize: (username: string, password: string) => Promise<void>;
    isAuthorizing: boolean;
    authorizationError?: Error;
};
export interface AuthBaseProps {
    form: (props: AuthFormProps) => React.ReactNode;
    content: (props: AuthContentProps) => React.ReactNode;
}
export declare type AuthContentProps = {
    logout: () => void;
    accessToken: string;
    userName?: string;
};
export { Auth, Auth as OAuth2Auth } from './Auth';
export { DummyAuth } from './DummyAuth';
export { AuthSession } from './AuthSession';
