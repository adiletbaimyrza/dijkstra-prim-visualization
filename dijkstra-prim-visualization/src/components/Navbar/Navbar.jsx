import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";
import { createGraphFromComponent } from "../../algorithms/graph";
import prim from "../../algorithms/mstPrim";
import dijkstra from "../../algorithms/spDijkstra";

/**
 * Navbar component displays buttons to print nodes and edges.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges } = useContext(GraphParamsContext);

  const runPrim = () => {
    const graph = createGraphFromComponent(nodes, edges);
    const result = prim(graph);
    console.log(result);
  };

  const runDijkstra = () => {
    const graph = createGraphFromComponent(nodes, edges);
    const result = dijkstra(graph);
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
