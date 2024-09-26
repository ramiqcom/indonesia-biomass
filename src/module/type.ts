import { Map } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';

export type VisObject = {
  bands?: Array<string>;
  min?: Array<number>;
  max?: Array<number>;
  palette?: Array<string>;
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
  firstUrl: string;
  urlDict: Record<string, string>;
  setUrlDict: SetState<Record<string, string>>;
  lcId: string;
  year: Option;
  setYear: SetState<Option>;
  years: Options;
  setYears: SetState<Options>;
  map: Map;
  setMap: SetState<Map>;
  status: Status;
  setStatus: SetState<Status>;
};
