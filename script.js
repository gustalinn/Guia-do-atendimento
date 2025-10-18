const DOENCIAS = [
  { id: 'lepto', nome: 'Leptospirose' },
  { id: 'outros', nome: 'Outros (especificar)' }
];

const VACINAS = [
  { id: 'outros', nome: 'Outros (especificar)' }
];

const VERMIFUGOS = [
  { id: 'outros', nome: 'Outros (especificar)' }
];

let animais = JSON.parse(localStorage.getItem('animais')) || [];
let observacoes = JSON.parse(localStorage.getItem('observacoes')) || [];

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

// Novos campos
const especieInput = document.getElementById('especie');
const sexoInput = document.getElementById('sexo');
const pesoInput = document.getElementById('peso');
const enderecoInput = document.getElementById('endereco');
const cpfInput = document.getElementById('cpf');
const telefoneInput = document.getElementById('telefone');

function salvarLocalStorage() {
  localStorage.setItem('animais', JSON.stringify(animais));
  localStorage.setItem('observacoes', JSON.stringify(observacoes));
}

addAnimalBtn.addEventListener('click', () => {
  const nome = nomeAnimal.value.trim();
  const prop = proprietario.value.trim();
  const r = raca.value.trim();
  const i = idade.value.trim();
  const especie = especieInput.value.trim();
  const sexo = sexoInput.value;
  const peso = pesoInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const cpf = cpfInput.value.trim();
  const telefone = telefoneInput.value.trim();

  if (!nome || !prop || !r || !i || !especie || !sexo || !peso || !endereco || !cpf || !telefone)
    return alert('Preencha todos os campos!');
  if (isNaN(i) || Number(i) < 0) return alert('Digite uma idade válida');
  if (isNaN(peso) || Number(peso) <= 0) return alert('Digite um peso válido');

  const id = Date.now().toString();
  animais.push({ id, nome, proprietario: prop, raca: r, idade: i, especie, sexo, peso, endereco, cpf, telefone });

  nomeAnimal.value = proprietario.value = raca.value = idade.value = especieInput.value = sexoInput.value = pesoInput.value = enderecoInput.value = cpfInput.value = telefoneInput.value = '';

  atualizarAnimais();
  renderAnimaisCadastrados();
  salvarLocalStorage();
});

function atualizarAnimais() {
  animalSelect.innerHTML = '';
  animais.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.especie} (${a.nome})`;
    animalSelect.appendChild(opt);
  });
}

animalSelect.addEventListener('change', renderHistorico);

// Render doenças
function renderDoencas() {
  diseasesGrid.innerHTML = '';
  DOENCIAS.forEach(d => {
    const div = document.createElement('div');
    div.className = 'disease-card';
    if (d.id === 'outros') {
      div.innerHTML = `<input type="text" placeholder="Especificar..." class="specInput">
                       <button data-id="${d.id}">+</button>`;
    } else {
      div.innerHTML = `<span>${d.nome}</span><button data-id="${d.id}">+</button>`;
    }
    diseasesGrid.appendChild(div);
  });

  diseasesGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = animalSelect.value;
      if (!animalId) return alert('Selecione um animal primeiro!');
      const diseaseId = btn.getAttribute('data-id');
      let descricao = '';
      if (diseaseId === 'outros') {
        const input = btn.parentElement.querySelector('.specInput');
        descricao = input.value.trim();
        if (!descricao) return alert('Digite algo para especificar.');
        input.value = '';
      } else {
        descricao = DOENCIAS.find(d => d.id === diseaseId)?.nome;
      }
      observacoes.push({ id: Date.now().toString(), animalId, diseaseId, descricao, timestamp: new Date().toLocaleString(), tipo: 'doenca' });
      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    });
  });
}

// Vacinação
function renderVaccinations() {
  const grid = document.getElementById('vaccinationGrid');
  grid.innerHTML = '';
  VACINAS.forEach(v => {
    const div = document.createElement('div');
    div.className = 'disease-card';
    if (v.id === 'outros') {
      div.innerHTML = `<input type="text" placeholder="Especificar..." class="specInput">
                       <button data-id="${v.id}">+</button>`;
    } else {
      div.innerHTML = `<span>${v.nome}</span><button data-id="${v.id}">+</button>`;
    }
    grid.appendChild(div);
  });

  grid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = animalSelect.value;
      if (!animalId) return alert('Selecione um animal primeiro!');
      let descricao = '';
      if (btn.getAttribute('data-id') === 'outros') {
        const input = btn.parentElement.querySelector('.specInput');
        descricao = input.value.trim();
        if (!descricao) return alert('Digite algo para especificar.');
        input.value = '';
      } else {
        descricao = VACINAS.find(v => v.id === btn.getAttribute('data-id'))?.nome;
      }
      observacoes.push({ id: Date.now().toString(), animalId, diseaseId: btn.getAttribute('data-id'), descricao, timestamp: new Date().toLocaleString(), tipo: 'vacina' });
      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    });
  });
}

// Vermifugação
function renderVermifugos() {
  const grid = document.getElementById('vermifugacaoGrid');
  grid.innerHTML = '';
  VERMIFUGOS.forEach(v => {
    const div = document.createElement('div');
    div.className = 'disease-card';
    if (v.id === 'outros') {
      div.innerHTML = `<input type="text" placeholder="Especificar..." class="specInput">
                       <button data-id="${v.id}">+</button>`;
    } else {
      div.innerHTML = `<span>${v.nome}</span><button data-id="${v.id}">+</button>`;
    }
    grid.appendChild(div);
  });

  grid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = animalSelect.value;
      if (!animalId) return alert('Selecione um animal primeiro!');
      let descricao = '';
      if (btn.getAttribute('data-id') === 'outros') {
        const input = btn.parentElement.querySelector('.specInput');
        descricao = input.value.trim();
        if (!descricao) return alert('Digite algo para especificar.');
        input.value = '';
      } else {
        descricao = VERMIFUGOS.find(v => v.id === btn.getAttribute('data-id'))?.nome;
      }
      observacoes.push({ id: Date.now().toString(), animalId, diseaseId: btn.getAttribute('data-id'), descricao, timestamp: new Date().toLocaleString(), tipo: 'vermifugo' });
      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    });
  });
}

// Histórico
function renderHistorico() {
  historyList.innerHTML = '';
  const animalId = animalSelect.value;
  const obsAnimal = observacoes.filter(o => o.animalId === animalId);
  const animal = animais.find(a => a.id === animalId);

  if (animal) {
    animalInfoDiv.innerHTML = `
      <strong>Nome:</strong> ${animal.nome}<br>
      <strong>Espécie:</strong> ${animal.especie}<br>
      <strong>Proprietário:</strong> ${animal.proprietario}<br>
      <strong>Sexo:</strong> ${animal.sexo}<br>
      <strong>Idade:</strong> ${animal.idade} anos<br>
      <strong>Peso:</strong> ${animal.peso} kg<br>
      <strong>Endereço:</strong> ${animal.endereco}<br>
      <strong>CPF:</strong> ${animal.cpf}<br>
      <strong>Telefone:</strong> ${animal.telefone}
    `;
  } else {
    animalInfoDiv.innerHTML = '';
  }

  obsAnimal.forEach(o => {
    let tipoLabel = '';
    let nome = '';
    if (o.tipo === 'doenca') {
      tipoLabel = 'Doença';
      nome = DOENCIAS.find(d => d.id === o.diseaseId)?.nome || '';
    } else if (o.tipo === 'vacina') {
      tipoLabel = 'Vacina';
      nome = VACINAS.find(v => v.id === o.diseaseId)?.nome || '';
    } else {
      tipoLabel = 'Vermífugo';
      nome = VERMIFUGOS.find(v => v.id === o.diseaseId)?.nome || '';
    }
    const extra = o.descricao ? ` (${o.descricao})` : '';
    const li = document.createElement('li');
    li.textContent = `${tipoLabel}: ${o.descricao} - ${o.timestamp}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = () => {
      observacoes = observacoes.filter(obs => obs.id !== o.id);
      renderHistorico();
      renderAnimaisCadastrados();
      salvarLocalStorage();
    };
    li.appendChild(removeBtn);
    historyList.appendChild(li);
  });
}

