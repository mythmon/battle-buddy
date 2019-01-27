import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";

export interface ErrorDetail {
  description: string | React.ReactElement<any>;
  source?: { toString: () => string };
}

export default function ErrorDisplay({ error }: { error: ErrorDetail }) {
  if (!error) {
    return null;
  }
  return (
    <Segment textAlign="center" inverted color="red">
      <Header icon>
        <Icon name="exclamation" />
        Something has gone terribly wrong.
      </Header>
      <p>{error.description}</p>
      {error.source && <p className="subtle">{error.source.toString()}</p>}
    </Segment>
  );
}
