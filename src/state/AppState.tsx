import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DOMAINS, type DomainId } from '../lib/domains';
import { haptics, sfx } from '../lib/audio';

export interface Settings {
  sound: boolean;
  volume: number;
  haptics: boolean;
  reduceMotion: boolean;
  lowEffects: boolean;
  textSize: 'md' | 'lg' | 'xl';
}

export interface Profile {
  handle: string;
  title: string;
  avatarSeed: number;
  frameId: string;
  nameplateId: string;
  themeId: string;
  joinedAt: string;
  bio: string;
  country: string;
}

export interface VaultItem {
  id: string;
  conceptId: string;
  concept: string;
  domainId: DomainId;
  principle: string;
  why: string;
  tradeoff?: string;
  savedAt: string;
  stage: number;
  dueAt: string;
  missCount: number;
  lastResult: 'correct' | 'incorrect' | null;
}

export interface Toast {
  id: number;
  title: string;
  message?: string;
  tone?: 'default' | 'success' | 'error' | 'accent';
}

interface PersistedState {
  onboarded: boolean;
  settings: Settings;
  profile: Profile;
  vault: VaultItem[];
  equipped: { frames: string[]; nameplates: string[]; themes: string[] };
  streak: { count: number; lastPlayed: string | null };
  xp: number;
  sparks: number;
  matchesPlayed: number;
  wins: number;
  selectedDomain: DomainId;
}

const STORAGE_KEY = 'mayaduels.v3.state';

const defaultSettings: Settings = {
  sound: true,
  volume: 0.7,
  haptics: true,
  reduceMotion: false,
  lowEffects: false,
  textSize: 'md',
};

const defaultProfile: Profile = {
  handle: 'new.engineer',
  title: 'Provisional Initiate',
  avatarSeed: 7,
  frameId: 'frame-graphite',
  nameplateId: 'plate-obsidian',
  themeId: 'theme-obsidian',
  joinedAt: new Date().toISOString(),
  bio: 'Collecting mental models, one duel at a time.',
  country: '—',
};

const defaultState: PersistedState = {
  onboarded: false,
  settings: defaultSettings,
  profile: defaultProfile,
  vault: [],
  equipped: {
    frames: ['frame-graphite'],
    nameplates: ['plate-obsidian'],
    themes: ['theme-obsidian'],
  },
  streak: { count: 0, lastPlayed: null },
  xp: 0,
  sparks: 0,
  matchesPlayed: 0,
  wins: 0,
  selectedDomain: 'AI_ML',
};

function loadState(): PersistedState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      profile: { ...defaultProfile, ...(parsed.profile ?? {}) },
      equipped: { ...defaultState.equipped, ...(parsed.equipped ?? {}) },
      streak: { ...defaultState.streak, ...(parsed.streak ?? {}) },
    };
  } catch {
    return defaultState;
  }
}

