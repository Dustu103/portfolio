// Declaration for SVG modules used in skill-image.ts
declare module '*.svg' {
  const content: { src: string; height: number; width: number };
  export default content;
}

// Declaration for JSON lottie animation files
declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

// Declaration for PNG imports
declare module '*.png' {
  const content: { src: string; height: number; width: number };
  export default content;
}
