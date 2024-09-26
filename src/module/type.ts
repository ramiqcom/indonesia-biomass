import { Map } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';

export type VisObject = {
  bands?: Array<string> | string;
  min?: Array<number> | number;
  max?: Array<number> | number;
  palette?: Array<string> | string;
};

export type MapId = {
  mapid: string;
  urlFormat: string;
  image: Record<string, any>;
};

export type Status = {
  message: string;
  type: 'process' | 'failed' | 'success';
};

export type Option = { label: string; value: any };

export type Options = Array<Option>;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type GlobalContext = {
  firstUrlDict: Urls;
  urlDict: Record<string, Urls>;
  setUrlDict: SetState<Record<string, Urls>>;
  lcId: string;
  agbId: string;
  year: Option;
  setYear: SetState<Option>;
  years: Options;
  setYears: SetState<Options>;
  map: Map;
  setMap: SetState<Map>;
  status: Status;
  setStatus: SetState<Status>;
  layers: Options;
  layer: Option;
  setLayer: SetState<Option>;
};

export type Urls = {
  lc: string;
  agb: string;
};
