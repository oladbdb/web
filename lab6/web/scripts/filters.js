
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

setupFilters('soup', 'soup-filters', 'soups-list');
setupFilters('starter', 'starter-filters', 'starters-list');
setupFilters('main', 'main-filters', 'main-dishes-list');
setupFilters('drink', 'drink-filters', 'drinks-list');
setupFilters('desert', 'desert-filters', 'deserts-list');

