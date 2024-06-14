import colours from './colours.js';
import { getDataFromURL } from './pokeapi.js';
import { titlecase } from './utils.js';


let nextLoad = null;

const container = document.querySelector('div.container');
const loader = document.querySelector('.wrapper-loader');

window.addEventListener('scroll', loadOnScroll);

window.addEventListener('load', async () => {
    let endpoint = `https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`;

    await createCards(endpoint);

});

async function createCards (endpoint) {
    checkLoading(true);

    const response = await getDataFromURL(endpoint);
    nextLoad = response.next;

    if (response.results) {


        const promises = response.results.map(element => getDataFromURL(element.url));
        const responses = await Promise.all(promises);

        responses.forEach(pokemon => {

            // Card
            const card = document.createElement('div');
            card.classList.add('card', pokemon.types[0].type.name);
            container.append(card);

            if (pokemon.types[1]) {
                card.style.backgroundImage = `linear-gradient(120deg, ${colours[pokemon.types[0].type.name]}, ${colours[pokemon.types[1].type.name]})`;
            }

            card.addEventListener('click', () => console.log(pokemon));

            // Card Image
            const cardImgWrapper = document.createElement('div');
            cardImgWrapper.classList.add('card-img-wrapper');
            const cardImg = document.createElement('img');
            cardImg.classList.add('card-img');
            cardImg.setAttribute('src', pokemon.sprites.other["official-artwork"].front_default);

            cardImgWrapper.append(cardImg);
            card.append(cardImgWrapper);

            // Title
            const cardTitle = document.createElement('div');
            cardTitle.classList.add('card-title');

            // Name
            const cardTitleName = document.createElement('span');
            cardTitleName.classList.add('card-title-name');
            cardTitleName.innerText = titlecase(pokemon.name);
            cardTitle.append(cardTitleName);

            // N°
            const cardTitleNumber = document.createElement('span');
            cardTitleNumber.classList.add('card-title-number');
            cardTitleNumber.innerText = `N° ${pokemon.id}`;
            cardTitle.append(cardTitleNumber);

            card.append(cardTitle);

            // Types
            const cardTypes = document.createElement('div');
            cardTypes.classList.add('card-types');
            const type1 = document.createElement('span');
            type1.classList.add("card-type", pokemon.types[0].type.name);
            type1.innerText = pokemon.types[0].type.name;
            cardTypes.append(type1);

            if (pokemon.types[1]) {
                const type2 = document.createElement('span');
                type2.classList.add("card-type", pokemon.types[1].type.name);
                type2.innerText = pokemon.types[1].type.name;
                cardTypes.append(type2);
            }
            card.append(cardTypes);

        });

        checkLoading(false);
    }
}

function loadOnScroll () {


    const endOfPage = window.innerHeight + window.scrollY + 50 >= document.body.offsetHeight;


    if (endOfPage && nextLoad) createCards(nextLoad);

}

function checkLoading (isLoading) {

    if (isLoading) {
        loader.classList.remove('hide');
    }
    else {
        loader.classList.add('hide');
    }
}

