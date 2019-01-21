import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "semantic-ui-css/semantic.css";
import "./App.css";
import TypesPage from "./TypesPage/index";
import Header from "./components/Header";
import MissingPage from "./MissingPage";
import PokemonPage from "./PokemonPage";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <>
          <Header />
          <Switch>
            <Route exact path="/">
              <Redirect to="/types" />
            </Route>
            <Route path="/types" component={TypesPage} />
            <Route path="/pokemon" component={PokemonPage} />
            <Route component={MissingPage} />
          </Switch>
        </>
      </BrowserRouter>
    );
  }
}
