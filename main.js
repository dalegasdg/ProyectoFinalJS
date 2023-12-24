const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsDiv = document.getElementById("results");

searchButton.addEventListener("click", () => {
  searchPokemon(searchInput.value.toLowerCase());
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchPokemon(searchInput.value.toLowerCase());
  }
});

async function searchPokemon(query) {
  const respuesta = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${query}`
  );
  const data = await respuesta.json();

  if (respuesta.status === 404) {
    resultsDiv.innerHTML = `<p>No hay resultados para su búsqueda.</p>`;
    return;
  }

  const pokemon = {
    name: data.name,
    number: data.id,
    image: data.sprites.front_default,
    types: data.types.map((type) => type.type.name),
    evolutions: [],
  };

  if (data.species.url) {
    const speciesrespuesta = await fetch(data.species.url);
    const speciesData = await speciesrespuesta.json();

    if (speciesData.evolution_chain.url) {
      const evolutionChainrespuesta = await fetch(
        speciesData.evolution_chain.url
      );
      const evolutionChainData = await evolutionChainrespuesta.json();

      if (evolutionChainData.chain) {
        const chain = evolutionChainData.chain;
        let current = chain;

        while (current) {
          if (current.species.name !== pokemon.name) {
            pokemon.evolutions.push(current.species.name);
          }

          current = current.evolves_to[0];
        }
      }
    }
  }

  const html = `
    <div>
      <img src="${pokemon.image}" alt="${pokemon.name}" />
      <h2>${pokemon.name}</h2>
      <p>Número: ${pokemon.number}</p>
      <p>Tipo: ${pokemon.types.join(", ")}</p>
      <p>Evoluciones: ${
        pokemon.evolutions.length > 0
          ? pokemon.evolutions.join(", ")
          : "Ninguna"
      }</p>
    </div>
  `;

  resultsDiv.innerHTML = html;
}