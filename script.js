document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const reportBtn = document.getElementById('report-btn');
    const modal = document.getElementById('report-modal');
    const closeModal = document.querySelector('.close-modal');
    const reportForm = document.getElementById('report-form');
    const imageInput = document.getElementById('item-image');
    const imagePreview = document.getElementById('image-preview');
    const placeholder = document.querySelector('.file-upload-placeholder');
    const itemsGrid = document.getElementById('items-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');

    // State
    // localStorage.clear(); // Uncomment to reset
    let items = JSON.parse(localStorage.getItem('lostFoundItems_v5')) || [];

    // Default Items Data
    const defaultItems = [
        {
            id: 1,
            name: "House Keys",
            location: "Central Park, near the fountain",
            contact: "1234567890",
            image: "keys.png",
            date: new Date().toLocaleDateString()
        },
        {
            id: 2,
            name: "Brown Leather Wallet",
            location: "Main Street Bus Stop",
            contact: "8876542301",
            image: "wallet.png",
            date: new Date().toLocaleDateString()
        },
        {
            id: 3,
            name: "Blue Backpack",
            location: "University Library",
            contact: "9261780946",
            image: "backpack.png",
            date: new Date().toLocaleDateString()
        },
        {
            id: 4,
            name: "Silver Wristwatch",
            location: "Coffee Shop on 5th",
            contact: "7654123698",
            image: "watch.png",
            date: new Date().toLocaleDateString()
        }
    ];

    // Initialize with default items if empty
    if (items.length === 0) {
        items = defaultItems;
        saveItems();
    }

    // Initial Render
    renderItems(items);

    // Modal Logic
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Image Preview Logic
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    placeholder.style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Form Submission
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('item-name').value;
            const location = document.getElementById('item-location').value;
            const contact = document.getElementById('item-contact').value;
            const imageSrc = imagePreview.src;

            if (!imageSrc || imagePreview.classList.contains('hidden')) {
                alert('Please upload an image of the item.');
                return;
            }

            const newItem = {
                id: Date.now(),
                name,
                location,
                contact,
                image: imageSrc,
                date: new Date().toLocaleDateString()
            };

            items.unshift(newItem); // Add to beginning
            saveItems();
            renderItems(items);

            // Reset and Close
            reportForm.reset();
            imagePreview.classList.add('hidden');
            placeholder.style.display = 'block';
            modal.classList.remove('active');
        });
    }

    // Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredItems = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
            );
            renderItems(filteredItems);
        });
    }

    // Claim Logic (Delegation)
    if (itemsGrid) {
        itemsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-claim')) {
                const itemId = parseInt(e.target.dataset.id);
                if (confirm('Are you sure you want to claim this item? It will be removed from the list.')) {
                    items = items.filter(item => item.id !== itemId);
                    saveItems();
                    renderItems(items);
                }
            }
        });
    }

    // Helper Functions
    function saveItems() {
        try {
            localStorage.setItem('lostFoundItems_v5', JSON.stringify(items));
        } catch (e) {
            alert('Storage full! Please clear some items or use smaller images.');
            console.error('LocalStorage error:', e);
        }
    }

    function renderItems(itemsToRender) {
        if (!itemsGrid) return;

        itemsGrid.innerHTML = '';

        if (itemsToRender.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-title">${item.name}</h3>
                    <div class="item-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${item.location}
                    </div>
                    <div class="item-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${item.date}
                    </div>
                    <div class="item-contact">
                        Contact: ${item.contact}
                    </div>
                    <button class="btn-claim" data-id="${item.id}">Claim Item</button>
                </div>
            `;
            itemsGrid.appendChild(card);
        });
    }
});
