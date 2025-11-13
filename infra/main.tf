/*
Entry point for Billzynergy Azure infrastructure
*/

resource "azurerm_resource_group" "main" {
  name     = "rg-billzynergy-nxt24"
  location = "Central India"
}
