provider "google" {
  project = var.project_id
  region  = var.gcp_region
}

# Create the VPC network
resource "google_compute_network" "vpc" {
  name = var.vpc_name
}

# Create a subnet in the VPC
resource "google_compute_subnetwork" "subnet" {
  name          = var.subnet_name
  ip_cidr_range = var.subnet_cidr_range
  region        = var.gcp_region
  network       = google_compute_network.vpc.self_link
}

# Reserve a static IP for NAT
resource "google_compute_address" "nat_ip" {
  name   = var.nat_ip_name
  region = var.gcp_region
}

# Create a router for NAT
resource "google_compute_router" "nat_router" {
  name    = var.nat_router_name
  region  = var.gcp_region
  network = google_compute_network.vpc.self_link
}

# Configure Cloud NAT using the reserved IP
resource "google_compute_router_nat" "nat_config" {
  name                               = var.nat_config_name
  router                             = google_compute_router.nat_router.name
  region                             = var.gcp_region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.nat_ip.self_link]
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Create a VPC connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = var.vpc_connector_name
  network       = google_compute_network.vpc.name
  region        = var.gcp_region
  ip_cidr_range = var.vpc_connector_cidr_range
  min_throughput = var.vpc_connector_min_throughput
  max_throughput = var.vpc_connector_max_throughput
}

# Deploy Cloud Run service
resource "google_cloud_run_service" "default" {
  name     = var.cloud_run_service_name
  location = var.gcp_region

  template {
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "all"
      }
    }
    spec {
      containers {
        image = var.cloud_run_image
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_vpc_access_connector.connector]
}

# (Optional) Allow unauthenticated access
resource "google_cloud_run_service_iam_member" "noauth" {
  service    = google_cloud_run_service.default.name
  location   = var.gcp_region
  role       = "roles/run.invoker"
  member     = "allUsers"
}

# Output the static IP address used by Cloud NAT
output "nat_ip_address" {
  description = "The static IP address assigned to the Cloud NAT gateway."
  value       = google_compute_address.nat_ip.address
}
