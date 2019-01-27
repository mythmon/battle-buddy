import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  Card,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Placeholder,
  Segment,
} from "semantic-ui-react";

import {
  PokemonSpecies,
  PokemonTypeSlot,
  PokemonVariety,
  PokemonVarietyPointer,
} from "pokeapi-js-wrapper";
import ErrorDisplay from "../components/ErrorDisplay";
import TypeBadge from "../components/TypeBadge";
import pokeapi from "../pokeapi";
import TypeSummary from "../TypesPage/TypeSummary";
import { keyedValue, titleCase } from "../utils";

interface PokemonDetailsProps {
  pokemon: string;
}

interface PokemonDetailsState {
  loading: boolean;
  speciesDetails: null | PokemonSpecies;
  varieties: { [name: string]: PokemonVariety };
  error: null | {
    source: any;
    description: string;
  };
}

export default class PokemonDetails extends React.Component<
  PokemonDetailsProps,
  PokemonDetailsState
> {
  public state = {
    error: null,
    loading: false,
    speciesDetails: null,
    varieties: {},
  };

  public async fetchPokemonDetails({ pokemon } = this.props) {
    if (!pokemon) {
      this.setState({
        speciesDetails: null,
      });
      return;
    }
    try {
      this.setState({ loading: true });
      const speciesDetails = await pokeapi.getPokemonSpeciesByName(pokemon);
      this.setState({ speciesDetails, varieties: {} });

      const varietyPromises = speciesDetails.varieties.map(
        async ({ pokemon: { name: varietyName } }: PokemonVarietyPointer) => {
          return pokeapi.getPokemonByName(varietyName);
        },
      );
      const varieties: { [name: string]: PokemonVariety } = {};
      for (const varietyPromise of varietyPromises) {
        const variety = await varietyPromise;
        varieties[variety.name] = variety;
      }

      this.setState({ loading: false, varieties, error: null });
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err);
      this.setState({
        error: {
          description: "Could not load pokemon information.",
          source: err,
        },
        loading: false,
        speciesDetails: null,
        varieties: {},
      });
    }
  }

  public componentDidMount() {
    this.fetchPokemonDetails();
  }

  public componentWillReceiveProps(newProps: PokemonDetailsProps) {
    this.fetchPokemonDetails(newProps);
  }

  public render() {
    const { pokemon } = this.props;
    const { error, speciesDetails, varieties } = this.state;

    return (
      <>
        {!pokemon && (
          <Grid.Column width={16}>
            <Segment placeholder>
              <Header icon>
                <Icon name="search" />
                Search for a defending pokemon to begin
              </Header>
            </Segment>
          </Grid.Column>
        )}
        {error && (
          <Grid.Column width={16}>
            <ErrorDisplay error={error} />
          </Grid.Column>
        )}
        {speciesDetails && varieties && Object.values(varieties).length ? (
          <PokemonInfo species={speciesDetails} varieties={varieties} />
        ) : (
          <PokemonInfo.Placeholder />
        )}
      </>
    );
  }
}

interface PokemonInfoProps {
  species: PokemonSpecies;
  varieties: { [name: string]: PokemonVariety };
}

function PokemonInfo({ species, varieties }: PokemonInfoProps) {
  const defaultVariety =
    Object.values(varieties).find(v => v.is_default) || varieties[0];
  const [varietyName, setVarietyName] = React.useState(defaultVariety.name);
  useEffect(() => {
    if (!(varietyName in varieties)) {
      setVarietyName(defaultVariety.name);
    }
  }, [varieties]);

  const variety = varieties[varietyName as string];

  const { entry_number } = keyedValue(species.pokedex_numbers, {
    "pokedex.name": "kanto",
  });
  const { name: speciesName } = keyedValue(species.names, {
    "language.name": "en",
  });
  const { genus } = keyedValue(species.genera, { "language.name": "en" });

  return (
    <>
      <Grid.Column width={8}>
        <Card fluid>
          <Card.Content>
            {variety && variety.sprites.front_default ? (
              <Image
                className="pokemon-sprite"
                floated="left"
                src={variety.sprites.front_default}
              />
            ) : (
              <div className="pokemon-sprite placeholder" />
            )}
            {species && (
              <>
                <Card.Header>
                  #{entry_number} - {speciesName}
                </Card.Header>
                <Card.Meta>{genus}</Card.Meta>
              </>
            )}
            {variety &&
              variety.types.map(({ slot, type: { name } }: PokemonTypeSlot) => (
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
            {varieties && Object.values(varieties).length > 1 && (
              <Form>
                <Form.Group inline>
                  {Object.values(varieties).map(v => {
                    const displayName =
                      titleCase(
                        v.name
                          .replace(species.name, "")
                          .replace(/-/g, " ")
                          .trim(),
                      ) || "Kanto";
                    return (
                      <Form.Radio
                        key={v.name}
                        label={displayName}
                        value={v.name}
                        checked={varietyName === v.name}
                        onChange={() => setVarietyName(v.name)}
                      />
                    );
                  })}
                </Form.Group>
              </Form>
            )}
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column width={8}>
        {variety && <TypeSummary types={variety.types.map(t => t.type.name)} />}
      </Grid.Column>
    </>
  );
}

PokemonInfo.Placeholder = () => {
  return (
    <>
      <Grid.Column width={8}>
        <Card fluid>
          <Placeholder>
            <Card.Content>
              <Placeholder.Image className="pokemon-sprite" floated="left" />
              <Card.Header>
                <Placeholder.Header />
              </Card.Header>
              <Card.Meta>
                <Placeholder.Line />
              </Card.Meta>
              <TypeBadge.Placeholder />
              <Card.Description>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Card.Description>
            </Card.Content>
          </Placeholder>
        </Card>
      </Grid.Column>
      <Grid.Column width={8}>
        <TypeSummary.Placeholder />
      </Grid.Column>
    </>
  );
};
