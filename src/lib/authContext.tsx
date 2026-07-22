import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "../types/auth";
import {
  getLocalProfile,
  getSessionUserId,
  listDirectoryUsers,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
} from "./localAuth";
import { unitById } from "../data/orgAccess";
import { ROLE_LABELS } from "../types/auth";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  directory: UserProfile[];
  unitLabel: string;
  roleLabel: string;
  refreshDirectory: () => void;
  register: (input: {
    email: string;
    password: string;
    fullName: string;
    inviteCode: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDirectory = useCallback(() => {
    setDirectory(listDirectoryUsers());
  }, []);

  useEffect(() => {
    const sessionId = getSessionUserId();
    setUser(getLocalProfile(sessionId));
    refreshDirectory();
    setLoading(false);
  }, [refreshDirectory]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      directory,
      unitLabel: unitById(user?.unitId)?.name ?? "Unassigned unit",
      roleLabel: user ? ROLE_LABELS[user.role] : "",
      refreshDirectory,
      async register(input) {
        const profile = await registerLocalUser(input);
        setUser(profile);
        refreshDirectory();
      },
      async login(email, password) {
        const profile = await loginLocalUser(email, password);
        setUser(profile);
        refreshDirectory();
      },
      logout() {
        logoutLocalUser();
        setUser(null);
      },
    }),
    [user, loading, directory, refreshDirectory],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
