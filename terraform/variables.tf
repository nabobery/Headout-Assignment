variable "project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for resources."
  type        = string
  default     = "us-central1"
}

variable "vpc_name" {
  description = "The name for the VPC network."
  type        = string
  default     = "your-vpc"
}

variable "subnet_name" {
  description = "The name for the subnet."
  type        = string
  default     = "your-subnet"
}

variable "subnet_cidr_range" {
  description = "The IP CIDR range for the subnet."
  type        = string
  default     = "10.0.0.0/24"
}

variable "nat_ip_name" {
  description = "The name for the static IP address reserved for NAT."
  type        = string
  default     = "nat-ip"
}

variable "nat_router_name" {
  description = "The name for the Cloud Router used for NAT."
  type        = string
  default     = "nat-router"
}

variable "nat_config_name" {
  description = "The name for the Cloud NAT configuration."
  type        = string
  default     = "nat-config"
}

variable "vpc_connector_name" {
  description = "The name for the VPC Access Connector."
  type        = string
  default     = "my-connector"
}

variable "vpc_connector_cidr_range" {
  description = "The IP CIDR range for the VPC Access Connector."
  type        = string
  default     = "10.8.0.0/28"
}

variable "vpc_connector_max_throughput" {
  description = "Maximum throughput for the VPC Access Connector in Mbps."
  type        = number
  default     = 300
}

variable "vpc_connector_min_throughput" {
  description = "Minimum throughput for the VPC Access Connector in Mbps."
  type        = number
  default     = 200
}

variable "cloud_run_service_name" {
  description = "The name for the Cloud Run service."
  type        = string
  default     = "my-service"
}

variable "cloud_run_image" {
  description = "The container image URL for the Cloud Run service."
  type        = string
}
