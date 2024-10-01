import { agb_mean, agb_se, bgb_mean, bgb_se, label, palette, values } from '@/data/lc.json';

export const valuesDict: {
  palette: string;
  label: string;
  agb_mean: number;
  agb_se: number;
  bgb_mean: number;
  bgb_se: number;
  value: number;
}[] = [];

values.map((value, index) => {
  valuesDict[value] = {
    value,
    palette: palette[index],
    label: label[index],
    agb_mean: agb_mean[index],
    agb_se: agb_se[index],
    bgb_mean: bgb_mean[index],
    bgb_se: bgb_se[index],
  };
});
