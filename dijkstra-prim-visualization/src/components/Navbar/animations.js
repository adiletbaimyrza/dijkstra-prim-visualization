const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts the animations for the given edge IDs.
 * @param {string[]} animations - The IDs of the edges to animate.
 *
 * TODO : fix param type above
 *
 * @returns {Promise<void>} - A promise that resolves when the animations are complete.
 */
const startAnimations = async (animations) => {
  const changeStrokeColor = async (animations) => {
    for (const animation of animations) {
      for (const edgeId of animation.edgeIds) {
        const edge = document.getElementById(edgeId);
        edge.style.stroke = "yellow";

        await sleep(500);

        resetColor(edgeId);

        await sleep(500);
      }

      const edge = document.getElementById(animation.selectedEdgeId);
      edge.style.stroke = "#3fb950";
      edge.style.strokeWidth = "8";

      await sleep(1000);
    }

    for (const animation of animations) {
      const edge = document.getElementById(animation.selectedEdgeId);
      edge.style.stroke = "#c709cb";
    }

    await sleep(5000);
  };

  const resetColor = (edgeId) => {
    const edge = document.getElementById(edgeId);
    edge.style.stroke = "#33b3ae";
    edge.style.strokeWidth = "2";
  };

  const resetColors = async (animations) => {
    animations.forEach((animation) => {
      resetColor(animation.selectedEdgeId);
      animation.edgeIds.forEach((edgeId) => resetColor(edgeId));
    });
  };

  await changeStrokeColor(animations);
  await resetColors(animations);
};

export { startAnimations };
