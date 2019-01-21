workflow "Deploy" {
  on = "push"
  resolves = [
    "deploy",
  ]
}

action "install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "install"
}

action "deploy" {
  uses = "mythmon/npm@9fdff2785a2f5b7f7d28f636c85ba2c40b1a88a8"
  args = "run deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "install",
  ]
}
