document.addEventListener('DOMContentLoaded', () => {

    const headerActions = document.querySelectorAll('.actionContainer');
    headerActions.forEach(selectedAction => {
        selectedAction.addEventListener('mouseover', () => {
            selectedAction.classList.add("selectedAction");
            selectedAction.addEventListener('mouseleave', () => {
                selectedAction.classList.remove("selectedAction");
            })
        })
    })
    
    const fullTeam = JSON.parse(localStorage.getItem("teamList"));
    const fullCart = document.querySelector("#fullCart")
    const releaseAllButton = document.querySelector("#releaseAll");

    if (fullTeam === null || fullTeam.length === 0 ){
        releaseAllButton.style.display = "none";
        const emptyCard = document.createElement('div')
        emptyCard.classList.add("emptyCard")
        emptyCard.innerHTML = "<h2> Vous n'avez pas encore de pokémon dans votre équipe !</h2> <img src='assets/cryingPokemon.webp' alt='Pokémon en train de pleurer'>"
        fullCart.appendChild(emptyCard);

    } else {
        
        releaseAllButton.addEventListener("click", () => {
            localStorage.removeItem("teamList");
            location.reload();
        })
    
        fullTeam.forEach((pokemon, i) => {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            .then(response => response.json())
            .then((pokemon) => {
                const indivCard = document.createElement('div')
                indivCard.classList.add("indivCard")
                indivCard.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="image de ${pokemon.name}" class="imgPokemon">
                    <div class="pokemonCartInfo">
                        <h2>${pokemon.name} (#${pokemon.id})</h2>
                        <h3>${pokemon.types.map((type) => type.type.name).join(" & ")}</h3>
                        <div class="statsRecap">
                            ${pokemon.stats.map((stat) => `${stat.stat.name} : ${stat.base_stat}`).join("<p>")}
                        </div>
                    </div>
                `
                const releaseButton = document.createElement("button");
                releaseButton.classList.add("removePokemon");
                releaseButton.id = i;
                releaseButton.textContent = "Relacher";
                releaseButton.addEventListener("click", () => {
                    const removePokemon = (index) => {
                        const pokemonList = JSON.parse(localStorage.getItem("teamList")) || [];
                        pokemonList.splice(index, 1);
                        localStorage.setItem("teamList", JSON.stringify(pokemonList));
                        location.reload();
                    };
                    removePokemon(i);
                });
                indivCard.appendChild(releaseButton);
                releaseAllButton.before(indivCard);
            })
        })
    }





    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton")
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("errorMessage");

    const search = () => {
        const userInput = document.querySelector("#searchInput").value.toLowerCase();
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`)
        .then((response) => {
            if (!response.ok) {
                errorMessage.textContent = `Aucun Pokémon ne semble s'appeler "${userInput}".`;
                document.querySelector("#searchSection").appendChild(errorMessage);
                throw new Error(`Aucun Pokémon ne semble s'appeler "${userInput}".`);
            }
            return response.json();
         })
        .then((pokemonSearched) => {
            localStorage.setItem("pokemonSearched", pokemonSearched.name);
            window.location.href = `produit.html`;
            return pokemonSearched.name;
        })
    }

    searchInput.addEventListener("change", () => {
        localStorage.removeItem("pokemonSearched");
    });

    searchButton.addEventListener("click", search);

    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            search();
        }
    });
});