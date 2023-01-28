const responsiveNav = document.querySelector('.navbar .responsive-nav')
const pokemonSearchBar = document.getElementById('pokemon-search')

const pokemonCards = document.getElementById('pokemon-cards-section');
const showMoreBtn = document.querySelector(".show-more-btn");
const pokemonInfoModal = document.querySelector(".pokemonInfoModal")
const closeModal = document.querySelector('[data-close]')
const favorites = document.querySelector('.favorites')

const searchBtn = document.querySelector('.search .btn')

const sortDisplay = document.querySelector(".sorting .sort-results")
let sortOptionsDisplay = document.querySelector('.sort-options')
const sortOptions = document.querySelectorAll(".sort-options .options")
let sortDisplayTogg = false;

const typesContainer = document.querySelector('.pokemonInfoModal .types-container')
 
const prevPokemon = document.querySelector(".prev")
const nextPokemon = document.querySelector(".next")
 
const pokemonName = document.querySelector(".pokemon-name")
const pokemonImg = document.querySelector(".pokemon-img-container")
const statsGrid = document.querySelector(".stats-grid")
const infoGrid = document.querySelector(".info-grid")

 
const pokemonList = []
const favoritesList = []
let pokemonID = 0;
let pokemonCardsHTML = ``
let pokemonStats = ``
let currentPokemonOrder = 'pokemonId'
let url = "https://pokeapi.co/api/v2/pokemon/"
let favoritesClicked = false
let favoriteCount = 0;
let burgerClicked = false
document.addEventListener('click', e => {
    if (e.target.className === 'burger-icon'){
        burgerClicked = !burgerClicked
        if (burgerClicked) {
            responsiveNav.style.display = 'block'
        } else{
            responsiveNav.style.display = 'none'
            
        }
    }
})
 
const capitalize = (name) => {
   return name[0].toUpperCase() + name.slice(1);
  
}
const makePokeSet = (pokeData) => {
   const [type1, type2] = pokeData.types
   let typeHTML = ``
   let favClass = ``
   let properName = capitalize(pokeData.name)
   let properType1 = capitalize(type1.type.name)
    if (pokeData.favorited) {
        favClass = `fas fa-star empty-star`
    } else {
        
        favClass = `far fa-star empty-star`
    }
   if (pokeData.types.length === 1) {
    typeHTML = `
    <div data-types="${properType1}" class="type-1"><p>${properType1}</p></div>
    `
   } else {
       let properType2 = capitalize(type2.type.name)
       typeHTML = `
        <div data-types="${properType1}" class="type-1"><p>${properType1}</p></div>
        <div data-types="${properType2}" class="type-2"><p>${properType2}</p></div>
       `
   }
   pokemonCardsHTML += `
   <div class="pokemon-card">
   <div class="img-container">
    <i class="${favClass}" data-name='${pokeData.name}'></i>
       <img class="pokemon-img" data-api="${pokeData.species.url}" src="${pokeData.sprites.front_default}" alt="">
   </div>
   <div class="pokemon-index"># ${pokeData.id}</div>
       <h3 class="pokemon-name">${properName}</h3>
       <div  class="pokemon-types">
          ${typeHTML}
       </div>
   </div>
   `   
}
 
const randomArryIndex = (array) =>{
   let arrayLength = array.length
   return Math.floor(Math.random() * arrayLength)
}
const getPokemonAPI = async (url) => {
   for (pokemonID = 1; pokemonID <= 400; pokemonID++){
       pokemonList.push(fetch(`${url}${pokemonID}`)
       .then(res => res.json())
       .catch(err => console.log(err)))
    }
   await Promise.all(pokemonList)
   .then(data => data.map(pokemonData => {
       makePokeSet(pokemonData)
    }))
   pokemonCards.innerHTML = pokemonCardsHTML
}



