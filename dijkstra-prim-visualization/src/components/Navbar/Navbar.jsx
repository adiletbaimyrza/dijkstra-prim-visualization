import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";

/**
 * Navbar component displays buttons to print nodePoints and edges.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodePoints, edges } = useContext(GraphParamsContext);
  return (
    <>
      <button
        onClick={() => {
          console.log(nodePoints);
        }}
      >
        Print nodePoints
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
