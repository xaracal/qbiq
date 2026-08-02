variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "instance_name" {
  description = "Name prefix for compute resources"
  type        = string
  default     = "qbiq-dig-store-app"
}

variable "machine_type" {
  description = "GCE machine type"
  type        = string
  default     = "e2-medium"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH to the VM (restrict in production)"
  type        = string
  default     = "0.0.0.0/0"
}