const getSelectedPokemonApi = async (url, pokemonArray) => {
   let response = await fetch(url)
   let speciesData = await response.json()
   let pokemonRes = await fetch(speciesData.varieties[0].pokemon.url)
   let pokemonData = await pokemonRes.json()
   Promise.all(pokemonArray).then(data => {
       let selectedIndex = data.findIndex(pokemonData => pokemonData.species.url === url)
       let prevIndex = 0
       let nextIndex = 0;
       if (selectedIndex === 0) {
            prevIndex = data.length - 1
       } else {
            prevIndex = selectedIndex - 1;
       }

       if (selectedIndex === data.length - 1) {
            nextIndex = 0
       } else {
            nextIndex = selectedIndex + 1;
       }

        prevPokemon.setAttribute('data-api', `${data[prevIndex].species.url}`)
        nextPokemon.setAttribute('data-api', `${data[nextIndex].species.url}`)
        pokemonStats = `
            <i class="fas fa-chevron-circle-left"></i>
            <p>#${data[prevIndex].id}</p>
            <p class="next-name">${capitalize(data[prevIndex].name)}</p>
        `
        prevPokemon.innerHTML = pokemonStats

        pokemonStats = `
            <p class="prev-name">${capitalize(data[nextIndex].name)}</p>
            <p>#${data[nextIndex].id}</p>
            <i class="fas fa-chevron-circle-right"></i>
        `
        nextPokemon.innerHTML = pokemonStats
   })
   .catch(err => console.log(err))
 
   Promise.all([speciesData, pokemonData])
   .then(data => {
    const [species, pokemon] = data;
    const [hp, attack, defense, specialAttack, specialDefense, speed] = pokemon.stats
    let pokemonProperName = capitalize(pokemon.name)
    pokemonStats = `
        <img src="${pokemon.sprites.front_default}" alt="img-here">
    `
    pokemonImg.innerHTML = pokemonStats
    pokemonStats = `
        <div class="hp">
            <p class="stat-name">HP</p>
            <p class="stat-attr">${hp.base_stat}</p>
        </div>
        <div class="attack">
            <p class="stat-name">Attack</p>
            <p class="stat-attr">${attack.base_stat}</p>
        </div>
        <div class="defense">
            <p class="stat-name">Defense</p>
            <p class="stat-attr">${defense.base_stat}</p>
        </div>
        <div class="special-attack">
            <p class="stat-name">Special Attack</p>
            <p class="stat-attr">${specialAttack.base_stat}</p>
        </div>
        <div class="special-defense">
            <p class="stat-name">Special Defense</p>
            <p class="stat-attr">${specialDefense.base_stat}</p>
        </div>
        <div class="speed">
            <p class="stat-name">Speed</p>
            <p class="stat-attr">${speed.base_stat}</p>
        </div>
    `

    statsGrid.innerHTML = pokemonStats
    pokemonStats = `
        <p>${pokemonProperName} #${pokemon.id}</p>
    `
    pokemonName.innerHTML = pokemonStats
    let pokemonAbilitiesIndex = randomArryIndex(pokemon.abilities)
    let pokemonAbility = capitalize(pokemon.abilities[pokemonAbilitiesIndex].ability.name)
    let pokemonHabitat = ''
    if (species.habitat === null) {
        pokemonHabitat = "NA"
    } else {
        pokemonHabitat = capitalize(species.habitat.name)
    }
    pokemonStats = `
    <div class="height">
        <p class="about-name">Height</p>
        <p class="about-attr">${pokemon.height}</p>
    </div>
    <div class="weight">
        <p class="about-name">Weight</p>
        <p class="about-attr">${pokemon.weight}</p>
    </div>
    <div class="defense">
        <p class="about-name">Habitat</p>
        
        <p class="about-attr">${pokemonHabitat}</p>
    </div>
    <div class="abilities">
        <p class="about-name">Abilities</p>
        <p class="about-attr">${pokemonAbility}</p>
    </div>
    `
    infoGrid.innerHTML = pokemonStats


    let properType1 = capitalize(pokemon.types[0].type.name)
    if (pokemon.types.length === 1) {
        pokemonStats = `
        <div data-types="${properType1}" class="pokemon-types pokemon-type-1">
            <p>${properType1}</p>
        </div>
        `
    } else {
        let properType2 = capitalize(pokemon.types[1].type.name)
        pokemonStats = `
        <div data-types="${properType1}" class="pokemon-types pokemon-type-1">
            <p>${properType1}</p>
        </div>
        <div data-types="${properType2}" class="pokemon-types pokemon-type-2">
            <p>${properType2}</p>
        </div>
        `
    }
    typesContainer.innerHTML = pokemonStats
})
.catch(err => console.log(err))
}

