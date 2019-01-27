import React from "react";
import { Link } from "react-router-dom";
import { Container, Icon, Image, Menu } from "semantic-ui-react";

import "./style.css";

export default function Header() {
  const logoUrl = process.env.PUBLIC_URL + "/logo.svg";
  return (
    <Menu
      className="top-nav"
      inverted
      borderless
      color="red"
      style={{ borderRadius: 0 }}
    >
      <Container>
        <Menu.Item as={Link} to="/">
          <Image src={logoUrl} spaced="right" className="logo" />
          Battle Buddy
        </Menu.Item>
        <Menu.Item as={Link} to="/pokemon">
          Pokemon
        </Menu.Item>
        <Menu.Item as={Link} to="/types">
          Types
        </Menu.Item>
        <Menu.Item
          icon
          position="right"
          as="a"
          href="https://github.com/mythmon/battle-buddy"
        >
          <Icon name="github" />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
