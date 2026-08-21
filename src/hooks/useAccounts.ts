import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theoflow-accounts";
const EVENT = "theoflow-accounts-change";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AccountsState = {
  accounts: Account[];
  activeId: string | null;
};

const DEFAULT_STATE: AccountsState = {
  accounts: [
    {
      id: "acc-motheo",
      name: "Motheo Ditodi",
      email: "motheo.ditodi8@gmail.com",
      role: "Product Operations",
    },
  ],
  activeId: "acc-motheo",
};

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function read(): AccountsState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AccountsState;
    if (!parsed || !Array.isArray(parsed.accounts)) return DEFAULT_STATE;
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

function write(state: AccountsState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useAccounts() {
  const [state, setState] = useState<AccountsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    setHydrated(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((next: AccountsState) => {
    write(next);
    setState(next);
  }, []);

  const active = state.accounts.find((a) => a.id === state.activeId) ?? null;

  const updateProfile = useCallback(
    (patch: Partial<Omit<Account, "id">>) => {
      const current = read();
      update({
        ...current,
        accounts: current.accounts.map((a) =>
          a.id === current.activeId ? { ...a, ...patch } : a,
        ),
      });
    },
    [update],
  );

  const addAccount = useCallback(
    (account: Omit<Account, "id">) => {
      const current = read();
      const existing = current.accounts.find(
        (a) => a.email.toLowerCase() === account.email.toLowerCase(),
      );
      if (existing) {
        update({ ...current, activeId: existing.id });
        return existing.id;
      }
      const id = `acc-${Date.now()}`;
      update({
        accounts: [...current.accounts, { ...account, id }],
        activeId: id,
      });
      return id;
    },
    [update],
  );

  const switchAccount = useCallback(
    (id: string) => {
      const current = read();
      update({ ...current, activeId: id });
    },
    [update],
  );

  const signOut = useCallback(() => {
    const current = read();
    update({ ...current, activeId: null });
  }, [update]);

  const deleteActiveAccount = useCallback(() => {
    const current = read();
    update({
      accounts: current.accounts.filter((a) => a.id !== current.activeId),
      activeId: null,
    });
  }, [update]);

  return {
    accounts: state.accounts,
    active,
    hydrated,
    updateProfile,
    addAccount,
    switchAccount,
    signOut,
    deleteActiveAccount,
  };
}
