import React, { useRef } from 'react';
import { TextInput } from '@mantine/core';

const SHOW_RENDER_COUNTERS = true;

const useRenderCounter = () => {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;

  if (SHOW_RENDER_COUNTERS) {
    // return (
    //   <TextInput
    //     value={String(renderCount.current)}
    //   />
    // );
    console.info("RENDERED: ", renderCount.current)
  }
  return null;
};

export default useRenderCounter;