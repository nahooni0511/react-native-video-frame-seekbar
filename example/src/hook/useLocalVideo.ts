import {PermissionsAndroid, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useState} from 'react';
import {Asset} from 'react-native-image-picker/src/types';

export default function useLocalVideo() {
  const [asset, setAsset] = useState<Asset | null>(null);
  const selectVideo = async () => {
    if (Platform.OS === 'android' && !(await requestStoragePermission())) {
      console.log('Storage permission is not granted.');
      return;
    }
    launchImageLibrary({mediaType: 'video'}, response => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (
        response.assets &&
        response.assets[0] &&
        response.assets[0].uri &&
        response.assets[0].duration
      ) {
        console.log('Selected video: ', response);
        setAsset(response.assets[0]);
      }
    });
  };
  const closeVideo = () => {
    setAsset(null);
  };
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          buttonPositive: 'OK',
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to select videos',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  return {
    asset,
    selectVideo,
    closeVideo,
  };
}
