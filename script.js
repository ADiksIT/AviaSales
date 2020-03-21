
/////////////////TASK
//доработать модельные окна место 'alert'
//убирать лишки если кликнул не по ним
////////////////TASK
const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
        dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
        inputCitiesTo = formSearch.querySelector('.input__cities-to'),
        dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
        inputDateDepart = formSearch.querySelector('.input__date-depart'),
        cheapestTicket = document.getElementById('cheapest-ticket'),
        otherCheapTickets = document.getElementById('other-cheap-tickets');


//API & TOKEN
const   citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
        proxy = 'https://cors-anywhere.herokuapp.com/',
        API_KEY = 'ba6c7ed27001ef7b6a055635bda5a3e3',
        calendar = 'http://min-prices.aviasales.ru/calendar_preload';
        MAX_COUNT = 5;


//миссив городов когда вводим данные в input
let city = [];

//вывод городов по введенным данным
const showCity =  (input, list) => {

    //очистка списка при пустом поле
    list.textContent = '';

    //проверка на пустою строку
    if (input.value !== '') {

        //фильтр городов по введеным данным
        const filterCity = city.filter((item) => {

            //возврат списка город
			const lowerItem = item.name.toLowerCase();
			
            return lowerItem.startsWith(input.value.toLowerCase());
            
            
        });
		
		
		//вывод город в список по введеным данным
		filterCity.sort((a, b) => {
			if(a.name > b.name){
				return 1;
			}
			if(a.name < b.name) {
				return -1;
			}
			return 0;
		});		
        filterCity.forEach((item) => {

			//создание елемента списка
			
            const li = document.createElement('li');
			li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
   
};

//Клик по выбранному городу и вывод его в форму
const selectCity = (event, input, dropdown) => {
    const targetCity = event.target;
    if (targetCity.tagName.toLowerCase() === 'li') {
        input.value = targetCity.textContent;
        dropdown.textContent = '';
    }

};

//получения JSON с сервера
const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();
    
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) {
            return;
        } 

        if(request.status === 200){
            callback(request.response);
        } else {
            reject(request.status);
        }
    });

    request.send();
};

//формирование строки количества переводов
const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    }  else {
        return 'Без пересадок';
    }
};

//формирования имени города
const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);

    return objCity.name;
};

//формирования даты
const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

//формирования ссылки для билета
const getLink = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month;

    link += data.destination;

    link += '1';

    return link;
};

//формирование HTML элемента(билета), а также вывод сообщения если билета не нашлось
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLink(data)}" target = "_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>Билетов на выбранную дату не нашлось</h3>';
    }


    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

//отрисовка самого дешевого билета на выбранную дату
const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};


//Вывод всех(10) билетов на другие даты по самой низкой цене
const renderCheapAll = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) =>  a.value - b.value );

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

//обработка данных с сервера и парсинг JSON
const renderCheap = (data, date) => {
	const CheapTicketAll = JSON.parse(data).best_prices;
    const CheapTicketDay = CheapTicketAll.filter((item) => item.depart_date === date);
    //передача данных в функции отрисовки билетов
	renderCheapAll(CheapTicketAll);
	renderCheapDay(CheapTicketDay);
	
	
}; 


//ввод данных в форму "Откуда" и передача данных функции вывода
inputCitiesFrom.addEventListener('input' , () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

//ввод данных в форму "Куда" и передача данных функции вывода
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

//вывод города в форму "Откуда" по клику 
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

//вывод города в форму "Куда" по клику 
dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

//отправка данных их формы на сервер, формирования запроса, защита от неправильного ввода и отсутсвия рейса
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();


    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value,
    }

    if (formData.from && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(proxy + calendar + requestData, (response) => {
            renderCheap(response, formData.when);		
        }, (e) => {
            //тоже на модалку
            alert('Нет рейса');
        });
    } else {
        //Заменить на модальное окно
        alert('Введите коректное название города');
    }
});

//запрос городов с сервера
getData(proxy + citiesAPI, (data) =>{  
    city = JSON.parse(data).filter((item) => {
        return item.name;
	});
    
});



