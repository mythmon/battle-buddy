import React from "react";
import {
  Container,
  Loader,
  Dropdown,
  Grid,
  Header,
  Card,
  Dimmer
} from "semantic-ui-react";
import { Map } from "immutable";

import { titleCase } from "../utils";
import pokedex from "../pokedex";

interface TypesPageState {
  typeList: null | Array<PokedexType>;
  types: Array<string>;
}

interface PokedexType {
  name: string;
}

class TypesPage extends React.Component<{}, TypesPageState> {
  state = {
    typeList: null,
    types: [null, null]
  };

  async componentDidMount() {
    if (this.state.typeList === null) {
      const data = await pokedex.getTypesList();
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
          <TypeSummary types={types.filter(t => !!t)} />
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
      key="first-type"
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

interface TypeSummaryProps {
  types: Array<string>;
}

interface TypeSummaryState {
  typeData: { [type: string]: TypeData };
  loading: boolean;
}

interface TypeData {}

class TypeSummary extends React.Component<TypeSummaryProps, TypeSummaryState> {
  state = {
    typeData: {},
    loading: false
  };

  async fetchTypeData(types = this.props.types) {
    for (const type of types) {
      if (this.state.typeData[type]) {
        continue;
      }
      this.setState({ loading: true });
      let newTypeData = { ...this.state.typeData };
      newTypeData[type] = await pokedex.getTypeByName(type);
      this.setState({ typeData: newTypeData });
    }
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.fetchTypeData();
  }

  componentWillReceiveProps(newProps) {
    this.fetchTypeData(newProps.types);
  }

  calcDamageMultipliers(): Map<string, number> {
    let multipliers: Map<string, number> = Map();
    for (const defenseType of this.props.types) {
      if (!this.state.typeData[defenseType]) {
        continue;
      }
      let { damage_relations } = this.state.typeData[defenseType];
      for (const { name: attackType } of damage_relations.double_damage_from) {
        multipliers = multipliers.update(attackType, 1, (v: number) => v * 2);
      }
      for (const { name: attackType } of damage_relations.half_damage_from) {
        multipliers = multipliers.update(attackType, 1, (v: number) => v / 2);
      }
      for (const { name: attackType } of damage_relations.no_damage_from) {
        multipliers = multipliers.set(attackType, 0);
      }
    }
    return multipliers;
  }

  render() {
    const { types } = this.props;
    const { loading } = this.state;

    let multipliers = this.calcDamageMultipliers()
      .entrySeq()
      .map(([type, multiplier]) => ({ type, multiplier }))
      .sort((a, b) => {
        if (a.multiplier > b.multiplier) {
          return -1;
        } else if (a.multiplier < b.multiplier) {
          return 1;
        } else {
          return a.type.localeCompare(b.type);
        }
      })
      .toJS();

    return (
      <Grid.Row>
        <Grid.Column>
          <Card fluid>
            <Dimmer active={loading}>
              <Loader active={loading} />
            </Dimmer>
            <Card.Content>
              <Card.Header>
                {types.length > 0 && (
                  <>
                    {titleCase(types[0])}
                    {types.slice(1).map(t => (
                      <span key={t}> × {titleCase(t)}</span>
                    ))}
                  </>
                )}
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <ul>
                {multipliers.map(({ type, multiplier }) => (
                  <li key={type}>
                    {type}: {multiplier}x
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default TypesPage;
