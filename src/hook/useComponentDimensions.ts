import React, {useState, useCallback, useRef} from 'react';
import {LayoutChangeEvent, View} from 'react-native';

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function useComponentDimensions(): [
  Layout,
  {
    ref: React.RefObject<View>;
    onLayout: (event: LayoutChangeEvent) => void;
  },
] {
  const ref = useRef<View>(null);
  const [layout, setLayout] = useState<Layout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = useCallback(() => {
    ref.current?.measure((_x:number, _y:number, width:number, height:number, px:number, py:number) => {
      setLayout({
        width,
        height,
        x: px,
        y: py,
      });
    });
  }, []);

  return [layout, {ref, onLayout}];
}

export default useComponentDimensions;
