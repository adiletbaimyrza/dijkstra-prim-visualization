import Canvas from "./components/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";
import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import { GraphParamsProvider } from "./contexts/GraphParamsContext";
import { ErrorModalProvider } from "./contexts/ModalsContext";

function App() {
  return (
    <ErrorModalProvider>
      <GraphParamsProvider>
        <Navbar />
        <Canvas />
        <Title />
        <Instructions />
      </GraphParamsProvider>
    </ErrorModalProvider>
  );
}

export default App;
