import _get from "lodash-es/get";
import React from "react";
import { Dropdown, Grid, Header, Segment } from "semantic-ui-react";
import { titleCase } from "../utils";

import pokeapi from "../pokeapi";
import PokemonDetails from "./PokemonDetails";
import "./style.css";

interface PokemonPageState {
  loading: boolean;
  pokedex: null | PokedexEntry[];
  pokemon: null | string;
}

interface PokedexEntry {
  entry_number: number;
  pokemon_species: {
    name: string;
  };
}

export default class PokemonPage extends React.Component<{}, PokemonPageState> {
  public state = {
    loading: true,
    pokedex: null,
    pokemon: null,
  };

  constructor(props) {
    super(props);
    this.handlePokemon = this.handlePokemon.bind(this);
  }

  public async componentDidMount() {
    if (this.state.pokedex === null) {
      this.setState({ loading: true });
      const data = await pokeapi.getPokedexByName("kanto");
      this.setState({ loading: false, pokedex: data.pokemon_entries });
    }
  }

  public handlePokemon(_: any, { value }: { value: string }) {
    this.setState({ pokemon: value });
  }

  public render() {
    const { pokemon, pokedex } = this.state;

    return (
      <Segment vertical={true}>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column>
              <Header as="h2">Defender Info</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PokemonDropdown
                onChange={this.handlePokemon}
                pokedex={pokedex}
                value={pokemon}
                placeholder="Defending Pokemon"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched={true}>
            <PokemonDetails pokemon={pokemon} />
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

function PokemonDropdown({
  onChange,
  pokedex,
  value,
  placeholder,
}: {
  onChange?: (ev, el) => void;
  pokedex: PokedexEntry[];
  value: string;
  placeholder?: string;
}) {
  let options;
  if (pokedex) {
    options = pokedex.map(pokemon => ({
      key: pokemon.pokemon_species.name,
      text: titleCase(pokemon.pokemon_species.name),
      value: pokemon.pokemon_species.name,
    }));
  } else if (value) {
    options = [{ key: value, text: titleCase(value), value }];
  } else {
    options = [];
  }

  return (
    <Dropdown
      compact={true}
      fluid={true}
      placeholder={placeholder}
      search={true}
      selection={true}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
}

export interface PokemonSpecies {
  name: string;
  names: PokemonName[];
  pokedex_numbers: PokedexNumber[];
}

interface PokemonName {
  name: string;
  language: {
    name: string;
  };
}

interface PokedexNumber {
  entry_number: number;
  pokedex: {
    name: string;
  };
}

export interface PokemonVariety {
  name: string;
}
