import {Animated, StyleSheet, View} from 'react-native';
import {memo} from "react";

type SelectViewProps = {
    startThumbsPosition: Animated.Value;
    endThumbsPosition: Animated.Value;
};
const SelectView: React.FC<SelectViewProps> = memo(
    ({startThumbsPosition, endThumbsPosition}) => {
        return (
            <Animated.View
                key={'selectView'}
                style={{
                    position: 'absolute',
                    left: startThumbsPosition,
                    width: Animated.subtract(endThumbsPosition, startThumbsPosition),
                    height: '100%',
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#E277CD',
                    justifyContent: 'center',
                }}>
                <Animated.View
                    style={[
                        styles.thumbsLeft,
                        // {transform: [{translateX: startThumbsPosition}]},
                    ]}>
                    <View style={{backgroundColor:'white', width:2, minHeight:'50%', maxHeight:'80%'}}></View>
                </Animated.View>
                <View style={styles.thumbsRight}>
                    {/*<View style={{backgroundColor:'white', width:1, height:'80%'}}></View>*/}
                    <View style={{backgroundColor:'white', width:2, minHeight:'50%', maxHeight:'80%'}}></View>
                </View>
            </Animated.View>
        );
    },
);
const styles = StyleSheet.create({
    thumbsLeft: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: -8,
        width: 16,
        height: '80%',
        borderRadius: 10,
        backgroundColor: '#E277CD',
    },
    thumbsRight: {
        transform: [{translateX: 8}],
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        width: 16,
        height: '80%',
        borderRadius: 10,
        backgroundColor: '#E277CD',
    },
});
export default SelectView;
