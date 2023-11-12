import styles from './AddressBar.module.css';

const AddressBar = () => {
  return (
    <form className={styles.form}>
      <input type="text" placeholder="Type a URL" />
    </form>
  );
};

export default AddressBar;
