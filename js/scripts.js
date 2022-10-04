const addressForm = document.querySelector('#address-form');
const cepInput = document.querySelector('#cep');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const neighborhoodInput = document.querySelector('#neighborhood');
const regionInput = document.querySelector('#region');
const formInputs = document.querySelectorAll('[data-input]');

const fadeElement = document.querySelector('#fade');
const closeButton = document.querySelector('#close-message');

// Validar o cep input
cepInput.addEventListener('keypress', logKey);

function logKey(e) {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  //permitir apenas números
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
}
/*
// Vendo os dois modos de declarar uma função
//arrow function
cepInput.addEventListener('keypress', (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  console.log(e.keyCode);
  console.log(key);
}); */

// Pegar o Address event
cepInput.addEventListener('keyup', (e) => {
  const inputValue = e.target.value;

  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

//Botao fechar
closeButton.addEventListener('click', () => toggleMessage());

// Pegar customer address from API
const getAddress = async (cep) => {
  const titulo = document.querySelector('h2');
  toggleLoader();
  //tirar o foco do teclado do input
  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json`;

  //buscar src na api
  const response = await fetch(apiUrl);
  const data = await response.json();

  console.log(data);
  // Mostrar error e resetar formulario
  if (data.erro === 'true') {
    if (!addressInput.hasAttribute('disabled')) {
      toggleDisabled();
    }
    addressForm.reset();
    toggleLoader();
    //mostra mensagem
    toggleMessage('Cep inválido, tente novamente.');
    return;
  }

  if (addressInput.value === '') {
    toggleDisabled();
  }

  //colocar os dados pegos da api
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;
  toggleLoader();
};

// adicionar ou remover o atributo dos inputs
const toggleDisabled = () => {
  if (regionInput.hasAttribute('disabled')) {
    formInputs.forEach((input) => {
      input.removeAttribute('disabled');
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute('disabled', 'disabled');
    });
  }
};

// Mostrar ou esconder o loader
const toggleLoader = () => {
  const loaderElement = document.querySelector('#loader');

  fadeElement.classList.toggle('hide');
  loaderElement.classList.toggle('hide');
};

// Mostrar ou esconder mensagem
const toggleMessage = (msg) => {
  const messageElement = document.querySelector('#message');
  const messageElementText = document.querySelector('#message p');

  messageElementText.innerText = msg;

  fadeElement.classList.toggle('hide');
  messageElement.classList.toggle('hide');
};

// Botão Concluir
addressForm.addEventListener('submit', (e) => {
  e.preventDefault();

  toggleLoader();

  //simular delay
  setTimeout(() => {
    toggleLoader();

    toggleMessage('Endereço salvo com sucesso!');

    addressForm.reset();

    toggleDisabled();
  }, 1000);
});
