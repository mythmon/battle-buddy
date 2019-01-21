import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "semantic-ui-css/semantic.css";
import "./App.css";
import TypesPage from "./TypesPage/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MissingPage from "./MissingPage";
import PokemonPage from "./PokemonPage";
import { HomePage } from "./HomePage";
import { Container } from "semantic-ui-react";

import "./style.css";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <>
          <Header />
          <Container className="root">
            <Switch>
              <Route exact path="/" component={HomePage} />
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
