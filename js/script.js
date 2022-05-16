const API_KEY = '6b7f0ab1249844e7a0f49f86a1646bbe';
const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');


const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getdata = async (url) => {
    const response = await fetch (url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    });

    const data = await response.json();

    return data
};


const getDateCorrectFormat = isoDate => {

    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return `<span class="news-date">${fullDate}</span> ${fullTime}`
};

const renderCard = (data) => {
    newsList.textContent = '';
    data.forEach(news => {
        const card = document.createElement('li');
        card.className = 'news-item';

        card.innerHTML = `
            <img src="${news.urlToImage}" alt="${news.title}" class="news-image" width="270" height="200">
            <h3 class="news-title">
                <a href="${news.url}" class="news-link" target="_blank">${news.title || ''}</a>
            </h3>
            <p class="news-description">${news.description || ''}</p>
            <div class="news-footer">
                <time class="news-datetime" datetime="${news.publishedAt}">
                ${getDateCorrectFormat(news.publishedAt)}
                </time>
                <div class="news-author">${news.author || ''}</div>
            </div>
        `;

        newsList.append(card);
    })
}

const loadNews = async () => {
    newsList.innerHTML = '<li class = "preload"></li>'
    const country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);
    title.classList.add('hide');
    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100`);
    renderCard(data.articles);
};

const loadSearch = async value => {
    
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}&pageSize=100`);
    title.classList.remove('hide');
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов`;
    choices.setChoiceByValue('');
    renderCard(data.articles);
}

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews();
    
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();   
    const value = formSearch.search.value;
    loadSearch(value);
    formSearch.reset(); 
});

loadNews()