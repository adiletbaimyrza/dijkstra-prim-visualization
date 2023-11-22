import { useState, useEffect } from "react";
import styles from "./PaperModal.module.css";
import close from "../../../assets/svg/close.svg";
import ReactMarkdown from "react-markdown";

const PaperModal = ({ onClose }) => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("/src/assets/docs/paper.md")
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.PaperModal}>
        <button className={styles.close} onClick={onClose}>
          <img className={styles.img} src={close} />
        </button>
        <ReactMarkdown
          components={{
            img: ({ alt, src, title }) => (
              <img
                alt={alt}
                src={src}
                title={title}
                style={{ width: "100%" }}
              />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
        <button className={styles.close} onClick={onClose}>
          <img className={styles.img} src={close} />
        </button>
      </div>
    </div>
  );
};

export default PaperModal;
