import React from "react";
import { Image, Menu, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

import "./Header.css";

function Header() {
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
          <Image src="/logo.svg" spaced="right" className="logo" />
          Battle Buddy
        </Menu.Item>
        <Menu.Item as={Link} to="/type">
          Types
        </Menu.Item>
      </Container>
    </Menu>
  );
}

export default Header;
