import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";
import { startAnimations } from "./animations";
import { runDijkstra, runPrim, areAllNodesConnected } from "./NavbarUtils";
import styles from "./Navbar.module.css";

/**
 * Navbar component displays buttons to manage all the logic of the website.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges, setNodes, setEdges } = useContext(GraphParamsContext);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const edgeIds = runPrim(nodes, edges);
      startAnimations(edgeIds);
    } else {
      console.log("all edges must be connected");
    }
  };

  const animateDijkstra = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const edgeIds = runDijkstra(nodes, edges);
      startAnimations(edgeIds);
    } else {
      console.log("all edges must be connected");
    }
  };

  const resetEdgesAndNodes = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className={styles.Navbar}>
      <button onClick={animatePrim}>Run prim's algorithm</button>
      <button onClick={animateDijkstra}>Run dijkstra's algorithm</button>
      <button id={styles.clearCanvas} onClick={resetEdgesAndNodes}>
        Clear canvas
      </button>
    </div>
  );
};

export default Navbar;
