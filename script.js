
const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
        dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
        inputCitiesTo = formSearch.querySelector('.input__cities-to'),
        dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
        inputDateDepart = formSearch.querySelector('.input__date-depart');

const city = [
    "Москва", "Киев", "Санкт-Питербург", "Днепр", "Истамбул", "Владивосток",
    "Таганрог", "Харьков", "Одесса", "Караганда", "Минск", "Сколково", "Екатеринбург",
    "Варшава", "Мариуполь" 
];

//вывод городов по введенным данным
const showCity =  (input, list) => {

    //очистка списка при пустом поле
    list.textContent = '';

    //проверка на пустою строку
    if (input.value !== '') {

        //фильтр городов по введеным данным
        const filterCity = city.filter((item) => {

            //возврат списка город
            const lowerItem = item.toLowerCase();
            return lowerItem.includes(input.value.toLowerCase());
        });
        
        //вывод город в список по введеным данным
        filterCity.forEach((item) => {

            //создание елемента списка
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
    }
   
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

    const targetCityFrom = event.target;
    if (targetCityFrom.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = targetCityFrom.textContent;
        dropdownCitiesFrom.textContent = '';
    }

});

//вывод города в форму "Кудв" по клику 
dropdownCitiesTo.addEventListener('click', (event) => {
    const targetCityTo = event.target;
    if (targetCityTo.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = targetCityTo.textContent;
        dropdownCitiesTo.textContent = '';
    }
});

