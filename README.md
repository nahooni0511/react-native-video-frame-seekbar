# react-native-video-frame-seekbar

A React Native component that allows users to seek through video frames and select a range directly on the seekbar. This library is designed to enhance video playback experience by providing a visual frame timeline and selection capability.

## Features

- **Frame Seeking:** Navigate through video by viewing frames on the seekbar.
- **Range Selection:** Select a specific range within the video directly from the seekbar.

## Installation

```bash
npm install react-native-video-frame-seekbar
# or
yarn add react-native-video-frame-seekbar
```

## Usage

To use this component, you need to provide frame images separately. The library does not include frame extraction functionality, but you can use `ffmpeg-kit-react-native` for extracting frames.

### Example

```jsx
import React, { useCallback } from 'react';
import { Button, SafeAreaView } from 'react-native';
import VideoFrameSeekbar from 'react-native-video-frame-seekbar';

// Your app component
function App() {
    // Component logic here...
    return (
        <SafeAreaView>
            {/* Video and VideoFrameSeekbar components */}
        </SafeAreaView>
    );
}
```

### Props

The component accepts the following props:

| Prop                | Type                          | Description                                   |
|---------------------|-------------------------------|-----------------------------------------------|
| `totalDuration`     | `number`                      | Total duration of the video in milliseconds.  |
| `currentTimeProvider` | `() => Promise<number>`      | Function to provide the current time of the video. |
| `frameProvider`     | `(milliseconds: number) => string \| null` | Function to provide the frame image source for a given time. |
| `size`              | `number?`                     | Optional. Size of the seekbar.                |
| `onStartDrag`       | `() => void`                  | Optional. Callback when dragging starts.      |
| `onDrag`            | `(position: number) => void`  | Optional. Callback during dragging.           |
| `onEndDrag`         | `(position: number) => void`  | Optional. Callback when dragging ends.        |
| `select`            | `Select \| null`              | Optional. Object for range selection.         |
| `thumbsDragStart`   | `() => void`                  | Optional. Callback when thumb dragging starts.|
| `thumbsDrag`        | `(position: number) => void`  | Optional. Callback during thumb dragging.     |
| `thumbsDragEnd`     | `({start: number; end: number}, target: 'START' \| 'END') => void` | Optional. Callback when thumb dragging ends.  |

> **Note:** It's recommended to use `useCallback` for the callback props to avoid unnecessary re-renders.

## Demo

| Action            | Demo                                    |
|-------------------|-----------------------------------------|
| **Seeking**       | ![Seeking Demo](docs/static/seek.gif)   |
| **Range Selection** | ![Selection Demo](docs/static/select.gif)              |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
