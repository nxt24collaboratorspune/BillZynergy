/*
Backend App Service and plan for Billzynergy Azure infrastructure
*/

resource "azurerm_service_plan" "backend" {
  name                = "asp-billzynergy-backend-dev"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                = "app-billzynergy-backend-dev"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.backend.id

  site_config {
  }

  app_settings = {
    ENV                      = "dev"
    WEBSITES_PORT            = "8000"
    BLOB_INVOICES_CONTAINER  = "invoices"
    BLOB_REPORTS_CONTAINER   = "reports"
    BLOB_ACCOUNT_NAME        = "stbillzynergynxt24"
    # Snowflake and AI provider secrets to be added here
  }
}
