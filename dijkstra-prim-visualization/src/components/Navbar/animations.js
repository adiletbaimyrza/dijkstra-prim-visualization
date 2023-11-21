const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts the animations for the given edge IDs.
 * @param {string[]} edgeIds - The IDs of the edges to animate.
 * @returns {Promise<void>} - A promise that resolves when the animations are complete.
 */
const startAnimations = async (edgeIds) => {
  const changeStrokeColor = async (edgeIds) => {
    for (const id of edgeIds) {
      const edge = document.getElementById(id);
      edge.style.stroke = "#3fb950";
      edge.style.strokeWidth = "8";

      await sleep(1000);
    }

    for (const id of edgeIds) {
      const edge = document.getElementById(id);
      edge.style.stroke = "#c709cb";
    }

    await sleep(5000);
  };

  const resetColors = async (edgeIds) => {
    for (const id of edgeIds) {
      const edge = document.getElementById(id);
      edge.style.stroke = "#33b3ae";
      edge.style.strokeWidth = "2";
    }
  };

  await changeStrokeColor(edgeIds);
  await resetColors(edgeIds);
};

export { startAnimations };
