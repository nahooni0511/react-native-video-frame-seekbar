import {FRAME_INTERVAL} from '../const';

export const msToPx = (ms: number, size: number) => {
  return (ms / FRAME_INTERVAL) * size;
};

export const pxToMs = (px: number, size: number) => {
  return (px / size) * FRAME_INTERVAL;
};
