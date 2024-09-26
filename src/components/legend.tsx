import { label, palette } from '@/data/lc.json';

export default function Legend() {
  const legend = palette.map((color, index) => {
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          gap: '1vh',
          height: '1.5vh',
          fontSize: 'x-small',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '10%',
            height: '100%',
            border: 'thin solid white',
            backgroundColor: `#${color}`,
          }}
        />
        {label[index]}
      </div>
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5vh',
        height: '30vh',
        overflowY: 'auto',
				border: 'thin solid white',
				padding: '1vh'
      }}
    >
      {legend}
    </div>
  );
}
