import React from "react";
import { Label } from "semantic-ui-react";

import { titleCase } from "../utils";

export default class TypeBadge extends React.Component<{
  type: string;
}> {
  render() {
    const { type } = this.props;
    return <Label style={{ minWidth: 64 }}>{titleCase(type)}</Label>;
  }
}
