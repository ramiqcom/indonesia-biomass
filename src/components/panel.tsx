import { getLayer } from '@/module/layer';
import { Context } from '@/module/store';
import { Urls } from '@/module/type';
import { RasterTileSource } from 'maplibre-gl';
import { useContext } from 'react';
import Analysis from './analysis';
import { Select } from './input';
import Legend from './legend';

export default function Panel() {
  const { status } = useContext(Context);

  return (
    <div
      style={{
        width: '25%',
        maxHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: '2vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1vh',
          textAlign: 'center',
        }}
      >
        <YearsSelect />
        <LayerSelect />
        <Legend />
        <Analysis />
        {status.message}
      </div>
    </div>
  );
}

function LayerSelect() {
  const { status, layers, layer, setLayer, map } = useContext(Context);
  return (
    <Select
      options={layers}
      value={layer}
      onChange={(value) => {
        setLayer(value);

        layers.map((dict) => {
          map.setLayoutProperty(
            dict.value,
            'visibility',
            dict.value == value.value ? 'visible' : 'none',
          );
        });
      }}
      disabled={status.type == 'failed'}
    />
  );
}

function YearsSelect() {
  const { years, year, setYear, map, lcId, agbId, status, setStatus, urlDict, setUrlDict } =
    useContext(Context);
  return (
    <Select
      options={years}
      value={year}
      disabled={status.type == 'failed'}
      onChange={async (value) => {
        try {
          setStatus({ type: 'process', message: 'Loading data...' });
          setYear(value);

          let urls: Urls;
          if (urlDict[String(value.value)]) {
            urls = urlDict[String(value.value)];
          } else {
            urls = await getLayer(value.value);
            urlDict[String(value.value)] = urls;
            setUrlDict(urlDict);
          }

          const lcSource = map.getSource(lcId) as RasterTileSource;
          lcSource.setTiles([urls.lc]);

          const agbSource = map.getSource(agbId) as RasterTileSource;
          agbSource.setTiles([urls.agb]);
          setStatus({ type: 'success', message: 'Data loaded' });
        } catch ({ message }) {
          setStatus({ type: 'failed', message });
        }
      }}
    />
  );
}