getPokemonAPI(url)

const getPokemonData = (e, array) => {
    if (e.target.className === "pokemon-img"){
        let thisUrl = e.target.dataset.api
        getSelectedPokemonApi(thisUrl, array)
        pokemonInfoModal.classList.add("active")
    }
}

document.addEventListener('click', (e) => {
    currentPokemonOrder === 'pokemonId'
 if (currentPokemonOrder === 'pokemonId') {
    getPokemonData(e, pokemonList)
 }
})

const getPrevAndNextPokemon = (e, pokemonArray) => {
    let thisClassName = e.target.className
    let thisUrl = e.target.dataset.api
    if (thisClassName === 'prev label' || thisClassName === 'next label'){
        getSelectedPokemonApi(thisUrl, pokemonArray)
    } else {
        return null
    }

}

document.addEventListener('click', e => getPrevAndNextPokemon(e, pokemonList))

const reverseIdOrderedPokemon = async () => {
    await Promise.all(pokemonList)
    .then(data => {
        data.reverse();
        data.map(pokemonData => {
            makePokeSet(pokemonData)
        })
        document.addEventListener('click', (e) => {
            if (currentPokemonOrder === 'pokemonIdRev'){
                getPokemonData(e, data)
                document.addEventListener('click', e => getPrevAndNextPokemon(e, data))
            }
        })
    })
   pokemonCards.innerHTML = pokemonCardsHTML
}


const getIdOrderedPokemon = async () => {
    await Promise.all(pokemonList)
    .then(data => {
        data.map(pokemonData => {
            makePokeSet(pokemonData)
        })
        document.addEventListener('click', (e) => {
            if (currentPokemonOrder === 'pokemonId') {
                getPokemonData(e, data)
                document.addEventListener('click', e => getPrevAndNextPokemon(e, pokemonList))
            }
        })
    })
   pokemonCards.innerHTML = pokemonCardsHTML
}

const getLetterOrderedPokemon = async () => {
    await Promise.all(pokemonList)
    .then(data => {
        data.sort((a, b) => {
            if (a.name < b.name){return -1}
            if (a.name > b.name){return 1}
            return 0
        })
        data.map(pokemonData => {
            makePokeSet(pokemonData)
        })
        document.addEventListener('click', (e) => {
            if (currentPokemonOrder === 'pokemonName') {
                getPokemonData(e, data)
                document.addEventListener('click', e => getPrevAndNextPokemon(e, data))
            }
        })
    })
   pokemonCards.innerHTML = pokemonCardsHTML
}

const reverseLetterOrderedPokemon = async () => {
    await Promise.all(pokemonList)
    .then(data => {
        data.sort((a, b) => {
            if (a.name > b.name){return -1}
            if (a.name < b.name){return 1}
            return 0
        })
        data.map(pokemonData => {
            makePokeSet(pokemonData)
        })
        document.addEventListener('click', (e) => {
            if (currentPokemonOrder === 'pokemonNameRev') {
                getPokemonData(e, data)
                document.addEventListener('click', e => getPrevAndNextPokemon(e, data))
            }
        })
    })
   pokemonCards.innerHTML = pokemonCardsHTML
}
for(let options of sortOptions){
    options.addEventListener('click', (e) => {
        let optionText = e.target.firstChild.parentElement.innerHTML
        document.querySelector('.sort-results p').innerHTML = optionText
        sortDisplayTogg = false
        sortOptionsDisplay.classList.remove('active')    
    })
}
sortDisplay.addEventListener('click', () => {
    sortDisplayTogg = !sortDisplayTogg
    if (sortDisplayTogg) {
        sortOptionsDisplay.classList.add('active')
    } else {
        sortOptionsDisplay.classList.remove('active')    
    }
})


