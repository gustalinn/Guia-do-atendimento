# 🐾 Guia do Atendimento Animal

Sistema web para cadastro, gerenciamento e histórico de atendimento de animais, desenvolvido para fins acadêmicos.

---

## 📌 Funcionalidades

- **Cadastro de Animais**
  - Informações: Nome, espécie, raça, idade, sexo, peso, endereço, CPF e telefone do proprietário.
  - Formatação automática:
    - Primeira letra de nomes, espécies, raças e endereços em maiúsculo.
    - CPF formatado como `000.000.000-00`.
    - Telefone formatado como `(00) 00000-0000`.
  - Validação de campos obrigatórios, idade e peso.

- **Seleção e Visualização de Animais**
  - `<select>` com lista de animais cadastrados (nome e espécie).
  - Exibição das informações essenciais do animal selecionado.

- **Histórico de Atendimento**
  - Registro de doenças, vacinas e vermifugação.
  - Adição de observações específicas em "Outros".
  - Remoção individual ou limpeza completa do histórico.

- **Visualização Detalhada de Animais Cadastrados**
  - Agrupamento por espécie com contagem de animais.
  - Cards expansíveis para exibir detalhes completos:
    - Informações do animal
    - Histórico de doenças, vacinas e vermifugação
  - Agrupamento de sintomas por doença.

- **Interface e Usabilidade**
  - Layout responsivo para desktop e mobile.
  - Cards e grids animados com efeito hover.
  - Interface intuitiva e organizada.

---

## 🛠 Tecnologias Utilizadas

- **HTML5** – Estrutura da aplicação
- **CSS3** – Estilo, layout e responsividade
- **JavaScript (Vanilla)** – Lógica de cadastro, histórico e validações
- **LocalStorage** – Armazenamento persistente no navegador

---

## 📂 Estrutura do Projeto
/guia-atendimento/
│
├── index.html # Página principal
├── style.css # Estilos e layout responsivo
├── script.js # Lógica de cadastro, histórico e validações
└── README.md # Documentação do projeto

---

## ⚡ Como Usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Preencha o formulário **Cadastrar Animal** com todos os campos.
3. Clique em **Adicionar** para salvar o animal.
4. O animal aparecerá em **Animais Cadastrados** e no `<select>` de seleção.
5. Para adicionar histórico:
   - Selecione o animal desejado.
   - Clique no botão `+` ao lado da doença, vacina ou vermifugo.
   - Para "Outros", insira uma descrição antes de adicionar.
6. Para remover um animal ou observação, use os botões correspondentes.

---

## 🔧 Observações

- Todos os dados são armazenados localmente via **LocalStorage**.
- Projeto destinado a **fins acadêmicos e de aprendizado**.
- Futuramente será possível **editar informações do animal e observações**.

---

## 🎨 Estilo

- Layout limpo e moderno.
- Cards e grids animados para melhor experiência visual.
- Sistema responsivo, adaptando-se a diferentes telas.
