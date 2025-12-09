export interface NavLink {
  label: string;
  href: string;
}

export interface CountDownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GalleryItem {
  id?: number | string;
  url: string;
  handle: string;
  created_at?: string;
}
