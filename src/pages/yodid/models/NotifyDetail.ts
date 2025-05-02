export interface NotifyDetail {
  label: string;
  enabled: boolean;
  type: string;
  template: File | null;
  receiver?: string[];
}
