import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";

/**
 * Navbar component displays buttons to print nodes and edges.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges } = useContext(GraphParamsContext);
  return (
    <>
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
