import React from "react";
import {
  Loader,
  Container,
  Grid,
  Dropdown,
  Card,
  Dimmer,
  Image,
  DimmerDimmable,
  Label,
  Header,
  Segment,
  Icon
} from "semantic-ui-react";
import { titleCase } from "../utils";
import _get from "lodash-es/get";

import pokeapi from "../pokeapi";
import TypeSummary from "../TypesPage/TypeSummary";
import TypeBadge from "../components/TypeBadge";
import "./style.css";

interface PokemonPageState {
  loading: boolean;
  pokedex: null | Array<PokedexEntry>;
  pokemon: null | string;
}

interface PokedexEntry {
  entry_number: number;
  pokemon_species: {
    name: string;
  };
}

export default class PokemonPage extends React.Component<{}, PokemonPageState> {
  state = {
    loading: true,
    pokedex: null,
    // pokemon: null
    pokemon: "charizard"
  };

  constructor(props) {
    super(props);
    this.handlePokemon = this.handlePokemon.bind(this);
  }

  async componentDidMount() {
    if (this.state.pokedex === null) {
      this.setState({ loading: true });
      const data = await pokeapi.getPokedexByName("kanto");
      this.setState({ loading: false, pokedex: data.pokemon_entries });
    }
  }

  handlePokemon(_: any, { value }: { value: string }) {
    this.setState({ pokemon: value });
  }

  render() {
    const { loading, pokemon, pokedex } = this.state;
    if (loading) {
      return <Loader active={true} />;
    }

    return (
      <Segment vertical>
        <Grid>
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
          <PokemonDetails pokemon={pokemon} />
        </Grid>
      </Segment>
    );
  }
}

function PokemonDropdown({
  onChange,
  pokedex,
  value,
  placeholder
}: {
  onChange?: (ev, el) => void;
  pokedex: Array<PokedexEntry>;
  value: string;
  placeholder?: string;
}) {
  const options = pokedex.map(pokemon => ({
    key: pokemon.pokemon_species.name,
    value: pokemon.pokemon_species.name,
    text: titleCase(pokemon.pokemon_species.name)
  }));

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

function keyedValue(
  data: Array<{ [key: string]: any }> = [],
  search: { [key: string]: any }
) {
  return (
    data.find(d =>
      Object.keys(search).every(key => _get(d, key) == search[key])
    ) || {}
  );
}

interface PokemonSpecies {
  name: string;
  names: Array<PokemonName>;
  pokedex_numbers: Array<PokedexNumber>;
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

interface PokemonVariety {}

interface PokemonDetailsProps {
  pokemon: string;
}

interface PokemonDetailsState {
  loading: boolean;
  speciesDetails: null | PokemonSpecies;
  varieties: { [name: string]: PokemonVariety };
  chosenVariety: null | string;
}

class PokemonDetails extends React.Component<
  PokemonDetailsProps,
  PokemonDetailsState
> {
  state = {
    loading: false,
    speciesDetails: null,
    varieties: {},
    chosenVariety: null
  };

  async fetchPokemonDetails({ pokemon } = this.props) {
    if (!pokemon) {
      return;
    }
    this.setState({ loading: true });
    let speciesDetails = await pokeapi.getPokemonSpeciesByName(pokemon);
    this.setState({ speciesDetails });

    let chosenVariety = null;

    let varietyPromises = speciesDetails.varieties.map(
      async ({ is_default, pokemon: variety }) => {
        if (is_default) {
          chosenVariety = variety.name;
        }
        return pokeapi.getPokemonByName(variety.name);
      }
    );
    let varieties = {};
    for (const varietyPromise of varietyPromises) {
      const variety = await varietyPromise;
      varieties[variety.name] = variety;
    }
    if (!chosenVariety) {
      chosenVariety = await varietyPromises[0].name;
    }

    this.setState({ loading: false, varieties, chosenVariety });
  }

  componentDidMount() {
    this.fetchPokemonDetails();
  }

  componentWillReceiveProps(newProps) {
    this.fetchPokemonDetails(newProps);
  }

  render() {
    const { loading, speciesDetails, varieties, chosenVariety } = this.state;

    const variety = varieties && varieties[chosenVariety];

    return (
      <>
        <Grid.Row>
          <Grid.Column>
            <Dimmer.Dimmable as={Card} fluid dimmed={loading} blurring>
              <Dimmer active={loading} inverted>
                <Loader />
              </Dimmer>
              <PokemonInfo species={speciesDetails} variety={variety} />
            </Dimmer.Dimmable>
          </Grid.Column>
        </Grid.Row>
        {variety && (
          <Grid.Row>
            <Grid.Column>
              <TypeSummary types={variety.types.map(t => t.type.name)} />
            </Grid.Column>
          </Grid.Row>
        )}
      </>
    );
  }
}

function PokemonInfo({ species, variety }) {
  return (
    <Card.Content>
      {!variety && !species && (
        <Segment placeholder>
          <Header icon>
            <Icon name="search" />
            Search for a defending pokemon to begin
          </Header>
        </Segment>
      )}
      {variety && (
        <Image
          className="pokemon-sprite"
          floated="left"
          src={variety.sprites.front_default}
        />
      )}
      {species && (
        <>
          <Card.Header>
            #
            {
              keyedValue(species.pokedex_numbers, {
                "pokedex.name": "kanto"
              }).entry_number
            }{" "}
            -{" "}
            {
              keyedValue(species.names, {
                "language.name": "en"
              }).name
            }
          </Card.Header>
          <Card.Meta>
            {
              keyedValue(species.genera, {
                "language.name": "en"
              }).genus
            }
          </Card.Meta>
        </>
      )}
      {variety &&
        variety.types.map(({ slot, type: { name } }) => (
          <TypeBadge key={slot} type={name} />
        ))}
      {species && (
        <Card.Description>
          {keyedValue(species.flavor_text_entries, {
            "language.name": "en",
            "version.name": "yellow"
          }).flavor_text.replace("\u000C", " ")}
        </Card.Description>
      )}
    </Card.Content>
  );
}
