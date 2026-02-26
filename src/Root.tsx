type Props = {
  id: number;
  image: string;
  name: string;
  types: string[];
};

export const Card: React.FC<Props> = (props) => {
  const paddedId = String(props.id).padStart(4, "0");
  
  return (
    <div className="w-96 flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg">
      <div className="w-full flex justify-center bg-gray-100 rounded-lg py-8">
        <img
          src={props.image}
          alt={props.name}
          className="w-56 h-56 object-contain"
        />
      </div>

      <p className="text-gray-500 text-lg font-semibold">N° {paddedId}</p>

      <h2 className="text-3xl font-bold text-gray-900">{props.name}</h2>

      <div className="flex gap-3 flex-wrap justify-center">
        {props.types.map((type) => (
          <span
            key={type}
            className={`font-bold text-white px-5 py-2 rounded-full text-base ${getTypeColor(type)}`}
          >
            {getTypeLabel(type)}
          </span>
        ))}
      </div>
    </div>
  );
};

export function Root() {
  return (
    <Card
      id={1}
      image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      name="Bulbasaur"
      types={["grass", "poison"]}
    />
  );
}

function getTypeColor(type: string): string {
  return typeColors[type];
}

function getTypeLabel(type: string): string {
  return typeLabels[type];
}

const typeLabels: { [key: string]: string } = {
  fire: "Fuoco",
  water: "Acqua",
  grass: "Erba",
  electric: "Elettro",
  psychic: "Psico",
  ice: "Ghiaccio",
  dragon: "Drago",
  dark: "Scuro",
  fairy: "Folletto",
  normal: "Normale",
  fighting: "Lotta",
  flying: "Volante",
  poison: "Veleno",
  ground: "Terra",
  rock: "Roccia",
  bug: "Coleottero",
  ghost: "Spettro",
  steel: "Acciaio",
};

const typeColors: { [key: string]: string } = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-purple-700",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-700",
  ghost: "bg-indigo-700",
  steel: "bg-gray-500",
};

/*
interface PokemonCard {
  id: number;
  image: string;
  name: string;
  types: string[];
}

async function fetchData(offset: number): Promise<PokemonCard[]> {
  const list = await PokeAPI.listPokemons(offset, 20);
  const pokemons = await Promise.all(
    list.results.map(async (item: { name: string; url: string }) => {
      const pokemon = await PokeAPI.getPokemonByName(item.name);
      return pokemon;
    }),
  );

  return pokemons.map((item) => ({
    id: item.id,
    image: item.sprites.other?.["official-artwork"].front_default ?? "",
    name: item.name,
    types: item.types.map((type) => type.type.name),
  }));
}*/