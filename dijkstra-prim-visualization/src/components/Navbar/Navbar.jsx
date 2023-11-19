import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";
import { primWrapper } from "../../algorithms/prim";
import { dijkstraWrapper } from "../../algorithms/dijkstra";

/**
 * Navbar component displays buttons to print nodes and edges.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges } = useContext(GraphParamsContext);

  const runPrim = () => {
    const result = primWrapper(nodes, edges);
    console.log(result);
  };

  const runDijkstra = () => {
    const result = dijkstraWrapper(nodes, edges);
    console.log(result);
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
