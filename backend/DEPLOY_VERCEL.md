# 🚀 Desplegar Backend en Vercel

## Pasos para Desplegar

### 1. **Preparar la Base de Datos**

Primero necesitas una base de datos en la nube (recomendado):

**Opción A: Railway (Recomendado)**
- Ir a https://railway.app
- Sign up / Log in
- Crear nuevo proyecto
- Agregar PostgreSQL
- Copiar la URL de conexión

**Opción B: Supabase**
- Ir a https://supabase.com
- Crear proyecto
- Copiar credenciales PostgreSQL

**Opción C: Render**
- Ir a https://render.com
- Crear PostgreSQL instance
- Copiar credenciales

### 2. **Conectar GitHub con Vercel**

```bash
1. Ir a https://vercel.com
2. Sign up / Log in con GitHub
3. Autorizar Vercel en GitHub
```

### 3. **Importar el Proyecto**

```bash
1. En Vercel Dashboard → "New Project"
2. Seleccionar repositorio "vexny-enterprise"
3. Root Directory: "backend"
4. Framework: "Other" (Node.js)
```

### 4. **Configurar Variables de Entorno**

En Vercel Dashboard → Project Settings → Environment Variables:

Agregar:
```
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=drone_pilot_db
JWT_SECRET=tu_secret_key_super_segura
OPENWEATHER_API_KEY=tu_api_key
GOOGLE_MAPS_API_KEY=tu_api_key
NODE_ENV=production
```

### 5. **Deploy**

```bash
1. Vercel detectará los cambios en GitHub
2. Click en "Deploy"
3. Esperar a que compile (2-3 minutos)
4. ¡Listo! Tu API estará en https://vexny-enterprise.vercel.app
```

## Actualizar la URL del Frontend

En `frontend/src/services/apiService.js`:

```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'https://vexny-enterprise.vercel.app/api';
```

## Testing Después del Deploy

```bash
# Probar salud del servidor
curl https://vexny-enterprise.vercel.app/health

# Debería retornar:
# {"status":"Server is running"}
```

## Troubleshooting

❌ **Error: 502 Bad Gateway**
- Verificar variables de entorno en Vercel
- Verificar conexión a base de datos
- Ver logs: Vercel Dashboard → Deployments → Logs

❌ **Error de conexión a BD**
- Verificar credenciales de base de datos
- Verificar IP whitelist en servicio de BD
- Probar conexión local primero

❌ **Timeout**
- Aumentar timeout en Vercel
- Verificar queries lentas

## Dashboard Útiles

- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **Supabase**: https://app.supabase.com

---

**Nota**: El deploy automático ocurre cada vez que hagas push a la rama `main`
