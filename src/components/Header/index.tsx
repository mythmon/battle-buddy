import React from "react";
import { Image, Menu, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

import "./style.css";

function Header() {
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
        <Menu.Item as={Link} to="/types">
          Types
        </Menu.Item>
        <Menu.Item as={Link} to="/pokemon">
          Pokemon
        </Menu.Item>
      </Container>
    </Menu>
  );
}

export default Header;
