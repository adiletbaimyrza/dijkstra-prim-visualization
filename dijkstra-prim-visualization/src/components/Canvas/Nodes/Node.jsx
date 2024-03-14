import PropTypes from "prop-types";
import { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import { GraphParamsContext } from "../../../contexts";
import styles from "./Node.module.css";

const CIRCLE_RADIUS = "20";

const Node = ({ id, cx, cy, onNodeClick }) => {
  const { nodes, setNodes, edges, setEdges } = useContext(GraphParamsContext);

  const groupRef = useRef();

  const handleDrag = (event) => {
    const group = d3.select(groupRef.current);

    group.attr("transform", `translate(${event.x}, ${event.y})`);

    const circleId = parseInt(group.select("circle").attr("id"), 10);
    const itsEdges = edges.filter((edge) => {
      if (edge.firstNode.id === circleId || edge.secondNode.id === circleId) {
        return edge;
      }
    });

    itsEdges.forEach((itsEdge) => {
      const edgeElement = document.getElementById(`${itsEdge.id}`);

      if (itsEdge.firstNode.id === circleId) {
        edgeElement.setAttribute("x1", itsEdge.firstNode.x + event.x);
        edgeElement.setAttribute("y1", itsEdge.firstNode.y + event.y);
      } else if (itsEdge.secondNode.id === circleId) {
        edgeElement.setAttribute("x2", itsEdge.secondNode.x + event.x);
        edgeElement.setAttribute("y2", itsEdge.secondNode.y + event.y);
      }

      const x1 = parseFloat(edgeElement.getAttribute("x1"));
      const y1 = parseFloat(edgeElement.getAttribute("y1"));
      const x2 = parseFloat(edgeElement.getAttribute("x2"));
      const y2 = parseFloat(edgeElement.getAttribute("y2"));

      document
        .getElementById(`${itsEdge.id}-weight`)
        .setAttribute("x", (x1 + x2) / 2);
      document
        .getElementById(`${itsEdge.id}-weight`)
        .setAttribute("y", (y1 + y2) / 2);
    });
  };

  const handleDragEnd = (event) => {
    const group = d3.select(groupRef.current);
    group.attr("transform", null);
    group
      .select("circle")
      .attr("cx", parseFloat(group.select("circle").attr("cx")) + event.x)
      .attr("cy", parseFloat(group.select("circle").attr("cy")) + event.y);
    group
      .select("text")
      .attr("x", parseFloat(group.select("text").attr("x")) + event.x)
      .attr("y", parseFloat(group.select("text").attr("y")) + event.y);

    const newNodes = nodes.map((node) => {
      const cx = parseFloat(
        document.getElementById(node.id).getAttribute("cx"),
      );
      const cy = parseFloat(
        document.getElementById(node.id).getAttribute("cy"),
      );

      return {
        id: node.id,
        x: cx,
        y: cy,
      };
    });

    setNodes(newNodes);

    const newEdges = edges.map((edge) => {
      const edgeElement = document.getElementById(edge.id);
      const x1 = parseFloat(edgeElement.getAttribute("x1"));
      const y1 = parseFloat(edgeElement.getAttribute("y1"));
      const x2 = parseFloat(edgeElement.getAttribute("x2"));
      const y2 = parseFloat(edgeElement.getAttribute("y2"));

      return {
        id: edge.id,
        weight: edge.weight,
        firstNode: { ...edge.firstNode, x: x1, y: y1 },
        secondNode: { ...edge.secondNode, x: x2, y: y2 },
      };
    });

    setEdges(newEdges);
  };

  useEffect(() => {
    const nodeDragHandler = d3
      .drag()
      .subject(() => {
        const group = d3.select(groupRef.current).node();
        const transform = group.getCTM();
        return { x: transform.e, y: transform.f };
      })
      .on("drag", (event) => handleDrag(event))
      .on("end", (event) => handleDragEnd(event));

    nodeDragHandler(d3.select(groupRef.current));
  }, [edges, nodes]);

  return (
    <g
      ref={groupRef}
      className={styles.node}
      onClick={(event) => onNodeClick(event, { id: id, x: cx, y: cy })}
    >
      <circle
        className={styles.circle}
        id={id}
        cx={cx}
        cy={cy}
        r={CIRCLE_RADIUS}
      />
      <text
        className={styles.text}
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {id}
      </text>
    </g>
  );
};

export default Node;

Node.propTypes = {
  onNodeClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};
