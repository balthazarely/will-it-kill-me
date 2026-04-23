interface ScanCornersProps {
  color?: string;
  size?: number;
  thickness?: number;
}

export default function ScanCorners({
  color = 'rgba(255,255,255,0.7)',
  size = 24,
  thickness = 2.5
}: ScanCornersProps) {
  const s = thickness;
  const cornerStyle: React.CSSProperties = { position: 'absolute', width: size, height: size };

  return (
    <>
      {/* top-left */}
      <div style={{ ...cornerStyle, top: 0, left: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: size, height: s, background: color, borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: s, height: size, background: color, borderRadius: 1 }} />
      </div>
      {/* top-right */}
      <div style={{ ...cornerStyle, top: 0, right: 0 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: size, height: s, background: color, borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: s, height: size, background: color, borderRadius: 1 }} />
      </div>
      {/* bottom-left */}
      <div style={{ ...cornerStyle, bottom: 0, left: 0 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: size, height: s, background: color, borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: s, height: size, background: color, borderRadius: 1 }} />
      </div>
      {/* bottom-right */}
      <div style={{ ...cornerStyle, bottom: 0, right: 0 }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: size, height: s, background: color, borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: s, height: size, background: color, borderRadius: 1 }} />
      </div>
    </>
  );
}
