import PropTypes from "prop-types";
import styles from "./Node.module.css";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Node = ({ id, cx, cy, onNodeClick /* onNodeMouseDown */ }) => {
  const groupRef = useRef();

  useEffect(() => {
    const nodeDragHandler = d3
      .drag()
      .subject(() => {
        const group = d3.select(groupRef.current).node();
        const transform = group.getCTM();
        return { x: transform.e, y: transform.f };
      })
      .on("drag", (event) => {
        const group = d3.select(groupRef.current);
        group.attr("transform", `translate(${event.x}, ${event.y})`);
      })
      .on("end", (event) => {
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
      });

    nodeDragHandler(d3.select(groupRef.current));
  }, []);

  return (
    <g
      ref={groupRef}
      className={styles.node}
      onClick={(event) => onNodeClick(event, { id: id, x: cx, y: cy })}
      /* onClick={(event) => onNodeClick(event)} */
      /* onMouseDown={() => onNodeMouseDown({ id: id, x: cx, y: cy })} */
    >
      <circle className={styles.circle} id={id} cx={cx} cy={cy} r="20" />
      <text
        id={`${id}-text`}
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

// Ensures that the required props are passed and have the correct type
Node.propTypes = {
  onNodeClick: PropTypes.func.isRequired,
  /* onNodeMouseDown: PropTypes.func.isRequired, */
  id: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};
