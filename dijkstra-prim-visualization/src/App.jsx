import { Canvas, Navbar, Title, Indicator, Zoom } from "./components";
import { Providers } from "./contexts";

function App() {
  return (
    <Providers>
      <Navbar />
      <div id="playground">
        <div id="indicators">
          <Title />
          <Zoom />
          <Indicator />
        </div>
        <Canvas />
      </div>
    </Providers>
  );
}

export default App;
