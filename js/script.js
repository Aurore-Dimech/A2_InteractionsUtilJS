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
    
    //sélectionner au hasard 9 pokémons et afficher certaines de leurs informations
    //j'ai rajouté une condition qui empeche d'avoir des boucles infinies si jamais un pokémon n'est pas trouvé
    const browsingList = document.querySelector('#browsingList');
    let successfulCards = 0;
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then(totalPokemon => {
        const totalPokemonCount = totalPokemon.count;

        const createPokemonCard = () => {
            const fetchPokemon = (retryLimit = 5) => {
                if (retryLimit === 0) return;

                const randomId = Math.floor(Math.random() * totalPokemonCount) + 1;
                fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Invalid Pokemon ID');
                    return response.json();
                })
                .then(pokemonInfo => {
                    const pokemonCard = document.createElement('div');
                    pokemonCard.classList.add('card');
                    pokemonCard.innerHTML=`
                    <div class="pokemonPreview"><img src="${pokemonInfo.sprites.front_default}" alt="Image de face de ${pokemonInfo.name}">
                    <h5>${pokemonInfo.name}</h5>
                    <p>${pokemonInfo.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join(' - ')}</p>
                    </div>
                    <button class="seeMore" id="${pokemonInfo.id}">Voir plus</button>
                    `
                    browsingList.appendChild(pokemonCard);

                    //animations sur les cartes de chaque pokémon
                    pokemonCard.addEventListener('mouseover', () => {
                        pokemonCard.classList.add('accentCardBorder');
                        pokemonCard.addEventListener('mouseleave', () => {
                            pokemonCard.classList.remove('accentCardBorder');
                            pokemonCard.classList.add('accentCardBorderEnd');
                            pokemonCard.addEventListener('animationend', () => {
                                pokemonCard.classList.remove('accentCardBorderEnd');
                            })
                        })
                        
                    })

                    //fonctions pour ouvrir la page de chaque pokémon ainsi que pour mettre les animations sur les boutons "Voir plus"
                    const seeMoreButtons = document.querySelectorAll('.seeMore');
                    const seeMore = () => {
                        seeMoreButtons.forEach(seeMoreButton => {
                            seeMoreButton.addEventListener('click', (event) => {
                                const pokemonId = event.target.id;

                                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                                .then(response => response.json())
                                .then(pokemon => {
                                    localStorage.setItem("pokemonSearched", pokemon.name);
                                    window.location.href = `produit.html`;
                                })
                            })
                        })

                        seeMoreButtons.forEach(seeMoreButton => {  
                            seeMoreButton.addEventListener('mouseover', () => {
                                seeMoreButton.classList.add('accentCardSeeMore');
                                seeMoreButton.addEventListener('mouseleave', () => {
                                    seeMoreButton.classList.remove('accentCardSeeMore');
                                    seeMoreButton.classList.add('accentCardSeeMoreEnd');
                                    seeMoreButton.addEventListener('animationend', () => {
                                        seeMoreButton.classList.remove('accentCardSeeMoreEnd');
                                    })
                                })
                            })
                        })
                    }
                    seeMore();   
                })
                .catch(() => {
                    if(successfulCards < 9) {
                        fetchPokemon(retryLimit - 1);
                    }
                })
            }
            for (let i = 0; i < 9; i++) {
                fetchPokemon();
            }
        }
        createPokemonCard();
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