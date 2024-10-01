import { getLayer } from '@/module/layer';
import { Context } from '@/module/store';
import { Urls } from '@/module/type';
import { RasterTileSource } from 'maplibre-gl';
import { useContext } from 'react';
import Analysis from './analysis';
import { Select } from './input';

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
        <div style={{ fontSize: 'x-large' }}>Indonesian Land Cover Analysis Platform</div>
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '0.1px',
            marginTop: '2vh',
            marginBottom: '2vh',
          }}
        />

        <YearsSelect />
        <LayerSelect />

        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '0.1px',
            marginTop: '2vh',
            marginBottom: '2vh',
          }}
        />

        <Analysis />

        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '0.1px',
            marginTop: '2vh',
            marginBottom: '2vh',
          }}
        />

        <div
          style={{
            fontWeight: 'bold',
            color:
              status.type == 'process'
                ? 'lightskyblue'
                : status.type == 'success'
                  ? 'lightgreen'
                  : 'lightcoral',
          }}
        >
          {status.message}
        </div>

        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '0.1px',
            marginTop: '2vh',
            marginBottom: '2vh',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          Created by Ramadhan
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1vh' }}>
            <a
              style={{ color: 'lightskyblue', fontWeight: 'bold' }}
              target='_blank'
              href='https://linkedin.com/in/ramiqcom'
            >
              LinkedIn
            </a>
            <a
              style={{ color: 'lightskyblue', fontWeight: 'bold' }}
              target='_blank'
              href='https://github/ramiqcom'
            >
              GitHub
            </a>
            <a
              style={{ color: 'lightskyblue', fontWeight: 'bold' }}
              target='_blank'
              href='https://youtube.com/@ramiqcom'
            >
              YouTube
            </a>
            <a
              style={{ color: 'lightskyblue', fontWeight: 'bold' }}
              target='_blank'
              href='mailto:ramiqcom@gmail.com'
            >
              Email
            </a>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '0.1px',
            marginTop: '2vh',
            marginBottom: '2vh',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {'Data Source'}
          <a
            href='https://sigap.menlhk.go.id/'
            style={{ color: 'lightskyblue', fontWeight: 'bold' }}
            target='_blank'
          >
            Ministry of Forestry and Life Environment of Republic of Indonesia
          </a>
        </div>
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
      disabled={status.type == 'process'}
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
      disabled={status.type == 'process'}
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
