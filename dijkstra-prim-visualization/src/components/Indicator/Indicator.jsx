import styles from "./Indicator.module.css";

const Indicator = () => {
  return (
    <div className={styles.indicator}>
      Total weight: <span id="totalWeight"> </span>
    </div>
  );
};

export default Indicator;
