declare module "pokeapi-js-wrapper" {
  export class Pokedex {
    [x: string]: any;
    constructor(t?: PokedexOptions);
    public resource(e: any): any;

    public getTypesList(): PaginatedList<NamedResource>;
    public getPokemonSpeciesByName(name: string): Promise<PokemonSpecies>;
    public getPokedexByName(name: string): Promise<Pokedex>;
    public getTypeByName(name: string): Promise<PokemonType>;
  }

  interface PaginatedList<T> {
    results: Array<T>;
    count: number;
    next: null | string;
    previous: null | string;
  }

  interface PokedexOptions {
    protocol?: string;
  }

  interface Pokedex {
    entry_number: number;
    pokemon_species: {
      name: string;
    };
  }

  interface PokemonSpecies {
    genera: Array<LocalizedGenus>;
    flavor_text_entries: Array<LocalizedFlavorText>;
    name: string;
    names: Array<PokemonName>;
    pokedex_numbers: Array<PokedexNumber>;
    varieties: Array<PokemonVarietyPointer>;
  }

  interface PokemonVarietyPointer {
    is_default: boolean;
    pokemon: {
      name: string;
    };
  }

  interface PokemonName {
    name: string;
    language: {
      name: string;
    };
  }

  interface PokedexNumber {
    entry_number: number;
    pokedex: {
      name: string;
    };
  }

  interface PokemonVariety {
    name: string;
    is_default: boolean;
    sprites: {
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    types: Array<PokemonTypeSlot>;
  }

  export interface PokemonTypeSlot {
    slot: number;
    type: NamedResource;
  }

  interface NamedResource {
    name: string;
    url: string;
  }

  interface LocalizedGenus {
    genus: string;
    language: NamedResource;
  }

  interface LocalizedFlavorText {
    flavor_text: string;
    language: NamedResource;
    version: NamedResource;
  }

  export interface PokemonType {
    damage_relations: {
      double_damage_from: Array<NamedResource>;
      double_damage_to: Array<NamedResource>;
      half_damage_from: Array<NamedResource>;
      half_damage_to: Array<NamedResource>;
      no_damage_from: Array<NamedResource>;
      no_damage_to: Array<NamedResource>;
    };
  }
}
