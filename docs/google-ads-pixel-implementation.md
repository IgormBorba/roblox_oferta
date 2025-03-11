# Documentação de Implementação de Pixels do Google Ads

Este documento explica como implementar novos pixels do Google Ads no sistema de rastreamento de conversões do site.

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Sistema](#estrutura-do-sistema)
3. [Como Adicionar um Novo Pixel](#como-adicionar-um-novo-pixel)
4. [Painel de Gerenciamento de Pixels](#painel-de-gerenciamento-de-pixels)
5. [Configurações de Pagamento](#configurações-de-pagamento)
6. [Verificação da Implementação](#verificação-da-implementação)
7. [Solução de Problemas](#solução-de-problemas)

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

## Painel de Gerenciamento de Pixels

O sistema agora inclui um painel de administração para gerenciar os pixels do Google Ads. Este painel permite adicionar, editar e remover pixels sem precisar modificar o código diretamente.

### Acessando o Painel de Gerenciamento de Pixels

1. Acesse o painel de administração em `/admin/index.html`
2. Faça login com as credenciais:
   - Usuário: `solaris`
   - Senha: `777$7`
3. Clique na opção "🎯 Gerenciar Pixels" no menu lateral

### Funcionalidades do Painel de Gerenciamento de Pixels

O painel de gerenciamento de pixels oferece as seguintes funcionalidades:

#### Visualizar Pixels Ativos

Na seção "Pixels Ativos", você pode ver todos os pixels configurados no sistema, incluindo:
- Nome do pixel (identificador interno)
- ID completo do pixel (no formato AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY)
- Opções para editar ou remover cada pixel

#### Adicionar Novo Pixel

Para adicionar um novo pixel:

1. Na seção "Adicionar Novo Pixel", preencha os campos:
   - **Nome do Pixel**: Um identificador único para o pixel (ex: pixel4)
   - **ID do Pixel**: O ID completo do pixel no formato AW-XXXXXXXXXX/YYYYYYYYYYYYYYYYY
2. Clique no botão "Adicionar Pixel"

O novo pixel será adicionado imediatamente ao sistema e estará disponível para rastreamento de conversões.

#### Editar Pixel Existente

Para editar um pixel existente:

1. Na lista de pixels ativos, clique no botão "Editar" ao lado do pixel que deseja modificar
2. Digite o novo ID do pixel no prompt que aparece
3. Clique em "OK" para salvar as alterações

#### Remover Pixel

Para remover um pixel:

1. Na lista de pixels ativos, clique no botão "Remover" ao lado do pixel que deseja excluir
2. Confirme a exclusão no prompt que aparece

### Como o Sistema de Gerenciamento de Pixels Funciona

O sistema de gerenciamento de pixels utiliza o localStorage do navegador para armazenar as configurações dos pixels. Quando o site é carregado, o sistema verifica se existem pixels configurados no localStorage e os utiliza em vez dos pixels definidos diretamente no código.

Isso permite que você gerencie os pixels sem precisar modificar o código-fonte do site, tornando o processo mais seguro e acessível para usuários não técnicos.

### Limitações

- As alterações feitas no painel de gerenciamento de pixels são armazenadas no localStorage do navegador, o que significa que elas são específicas para cada navegador/dispositivo
- Se você limpar os dados do navegador, as configurações dos pixels serão perdidas
- Para tornar as alterações permanentes em todos os dispositivos, você ainda precisa atualizar o código-fonte do site

## Configurações de Pagamento

O sistema agora inclui um painel para gerenciar as configurações de pagamento, permitindo a edição do token da API, hash da oferta e hash do produto sem precisar modificar o código diretamente.

### Acessando as Configurações de Pagamento

1. Acesse o painel de administração em `/admin/index.html`
2. Faça login com as credenciais:
   - Usuário: `solaris`
   - Senha: `777$7`
3. Clique na opção "💰 Configurações de Pagamento" no menu lateral

### Funcionalidades das Configurações de Pagamento

O painel de configurações de pagamento oferece as seguintes funcionalidades:

#### Editar Token da API

O token da API é utilizado para autenticar as requisições à API de pagamento. Para editar o token:

1. No campo "Token da API de Pagamento", digite o novo token
2. Clique no botão "Salvar Configurações"

#### Editar Hash da Oferta

O hash da oferta (offer_hash) é um identificador único da oferta na plataforma de pagamento. Para editar o hash da oferta:

1. No campo "Hash da Oferta (offer_hash)", digite o novo hash
2. Clique no botão "Salvar Configurações"

#### Editar Hash do Produto

O hash do produto (product_hash) é um identificador único do produto na plataforma de pagamento. Para editar o hash do produto:

1. No campo "Hash do Produto (product_hash)", digite o novo hash
2. Clique no botão "Salvar Configurações"

### Como o Sistema de Configurações de Pagamento Funciona

O sistema de configurações de pagamento utiliza o localStorage do navegador para armazenar as configurações. Quando o site é carregado, o sistema verifica se existem configurações de pagamento no localStorage e as utiliza em vez das configurações definidas diretamente no código.

Isso permite que você gerencie as configurações de pagamento sem precisar modificar o código-fonte do site, tornando o processo mais seguro e acessível para usuários não técnicos.

### Limitações

- As alterações feitas nas configurações de pagamento são armazenadas no localStorage do navegador, o que significa que elas são específicas para cada navegador/dispositivo
- Se você limpar os dados do navegador, as configurações de pagamento serão perdidas
- Para tornar as alterações permanentes em todos os dispositivos, você ainda precisa atualizar o código-fonte do site

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