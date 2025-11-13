# Billzynergy – Azure Infrastructure Solution Design

This document describes the Azure infrastructure for **Billzynergy**, an Agentic AI–based **media billing reconciliation** platform built for the hackathon.

The goals of this infra:

- Simple enough to **build fast** for a hackathon.
- Clean separation between **frontend**, **backend**, and **data**.
- Uses **Docker + ACR + App Service for Containers**.
- Uses **Azure Blob Storage** for raw invoices.
- Connects to **Snowflake** (external) for structured data.

---

## 1. High-Level Architecture

**Core components:**

- **Resource Group**: Logical container for all Azure resources.
- **Azure Container Registry (ACR)**: Stores Docker images for frontend and backend.
- **Azure Storage Account (Blob Storage)**: Stores raw invoice files and any generated reports.
- **Backend Web App (App Service for Containers)**: Runs the API and agentic logic.
- **Frontend Web App (App Service for Containers)**: Serves the UI (React/SPA) as a container.
- **(Optional but recommended) Application Insights**: Centralized logging and monitoring.

**External:**

- **Snowflake**: Main analytics & reconciliation database (not provisioned via Azure, but referenced by the app via environment variables / secrets).
- **LLM / AI Provider**: OpenAI / Azure OpenAI / other (also referenced via env vars).

---

## 2. Naming Conventions

Project: `billzynergy`  
Environment: `dev` (for now; can later extend to `stg`, `prod`)  
Region: `Central India` or `East US` (pick one and keep consistent)

**Suggested naming:**

- Resource group: `rg-billzynergy-nxt24`
- Container registry: `acrBillzynergyNxt24` (DNS: `acrbillzynergydev.azurecr.io`)
- Storage account: `stbillzynergyNxt24` (must be globally unique, all lowercase, <= 24 chars)
- Backend App Service plan (if using): `asp-billzynergy-backend-dev`
- Backend Web App (container): `app-billzynergy-backend-dev`
- Frontend App Service plan (optional separate): `asp-billzynergy-frontend-dev`
- Frontend Web App (container): `app-billzynergy-frontend-dev`
- Application Insights: `appi-billzynergy-dev`

Blob containers:

- `invoices` – uploaded raw invoice files (PDF, CSV, XLS, etc.).
- `reports` – generated discrepancy reports (optional for hackathon).

---

## 3. Azure Resources Overview

### 3.1 Resource Group

**Type:** `azurerm_resource_group`  
**Name:** `rg-billzynergy-nxt24`

**Purpose:**

- Group all billzynergy resources for the hackathon environment.

**Key properties:**

- `location`: e.g. `"Central India"` or `"East US"`

---

### 3.2 Azure Container Registry (ACR)

**Type:** `azurerm_container_registry`  
**Name:** `acrbillzynergynxt24`

**Purpose:**

- Store Docker images for:
  - `billzynergy-backend`
  - `billzynergy-frontend`

**Key properties:**

- `sku`: `Basic` (sufficient for hackathon)
- `admin_enabled`: `false` (use service principal / managed identity from GitHub Actions)
- `georeplication_locations`: not required for hackathon

---

### 3.3 Storage Account (Blob Storage)

**Type:** `azurerm_storage_account`  
**Name:** `stbillzynergynxt24`

**Purpose:**

- Blob storage for:
  - Uploaded invoice files.
  - Optional generated reports / exports.
  - Any temporary artifacts that need to be reprocessed.

**Key properties:**

- `account_tier`: `Standard`
- `account_replication_type`: `LRS`
- `allow_blob_public_access`: `false` (recommended)
- `min_tls_version`: `TLS1_2`

**Blob containers (Terraform `azurerm_storage_container`):**

1. `invoices`
   - Holds raw input files.
   - The backend stores the full blob URI in Snowflake alongside invoice metadata.

2. `reports` (optional)
   - Holds generated reports (e.g. PDF or CSV) if you choose to persist them.

---

### 3.4 Backend – App Service for Containers

**Type:** `azurerm_linux_web_app` (with Docker)  
**Name:** `app-billzynergy-backend-dev`

**Purpose:**

- Run the **API** and agentic logic:
  - Receive invoice uploads.
  - Upload files to Blob Storage.
  - Call LLMs / AI services for extraction & reconciliation.
  - Connect to Snowflake for structured DB operations.
  - Provide endpoints for Dashboard & Report screens.

**Associated plan:**

- **Type:** `azurerm_service_plan`
- **Name:** `asp-billzynergy-backend-dev`
- **Kind:** `linux`
- **Sku:** `B1` or `P1v2` depending on budget (B1 is fine for hackathon).

**Docker settings:**

- Image: `acrbillzynergydev.azurecr.io/billzynergy-backend:<tag>`
- `WEBSITES_PORT`: `8000` (or the port your backend listens on inside the container)

**App settings (Terraform `site_config` / `app_settings`):**

_Application config (non-secret):_

- `ENV`: `dev`
- `WEBSITES_PORT`: `8000`
- `BLOB_INVOICES_CONTAINER`: `invoices`
- `BLOB_REPORTS_CONTAINER`: `reports` (if used)
- `BLOB_ACCOUNT_NAME`: `stbillzynergydev`

