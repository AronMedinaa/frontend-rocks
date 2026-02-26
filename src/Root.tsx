import { useState, useEffect, useCallback } from "react";
import { PokeAPI } from "./api";

interface PokemonCardProps {
  id: number;
  image: string;
  name: string;
  types: string[];
}

const TOTAL_POKEMON = 1025;
const PAGE_SIZE = 8;

async function fetchPokemonBatch(from: number, to: number): Promise<PokemonCardProps[]> {
  const ids = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const results = await Promise.all(
    ids.map(async (i) => {
      const data = await PokeAPI.getPokemonById(i);
      return {
        id: data.id,
        image: data.sprites.other?.["official-artwork"].front_default
          ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types: data.types.map((t) => t.type.name),
      };
    })
  );

  return results;
}

export const Card: React.FC<PokemonCardProps> = ({ id, image, name, types }) => {
  const paddedId = String(id).padStart(4, "0");

  return (
    <div className="w-96 flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg">
      <div className="w-full flex justify-center bg-gray-100 rounded-lg py-8">
        <img
          src={image}
          alt={name}
          className="w-56 h-56 object-contain"
        />
      </div>

      <p className="text-gray-500 text-lg font-semibold">N° {paddedId}</p>

      <h2 className="text-3xl font-bold text-gray-900">{name}</h2>

      <div className="flex gap-3 flex-wrap justify-center">
        {types.map((type) => (
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
  const [pokemon, setPokemon] = useState<PokemonCardProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const batch = await fetchPokemonBatch(1, PAGE_SIZE);
        setPokemon(batch);
        setOffset(PAGE_SIZE);
      } catch (error) {
        console.error("Errore nel caricamento iniziale dei Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || offset >= TOTAL_POKEMON) return;

    const from = offset + 1;
    const to = Math.min(offset + PAGE_SIZE, TOTAL_POKEMON);

    setIsLoadingMore(true);
    try {
      const batch = await fetchPokemonBatch(from, to);
      setPokemon((prev) => [...prev, ...batch]);
      setOffset(to);
    } catch (error) {
      console.error("Errore nel caricamento di ulteriori Pokémon:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, offset]);

  const hasMore = offset < TOTAL_POKEMON;

  return (
    <div className="p-8 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokédex</h1>

      {loading && (
        <p className="text-center text-gray-600 mb-8">Caricamento Pokémon...</p>
      )}

      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemon.map((p) => (
            <Card key={p.id} {...p} />
          ))}
        </div>
      </div>

      {!loading && hasMore && (
        <div className="flex justify-center mt-12 pb-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
          >
            {isLoadingMore ? "Caricamento..." : "Carica altri Pokémon"}
          </button>
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <p className="text-center text-gray-600 mt-12 pb-8 text-lg">
          Hai raggiunto la fine del Pokédex! ({pokemon.length}/{TOTAL_POKEMON} Pokémon)
        </p>
      )}
    </div>
  );
}

function getTypeColor(type: string): string {
  return typeColors[type] ?? "bg-gray-400";
}

function getTypeLabel(type: string): string {
  return typeLabels[type] ?? type;
}

const typeLabels: Record<string, string> = {
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

const typeColors: Record<string, string> = {
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