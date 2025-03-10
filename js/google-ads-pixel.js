// Gerenciador de Pixels do Google Ads
const googleAdsPixel = {
    // IDs dos pixels do Google Ads
    pixelIds: {
        pixel1: 'AW-16885157817/gbqJCOPn8qgaELmfvPM-',
        pixel2: 'AW-16906832004/UtnNCOGN66UaEISR5_0-'
    },

    // Inicializa o Google Tag Manager se ainda não estiver carregado
    init() {
        if (typeof gtag === 'undefined') {
            console.warn('Google Tag Manager não encontrado. Os pixels não serão ativados.');
            return false;
        }
        return true;
    },

    // Envia evento de conversão para ambos os pixels
    trackConversion(transactionData) {
        if (!this.init()) return;

        const { value, transactionId } = transactionData;
        
        // Dados do cliente (se disponíveis)
        const user = auth.getCurrentUser();
        const customerData = {
            name: user?.name || '',
            email: user?.email || ''
        };

        // Registra conversão no primeiro pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel1,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'user_data': customerData
        });
        
        // Registra conversão no segundo pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel2,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'user_data': customerData
        });

        console.log('Conversão registrada nos pixels do Google Ads:', {
            value,
            transactionId,
            customerData
        });
    },

    // Rastreia início do checkout
    trackBeginCheckout(cartValue) {
        if (!this.init()) return;

        gtag('event', 'begin_checkout', {
            'value': cartValue,
            'currency': 'BRL',
            'items': cart.getItems().map(item => {
                const product = products.getById(item.id);
                return {
                    'id': product.id,
                    'name': product.title,
                    'quantity': item.quantity,
                    'price': product.price
                };
            })
        });
    },

    // Rastreia adição ao carrinho
    trackAddToCart(productId, quantity) {
        if (!this.init()) return;

        const product = products.getById(productId);
        if (!product) return;

        gtag('event', 'add_to_cart', {
            'value': product.price * quantity,
            'currency': 'BRL',
            'items': [{
                'id': product.id,
                'name': product.title,
                'quantity': quantity,
                'price': product.price
            }]
        });
    }
}; 