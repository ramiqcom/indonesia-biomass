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

      const lcLegend = (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5vh',
            height: '30vh',
            overflowY: 'auto',
            border: 'thin solid white',
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
            justifyContent: 'center',
            alignItems: 'center',
            height: '5vh',
            fontSize: 'x-small',
            width: '100%'
          }}
        >
          {lcData[`${layer.value}_vis`].min}
          <div
            style={{
              height: '50%',
              border: 'thin solid white',
              width: '80%',
              backgroundImage: `linear-gradient(to right, ${biom_palette.join(', ')})`,
            }}
          />
          {lcData[`${layer.value}_vis`].max}
        </div>
      );
      break;
    }
  }

  return legend;
}
