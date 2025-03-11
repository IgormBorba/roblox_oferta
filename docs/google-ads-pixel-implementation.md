# Documentação de Implementação de Pixels do Google Ads

Este documento explica como implementar novos pixels do Google Ads no sistema de rastreamento de conversões do site.

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Sistema](#estrutura-do-sistema)
3. [Como Adicionar um Novo Pixel](#como-adicionar-um-novo-pixel)
4. [Verificação da Implementação](#verificação-da-implementação)
5. [Solução de Problemas](#solução-de-problemas)

## Visão Geral

O sistema de rastreamento de conversões do site utiliza o Google Ads para rastrear eventos importantes, como:

- Login de usuários
- Adição de produtos ao carrinho
- Início do checkout
- Conclusão da compra (conversão)

Cada evento é enviado para os pixels do Google Ads configurados no sistema, permitindo o rastreamento preciso das conversões e a otimização das campanhas de marketing.

## Estrutura do Sistema

O sistema de rastreamento de conversões é composto pelos seguintes arquivos:

- `js/google-ads-pixel.js`: Contém a lógica principal para o rastreamento de conversões
- `cart.html`: Contém código específico para o rastreamento de conversões no carrinho
- `js/payment.js`: Contém código específico para o rastreamento de conversões no processo de pagamento
- `login.html`: Contém código específico para o rastreamento de logins

O arquivo `js/google-ads-pixel.js` define um objeto `googleAdsPixel` com os seguintes métodos principais:

- `trackConversion`: Rastreia eventos de conversão (compra)
- `trackBeginCheckout`: Rastreia eventos de início de checkout
- `trackAddToCart`: Rastreia eventos de adição ao carrinho

## Como Adicionar um Novo Pixel

Para adicionar um novo pixel do Google Ads ao sistema, siga os passos abaixo:

### 1. Obtenha o ID do Pixel e o Código de Conversão

Primeiro, obtenha o ID do pixel e o código de conversão do Google Ads. O formato típico é:

```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    'value': 1.0,
    'currency': 'BRL',
    'transaction_id': ''
});
```

Onde:
- `AW-XXXXXXXXXX` é o ID da conta do Google Ads
- `YYYYYYYYYYYYYYYYY` é o código de conversão específico

### 2. Adicione o Pixel ao Objeto `pixelIds` em `google-ads-pixel.js`

Abra o arquivo `js/google-ads-pixel.js` e adicione o novo pixel ao objeto `pixelIds`:

```javascript
// IDs dos pixels do Google Ads
pixelIds: {
    pixel1: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    pixel2: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    pixel3: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    pixel4: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY'  // Novo pixel adicionado
},
```

### 3. Adicione o Código de Envio de Eventos para o Novo Pixel

Para cada método de rastreamento (`trackConversion`, `trackBeginCheckout`, `trackAddToCart`), adicione o código para enviar eventos para o novo pixel:

#### Para o método `trackConversion`:

```javascript
// Registra conversão no novo pixel - usando evento de conversão explícito
gtag('event', 'conversion', {
    'send_to': this.pixelIds.pixel4,  // Use o nome que você definiu no objeto pixelIds
    'value': value,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': formattedUserData
});

// Também adicione o evento de purchase para compatibilidade
gtag('event', 'purchase', {
    'send_to': this.pixelIds.pixel4,
    'value': value,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': formattedUserData
});
```

#### Para o método `trackBeginCheckout`:

```javascript
// Envia evento diretamente para o Google Ads (novo pixel)
gtag('event', 'conversion', {
    'send_to': this.pixelIds.pixel4,
    'value': cartValue,
    'currency': 'BRL',
    'transaction_type': 'purchase',
    'user_data': formattedUserData
});

// Também envia o evento begin_checkout para compatibilidade
gtag('event', 'begin_checkout', {
    'send_to': this.pixelIds.pixel4,
    'value': cartValue,
    'currency': 'BRL',
    'transaction_type': 'purchase',
    'user_data': formattedUserData,
    'items': cartItems
});
```

#### Para o método `trackAddToCart`:

```javascript
// Envia evento de conversão para o novo pixel
gtag('event', 'conversion', {
    'send_to': this.pixelIds.pixel4,
    'value': product.price * quantity,
    'currency': 'BRL',
    'transaction_type': 'purchase',
    'user_data': formattedUserData
});

// Também envia o evento add_to_cart para compatibilidade
gtag('event', 'add_to_cart', {
    'send_to': this.pixelIds.pixel4,
    'value': product.price * quantity,
    'currency': 'BRL',
    'transaction_type': 'purchase',
    'user_data': formattedUserData,
    'items': [cartItem]
});
```

### 4. Adicione o Pixel aos Eventos Diretos em `cart.html` e `payment.js`

#### Em `cart.html`, na função `finalizarCompra`:

```javascript
// Envia para o novo pixel
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',  // Use o ID completo do pixel
    'value': cartTotal,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': {
        'email_address': user.email,
        'name': user.name,
        'phone_number': user.phone || ''
    }
});
```

#### Em `js/payment.js`, no método `gerarPix`:

```javascript
// Envia para o novo pixel
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',  // Use o ID completo do pixel
    'value': total,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': {
        'email_address': user.email,
        'name': user.name,
        'phone_number': user.phone || ''
    }
});
```

### 5. Adicione o Pixel à Configuração do Google Tag Manager

Se você estiver usando o Google Tag Manager, certifique-se de adicionar o novo pixel à configuração do GTM:

```javascript
<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX"></script>
<script>
    gtag('js', new Date());
    gtag('config', 'AW-XXXXXXXXXX');  // Adicione o ID da conta do novo pixel aqui
</script>
<!-- End Google Ads Conversion Tracking -->
```

## Verificação da Implementação

Para verificar se o novo pixel está funcionando corretamente, siga os passos abaixo:

1. Abra o console do navegador (F12)
2. Navegue pelo site e execute ações como login, adição ao carrinho e checkout
3. Observe os logs no console para confirmar que os eventos estão sendo enviados para o novo pixel
4. Use a ferramenta de depuração do Google Ads para verificar se os eventos estão sendo recebidos corretamente

Você deve ver logs como:

```
Evento de conversão enviado diretamente para o Google Ads: {
    value: 100,
    transaction_id: "TX-1234567890-123",
    transaction_type: "purchase"
}
```

E na ferramenta de depuração do Google Ads, você deve ver o parâmetro `transaction_type=purchase` nos dados do evento.

## Solução de Problemas

Se o novo pixel não estiver funcionando corretamente, verifique os seguintes pontos:

1. **ID do Pixel**: Certifique-se de que o ID do pixel está correto e no formato esperado (`AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY`)
2. **Configuração do GTM**: Verifique se o ID da conta do Google Ads está configurado corretamente no GTM
3. **Parâmetros do Evento**: Certifique-se de que todos os parâmetros necessários estão sendo enviados corretamente
4. **Dados do Usuário**: Verifique se os dados do usuário estão sendo formatados corretamente
5. **Console do Navegador**: Verifique se há erros no console do navegador relacionados ao envio de eventos

Se o problema persistir, consulte a documentação oficial do Google Ads ou entre em contato com o suporte do Google Ads para obter ajuda adicional.

## Exemplo Completo de Implementação

Aqui está um exemplo completo de como adicionar um novo pixel ao sistema:

```javascript
// Em js/google-ads-pixel.js
pixelIds: {
    pixel1: 'AW-16885157817/gbqJCOPn8qgaELmfvPM-',
    pixel2: 'AW-16906832004/UtnNCOGN66UaEISR5_0-',
    pixel3: 'AW-16906832004/UtnNCOGN66UaEISR5_0-',
    pixel4: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY'  // Novo pixel adicionado
},

// Em cart.html
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    'value': cartTotal,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': {
        'email_address': user.email,
        'name': user.name,
        'phone_number': user.phone || ''
    }
});

// Em js/payment.js
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY',
    'value': total,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'transaction_type': 'purchase',
    'user_data': {
        'email_address': user.email,
        'name': user.name,
        'phone_number': user.phone || ''
    }
});
```

Lembre-se de substituir `AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY` pelo ID real do seu pixel do Google Ads. 