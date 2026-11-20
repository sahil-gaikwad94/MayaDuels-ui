import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from './screens/HomeScreen';
import { ArenasScreen } from './screens/ArenasScreen';
import { DomainDetailScreen } from './screens/DomainDetailScreen';
import { QueueScreen } from './screens/QueueScreen';
import { DuelScreen } from './screens/DuelScreen';
import { ResultScreen } from './screens/ResultScreen';
import { MatchQAScreen } from './screens/MatchQAScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { VaultScreen } from './screens/VaultScreen';
import { RanksScreen } from './screens/RanksScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LockerScreen } from './screens/LockerScreen';
import { AnomalyScreen } from './screens/AnomalyScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { FloatingDock } from './components/FloatingDock';
import { ScrollReset, Toasts } from './components/Toasts';
import { useAppState } from './state/AppState';
import { sfx } from './lib/audio';

/** Screens that hide the standard dock (immersive flows). */
const IMMERSIVE = ['/duel', '/queue', '/onboarding'];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { onboarded } = useAppState();
  const location = useLocation();
  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { onboarded } = useAppState();

  // Unlock WebAudio on the first user gesture.
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Redirect to onboarding on first ever launch.
  useEffect(() => {
    if (!onboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [onboarded, location.pathname, navigate]);

  const immersive = IMMERSIVE.some((p) => location.pathname.startsWith(p));

  return (
    <div className="relative min-h-[100dvh] bg-canvas">
      {/* Ambient canvas backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(1100px 620px at 50% -8%, rgba(0,245,212,0.055), transparent 70%), radial-gradient(900px 520px at 88% 108%, rgba(255,42,133,0.045), transparent 72%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-grid-faint opacity-40"
      />

      <ScrollReset />
      <Toasts />

      <div className="relative z-10">
        <RouteGuard>
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes location={location}>
                <Route path="/onboarding" element={<OnboardingScreen />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/arenas" element={<ArenasScreen />} />
                <Route path="/arenas/:domainId" element={<DomainDetailScreen />} />
                <Route path="/queue" element={<QueueScreen />} />
                <Route path="/duel" element={<DuelScreen />} />
                <Route path="/result" element={<ResultScreen />} />
                <Route path="/match" element={<MatchQAScreen />} />
                <Route path="/history" element={<HistoryScreen />} />
                <Route path="/vault" element={<VaultScreen />} />
                <Route path="/ranks" element={<RanksScreen />} />
                <Route path="/identity" element={<ProfileScreen />} />
                <Route path="/locker" element={<LockerScreen />} />
                <Route path="/anomaly" element={<AnomalyScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.main>
          </AnimatePresence>
        </RouteGuard>

        {!immersive && <FloatingDock />}
      </div>
    </div>
  );
}