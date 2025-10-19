function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ===== FUNÇÕES DE FORMATAÇÃO E VALIDAÇÃO =====

// Formatar CPF como 000.000.000-00
function formatCPF(cpf) {
  return cpf.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Validar CPF (básico)
const VALIDAR_CPF_RIGOROSO = false; // =true para validação real; =false para aceitar qualquer cpf com 11 dígitos

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (!VALIDAR_CPF_RIGOROSO) return true;

  // algoritmo rigoroso original:
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
}

//telefone 
function formatTelefone(tel) {
  tel = tel.replace(/\D/g, '');
  tel = tel.replace(/^(\d{2})(\d)/g, '($1) $2');
  tel = tel.replace(/(\d{5})(\d)/, '$1-$2');
  return tel;
}

// ===== ARRAYS PRINCIPAIS =====
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

// ===== ELEMENTOS DO DOM =====
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

// ===== FUNÇÃO PARA SALVAR NO LOCALSTORAGE =====
function salvarLocalStorage() {
  localStorage.setItem('animais', JSON.stringify(animais));
  localStorage.setItem('observacoes', JSON.stringify(observacoes));
}

// ===== ADICIONAR ANIMAL =====
addAnimalBtn.addEventListener('click', () => {
  let nome = capitalize(nomeAnimal.value.trim());
  let prop = capitalize(proprietario.value.trim());
  let r = capitalize(raca.value.trim());
  let i = idade.value.trim();
  let especie = capitalize(especieInput.value.trim());
  let sexo = sexoInput.value;
  let peso = pesoInput.value.trim();
  let endereco = capitalize(enderecoInput.value.trim());
  let cpf = cpfInput.value.trim();
  let telefone = telefoneInput.value.trim();

  if (!nome || !prop || !r || !i || !especie || !sexo || !peso || !endereco || !cpf || !telefone)
    return alert('Preencha todos os campos!');
  if (isNaN(i) || Number(i) < 0) return alert('Digite uma idade válida');
  if (isNaN(peso) || Number(peso) <= 0) return alert('Digite um peso válido');

  cpf = formatCPF(cpf);
  if (!validarCPF(cpf)) return alert('CPF inválido!');
  telefone = formatTelefone(telefone);

  const id = Date.now().toString();
  animais.push({ id, nome, proprietario: prop, raca: r, idade: i, especie, sexo, peso, endereco, cpf, telefone });

  // Limpar campos
  nomeAnimal.value = proprietario.value = raca.value = idade.value = especieInput.value = sexoInput.value = pesoInput.value = enderecoInput.value = cpfInput.value = telefoneInput.value = '';

  atualizarAnimais();
  renderAnimaisCadastrados();
  salvarLocalStorage();
});

