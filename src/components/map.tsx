import { identify } from '@/module/layer';
import { Context } from '@/module/store';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect } from 'react';

export default function MapCanvas() {
  const { firstUrlDict, setMap, lcId, agbId, setStatus, year, layer } = useContext(Context);

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
              tiles: [firstUrlDict.lc],
              tileSize: 256,
            },
            [agbId]: {
              type: 'raster',
              tiles: [firstUrlDict.agb],
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
              layout: {
                visibility: layer.value == lcId ? 'visible' : 'none',
              },
            },
            {
              id: agbId,
              source: agbId,
              type: 'raster',
              layout: {
                visibility: layer.value == agbId ? 'visible' : 'none',
              },
            },
          ],
        },
      });
      setMap(map);

      map.on('click', async (e) => {
        try {
          setStatus({ type: 'process', message: 'Identify...' });
          const coords = e.lngLat.toArray();
          const { landcover, agbMin, agbMax } = await identify(year.value, coords);
          const message = `Land cover: ${landcover}\nAGB: ${agbMin} - ${agbMax}`;
          setStatus({ type: 'success', message });
        } catch ({ message }) {
          setStatus({ type: 'failed', message });
        }
      });

      setStatus({ type: 'success', message: 'Map loaded' });
    } catch ({ message }) {
      setStatus({ type: 'failed', message });
    }
  }, []);

  return <div id={divId} style={{ width: '100%', height: '100%' }}></div>;
}
