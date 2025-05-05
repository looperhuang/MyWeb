import type { Notify } from './Notify';
import type { Urge } from './Urge';
import type { Request } from './Request';
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
  request: Request;
  notify: Notify;
  urge: Urge;
}
