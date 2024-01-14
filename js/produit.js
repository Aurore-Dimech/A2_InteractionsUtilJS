document.addEventListener('DOMContentLoaded', () => {

    //animations sur les boutons du header
    const headerActions = document.querySelectorAll('.actionContainer');
    headerActions.forEach(selectedAction => {
        selectedAction.addEventListener('mouseover', () => {
            selectedAction.classList.add("selectedAction");
            selectedAction.addEventListener('mouseleave', () => {
                selectedAction.classList.remove("selectedAction");
            })
        })
    })

    //générer la carte du pokémon sélectionné, qui affiche certaines de ses informations
    fetch(`https://pokeapi.co/api/v2/pokemon/${localStorage.getItem("pokemonSearched")}`)
    .then(response => response.json())
    .then(pokemonData =>{

        const fullCard = document.createElement('section')
        fullCard.id = "fullCard";
        fullCard.innerHTML=`
        <div id="fullCardPresentation">
                    <div id="fullCardImage">
                        <img src="${pokemonData.sprites.front_default}" alt="image de ${pokemonData.sprites.front_default}" id="pokemonImg">
                    </div>
                    <div id="fullCardGeneral">
                        <div id="fullCardGeneralInfo">
                            <p id="idName"> #${pokemonData.id} ${pokemonData.name}</p>
                            <p id="types">${pokemonData.types.map((type) => type.type.name).join (" & ")}</p>
                        </div>
                        <div id="fullCardGeneralAbilities">
                            <div id="fullCardGeneralAbilitiesBorderLeft">
                                ${pokemonData.abilities.map(ability => `<p class="abilities">${ability.ability.name}</p>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="fullCardStats">
                    <div id="fullCardStatsBorder">
                        <div class="fullCardStatsInfo">
                            ${pokemonData.stats.map(stat => `<p>${stat.stat.name} : ${stat.base_stat}</p>`).join('')}
                        </div>
                    </div>
                </div>
        `
        document.querySelector("#fullCardTextButton").before(fullCard);
    })

    //ajouter le pokémon au localStorage (et ainsi l'équipe) et afficher une alerte au click du bouton "Capturer"
    const captureButton = document.querySelector("#fullCardTextButton")
    captureButton.addEventListener("click", () => {
        const pokemon = localStorage.getItem("pokemonSearched");
        const team = JSON.parse(localStorage.getItem("teamList")) || [];
        team.push(pokemon);
        localStorage.setItem("teamList", JSON.stringify(team));
        alert(`${localStorage.getItem("pokemonSearched")} a été ajouté à l'équipe !`);
    })
    
    //animations sur le bouton "Capturer"
    const pokeballButton = document.querySelector("#pokeballButton");
    captureButton.addEventListener('mouseover', () => {
        pokeballButton.classList.add("pokeballMoves");
        captureButton.classList.add("accentCaptureButton");
        captureButton.addEventListener('mouseleave', () => {
            captureButton.classList.remove("accentCaptureButton");
            captureButton.classList.add("accentCaptureButtonEnd");
            captureButton.addEventListener('animationend', () => {
                captureButton.classList.remove("accentCaptureButtonEnd");
            })
        })
        pokeballButton.addEventListener('animationend', () => {
            pokeballButton.classList.remove('pokeballMoves');
        })
    })

    //fonction de recherche
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