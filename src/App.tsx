import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "semantic-ui-css/semantic.css";
import "./App.css";
import TypesPage from "./TypesPage/index";
import Header from "./components/Header";

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
          </Switch>
        </>
      </BrowserRouter>
    );
  }
}
