import React from "react";
import { Container, Header, Icon } from "semantic-ui-react";

import "./style.css";

export default function MissingPage() {
  return (
    <Container fluid textAlign="center" className="missing-page">
      <Header as="h1" icon>
        <Icon name="question circle" />
        Page not found
        <Header.Subheader>We couldn't find that one</Header.Subheader>
      </Header>
    </Container>
  );
}
