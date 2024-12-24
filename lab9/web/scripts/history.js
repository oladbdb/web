document.addEventListener('DOMContentLoaded', () => {
// Элементы для модального окна удаления
const deleteModal = document.getElementById('deleteModal');
const deleteModalClose = document.getElementById('deleteModalClose');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// Элементы для модального окна редактирования
const editModal = document.getElementById('editModal');
const editModalClose = document.getElementById('editModalClose');
const cancelEdit = document.getElementById('cancelEdit');
const editOrderForm = document.getElementById('editOrderForm');

// Элементы для модального окна просмотра
const viewModal = document.getElementById('viewModal');
const viewModalClose = document.getElementById('viewModalClose');
const closeView = document.getElementById('closeView');

// HTML для списка заказов
const ordersTable = document.getElementById('ordersTable'); // Таблица для отображения заказов

// Функция для форматирования времени доставки
function formatDeliveryTime(order) {
    if (order.delivery_time) {
        return order.delivery_time;
    } else {
        return "В течение дня (с 7:00 до 23:00)";
    }
}

// Функция для загрузки блюд
async function loadDishes() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd');
        const dishes = await response.json();
        return dishes.reduce((map, dish) => {
            map[dish.id] = dish;
            return map;
        }, {});
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        return {};
    }
}

// Функция для получения списка элементов заказа
function getOrderItems(order, dishesMap) {
    const items = [];
    const categories = ['salad_id', 'soup_id', 'main_course_id', 'drink_id', 'dessert_id'];

    categories.forEach(category => {
        if (order[category] && dishesMap[order[category]]) {
            items.push(dishesMap[order[category]].name);
        }
    });

    return items.length > 0 ? items : ['Элементы заказа отсутствуют'];
}

// Функция для расчета общей стоимости заказа
function calculateTotalPrice(order, dishesMap) {
    const categories = ['salad_id', 'soup_id', 'main_course_id', 'drink_id', 'dessert_id'];
    return categories.reduce((total, category) => {
        if (order[category] && dishesMap[order[category]]) {
            total += dishesMap[order[category]].price;
        }
        return total;
    }, 0);
}

// Функция для удаления заказа
async function deleteOrder(orderId) {
    console.log(orderId);
    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd`, {
            method: 'DELETE',
            mode: 'no-cors',
        });

        if (response.ok) {
            console.log(`Заказ с ID ${orderId} успешно удален`);
            await loadOrders(); // Обновляем список заказов
        } else {
            console.error(`Не удалось удалить заказ с ID ${orderId}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
    }
}

// События для модального окна просмотра
viewModalClose.addEventListener('click', () => closeModal(viewModal));
closeView.addEventListener('click', () => closeModal(viewModal));

// Функция для создания строки заказа
function createOrderRow(order, dishesMap) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.created_at ? new Date(order.created_at).toLocaleString() : 'Дата неизвестна'}</td>
        <td>${getOrderItems(order, dishesMap).join(', ')}</td>
        <td>${calculateTotalPrice(order, dishesMap)}₽</td>
        <td>${formatDeliveryTime(order)}</td>
        <td>
            <img class="icon view-icon" src="img/eye-open-svgrepo-com.svg" alt="Подробнее" data-id="${order.id}"/>
            <img class="icon edit-icon" src="img/pen-square-svgrepo-com.svg" alt="Редактировать" data-id="${order.id}" />
            <img class="icon delete-icon" src="img/trash-alt-svgrepo-com.svg" alt="Удалить" data-id="${order.id}"/>
        </td>
    `;

    // Добавляем обработчик события для кнопки просмотра
    const viewButton = tr.querySelector('.view-icon');
    viewButton.addEventListener('click', () => openViewModal(order, dishesMap));

    const deleteButton = tr.querySelector('.delete-icon');
    deleteButton.addEventListener('click', () => openDeleteModal(order.id));

    const editButton = tr.querySelector('.edit-icon');
    editButton.addEventListener('click', () => openEditModal(order, dishesMap));

    return tr;
}

// Функция для загрузки заказов
async function loadOrders() {
    try {
        // Загрузка блюд
        const dishesMap = await loadDishes();

        // Загрузка заказов
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd');
        const orders = await response.json();

        if (!ordersTable) {
            console.error('Элемент ordersTable не найден');
            return;
        }

        // Сортировка заказов по дате в порядке убывания
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Очистка таблицы перед добавлением новых строк
        ordersTable.innerHTML = '';

        // Заполнение таблицы заказами
        orders.forEach((order, index) => {
            const orderRow = createOrderRow(order, index, dishesMap);
            ordersTable.appendChild(orderRow);
        });
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
    }
}

// Загрузка заказов при загрузке страницы
window.addEventListener('DOMContentLoaded', loadOrders);

let currentOrderId = null;

// Функции для открытия модальных окон
function openDeleteModal(orderId) {
    currentOrderId = orderId;
    deleteModal.style.display = 'flex';
}

function openEditModal(order, dishesMap) {
    currentOrderId = order.id;

    // Заполняем данные заказа
    document.getElementById('editOrderDate').textContent = new Date(order.created_at).toLocaleString();
    document.getElementById('editRecipientName').value = order.full_name;
    document.getElementById('editDeliveryAddress').value = order.delivery_address;
    document.getElementById('editDeliveryTime').value = order.delivery_time || '';
    document.getElementById('editPhone').value = order.phone;
    document.getElementById('editEmail').value = order.email;
    document.getElementById('editComment').value = order.comment || '';

    // Устанавливаем тип доставки
    if (order.delivery_type === 'now') {
        document.getElementById('editDeliveryNow').checked = true;
    } else if (order.delivery_type === 'scheduled') {
        document.getElementById('editDeliveryScheduled').checked = true;
    }

    // Заполняем состав заказа
    const categories = {
        main_course_id: 'editMainCourse',
        drink_id: 'editDrink',
        dessert_id: 'editDessert',
        salad_id: 'editSalad',
        soup_id: 'editSoup',
    };

    let totalPrice = 0;

    for (const [key, elementId] of Object.entries(categories)) {
        const dish = dishesMap[order[key]];
        if (dish) {
            document.getElementById(elementId).textContent = `${dish.name} (${dish.price}₽)`;
            totalPrice += dish.price;
        } else {
            document.getElementById(elementId).textContent = 'Не указано';
        }
    }

    // Устанавливаем итоговую стоимость
    document.getElementById('editTotalPrice').textContent = totalPrice;

    // Открываем модальное окно
    editModal.style.display = 'flex';
}

// Закрыть модальное окно
function closeModal(modal) {
    modal.style.display = 'none';
    currentOrderId = null;
}

// Обработчик кнопок закрытия
editModalClose.addEventListener('click', () => closeModal(editModal));
cancelEdit.addEventListener('click', () => closeModal(editModal));

// Обработчик сохранения изменений
editOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Собираем измененные данные
    const updatedData = {
        full_name: document.getElementById('editRecipientName').value,
        delivery_address: document.getElementById('editDeliveryAddress').value,
        delivery_time: document.getElementById('editDeliveryTime').value || null,
        phone: document.getElementById('editPhone').value,
        email: document.getElementById('editEmail').value,
        comment: document.getElementById('editComment').value || null,
        delivery_type: document.querySelector('input[name="deliveryType"]:checked').value,
    };

    // Отправляем только измененные поля
    for (const key in updatedData) {
        if (!updatedData[key]) {
            delete updatedData[key];
        }
    }

    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${currentOrderId}?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            console.log(`Заказ с ID ${currentOrderId} успешно обновлен`);
            await loadOrders(); // Перезагружаем заказы
            closeModal(editModal);
        } else {
            console.error(`Ошибка при обновлении заказа: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
    }
});


