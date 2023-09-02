const rowCharacters = document.getElementById("cards");
let currentPage = 1;
const cardsPerPage = 6; // Número de cards por página
let charactersData = [];
let currentCharacterId = null; // Armazena o ID do personagem atual

// Carregar os dados da página inicial
loadData(currentPage);

async function loadData(page) {
  try {
    if (charactersData.length === 0) {
      const characters = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
      charactersData = characters.data.results;
    }

    // Calcular o índice de início e fim para os cards a serem exibidos
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const visibleCharacters = charactersData.slice(startIndex, endIndex);

    renderCards(rowCharacters, visibleCharacters);

    // Obter informações sobre locais
    const locations = await axios.get('https://rickandmortyapi.com/api/location');
    const locationsCount = locations.data.info.count;

    // Obter informações sobre episódios
    const episodes = await axios.get('https://rickandmortyapi.com/api/episode');
    const episodesCount = episodes.data.info.count;

    // Atualizar os contadores
    updateCounters(visibleCharacters.length, charactersData.length, locationsCount, episodesCount);

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function renderCards(element, characters) {
  let html = "";

  characters.forEach((character) => {

    const carId = `card-modal-${character.id}`;

    html += `
      <div class="card animate__animated animate__zoomIn" data-bs-toggle="modal" data-bs-target="#${carId}">
        <img src="${character.image}" alt="${character.name} image">
        <div class="cardData">
          <div class="cardTitle">
            <h2>${character.name}</h2>
            <div>
              <span class="statusIcon" style="color: ${getStatusColor(character.status)}">&#x25cf;</span>
              <span>${character.status === "unknown" ? 'Unknown' : character.status} - ${character.species}</span>
            </div>
          </div>
          <div class="cardInfo">
            <h4>Status:</h4>
            <p>${character.status}</p>
          </div>
          <div class="cardInfo">
            <h4>Última Localização:</h4>
            <p>${character.location.name}</p>
          </div>
          <div class="cardInfo">
            <h4>Espécie:</h4>
            <p>${character.species}</p>
          </div>
        </div>
      </div>
    `;

    html += `
      <div class="modal fade" id="${carId}" tabindex="-1" aria-labelledby="${carId}Label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="${carId}Label">${character.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${character.image}" alt="${character.name} image">
              <div class="modal-info">
                <h4>Status:</h4>
                <p>${character.status}</p>
              </div>
              <div class="modal-info">
                <h4>Última Localização:</h4>
                <p>${character.location.name}</p>
              </div>
              <div class="modal-info">
                <h4>Espécie:</h4>
                <p>${character.species}</p>
              </div>
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  element.innerHTML = html;

  // Remove a animação inicial após o carregamento da página
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("animate__animated");
      card.classList.remove("animate__zoomIn");
    });
  }, 1500);
}

function getStatusColor(status) {
  switch (status) {
    case 'Dead':
      return 'red';
    case 'Alive':
      return 'limegreen';
    default:
      return '#858585';
  }
}

function updateCounters(visibleCount, totalCharacters, locationsCount, episodesCount) {
  document.getElementById('counterCharacters').textContent = `PERSONAGENS: ${visibleCount} de ${totalCharacters}`;
  document.getElementById('counterLocations').textContent = `LOCAIS: ${locationsCount}`;
  document.getElementById('counterEpisodes').textContent = `EPISÓDIOS: ${episodesCount}`;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadData(currentPage);
  }
}

function nextPage() {
  currentPage++;
  loadData(currentPage);
}

// Evento de escuta para a tecla "Enter" no campo de pesquisa
document.getElementById('search').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Evento de clique no ícone de lupa
document.querySelector('.searchField svg').addEventListener('click', function () {
  performSearch();
});

// Função para realizar a pesquisa
function performSearch() {
  const searchTerm = document.getElementById('search').value.trim(); // Obtém o termo de pesquisa e remove espaços em branco extras

  if (searchTerm === '') {
    return; // Não faz nada se o campo de pesquisa estiver vazio
  }

  // Procura um personagem com o nome correspondente no conjunto de personagens visíveis
  const matchingCharacter = charactersData.find(character => character.name.toLowerCase() === searchTerm.toLowerCase());

  if (matchingCharacter) {
    // Se um personagem correspondente for encontrado, abra o modal
    const carId = `card-modal-${matchingCharacter.id}`;
    const modal = new bootstrap.Modal(document.getElementById(carId));
    modal.show();
  } else {
    // Caso contrário, exiba uma mensagem de erro ao usuário
    alert("Personagem não encontrado")
    console.error('Personagem não encontrado.');
  }
}















