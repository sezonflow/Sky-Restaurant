document.addEventListener('DOMContentLoaded', () => {
    let menuData = {};
    let currentType = 'food';
    let currentCategory = '';

    const btnFood = document.getElementById('btn-food');
    const btnDrinks = document.getElementById('btn-drinks');
    const categoryContainer = document.getElementById('category-container');
    const productContainer = document.getElementById('product-container');

    fetch('pool-menu.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            menuData = data;
            init();
        })
        .catch(err => {
            console.error("Greška pri učitavanju menija:", err);
            productContainer.innerHTML = '<p class="text-center text-red-400 font-medium">Грешка при вчитување на менито.</p>';
        });

    function init() {
        btnFood.addEventListener('click', () => switchType('food'));
        btnDrinks.addEventListener('click', () => switchType('drinks'));
        switchType('food');
    }

    function switchType(type) {
        currentType = type;

        const activeClass = "flex-1 py-2.5 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 shadow-sm";
        const inactiveClass = "flex-1 py-2.5 rounded-full text-white font-medium text-sm transition-all duration-300 hover:bg-white/5";

        if(type === 'food') {
            btnFood.className = activeClass;
            btnDrinks.className = inactiveClass;
        } else {
            btnDrinks.className = activeClass;
            btnFood.className = inactiveClass;
        }

        renderCategories();
    }

    function renderCategories() {
        // Dodata zastita ako podaci slucajno nisu tu
        if (!menuData[currentType]) return;

        const categories = Object.keys(menuData[currentType]);
        currentCategory = categories[0];

        categoryContainer.innerHTML = '';
        
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.textContent = category;
            
            btn.onclick = () => {
                currentCategory = category;
                updateCategoryUI();
                renderProducts();
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            };
            
            categoryContainer.appendChild(btn);
        });

        updateCategoryUI();
        renderProducts();
    }

    function updateCategoryUI() {
        const buttons = categoryContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === currentCategory) {
                btn.className = 'whitespace-nowrap pb-2 text-base font-semibold transition-all duration-300 snap-center text-[#00A8E8] border-b-2 border-[#00A8E8]';
            } else {
                btn.className = 'whitespace-nowrap pb-2 text-base font-medium transition-all duration-300 snap-center text-gray-400 hover:text-white border-b-2 border-transparent';
            }
        });
    }

    function renderProducts() {
        const items = menuData[currentType][currentCategory];
        productContainer.innerHTML = '';

        // Zastita ako kategorija nema proizvode
        if (!items || items.length === 0) {
            productContainer.innerHTML = '<p class="text-center text-gray-400 mt-10">Нема производи во оваа категорија.</p>';
            return;
        }

        items.forEach(item => {
            const descHTML = item.description ? `<p class="text-sm text-gray-400 mt-1 font-light leading-snug pr-4">${item.description}</p>` : '';

            const row = `
                <div class="py-4 border-b border-white/10 last:border-0 flex justify-between items-center gap-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-medium text-white tracking-wide">${item.name}</h3>
                        ${descHTML}
                    </div>
                    <div class="flex-shrink-0 text-right">
                        <span class="block text-xl font-semibold text-white tracking-tight">${item.price}</span>
                        <span class="block text-[10px] text-[#00A8E8] uppercase tracking-widest mt-0.5">ден.</span>
                    </div>
                </div>
            `;
            productContainer.insertAdjacentHTML('beforeend', row);
        });
    }
});