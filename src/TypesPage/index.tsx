import { History, Location } from "history";
import React from "react";
import { match as matchType, withRouter } from "react-router-dom";
import { Dropdown, Grid, Header, Icon, Segment } from "semantic-ui-react";

import ErrorDisplay, { ErrorDetail } from "../components/ErrorDisplay";
import TypeBadge from "../components/TypeBadge";
import pokeapi from "../pokeapi";
import { titleCase } from "../utils";
import TypeSummary from "./TypeSummary";

interface TypesPageProps {
  match: matchType<{ types?: string }>;
  location: Location;
  history: History;
}

interface TypesPageState {
  error: null | ErrorDetail;
  typeList: null | PokedexType[];
}

interface PokedexType {
  name: string;
}

class TypesPage extends React.Component<TypesPageProps, TypesPageState> {
  public state = {
    error: null,
    typeList: null,
  };

  public async componentDidMount() {
    if (this.state.typeList === null) {
      const data = await pokeapi.getTypesList();
      this.setState({ typeList: data.results });
    }
    this.checkTypes();
  }

  public componentWillReceiveProps(newProps) {
    this.checkTypes(newProps);
  }

  public handleTypes(index) {
    if (index < 0 || index > 1) {
      throw new Error(`Invalid index ${index}`);
    }
    return (_event, { value }: { value: string }) => {
      const { match, history } = this.props;
      let types = (match.params.types || "").split(",");
      types[index] = value;
      types = types.filter(t => !!t);
      const newUrl = match.path.replace(":types?", types.join(","));
      history.push(newUrl);
    };
  }

  public render() {
    const { typeList, error } = this.state;
    const types = this.getTypes();

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
              {error ? (
                <ErrorDisplay error={error} />
              ) : types.length > 0 ? (
                <>
                  <div data-types={JSON.stringify(types)} />
                  <TypeSummary types={types} />
                </>
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

  private getTypes({ match } = this.props) {
    return (match.params.types || "")
      .split(",")
      .slice(0, 2)
      .filter(t => !!t);
  }

  private checkTypes(props = this.props) {
    const { typeList } = this.state;
    if (!typeList) {
      return;
    }
    const types = this.getTypes(props);
    for (const type of types) {
      if (!typeList.some(typeDefinition => typeDefinition.name === type)) {
        // tslint:disable-next-line: no-console
        console.error("Invalid type:", type, "not included in", typeList);
        this.setState({
          error: {
            description: (
              <>
                <TypeBadge type={type} /> isn't a valid type
              </>
            ),
          },
        });
        return;
      }
    }
    this.setState({ error: null });
  }
}

export default withRouter(TypesPage);

function TypeDropdown({ value, typeList, onChange, placeholder }) {
  let options;
  if (typeList) {
    options = typeList.map(type => ({
      key: type.name,
      text: titleCase(type.name),
      value: type.name,
    }));
  } else {
    options = [];
  }
  if (value && !options.some(o => o.value === value)) {
    options.push({ key: value, text: titleCase(value), value });
  }
  options.sort((a: { text: string }, b: { text: string }) =>
    a.text.localeCompare(b.text),
  );

  return (
    <Dropdown
      compact={true}
      fluid={true}
      placeholder={placeholder}
      search={true}
      selection={true}
      clearable={true}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
}
