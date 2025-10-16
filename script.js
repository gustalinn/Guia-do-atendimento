// Lista de doenças fixas
const DOENCIAS = [
  { id: 'lepto', nome: 'Leptospirose' },
  { id: 'raiva', nome: 'Raiva' },
  { id: 'pulgas', nome: 'Pulgas/Parasitas' }
];

let animais = [];
let observacoes = [];

const animalSelect = document.getElementById('animalSelect');
const newAnimal = document.getElementById('newAnimal');
const addAnimalBtn = document.getElementById('addAnimalBtn');
const diseasesGrid = document.getElementById('diseasesGrid');
const historyList = document.getElementById('historyList');
const clearAllBtn = document.getElementById('clearAll');

// Adicionar animal
addAnimalBtn.addEventListener('click', () => {
  const nome = newAnimal.value.trim();
  if (!nome) return alert('Digite o nome do animal');
  const id = Date.now().toString();
  animais.push({ id, nome });
  newAnimal.value = '';
  atualizarAnimais();
});

// Atualizar lista de animais no select
function atualizarAnimais() {
  animalSelect.innerHTML = '';
  animais.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.nome;
    animalSelect.appendChild(opt);
  });
}

// Renderizar doenças
function renderDoencas() {
  diseasesGrid.innerHTML = '';
  DOENCIAS.forEach(d => {
    const div = document.createElement('div');
    div.className = 'disease-card';
    div.innerHTML = `
      <span>${d.nome}</span>
      <button data-id="${d.id}">+</button>
    `;
    diseasesGrid.appendChild(div);
  });

  diseasesGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = animalSelect.value;
      if (!animalId) return alert('Selecione um animal primeiro!');
      const diseaseId = btn.getAttribute('data-id');
      observacoes.push({
        id: Date.now().toString(),
        animalId,
        diseaseId,
        timestamp: new Date().toLocaleString()
      });
      renderHistorico();
    });
  });
}

// Renderizar histórico
function renderHistorico() {
  historyList.innerHTML = '';
  const animalId = animalSelect.value;
  const obsAnimal = observacoes.filter(o => o.animalId === animalId);
  obsAnimal.forEach(o => {
    const doença = DOENCIAS.find(d => d.id === o.diseaseId);
    const li = document.createElement('li');
    li.textContent = `${doença.nome} - ${o.timestamp}`;
    historyList.appendChild(li);
  });
}

// Limpar histórico do animal atual
clearAllBtn.addEventListener('click', () => {
  const animalId = animalSelect.value;
  observacoes = observacoes.filter(o => o.animalId !== animalId);
  renderHistorico();
});

// Inicializa
renderDoencas();
