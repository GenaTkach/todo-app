// PriorityBadge.js
import React from "react";
import "../style/PriorityBadge.css";

const PriorityBadge = ({ priority }) => {
  return (
    <span className={`priority-badge priority-${priority}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge