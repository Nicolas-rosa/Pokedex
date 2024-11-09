import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getPokemons = (id) => {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.data);
  };

  const arrayPokemons = () => {
    return Promise.all(Array.from({ length: 150 }, (_, index) => getPokemons(index + 1)));
  };

  useEffect(() => {
    arrayPokemons().then(pokemonData => {
      setPokemons(pokemonData);
    });
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      return pokemons; // Se o termo de pesquisa estiver vazio, retorne todos os Pokémon
    }

    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredPokemons = handleSearch();

  return (
    <Container>
      <Card>
        <Title>Pokédex</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Pesquisar Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        
        </SearchContainer>
        <PokemonList>
          {filteredPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id}>
              <CardContent>
                <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
                <PokemonInfo>
                  <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                  <p>Altura: {pokemon.height}</p>
                  <p>Peso: {pokemon.weight}</p>
                  <p>Tipo(s): {pokemon.types.map(typeInfo => (
                    <Type key={typeInfo.type.name} className={typeInfo.type.name}>
                      {typeInfo.type.name}
                    </Type>
                  )).reduce((prev, curr) => [prev, ', ', curr])}</p>
                </PokemonInfo>
              </CardContent>
            </PokemonCard>
          ))}
        </PokemonList>
      </Card>
    </Container>
  );
}




// Container principal
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(90deg, rgba(0, 0, 30, 0.8), rgba(0, 0, 60, 0.8)); // Fundo escuro
  backdrop-filter: blur(10px); // Efeito de desfoque
  padding: 20px;
  font-family: 'Press Start 2P', cursive; // Fonte inspirada em Pokémon
`;

// Card principal
const Card = styled.div`
  background: rgba(30, 30, 30, 0.8); // Fundo escuro e translúcido
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.5); // Sombra neon
  padding: 20px;
  width: 90%;
  max-width: 800px;
  border: 2px solid rgba(0, 255, 255, 0.5); // Borda neon
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 255, 255, 1); // Sombra mais intensa ao passar o mouse
  }
`;

// Título
const Title = styled.h1`
  text-align: center;
  color: #00ffff; // Cor neon

`;

// Contêiner de pesquisa
const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// Campo de entrada de pesquisa
const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 0, 0, 0.5); // Borda mais fina e translúcida
  background: rgba(30, 30, 30, 0.8); // Fundo escuro e translúcido
  color: #00ffff; // Cor do texto neon
  transition: border 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #00ffff; // Cor neon ao focar
    outline: none;
    box-shadow: 0 0 5px #00ffff; // Efeito de néon ao focar
  }
`;

// Lista de Pokémon
const PokemonList = styled.ul`
  display: flex;
  flex-wrap: wrap; // Permite que os cards se organizem em uma grade
  list-style-type: none;
  padding: 0;
  justify-content: center;
`;

// Card de Pokémon
const PokemonCard = styled.li`
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 15px;
  margin: 10px;
  padding: 10px;
  background: rgba(30, 30, 30, 0.8); // Fundo escuro e translúcido
  transition: transform 0.2s, box-shadow 0.2s;
  flex: 1 1 200px; // Ajuste para criar uma grade mais uniforme

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 255, 255, 0.5); // Sombra ao passar o mouse
  }
`;

// Conteúdo do card de Pokémon
const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Imagem do Pokémon
const PokemonImage = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 20px;
`;

// Informações do Pokémon
const PokemonInfo = styled.div`
  text-align: left;
  color: #ffffff; // Cor do texto
`;

// Tipos de Pokémon
const Type = styled.span`
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  margin-right: 5px;
  color: white;

  &.grass {
   
    background-color: #78C850;
  }

  &.fire {
    background-color: #F08030;
  }

  &.water {
    background-color: #6890F0;
  }

  &.poison {
    background-color: #4a00f8;
  }

  &.bug {
    background-color: #fad327;
  }

  &.ghost {
    background-color: #cc00ff;
  }

  &.flying {
    background-color: #009da8;
  }

  &.ground {
    background-color: #8d5000;
  }

  &.rock {
    background-color: #0000009f;
  }

  &.normal {
    background-color: #0000009f;
  }

  &.ice {
    background-color: #00f7ff;
  }

  &.psychic {
    background-color: #001aff;
  }

  &.electric {
    background-color: #fffc47;
  }

  &.fighting {
    background-color: orange;
  }

  /* Adicione mais tipos conforme necessário */
`;

export default App;