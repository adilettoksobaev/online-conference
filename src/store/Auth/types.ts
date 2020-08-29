export interface AuthState {
    phone: string | null;
    message: string;
    result: string;
    sessionId: string | null;
    userName: string | null;
    role: string;
    isAuthorized: boolean;
    loading: boolean;
    accessToCreateConferences: boolean;
    userId: number;
}

export type PhonePinConfirm = {
    sessionId: string;
    userName: string;
    role: string;
    accessToCreateConferences: boolean;
}
  