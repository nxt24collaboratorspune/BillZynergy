/*
Variables for Billzynergy Azure infrastructure
*/

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "Central India"
}

variable "snowflake_account" {
  description = "Snowflake account identifier"
  type        = string
}

variable "snowflake_user" {
  description = "Snowflake username"
  type        = string
}

variable "snowflake_password" {
  description = "Snowflake password"
  type        = string
  sensitive   = true
}

variable "snowflake_warehouse" {
  description = "Snowflake warehouse"
  type        = string
}

variable "snowflake_db" {
  description = "Snowflake database name"
  type        = string
  default     = "MEDIA_RECON_DB"
}

variable "snowflake_schema" {
  description = "Snowflake schema"
  type        = string
  default     = "PUBLIC"
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}
