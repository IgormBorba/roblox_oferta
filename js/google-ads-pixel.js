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

    // Obtém os dados do usuário atual
    getUserData() {
        const user = auth.getCurrentUser();
        if (!user) return null;
        
        return {
            user_id: user.id || '',
            user_email: user.email || '',
            user_name: user.name || '',
            user_phone: user.phone || ''
        };
    },

    // Formata os dados do usuário para o Google Ads
    formatUserDataForAds(userData) {
        if (!userData) return {};
        
        return {
            email_address: userData.user_email,
            name: userData.user_name,
            phone_number: userData.user_phone
        };
    },

    // Envia evento de conversão para ambos os pixels
    trackConversion(transactionData) {
        if (!this.init()) return;

        const { value, transactionId, clientData } = transactionData;
        
        // Dados do cliente (se disponíveis)
        const userData = this.getUserData() || {
            user_id: '',
            user_email: clientData?.email || '',
            user_name: clientData?.name || '',
            user_phone: clientData?.phone || clientData?.phone_number || ''
        };

        // Formata os dados do usuário para o Google Ads
        const formattedUserData = this.formatUserDataForAds(userData);

        // Adiciona os dados do cliente ao dataLayer para enhanced conversions
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'purchase_complete',
                'transaction_id': transactionId,
                'value': value,
                'currency': 'BRL',
                'transaction_type': 'purchase',
                'user_id': userData.user_id,
                'user_email': userData.user_email,
                'user_name': userData.user_name,
                'user_phone': userData.user_phone
            });

            console.log('Dados de compra enviados para o dataLayer:', {
                'event': 'purchase_complete',
                'transaction_id': transactionId,
                'value': value,
                'transaction_type': 'purchase',
                'user_email': userData.user_email
            });
        }

        // Registra conversão no primeiro pixel - usando evento de conversão explícito
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel1,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });
        
        // Registra conversão no segundo pixel - usando evento de conversão explícito
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel2,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        // Também envia um evento de purchase para garantir que o transaction_type seja capturado
        gtag('event', 'purchase', {
            'send_to': this.pixelIds.pixel1,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        gtag('event', 'purchase', {
            'send_to': this.pixelIds.pixel2,
            'value': value,
            'currency': 'BRL',
            'transaction_id': transactionId,
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        console.log('Conversão registrada nos pixels do Google Ads:', {
            value,
            transactionId,
            transaction_type: 'purchase',
            user_data: formattedUserData,
            events: ['conversion', 'purchase']
        });
    },

    // Rastreia início do checkout
    trackBeginCheckout(cartValue) {
        if (!this.init()) return;

        // Dados do cliente (se disponíveis)
        const userData = this.getUserData();
        const formattedUserData = this.formatUserDataForAds(userData);

        // Itens do carrinho
        const cartItems = cart.getItems().map(item => {
            const product = products.getById(item.id);
            return {
                'id': product.id,
                'name': product.title,
                'quantity': item.quantity,
                'price': product.price
            };
        });

        // Adiciona os dados do cliente ao dataLayer
        if (window.dataLayer) {
            const dataLayerObject = {
                'event': 'begin_checkout',
                'value': cartValue,
                'currency': 'BRL',
                'transaction_type': 'purchase',
                'items': cartItems
            };
            
            // Adiciona os dados do usuário se disponíveis
            if (userData) {
                Object.assign(dataLayerObject, {
                    'user_id': userData.user_id,
                    'user_email': userData.user_email,
                    'user_name': userData.user_name,
                    'user_phone': userData.user_phone
                });
            }
            
            window.dataLayer.push(dataLayerObject);

            console.log('Dados de checkout enviados para o dataLayer:', {
                'event': 'begin_checkout',
                'value': cartValue,
                'transaction_type': 'purchase',
                'user_email': userData?.user_email || 'não logado'
            });
        }

        // Envia evento diretamente para o Google Ads (primeiro pixel)
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel1,
            'value': cartValue,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        // Envia evento diretamente para o Google Ads (segundo pixel)
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel2,
            'value': cartValue,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        // Também envia o evento begin_checkout para compatibilidade
        gtag('event', 'begin_checkout', {
            'send_to': this.pixelIds.pixel1,
            'value': cartValue,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData,
            'items': cartItems
        });

        gtag('event', 'begin_checkout', {
            'send_to': this.pixelIds.pixel2,
            'value': cartValue,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData,
            'items': cartItems
        });

        console.log('Eventos de checkout enviados para o Google Ads:', {
            'event': 'begin_checkout',
            'conversion': true,
            'value': cartValue,
            'transaction_type': 'purchase'
        });
    },

    // Rastreia adição ao carrinho
    trackAddToCart(productId, quantity) {
        if (!this.init()) return;

        const product = products.getById(productId);
        if (!product) return;

        // Dados do cliente (se disponíveis)
        const userData = this.getUserData();
        const formattedUserData = this.formatUserDataForAds(userData);

        // Item do carrinho
        const cartItem = {
            'id': product.id,
            'name': product.title,
            'quantity': quantity,
            'price': product.price
        };

        // Adiciona os dados do cliente ao dataLayer
        if (window.dataLayer) {
            const dataLayerObject = {
                'event': 'add_to_cart',
                'value': product.price * quantity,
                'currency': 'BRL',
                'transaction_type': 'purchase',
                'product_id': product.id,
                'product_name': product.title,
                'product_price': product.price,
                'quantity': quantity
            };
            
            // Adiciona os dados do usuário se disponíveis
            if (userData) {
                Object.assign(dataLayerObject, {
                    'user_id': userData.user_id,
                    'user_email': userData.user_email,
                    'user_name': userData.user_name,
                    'user_phone': userData.user_phone
                });
            }
            
            window.dataLayer.push(dataLayerObject);

            console.log('Dados de adição ao carrinho enviados para o dataLayer:', {
                'event': 'add_to_cart',
                'product_name': product.title,
                'transaction_type': 'purchase',
                'user_email': userData?.user_email || 'não logado'
            });
        }

        // Envia evento de conversão para o primeiro pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel1,
            'value': product.price * quantity,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        // Envia evento de conversão para o segundo pixel
        gtag('event', 'conversion', {
            'send_to': this.pixelIds.pixel2,
            'value': product.price * quantity,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData
        });

        // Também envia o evento add_to_cart para compatibilidade
        gtag('event', 'add_to_cart', {
            'send_to': this.pixelIds.pixel1,
            'value': product.price * quantity,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData,
            'items': [cartItem]
        });

        gtag('event', 'add_to_cart', {
            'send_to': this.pixelIds.pixel2,
            'value': product.price * quantity,
            'currency': 'BRL',
            'transaction_type': 'purchase',
            'user_data': formattedUserData,
            'items': [cartItem]
        });

        console.log('Eventos de adição ao carrinho enviados para o Google Ads:', {
            'event': 'add_to_cart',
            'conversion': true,
            'value': product.price * quantity,
            'transaction_type': 'purchase'
        });
    }
}; 