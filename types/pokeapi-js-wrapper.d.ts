declare module "pokeapi-js-wrapper" {
  export class Pokedex {
    constructor(t?: PokedexOptions);
    resource(e: any): any;

    getTypesList();
  }

  interface PokedexOptions {
  }
}