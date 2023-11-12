import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import styles from './AddressBar.module.css';

const AddressBar = () => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const handleUrlChange = (event: IpcRendererEvent, newUrl: string) => {
      setAddress(newUrl);
    };

    window.electron.onUrlChange(handleUrlChange);

    return () => {
      window.electron.removeUrlChangeListener(handleUrlChange);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (address.length > 0) {
      window.electron.loadURL(address);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        value={address}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setAddress(e.target.value)
        }
        type="text"
        placeholder="Type a URL"
      />
    </form>
  );
};

export default AddressBar;
