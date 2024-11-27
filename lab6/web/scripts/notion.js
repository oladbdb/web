document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
  
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
  
    let notificationMessage = "";
  
    if (!selectedDishes.soup && !selectedDishes.main && !selectedDishes.starter && !selectedDishes.drink && !selectedDishes.desert) {
      notificationMessage = "Ничего не выбрано. Выберите блюда для заказа.";
    } else if (selectedDishes.soup && !selectedDishes.main && !selectedDishes.starter) {
      notificationMessage = "Выберите главное блюдо/салат/стартер.";
    } else if ((selectedDishes.starter) && !selectedDishes.soup && !selectedDishes.main) {
      notificationMessage = "Выберите суп или главное блюдо.";
    } else if ((selectedDishes.drink || selectedDishes.desert) && !selectedDishes.main && !selectedDishes.starter && !selectedDishes.soup) {
      notificationMessage = "Выберите главное блюдо.";
    } else if (!selectedDishes.drink) {
        notificationMessage = "Выберите напиток.";
    }
  
    if (notificationMessage) {
      notification.style.display = 'flex';
      notificationp.textContent = notificationMessage;
      notification.appendChild(okButton);
    } else {
      alert("Заказ принят!");
    }
  });
  