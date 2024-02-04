import {useCallback, useEffect, useState} from 'react';
import {extractFrames} from '../util/FrameUtil';
import {Asset} from 'react-native-image-picker/src/types';

export default function useVideoFrames(asset: Asset | null) {
  const [frames, setFrames] = useState<string[]>([]);
  useEffect(() => {
    if (asset) {
      const {uri, duration} = asset;
      extractFrames(uri!, duration!).then(setFrames);
    }
  }, [asset]);
  const clearFrames = useCallback(() => {
    setFrames([]);
  }, []);
  return {frames, clearFrames};
}
