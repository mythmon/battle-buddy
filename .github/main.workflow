workflow "Deploy" {
  on = "push"
  resolves = [
    "yarn deploy",
  ]
}

action "install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "install"
}

action "deploy" {
  uses = "mythmon/npm@513b3509435dc93b81a0e7ebf460052ea95a9484"
  args = "run deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn install",
  ]
}
