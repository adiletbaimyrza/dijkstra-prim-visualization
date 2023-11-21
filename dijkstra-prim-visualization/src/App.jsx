import Canvas from "./components/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";
import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import { GraphParamsProvider } from "./GraphParamsContext";

function App() {
  return (
    <GraphParamsProvider>
      <Navbar />
      <Canvas />
      <Title />
      <Instructions />
    </GraphParamsProvider>
  );
}

export default App;
