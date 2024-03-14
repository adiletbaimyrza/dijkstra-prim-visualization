import styles from "./Indicator.module.css";

const Indicator = () => {
  return (
    <div className={styles.indicator}>
      Total weight: <span id="totalWeight">0</span>
    </div>
  );
};

export default Indicator;
