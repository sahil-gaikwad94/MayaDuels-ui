import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HomeScreen } from "./screens/HomeScreen";
import { ArenasScreen } from "./screens/ArenasScreen";
import { DomainDetailScreen } from "./screens/DomainDetailScreen";
import { QueueScreen } from "./screens/QueueScreen";
import { DuelScreen } from "./screens/DuelScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { MatchQAScreen } from "./screens/MatchQAScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { VaultScreen } from "./screens/VaultScreen";
import { RanksScreen } from "./screens/RanksScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LockerScreen } from "./screens/LockerScreen";
import { AnomalyScreen } from "./screens/AnomalyScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { StationNav } from "./components/StationNav";
import { ScrollReset, Toasts } from "./components/Toasts";
import { sfx } from "./lib/audio";

/** Screens that hide the standard dock (immersive flows). */
const IMMERSIVE = ["/duel", "/queue", "/onboarding"];

export function App() {
  const location = useLocation();

  // Unlock WebAudio on the first user gesture.
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const immersive = IMMERSIVE.some((p) => location.pathname.startsWith(p));

  return (
    <div className={immersive?'arc-shell immersive':'arc-shell with-rail'}>
      <ScrollReset />
      <Toasts />

      <div>
        {!immersive && <StationNav />}
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
              <Route
                path="/arenas/:domainId"
                element={<DomainDetailScreen />}
              />
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
      </div>
    </div>
  );
}
