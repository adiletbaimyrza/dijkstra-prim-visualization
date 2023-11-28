import PropTypes from "prop-types";
import { createContext, useState } from "react";

const ErrorModalContext = createContext();

const useErrorModal = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);

  return {
    showErrorModal,
    setShowErrorModal,
    showPaperModal,
    setShowPaperModal,
  };
};

const ErrorModalProvider = ({ children }) => {
  const errorModal = useErrorModal();

  return (
    <ErrorModalContext.Provider value={errorModal}>
      {children}
    </ErrorModalContext.Provider>
  );
};

export { ErrorModalContext, ErrorModalProvider };

ErrorModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