clearAllBtn.onclick = () => {
  const animalId = animalSelect.value;
  observacoes = observacoes.filter(o => o.animalId !== animalId);
  renderHistorico();
  renderAnimaisCadastrados();
  salvarLocalStorage();
};

removeAnimalBtn.onclick = () => {
  const animalId = animalSelect.value;
  if (!animalId) return alert('Selecione um animal para remover!');
  if (!confirm('Tem certeza que deseja remover este animal e todo o histórico?')) return;
  animais = animais.filter(a => a.id !== animalId);
  observacoes = observacoes.filter(o => o.animalId !== animalId);
  atualizarAnimais();
  renderAnimaisCadastrados();
  renderHistorico();
  salvarLocalStorage();
};

function renderAnimaisCadastrados() {
  animaisCadastradosDiv.innerHTML = '';
  animais.forEach(a => {
    const obsAnimal = observacoes.filter(o => o.animalId === a.id);
    const doencas = obsAnimal.filter(o => o.tipo === 'doenca');
    const vacinas = obsAnimal.filter(o => o.tipo === 'vacina');
    const vermifugos = obsAnimal.filter(o => o.tipo === 'vermifugo');

    // pega o nome ou a descrição personalizada
    const formatarLista = (lista, tipoBase) =>
      lista.length
        ? lista.map(item => {
            // Se foi digitado algo em "Outros", mostra o texto digitado
            if (item.diseaseId === 'outros') {
              return item.descricao;
            } else {
              if (tipoBase === 'doenca') {
                return DOENCIAS.find(d => d.id === item.diseaseId)?.nome || item.descricao;
              } else if (tipoBase === 'vacina') {
                return VACINAS.find(v => v.id === item.diseaseId)?.nome || item.descricao;
              } else {
                return VERMIFUGOS.find(v => v.id === item.diseaseId)?.nome || item.descricao;
              }
            }
          }).join(', ')
        : 'Nenhuma';

    const div = document.createElement('div');
    div.className = 'animal-card';
    div.innerHTML = `
      <strong>${a.nome}</strong><br>
      Espécie: ${a.especie}<br>
      Proprietário: ${a.proprietario}<br>
      Idade: ${a.idade} anos<br>
      Peso: ${a.peso} kg<br>
      <strong>Doenças:</strong> ${formatarLista(doencas, 'doenca')}<br>
      <strong>Vacinas:</strong> ${formatarLista(vacinas, 'vacina')}<br>
      <strong>Vermífugos:</strong> ${formatarLista(vermifugos, 'vermifugo')}
    `;
    animaisCadastradosDiv.appendChild(div);
  });
}

atualizarAnimais();
renderDoencas();
renderVaccinations();
renderVermifugos();
renderAnimaisCadastrados();
renderHistorico();
