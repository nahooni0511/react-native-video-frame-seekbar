import {ActivityIndicator, Image, View} from 'react-native';
import {memo} from "react";

type FrameProps = {
    url: string | null;
    size: number;
}
function Frame({url, size}: FrameProps) {
    return (
        <View style={{
            margin: 1,
            height: size - 2,
            width: size - 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#d0d0d0',
        }}>
            {url ? (
                <Image style={{width: '100%', height: '100%'}} source={{uri: url}}/>
            ) : (
                <ActivityIndicator size={'small'} color={'black'}/>
            )}
        </View>
    );
}
export default memo(Frame);
