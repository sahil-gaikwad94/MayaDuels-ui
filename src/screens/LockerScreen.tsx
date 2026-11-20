import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Sparkles } from 'lucide-react';
import { Page, Badge, SectionHeader } from '../components/Page';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { COSMETICS, type Cosmetic } from '../lib/demoData';
import { useAppState } from '../state/AppState';
import { cn } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';
import { sfx, haptics } from '../lib/audio';

const TABS = [
  { id: 'frames', label: 'Avatar frames' },
  { id: 'nameplates', label: 'Nameplates' },
  { id: 'themes', label: 'Arena themes' },
] as const;

const RARITY_STYLES: Record<Cosmetic['rarity'], { label: string; color: string }> = {
  common: { label: 'common', color: '#9FB4C7' },
  rare: { label: 'rare', color: '#00F5D4' },
  epic: { label: 'epic', color: '#FF2A85' },
  legendary: { label: 'legendary', color: '#FFB800' },
};

export function LockerScreen() {
  const { equipped, equip, profile, toast } = useAppState();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('frames');

  const items = COSMETICS.filter((c) => c.kind === tab);
  const equippedId =
    tab === 'frames'
      ? profile.frameId
      : tab === 'nameplates'
        ? profile.nameplateId
        : profile.themeId;

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <IdentityCapsule />

        <div className="mt-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">
              Locker
            </h1>
            <p className="mt-1.5 text-[12.5px] text-faint">
              Cosmetics only · nothing here changes gameplay
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-amber" />
            <span className="tnum font-mono text-[11px] text-amber">340</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex rounded-full border border-line bg-surface/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'press flex-1 rounded-full px-2 py-1.5 text-[11.5px] font-medium transition-colors',
                tab === t.id ? 'bg-white/8 text-ink' : 'text-faint',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Preview of equipped */}
        <div className="surface-card mt-3 flex items-center gap-3 p-3.5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background:
                tab === 'frames'
                  ? COSMETICS.find((c) => c.id === equippedId)?.preview
                  : 'linear-gradient(135deg,#1A1F2B,#0A0C12)',
            }}
          >
            <span className="font-display text-lg font-semibold text-ink/80">
              {profile.handle.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="label-mono">equipped</p>
            <p className="mt-1 truncate text-[13px] font-semibold text-ink">
              {COSMETICS.find((c) => c.id === equippedId)?.name ?? 'Graphite'}
            </p>
            <p className="mt-0.5 text-[10.5px] text-faint">
              {profile.handle} · {tab === 'themes' ? 'arena theme' : tab}
            </p>
          </div>
          <Check className="h-4 w-4 shrink-0 text-cyan" />
        </div>

        {/* Grid */}
        <div className="mt-5">
          <SectionHeader
            title={TABS.find((t) => t.id === tab)?.label ?? ''}
            subtitle={`${items.filter((i) => i.owned || equipped[i.kind === 'frames' ? 'frames' : i.kind === 'nameplates' ? 'nameplates' : 'themes']?.includes(i.id)).length} owned`}
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2.5"
          >
            {items.map((item) => {
              const owned = item.owned || equipped[item.kind].includes(item.id);
              const isEquipped = equippedId === item.id;
              const rarity = RARITY_STYLES[item.rarity];
              return (
                <motion.div
                  key={item.id}
                  variants={cardRise}
                  className={cn(
                    'surface-card overflow-hidden',
                    isEquipped && 'border-cyan-line/50',
                  )}
                >
                  <div
                    className="relative flex h-20 items-end justify-center"
                    style={{ background: item.preview }}
                  >
                    <div className="absolute inset-0 bg-black/25" />
                    {!owned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
                        <Lock className="h-4 w-4 text-white/70" />
                      </div>
                    )}
                    {isEquipped && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan text-[#04120F]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className="relative mb-2 rounded-full px-2 py-[2px] font-mono text-[8px] uppercase tracking-[0.12em]"
                      style={{
                        background: 'rgba(9,10,15,0.7)',
                        color: rarity.color,
                      }}
                    >
                      {rarity.label}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[12px] font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-faint">
                      {owned ? 'Owned' : item.requirement}
                    </p>
                    <button
                      disabled={!owned}
                      onClick={() => {
                        equip(item.kind, item.id);
                        sfx.play('lock');
                        haptics.fire('light');
                        toast({
                          title: `${item.name} equipped`,
                          message: 'Cosmetic only — no gameplay effect.',
                          tone: 'success',
                        });
                      }}
                      className={cn(
                        'press mt-2 flex h-8 w-full items-center justify-center rounded-full text-[11px] font-medium',
                        isEquipped
                          ? 'bg-cyan/12 text-cyan'
                          : owned
                            ? 'bg-white/8 text-ink'
                            : 'bg-white/4 text-faint',
                      )}
                    >
                      {isEquipped ? 'Equipped' : owned ? 'Equip' : 'Locked'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-surface/50 p-3.5">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
          <p className="text-[11px] leading-relaxed text-faint">
            <span className="text-muted">No pay-to-win. </span>
            Cosmetics never buy extra time, better questions, score multipliers
            or rating points.
          </p>
        </div>
      </Page>
    </div>
  );
}