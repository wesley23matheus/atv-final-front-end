
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
    showCharacter(matchingCharacter.id);
  } else {
    // Caso contrário, exiba uma mensagem de erro ao usuário
    console.error('Personagem não encontrado.');
  }
}

// Função para abrir o modal com base no ID do personagem
// modal.js

function showCharacter(id) {
  axios
    .get("https://rickandmortyapi.com/api/character/" + id)
    .then((response) => {
      const character = response.data;
      const statusColor = getStatusColor(character.status);

      document.getElementById('modalCharName').innerHTML = character.name;
      document.getElementById('modalAvatar').src = character.image;
      document.getElementById('modalStatusIcon').style.color = statusColor;
      document.getElementById('modalStatus').innerHTML = character.status;
      document.getElementById('modalSpecies').innerHTML = character.species;
      document.getElementById('modalType').innerHTML = character.type || "-";

      // Abre o modal após definir os dados
      const movieModal = new bootstrap.Modal(document.getElementById("video-modal"));
      movieModal.show();
    })
    .catch((error) => {
      console.error("Ocorreu algum erro ao obter os dados do personagem. Verifique o log de console:", error);
    });
}

// Evento de clique no botão de fechar do modal
document.querySelector('.modal-footer button').addEventListener('click', () => {
  closeModal();
});

// Função para fechar o modal
function closeModal() {
  const movieModal = new bootstrap.Modal(document.getElementById("video-modal"));
  movieModal.hide();
}





  
  
  
  
  





      