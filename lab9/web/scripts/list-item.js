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

  const storedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {};

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

    // Проверяем, если блюдо уже выбрано
    if (storedDishes[category]?.keyword === item.keyword) {
      dishDiv.classList.add('selected');
    }

    section.appendChild(dishDiv);

    // Добавляем событие для выбора блюда
    dishDiv.addEventListener('click', () => selectDish(item, dishDiv, elementList));
  });
}

let selectedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {
  soup: null,
  salad: null,
  main: null,
  drink: null,
  dessert: null,
};

function selectDish(item, dishDiv, elementList) {
  const category = item.category;

  // Обновляем выбранные блюда
  selectedDishes[category] = item;

  // Сохраняем в localStorage
  localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));

  // Обновляем выделение
  const dishesInCategory = document.querySelectorAll(`#${elementList} .dish`);
  dishesInCategory.forEach((dish) => dish.classList.remove('selected'));
  dishDiv.classList.add('selected');

  updateOrderDisplay();
}

function updateOrderDisplay() {
  btn_order = document.getElementById('order-button');

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
  const dessertDisplay = selectedDishes.dessert
    ? `${selectedDishes.dessert.name} ${selectedDishes.dessert.price}₽`
    : 'Не выбрано';

  // Пересчёт итоговой стоимости
  const totalPrice =
    (selectedDishes.soup?.price || 0) +
    (selectedDishes.salad?.price || 0) +
    (selectedDishes.main?.price || 0) +
    (selectedDishes.drink?.price || 0) +
    (selectedDishes.dessert?.price || 0);

  document.querySelector('.total-title').textContent = `Итого: ${totalPrice}₽`;

  // Проверка наличия хотя бы одного выбранного блюда
  const hasSelectedDishes = Object.values(selectedDishes).some((dish) => dish !== null);

  // Управление видимостью панели для перехода к оформлению заказа
  const orderPanel = document.querySelector('#order-summary');
  if (orderPanel) {
    orderPanel.style.display = hasSelectedDishes ? 'block' : 'none';
  }
  let notificationMessage = '';
  if (
    !selectedDishes.soup &&
    !selectedDishes.main &&
    !selectedDishes.salad &&
    !selectedDishes.drink &&
    !selectedDishes.dessert
  ) {
  } else if (selectedDishes.soup && !selectedDishes.main && !selectedDishes.salad) {
    notificationMessage = 'Выберите главное блюдо/салат/стартер.';
  } else if (selectedDishes.salad && !selectedDishes.soup && !selectedDishes.main) {
    notificationMessage = 'Выберите суп или главное блюдо.';
  } else if (
    (selectedDishes.drink || selectedDishes.dessert) &&
    !selectedDishes.main &&
    !selectedDishes.salad &&
    !selectedDishes.soup
  ) {
    notificationMessage = 'Выберите главное блюдо.';
  } else if (!selectedDishes.drink) {
    notificationMessage = 'Выберите напиток.';
  }

  if (notificationMessage) {
    btn_order.className = ' disabled';
  } else {
    btn_order.className = '';
  }
}

// Инициализация страницы
function initPage() {
  updateOrderDisplay();

  // Загружаем данные и отображаем блюда
  displayDishes('soup', null, 'soups-list');
  displayDishes('salad', null, 'starters-list');
  displayDishes('main', null, 'main-dishes-list');
  displayDishes('drink', null, 'drinks-list');
  displayDishes('dessert', null, 'deserts-list');
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);
