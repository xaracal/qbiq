resource "google_service_account" "vm" {
  account_id   = "${var.instance_name}-sa"
  display_name = "QBIQ application VM service account"
}

resource "google_project_iam_member" "artifact_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.vm.email}"
}
