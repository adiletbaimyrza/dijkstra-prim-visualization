import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";
import { createGraph } from "../../algorithms/graph";
import prim from "../../algorithms/mstPrim";
import dijkstra from "../../algorithms/spDijkstra";

/**
 * Navbar component displays buttons to print nodes and edges.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges } = useContext(GraphParamsContext);

  const runPrim = () => {
    // you can run your code there
  };

  const runDijkstra = () => {
    // you can run your code there
  };

  return (
    <>
      <button onClick={runPrim}>Run prim's algorithm</button>
      <button onClick={runDijkstra}>Run dijkstra's algorithm</button>
      <button
        onClick={() => {
          console.log(nodes);
        }}
      >
        Print nodes
      </button>
      <button
        onClick={() => {
          console.log(edges);
        }}
      >
        Print edges
      </button>
    </>
  );
};

export default Navbar;
