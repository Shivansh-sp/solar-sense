// Global type declarations to prevent TypeScript from looking for missing D3 and WebXR types

declare module 'd3-array' {
  const d3Array: any;
  export = d3Array;
}

declare module 'd3-color' {
  const d3Color: any;
  export = d3Color;
}

declare module 'd3-ease' {
  const d3Ease: any;
  export = d3Ease;
}

declare module 'd3-interpolate' {
  const d3Interpolate: any;
  export = d3Interpolate;
}

declare module 'd3-path' {
  const d3Path: any;
  export = d3Path;
}

declare module 'd3-scale' {
  const d3Scale: any;
  export = d3Scale;
}

declare module 'd3-time' {
  const d3Time: any;
  export = d3Time;
}

declare module 'd3-timer' {
  const d3Timer: any;
  export = d3Timer;
}

declare module 'webxr' {
  const webxr: any;
  export = webxr;
}
