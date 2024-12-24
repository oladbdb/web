document.addEventListener('DOMContentLoaded', () => {
  const dishesContainer = document.getElementById('selected-dishes');
  const orderFormSection = document.getElementById('order_form');
  const resetOrderButton = document.getElementById('reset-order');
  const sendOrderButton = document.getElementById('send-order');

  if (sendOrderButton) {
    sendOrderButton.addEventListener('click', sendOrder);
  }
  if (resetOrderButton) {
    resetOrderButton.addEventListener('click', resetOrder);
  }

  // Проверяем наличие товаров в локальном хранилище
  const selectedDishes = JSON.parse(localStorage.getItem('selectedDishes'));
  if (Object.values(selectedDishes).every(dish => dish === null)) {
    dishesContainer.innerHTML = '<p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="lunch.html">Собрать ланч</a>.</p>';
    orderFormSection.style.display = 'none';
  }
  else {
    const storedDishes = localStorage.getItem('selectedDishes');
    const selectedDishes = JSON.parse(storedDishes);
    displaySelectedDishes(selectedDishes, dishesContainer);
  }
    loadSelectedDishes();
  });
  
  function displaySelectedDishes(selectedDishes, container) {
    container.innerHTML = ''; // Очищаем содержимое контейнера
  
    Object.entries(selectedDishes).forEach(([category, dish]) => {
      if (dish) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish';
        dishDiv.setAttribute('data-dish', dish.keyword);
  
        const img = document.createElement('img');
        img.src = dish.image;
        img.alt = dish.name;
  
        const weight = document.createElement('p');
        weight.className = 'weight';
        weight.textContent = dish.count;
  
        const name = document.createElement('p');
        name.className = 'name';
        name.textContent = dish.name;
  
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `${dish.price}₽`;
  
        const button = document.createElement('button');
        button.textContent = 'Удалить'; 
  
        button.addEventListener('click', () => {
          removeDishFromCategory(category);
        });
  
        dishDiv.appendChild(img);
        dishDiv.appendChild(weight);
        dishDiv.appendChild(name);
        dishDiv.appendChild(price);
        dishDiv.appendChild(button);
  
        container.appendChild(dishDiv);
      }
    });
  }
  
  function loadSelectedDishes() {
    // Загружаем данные из localStorage
    const storedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {
      soup: null,
      salad: null,
      main: null,
      drink: null,
      dessert: null
    };
  
    selectedDishes = storedDishes;
    updateOrderDisplay();
  }
  
  function updateOrderDisplay() {
    // Функция обновления отображения выбранных блюд и итоговой стоимости
  
    updateDishDisplay('.dish-title.soup', selectedDishes.soup);
    updateDishDisplay('.dish-title.salad', selectedDishes.salad);
    updateDishDisplay('.dish-title.main', selectedDishes.main);
    updateDishDisplay('.dish-title.drink', selectedDishes.drink);
    updateDishDisplay('.dish-title.dessert', selectedDishes.dessert);
  
    // Обновление итоговой стоимости
    const totalPrice = calculateTotalPrice();
    const totalElement = document.querySelector('.total');
    if (totalElement) {
      totalElement.textContent = `Итого: ${totalPrice}₽`;
    }
  }
  
  function updateDishDisplay(selector, dish) {
    const dishElement = document.querySelector(selector);
    if (dishElement) {
      if (dish) {
        dishElement.textContent = `${dish.name} ${dish.price}₽`;
      } else {
        dishElement.textContent = 'Не выбрано';
      }
    }
  }
  
  function calculateTotalPrice() {
    return (selectedDishes.soup?.price || 0) +
           (selectedDishes.salad?.price || 0) +
           (selectedDishes.main?.price || 0) +
           (selectedDishes.drink?.price || 0) +
           (selectedDishes.dessert?.price || 0);
  }
  
  function removeDishFromCategory(category) {
    const dishesContainer = document.getElementById('selected-dishes');
    // Удаляем блюдо из указанной категории
    selectedDishes[category] = null;
    localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
    // Проверяем, остались ли выбранные блюда
    const hasNonNullValue = Object.values(selectedDishes).some(value => value !== null);
    if (hasNonNullValue) {
      // Если есть хотя бы одно выбранное блюдо, сохраняем в localStorage
      localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
      displaySelectedDishes(JSON.parse(localStorage.getItem('selectedDishes')), dishesContainer);
      updateOrderDisplay();
    } else {
      // Показываем сообщение о пустом заказе
      const orderFormSection = document.getElementById('order_form');
      orderFormSection.style.display = 'none';
      dishesContainer.innerHTML = `<p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="lunch.html">Собрать ланч</a>.</p>`;

    }
  }

