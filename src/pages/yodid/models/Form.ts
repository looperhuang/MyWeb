import type { NotifyDetail } from './NotifyDetail';
export interface Form {
  env_code: string;
  env_name: string;
  version: string;
  enable: true;
  start_date: string;
  end_date: string;
  tree: string;
  button_temp: string;
  accept: true;
  reject: true;
  requestEnable: true;
  requestList: string[];
  requestOther: string;
  notifyType: string[];
  notifyDetail: NotifyDetail[];
}
