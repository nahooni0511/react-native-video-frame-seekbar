import {useRef, useEffect, memo, useState} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
} from 'react-native';
import Select from './data/Select';
import {msToPx, pxToMs} from './util/SeekBarUtil';
import useSyncSeekBarPosition from './hook/useSyncSeekBarPosition';
import useComponentDimensions from './hook/useComponentDimensions';
import VideoFrameSeekbarContent from "./VideoFrameSeekbarContent";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export interface VideoFrameSeekbarProps {
    totalDuration: number;
    currentTimeProvider: () => Promise<number>;
    frameProvider: (milliseconds: number) => string | null;
    style?: StyleProp<ViewStyle>;
    size?: number;
    onStartDrag?: () => void;
    onDrag?: (position: number) => void;
    onEndDrag?: (position: number) => void;
    select?: Select | null;
    thumbsDragStart?: () => void;
    thumbsDrag?: (position: number) => void;
    thumbsDragEnd?: (
        opt: { start: number; end: number },
        target: 'START' | 'END',
    ) => void;
}

const VideoFrameSeekbar: React.FC<VideoFrameSeekbarProps> = ({
                                                                 style,
                                                                 totalDuration,
                                                                 currentTimeProvider,
                                                                 frameProvider,
                                                                 size:propsSize = 50,
                                                                 select:propsSelect,
                                                                 onStartDrag: propsOnStartDrag,
                                                                 onDrag: propsOnDrag,
                                                                 onEndDrag: propsOnEndDrag,
                                                                 thumbsDragStart: propsThumbsDragStart,
                                                                 thumbsDrag: propsThumbsDrag,
                                                                 thumbsDragEnd: propsThumbsDragEnd,
                                                             }) => {
    const isDragging = useRef(false);
    const isStartThumbsMoving = useRef(false);
    const isEndThumbsMoving = useRef(false);

    const [l, layoutProps] = useComponentDimensions();
    const layoutRef = useRef(l);
    useEffect(() => {
        layoutRef.current = l;
    }, [l]);

    const selectRef = useRef(propsSelect);
    const [select, setSelect] = useState<Select | undefined | null>(propsSelect);
    useEffect(() => {
        selectRef.current = propsSelect;
        setSelect(propsSelect);
    }, [propsSelect]);

    const sizeRef = useRef(propsSize);
    const [size, setSize] = useState(propsSize);
    useEffect(() => {
        sizeRef.current = propsSize;
        setSize(propsSize);
    }, [propsSize]);

    const onStartDragRef = useRef(propsOnStartDrag);
    useEffect(() => {
        onStartDragRef.current = propsOnStartDrag;
    }, [propsOnStartDrag]);

    const onDragRef = useRef(propsOnDrag);
    useEffect(() => {
        onDragRef.current = propsOnDrag;
    }, [propsOnDrag]);

    const onEndDragRef = useRef(propsOnEndDrag);
    useEffect(() => {
        onEndDragRef.current = propsOnEndDrag;
    }, [propsOnEndDrag]);

    const thumbsDragStartRef = useRef(propsThumbsDragStart);
    useEffect(() => {
        thumbsDragStartRef.current = propsThumbsDragStart;
    }, [propsThumbsDragStart]);

    const thumbsDragRef = useRef(propsThumbsDrag);
    useEffect(() => {
        thumbsDragRef.current = propsThumbsDrag;
    }, [propsThumbsDrag]);

    const thumbsDragEndRef = useRef(propsThumbsDragEnd);
    useEffect(() => {
        thumbsDragEndRef.current = propsThumbsDragEnd;
    }, [propsThumbsDragEnd]);

    const startThumbsPosition = useRef(
        new Animated.Value(select ? select.start : 0),
    ).current;
    const endThumbsPosition = useRef(
        new Animated.Value(select ? select.end : 0),
    ).current;

    const {
        framePosition,
        lastTimeRef: lastTime,
        syncPosition,
        pauseSyncPosition,
    } = useSyncSeekBarPosition({
        currentTimeProvider,
        size,
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: ({nativeEvent}, gestureState) => {
                const {numberActiveTouches} = gestureState;
                if (numberActiveTouches > 1) {
                    return;
                }
                pauseSyncPosition();
                const layout = layoutRef.current;
                const pageX = nativeEvent.pageX - layout.x;
                const width = layout.width;
                const select = selectRef.current;
                if (select) {
                    const size = sizeRef.current
                    const offset = width / 2 - msToPx(lastTime.current, size);
                    const selectStartPx = msToPx(select.start, size) + offset;
                    const selectEndPx = msToPx(select.end, size) + offset;

                    const diffStart = Math.abs(pageX - selectStartPx); //
                    const diffEnd = Math.abs(pageX - selectEndPx);
                    const movingThumbs = Math.min(diffStart, diffEnd) <= 20;
                    const thumbsDragStart = thumbsDragStartRef.current;
                    if (movingThumbs) {
                        if (Math.min(diffStart, diffEnd) === diffStart) {
                            isStartThumbsMoving.current = true;
                            if (thumbsDragStart) {
                                thumbsDragStart();
                            }
                            return;
                        } else {
                            isEndThumbsMoving.current = true;
                            if (thumbsDragStart) {
                                thumbsDragStart();
                            }
                            return;
                        }
                    }
                }
                const onStartDrag = onStartDragRef.current;
                isDragging.current = true;
                if (onStartDrag) {
                    onStartDrag();
                }
            },
            onPanResponderMove: (_, gestureState) => {
                const dx = gestureState.dx;
                const size = sizeRef.current
                const currentPosition = dx - msToPx(lastTime.current, size);
                const select = selectRef.current;
                const onDrag = onDragRef.current;
                const thumbsDrag = thumbsDragRef.current;
                if (isDragging.current) {
                    framePosition.setValue(Math.min(currentPosition, 0));
                    if (onDrag) {
                        onDrag(pxToMs(-currentPosition, size));
                    }
                } else if (select) {
                    if (isStartThumbsMoving.current) {
                        let newStartPx = msToPx(select.start, size) + dx;
                        if (newStartPx > msToPx(select.end - 2000, size)) {
                            newStartPx = msToPx(select.end - 2000, size);
                        }
                        if (newStartPx < 0) {
                            newStartPx = 0;
                        }
                        startThumbsPosition.setValue(newStartPx);
                        if (thumbsDrag) {
                            thumbsDrag(pxToMs(newStartPx, size));
                        }
                    } else if (isEndThumbsMoving.current) {
                        let newEndPx = msToPx(select.end, size) + dx;
                        if (newEndPx < msToPx(select.start + 2000, size)) {
                            newEndPx = msToPx(select.start + 2000, size);
                        }
                        endThumbsPosition.setValue(newEndPx);
                        if (thumbsDrag) {
                            thumbsDrag(pxToMs(newEndPx, size));
                        }
                    }
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const dx = gestureState.dx;
                const select = selectRef.current;
                const size = sizeRef.current
                const thumbsDragEnd = thumbsDragEndRef.current;
                const onEndDrag = onEndDragRef.current;
                if (isStartThumbsMoving.current) {
                    let newStart = select!.start + pxToMs(dx, size);
                    if (newStart > select!.end - 2000) {
                        newStart = select!.end - 2000;
                    }
                    if (newStart < 0) {
                        newStart = 0;
                    }
                    isStartThumbsMoving.current = false;
                    startThumbsPosition.setValue(select ? msToPx(newStart, size) : 0);
                    if (thumbsDragEnd && select) {
                        thumbsDragEnd(
                            {
                                start: newStart,
                                end: select.end,
                            },
                            'START',
                        );
                    }
                } else if (isEndThumbsMoving.current) {
                    let newEnd = select!.end + pxToMs(dx, size);
                    if (newEnd < select!.start + 2000) {
                        newEnd = select!.start + 2000;
                    }
                    // Check if it's 2 seconds apart
                    isEndThumbsMoving.current = false;
                    endThumbsPosition.setValue(select ? msToPx(newEnd, size) : 0);
                    if (thumbsDragEnd && select) {
                        thumbsDragEnd(
                            {
                                start: select.start,
                                end: newEnd,
                            },
                            'END',
                        );
                    }
                } else if (isDragging.current) {
                    isDragging.current = false;
                    const currentPosition = dx - msToPx(lastTime.current, size);
                    if (onEndDrag) {
                        onEndDrag(pxToMs(-currentPosition, size));
                    }
                }
                syncPosition();
            },
        }),
    ).current;

    useEffect(() => {
        if (select) {
            startThumbsPosition.setValue(msToPx(select.start, size));
            endThumbsPosition.setValue(msToPx(select.end, size));
        }
    }, [endThumbsPosition, select, size, startThumbsPosition]);

    return (
        <View
            {...layoutProps}
            style={[styles.container, style, {height: size + 4}]}
            {...panResponder?.panHandlers}>
            <VideoFrameSeekbarContent
                size={size}
                totalDuration={totalDuration}
                frameProvider={frameProvider}
                startThumbsPosition={startThumbsPosition}
                endThumbsPosition={endThumbsPosition}
                select={select !== undefined || select !== null}
                framePosition={framePosition}
            />
            <View style={styles.currentIndicator}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width:'100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentIndicator: {
        height: '100%',
        width: 2,
        backgroundColor: 'red',
        position: 'absolute',
        zIndex: 1,
    },
});

export default memo(VideoFrameSeekbar);
