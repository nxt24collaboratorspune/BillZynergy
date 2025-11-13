/*
Outputs for Billzynergy Azure infrastructure
*/

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "container_registry_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "backend_app_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}

output "frontend_app_url" {
  value = azurerm_linux_web_app.frontend.default_hostname
}

# output "application_insights_instrumentation_key" {
#   value     = azurerm_application_insights.main.instrumentation_key
#   sensitive = true
# }
