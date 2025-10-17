const DOENCIAS = [
  { id: 'lepto', nome: 'Leptospirose' },
  { id: 'raiva', nome: 'Raiva' },
  { id: 'pulgas', nome: 'Pulgas/Parasitas' },
  { id: 'outros', nome: 'Outros (especificar)' }
];

let animais = JSON.parse(localStorage.getItem('animais')) || [];
let observacoes = JSON.parse(localStorage.getItem('observacoes')) || [];

// Elementos
const animalSelect = document.getElementById('animalSelect');
const nomeAnimal = document.getElementById('nomeAnimal');
const proprietario = document.getElementById('proprietario');
const raca = document.getElementById('raca');
const idade = document.getElementById('idade');
const addAnimalBtn = document.getElementById('addAnimalBtn');
const removeAnimalBtn = document.getElementById('removeAnimalBtn');
const diseasesGrid = document.getElementById('diseasesGrid');
const historyList = document.getElementById('historyList');
const clearAllBtn = document.getElementById('clearAll');
const animaisCadastradosDiv = document.getElementById('animaisCadastrados');
const animalInfoDiv = document.getElementById('animalInfo');

// Função para salvar no localStorage
function salvarLocalStorage() {
  localStorage.setItem('animais', JSON.stringify(animais));
  localStorage.setItem('observacoes', JSON.stringify(observacoes));
}

// 🐮 Adicionar animal
addAnimalBtn.addEventListener('click', () => {
  const nome = nomeAnimal.value.trim();
  const prop = proprietario.value.trim();
  const r = raca.value.trim();
  const i = idade.value.trim();

  // Validação atualizada
  if (!nome || !prop || !r || !i) return alert('Preencha todos os campos!');
  if (isNaN(i) || Number(i) < 0) return alert('Digite uma idade válida (não negativa)');

  const id = Date.now().toString();
  animais.push({ id, nome, proprietario: prop, raca: r, idade: i });
  nomeAnimal.value = proprietario.value = raca.value = idade.value = '';

  atualizarAnimais();
  renderAnimaisCadastrados();
  salvarLocalStorage();
});

// 🐄 Atualizar select de animais (com nome + proprietário)
function atualizarAnimais() {
  animalSelect.innerHTML = '';
  animais.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.raca} (${a.nome})`; // <-- aqui mudamos
    animalSelect.appendChild(opt);
  });
}

// 🐾 Quando seleciona animal, atualiza histórico
animalSelect.addEventListener('change', () => {
  renderHistorico();
});

// 🧪 Renderizar doenças
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

      let observacaoExtra = '';
      if (diseaseId === 'outros') {
        observacaoExtra = prompt('Descreva o sinal clínico:');
        if (!observacaoExtra) return;
      }

      observacoes.push({
        id: Date.now().toString(),
        animalId,
        diseaseId,
        descricao: observacaoExtra,
        timestamp: new Date().toLocaleString()
      });

      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    });
  });
}

// 📜 Renderizar histórico
function renderHistorico() {
  historyList.innerHTML = '';
  const animalId = animalSelect.value;
  const obsAnimal = observacoes.filter(o => o.animalId === animalId);
  const animal = animais.find(a => a.id === animalId);

  if (animal) {
    animalInfoDiv.innerHTML = `
      <strong>Nome:</strong> ${animal.nome} <br>
      <strong>Proprietário:</strong> ${animal.proprietario} <br>
      <strong>Raça:</strong> ${animal.raca} <br>
      <strong>Idade:</strong> ${animal.idade} anos
    `;
  } else {
    animalInfoDiv.innerHTML = '';
  }

  obsAnimal.forEach(o => {
    const doença = DOENCIAS.find(d => d.id === o.diseaseId);
    const extra = o.descricao ? ` (${o.descricao})` : '';
    const li = document.createElement('li');
    li.textContent = `${doença.nome}${extra} - ${o.timestamp}`;

    // Botão para remover doença
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.background = 'red';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '3px';
    removeBtn.style.cursor = 'pointer';

    removeBtn.addEventListener('click', () => {
      observacoes = observacoes.filter(obs => obs.id !== o.id);
      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    });

    li.appendChild(removeBtn);
    historyList.appendChild(li);
  });
}

// 🧼 Limpar histórico do animal atual
clearAllBtn.addEventListener('click', () => {
  const animalId = animalSelect.value;
  observacoes = observacoes.filter(o => o.animalId !== animalId);
  renderHistorico();
  renderAnimaisCadastrados();
  salvarLocalStorage();
});

// ❌ Remover animal
removeAnimalBtn.addEventListener('click', () => {
  const animalId = animalSelect.value;
  if (!animalId) return alert('Selecione um animal para remover!');
  if (!confirm('Tem certeza que deseja remover este animal e todo o histórico?')) return;

  animais = animais.filter(a => a.id !== animalId);
  observacoes = observacoes.filter(o => o.animalId !== animalId);

  atualizarAnimais();
  renderAnimaisCadastrados();
  renderHistorico();
  salvarLocalStorage();
});

// 🐮 Renderizar lista de animais cadastrados + doenças associadas
function renderAnimaisCadastrados() {
  animaisCadastradosDiv.innerHTML = '';
  animais.forEach(a => {
    const obsAnimal = observacoes.filter(o => o.animalId === a.id);
    let doencasTexto = '';

    if (obsAnimal.length > 0) {
      doencasTexto = obsAnimal.map(o => {
        const d = DOENCIAS.find(dd => dd.id === o.diseaseId);
        return d.nome + (o.descricao ? ` (${o.descricao})` : '');
      }).join(', ');
    } else {
      doencasTexto = 'Nenhuma doença registrada';
    }

    const div = document.createElement('div');
    div.className = 'animal-card';
    div.innerHTML = `
      <strong>${a.nome}</strong><br>
      Proprietário: ${a.proprietario}<br>
      Raça: ${a.raca}<br>
      Idade: ${a.idade} anos<br>
      <strong>Doenças:</strong> ${doencasTexto}
    `;
    animaisCadastradosDiv.appendChild(div);
  });
}

// 🚀 Inicializa
atualizarAnimais();
renderDoencas();
renderAnimaisCadastrados();
renderHistorico();