// ===== ATUALIZAR <select> ANIMAIS =====
function atualizarAnimais() {
  animalSelect.innerHTML = '';

  // Opção padrão
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Nenhuma opção';
  animalSelect.appendChild(defaultOpt);

  animais.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${capitalize(a.especie)} (${capitalize(a.nome)})`;
    animalSelect.appendChild(opt);
  });

  // Atualiza histórico quando mudar seleção
  animalSelect.addEventListener('change', renderHistorico);
}



// Atualizar histórico quando selecionar animal
animalSelect.addEventListener('change', () => {
  renderHistorico();
});

// ===== ADICIONAR OBSERVAÇÃO =====
function addObservacao(tipo, nomeDoenca, descricao) {
  const animalId = animalSelect.value;
  if (!animalId) return alert('Selecione um animal para adicionar a observação!');

  let tipoReal = tipo;
  let descricaoCompleta = descricao;

  if (tipo === 'doenca_outros') tipoReal = 'doenca';
  else if (tipo === 'vacina_outros') tipoReal = 'vacina';
  else if (tipo === 'vermifugo_outros') tipoReal = 'vermifugo';

  if (tipoReal === 'doenca' && nomeDoenca) {
    descricaoCompleta = `${nomeDoenca} (${descricao})`;
  } else if (tipo.endsWith('_outros')) {
    descricaoCompleta = capitalize(descricao); // garante primeira letra maiúscula para "especificar"
  } else {
    descricaoCompleta = descricao; // mantém como veio
  }

  // ✅ Validação ignorando maiúsculas/minúsculas
  const existe = observacoes.some(o => 
    o.animalId === animalId &&
    o.tipo === tipoReal &&
    (o.diseaseId || null) === (nomeDoenca || null) &&
    o.descricao.toLowerCase() === descricaoCompleta.toLowerCase()
  );

  if (existe) return alert('Esta observação já foi adicionada!');

  observacoes.push({
    id: Date.now().toString(),
    animalId,
    diseaseId: nomeDoenca || null,
    descricao: descricaoCompleta,
    timestamp: new Date().toLocaleString(),
    tipo: tipoReal
  });

  renderHistorico();
  renderAnimaisCadastrados();
  salvarLocalStorage();
}

// ===== RENDER DOENÇAS, VACINAS E VERMIFUGOS =====
function renderDoencas() { renderItems(DOENCIAS, diseasesGrid, 'doenca'); }
function renderVaccinations() { renderItems(VACINAS, document.getElementById('vaccinationGrid'), 'vacina'); }
function renderVermifugos() { renderItems(VERMIFUGOS, document.getElementById('vermifugacaoGrid'), 'vermifugo'); }

const SINTOMAS = [
  'Cio repetido',
  'Abortos',
  'Anorexia',
  'Apatia',
  'Diarreia',
  'Letargia',
  'Mialgia',
  'Icterícia'
];

function renderItems(array, container, tipo) {
  container.innerHTML = '';
  array.forEach(item => {
    // row principal (.disease-card)
    const div = document.createElement('div');
    div.className = 'disease-card';

    if (item.id === 'outros') {
      // para "outros" mantenha input + botão inline
      div.innerHTML = `
        <input type="text" placeholder="Especificar..." class="specInput">
        <button data-id="${item.id}">adicionar</button>
      `;
      const btn = div.querySelector('button');
      btn.addEventListener('click', () => {
        const input = div.querySelector('.specInput');
        const val = input.value.trim();
        if (!val) return alert('Digite algo!');
        addObservacao(`${tipo}_outros`, null, val);
        input.value = '';
      });
      container.appendChild(div);
      // não criamos card de sintomas para "outros"
    } else {
      // para itens normais: nome + botão em linha
      // garantir que o nome esteja dentro de <span> (usado pelo CSS flex)
      div.innerHTML = `<span class="disease-name">${item.nome}</span><button data-id="${item.id}" class="toggle-sintomas">+</button>`;
      const btn = div.querySelector('button');

      // armazenar estado do card (se aberto) via dataset
      btn.dataset.open = 'false';

      // clique -> abre/fecha card (card será criado como IRMÃO abaixo do div)
      btn.addEventListener('click', () => {
        // botão abre/fecha o card que está imediatamente depois do div (se existir)
        const next = div.nextElementSibling;
        const isSintomasCard = next && next.classList && next.classList.contains('sintomas-card');

        if (isSintomasCard) {
          // se já existe card de sintomas logo abaixo, remove-o e atualizar botão
          next.remove();
          btn.textContent = '+';
          btn.dataset.open = 'false';
        } else {
          // cria e insere o card de sintomas logo após o div (como sibling)
          renderSintomas(div, tipo, item.nome, btn);
          btn.textContent = '-';
          btn.dataset.open = 'true';
        }
      });

      container.appendChild(div);
      // não inserir sintomas aqui — serão inseridos como sibling quando botão for clicado
    }
  });
}

// Função para renderizar os sintomas como botões
function renderSintomas(parentDiv, tipo, nomeDoenca, toggleBtn) {
  // cria o card de sintomas (como elemento separado)
  const card = document.createElement('div');
  card.className = 'sintomas-card';

  // cria os botões de sintomas
  SINTOMAS.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s;
    b.style.padding = '6px 10px';
    b.style.border = 'none';
    b.style.borderRadius = '4px';
    b.style.cursor = 'pointer';
    b.style.fontSize = '0.85rem';
    // não mexer nas cores aqui — seus estilos globais para .disease-card button não afetam esses
    b.addEventListener('click', () => {
      // exige seleção de animal ao adicionar observação
      if (!animalSelect.value) return alert('Selecione um animal para adicionar a observação!');
      addObservacao(tipo, nomeDoenca, s);
    });
    card.appendChild(b);
  });

  // inserir o card como sibling logo após o parentDiv
  if (parentDiv.parentNode) {
    parentDiv.parentNode.insertBefore(card, parentDiv.nextSibling);
  } else {
    // fallback: append no parentDiv (não ideal), mas normalmente parentNode existe
    parentDiv.appendChild(card);
  }
}

// ===== HISTÓRICO =====
function renderHistorico() {
  const animalId = animalSelect.value;

  // Se nenhum animal estiver selecionado, limpa histórico e info
  if (!animalId) {
    historyList.innerHTML = '';
    animalInfoDiv.innerHTML = '';
    return;
  }

  // Buscar o animal selecionado
  const animal = animais.find(a => a.id === animalId);
  if (animal) {
    // Informações essenciais apenas
    animalInfoDiv.innerHTML = `
      <p><strong>Nome:</strong> ${animal.nome}</p>
      <p><strong>Proprietário:</strong> ${animal.proprietario}</p>
      <p><strong>Espécie:</strong> ${animal.especie}</p>
      <p><strong>Raça:</strong> ${animal.raca}</p>
      <p><strong>Sexo:</strong> ${animal.sexo}</p>
    `;
  }

  // Mostrar histórico
  const obsAnimal = observacoes.filter(o => o.animalId === animalId);
  historyList.innerHTML = '';
  obsAnimal.forEach(o => {
    let tipoLabel = o.tipo === 'doenca' ? 'Doença' : o.tipo === 'vacina' ? 'Vacina' : 'Vermífugo';
    const li = document.createElement('li');
    li.textContent = `${tipoLabel}: ${capitalize(o.descricao)} - ${o.timestamp}`;
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


// ===== LIMPAR HISTÓRICO =====
clearAllBtn.onclick = () => {
  const animalId = animalSelect.value;
  if (!animalId) return;
  if (!confirm('Tem certeza que deseja apagar todo o histórico deste animal?')) return;
  observacoes = observacoes.filter(o => o.animalId !== animalId);
  renderHistorico();
  renderAnimaisCadastrados();
  salvarLocalStorage();
};

// ===== REMOVER ANIMAL =====
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

// ===== RENDER ANIMAIS CADASTRADOS =====
function renderAnimaisCadastrados() {
  animaisCadastradosDiv.innerHTML = '';
  const especies = {};
  animais.forEach(a => {
    const esp = a.especie.toLowerCase();
    if (!especies[esp]) especies[esp] = [];
    especies[esp].push(a);
  });

  Object.keys(especies).forEach(especie => {
    const grupo = especies[especie];

    const especieCard = document.createElement('div');
    especieCard.className = 'especie-card card';
    especieCard.style.cursor = 'pointer';
    especieCard.innerHTML = `<h3>${capitalize(especie)} <span class="count">(${grupo.length})</span></h3>`;

    const animalGrid = document.createElement('div');
    animalGrid.className = 'animal-grid';
    animalGrid.style.display = 'none';

    grupo.forEach(a => {
      const obsAnimal = observacoes.filter(o => o.animalId === a.id);

      // AGRUPAR sintomas por doença
      const doencasMap = {};   
      const outrasDoencas = []; 

      obsAnimal.filter(o => o.tipo === 'doenca' || o.tipo === 'doenca_outros').forEach(d => {
        if (d.tipo === 'doenca_outros') {
          outrasDoencas.push(d.descricao);
        } else {
          const match = d.descricao.match(/^([^()]+)\s*\((.+)\)$/); 
          if (match) {
            const nome = match[1].trim();
            const sintoma = match[2].trim();
            if (!doencasMap[nome]) doencasMap[nome] = [];
            if (!doencasMap[nome].includes(sintoma)) doencasMap[nome].push(sintoma);
          } else {
            if (!doencasMap[d.descricao]) doencasMap[d.descricao] = [];
          }
        }
      });

      const doencasStr = [
        ...Object.entries(doencasMap).map(([nome, sintomas]) => nome + (sintomas.length ? ` (${sintomas.join(', ')})` : '')),
        ...outrasDoencas
      ].join(', ') || 'Nenhuma';

      const vacinas = obsAnimal.filter(o => o.tipo === 'vacina').map(v => capitalize(v.descricao));
      const vermifugos = obsAnimal.filter(o => o.tipo === 'vermifugo').map(v => capitalize(v.descricao));

      const div = document.createElement('div');
      div.className = 'animal-card';
      div.innerHTML = `
        <h3>${capitalize(a.nome)}</h3>
        <p><strong>Proprietário:</strong> ${capitalize(a.proprietario)}</p>
        <p><strong>Raça:</strong> ${capitalize(a.raca)}</p>
        <p><strong>Sexo:</strong> ${capitalize(a.sexo)}</p>
        <p><strong>Idade:</strong> ${a.idade} anos</p>
        <p><strong>Peso:</strong> ${a.peso} kg</p>
        <p><strong>Endereço:</strong> ${capitalize(a.endereco)}</p>
        <p><strong>CPF:</strong> ${a.cpf}</p>
        <p><strong>Telefone:</strong> ${a.telefone}</p>
        <p><strong>Doenças:</strong> ${doencasStr}</p>
        <p><strong>Vacinas:</strong> ${vacinas.length ? vacinas.join(', ') : 'Nenhuma'}</p>
        <p><strong>Vermifugação:</strong> ${vermifugos.length ? vermifugos.join(', ') : 'Nenhuma'}</p>
      `;
      animalGrid.appendChild(div);
    });

    especieCard.addEventListener('click', () => {
      animalGrid.style.display = animalGrid.style.display === 'grid' ? 'none' : 'grid';
    });

    animaisCadastradosDiv.appendChild(especieCard);
    animaisCadastradosDiv.appendChild(animalGrid);
  });
}

// ===== INICIALIZAÇÃO =====
renderDoencas();
renderVaccinations();
renderVermifugos();
atualizarAnimais();
renderAnimaisCadastrados();
renderHistorico();
