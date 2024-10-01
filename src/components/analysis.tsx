import { label, palette, values } from '@/data/lc.json';
import { valuesDict } from '@/module/dict';
import { loadGeojson } from '@/module/geo';
import { calculateMultitemporal } from '@/module/layer';
import { Context } from '@/module/store';
import { bbox, dissolve, flatten } from '@turf/turf';
import { FeatureCollection, Polygon } from 'geojson';
import { GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import { useContext, useState } from 'react';
import Chart from 'react-google-charts';

export default function Analysis() {
  const [hide, setHide] = useState(false);
  return (
    <div
      style={{
        flexDirection: 'column',
        gap: '1vh',
        display: 'flex',
      }}
    >
      <button onClick={() => setHide(!hide)}>Analysis</button>
      <div style={{ display: hide ? 'none' : 'flex', flexDirection: 'column', gap: '1vh' }}>
        <Upload />
        <ChartCanvas />
      </div>
    </div>
  );
}

function Upload() {
  const { setStatus, setGeojson, map, roiId } = useContext(Context);
  return (
    <div
      style={{
        flexDirection: 'column',
        gap: '1vh',
        textAlign: 'left',
        display: 'flex',
      }}
    >
      <div
        style={{
          fontSize: 'small',
        }}
      >
        Upload shapefile (zip), geojson, or kml
      </div>
      <input
        type='file'
        accept='.zip,.kml,.kmz,.geojson,.json'
        onChange={async (e) => {
          try {
            setStatus({ type: 'process', message: 'Processing region...' });
            const file = e.target.files[0];
            const geojson = await loadGeojson(file);
            setGeojson(geojson);

            if (map.getSource(roiId)) {
              const source = map.getSource(roiId) as GeoJSONSource;
              source.setData(geojson);
            } else {
              map.addSource(roiId, {
                type: 'geojson',
                data: geojson,
              });
              map.addLayer({
                type: 'line',
                source: roiId,
                id: roiId,
                paint: {
                  'line-color': 'navy',
                  'line-width': 3,
                },
              });
            }

            const bounds = bbox(geojson);
            map.fitBounds(bounds as LngLatBoundsLike, { padding: 100 });

            setStatus({ type: 'success', message: 'Region loaded' });
          } catch ({ message }) {
            setGeojson(undefined);
            setStatus({ type: 'failed', message });
          }
        }}
      />
    </div>
  );
}

function ChartCanvas() {
  const { geojson, setStatus, status, years } = useContext(Context);

  const [data, setData] = useState<any[][]>();
  const [agbData, setAgbData] = useState<any[][]>();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2vh',
      }}
    >
      <button
        disabled={geojson && status.type !== 'process' ? false : true}
        onClick={async () => {
          try {
            setStatus({ message: 'Calculating...', type: 'process' });
            const bounds = bbox(geojson);
            const dissolved = dissolve(flatten(geojson as FeatureCollection<Polygon>));
            const result = await calculateMultitemporal(dissolved, bounds);
            const data = result.map((dict) => {
              const { area, lc } = dict;
              const { agb_mean, agb_se, bgb_mean, bgb_se, label } = valuesDict[lc];
              const agb_mean_total = area * agb_mean;
              const agb_se_total = area * agb_se;
              const bgb_mean_total = area * bgb_mean;
              const bgb_se_total = area * bgb_se;
              const agb_min = Math.round(agb_mean_total - agb_se_total);
              const agb_max = Math.round(agb_mean_total + agb_se_total);
              const bgb_min = Math.round(bgb_mean_total - bgb_se_total);
              const bgb_max = Math.round(bgb_mean_total + bgb_se_total);
              return { agb_max, agb_min, bgb_min, bgb_max, label, ...dict };
            });

            // AGB data
            const dataAgb = years.map((year) => {
              const dataYear = data.filter((x) => year.value == x.year);
              const sumHigh = dataYear.reduce((x, y) => x + y.agb_max, 0);
              const sumLow = dataYear.reduce((x, y) => x + y.agb_min, 0);
              return [String(year.value), sumLow, sumHigh];
            });
            const agbLabel = ['AGB', 'Low', 'High'];
            setAgbData([agbLabel, ...dataAgb]);

            // Land cover data
            const dataYears = years.map((dict) => {
              const { value: year } = dict;
              const dataYear = data.filter((x) => x.year == year);
              const dataPerLc = values.map((value) => {
                const dataLc = dataYear.filter((x) => x.lc == value)[0]?.area || 0;
                return dataLc;
              });
              return [String(year), ...dataPerLc];
            });
            const labelData = ['Land cover', ...label];
            const combined = [labelData, ...dataYears];
            setData(combined);

            setStatus({ message: 'Calculated', type: 'success' });
          } catch ({ message }) {
            setStatus({ message, type: 'failed' });
          }
        }}
      >
        Calculate
      </button>

      <div style={{ display: data ? 'flex' : 'none', flexDirection: 'column', gap: '2vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
          <Chart
            chartType='ColumnChart'
            data={data}
            width={'100%'}
            height={'20vh'}
            options={{
              title: 'Land cover area (Ha)',
              hAxis: {
                title: 'Year',
              },
              vAxis: {
                title: 'Area (Ha)',
              },
              legend: {
                position: 'none',
              },
              isStacked: true,
              colors: palette,
            }}
          />
          <a
            href={`data:text/csv;charset=utf-8,${data?.map((x) => x.join(', ')).join('\n')}`}
            download={'LC.csv'}
          >
            <button>Download LC Data</button>
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
          <Chart
            chartType='ColumnChart'
            data={agbData}
            width={'100%'}
            height={'20vh'}
            options={{
              title: 'AGB (C Ton)',
              hAxis: {
                title: 'Year',
              },
              vAxis: {
                title: 'AGB (C Ton)',
              },
              legend: {
                position: 'top',
              },
              colors: ['lightgreen', 'darkgreen'],
            }}
          />
          <a
            href={`data:text/csv;charset=utf-8,${agbData?.map((x) => x.join(', ')).join('\n')}`}
            download={'AGB.csv'}
          >
            <button>Download AGB Data</button>
          </a>
        </div>
      </div>
    </div>
  );
}
