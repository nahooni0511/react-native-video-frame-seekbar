import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export async function extractFrames(
  videoPath: string,
  duration: number,
): Promise<string[]> {
  const normalizedVideoPath = videoPath.replace('file://', '');
  const decodedVideoPath = decodeURIComponent(normalizedVideoPath);

  const promises: Promise<string>[] = [];
  for (let second = 0; second < duration; second++) {
    const outputPath = `${RNFS.CachesDirectoryPath}/frame_${second}.jpg`;
    await FFmpegKit.execute(
      `-ss ${second} -i "${decodedVideoPath}" -vframes 1 ${outputPath}`,
    );
    promises.push(
      FFmpegKit.execute(
        `-ss ${second} -i "${decodedVideoPath}" -vframes 1 ${outputPath}`,
      ).then(_ => {
        return outputPath;
      }),
    );
  }

  return Promise.all(promises);
}
