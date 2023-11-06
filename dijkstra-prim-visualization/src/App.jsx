import "./App.css";
import Canvas from "./components/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";
import { GraphParamsProvider } from "./GraphParamsContext";

function App() {
  return (
    <GraphParamsProvider>
      <Navbar />
      <Canvas />
    </GraphParamsProvider>
  );
}

export default App;
