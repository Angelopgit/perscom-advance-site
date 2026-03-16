import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
  Sequence,
} from 'remotion';

// ─── Design tokens ───────────────────────────────────────────────────────────
const BG = '#06091a';
const ACCENT = '#3b82f6';
const TEXT = '#dbeafe';
const TEXT_DIM = '#93c5fd';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const SANS = '"Inter", "Segoe UI", Arial, sans-serif';

// ─── Grid background ─────────────────────────────────────────────────────────
const GridBackground: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const lines: React.ReactNode[] = [];
  const cols = 20;
  const rows = 12;
  for (let i = 0; i <= cols; i++) {
    lines.push(
      <line
        key={`v${i}`}
        x1={`${(i / cols) * 100}%`}
        y1="0"
        x2={`${(i / cols) * 100}%`}
        y2="100%"
        stroke={ACCENT}
        strokeOpacity="0.08"
        strokeWidth="1"
      />
    );
  }
  for (let i = 0; i <= rows; i++) {
    lines.push(
      <line
        key={`h${i}`}
        x1="0"
        y1={`${(i / rows) * 100}%`}
        x2="100%"
        y2={`${(i / rows) * 100}%`}
        stroke={ACCENT}
        strokeOpacity="0.08"
        strokeWidth="1"
      />
    );
  }
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
      }}
    >
      {lines}
    </svg>
  );
};

