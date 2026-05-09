# GenZ Traductor 💀

Traduce texto en español Gen Z a español normal y adulto. Powered by Claude AI.

## Stack

- React + Vite
- Anthropic Claude API (claude-sonnet-4)
- Deploy en Vercel

## Setup local

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Sube el repo a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Agrega la variable de entorno `VITE_ANTHROPIC_API_KEY` con tu API key
4. Deploy 🚀

> **Nota**: La API key está expuesta en el cliente. Para producción seria, crea un backend serverless en `/api/translate.js` que haga proxy a Anthropic.
