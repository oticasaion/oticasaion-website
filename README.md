# Óticas Aion - Landing Page & Catálogo Digital

Landing Page e Catálogo Virtual moderno e responsivo desenvolvido para a **Óticas Aion** (*"Visão que permanece"*), focado em conversão e atendimento direto via WhatsApp.

---

## 🌟 Principais Recursos Implementados

1. **Identidade Visual Fiel à Marca:**
   - Paleta de cores nobre: Verde Esmeralda Profundo (`#0c251d`) e Dourado Acetinado (`#c8a25a`).
   - Símbolo estilizado do **"A" com flecha** e tipografia refinada.
   - Slogan: *"Visão que permanece."*

2. **Catálogo de Armações Interativo:**
   - Filtros dinâmicos por categoria e formato de armação (*Todos, Masculino, Feminino, Quadrado, Redondo, Retangular, Gatinho, Oval*).
   - Selos de *Mais Vendido*, *Promoção* e cálculo automático de desconto à vista no PIX (5% OFF).
   - Preços e especificações técnicas de cada modelo.

3. **Configurador de Lentes Oftálmicas (Inspirado no Benchmark Euglasses):**
   - Modal com seleção de cores da armação.
   - Escolha guiada entre os índices de lentes:
     - **Lente Anti-Reflexo Fina (Policarbonato 1.59)**
     - **Lente Anti-Reflexo Super Fina (Resina 1.67)**
     - **Lente Anti-Reflexo Ultra Fina (Resina 1.74)**
     - **Somente a Armação (Sem Grau)**
   - Resumo dinâmico de valores em tempo real.
   - Envio pré-formatado no WhatsApp com os detalhes da armação e lente selecionadas.

4. **Alinhamento com o Briefing do Negócio (`Oticas Aion.pdf`):**
   - Destaque para o carro-chefe: **Óculos de grau completo**.
   - Garantia incondicional de **7 dias de adaptação**.
   - Prazo de entrega de **até 7 dias úteis** em todo o Brasil.
   - Economia de **até 50%** em comparação a óticas físicas de shopping.
   - Explicação sobre a medição técnica da **DNP (Distância Naso-Pupilar)** feita via WhatsApp.
   - Depoimentos reais de clientes e seção completa de **FAQ sanfonada**.
   - Botão flutuante do WhatsApp com efeito pulsante e aviso de atendimento online.

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O Vite iniciará o servidor local (geralmente em `http://localhost:5173/`).

### 2. Gerar Versão para Produção (Build)
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados na pasta `/dist/`.

---

## ⚙️ Personalização do Número de WhatsApp

Para alterar o número que recebe os pedidos e receitas:
1. Abra o arquivo [src/App.tsx](file:///c:/Users/evand/OneDrive/%C3%81rea%20de%20Trabalho/Oticas%20Aion/src/App.tsx).
2. Modifique a constante:
   ```ts
   export const WHATSAPP_PHONE_NUMBER = '5511999999999'; // Seu número comercial com DDI e DDD
   ```
