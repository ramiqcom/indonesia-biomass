import { Context } from '@/module/store';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect } from 'react';

export default function MapCanvas() {
  const { firstUrl, setMap, lcId, setStatus } = useContext(Context);

  const divId = 'map';

  useEffect(() => {
    try {
      setStatus({ type: 'process', message: 'Loading map...' });
      const map = new Map({
        container: divId,
        zoom: 4,
        center: [117, 0],
        minZoom: 3,
        maxZoom: 15,
        style: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: ['https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'],
              tileSize: 256,
            },
            [lcId]: {
              type: 'raster',
              tiles: [firstUrl],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'basemap',
              source: 'basemap',
              type: 'raster',
            },
            {
              id: lcId,
              source: lcId,
              type: 'raster',
            },
          ],
        },
      });
      setMap(map);
      setStatus({ type: 'success', message: 'Map loaded' });
    } catch ({ message }) {
      setStatus({ type: 'failed', message });
    }
  }, []);

  return <div id={divId} style={{ width: '100%', height: '100%' }}></div>;
}
