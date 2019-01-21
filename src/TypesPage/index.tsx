import React from "react";
import {
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  Loader,
  Segment,
} from "semantic-ui-react";

import pokeapi from "../pokeapi";
import { titleCase } from "../utils";
import TypeSummary from "./TypeSummary";

interface TypesPageState {
  typeList: null | PokedexType[];
  types: string[];
}

interface PokedexType {
  name: string;
}

export default class TypesPage extends React.Component<{}, TypesPageState> {
  public state = {
    typeList: null,
    types: [null, null],
  };

  public async componentDidMount() {
    if (this.state.typeList === null) {
      const data = await pokeapi.getTypesList();
      this.setState({ typeList: data.results });
    }
  }

  public handleTypes(index) {
    if (index < 0 || index > 1) {
      throw new Error(`Invalid index ${index}`);
    }
    return (e, { value }: { value: string }) => {
      this.setState(state => {
        state.types[index] = value;
        const newTypes = state.types.filter(t => !!t);
        while (newTypes.length < 2) {
          newTypes.push(null);
        }
        return { types: newTypes };
      });
    };
  }

  public render() {
    const { types, typeList } = this.state;

    if (typeList === null) {
      return <Loader active={true} />;
    }

    return (
      <Segment vertical={true}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h2">Defender Info</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <TypeDropdown
                onChange={this.handleTypes(0)}
                typeList={typeList}
                value={types[0]}
                placeholder={"First Type"}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TypeDropdown
                onChange={this.handleTypes(1)}
                typeList={typeList}
                value={types[1]}
                placeholder={"Second Type"}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {types && types.some(t => !!t) ? (
                <TypeSummary types={types.filter(t => !!t)} />
              ) : (
                <Segment placeholder={true}>
                  <Header icon={true}>
                    <Icon name="search" />
                    Search for a type to begin
                  </Header>
                </Segment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

function TypeDropdown({ value, typeList, onChange, placeholder }) {
  const typeDropdownOptions = typeList.map(type => ({
    key: type.name,
    text: titleCase(type.name),
    value: type.name,
  }));

  return (
    <Dropdown
      compact={true}
      fluid={true}
      placeholder={placeholder}
      search={true}
      selection={true}
      clearable={true}
      options={typeDropdownOptions}
      onChange={onChange}
      value={value}
    />
  );
}
