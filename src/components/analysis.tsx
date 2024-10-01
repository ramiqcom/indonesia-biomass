import { loadGeojson } from '@/module/geo';
import { calculateMultitemporal } from '@/module/layer';
import { Context } from '@/module/store';
import { bbox, dissolve, flatten } from '@turf/turf';
import { FeatureCollection, Polygon } from 'geojson';
import { GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import { useContext, useState } from 'react';

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
        <Chart />
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

function Chart() {
  const { geojson } = useContext(Context);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        disabled={geojson ? false : true}
        onClick={async () => {
          const bounds = bbox(geojson);
          const dissolved = dissolve(flatten(geojson as FeatureCollection<Polygon>));
          const result = await calculateMultitemporal(dissolved, bounds);
          console.log(result);
        }}
      >
        Calculate
      </button>
    </div>
  );
}
