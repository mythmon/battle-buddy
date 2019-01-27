import cx from "classnames";
import { Map } from "immutable";
import React from "react";
import {
  Card,
  Dimmer,
  Grid,
  Label,
  List,
  Placeholder,
} from "semantic-ui-react";

import { PokemonType } from "pokeapi-js-wrapper";
import TypeBadge from "../components/TypeBadge";
import pokeapi from "../pokeapi";
import { titleCase } from "../utils";
import "./style.css";

interface TypeSummaryProps {
  types: Array<string>;
}

interface TypeCollection {
  [name: string]: PokemonType;
}

interface TypeSummaryState {
  typeData: TypeCollection;
  loading: boolean;
}

export default class TypeSummary extends React.Component<
  TypeSummaryProps,
  TypeSummaryState
> {
  // tslint:disable-next-line:variable-name
  public static Placeholder = () => {
    return (
      <Card fluid>
        <Placeholder>
          <Card.Content>
            <Card.Header>
              <Placeholder.Header />
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <List>
              <Grid>
                <Grid.Row>
                  {[0, 1].map(column => (
                    <Grid.Column key={column} width={8}>
                      {[0, 1, 2].map(idx => (
                        <List.Item key={idx} className="type-multiplier">
                          <TypeBadge.Placeholder />
                          <MultiplierBadge.Placeholder />
                        </List.Item>
                      ))}
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </List>
          </Card.Content>
        </Placeholder>
      </Card>
    );
  };

  public state = {
    loading: false,
    typeData: {},
  };

  public async fetchTypeData({ types }: TypeSummaryProps = this.props) {
    const { typeData }: { typeData: TypeCollection } = this.state;
    for (const type of types) {
      if (typeData[type]) {
        continue;
      }
      this.setState({ loading: true });
      const newTypeData: TypeCollection = { ...this.state.typeData };
      newTypeData[type] = await pokeapi.getTypeByName(type);
      this.setState({ typeData: newTypeData });
    }
    this.setState({ loading: false });
  }

  public componentDidMount() {
    this.fetchTypeData();
  }

  public componentWillReceiveProps(newProps: TypeSummaryProps) {
    this.fetchTypeData(newProps);
  }

  public calcDamageMultipliers(): Map<string, number> {
    const { typeData }: { typeData: TypeCollection } = this.state;
    let multipliers: Map<string, number> = Map();
    for (const defenseType of this.props.types) {
      if (!typeData[defenseType]) {
        continue;
      }
      const { damage_relations } = typeData[defenseType];
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

    if (loading) {
      return <TypeSummary.Placeholder />;
    }

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
      <Card fluid>
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

type semanticUiColor = "black" | "purple" | "red" | "green" | "blue";
const multiplierDisplayData: {
  [mult: string]: { text: string; color?: semanticUiColor; fraction?: boolean };
} = {
  "0": { text: "0x", color: "black" },
  "0.25": { text: "¼", color: "purple", fraction: true },
  "0.5": { text: "½", color: "red", fraction: true },
  "1": { text: "1x" },
  "2": { text: "2x", color: "green" },
  "4": { text: "4x", color: "blue" },
};

function MultiplierBadge({ by }: { by: number }) {
  const {
    text = by.toString(),
    color,
    fraction = false,
  } = multiplierDisplayData[by.toString()];

  return (
    <Label
      className={cx("multiplier-badge", { fraction })}
      circular
      size="large"
      color={color}
    >
      <span>{text}</span>
    </Label>
  );
}

MultiplierBadge.Placeholder = () => {
  return <Placeholder.Image className="multiplier-badge placeholder" />;
};
