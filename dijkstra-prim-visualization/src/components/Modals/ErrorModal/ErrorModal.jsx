import styles from "./ErrorModal.module.css";
import close from "../../assets/svg/close.svg";

const ErrorModal = ({ errorText, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.ErrorModal}>
        <p className={styles.errorText}>{errorText}</p>
        <button className={styles.close} onClick={onClose}>
          <img className={styles.img} src={close} />
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
