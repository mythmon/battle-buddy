import React from "react";
import { Label } from "semantic-ui-react";

import { titleCase } from "../../utils";
import "./style.css";

export default class TypeBadge extends React.Component<{
  type: string;
}> {
  public render() {
    const { type } = this.props;
    return (
      <Label className={`type ${type}`}>
        <span className="inner">{titleCase(type)}</span>
      </Label>
    );
  }
}
