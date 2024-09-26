'use server';

import { agb_mean, agb_se, agb_vis, biom_palette, label, palette, values } from '@/data/lc.json';
import ee from '@google/earthengine';
import { authenticate, evaluate, getMapId } from './ee';

export async function getLayer(year: number) {
  await authenticate();

  const lc = lcImage(year);
  const agb: ee.Image = lc.remap(values, agb_mean).rename('AGB');

  const [lcData, agbData] = await Promise.all([
    getMapId(lc, {}),
    getMapId(agb, { ...agb_vis, palette: biom_palette }),
  ]);

  return { lc: lcData.urlFormat, agb: agbData.urlFormat };
}

function lcImage(year: number) {
  return ee.Image(`${process.env.LC_COLLECTION}/LC_Raster_${year}`).set({
    lc_class_values: values,
    lc_class_palette: palette,
  }) as ee.Image;
}

export async function identify(year: number, coords: number[]) {
  await authenticate();
  const lc = lcImage(year);
  const geom: ee.Geometry = ee.Geometry.Point(coords);
  const value: ee.Number = ee.Number(
    lc
      .reduceRegion({
        geometry: geom,
        scale: 30,
        reducer: ee.Reducer.first(),
        maxPixels: 1e13,
      })
      .get('lc'),
  );
  const evaluated: number = await evaluate(value);

  const output = values
    .map((value, index) => {
      return value == evaluated
        ? {
            landcover: label[index],
            agbMin: Math.round((agb_mean[index] - agb_se[index]) * 100) / 100,
            agbMax: Math.round((agb_mean[index] + agb_se[index]) * 100) / 100,
          }
        : null;
    })
    .filter((x) => x)[0];

  return output;
}
