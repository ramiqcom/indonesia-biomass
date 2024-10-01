import lcData, { biom_palette, label, palette } from '@/data/lc.json';
import { Context } from '@/module/store';
import { useContext } from 'react';

export default function Legend() {
  const { layer, lcId } = useContext(Context);

  let legend: JSX.Element;

  switch (layer.value) {
    case lcId: {
      const lcs = palette.map((color, index) => {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '2vh',
              height: '3vh',
              width: '100%',
              fontSize: 'small',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '15%',
                height: '100%',
                border: 'thin solid white',
                backgroundColor: `#${color}`,
              }}
            />
            <div style={{ width: '75%' }}>{label[index]}</div>
          </div>
        );
      });

      const lcLegend = (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5vh',
            height: '30vh',
            overflowY: 'auto',
            padding: '1vh',
          }}
        >
          {lcs}
        </div>
      );

      legend = lcLegend;
      break;
    }
    default: {
      legend = (
        <div
          style={{
            display: 'flex',
            gap: '1vh',
            padding: '1vh',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 'small',
            width: '100%',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div>AGB</div>
            <div>(C Ton/Ha)</div>
          </div>
          {lcData[`${layer.value}_vis`].max}
          <div
            style={{
              height: '20vh',
              border: 'thin solid white',
              width: '80%',
              backgroundImage: `linear-gradient(to top, ${biom_palette.join(', ')})`,
            }}
          />
          {lcData[`${layer.value}_vis`].min}
        </div>
      );
      break;
    }
  }

  return (
    <div style={{ position: 'absolute', top: '2vh', left: '2vh', zIndex: 9999999 }}>
      <div
        style={{
          backgroundColor: 'rgb(19, 19, 19)',
          padding: '1vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1vh',
        }}
      >
        <div style={{ fontSize: 'medium' }}>Legend</div>
        {legend}
      </div>
    </div>
  );
}
