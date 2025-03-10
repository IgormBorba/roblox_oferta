const cart = {
    // Chave para o localStorage
    CART_KEY: 'carnavalbux_cart',

    // Inicializa o storage se necessário
    init() {
        if (!localStorage.getItem(this.CART_KEY)) {
            localStorage.setItem(this.CART_KEY, JSON.stringify([]));
        }
    },

    // Retorna os itens do carrinho
    getItems() {
        this.init();
        return JSON.parse(localStorage.getItem(this.CART_KEY));
    },

    // Adiciona um item ao carrinho
    addItem(productId, quantity = 1) {
        const items = this.getItems();
        const existingItem = items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ id: productId, quantity });
        }

        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
        
        // Registra evento de adição ao carrinho no pixel do Google Ads
        if (typeof googleAdsPixel !== 'undefined') {
            try {
                googleAdsPixel.trackAddToCart(productId, quantity);
            } catch (error) {
                console.error("Erro ao registrar adição ao carrinho no pixel:", error);
            }
        }
    },

    // Remove um item do carrinho
    removeItem(productId) {
        const items = this.getItems().filter(item => item.id !== productId);
        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    },

    // Atualiza a quantidade de um item
    updateQuantity(productId, quantity) {
        const items = this.getItems();
        const item = items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            localStorage.setItem(this.CART_KEY, JSON.stringify(items));
        }
    },

    // Limpa o carrinho
    clear() {
        localStorage.setItem(this.CART_KEY, JSON.stringify([]));
    },

    // Calcula o total do carrinho
    getTotal() {
        return this.getItems().reduce((total, item) => {
            const product = products.getById(item.id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    },

    // Retorna a quantidade total de itens
    getCount() {
        return this.getItems().reduce((count, item) => count + item.quantity, 0);
    }
}; 