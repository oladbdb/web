function displayDishes(category, kind, elementList) {
  const section = document.getElementById(elementList);
  section.innerHTML = '';

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
    dishDiv.addEventListener('click', () => selectDish(item, dishDiv, elementList));
  });
}

function setupFilters(category, filterId, elementList) {
  const filterButtons = document.querySelectorAll(`#${filterId} .kind`);
  let activeFilter = null;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedKind = button.getAttribute('data-kind');

      // Если повторно нажали на активный фильтр, убираем фильтрацию
      if (activeFilter === selectedKind) {
        activeFilter = null;
        button.classList.remove('selected');
      } else {
        activeFilter = selectedKind;
        filterButtons.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
      }

      // Фильтруем блюда
      displayDishes(category, activeFilter, elementList);
    });
  });
}


let selectedDishes = {
  soup: null,
  starter: null,
  main: null,
  drink: null,
  desert: null,
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
  const starterDisplay = selectedDishes.starter
    ? `${selectedDishes.starter.name} ${selectedDishes.starter.price}₽`
    : 'Не выбрано';
  const mainDisplay = selectedDishes.main
    ? `${selectedDishes.main.name} ${selectedDishes.main.price}₽`
    : 'Не выбрано';
  const drinkDisplay = selectedDishes.drink
    ? `${selectedDishes.drink.name} ${selectedDishes.drink.price}₽`
    : 'Не выбрано';
  const desertDisplay = selectedDishes.desert
    ? `${selectedDishes.desert.name} ${selectedDishes.desert.price}₽`
    : 'Не выбрано';

  document.querySelector('.dish-title-block').style.display = 'block';
  document.querySelector('.nothing').style.display = 'none';

  document.querySelector('.dish-title.soup').textContent = soupDisplay;
  document.querySelector('.dish-title.starter').textContent = starterDisplay;
  document.querySelector('.dish-title.main').textContent = mainDisplay;
  document.querySelector('.dish-title.drink').textContent = drinkDisplay;
  document.querySelector('.dish-title.desert').textContent = desertDisplay;

  const totalPrice =
    (selectedDishes.soup?.price || 0) +
    (selectedDishes.starter?.price || 0) +
    (selectedDishes.main?.price || 0) +
    (selectedDishes.drink?.price || 0) +
    (selectedDishes.desert?.price || 0);

  document.querySelector('.total').textContent = `Итого: ${totalPrice}₽`;
}

setupFilters('soup', 'soup-filters', 'soups-list');
setupFilters('starter', 'starter-filters', 'starters-list');
setupFilters('main', 'main-filters', 'main-dishes-list');
setupFilters('drink', 'drink-filters', 'drinks-list');
setupFilters('desert', 'desert-filters', 'deserts-list');


// Выводим блюда
displayDishes('soup', null, 'soups-list');
displayDishes('starter', null, 'starters-list');
displayDishes('main', null, 'main-dishes-list');
displayDishes('drink', null, 'drinks-list');
displayDishes('desert', null, 'deserts-list');