import { ModalProvider, GraphParamsProvider, SavedGraphsProvider } from ".";

const Providers = ({ children }) => {
  return (
    <ModalProvider>
      <GraphParamsProvider>
        <SavedGraphsProvider>{children}</SavedGraphsProvider>
      </GraphParamsProvider>
    </ModalProvider>
  );
};

export default Providers;
