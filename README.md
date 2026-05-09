# GenZ Traductor 💀

> Traduce español Gen Z a español normal y adulto. Powered by Claude AI.

¿Tu sobrina te mandó un mensaje lleno de "no cap", "lowkey fire" y "it's giving"? Este traductor te salva. Pega el texto y obtén español de verdad en segundos.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4-cc785c?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)

---

## ¿Qué hace?

- Traduce jerga Gen Z en español (con anglicismos incluidos) a español claro
- Incluye un mini diccionario con los términos más comunes
- Botón de "ejemplo aleatorio" para probar sin escribir nada
- Diseño mobile-first, funciona bien en celular y desktop
- Copia el resultado con un clic

## Stack

- **React 18 + Vite** — frontend rápido, sin complicaciones
- **Anthropic Claude API** — el cerebro detrás de las traducciones
- **CSS puro** — sin Tailwind ni librerías de UI
- **Vercel** — deploy en un clic

## Correrlo localmente

### 1. Clona el repo

```bash
git clone https://github.com/tu-usuario/renatito-translates.git
cd renatito-translates
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura tu API key de Anthropic

Necesitas una API key de [console.anthropic.com](https://console.anthropic.com).

Crea un archivo `.env.local` en la raíz:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Luego en `src/App.jsx`, reemplaza el header de la API key con:

```js
'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
```

> El archivo `.env.local` ya está en `.gitignore` — nunca lo subas al repo.

### 4. Levanta el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Deploy en Vercel

1. Haz fork del repo a tu cuenta de GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa el repo
3. Vercel detecta Vite automáticamente
4. Haz clic en **Deploy** 🚀

## Seguridad

> ⚠️ Llamar a la API de Anthropic directo desde el cliente expone tu API key en el bundle. Está bien para demos y proyectos personales, pero no para producción pública.

Para protegerla, agrega un endpoint serverless en Vercel:

**`api/translate.js`**
```js
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  })
  const data = await response.json()
  res.status(response.status).json(data)
}
```

Agrega `ANTHROPIC_API_KEY` como variable de entorno en Vercel y apunta el fetch en `App.jsx` a `/api/translate`.

## Ideas para contribuir

- [ ] Modo inverso: español normal → Gen Z
- [ ] Historial de traducciones
- [ ] Soporte para Gen Z en inglés → español
- [ ] Compartir traducción con link

## Licencia

MIT — úsalo, modifícalo, despliégalo. No cap.
