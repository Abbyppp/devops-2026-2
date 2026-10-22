# API Express + TypeScript con Docker

## 🚀 Descripción

API REST en Node.js/Express con TypeScript, conectada a PostgreSQL y MongoDB.  
Ahora dockerizada para correr en cualquier máquina con un entorno consistente.

---

## 📋 Requisitos

- Node.js 18+ (solo para desarrollo local)
- Docker Desktop instalado y corriendo
- Git

---

## ⚙️ Instalación y arranque

### Clonar el repositorio

```bash
git clone https://github.com/uni-dev-labs/devops-2026-2.git
cd devops-2026-2
git checkout -b practica/docker-tu-apellido
```

## Copiar variables de entorno

- copy .env.example .env # En PowerShell

## Instalar dependencias

- npm install
- npm run typecheck

## Construir y levantar el stack:

- bash
- docker compose up --build -d
- Verificar servicios:

- bash
- docker compose ps
- docker compose logs -f api

## Detener contenedores:

- bash
- docker compose down

## Puertos expuestos

- API → http://localhost:3000

- PostgreSQL → localhost:5432

- MongoDB → localhost:27017

<<<<<<< HEAD
## 🔗 Endpoints
=======
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health del API |
| GET | `/api/postgres/health` | Health de PostgreSQL |
| GET | `/api/postgres/users?page=1&limit=10` | Lista usuarios paginados (Postgres) |
| POST | `/api/postgres/users` | Crea usuario (Postgres) |
| GET | `/api/mongo/health` | Health de MongoDB |
| GET | `/api/mongo/users?page=1&limit=10` | Lista usuarios paginados (Mongo) |
| POST | `/api/mongo/users` | Crea usuario (Mongo) |
>>>>>>> 9a6cbb273fd016c37a4b7d152c9e210b8845f371

- GET /health → estado general de la API

- GET /api/postgres/health → conexión con PostgreSQL

- GET /api/mongo/health → conexión con MongoDB

- POST /api/postgres/users → crear usuario en Postgres

- POST /api/mongo/users → crear usuario en Mongo

# Eejemplo del POST

{
"name": "Ana",
"email": "ana@example.com"
}
<<<<<<< HEAD

## 📸 Evidencia

# Docker Compose

![alt text](image.png)

# Logs de la API

- Mongo:
  ![alt text](image-1.png)

- PostgreSQL:
  ![alt text](image-2.png)

# Pruebas en POSTMAN

- API:
  ![alt text](image-3.png)

- PosgreSQL:
  ![alt text](image-4.png)

- Mongo:
  ![alt text](image-5.png)

## ✅ Checklist de aceptación

docker compose up --build -d levanta api, postgres y mongo sin errores.

Endpoints /health, /api/postgres/health, /api/mongo/health responden OK.

Inserción de usuarios funciona en ambas bases.

Existen Dockerfile, .dockerignore, docker-compose.yml y README actualizado.

La API usa nombres de servicio Docker (no localhost) para conectar a las bases.
=======
```
## Levantar con Docker

### Requisitos previos
- Docker Desktop instalado y corriendo
- Node.js 18+ (opcional si solo vas a usar Docker)

### Pasos

1. Copia el archivo de entorno:
```bash
   cp .env.example .env
```
   En Windows PowerShell:
```powershell
   Copy-Item .env.example .env
```

2. Levanta el stack completo (API + PostgreSQL + MongoDB):
```bash
   docker compose up --build -d
```

3. Verifica que los tres contenedores estén corriendo y en estado `healthy`:
```bash
   docker compose ps
```

4. Prueba los endpoints de salud:
```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/postgres/health
   curl http://localhost:3000/api/mongo/health
```

   > **Nota (Windows/PowerShell):** usa `curl.exe` en lugar de `curl` para evitar que PowerShell lo interprete como `Invoke-WebRequest`.

5. Prueba la creación de usuarios:
```bash
   curl -X POST http://localhost:3000/api/postgres/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Ana","email":"ana@example.com"}'

   curl -X POST http://localhost:3000/api/mongo/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Luis","email":"luis@example.com"}'
```

   En Windows PowerShell, usa `Invoke-RestMethod` en su lugar:
```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/postgres/users" -Method Post -ContentType "application/json" -Body '{"name":"Ana","email":"ana@example.com"}'

   Invoke-RestMethod -Uri "http://localhost:3000/api/mongo/users" -Method Post -ContentType "application/json" -Body '{"name":"Luis","email":"luis@example.com"}'
```

6. Revisa los logs del servicio API si necesitas depurar algo:
```bash
   docker compose logs -f api
```

7. Para detener el stack:
```bash
   docker compose down
```

### Arquitectura del stack
- **api** — Node.js/Express/TypeScript, expuesto en el puerto `3000`
- **postgres** — PostgreSQL 16, expuesto en el puerto `5432`
- **mongo** — MongoDB 7, expuesto en el puerto `27017`

Dentro de la red de Docker, la API se conecta a las bases usando el nombre del servicio (`postgres` y `mongo`), no `localhost`.
>>>>>>> 9a6cbb273fd016c37a4b7d152c9e210b8845f371
