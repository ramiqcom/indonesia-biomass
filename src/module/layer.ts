'use server';

import { palette, values } from '@/data/lc.json';
import ee from '@google/earthengine';
import { authenticate, getMapId } from './ee';

export async function lcLayer(year: number) {
  await authenticate();

  const lc = ee.Image(`${process.env.LC_COLLECTION}/LC_Raster_${year}`).set({
    lc_class_values: values,
    lc_class_palette: palette,
  });

  const { urlFormat } = await getMapId(lc, {});

  return urlFormat;
}
