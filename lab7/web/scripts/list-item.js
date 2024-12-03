async function displayDishes(category, kind, elementList) {
  const section = document.getElementById(elementList);
  section.innerHTML = '';
  const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
  const menuItems = await response.json();
  menuItems.forEach((item) => {
    if (item.category === 'main-course') {
      item.category = 'main';
    }
  });
  const filteredItems = menuItems
    .filter((item) => item.category === category && (kind === null || item.kind === kind))
    .sort((a, b) => a.name.localeCompare(b.name));

  filteredItems.forEach((item) => {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';
    dishDiv.setAttribute('data-dish', item.keyword);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const weight = document.createElement('p');
    weight.className = 'weight';
    weight.textContent = item.count;

    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = item.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `${item.price}₽`;

    const button = document.createElement('button');
    button.textContent = 'Добавить';

    dishDiv.appendChild(img);
    dishDiv.appendChild(weight);
    dishDiv.appendChild(name);
    dishDiv.appendChild(price);
    dishDiv.appendChild(button);

    section.appendChild(dishDiv);
    document.querySelector('.dish-title-block').style.display = 'none';
    document.querySelector('.nothing').style.display = 'block';
    dishDiv.addEventListener('click', () => selectDish(item, dishDiv, elementList));
  });
}

let selectedDishes = {
  soup: null,
  salad: null,
  main: null,
  drink: null,
  dessert: null,
};

function selectDish(item, dishDiv, elementList) {
  const category = item.category;

  const dishesInCategory = document.querySelectorAll(`#${elementList} .dish`);
  dishesInCategory.forEach((dish) => dish.classList.remove('selected'));

  // Добавляем класс selected к выбранному блюду
  dishDiv.classList.add('selected');

  // Сохраняем выбранное блюдо в соответствующей категории
  selectedDishes[category] = item;

  updateOrederDisplay();
}

function updateOrederDisplay() {
  const soupDisplay = selectedDishes.soup
    ? `${selectedDishes.soup.name} ${selectedDishes.soup.price}₽`
    : 'Не выбрано';
  const saladDisplay = selectedDishes.salad
    ? `${selectedDishes.salad.name} ${selectedDishes.salad.price}₽`
    : 'Не выбрано';
  const mainDisplay = selectedDishes.main
    ? `${selectedDishes.main.name} ${selectedDishes.main.price}₽`
    : 'Не выбрано';
  const drinkDisplay = selectedDishes.drink
    ? `${selectedDishes.drink.name} ${selectedDishes.drink.price}₽`
    : 'Не выбрано';
  const desertDisplay = selectedDishes.dessert
    ? `${selectedDishes.dessert.name} ${selectedDishes.dessert.price}₽`
    : 'Не выбрано';

  document.querySelector('.dish-title-block').style.display = 'block';
  document.querySelector('.nothing').style.display = 'none';

  document.querySelector('.dish-title.soup').textContent = soupDisplay;
  document.querySelector('.dish-title.salad').textContent = saladDisplay;
  document.querySelector('.dish-title.main').textContent = mainDisplay;
  document.querySelector('.dish-title.drink').textContent = drinkDisplay;
  document.querySelector('.dish-title.dessert').textContent = desertDisplay;

  const totalPrice =
    (selectedDishes.soup?.price || 0) +
    (selectedDishes.salad?.price || 0) +
    (selectedDishes.main?.price || 0) +
    (selectedDishes.drink?.price || 0) +
    (selectedDishes.dessert?.price || 0);

  document.querySelector('.total').textContent = `Итого: ${totalPrice}₽`;
}

// Выводим блюда
displayDishes('soup', null, 'soups-list');
displayDishes('salad', null, 'starters-list');
displayDishes('main', null, 'main-dishes-list');
displayDishes('drink', null, 'drinks-list');
displayDishes('dessert', null, 'deserts-list');

document.querySelector('form').addEventListener('reset', () => {
  selectedDishes = {
    soup: null,
    salad: null,
    main: null,
    drink: null,
    dessert: null,
  };

  displayDishes('soup', null, 'soups-list');
  displayDishes('salad', null, 'starters-list');
  displayDishes('main', null, 'main-dishes-list');
  displayDishes('drink', null, 'drinks-list');
  displayDishes('dessert', null, 'deserts-list');

  document.querySelector('dish-title-block').style.display = 'none';
});
