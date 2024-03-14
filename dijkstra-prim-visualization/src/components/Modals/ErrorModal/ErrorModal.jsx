import styles from "./ErrorModal.module.css";
import CloseIcon from "@mui/icons-material/Close";

const ErrorModal = ({ errorText, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.ErrorModal}>
        <p className={styles.errorText}>{errorText}</p>
        <button className={styles.close} onClick={onClose}>
          <CloseIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