const makePrivPokeSet = (pokeData) => {
    const [type1, type2] = pokeData.types
    let typeHTML = ``
    let favClass = ``
    pokemonCardsHTML=``
    let properName = capitalize(pokeData.name)
    let properType1 = capitalize(type1.type.name)
     if (pokeData.favorited) {
         favClass = `fas fa-star empty-star`
     } else {
         
         favClass = `far fa-star empty-star`
     }
    if (pokeData.types.length === 1) {
     typeHTML = `
     <div data-types="${properType1}" class="type-1"><p>${properType1}</p></div>
     `
    } else {
        let properType2 = capitalize(type2.type.name)
        typeHTML = `
         <div data-types="${properType1}" class="type-1"><p>${properType1}</p></div>
         <div data-types="${properType2}" class="type-2"><p>${properType2}</p></div>
        `
    }
    pokemonCardsHTML = `
    <div class="pokemon-card">
    <div class="img-container">
     <i class="${favClass}" data-name='${pokeData.name}'></i>
        <img class="pokemon-img" data-api="${pokeData.species.url}" src="${pokeData.sprites.front_default}" alt="">
    </div>
    <div class="pokemon-index"># ${pokeData.id}</div>
        <h3 class="pokemon-name">${properName}</h3>
        <div  class="pokemon-types">
           ${typeHTML}
        </div>
    </div>
    `   
 }

searchBtn.addEventListener('click', e => {
    let searchValue = pokemonSearchBar.value.toLowerCase().trim()
    pokemonCards.innerHTML = ''
    pokemonCardsHTML === ''
    Promise.all(pokemonList)
    .then(pokemons => pokemons.map(pokemon => {
        let pokemonName = pokemon.name
        if (pokemonName === searchValue) {
            console.log(pokemon);
            makePrivPokeSet(pokemon)
        }
        pokemonCards.innerHTML = pokemonCardsHTML
    }))
})



document.addEventListener('click', e => {
    let thisClassName = e.target.className
    switch (thisClassName) {
        case 'lowestId':
            pokemonCardsHTML = ``
            currentPokemonOrder = 'pokemonId'
            getIdOrderedPokemon()
            break;
    
        case 'highestId':
            pokemonCardsHTML = ``
            currentPokemonOrder = 'pokemonIdRev'
            reverseIdOrderedPokemon()
            break;
    
        case "A-Z":
            pokemonCardsHTML = ``
            currentPokemonOrder = 'pokemonName'
            getLetterOrderedPokemon()
            break;
    
        case "Z-A":
            pokemonCardsHTML = ``
            currentPokemonOrder = 'pokemonNameRev'
            reverseLetterOrderedPokemon()
            break;
        default:
            break;
    }
})

favorites.addEventListener('click', () => {
    pokemonCardsHTML = ``
    Promise.all(favoritesList)
    .then(data => {
        data.map(favorites => {
            makePokeSet(favorites)
        })
    })
    favoritesList.map(favorites => makePokeSet(favorites))
   pokemonCards.innerHTML = pokemonCardsHTML

})

closeModal.addEventListener('click', (e) => {
    e.path[3].classList.remove("active")
})

document.addEventListener('click', (e) => {
    favoritesClicked = !favoritesClicked
    let pokemonName = e.target.dataset

    if (e.target.classList[2] === 'empty-star') {
        Promise.all(pokemonList).then(data => {
            let selectedIndex = data.findIndex(pokemonData => pokemonData.name === pokemonName.name)
            if (e.target.classList[0] === 'far') {
                favoriteCount++
                e.target.classList.replace('far', 'fas')
                favoritesList.push(data[selectedIndex])
                data[selectedIndex].favorited = true

            } else {
                favoriteCount-- 
                e.target.classList.replace('fas', 'far')
                data[selectedIndex].favorited = false
                let i = favoritesList.findIndex(pokemonData => pokemonData.name === pokemonName.name)
                if (i === 0) {
                    favoritesList.splice(0, 1)
                    
                } else {
                    favoritesList.splice(i, 1)
                }

            }
        })
}

})