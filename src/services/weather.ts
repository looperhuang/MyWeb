import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

const govapi = axios.create({
  baseURL: 'https://opendata.cwa.gov.tw/api',
});

const getTxgWeather = async () => {
  const config: AxiosRequestConfig = {
    url: 'v1/rest/datastore/F-D0047-075',
    params: {
      Authorization: process.env.GovAuth,
      limit: 10,
      offset: 0,
      format: 'JSON',
      locationName: '大甲區',
    },
  };
  const url = govapi.getUri(config);
  const res = await govapi.get<Weather>(url);
  return res.data;
};

const getWeatherDesc = async () => {
  const config: AxiosRequestConfig = {
    url: 'v1/rest/datastore/F-D0047-091',
    params: {
      Authorization: import.meta.env.VITE_APP_GOVKEY,
      elementName: 'WeatherDescription',
      format: 'JSON',
    },
  };
  const url = govapi.getUri(config);
  const res = await govapi.get<Weather>(url);
  return res.data;
};

const GetPre36hr = async () => {
  const config: AxiosRequestConfig = {
    url: 'v1/rest/datastore/F-C0032-001',
    params: {
      Authorization: import.meta.env.VITE_APP_GOVKEY,
      format: 'JSON',
      sort: 'time',
    },
  };
  const url = govapi.getUri(config);
  const res = await govapi.get<Pre36Res>(url);
  const data = res.data;
  if (!data.success) return null;
  return data.records;
};

export { getTxgWeather, getWeatherDesc, GetPre36hr };

export interface Weather {
  success: boolean;
  records: {
    locations: [
      {
        dataid: string;
        locationsName: string;
        datasetDescription: string;
        location: [
          {
            locationName: string;
            geocode: string;
            lat: number;
            lon: number;
            weatherElement: [
              {
                description: string;
                elementName: string;
                time: [
                  {
                    elementValue: [{ measures: string; value: number }];
                    endTime: Date;
                    startTime: Date;
                  }
                ];
              }
            ];
          }
        ];
      }
    ];
  };
}

export type Pre36Res = {
  success: boolean;
  result: Pre36Resource;
  records: Pre36Record;
};

export type Pre36Resource = {
  resource_id: string;
  filelds: [
    {
      id: string;
      type: string;
    }
  ];
};

export type Pre36Record = {
  datasetDescription: string;
  location: Pre36Location[];
};

export type Pre36Location = {
  locationName: string;
  weatherElement: Pre36Element[];
};

export type Pre36Element = {
  elementName: string;
  time: Pre36Time[];
};

export type Pre36Time = {
  startTime: Date;
  endTime: Date;
  parameter: {
    parameterName: string;
    parameterValue?: string;
    parameterUnit?: string;
  };
};
