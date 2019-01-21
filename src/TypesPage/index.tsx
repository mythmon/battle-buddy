import React from "react";
import {
  Container,
  Loader,
  Dropdown,
  Grid,
  Header,
  Segment,
  Icon
} from "semantic-ui-react";

import TypeSummary from "./TypeSummary";
import { titleCase } from "../utils";
import pokeapi from "../pokeapi";

interface TypesPageState {
  typeList: null | Array<PokedexType>;
  types: Array<string>;
}

interface PokedexType {
  name: string;
}

export default class TypesPage extends React.Component<{}, TypesPageState> {
  state = {
    typeList: null,
    types: [null, null]
  };

  async componentDidMount() {
    if (this.state.typeList === null) {
      const data = await pokeapi.getTypesList();
      this.setState({ typeList: data.results });
    }
  }

  handleTypes(index) {
    if (index < 0 || index > 1) {
      throw new Error(`Invalid index ${index}`);
    }
    return (e, { value }: { value: string }) => {
      this.setState(state => {
        state.types[index] = value;
        let newTypes = state.types.filter(t => !!t);
        while (newTypes.length < 2) {
          newTypes.push(null);
        }
        return { types: newTypes };
      });
    };
  }

  render() {
    const { types, typeList } = this.state;

    if (typeList === null) {
      return <Loader active />;
    }

    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h2">Defender</Header>
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
                <Segment placeholder>
                  <Header icon>
                    <Icon name="search" />
                    Search for a type to begin
                  </Header>
                </Segment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

function TypeDropdown({ value, typeList, onChange, placeholder }) {
  const typeDropdownOptions = typeList.map(type => ({
    key: type.name,
    value: type.name,
    text: titleCase(type.name)
  }));

  return (
    <Dropdown
      compact
      fluid
      placeholder={placeholder}
      search
      selection
      clearable
      options={typeDropdownOptions}
      onChange={onChange}
      value={value}
    />
  );
}
