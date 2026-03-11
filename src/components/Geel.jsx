export default function Geel({ size = 120, expression = 'happy', style: extraStyle = {} }) {
  let className = 'select-none';
  if (expression === 'encouraging') className += ' mascot-encouraging';
  if (expression === 'celebrating') className += ' animate-celebrate';

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src="/mascot/geel-happy.png"
        alt="Geel"
        draggable={false}
        className={className}
        style={{ width: size, height: 'auto', ...extraStyle }}
      />
    </div>
  );
}
