import React from "react";
import { Grid, Card, Dimmer, Loader } from "semantic-ui-react";
import { Map } from "immutable";

import pokeapi from "../pokeapi";
import { titleCase } from "../utils";

interface TypeSummaryProps {
  types: Array<string>;
}

interface TypeSummaryState {
  typeData: { [type: string]: TypeData };
  loading: boolean;
}

interface TypeData {}

export default class TypeSummary extends React.Component<
  TypeSummaryProps,
  TypeSummaryState
> {
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
      newTypeData[type] = await pokeapi.getTypeByName(type);
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
    );
  }
}
