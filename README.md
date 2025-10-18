# 🐾 Guia do Atendimento Animal

Sistema web para cadastro, gerenciamento e histórico de atendimento de animais de estimação, desenvolvido para fins acadêmicos.

---

## 📌 Funcionalidades

- **Cadastro de Animais**
  - Nome do animal, espécie, raça, idade, sexo, peso, endereço, CPF e telefone do proprietário.
  - Formatação automática:
    - Primeira letra de nomes, espécies, raças e endereços em maiúsculo.
    - CPF formatado como `000.000.000-00`.
    - Telefone formatado como `(00) 00000-0000`.

- **Seleção de Animais**
  - Lista de animais cadastrados em um `<select>` com nome e espécie.
  - Exibição das informações essenciais do animal selecionado.

- **Histórico de Atendimento**
  - Registro de doenças, vacinas e vermifugação.
  - Possibilidade de adicionar observações específicas em "Outros".
  - Remoção individual ou limpeza completa do histórico.

- **Visualização de Animais Cadastrados**
  - Agrupamento por espécie com contagem de animais.
  - Cards expansíveis para detalhes completos.
  - Informações exibidas de forma clara e formatada.

- **Validações e Formatações**
  - Campos obrigatórios e validação de idade e peso.
  - Capitalização automática de textos.
  - Formatação automática de CPF e telefone.

---

## 🛠 Tecnologias Utilizadas

- HTML5 – Estrutura da aplicação
- CSS3 – Estilo e layout responsivo
- JavaScript (Vanilla) – Lógica de cadastro e histórico
- LocalStorage – Armazenamento persistente no navegador

---

## 📂 Estrutura do Projeto
/guia-atendimento/
│
├── index.html # Página principal
├── style.css # Estilos e layout
├── script.js # Lógica de cadastro e histórico
└── README.md # Documentação do projeto

---

## ⚡ Como Usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Preencha o formulário **Cadastrar Animal** com todos os campos.
3. Clique em **Adicionar** para salvar o animal.
4. O animal aparecerá em **Animais Cadastrados** e no `<select>` de seleção.
5. Para adicionar histórico:
   - Selecione o animal desejado.
   - Clique no botão `+` ao lado da doença, vacina ou vermífugo.
   - Para "Outros", insira uma descrição antes de adicionar.
6. Para remover um animal ou histórico, use os botões correspondentes.

---

## 🎨 Estilo e Usabilidade

- Layout responsivo para desktop e mobile.
- Cards animados com efeito hover.
- Grids organizados para visualização clara de doenças, vacinas e vermifugação.
- Interface simples e intuitiva, ideal para simulação acadêmica de atendimento veterinário.

---

## 🔧 Observações

- Dados armazenados localmente no navegador via **LocalStorage**.
- Projeto voltado para **aprendizado e demonstração**, sem backend real.
