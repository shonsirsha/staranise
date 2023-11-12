import { BackIcon, ForwardIcon } from '../icons/icons';
import styles from './NavigationButtons.module.css';

export const BackButton = () => {
  return (
    <button
      disabled
      className={styles.button}
      type="button"
      aria-label="back"
      onClick={() => {}}
    >
      <BackIcon />
    </button>
  );
};

export const ForwardButton = () => {
  return (
    <button
      className={styles.button}
      type="button"
      aria-label="forward"
      onClick={() => {}}
    >
      <ForwardIcon />
    </button>
  );
};

export const NavigationButtons = () => {
  return (
    <div className={styles.container}>
      <BackButton />
      <ForwardButton />
    </div>
  );
};
