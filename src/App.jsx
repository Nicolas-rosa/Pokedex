import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles based on the selected theme
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    transition: background 0.3s, color 0.3s;
    font-family: 'Arial', sans-serif;
    overflow-x: hidden; /* Impede a barra de rolagem horizontal */
  }
`;

const themes = {
  light: {
    background: '#f5f5f5', // Fundo claro com um toque de cinza
    color: '#333', // Texto escuro
    cardBackground: '#fff', // Fundo do card branco
    borderColor: '#ddd', // Borda do card cinza claro
    titleColor: '#d32f2f', // Título em vermelho
    typeBackground: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      poison: '#4a00f8',
      bug: '#fad327',
      ghost: '#cc00ff',
      flying: '#009da8',
      ground: '#8d5000',
      rock: '#0000009f',
      normal: '#0000009f',
      ice: '#00f7ff',
      psychic: '#001aff',
      electric: '#fffc47',
      fighting: 'orange',
    },
  },
  dark: {
    background: 'linear-gradient(to bottom, #121212, #212121)', // Gradiente de fundo escuro
    color: '#fff', // Texto branco
    cardBackground: '#282c34', // Fundo do card cinza escuro
    borderColor: '#333', // Borda do card cinza escuro
    titleColor: '#ff4081', // Título em rosa
    typeBackground: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      poison: '#4a00f8',
      bug: '#fad327',
      ghost: '#cc00ff',
      flying: '#009da8',
      ground: '#8d5000',
      rock: '#0000009f',
      normal: '#0000009f',
      ice: '#00f7ff',
      psychic: '#001aff',
      electric: '#fffc47',
      fighting: 'orange',
    },
  },
  cyberpunk: {
    background: 'linear-gradient(to bottom, #120718, #20152b)', // Gradiente de fundo cyberpunk
    color: '#00ffcc', // Texto azul claro
    cardBackground: '#1c1c1c', // Fundo do card cinza escuro
    borderColor: '#00ffcc', // Borda do card azul claro
    titleColor: '#ff007f', // Título em rosa
    typeBackground: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      poison: '#4a00f8',
      bug: '#fad327',
      ghost: '#cc00ff',
      flying: '#009da8',
      ground: '#8d5000',
      rock: '#0000009f',
      normal: '#0000009f',
      ice: '#00f7ff',
      psychic: '#001aff',
      electric: '#fffc47',
      fighting: 'orange',
    },
  },
  retro: {
    background: 'linear-gradient(to bottom, #f0e68c, #fff5b7)', // Gradiente de fundo amarelo claro
    color: '#333', // Texto escuro
    cardBackground: '#fff5b7', // Fundo do card amarelo claro
    borderColor: '#d1c7a6', // Borda do card amarelo claro
    titleColor: '#5c4d2d', // Título marrom escuro
    typeBackground: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      poison: '#4a00f8',
      bug: '#fad327',
      ghost: '#cc00ff',
      flying: '#009da8',
      ground: '#8d5000',
      rock: '#0000009f',
      normal: '#0000009f',
      ice: '#00f7ff',
      psychic: '#001aff',
      electric: '#fffc47',
      fighting: 'orange',
    },
  },
  ocean: {
    background: 'linear-gradient(to bottom, #0077be, #005f8c)', // Gradiente de fundo azul escuro
    color: '#fff', // Texto branco
    cardBackground: '#005f8c', // Fundo do card azul escuro
    borderColor: '#003f5c', // Borda do card azul escuro
    titleColor: '#00bfff', // Título azul claro
    typeBackground: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      poison: '#4a00f8',
      bug: '#fad327',
      ghost: '#cc00ff',
      flying: '#009da8',
      ground: '#8d5000',
      rock: '#0000009f',
      normal: '#0000009f',
      ice: '#00f7ff',
      psychic: '#001aff',
      electric: '#fffc47',
      fighting: 'orange',
    },
  },
};

// Emojis para cada tema
const themeEmojis = {
  light: '☀️',
  dark: '🌙',
  cyberpunk: '🤖',
  retro: '🎮',
  ocean: '🌊',
};

// Função para categorizar Pokémons por tipo
const categorizePokemons = (pokemons) => {
  const categorized = {};
  pokemons.forEach(pokemon => {
    pokemon.types.forEach(type => {
      const typeName = type.type.name;
      if (!categorized[typeName]) {
        categorized[typeName] = [];
      }
      categorized[typeName].push(pokemon);
    });
  });
  return categorized;
};

// Componente principal
function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const itemsPerPage = 10; // Número de itens por página
  const [categorizedPokemons, setCategorizedPokemons] = useState({}); // Estado para Pokémons categorizados
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para a categoria selecionada
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para gerenciar erros

  const getPokemons = (id) => {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Erro ao buscar Pokémon:", error);
        throw error;
      });
  };

  const arrayPokemons = () => {
    return Promise.all(Array.from({ length: 150 }, (_, index) => getPokemons(index + 1)));
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const pokemonData = await arrayPokemons();
        setPokemons(pokemonData);
        setCategorizedPokemons(categorizePokemons(pokemonData));
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar Pokémons:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      return pokemons;
    }
    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredPokemons = handleSearch();

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const body = document.body;
      if (prevTheme === 'light') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        return 'dark';
      } else if (prevTheme === 'dark') {
        body.classList.remove('dark-theme');
        body.classList.add('cyberpunk-theme');
        return 'cyberpunk';
      } else if (prevTheme === 'cyberpunk') {
        body.classList.remove('cyberpunk-theme');
        body.classList.add('retro-theme');
        return 'retro';
      } else if (prevTheme === 'retro') {
        body.classList.remove('retro-theme');
        body.classList.add('ocean-theme');
        return 'ocean';
      } else {
        body.classList.remove('ocean-theme')
         return 'light';
      }
    });
  };

  // Função para mudar a página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calcula o índice inicial e final da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemons = selectedCategory
    ? categorizedPokemons[selectedCategory].slice(indexOfFirstItem, indexOfLastItem)
    : filteredPokemons.slice(indexOfFirstItem, indexOfLastItem);

  // Cria uma lista de números de página
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(selectedCategory
    ? categorizedPokemons[selectedCategory].length / itemsPerPage
    : filteredPokemons.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Indicador de carregamento
  const Loader = styled.div`
    border: 8px solid #f3f3f3; /* Cor do fundo */
    border-top: 8px solid #3498db; /* Cor do indicador */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    display: flex;
    margin: auto;
    margin-top: 25%;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Componente de erro
  const ErrorComponent = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    color: #d9534f; /* Vermelho de erro */
  `;

  if (loading) {
    return <Loader />;
  } else if (error) {
    return (
      <ErrorComponent>
        <h1>Ocorreu um erro ao buscar Pokémons:</h1>
        <p>{error.message}</p>
      </ErrorComponent>
    );
  } else {
    return (
      <Container theme={themes[theme]}>
        <GlobalStyle theme={themes[theme]} />
        <Card theme={themes[theme]}>
        <Pokeball />
          <Title theme={themes[theme]}>Pokedex</Title>
         
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Pesquisar Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <ThemeToggleButton onClick={toggleTheme}>
            {themeEmojis[theme]}
            <h1>Tema</h1>
          </ThemeToggleButton>
          <CategorySelector>
            <CategoryOption onClick={() => setSelectedCategory(null)}>Todos</CategoryOption>
            {Object.keys(categorizedPokemons).map(category => (
              <CategoryOption key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </CategoryOption>
            ))}
          </CategorySelector>
          <PokemonList>
            {currentPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} theme={themes[theme]}>
                <CardContent>
                  <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
                  <PokemonInfo>
                    <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <p>Altura: {pokemon.height}</p>
                    <p>Peso: {pokemon.weight}</p>
                    <p>Tipo(s): {pokemon.types.map(typeInfo => (
                      <Type key={typeInfo.type.name} className={typeInfo.type.name} theme={themes[theme]}>
                        {typeInfo.type.name}
                      </Type>
                    )).reduce((prev, curr) => [prev, ', ', curr])}</p>
                  </PokemonInfo>
                </CardContent>
              </PokemonCard>
            ))}
          </PokemonList>
          <PaginationContainer>
            <PaginationButton onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              Primeiro
            </PaginationButton>
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Anterior
            </PaginationButton>
            {pageNumbers.map(number => (
              <PaginationButton key={number} onClick={() => handlePageChange(number)} active={currentPage === number}>
                {number}
              </PaginationButton>
            ))}
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
              Próximo
            </PaginationButton>
            <PaginationButton onClick={() => handlePageChange(pageNumbers.length)} disabled={currentPage === pageNumbers.length}>
              Último
            </PaginationButton>
          </PaginationContainer>
        </Card>
      </Container>
    );
  }
}

// Container principal
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: ${({ theme }) => theme.background}; /* Aplicando o background do tema no Container */
  color: ${({ theme }) => theme.color}; /* Aplicando a cor do tema no Container */
  
  @media (max-width: 768px) {
    /* Estilos para telas menores que 768px */
    flex-direction: column; 
  }
`;

