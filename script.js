

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
            return lowerItem.includes(input.value.toLowerCase());
            
            
        });
        
        //вывод город в список по введеным данным
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


//получение городов
/*
getData(proxy + citiesAPI, (data) =>{  
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
    
});
*/


//получения рейса 
getData(calendar + '?origin=KGD&destination=SVX&depart_date=2020-05-25&one_way=false', (data) => {
   console.log(JSON.parse(data));
  
});
 