function openViewModal(order, dishesMap) {
    // Заполняем данные о доставке
    document.getElementById('orderDate').textContent = new Date(order.created_at).toLocaleString();
    document.getElementById('recipientName').textContent = order.full_name;
    document.getElementById('deliveryAddress').textContent = order.delivery_address;
    document.getElementById('deliveryTime').textContent = order.delivery_time || 'Не указано';
    document.getElementById('phone').textContent = order.phone;
    document.getElementById('email').textContent = order.email;
    document.getElementById('comment').textContent = order.comment || 'Отсутствует';

    // Заполняем состав заказа
    const categories = {
        main_course_id: 'mainCourse',
        drink_id: 'drink',
        dessert_id: 'dessert',
        salad_id: 'salad',
        soup_id: 'soup',
    };
    let totalPrice = 0;

    for (const [key, elementId] of Object.entries(categories)) {
        const dish = dishesMap[order[key]];
        if (dish) {
            document.getElementById(elementId).textContent = `${dish.name} (${dish.price}₽)`;
            totalPrice += dish.price;
        } else {
            document.getElementById(elementId).textContent = 'Не указано';
        }
    }

    // Устанавливаем итоговую стоимость
    document.getElementById('totalPrice').textContent = totalPrice;

    // Показываем модальное окно
    document.getElementById('viewModal').style.display = 'flex';
}

// Закрытие модального окна
document.getElementById('viewModalClose').addEventListener('click', () => {
    document.getElementById('viewModal').style.display = 'none';
});
document.getElementById('closeView').addEventListener('click', () => {
    document.getElementById('viewModal').style.display = 'none';
});

// События для модального окна удаления
deleteModalClose.addEventListener('click', () => closeModal(deleteModal));
cancelDelete.addEventListener('click', () => closeModal(deleteModal));
confirmDelete.addEventListener('click', async () => {
    if (currentOrderId) {
        await deleteOrder(currentOrderId);
    }
    closeModal(deleteModal);
});

// События для модального окна редактирования
editModalClose.addEventListener('click', () => closeModal(editModal));
cancelEdit.addEventListener('click', () => closeModal(editModal));
editOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const updatedOrder = {
        id: currentOrderId,
        full_name: document.getElementById('editRecipientName').value,
        delivery_address: document.getElementById('editDeliveryAddress').value,
    };
    await saveOrder(updatedOrder);
    closeModal(editModal);
});

// События для модального окна просмотра
viewModalClose.addEventListener('click', () => closeModal(viewModal));
closeView.addEventListener('click', () => closeModal(viewModal));


// Функция для сохранения изменений заказа
async function saveOrder(order) {
    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${order.id}?api_key=54609f39-c7ad-4a93-ace6-5a3fb046d4bd`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        if (response.ok) {
            await loadOrders();
        } else {
            console.error(`Ошибка сохранения заказа с ID ${order.id}`);
        }
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
    }
}

});