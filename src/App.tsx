import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import "semantic-ui-css/semantic.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { HomePage } from "./HomePage";
import MissingPage from "./MissingPage";
import PokemonPage from "./PokemonPage";
import TypesPage from "./TypesPage/index";

import "./style.css";

export default class App extends Component {
  public render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <>
          <Header />
          <Container className="root">
            <Switch>
              <Route exact={true} path="/" component={HomePage} />
              <Route path="/pokemon" component={PokemonPage} />
              <Route path="/types" component={TypesPage} />
              <Route component={MissingPage} />
            </Switch>
          </Container>
          <Footer />
        </>
      </BrowserRouter>
    );
  }
}
