# Investment Portfolio Management System

**Aluno:** Gabriel Araújo (Nº 27978)  
**UC:** Integração de Sistemas Informáticos  
**Instituição:** Politécnico do Cávado e Ave - EST  
**Ano Letivo:** 2024/2025

---

## 📋 Descrição do Projeto

Sistema de gestão de portfólios de investimento baseado em arquitetura orientada a serviços (SOA), desenvolvido em .NET com integração de serviços REST, SOAP (WCF) e APIs externas de mercado financeiro.

### Funcionalidades Principais

- ✅ Autenticação e gestão de utilizadores (JWT)
- ✅ Gestão de portfólios de investimento
- ✅ Controlo de ativos financeiros
- ✅ Registo de transações
- ✅ Sistema de alertas
- ✅ Integração com dados de mercado em tempo real (AlphaVantage, CoinGecko)

---

## 🏗️ Arquitetura

### Componentes do Sistema
```
Frontend (React + TypeScript)
    ↓ HTTPS
API REST (.NET 8)
    ↓ HTTP/HTTPS
Serviços WCF (SOAP)
    ↓
Application Layer
    ↓
Infrastructure (ADO.NET)
    ↓
SQL Server Database
```

### Serviços Isolados

- **MarketData Service:** Integração com APIs externas (AlphaVantage, CoinGecko)
- **Cache System:** Redis (local) / MemoryCache (Azure)

---

## 🚀 Execução em Ambiente Local

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) ou LocalDB
- [Docker Desktop](https://www.docker.com/) (opcional, para Redis)

### 1. Configuração da Base de Dados
```bash
# Criar base de dados no SQL Server
# Executar script em: /db/create-database.sql
```

### 2. Configurar Redis (Opcional)
```bash
docker run -d -p 6379:6379 --name redis-cache redis:latest
```

### 3. Iniciar Serviços Backend

**Terminal 1 - WCF**
```bash
cd src/InvestmentPortfolio.Wcf
dotnet run
# Aguardar: "Now listening on: https://localhost:5001"
```

**Terminal 2 - API**
```bash
cd src/InvestmentPortfolio.Api
dotnet run
# Aguardar: "Now listening on: https://localhost:7039"
```

**Terminal 3 - MarketData**
```bash
cd src/InvestmentPortfolio.MarketData
dotnet run
# Aguardar: "Now listening on: https://localhost:7059"
```

### 4. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev
# Aceder a: http://localhost:3000
```

### 5. Verificar Sistema

- 🌐 **Frontend:** http://localhost:3000
- 📡 **API Swagger:** https://localhost:7039/swagger
- 📊 **MarketData Swagger:** https://localhost:7059/swagger
- 🔧 **WCF Service:** https://localhost:5001/AuthService.svc

---

## 🧪 Testes

### Postman

Importar a coleção em `/postman/InvestmentPortfolio.postman_collection.json`

### Swagger UI

Acessar:
- API: https://localhost:7039/swagger
- MarketData: https://localhost:7059/swagger

### Fluxo de Teste Recomendado

1. **Registar utilizador:** POST `/api/auth/register`
2. **Fazer login:** POST `/api/auth/login` → obter JWT token
3. **Criar portfólio:** POST `/api/portfolio`
4. **Adicionar ativo:** POST `/api/asset/portfolio/{portfolioId}`
5. **Registar transação:** POST `/api/transaction`
6. **Consultar mercado:** GET `/api/market/trending`

---

## ☁️ Deployment Azure

### Serviços Publicados

- **API REST:** https://investmentportfolio-api.azurewebsites.net
- **WCF Services:** http://investmentportfolio-wcf.azurewebsites.net
- **MarketData:** https://investmentportfolio-marketdata.azurewebsites.net
- **Frontend:** https://gabiquintao.github.io/InvestmentPortfolio/
- **Base de Dados:** Azure SQL Database

### Diferenças Local vs Azure

| Componente | Local | Azure |
|------------|-------|-------|
| **WCF Protocol** | HTTPS | HTTP |
| **Cache** | Redis (Docker) | MemoryCache |
| **.NET Version** | .NET 8 | .NET 8 |
| **Database** | LocalDB | Azure SQL |

---

## 📚 Documentação

- **Relatório Completo:** `/doc/doc_27978-relatorio.pdf`
- **Descrição Inicial:** `/doc/doc_27978-descricao.pdf`
- **Diagrama ER:** `/db/diagram-er.png`

---

## 🛠️ Tecnologias Utilizadas

### Backend
- .NET 8
- ASP.NET Core Web API
- CoreWCF (SOAP Services)
- ADO.NET
- SQL Server
- JWT Authentication
- AutoMapper
- FluentValidation

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Integrações Externas
- AlphaVantage API
- CoinGecko API

### DevOps & Cloud
- Microsoft Azure (App Services, SQL Database)
- GitHub Pages
- Docker (desenvolvimento local)
- Git / GitHub

---

## 📝 Notas Importantes

### Certificados HTTPS (Local)

Se encontrar erros de certificado:
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### Connection Strings

As connection strings estão configuradas em `appsettings.json` de cada projeto.  
Para Azure, as configurações são geridas via App Settings no portal.

### Limites de API Externa

- **AlphaVantage:** 25 requests/dia (free tier)
- **CoinGecko:** 10-50 requests/minuto

---

## 👤 Autor

**Gabriel Araújo**  
Nº 27978  
Email: a27978@alunos.ipca.pt  
GitHub: [@gabiquintao](https://github.com/gabiquintao)

---

## 📅 Histórico de Entregas

- **16/12/2024:** Descrição do problema e arquitetura
- **28/12/2024:** Entrega final (código + relatório)

---

## 📖 Licença

Este projeto foi desenvolvido para fins académicos no âmbito da UC de Integração de Sistemas Informáticos.
