const products = {
    items: [
        {
            id: "robux-200",
            title: "200 Robux",
            price: 7.90,
            original_price: 7.90,
            discount_percent: 0,
            image: "img/200rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-400",
            title: "400 Robux",
            price: 10.90,
            original_price: 15.90,
            discount_percent: 31,
            image: "img/400rbx.png",
            category: "robux",
            automatic_delivery: true
        },
{
            id: "robux-800",
            title: "800 Robux",
            price: 15.90,
            original_price: 23.70,
            discount_percent: 33,
            image: "img/800rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-1000",
            title: "1.000 Robux",
            price: 29.90,
            original_price: 35.90,
            discount_percent: 17,
            image: "img/1000rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-1200",
            title: "1.200 Robux",
            price: 59.90,
            original_price: 69.90,
            discount_percent: 14,
            image: "img/1200rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-2000",
            title: "2.000 Robux",
            price: 79.90,
            original_price: 99.90,
            discount_percent: 20,
            image: "img/2000rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-4000",
            title: "4.000 Robux",
            price: 149.90,
            original_price: 179.90,
            discount_percent: 17,
            image: "img/4000rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-6000",
            title: "6.000 Robux",
            price: 219.90,
            original_price: 259.90,
            discount_percent: 15,
            image: "img/6000rbx.png",
            category: "robux",
            automatic_delivery: true
        },
        {
            id: "robux-8000",
            title: "8.000 Robux",
            price: 289.90,
            original_price: 339.90,
            discount_percent: 15,
            image: "img/8000rbx.png",
            category: "robux",
            automatic_delivery: true
        }
    ],

    // Retorna todos os produtos
    getAll() {
        return this.items.map(product => ({
            ...product,
            image: baseUrl + '/' + product.image
        }));
    },

    // Retorna um produto pelo ID
    getById(id) {
        const product = this.items.find(product => product.id === id);
        if (product) {
            return {
                ...product,
                image: baseUrl + '/' + product.image
            };
        }
        return null;
    },

    // Retorna produtos por categoria
    getByCategory(category) {
        return this.items
            .filter(product => product.category === category)
            .map(product => ({
                ...product,
                image: baseUrl + '/' + product.image
            }));
    },

    // Retorna produtos em destaque (com desconto)
    getFeatured() {
        return this.items
            .filter(product => product.discount_percent > 0)
            .map(product => ({
                ...product,
                image: baseUrl + '/' + product.image
            }));
    }
}; 