import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container, Placeholder } from "semantic-ui-react";

import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

import "semantic-ui-css/semantic.css";
import "./style.css";

// Set up lazy loaded pages. React will instruct the browser to prefetch them,
// meaning "resource is probably needed for some navigation in the future".

// tslint:disable:variable-name
const MissingPage = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./MissingPage"),
);
const HomePage = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./HomePage"),
);
const PokemonPage = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./PokemonPage"),
);
const TypesPage = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./TypesPage/index"),
);
// tslint:enable:variable-name

function Fallback() {
  return (
    <Placeholder>
      <Placeholder.Header />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder>
  );
}

export default class App extends Component {
  public render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <>
          <Header />
          <Container className="root">
            <React.Suspense fallback={<Fallback />}>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route path="/pokemon/:name?">
                  <PokemonPage />
                </Route>
                <Route path="/types/:types?">
                  <TypesPage />
                </Route>
                <Route>
                  <MissingPage />
                </Route>
              </Switch>
            </React.Suspense>
          </Container>
          <Footer />
        </>
      </BrowserRouter>
    );
  }
}
