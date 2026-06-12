$(document).ready(function () {
    const INITIAL_TYPE = 'food';
    const defaultLang = 'mk';

    let currentLang = localStorage.getItem('lang') || defaultLang;
    const fileName = currentLang === 'en' ? 'en-menu.json' : 'mk-menu.json';

    window.addEventListener('storage', function (e) {
        if (e.key === 'lang') {
            location.reload();
        }
    });

    const desktopBtn = document.getElementById('lang-toggle-desktop');
    const mobileBtn = document.getElementById('lang-toggle-mobile');

    function reloadAfterToggle() {
        setTimeout(() => location.reload(), 0);
    }

    if (desktopBtn) desktopBtn.addEventListener('click', reloadAfterToggle);
    if (mobileBtn) mobileBtn.addEventListener('click', reloadAfterToggle);

    function renderSubcategories(type, jsonData) {
        const $scrollContainer = $('#subcategoryScroll');
        $scrollContainer.empty();
        const categories = Object.keys(jsonData[type]);
        categories.forEach((category, index) => {
            const $button = $(`
              <button data-category="${category}" class="flex-shrink-0 px-4 py-2 text-dark  rounded-lg hover:bg-darkbrown/70 hover:text-white transition-colors ${index === 0 ? 'active-subcategory' : ''}">
                  ${category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
          `);
            $scrollContainer.append($button);
        });
    }

    function renderProducts(type, category, jsonData) {
        const $grid = $('#productGrid');
        $grid.empty();
        const items = jsonData[type][category];
        if(currentLang == 'mk')
        {
          items.forEach(item => {
              const $item = $(`
                <div class="flex bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-4 flex-1">
                        <h3 class="text-lg font-bold uppercase text-darkbrown">${item.name}</h3>
                        <p class="text-sm text-dark pt-2">${item.description}</p>
                        <p class="text-darkbrown font-medium pt-2">${item.price} ден.</p>
                    </div>
                </div>
            `);
              $grid.append($item);
          });
        }
        else
        {
          items.forEach(item => {
              const $item = $(`
                <div class="flex bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-4 flex-1">
                        <h3 class="text-lg font-bold uppercase text-darkbrown">${item.name}</h3>
                        <p class="text-sm text-dark pt-2">${item.description}</p>
                        <p class="text-darkbrown font-medium pt-2">${item.price} den.</p>
                    </div>
                </div>
            `);
              $grid.append($item);
          });
        }
    }

    $.getJSON(fileName, function (jsonData) {
      
        // Initial load
        $('#categoryTabs button[data-type="food"]').addClass('active-tab');
        renderSubcategories(INITIAL_TYPE, jsonData);
        renderProducts(INITIAL_TYPE, Object.keys(jsonData[INITIAL_TYPE])[0], jsonData);

        // Tab switching
        $('#categoryTabs button').on('click', function () {
            $('#categoryTabs button').removeClass('active-tab');
            $(this).addClass('active-tab');
            const type = $(this).data('type');
            renderSubcategories(type, jsonData);
            renderProducts(type, Object.keys(jsonData[type])[0], jsonData);
            $('#subcategoryScroll button:first').addClass('active-subcategory');
        });

        // Subcategory switching
        $('#subcategoryScroll').on('click', 'button', function () {
            $('#subcategoryScroll button').removeClass('active-subcategory');
            $(this).addClass('active-subcategory');
            const type = $('#categoryTabs .active-tab').data('type');
            const category = $(this).data('category');
            renderProducts(type, category, jsonData);
        });

        // Scroll buttons
        $('#scrollLeft').on('click', function () {
            $('#subcategoryScroll').scrollLeft($('#subcategoryScroll').scrollLeft() - 200);
        });

        $('#scrollRight').on('click', function () {
            $('#subcategoryScroll').scrollLeft($('#subcategoryScroll').scrollLeft() + 200);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Error loading menu.json:', textStatus, error);
        $('#productGrid').html('<p class="text-darkbrown text-center">Грешка при вчитување на менито</p>');
    });

    // Hide scrollbar CSS
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
          display: none;
      }
      .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
      .active-tab {
        border-bottom: 4px solid #9C7A4E;
      }
      .active-subcategory {
          background-color: #9C7A4E;
          color: white;
      }
    `;
    document.head.appendChild(style);

    const navbar = document.getElementById("navbar");
    const mobileMenu = document.getElementById("mobile-menu");
    const hamburger = document.getElementById("hamburger");
  
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = navbar.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  
          window.scrollTo({
            top: targetPosition - offset,
            behavior: "smooth",
          });
        }
  
        mobileMenu.classList.add("hidden");
      });
    });
  
    // Toggle mobile menu
    hamburger.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
        mobileMenu.classList.add("hidden");
      }
    });
  
});