import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function App() {
  // Define um estado para armazenar os Pokémon, inicialmente como um array vazio
  const [pokemons, setPokemons] = useState([]);

  // Função para buscar informações de um Pokémon pelo ID
  const getPokemons = (id) => {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => {
        const pokemon = response.data; // Armazena os dados do Pokémon retornados
        // Atualiza o estado com o novo Pokémon, mantendo os anteriores
        setPokemons((prevPokemons) => [...prevPokemons, pokemon]);
      });
  };

  // Função para buscar informações de 150 Pokémon
  const arrayPokemons = () => {
    return Promise.all(Array(150).fill().map((_, index) => getPokemons(index + 1)));
  };

  // useEffect é um hook que executa um efeito colateral neste caso, buscar os Pokémon quando o componente é montado
  useEffect(() => {
    arrayPokemons().then(() => {
      console.log('Todos os Pokémon foram carregados'); // Log quando todos os Pokémon são carregados
    });
  }, []); // O array vazio significa que o efeito será executado apenas uma vez, quando o componente for montado

  // Renderiza o componente
  return (
    <Container>
      <Card>
        <Title>Pokédex</Title>
        <PokemonList>
          {pokemons.map((pokemon) => (
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


const Container = styled.div`
  display: flex; // Usa flexbox para alinhar o conteúdo
  justify-content: center; // Centraliza horizontalmente
  align-items: center; // Centraliza verticalmente
  min-height: 100vh; // Define a altura mínima como 100% da altura da viewport
  background: rgb(76,0,255);
background: linear-gradient(90deg, rgba(76,0,255,1) 0%, rgba(29,244,253,1) 50%, rgba(96,69,252,1) 100%); //cor do fundo
`;

const Card = styled.div`
  background-color: red; // Cor de fundo do card
  border-radius: 10px; // Bordas arredondadas
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); // Sombra para dar profundidade
  padding: 20px; // Espaçamento interno
  width: 25%; // Largura do card
`;


const Title = styled.h1`
  text-align: center; // Centraliza o texto
  color: white; // Cor do texto
`;

const PokemonList = styled.ul`
  list-style-type: none; // Remove os marcadores da lista
  padding: 0; // Remove o preenchimento padrão
`;


const PokemonCard = styled.li`
  border: 1px solid #ddd; // Borda cinza clara
  border-radius: 10px; // Bordas arredondadas
  margin: 10px 0; // Margem vertical
  padding: 10px; // Espaçamento interno
  background-color: #f9f9f9; // Cor de fundo do card
  transition: transform 0.2s; // Transição suave para transformações

  &:hover {
    transform: scale(1.3); // Aumenta o tamanho do card ao passar o mouse
  }
`;


const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PokemonImage = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px; /* Espaçamento entre a imagem e as informações */
`;

const PokemonInfo = styled.div`
  text-align: left; /* Alinha o texto à esquerda */
`;

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
    background-color:  #4a00f8;
  }

  &.bug {
    background-color:  #fad327;
  }
  
  &.ghost {
    background-color: #cc00ff;
  }
  &.flying {
    background-color: #009da8;
  }
  &.ground {
    background-color:  #8d5000;
  }
  &.rock {
    background-color: #0000009f;
  }
  
  &.normal {
    background-color: #0000009f;
  }
  &.ice {
    background-color:  #00f7ff;
  }
  &.psychic {
    background-color:  #001aff;
  }
  &.electric {
    background-color:  #fffc47;
  }
  &.fighting {
    background-color:  orange;
  }

  /* Adicione mais tipos conforme necessário */
`;

export default App;