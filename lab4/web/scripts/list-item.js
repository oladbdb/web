function displayDishes(category, elementList) {
  const section = document.getElementById(elementList);
  const filteredItems = menuItems
    .filter((item) => item.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  filteredItems.forEach((item) => {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';

    // Добавляем атрибут data-dish с keyword
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
    dishDiv.addEventListener('click', () => selectDish(item, dishDiv, elementList));
  });
}

let selectedDishes = {
  soup: null,
  main: null,
  drink: null,
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
  const mainDisplay = selectedDishes.main
    ? `${selectedDishes.main.name} ${selectedDishes.main.price}₽`
    : 'Не выбрано';
  const drinkDisplay = selectedDishes.drink
    ? `${selectedDishes.drink.name} ${selectedDishes.drink.price}₽`
    : 'Не выбрано';

  document.querySelector('.dish-title-block').style.display = 'block';
  document.querySelector('.nothing').style.display = 'none';

  document.querySelector('.dish-title.soup').textContent = soupDisplay;
  document.querySelector('.dish-title.main').textContent = mainDisplay;
  document.querySelector('.dish-title.drink').textContent = drinkDisplay;

  const totalPrice =
    (selectedDishes.soup?.price || 0) +
    (selectedDishes.main?.price || 0) +
    (selectedDishes.drink?.price || 0);

  document.querySelector('.total').textContent = `Итого: ${totalPrice}₽`;
}

// Выводим блюда
displayDishes('soup', 'soups-list');
displayDishes('main', 'main-dishes-list');
displayDishes('drink', 'drinks-list');
