/*
Azure Container Registry for Billzynergy Azure infrastructure
*/

resource "azurerm_container_registry" "main" {
  name                = "acrbillzynergynxt24"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = false
}
