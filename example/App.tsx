/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import VideoFrameSeekbar, {Select} from 'react-native-video-frame-seekbar';
import {Button, SafeAreaView} from 'react-native';
import Video from 'react-native-video';
import useLocalVideo from './src/hook/useLocalVideo';
import useVideoFrames from './src/hook/useVideoFrames';

function App(): React.JSX.Element {
  const videoRef = useRef<Video>();
  const currentTimeRef = useRef<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [select, setSelect] = useState<Select | undefined>(undefined);

  const {asset, selectVideo, closeVideo} = useLocalVideo();
  const {frames, clearFrames} = useVideoFrames(asset);

  useEffect(() => {
    if (asset) {
      videoRef.current?.seek(0);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [asset]);

  const stopVideo = () => {
    closeVideo();
    clearFrames();
  };

  const pauseVideo = () => {
    setPlaying(false);
  };

  const startSelection = () => {
    setPlaying(false);
    setSelect({
      start: currentTimeRef.current - 2000,
      end: currentTimeRef.current + 2000,
    });
  };
  const finishSelection = () => {
    setPlaying(true);
    setSelect(undefined);
  };

  const frameProvider = useCallback(
    (milliseconds: number): string | null => {
      const seconds = Math.floor(milliseconds / 1000);
      if (frames.length > seconds) {
        return frames[seconds]!;
      }
      return null;
    },
    [frames],
  );
  const currentTimeProvider = useCallback(async () => {
    return currentTimeRef.current;
  }, []);
  const onStartDrag = useCallback(() => {
    setPlaying(false);
  }, []);
  const onDrag = useCallback((time: number) => {
    videoRef.current?.seek(time / 1000);
  }, []);
  const onEndDrag = useCallback((time: number) => {
    videoRef.current?.seek(time / 1000);
    setPlaying(true);
  }, []);

  const thumbsDragStart = useCallback(() => {
    setPlaying(false);
  }, []);
  const thumbsDrag = useCallback((position: number) => {
    videoRef.current?.seek(position / 1000);
  }, []);
  const thumbsDragEnd = useCallback(
    (opt: {start: number; end: number}, type: 'START' | 'END') => {
      setSelect({
        start: opt.start,
        end: opt.end,
      });
    },
    [],
  );

  return (
    <SafeAreaView>
      {!asset ? (
        <Button title="Select Video" onPress={selectVideo} />
      ) : (
        <>
          <Video
            paused={!playing}
            source={{uri: asset.uri!}} // Can be a URL or a local file.
            ref={videoRef} // Store reference
            style={{width: '100%', height: 200}}
            progressUpdateInterval={10}
            onProgress={data => {
              currentTimeRef.current = data.currentTime * 1000;
            }}
          />
          <VideoFrameSeekbar
            totalDuration={(asset.duration || 0) * 1000}
            select={select}
            thumbsDragStart={thumbsDragStart}
            thumbsDrag={thumbsDrag}
            thumbsDragEnd={thumbsDragEnd}
            onStartDrag={onStartDrag}
            onDrag={onDrag}
            onEndDrag={onEndDrag}
            frameProvider={frameProvider}
            currentTimeProvider={currentTimeProvider}
          />
          <Button title="Stop Video" onPress={stopVideo} />
          <Button title="Pause Video" onPress={pauseVideo} />
          {select ? (
            <Button title="Cancel Select" onPress={finishSelection} />
          ) : (
            <Button title="Select" onPress={startSelection} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

export default App;
