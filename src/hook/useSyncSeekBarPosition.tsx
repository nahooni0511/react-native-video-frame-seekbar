import {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {msToPx} from '../util/SeekBarUtil';

const useSyncSeekBarPosition = (opt: {
  currentTimeProvider: () => Promise<number>;
  size: number;
}) => {
  const {currentTimeProvider, size} = opt;

  const framePosition = useRef(new Animated.Value(0)).current;
  const lastTimeRef = useRef(0);
  const animatingRef = useRef(false);

  const passRef = useRef(false);
  const syncPosition = useCallback(() => {
    passRef.current = false;
  }, []);
  const pauseSyncPosition = useCallback(() => {
    passRef.current = true;
  }, []);

  const getCurrentTimeRef = useRef(currentTimeProvider);
  useEffect(() => {
    getCurrentTimeRef.current = currentTimeProvider;
  }, [currentTimeProvider]);

  const cancelRef = useRef(false);
  const sizeRef = useRef(size);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const run = useCallback(async () => {
    if (cancelRef.current) {
      return;
    }
    if (passRef.current) {
      setTimeout(run, 10);
      return;
    }
    if (animatingRef.current) {
      setTimeout(run, 10);
      return;
    }
    const currentTime = await getCurrentTimeRef.current().catch(e => {
      console.log(e);
      return null;
    });
    if (currentTime === null) {
      setTimeout(run, 10);
      return;
    }

    // const oldPosition = msToPx(lastTimeRef.current, sizeRef.current);
    const newPosition = msToPx(currentTime, sizeRef.current);
    const diffTime = Math.abs(lastTimeRef.current - currentTime);
    lastTimeRef.current = currentTime;
    if (diffTime > 200) {
      animatingRef.current = true;
      Animated.timing(framePosition, {
        toValue: -msToPx(currentTime, sizeRef.current),
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        animatingRef.current = false;
        setTimeout(run, 10);
        return;
      });
    } else {
      framePosition.setValue(-newPosition);
      setTimeout(run, 10);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    run();
    return () => {
      cancelRef.current = true;
      // clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    framePosition,
    lastTimeRef,
    syncPosition,
    pauseSyncPosition,
  };
};

export default useSyncSeekBarPosition;
