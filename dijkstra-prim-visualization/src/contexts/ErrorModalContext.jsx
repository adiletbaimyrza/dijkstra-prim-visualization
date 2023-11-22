import PropTypes from "prop-types";
import { createContext, useState } from "react";

// Create a context for the error modal
export const ErrorModalContext = createContext();

// Custom hook useErrorModal to manage the error modal state
const useErrorModal = () => {
  const [showErrorModal, setShowErrorModal] = useState([]);

  // Return the state and its setter function
  return { showErrorModal, setShowErrorModal };
};

/**
 * Provides the context for the error modal.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} - The context provider component with the error modal state as value.
 */
export const ErrorModalProvider = ({ children }) => {
  // Get the error modal state from the useErrorModal hook
  const errorModal = useErrorModal();

  // Return the context provider component with the error modal state as value
  return (
    <ErrorModalContext.Provider value={errorModal}>
      {children}
    </ErrorModalContext.Provider>
  );
};

// Makes sure the 'children' prop is a React node and that it is a required parameter
ErrorModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
