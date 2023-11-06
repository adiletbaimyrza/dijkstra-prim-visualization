import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";

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
