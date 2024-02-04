import { ComponentType } from 'react';
import { ViewStyle } from 'react-native';

export interface VideoFrameSeekbarProps {
    totalDuration: number;
    currentTimeProvider: () => Promise<number>;
    frameProvider: (milliseconds: number) => string | null;
    size?: number;
    onStartDrag?: () => void;
    onDrag?: (position: number) => void;
    onEndDrag?: (position: number) => void;
    select?: Select | null;
    thumbsDragStart?: () => void;
    thumbsDrag?: (position: number) => void;
    thumbsDragEnd?: (
        opt: {start: number; end: number},
        target: 'START' | 'END',
    ) => void;
}

export interface Select {
    start: number;
    end: number;
}

declare const VideoFrameSeekbar: ComponentType<VideoFrameSeekbarProps>;

export default VideoFrameSeekbar;
