import React from "react";
import {
  Card,
  Dimmer,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Segment,
} from "semantic-ui-react";

import { PokemonSpecies, PokemonVariety } from ".";
import TypeBadge from "../components/TypeBadge";
import pokeapi from "../pokeapi";
import TypeSummary from "../TypesPage/TypeSummary";
import { keyedValue } from "../utils";

interface PokemonDetailsProps {
  pokemon: string;
}

interface PokemonDetailsState {
  loading: boolean;
  speciesDetails: null | PokemonSpecies;
  varieties: { [name: string]: PokemonVariety };
  chosenVariety: null | string;
}

export default class PokemonDetails extends React.Component<
  PokemonDetailsProps,
  PokemonDetailsState
> {
  public state = {
    chosenVariety: null,
    loading: false,
    speciesDetails: null,
    varieties: {},
  };

  public async fetchPokemonDetails({ pokemon } = this.props) {
    if (!pokemon) {
      return;
    }
    this.setState({ loading: true });
    const speciesDetails = await pokeapi.getPokemonSpeciesByName(pokemon);
    this.setState({ speciesDetails });

    let chosenVariety = null;

    const varietyPromises = speciesDetails.varieties.map(
      async ({ is_default, pokemon: variety }) => {
        if (is_default) {
          chosenVariety = variety.name;
        }
        return pokeapi.getPokemonByName(variety.name);
      },
    );
    const varieties = {};
    for (const varietyPromise of varietyPromises) {
      const variety = await varietyPromise;
      varieties[variety.name] = variety;
    }
    if (!chosenVariety) {
      chosenVariety = await varietyPromises[0].name;
    }

    this.setState({ loading: false, varieties, chosenVariety });
  }

  public componentDidMount() {
    this.fetchPokemonDetails();
  }

  public componentWillReceiveProps(newProps) {
    this.fetchPokemonDetails(newProps);
  }

  public render() {
    const { loading, speciesDetails, varieties, chosenVariety } = this.state;

    const variety = varieties && varieties[chosenVariety];

    return (
      <>
        <Grid.Row>
          <Grid.Column>
            <Dimmer.Dimmable
              as={Card}
              fluid={true}
              dimmed={loading}
              blurring={true}
            >
              <Dimmer active={loading} inverted={true}>
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
        <Segment placeholder={true}>
          <Header icon={true}>
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
                "pokedex.name": "kanto",
              }).entry_number
            }{" "}
            -{" "}
            {
              keyedValue(species.names, {
                "language.name": "en",
              }).name
            }
          </Card.Header>
          <Card.Meta>
            {
              keyedValue(species.genera, {
                "language.name": "en",
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
            "version.name": "yellow",
          }).flavor_text.replace("\u000C", " ")}
        </Card.Description>
      )}
    </Card.Content>
  );
}