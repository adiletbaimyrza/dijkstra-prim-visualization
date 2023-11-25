const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GREEN = "#3fb950";
const PURPLE = "#c709cb";
const YELLOW = "yellow";
const INITIAL_EDGE_COLOR = "#33b3ae";
const INITIAL_STROKE_WIDTH = "2";
const SELECT_STROKE_WIDTH = "8";
const UNSELECT_STROKE_WIDTH = "3";

const startAnimations = async (animationsData) => {
  const changeStyles = async (animationsData) => {
    for (const step of animationsData.stepsWithIds) {
      for (const edgeId of step.checkedEdgeIds) {
        const edge = document.getElementById(edgeId);
        edge.style.stroke = YELLOW;

        await sleep(500);

        resetEdgeStyles(edgeId);

        await sleep(500);
      }

      const edge = document.getElementById(step.selectedEdgeId);

      edge.style.stroke = GREEN;
      edge.style.strokeWidth = SELECT_STROKE_WIDTH;

      await sleep(1000);
    }

    if (animationsData.algorithmType === "prim") {
      for (const step of animationsData.stepsWithIds) {
        const edge = document.getElementById(step.selectedEdgeId);
        edge.style.stroke = PURPLE;
      }
    } else if (animationsData.algorithmType === "dijkstra") {
      const unselectedEdgeIds = animationsData.stepsWithIds.filter((step) => {
        return !animationsData.shortestPath.some(
          (selectedEdge) => selectedEdge.selectedEdgeId === step.selectedEdgeId,
        );
      });
      for (const step of unselectedEdgeIds) {
        const unselectedEdge = document.getElementById(step.selectedEdgeId);
        unselectedEdge.style.strokeWidth = UNSELECT_STROKE_WIDTH;
      }
      for (const edgeData of animationsData.shortestPath) {
        const edge = document.getElementById(edgeData.selectedEdgeId);
        edge.style.stroke = PURPLE;
      }
    } else {
      console.error("ERROR: Invalid algorithmType");
    }

    await sleep(5000);
  };

  const resetEdgeStyles = (edgeId) => {
    const edge = document.getElementById(edgeId);
    edge.style.stroke = INITIAL_EDGE_COLOR;
    edge.style.strokeWidth = INITIAL_STROKE_WIDTH;
  };

  const resetAllStyles = async (animationsData) => {
    if (animationsData.algorithmType === "prim") {
      animationsData.stepsWithIds.forEach((step) => {
        resetEdgeStyles(step.selectedEdgeId);
      });
    } else {
      animationsData.stepsWithIds.forEach((step) => {
        resetEdgeStyles(step.selectedEdgeId);
      });
      animationsData.shortestPath.forEach((edge) => {
        resetEdgeStyles(edge.selectedEdgeId);
      });
    }
  };

  await changeStyles(animationsData);
  await resetAllStyles(animationsData);
};

export { startAnimations };
