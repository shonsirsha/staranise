import backSVG from './back.svg';
import forwardSVG from './forward.svg';

export const BackIcon = () => {
  return <img width={14} alt="back" src={backSVG} draggable={false} />;
};

export const ForwardIcon = () => {
  return <img width={14} alt="forward" src={forwardSVG} draggable={false} />;
};
