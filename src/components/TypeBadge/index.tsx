import React from "react";
import { Label, Placeholder } from "semantic-ui-react";

import { titleCase } from "../../utils";
import "./style.css";

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <Label as="span" className={`type ${type}`}>
      <span className="inner">{titleCase(type)}</span>
    </Label>
  );
}

TypeBadge.Placeholder = () => {
  return <Placeholder className="type placeholder" as="span" />;
};
