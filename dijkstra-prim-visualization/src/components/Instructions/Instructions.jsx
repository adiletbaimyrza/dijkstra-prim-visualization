import styles from "./Instructions.module.css";

const Instructions = () => {
  return (
    <div className={styles.instructions}>
      Total weight: <span id="totalWeight"> </span>
    </div>
  );
};

export default Instructions;