// ─── Glow circle helper ───────────────────────────────────────────────────────
const GlowCircle: React.FC<{
  x: number;
  y: number;
  r: number;
  opacity?: number;
}> = ({x, y, r, opacity = 0.18}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`,
      opacity,
      pointerEvents: 'none',
    }}
  />
);

// ─── Scene 1: Logo (0–90f) ────────────────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 14, stiffness: 80}, from: 0.6, to: 1});
  const opacity = interpolate(frame, [0, 25], [0, 1], {extrapolateRight: 'clamp'});
  const glowOpacity = interpolate(frame, [20, 70], [0, 0.28], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [65, 90], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: fadeOut}}>
      <GridBackground opacity={0.6} />
      <GlowCircle x={640} y={360} r={340} opacity={glowOpacity} />

      <div style={{opacity, transform: `scale(${scale})`, textAlign: 'center', position: 'relative', zIndex: 10}}>
        {/* Pentagon-style emblem */}
        <div style={{marginBottom: 24, display: 'flex', justifyContent: 'center'}}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <polygon
              points="36,4 68,26 56,62 16,62 4,26"
              fill="none"
              stroke={ACCENT}
              strokeWidth="2.5"
            />
            <polygon
              points="36,14 58,30 50,54 22,54 14,30"
              fill={ACCENT}
              opacity="0.15"
            />
            <text
              x="36"
              y="40"
              textAnchor="middle"
              fill={ACCENT}
              fontSize="20"
              fontFamily={MONO}
              fontWeight="700"
            >
              P
            </text>
          </svg>
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontSize: 52,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow: `0 0 40px ${ACCENT}88`,
          }}
        >
          PERSCOM
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 22,
            fontWeight: 300,
            color: ACCENT,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          ADVANCE
        </div>
        <div
          style={{
            marginTop: 16,
            width: 180,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
            margin: '16px auto 0',
          }}
        />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_DIM,
            letterSpacing: '0.3em',
            marginTop: 12,
            textTransform: 'uppercase',
          }}
        >
          Military Personnel Management
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Feature tiles (90–210f) ────────────────────────────────────────
interface TileProps {
  icon: string;
  title: string;
  subtitle: string;
  delay: number;
  frame: number;
  fps: number;
}

const FeatureTile: React.FC<TileProps> = ({icon, title, subtitle, delay, frame, fps}) => {
  const localFrame = Math.max(0, frame - delay);
  const translateY = spring({
    frame: localFrame,
    fps,
    config: {damping: 16, stiffness: 100},
    from: 80,
    to: 0,
  });
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: `linear-gradient(135deg, #0d1530 0%, #0a1020 100%)`,
        border: `1px solid ${ACCENT}44`,
        borderRadius: 12,
        padding: '28px 24px',
        width: 280,
        boxShadow: `0 0 30px ${ACCENT}22, inset 0 1px 0 ${ACCENT}22`,
        textAlign: 'center',
      }}
    >
      <div style={{fontSize: 36, marginBottom: 12}}>{icon}</div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 15,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '0.05em',
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 12,
          color: TEXT_DIM,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          marginTop: 16,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT}88, transparent)`,
          borderRadius: 1,
        }}
      />
    </div>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [95, 120], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const tiles = [
    {icon: '👥', title: 'Personnel Roster', subtitle: 'Full unit management with rank tracking and assignment history', delay: 5},
    {icon: '🎯', title: 'Operations Tracking', subtitle: 'Monitor mission readiness, attendance, and operational status', delay: 20},
    {icon: '⚡', title: 'Discord Integration', subtitle: 'Seamlessly sync with your Discord server and roles', delay: 35},
  ];

  return (
    <AbsoluteFill style={{background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeOut}}>
      <GridBackground opacity={0.5} />
      <GlowCircle x={640} y={200} r={250} opacity={0.12} />

      <div
        style={{
          opacity: headerOpacity,
          fontFamily: SANS,
          fontSize: 13,
          color: ACCENT,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: 40,
          position: 'relative',
          zIndex: 10,
        }}
      >
        Core Features
      </div>

      <div
        style={{
          display: 'flex',
          gap: 24,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {tiles.map((t) => (
          <FeatureTile
            key={t.title}
            icon={t.icon}
            title={t.title}
            subtitle={t.subtitle}
            delay={t.delay}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Dashboard mockup (210–360f) ─────────────────────────────────────
const StatCard: React.FC<{value: string; label: string; color?: string}> = ({
  value,
  label,
  color = ACCENT,
}) => (
  <div
    style={{
      background: '#0a1020',
      border: `1px solid ${color}33`,
      borderRadius: 8,
      padding: '16px 20px',
      minWidth: 100,
      boxShadow: `0 0 20px ${color}11`,
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontSize: 28,
        fontWeight: 700,
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 11,
        color: TEXT_DIM,
        marginTop: 6,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

const RosterRow: React.FC<{name: string; rank: string; status: string; opacity: number}> = ({
  name,
  rank,
  status,
  opacity,
}) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${ACCENT}18`,
      gap: 16,
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontSize: 11,
        color: ACCENT,
        width: 60,
        letterSpacing: '0.05em',
      }}
    >
      {rank}
    </div>
    <div style={{fontFamily: SANS, fontSize: 13, color: TEXT, flex: 1}}>
      {name}
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 11,
        color: status === 'Active' ? '#4ade80' : TEXT_DIM,
        background: status === 'Active' ? '#4ade8022' : 'transparent',
        padding: '2px 8px',
        borderRadius: 4,
        border: `1px solid ${status === 'Active' ? '#4ade8044' : 'transparent'}`,
      }}
    >
      {status}
    </div>
  </div>
);

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideX = spring({frame, fps, config: {damping: 18, stiffness: 90}, from: 200, to: 0});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [125, 150], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const rows = [
    {name: 'Sgt. Marcus Reeves', rank: 'SGT', status: 'Active'},
    {name: 'Cpl. Diana Torres', rank: 'CPL', status: 'Active'},
    {name: 'Pvt. Nathan Cross', rank: 'PVT', status: 'Leave'},
    {name: 'Lt. Sarah Okafor', rank: 'LT', status: 'Active'},
    {name: 'Spc. James Holt', rank: 'SPC', status: 'Active'},
  ];

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <GridBackground opacity={0.4} />
      <GlowCircle x={900} y={360} r={300} opacity={0.14} />

      {/* Dashboard card */}
      <div
        style={{
          opacity,
          transform: `translateX(${slideX}px)`,
          background: 'linear-gradient(145deg, #0d1530 0%, #080d1e 100%)',
          border: `1px solid ${ACCENT}33`,
          borderRadius: 16,
          width: 860,
          padding: '0',
          boxShadow: `0 0 60px ${ACCENT}22, 0 20px 60px #00000066`,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: '#060914',
            borderBottom: `1px solid ${ACCENT}33`,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{width: 10, height: 10, borderRadius: '50%', background: '#ff5f57'}} />
          <div style={{width: 10, height: 10, borderRadius: '50%', background: '#febc2e'}} />
          <div style={{width: 10, height: 10, borderRadius: '50%', background: '#28c840'}} />
          <div
            style={{
              marginLeft: 16,
              fontFamily: MONO,
              fontSize: 12,
              color: TEXT_DIM,
              letterSpacing: '0.05em',
            }}
          >
            PERSCOM Advance — Unit Dashboard
          </div>
        </div>

        <div style={{padding: '20px 24px'}}>
          {/* Stat cards row */}
          <div style={{display: 'flex', gap: 16, marginBottom: 24}}>
            <StatCard value="24" label="Active Personnel" color={ACCENT} />
            <StatCard value="87%" label="Attendance Rate" color="#a78bfa" />
            <StatCard value="12" label="Ops This Month" color="#34d399" />
            <StatCard value="3" label="Pending Awards" color="#fb923c" />
          </div>

          {/* Roster section */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: ACCENT,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Personnel Roster
          </div>

          {rows.map((row, i) => (
            <RosterRow
              key={row.name}
              name={row.name}
              rank={row.rank}
              status={row.status}
              opacity={interpolate(frame, [10 + i * 8, 30 + i * 8], [0, 1], {extrapolateRight: 'clamp'})}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Tagline (360–480f) ─────────────────────────────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wordSpring = (delay: number) =>
    spring({frame: Math.max(0, frame - delay), fps, config: {damping: 14, stiffness: 80}, from: 0, to: 1});

  const opacity1 = wordSpring(0);
  const opacity2 = wordSpring(18);
  const underlineWidth = interpolate(frame, [40, 90], [0, 260], {extrapolateRight: 'clamp'});
  const subOpacity = interpolate(frame, [55, 80], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [95, 120], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <GridBackground opacity={0.45} />
      <GlowCircle x={640} y={360} r={380} opacity={0.16} />

      <div style={{textAlign: 'center', position: 'relative', zIndex: 10}}>
        <div
          style={{
            display: 'flex',
            gap: 18,
            justifyContent: 'center',
            alignItems: 'baseline',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 56,
              fontWeight: 700,
              color: TEXT,
              opacity: opacity1,
              transform: `translateY(${interpolate(opacity1, [0, 1], [30, 0])}px)`,
              display: 'inline-block',
            }}
          >
            Self-Hosted.
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 56,
              fontWeight: 700,
              color: ACCENT,
              opacity: opacity2,
              transform: `translateY(${interpolate(opacity2, [0, 1], [30, 0])}px)`,
              display: 'inline-block',
              textShadow: `0 0 40px ${ACCENT}88`,
            }}
          >
            Fully Yours.
          </span>
        </div>

        {/* Accent underline */}
        <div
          style={{
            margin: '12px auto 0',
            height: 3,
            width: underlineWidth,
            background: `linear-gradient(90deg, ${ACCENT}, #7c3aed)`,
            borderRadius: 2,
            boxShadow: `0 0 16px ${ACCENT}88`,
          }}
        />

        <div
          style={{
            marginTop: 28,
            fontFamily: SANS,
            fontSize: 16,
            color: TEXT_DIM,
            letterSpacing: '0.06em',
            opacity: subOpacity,
            maxWidth: 580,
            lineHeight: 1.6,
          }}
        >
          Own your data. Deploy on your servers. Run your unit your way.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA (480–600f) ─────────────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 16, stiffness: 80}, from: 0.85, to: 1});
  const opacity = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  const glowPulse = Math.sin((frame / 30) * Math.PI * 1.2) * 0.08 + 0.22;
  const fadeOut = interpolate(frame, [100, 120], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const urlOpacity = interpolate(frame, [20, 50], [0, 1], {extrapolateRight: 'clamp'});
  const ctaOpacity = interpolate(frame, [40, 70], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <GridBackground opacity={0.5} />
      <GlowCircle x={640} y={360} r={400} opacity={glowPulse} />
      <GlowCircle x={640} y={360} r={200} opacity={glowPulse * 0.6} />

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}55`,
            borderRadius: 20,
            padding: '6px 18px',
            fontFamily: MONO,
            fontSize: 11,
            color: ACCENT,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Get Started Today
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontFamily: MONO,
            fontSize: 48,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '0.04em',
            textShadow: `0 0 60px ${ACCENT}66`,
          }}
        >
          perscomadvance.com
        </div>

        {/* Glow underline */}
        <div
          style={{
            margin: '10px auto 0',
            height: 3,
            width: 480,
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
            boxShadow: `0 0 20px ${ACCENT}`,
            borderRadius: 2,
          }}
        />

        {/* CTA sub-text */}
        <div
          style={{
            opacity: ctaOpacity,
            marginTop: 28,
            fontFamily: SANS,
            fontSize: 15,
            color: TEXT_DIM,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Open Source · Self-Hosted · Discord Native
        </div>

        {/* Emblem small */}
        <div
          style={{
            marginTop: 36,
            opacity: ctaOpacity,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 72 72">
            <polygon
              points="36,4 68,26 56,62 16,62 4,26"
              fill="none"
              stroke={ACCENT}
              strokeWidth="2.5"
              opacity="0.7"
            />
            <text
              x="36"
              y="40"
              textAnchor="middle"
              fill={ACCENT}
              fontSize="20"
              fontFamily={MONO}
              fontWeight="700"
            >
              P
            </text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const PerscomVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: BG}}>
      {/* Scene 1: Logo 0-90 */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Features 90-210 */}
      <Sequence from={90} durationInFrames={120}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Dashboard 210-360 */}
      <Sequence from={210} durationInFrames={150}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Tagline 360-480 */}
      <Sequence from={360} durationInFrames={120}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: CTA 480-600 */}
      <Sequence from={480} durationInFrames={120}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
