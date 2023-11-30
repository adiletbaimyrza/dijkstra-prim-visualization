import PropTypes from "prop-types";
import { createContext, useState } from "react";

const ModalContext = createContext();

const useModal = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return {
    showErrorModal,
    setShowErrorModal,
    showPaperModal,
    setShowPaperModal,
    showDetailsModal,
    setShowDetailsModal,
  };
};

const ModalProvider = ({ children }) => {
  const modals = useModal();

  return (
    <ModalContext.Provider value={modals}>{children}</ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
