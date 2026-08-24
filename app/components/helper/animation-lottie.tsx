"use client"

import dynamic from 'next/dynamic';

interface AnimationLottieProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationPath: any;
  width?: string;
}

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const AnimationLottie = ({ animationPath }: AnimationLottieProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: '95%',
    }
  };

  return (
    <Lottie {...defaultOptions} />
  );
};

export default AnimationLottie;
