'use server';

import { agb_mean, agb_se, agb_vis, biom_palette, label, palette, values } from '@/data/lc.json';
import ee from '@google/earthengine';
import { BBox, FeatureCollection } from 'geojson';
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

export async function calculateMultitemporal(geojson: FeatureCollection<any>, bounds: BBox) {
  await authenticate();

  const area = ee.Image.pixelArea().divide(1e4);
  const col = ee.ImageCollection(process.env.LC_COLLECTION);

  const features = ee.FeatureCollection(geojson);
  const geometry = ee.Geometry.BBox(bounds[0], bounds[1], bounds[2], bounds[3]);

  const areaData = col
    .map((image) => {
      const stats = area
        .addBands(image)
        .clipToCollection(features)
        .reduceRegion({
          scale: 300,
          maxPixels: 1e13,
          geometry,
          reducer: ee.Reducer.sum().setOutputs(['area']).group(1, 'lc'),
        });

      const featureArea = ee.FeatureCollection(
        ee.List(stats.get('groups')).map((dict) =>
          ee.Feature(
            null,
            ee
              .Dictionary(dict)
              .set('year', image.get('year'))
              .set('area', ee.Number(ee.Dictionary(dict).get('area')).toInt()),
          ),
        ),
      );

      return featureArea;
    })
    .flatten();

  const listArea = areaData
    .toList(areaData.size())
    .map((feat) => ee.Feature(feat).toDictionary(['year', 'lc', 'area']));

  return await evaluate(listArea);
}
