export default function Geel({ size = 120, expression = 'happy', style: extraStyle = {} }) {
  let className = 'select-none';
  if (expression === 'encouraging') className += ' mascot-encouraging';
  if (expression === 'celebrating') className += ' animate-celebrate';

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          overflow: 'hidden',
          flexShrink: 0,
          ...extraStyle,
        }}
      >
        <img
          src="/branding/geel-head-color.png"
          alt="Geel"
          draggable={false}
          style={{
            width: size + 4,
            height: size + 4,
            margin: -2,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
