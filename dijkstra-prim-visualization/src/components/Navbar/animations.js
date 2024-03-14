const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const UNSELECT_EDGE_COLOR = " rgb(48, 231, 36)";
const SELECTED_EDGE_COLOR = "#c709cb";
const CHECKED_EDGE_COLOR = "yellow";
const INITIAL_EDGE_COLOR = "#33b3ae";
const INITIAL_STROKE_WIDTH = "2";
const SELECT_STROKE_WIDTH = "8";
const UNSELECT_STROKE_WIDTH = "3";
const CANDIDATE_STROKE_WIDTH = "12";

const setTotalWeight = (weight) => {
  const totalWeightContainer = document.getElementById("totalWeight");
  totalWeightContainer.innerText = `${weight}`;
};

const resetTotalWeight = () => {
  const totalWeightContainer = document.getElementById("totalWeight");
  totalWeightContainer.innerText = "0";
};

const highlightResultPath = (animationsData) => {
  if (animationsData.algorithmType === "prim") {
    for (const step of animationsData.stepsWithIds) {
      const edge = document.getElementById(step.selectedEdgeId);
      edge.style.stroke = SELECTED_EDGE_COLOR;
      edge.style.strokeWidth = SELECT_STROKE_WIDTH;
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
      edge.style.stroke = SELECTED_EDGE_COLOR;
      edge.style.strokeWidth = SELECT_STROKE_WIDTH;
    }
  } else {
    console.error("ERROR: Invalid algorithmType");
  }
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

const startAnimations = async (animationsData, speed, setAnimating) => {
  let total = 0;

  for (const step of animationsData.stepsWithIds) {
    for (const edgeId of step.checkedEdgeIds) {
      const edge = document.getElementById(edgeId);
      edge.style.stroke = CHECKED_EDGE_COLOR;
      edge.style.strokeWidth = CANDIDATE_STROKE_WIDTH;

      await sleep(500 / speed);

      resetEdgeStyles(edgeId);

      await sleep(500 / speed);
    }

    const edge = document.getElementById(step.selectedEdgeId);

    edge.style.stroke = UNSELECT_EDGE_COLOR;
    edge.style.strokeWidth = SELECT_STROKE_WIDTH;

    if (animationsData.algorithmType === "prim") {
      total += step.weight;
    } else if (animationsData.algorithmType === "dijkstra") {
      total = step.weight;
    } else {
      console.error("ERROR: Invalid algorithmType");
    }
    setTotalWeight(total);

    await sleep(1000 / speed);
  }

  highlightResultPath(animationsData);

  await sleep(5000);

  await resetAllStyles(animationsData);
  resetTotalWeight();

  setAnimating(false);
};

const startInstantAnimations = async (animationsData, speed, setAnimating) => {
  highlightResultPath(animationsData);

  setTotalWeight(animationsData.total);

  await sleep(4000);

  await resetAllStyles(animationsData);
  resetTotalWeight();

  setAnimating(false);
};

export { startAnimations, startInstantAnimations };
