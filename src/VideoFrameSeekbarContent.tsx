import {FRAME_INTERVAL} from "./const";
import Frame from "./Frame";
import SelectView from "./SelectView";
import {Animated, StyleSheet} from "react-native";
import {memo} from "react";

type VideoFrameSeekbarContentProps = {
    size: number;
    totalDuration: number;
    frameProvider: (milliseconds: number) => string | null;
    startThumbsPosition: Animated.Value;
    endThumbsPosition: Animated.Value;
    select?: boolean;
    framePosition: Animated.Value;
};

function VideoFrameSeekbarContent({
                                      size,
                                      totalDuration,
                                      frameProvider,
                                      startThumbsPosition,
                                      endThumbsPosition,
                                      select,
                                      framePosition,
                                  }: VideoFrameSeekbarContentProps) {
    return (
        <Animated.View
            style={[styles.seekBar, {transform: [{translateX: framePosition}]}]}>
            {Array(Math.ceil(totalDuration / FRAME_INTERVAL))
                .fill(0)
                .map((_, idx) => {
                    const url = frameProvider(idx * FRAME_INTERVAL);
                    return <Frame key={idx} size={size} url={url}/>;
                })}
            {select && (
                <SelectView
                    startThumbsPosition={startThumbsPosition}
                    endThumbsPosition={endThumbsPosition}
                />
            )}
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    seekBar: {
        flexDirection: 'row',
        position: 'absolute',
        left: '50%',
    },
});
export default memo(VideoFrameSeekbarContent);
