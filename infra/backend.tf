/*
Terraform backend configuration for state management (Azure Blob Storage)
*/

/*
Temporarily disabling remote backend for initial resource creation.
Uncomment after resource group and storage account are provisioned.
*/

/*
terraform {
  backend "azurerm" {
    resource_group_name   = "rg-billzynergy-nxt24"
    storage_account_name  = "stbillzynergynxt24"
    container_name        = "tfstate"
    key                   = "billzynergy.terraform.tfstate"
  }
}
*/
