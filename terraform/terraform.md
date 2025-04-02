# Globetrotter Backend Infrastructure (Terraform)

This directory contains the Terraform configuration for provisioning the necessary Google Cloud Platform (GCP) infrastructure for the Globetrotter backend application. It automates the setup of networking components (VPC, Subnet, NAT, Static IP) and the Cloud Run service deployment.

## Table of Contents

1.  [Why Terraform?](#why-terraform)
2.  [The MongoDB Atlas IP Access Problem](#the-mongodb-atlas-ip-access-problem)
3.  [Solution: Cloud NAT with Static IP](#solution-cloud-nat-with-static-ip)
4.  [Prerequisites](#prerequisites)
5.  [Setup Instructions](#setup-instructions)
    - [Install Terraform](#install-terraform)
    - [Authenticate to Google Cloud](#authenticate-to-google-cloud)
6.  [Configuration](#configuration)
7.  [Deployment](#deployment)
8.  [Post-Deployment: Allowlisting NAT IP in MongoDB Atlas](#post-deployment-allowlisting-nat-ip-in-mongodb-atlas)
9.  [Cleanup (Optional)](#cleanup-optional)
10. [Terraform File Structure](#terraform-file-structure)

## Why Terraform?

Terraform is an Infrastructure as Code (IaC) tool that allows you to define and provision infrastructure using a high-level configuration language. Using Terraform for this project provides several benefits:

- **Automation:** Infrastructure setup is automated, reducing manual effort and potential errors.
- **Consistency:** Ensures the infrastructure is deployed the same way every time.
- **Version Control:** Infrastructure configuration can be versioned using Git, allowing tracking of changes and collaboration.
- **Repeatability:** Easily replicate the infrastructure in different environments (e.g., staging, production).
- **Modularity:** Configuration can be broken down into reusable modules.

## The MongoDB Atlas IP Access Problem

MongoDB Atlas, a popular cloud database service, enhances security by requiring users to explicitly allowlist IP addresses that are permitted to connect to a database cluster.

Google Cloud Run services, by default, do not have fixed outbound IP addresses. When a Cloud Run service makes a request to the internet (like connecting to MongoDB Atlas), it originates from a dynamic IP address within a large pool managed by Google. This makes it impossible to reliably allowlist Cloud Run IPs in MongoDB Atlas, as the IP address can change frequently.

## Solution: Cloud NAT with Static IP

This Terraform configuration solves the IP allowlisting problem by setting up the following GCP resources:

1.  **VPC Network (`google_compute_network`):** Creates a private Virtual Private Cloud network to host our resources.
2.  **Subnet (`google_compute_subnetwork`):** Defines a specific IP range within the VPC.
3.  **Static External IP Address (`google_compute_address`):** Reserves a fixed, public IP address that will be used for outbound traffic.
4.  **Cloud Router (`google_compute_router`):** A necessary component for Cloud NAT to function.
5.  **Cloud NAT Gateway (`google_compute_router_nat`):** Configures Network Address Translation. It's set up to use the reserved static IP address (`MANUAL_ONLY`) and route all outbound traffic from the subnet (`ALL_SUBNETWORKS_ALL_IP_RANGES`) through this static IP.
6.  **VPC Access Connector (`google_vpc_access_connector`):** Creates a bridge allowing serverless environments like Cloud Run to connect to resources within the VPC network.
7.  **Cloud Run Service (`google_cloud_run_service`):** Deploys the backend application container. Crucially, it's configured with annotations (`run.googleapis.com/vpc-access-connector`, `run.googleapis.com/vpc-access-egress`) to route all its outbound traffic (`all`) through the VPC Access Connector.

**The Flow:**

- When the Cloud Run service (`globetrotter-backend`) needs to connect to MongoDB Atlas:
  - The request is routed through the **VPC Access Connector** into the VPC.
  - Within the VPC, the **Cloud Router** directs the outbound traffic to the **Cloud NAT Gateway**.
  - The Cloud NAT Gateway translates the internal source IP to the **Reserved Static External IP Address**.
  - The request reaches MongoDB Atlas appearing to originate from this **single, predictable static IP**.
- Since this static IP is allowlisted in MongoDB Atlas, the connection is successful.

## Prerequisites

- **Google Cloud Platform (GCP) Account:** With billing enabled.
- **GCP Project:** A project created in your GCP account.
- **`gcloud` CLI:** Google Cloud SDK installed and configured. ([Installation Guide](https://cloud.google.com/sdk/docs/install))
- **MongoDB Atlas Account:** With a cluster created.
- **Git:** For cloning the repository.
- **Terraform:** Installed locally (see next section).

## Setup Instructions

### Install Terraform

Follow the official HashiCorp instructions to install Terraform for your operating system:
[https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

Verify the installation:

```bash
terraform version
```

### Authenticate to Google Cloud

Terraform needs credentials to interact with your GCP account. The recommended way for local development is using Application Default Credentials (ADC) via the `gcloud` CLI:

1.  **Login to gcloud:**

    ```bash
    gcloud auth login
    ```

    Follow the prompts to log in with your Google account.

2.  **Set up Application Default Credentials:**
    ```bash
    gcloud auth application-default login
    ```
    This command grants Terraform the necessary permissions based on your logged-in user. Ensure your user account has sufficient IAM roles in the target GCP project (e.g., Project Owner/Editor, Compute Network Admin, Cloud Run Admin, Service Account User).

## Configuration

1.  **Clone the Repository:**

    ```bash
    # Replace with your repository URL
    git clone https://github.com/nabobery/Headout-Assignment
    cd Headout-Assignment/terraform
    ```

2.  **Create `terraform.tfvars.json`:**
    This file is used to provide values for the variables defined in `variables.tf`. It allows you to customize the deployment without modifying the core configuration files.

    - Copy the example content below into a new file named `terraform.tfvars.json` in the `terraform` directory.
    - **Crucially, edit the placeholder values** (especially `project_id` and `cloud_run_image`) to match your specific environment.

    ```json:terraform/terraform.tfvars.json
    {
        "project_id": "your-gcp-project-id",
        "gcp_region": "asia-south1",
        "vpc_name": "globetrotter-vpc",
        "subnet_name": "globetrotter-subnet",
        "subnet_cidr_range": "10.0.0.0/24",
        "nat_ip_name": "globetrotter-nat-ip",
        "nat_router_name": "globetrotter-nat-router",
        "nat_config_name": "globetrotter-nat-config",
        "vpc_connector_name": "globetrotter-connector",
        "vpc_connector_cidr_range": "10.8.0.0/28",
        "vpc_connector_max_throughput": 300,
        "vpc_connector_min_throughput": 200,
        "cloud_run_service_name": "globetrotter-backend",
        "cloud_run_image": "asia-south1-docker.pkg.dev/your-gcp-project-id/globetrotter-images/globetrotter-backend:latest"
      }
    ```

    **Important:** Ensure `terraform.tfvars.json` (or `terraform.tfvars`) is added to your `.gitignore` file to prevent committing potentially sensitive or environment-specific values.

## Deployment

Navigate to the `terraform` directory in your terminal before running these commands.

1.  **Initialize Terraform:**
    Downloads necessary provider plugins. Run this once per project or after adding new providers.

    ```bash
    terraform init
    ```

2.  **Plan Changes:**
    Shows you what resources Terraform will create, modify, or destroy. It's a dry run to review changes before applying them.

    ```bash
    terraform plan
    ```

3.  **Apply Changes:**
    Provisions the infrastructure defined in your configuration files. Terraform will show the plan again and ask for confirmation.
    ```bash
    terraform apply
    ```
    Type `yes` when prompted to confirm.

Terraform will now create the VPC, subnet, NAT gateway, static IP, VPC connector, and deploy the Cloud Run service. This might take a few minutes.

## Post-Deployment: Allowlisting NAT IP in MongoDB Atlas

1.  **Get the Static NAT IP Address:**
    After `terraform apply` completes successfully, retrieve the static IP address assigned to your Cloud NAT gateway using the Terraform output variable:

    ```bash
    terraform output nat_ip_address
    ```

    Copy the displayed IP address (it will be a standard IPv4 address).

2.  **Add IP to MongoDB Atlas Allowlist:**
    - Log in to your MongoDB Atlas account.
    - Navigate to your Project -> Security -> Network Access.
    - Click "Add IP Address".
    - Paste the static IP address obtained from the `terraform output` command into the "Access List Entry" field.
    - Optionally, add a description (e.g., "Cloud Run NAT IP - Globetrotter Backend").
    - Click "Confirm".

Wait for Atlas to update the firewall rules (this usually takes a minute or two). Your Cloud Run service should now be able to connect to your MongoDB Atlas cluster.

## Cleanup (Optional)

If you want to remove all the infrastructure created by this Terraform configuration:

```bash
terraform destroy
```

Terraform will show you all the resources it plans to delete and ask for confirmation. Type `yes` to proceed.

**Warning:** This action is irreversible and will delete all the GCP resources managed by this configuration.

## Terraform File Structure

- `main.tf`: Defines the core GCP resources (VPC, Subnet, NAT, IP, Router, Connector, Cloud Run service).
- `variables.tf`: Declares input variables used in `main.tf`, allowing customization (e.g., project ID, region, names). Defines types and default values.
- `terraform.tfvars.json` (or `terraform.tfvars`): **(You create this)** Provides specific values for the variables defined in `variables.tf`. This file is automatically loaded by Terraform. **Do not commit this file if it contains sensitive information.**
- `outputs.tf` (Implicitly defined in `main.tf`): Defines output values that can be easily queried after deployment (e.g., the static NAT IP address).
