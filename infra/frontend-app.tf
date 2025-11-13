/*
Frontend App Service and plan for Billzynergy Azure infrastructure
*/

resource "azurerm_service_plan" "frontend" {
  name                = "asp-billzynergy-frontend-dev"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "frontend" {
  name                = "app-billzynergy-frontend-dev"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.frontend.id

  site_config {
  }

  app_settings = {
    ENV                      = "dev"
    REACT_APP_API_BASE_URL   = "https://app-billzynergy-backend-dev.azurewebsites.net"
  }
}