async function displayAlert(text) {
  const notification = document.createElement('div');
  notification.id = 'notification';

  const notificationp = document.createElement('p');
  notification.appendChild(notificationp);

  const okButton = document.createElement('button');
  okButton.textContent = 'Окей';
  okButton.addEventListener('click', () => {
    notification.style.display = 'none';
  });
  notification.appendChild(okButton);

  document.body.appendChild(notification);
  let notificationMessage = text;

  notification.style.display = 'flex';
  notificationp.textContent = notificationMessage;
  notification.appendChild(okButton);
}

async function resetOrder(event) {
  event.preventDefault();
  removeDishFromCategory('soup');
  removeDishFromCategory('salad');
  removeDishFromCategory('main');
  removeDishFromCategory('drink');
  removeDishFromCategory('dessert');
  updateOrderDisplay();
}

async function sendOrder(event) {
  event.preventDefault(); // Предотвращаем отправку формы по умолчанию

  const selectedDishes = JSON.parse(localStorage.getItem('selectedDishes'));

  const notification = document.createElement('div');
  notification.id = 'notification';

  const notificationp = document.createElement('p');
  notification.appendChild(notificationp);

  const okButton = document.createElement('button');
  okButton.textContent = 'Окей';
  okButton.addEventListener('click', () => {
    notification.style.display = 'none';
  });
  notification.appendChild(okButton);

  document.body.appendChild(notification);

  let notificationMessage = '';

  if (
    !selectedDishes.soup &&
    !selectedDishes.main &&
    !selectedDishes.salad &&
    !selectedDishes.drink &&
    !selectedDishes.dessert
  ) {
    notificationMessage = 'Ничего не выбрано. Выберите блюда для заказа.';
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
    notification.style.display = 'flex';
    notificationp.textContent = notificationMessage;
    notification.appendChild(okButton);
    return;
  } 

  // Подготавливаем данные для отправки
  const form = document.querySelector('#order_form form');
  const formData = new FormData(form);

  // Проверяем обязательные поля
  const fullName = document.getElementById('name').value.trim();
  const phone = document.getElementById('tel').value.trim();
  const deliveryAddress = document.getElementById('adress').value.trim();
  const deliveryType = document.querySelector('input[name="delivery-time"]:checked');

  if (!fullName || !phone || !deliveryAddress || !deliveryType) {
    displayAlert('Пожалуйста, заполните все обязательные поля: имя, телефон, адрес доставки и тип доставки.');
    return;
  }

  // Приведение значения delivery_type к допустимым значениям
  const deliveryTypeValue = deliveryType.value === 'asap' ? 'now' : 'by_time';

  formData.append('full_name', fullName);
  formData.append('phone', phone);
  formData.append('delivery_address', deliveryAddress);
  formData.append('delivery_type', deliveryTypeValue);
  if (selectedDishes.soup) {formData.append('soup_id', selectedDishes.soup.id);}
  if (selectedDishes.salad) {formData.append('salad_id', selectedDishes.salad.id);}
  if (selectedDishes.main) {formData.append('main_course_id', selectedDishes.main.id);}
  if (selectedDishes.drink) {formData.append('drink_id', selectedDishes.drink.id);}
  if (selectedDishes.dessert) {formData.append('dessert_id', selectedDishes.dessert.id);}
  
  
  
  

  const apiUrl = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const result = await response.json();

    // Успешная отправка
    displayAlert('Заказ успешно оформлен!');
    removeDishFromCategory('soup');
    removeDishFromCategory('salad');
    removeDishFromCategory('main');
    removeDishFromCategory('drink');
    removeDishFromCategory('dessert');
  } catch (error) {
    displayAlert('Произошла ошибка при оформлении заказа. Попробуйте ещё раз.');
  }
}
