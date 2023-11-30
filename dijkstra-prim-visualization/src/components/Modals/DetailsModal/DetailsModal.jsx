import styles from "./DetailsModal.module.css";
import close from "../../../assets/svg/close.svg";

const DetailsModal = ({ onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.DetailsModal}>
        <button className={styles.close} onClick={onClose}>
          <img className={styles.img} src={close} />
        </button>
        <p className={styles.detailsText}>
          Thanks for exploring our application! <br></br>
          <br></br>It was developed by{" "}
          <a
            className={styles.linkedinLink}
            href="https://www.linkedin.com/in/andriivenher/"
          >
            Andrii Venher
          </a>
          ,{" "}
          <a
            className={styles.linkedinLink}
            href="https://www.linkedin.com/in/siarhei-miachkou-434b57240/"
          >
            Siarhei Miachkou
          </a>
          , and{" "}
          <a
            className={styles.linkedinLink}
            href="https://www.linkedin.com/in/adiletbaim/"
          >
            Adilet Baimyza Uulu
          </a>{" "}
          as a part of the Team Project provided by{" "}
          <a
            className={styles.linkedinLink}
            href="https://www.linkedin.com/in/micha%C5%82-godziszewski-03607811a/"
          >
            Michal Godziszewski
          </a>{" "}
          at the University of Lodz. <br></br>
          <br></br>Feel free to explore and provide any feedback. Thank you for
          your interest!
        </p>
      </div>
    </div>
  );
};

export default DetailsModal;
