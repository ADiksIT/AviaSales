

const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
        dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
        inputCitiesTo = formSearch.querySelector('.input__cities-to'),
        dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
        inputDateDepart = formSearch.querySelector('.input__date-depart');





//API & TOKEN
const   citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
        proxy = 'https://cors-anywhere.herokuapp.com/',
        API_KEY = 'ba6c7ed27001ef7b6a055635bda5a3e3',
        calendar = 'http://min-prices.aviasales.ru/calendar_preload';

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

//получения JSON
const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) {
            return;
        } 

        if(request.status === 200){
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};


const renderCheapDay = (cheapTicket) => {

	console.log(cheapTicket);
};

const renderCheapAll = (cheapTickets) => {
	cheapTickets.sort(function (a, b) {
		if (a.value > b.value) {
		  return 1;
		}
		if (a.value < b.value) {
		  return -1;
		}
		// a должно быть равным b
		return 0;
	  });
	console.log(cheapTickets);
};

const renderCheap = (data, date) => {
	const CheapTicketAll = JSON.parse(data).best_prices;
	const CheapTicketDay = CheapTicketAll.filter((item) => item.depart_date === date);
	renderCheapAll(CheapTicketAll);
	renderCheapDay(CheapTicketDay);
	
	
}; 


//ввод данных в форму "Откуда" и передача данных функции вывода
inputCitiesFrom.addEventListener('input' , () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

//ввод данных в форму "Кудв" и передача данных функции вывода
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

//вывод города в форму "Откуда" по клику 
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

//вывод города в форму "Кудв" по клику 
dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name).code,
        to: city.find((item) => inputCitiesTo.value === item.name).code,
        when: inputDateDepart.value,
    }

	const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;
	

	getData(proxy + calendar + requestData, (response) => {
		renderCheap(response, formData.when);		
	});
});

//получение городов
getData(proxy + citiesAPI, (data) =>{  
    city = JSON.parse(data).filter((item) => {
        return item.name;
	});
    
});



//получения рейса 



