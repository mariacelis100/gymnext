declare module 'react-swipeable-views-react-18-fix' {
  import { ComponentType, ReactNode } from 'react';

  export interface SwipeableViewsProps {
    index?: number;
    onChangeIndex?: (index: number) => void;
    disabled?: boolean;
    enableMouseEvents?: boolean;
    resistance?: boolean;
    springConfig?: {
      duration: string;
      easeFunction: string;
      delay: string;
    };
    slideStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    slideClassName?: string;
    containerClassName?: string;
    className?: string;
    children?: ReactNode;
  }

  const SwipeableViews: ComponentType<SwipeableViewsProps>;
  export default SwipeableViews;
} 