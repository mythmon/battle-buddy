import { History, Location } from "history";
import _get from "lodash-es/get";
import React from "react";
import { match as matchType, withRouter } from "react-router-dom";
import { Dropdown, Grid, Header, Segment } from "semantic-ui-react";

import pokeapi from "../pokeapi";
import { titleCase } from "../utils";
import PokemonDetails from "./PokemonDetails";
import "./style.css";

interface PokemonPageProps {
  match: matchType<{ name: string }>;
  location: Location;
  history: History;
}

interface PokemonPageState {
  loading: boolean;
  pokedex: null | PokedexEntry[];
}

interface PokedexEntry {
  entry_number: number;
  pokemon_species: {
    name: string;
  };
}

class PokemonPage extends React.Component<PokemonPageProps, PokemonPageState> {
  public state = {
    loading: true,
    pokedex: null,
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
    const { history, match } = this.props;
    const newUrl = match.path.replace(":name?", value);
    history.push(newUrl);
  }

  public render() {
    const { match } = this.props;
    const { pokedex } = this.state;

    return (
      <Segment vertical>
        <Grid stackable>
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
                value={match.params.name}
                placeholder="Defending Pokemon"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <PokemonDetails pokemon={match.params.name} />
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default withRouter(PokemonPage);

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
  } else {
    options = [];
  }

  if (value && !options.some(o => o.value === value)) {
    options.push({ key: value, text: titleCase(value), value });
  }

  return (
    <Dropdown
      compact
      fluid
      placeholder={placeholder}
      search
      selection
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
