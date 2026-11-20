import type { DuelState } from "./duel";
const KEY = "mayaduels.matchArchive";
export function readArchive(): DuelState[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list)
      ? list.filter((d) => d?.status === "complete")
      : [];
  } catch {
    return [];
  }
}
export function archiveMatch(duel: DuelState) {
  sessionStorage.setItem("mayaduels.lastDuel", JSON.stringify(duel));
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(
        [
          duel,
          ...readArchive().filter((d) => d.matchId !== duel.matchId),
        ].slice(0, 25),
      ),
    );
  } catch {
    /* The current result is still available for this session. */
  }
}
