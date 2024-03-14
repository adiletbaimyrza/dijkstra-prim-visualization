import styles from "./Zoom.module.css";
import { GraphParamsContext } from "../../contexts";
import { useContext } from "react";

const Zoom = () => {
  const { zoom } = useContext(GraphParamsContext);
  const zoomPercentile = Math.round(zoom * 100);
  return <div className={styles.zoom}>Zoom: {zoomPercentile}%</div>;
};

export default Zoom;
