import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Segment } from "semantic-ui-react";

import "./style.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <Segment vertical className="site-info">
        <p>
          Battle Buddy is a tool to help you win battles in Pokemon Let's Go.
        </p>
        <p>
          There are two tools. The first shows{" "}
          <Link to="/pokemon">information about Pokemon</Link>, and what types
          they are strong and weak against.
        </p>
        <p>
          The second lets you pick <Link to="/types">any types you want</Link>,
          and it shows what types that combination is strong and weak against
        </p>
      </Segment>
    </div>
  );
}
