resource "google_compute_address" "app" {
  name   = "${var.instance_name}-ip"
  region = var.region
}

resource "google_compute_instance" "app" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  tags = ["qbiq-dig-store-app"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30
      type  = "pd-balanced"
    }
  }

  network_interface {
    network = "default"

    access_config {
      nat_ip = google_compute_address.app.address
    }
  }

  service_account {
    email  = google_service_account.vm.email
    scopes = ["cloud-platform"]
  }

  metadata_startup_script = file("${path.module}/startup.sh")

  allow_stopping_for_update = true
}
