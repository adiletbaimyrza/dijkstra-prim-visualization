import { useContext } from "react";
import { GraphParamsContext } from "../../GraphParamsContext";
import { startAnimations } from "./animations";
import { runDijkstra, runPrim } from "./NavbarUtils";

/**
 * Navbar component displays buttons to manage all the logic of the website.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges } = useContext(GraphParamsContext);

  const animatePrim = () => {
    const animations = runPrim(nodes, edges);
    console.log(animations);
    startAnimations(animations);
  };

  const animateDijkstra = () => {
    const animations = runDijkstra(nodes, edges);
    console.log(animations);
    startAnimations(animations);
  };

  return (
    <>
      <button onClick={animatePrim}>Run prim's algorithm</button>
      <button onClick={animateDijkstra}>Run dijkstra's algorithm</button>
    </>
  );
};

export default Navbar;