_Snowflake connection (secrets should be stored in Azure App Service settings for hackathon; can move to Key Vault later):_

- `SNOWFLAKE_ACCOUNT`
- `SNOWFLAKE_USER`
- `SNOWFLAKE_PASSWORD`
- `SNOWFLAKE_WAREHOUSE`
- `SNOWFLAKE_DB` (e.g. `MEDIA_RECON_DB`)
- `SNOWFLAKE_SCHEMA` (e.g. `PUBLIC`)

_AI / LLM provider (secrets):_

- `OPENAI_API_KEY` or equivalent
- Any base URLs or model names as needed.

_Storage connection (for code using connection strings):_

- `AZURE_STORAGE_CONNECTION_STRING` (optional)
  - Alternatively, use managed identity and `AZURE_CLIENT_ID`/`TENANT_ID` if you integrate later.

---

### 3.5 Frontend – App Service for Containers

**Type:** `azurerm_linux_web_app` (with Docker)  
**Name:** `app-billzynergy-frontend-dev`

**Purpose:**

- Serve the **web UI** as a containerized SPA (React / similar).
- Communicate with the backend over HTTPS.

**Associated plan:**

- **Type:** `azurerm_service_plan`
- **Name:** `asp-billzynergy-frontend-dev`
- **Kind:** `linux`
- **Sku:** `B1` (enough for hackathon)

**Docker settings:**

- Image: `acrbillzynergynxt24.azurecr.io/billzynergy-frontend:<tag>`
- `WEBSITES_PORT`: `80` (Nginx default, or whatever your container uses)

**App settings:**

- `ENV`: `dev`
- `REACT_APP_API_BASE_URL` (or similar depending on framework)  
  Example value:
  - `https://app-billzynergy-backend-dev.azurewebsites.net`

No secrets are needed on the frontend side other than public URLs.

> Container image is built from `frontend/bill-zynergy-web/Dockerfile`, which bundles the React app and serves it through Nginx.

---

### 3.6 Application Insights (Optional but Recommended)

**Type:** `azurerm_application_insights`  
**Name:** `appi-billzynergy-dev`

**Purpose:**

- Centralized logging, telemetry, and performance metrics for:
  - Backend Web App
  - Optionally the frontend as well (via JS SDK)

**Integration:**

- Add `APPINSIGHTS_INSTRUMENTATIONKEY` / `APPLICATIONINSIGHTS_CONNECTION_STRING` to backend app settings.
- Use Application Insights SDK or rely on auto-collection if supported.

---

## 4. GitHub Actions / CI-CD Integration (Summary)

Two reusable GitHub Actions workflows now live in `.github/workflows`:

- `backend-deploy.yml` builds `./backend`, pushes `billzynergy-backend` images to ACR, and updates `app-billzynergy-backend-dev`.
- `frontend-deploy.yml` builds `./frontend/bill-zynergy-web`, pushes `billzynergy-frontend` images to ACR, and updates `app-billzynergy-frontend-dev`. A repo variable `FRONTEND_API_BASE_URL` can override the build-time API URL; otherwise it falls back to the backend App Service hostname.

### Required secrets / variables

| Name | Scope | Notes |
| --- | --- | --- |
| `AZURE_CREDENTIALS` | Secret | Output of `az ad sp create-for-rbac ... --sdk-auth`. Used by `azure/login` for CLI access. |
| `ACR_USERNAME` | Secret | ACR admin user or token with `AcrPull`/`AcrPush`. Needed so App Services can pull private images. |
| `ACR_PASSWORD` | Secret | Password for the above credential. |
| `FRONTEND_API_BASE_URL` | Repository variable (optional) | Overrides the default API endpoint baked into the React build. |

Each workflow:

1. Logs into Azure via the service principal.
2. Authenticates to ACR (`az acr login`), builds a Docker image (tagged with `github.sha` and `latest`), and pushes both tags.
3. Calls `az webapp config container set` so the corresponding Linux Web App pulls the freshly pushed image, then restarts the app.

> **Infra requirement:** Ensure both App Services either run with system-assigned managed identities that have `AcrPull` on `acrbillzynergynxt24`, or supply the `ACR_USERNAME`/`ACR_PASSWORD` secrets (admin user or ACR token) referenced above. Without one of these, the Web Apps cannot pull images from the private registry.

---

## 5. Snowflake Integration (Logical Only)

Snowflake is **not** provisioned via this Azure infra, but Terraform variables can be prepared to be passed into App Service settings.

Recommended Terraform variables:

- `var.snowflake_account`
- `var.snowflake_user`
- `var.snowflake_password` (use sensitive variable)
- `var.snowflake_warehouse`
- `var.snowflake_db` (e.g. `MEDIA_RECON_DB`)
- `var.snowflake_schema` (e.g. `PUBLIC`)

These variables are then mapped into the backend Web App’s `app_settings`.

---

## 6. Terraform Structure Suggestion

Suggested minimal structure:

```text
/infra
  ├─ main.tf
  ├─ providers.tf
  ├─ variables.tf
  ├─ outputs.tf
  ├─ backend-app.tf
  ├─ frontend-app.tf
  ├─ storage.tf
  ├─ acr.tf
  └─ monitor.tf (for Application Insights)
