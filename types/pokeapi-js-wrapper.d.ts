declare module "pokeapi-js-wrapper" {
  export class Pokedex {
    constructor(t?: PokedexOptions);
    public resource(e: any): any;

    public getTypesList();
  }

  interface PokedexOptions {
    protocol?: string;
  }
}
