const pokemonList = document.querySelector("#pokemonList");
const buttonsType = document.querySelectorAll(".btn-header");
let shinyOn = false;
let url = "https://pokeapi.co/api/v2/pokemon/";
let currentTypeFilter = "show-all";

for (let i = 1; i <= 151; i++) {
  fetch(url + i)
    .then((response) => response.json())
    .then((data) => showPokemon(data));
}

function showPokemon(poke) {
  let types = poke.types.map(
    (type) => `<p class="${type.type.name} type">${type.type.name}</p>`
  );
  types = types.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `<p class="pokemon-id-background">#${pokeId}</p>`;

  if (shinyOn) {
    div.innerHTML += `<div class="pokemon-image"><img
      src="${poke.sprites.other["official-artwork"].front_shiny}"
      alt="${poke.name}"
    /></div>`;
  } else {
    div.innerHTML += `<div class="pokemon-image"><img
      src="${poke.sprites.other["official-artwork"].front_default}"
      alt="${poke.name}"
    /></div>`;
  }

  div.innerHTML += `
  <div class="pokemon-info">
    <div class="name-container">
      <p class="pokemon-id">#${pokeId}</p>
      <h2 class="pokemon-name">${poke.name}</h2>
    </div>
    <div class="pokemon-type">
      ${types}
    </div>
    <div class="pokemon-stats">
      <p class="stat">${poke.height} m</p>
      <p class="stat">${poke.weight} kg</p>
    </div>
  </div>`;

  pokemonList.append(div);
}

function filterAndShowPokemons(typeFilter) {
  pokemonList.innerHTML = "";
  for (let i = 1; i <= 151; i++) {
    fetch(url + i)
      .then((response) => response.json())
      .then((data) => {
        if (typeFilter === "show-all") {
          showPokemon(data);
        } else {
          const types = data.types.map((type) => type.type.name);
          if (types.some((type) => type.includes(typeFilter))) {
            showPokemon(data);
          }
        }
      });
  }
}

buttonsType.forEach((button) =>
  button.addEventListener("click", (event) => {
    currentTypeFilter = event.currentTarget.id;
    filterAndShowPokemons(currentTypeFilter);
  })
);

function shinyChange() {
  if (shinyOn) {
    shinyOn = false;
    document.getElementById("shiny").style.backgroundColor = "red";
  } else {
    shinyOn = true;
    document.getElementById("shiny").style.backgroundColor = "green";
  }
  filterAndShowPokemons(currentTypeFilter);
}
