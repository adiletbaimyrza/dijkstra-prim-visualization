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
      edge.style.stroke = "green";
      edge.style.strokeWidth = "10";

      await sleep(1000);
    }

    for (const animation of animations) {
      const edge = document.getElementById(animation.selectedEdgeId);
      edge.style.stroke = "violet";
    }

    await sleep(3000);
  };

  const resetColor = (edgeId) => {
    const edge = document.getElementById(edgeId);
    edge.style.stroke = "red";
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
