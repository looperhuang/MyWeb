export interface Urge {
  type: string[];
  content: UrgeContent;
  rule: UrgeRule;
  according: UrgeAccording[];
}

export interface UrgeContent {
  type: string;
  template: File | null;
}

export interface UrgeRule {
  timeout: { hour: number; minute: number };
  repeat: { enable: boolean; hour: number; minute: number };
  maxRepeat: { enable: boolean; count: number };
}

export interface UrgeAccording {
  company: string;
  atWork: boolean;
  sheet: string;
  startTime: string;
  endTime: string;
}
