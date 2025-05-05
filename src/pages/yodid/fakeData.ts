import type { Form } from './models/Form';

export const fake: Form = {
  env_code: 'EO10001M01',
  env_name: 'SCC250100152 案件初審',
  version: '1.0',
  enable: true,
  start_date: '2025/03/02',
  end_date: '9999/12/31',
  tree: 'TW2',
  button_temp: '1 案件進件',
  accept: true,
  reject: true,
  request: {
    enable: true,
    list: [],
    other: '',
  },
  notify: {
    type: [],
    detail: [
      {
        label: '結案',
        enabled: false,
        type: '',
        template: null,
        receiver: [],
      },
      {
        label: '抽單',
        enabled: false,
        type: '',
        template: null,
        receiver: [],
      },
      {
        label: '退回',
        enabled: false,
        type: '',
        template: null,
        receiver: [],
      },
      {
        label: '否決',
        enabled: false,
        type: '',
        template: null,
        receiver: [],
      },
      {
        label: '待簽核',
        enabled: false,
        type: '',
        template: null,
        receiver: [],
      },
    ],
  },
  urge: {
    type: [],
    content: { type: '', template: null },
    rule: {
      timeout: { hour: 24, minute: 0 },
      repeat: { enable: true, hour: 8, minute: 0 },
      maxRepeat: { enable: false, count: 0 },
    },
    according: [
      {
        company: '新鑫',
        atWork: true,
        sheet: 'SCC工作曆',
        startTime: '08:30',
        endTime: '17:30',
      },
      {
        company: '裕電',
        atWork: false,
        sheet: 'YES工作曆',
        startTime: '08:30',
        endTime: '17:25',
      },
    ],
  },
};