// Card principal
const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%;
  max-width: 800px;
  border: 2px solid ${({ theme }) => theme.borderColor};
  position: relative; // Para posicionar o ícone no canto superior
`;

// Título
const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.titleColor};
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // Adiciona sombra ao título para destaque
`;

// Contêiner de pesquisa
const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border: 2px solid ${({ theme }) => theme.titleColor};
  border-radius: 5px;
  padding: 5px;
`;

// Campo de entrada de pesquisa
const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #ffffff;
  color: #455a64;
  transition: border 0.2s;

  &:focus {
    outline: none;
  }
`;

// Botão para alternar tema
const ThemeToggleButton = styled.button`
  margin: 10px auto;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: ${({ theme }) => theme.titleColor};
  color: black;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.titleColor === '#d32f2f' ? '#ff4081' : '#ff007f'};
  }
`;

// Lista de Pokémon
const PokemonList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  gap: 20px; /* Adiciona espaçamento entre os cards */
`;

// Card de Pokémon
const PokemonCard = styled.li`
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  margin: 10px;
  padding: 15px;
  background: ${({ theme }) => theme.cardBackground};
  transition: transform 0.2s, box-shadow 0.2s;
  flex: 1 1 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Adiciona sombra ao card para um efeito 3D
  text-align: center; // Centraliza o conteúdo do card

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// Conteúdo do card de Pokémon
const CardContent = styled.div`
  display: flex;
  flex-direction: column; // Organize o conteúdo do card em colunas
  align-items: center;
  justify-content: center;
`;

