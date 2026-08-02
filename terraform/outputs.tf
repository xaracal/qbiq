output "public_ip" {
  description = "Static public IP of the application VM"
  value       = google_compute_address.app.address
}

output "instance_name" {
  description = "GCE instance name"
  value       = google_compute_instance.app.name
}

output "zone" {
  description = "GCE zone"
  value       = var.zone
}

output "ssh_command" {
  description = "Example SSH command for the VM"
  value       = "gcloud compute ssh ${google_compute_instance.app.name} --zone=${var.zone} --project=${var.project_id}"
}

output "app_url" {
  description = "Application URL (HTTP)"
  value       = "http://${google_compute_address.app.address}"
}
