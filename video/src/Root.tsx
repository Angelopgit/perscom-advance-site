import React from 'react';
import {Composition} from 'remotion';
import {PerscomVideo} from './PerscomVideo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PerscomShowcase"
        component={PerscomVideo}
        durationInFrames={600}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
