import cx from "classnames";
import { Map } from "immutable";
import React from "react";
import { Card, Dimmer, Grid, Label, List, Loader } from "semantic-ui-react";

import TypeBadge from "../components/TypeBadge";
import pokeapi from "../pokeapi";
import { titleCase } from "../utils";
import "./style.css";

interface TypeSummaryProps {
  types: string[];
}

interface TypeSummaryState {
  typeData: { [type: string]: TypeData };
  loading: boolean;
}

interface TypeData {
  name: string;
}

export default class TypeSummary extends React.Component<
  TypeSummaryProps,
  TypeSummaryState
> {
  public state = {
    loading: false,
    typeData: {},
  };

  public async fetchTypeData(types = this.props.types) {
    for (const type of types) {
      if (this.state.typeData[type]) {
        continue;
      }
      this.setState({ loading: true });
      const newTypeData = { ...this.state.typeData };
      newTypeData[type] = await pokeapi.getTypeByName(type);
      this.setState({ typeData: newTypeData });
    }
    this.setState({ loading: false });
  }

  public componentDidMount() {
    this.fetchTypeData();
  }

  public componentWillReceiveProps(newProps) {
    this.fetchTypeData(newProps.types);
  }

  public calcDamageMultipliers(): Map<string, number> {
    let multipliers: Map<string, number> = Map();
    for (const defenseType of this.props.types) {
      if (!this.state.typeData[defenseType]) {
        continue;
      }
      const { damage_relations } = this.state.typeData[defenseType];
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
    return multipliers.filter(m => m !== 1);
  }

  public render() {
    const { types } = this.props;
    const { loading } = this.state;

    const multipliers = this.calcDamageMultipliers()
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
      <Card fluid={true}>
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
          <List>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  {multipliers
                    .filter(({ multiplier }) => multiplier >= 1)
                    .map(({ type, multiplier }) => (
                      <List.Item key={type} className="type-multiplier">
                        <TypeBadge type={type} />
                        <MultiplierBadge by={multiplier} />
                      </List.Item>
                    ))}
                </Grid.Column>
                <Grid.Column width={8}>
                  {multipliers
                    .filter(({ multiplier }) => multiplier < 1)
                    .map(({ type, multiplier }) => (
                      <List.Item key={type} className="type-multiplier">
                        <TypeBadge type={type} />
                        <MultiplierBadge by={multiplier} />
                      </List.Item>
                    ))}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </List>
        </Card.Content>
      </Card>
    );
  }
}

function MultiplierBadge({ by }) {
  const { text = by.toString(), color, fraction = false } = {
    "0": { text: "0x", color: "black" },
    "0.25": { text: "¼", color: "purple", fraction: true },
    "0.5": { text: "½", color: "red", fraction: true },
    "1": { text: "1x" },
    "2": { text: "2x", color: "green" },
    "4": { text: "4x", color: "blue" },
  }[by.toString()];

  return (
    <Label
      className={cx("multiplier-badge", { fraction })}
      circular={true}
      size="large"
      color={color}
    >
      <span>{text}</span>
    </Label>
  );
}