// Imagem do Pokémon
const PokemonImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 10px; // Adiciona um espaço entre a imagem e o texto
  border-radius: 50%; // Arredonda a imagem do Pokémon
  border: 2px solid #fff ; // Adiciona uma borda branca à imagem para destaque
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Adiciona sombra à imagem para um efeito 3D
`;

// Informações do Pokémon
const PokemonInfo = styled.div`
  text-align: center; // Centraliza o texto das informações
  color: ${({ theme }) => theme.color};
`;

// Tipos de Pokémon
const Type = styled.span`
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  margin-right: 5px;
  color: white;
  background-color: ${({ theme, className }) => theme.typeBackground[className] || '#000'};
`;

// SVG da Pokébola
const PokeballSVG = styled.svg`
  width: 10%;
  height: 4%;
  margin: 20px auto;
  fill: none;
  stroke: #d32f2f;
  stroke-width: 2;
  position: absolute; // Posiciona a Pokébola no topo
  top: 10px; // Ajuste a posição vertical
  right: 10px; // Ajuste a posição horizontal
`;

// Componente de Pokébola
const Pokeball = () => (
  <PokeballSVG viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#fff" stroke="#000" strokeWidth="5" />
    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="#d32f2f" stroke="#000" strokeWidth="5" />
    <path d="M 5 50 A 45 45 0 0 0 95 50" fill="#fff" stroke="#000" strokeWidth="5" />
    <line x1="5" y1="50" x2="95" y2="50" stroke="#000" strokeWidth="5" />
    <circle cx="50" cy="50" r="10" fill="#000" stroke="#000" strokeWidth="5" />
    <circle cx="50" cy="50" r="5" fill="#fff" />
  </PokeballSVG>
);

// Botão "Mostrar Mais"
const ShowMoreButton = styled.button`
  margin: 20px auto;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #4CAF50; // Verde
  color: white;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #45a049; // Verde mais escuro
  }
`;

// Contêiner de paginação
const PaginationContainer = styled.div`
   display: flex;
  justify-content: center;
  margin-bottom: 10px;
  flex-wrap: wrap; // Permite que os botões se quebrem em várias linhas
  gap: 10px; // Adiciona espaçamento entre os botões
`;

// Botão de paginação
const PaginationButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background: ${({ active }) => active ? '#4CAF50' : '#e0e0e0'}; // Verde se ativo, cinza claro se não
  color: black;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ active }) => active ? '#45a049' : '#bdbdbd'}; // Verde mais escuro se ativo, cinza mais escuro se não
  }

  &:disabled {
    background: #e0e0e0; // Cinza claro se desabilitado
    cursor: not-allowed;
  }
`;

// Contêiner do seletor de categorias
const CategorySelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  flex-wrap: wrap; // Permite que os botões se quebrem em várias linhas
  gap: 10px; // Adiciona espaçamento entre os botões
`;

// Opção de categoria
const CategoryOption = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background: ${({ theme, active }) => active ? theme.titleColor : '#e0e0e0'}; // Cor do tema se ativo, cinza claro se não
  color: black;
  cursor: pointer;
  transition: background  0.3s;

  &:hover {
    background: ${({ theme, active }) => active ? theme.titleColor === '#d32f2f' ? '#ff4081' : '#ff007f' : '#bdbdbd'}; // Cor do tema se ativo, cinza mais escuro se não
  }

  &:disabled {
    background: #e0e0e0; // Cinza claro se desabilitado
    cursor: not-allowed;
  }
`;

export default App;
