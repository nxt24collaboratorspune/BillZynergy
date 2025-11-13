/*
Azure provider configuration for Billzynergy infrastructure
*/
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.60.0"
    }
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}