interface AppStateValue extends PersistedState {
  toasts: Toast[];
  setSettings: (patch: Partial<Settings>) => void;
  setProfile: (patch: Partial<Profile>) => void;
  completeOnboarding: (domain: DomainId, handle?: string) => void;
  selectDomain: (domain: DomainId) => void;
  saveVaultItem: (item: Omit<VaultItem, 'id' | 'savedAt' | 'stage' | 'dueAt' | 'missCount' | 'lastResult'>) => void;
  removeVaultItem: (conceptId: string) => void;
  reviewVaultItem: (conceptId: string, correct: boolean) => void;
  equip: (kind: 'frames' | 'nameplates' | 'themes', id: string) => void;
  recordMatch: (payload: {
    won: boolean;
    drew: boolean;
    domainId: DomainId;
    xp: number;
    sparks: number;
    ratingDelta: number;
  }) => void;
  toast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function dueDateFor(stage: number) {
  const days = REVIEW_INTERVALS[Math.min(stage, REVIEW_INTERVALS.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state]);

  // Apply settings side effects
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.reduceMotion = String(state.settings.reduceMotion);
    root.dataset.textSize = state.settings.textSize;
    root.dataset.lowEffects = String(state.settings.lowEffects);
    sfx.setEnabled(state.settings.sound);
    sfx.setVolume(state.settings.volume);
    haptics.setEnabled(state.settings.haptics);
  }, [state.settings]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = toastId.current++;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 3600);
    },
    [dismissToast],
  );

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const completeOnboarding = useCallback((domain: DomainId, handle?: string) => {
    setState((prev) => ({
      ...prev,
      onboarded: true,
      selectedDomain: domain,
      profile: {
        ...prev.profile,
        handle: handle?.trim() || prev.profile.handle,
      },
    }));
  }, []);

  const selectDomain = useCallback((domain: DomainId) => {
    setState((prev) => ({ ...prev, selectedDomain: domain }));
  }, []);

  const saveVaultItem = useCallback<AppStateValue['saveVaultItem']>((item) => {
    setState((prev) => {
      if (prev.vault.some((v) => v.conceptId === item.conceptId)) return prev;
      const now = new Date().toISOString();
      return {
        ...prev,
        vault: [
          {
            ...item,
            id: `vault_${item.conceptId}`,
            savedAt: now,
            stage: 0,
            dueAt: dueDateFor(0),
            missCount: 0,
            lastResult: null,
          },
          ...prev.vault,
        ],
      };
    });
  }, []);

  const removeVaultItem = useCallback((conceptId: string) => {
    setState((prev) => ({
      ...prev,
      vault: prev.vault.filter((v) => v.conceptId !== conceptId),
    }));
  }, []);

  const reviewVaultItem = useCallback((conceptId: string, correct: boolean) => {
    setState((prev) => ({
      ...prev,
      vault: prev.vault.map((v) => {
        if (v.conceptId !== conceptId) return v;
        const nextStage = correct
          ? Math.min(v.stage + 1, REVIEW_INTERVALS.length - 1)
          : Math.max(0, v.stage - 1);
        return {
          ...v,
          stage: nextStage,
          dueAt: dueDateFor(nextStage),
          lastResult: correct ? 'correct' : 'incorrect',
          missCount: correct ? v.missCount : v.missCount + 1,
        };
      }),
    }));
  }, []);

  const equip = useCallback<AppStateValue['equip']>((kind, id) => {
    setState((prev) => {
      const owned = prev.equipped[kind];
      const next = owned.includes(id) ? owned : [...owned, id];
      return {
        ...prev,
        equipped: { ...prev.equipped, [kind]: next },
        profile:
          kind === 'frames'
            ? { ...prev.profile, frameId: id }
            : kind === 'nameplates'
              ? { ...prev.profile, nameplateId: id }
              : { ...prev.profile, themeId: id },
      };
    });
  }, []);

  const recordMatch = useCallback<AppStateValue['recordMatch']>(
    ({ won, drew, domainId, xp, sparks }) => {
      setState((prev) => {
        const today = new Date().toISOString().slice(0, 10);
        const last = prev.streak.lastPlayed;
        let streakCount = prev.streak.count;
        if (last !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yKey = yesterday.toISOString().slice(0, 10);
          streakCount = last === yKey ? streakCount + 1 : 1;
        }
        return {
          ...prev,
          xp: prev.xp + xp,
          sparks: prev.sparks + sparks,
          matchesPlayed: prev.matchesPlayed + 1,
          wins: prev.wins + (won ? 1 : 0),
          selectedDomain: domainId,
          streak: { count: streakCount, lastPlayed: today },
          profile: {
            ...prev.profile,
            title:
              prev.profile.title === 'Provisional Initiate' && prev.matchesPlayed >= 5
                ? 'Challenger'
                : prev.profile.title,
          },
          // draws count as played but not won
          ...(drew ? {} : {}),
        };
      });
    },
    [],
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem('mayaduels.matchArchive');
    Object.keys(localStorage).filter(k=>k.startsWith('mayaduels.daily.')).forEach(k=>localStorage.removeItem(k));
    sessionStorage.removeItem('mayaduels.lastDuel');
    setState({ ...defaultState, settings: state.settings });
    toast({ title: 'Local demo data reset', tone: 'default' });
  }, [state.settings, toast]);

  const value = useMemo<AppStateValue>(
    () => ({
      ...state,
      toasts,
      setSettings,
      setProfile,
      completeOnboarding,
      selectDomain,
      saveVaultItem,
      removeVaultItem,
      reviewVaultItem,
      equip,
      recordMatch,
      toast,
      dismissToast,
      resetAll,
    }),
    [
      state,
      toasts,
      setSettings,
      setProfile,
      completeOnboarding,
      selectDomain,
      saveVaultItem,
      removeVaultItem,
      reviewVaultItem,
      equip,
      recordMatch,
      toast,
      dismissToast,
      resetAll,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

export { DOMAINS };
export type { DomainId };