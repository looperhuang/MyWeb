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

export { getTxgWeather, getWeatherDesc };

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
