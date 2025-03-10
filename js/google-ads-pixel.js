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

        const { value, transactionId, clientData } = transactionData;
        
        // Dados do cliente (se disponíveis)
        const user = auth.getCurrentUser();
        const userData = clientData || {
            email: user?.email || '',
            name: user?.name || '',
            phone_number: user?.phone || ''
        };

        // Adiciona os dados do cliente ao dataLayer para enhanced conversions
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'purchase_complete',
                'user_data': {
                    'email': userData.email,
                    'name': userData.name,
                    'phone_number': userData.phone || userData.phone_number || ''
                },
                'ecommerce': {
                    'transaction_id': transactionId,
                    'value': value,
                    'currency': 'BRL'
                }
            });
        }

        // Registra conversão no primeiro pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel1,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': {
                'email': userData.email,
                'name': userData.name,
                'phone_number': userData.phone || userData.phone_number || ''
            }
        });
        
        // Registra conversão no segundo pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel2,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': {
                'email': userData.email,
                'name': userData.name,
                'phone_number': userData.phone || userData.phone_number || ''
            }
        });

        console.log('Conversão registrada nos pixels do Google Ads:', {
            value,
            transactionId,
            userData,
            transaction_type: 'purchase'
        });
    },

    // Rastreia início do checkout
    trackBeginCheckout(cartValue) {
        if (!this.init()) return;

        // Dados do cliente (se disponíveis)
        const user = auth.getCurrentUser();
        const customerData = user ? {
            email: user.email,
            name: user.name,
            phone_number: user.phone || ''
        } : {};

        // Adiciona os dados do cliente ao dataLayer
        if (window.dataLayer && user) {
            window.dataLayer.push({
                'event': 'begin_checkout',
                'user_data': {
                    'email': user.email,
                    'name': user.name,
                    'phone_number': user.phone || ''
                },
                'ecommerce': {
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
                }
            });
        }

        gtag('event', 'begin_checkout', {
            'value': cartValue,
            'currency': 'BRL',
            'user_data': customerData,
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

        // Dados do cliente (se disponíveis)
        const user = auth.getCurrentUser();
        const customerData = user ? {
            email: user.email,
            name: user.name,
            phone_number: user.phone || ''
        } : {};

        // Adiciona os dados do cliente ao dataLayer
        if (window.dataLayer && user) {
            window.dataLayer.push({
                'event': 'add_to_cart',
                'user_data': {
                    'email': user.email,
                    'name': user.name,
                    'phone_number': user.phone || ''
                },
                'ecommerce': {
                    'value': product.price * quantity,
                    'currency': 'BRL',
                    'items': [{
                        'id': product.id,
                        'name': product.title,
                        'quantity': quantity,
                        'price': product.price
                    }]
                }
            });
        }

        gtag('event', 'add_to_cart', {
            'value': product.price * quantity,
            'currency': 'BRL',
            'user_data': customerData,
            'items': [{
                'id': product.id,
                'name': product.title,
                'quantity': quantity,
                'price': product.price
            }]
        });
    }
}; 