import React from "react";
import { Segment, Icon } from "semantic-ui-react";

import "./style.css";

export default function Footer() {
  return (
    <Segment vertical secondary size="mini" className="site-footer">
      <p>
        Data is from <a href="https://pokeapi.co/">The PokéAPI</a>. Pokémon and
        Pokémon character names are trademarks of Nintendo.
      </p>
    </Segment>
  );
}
