workflow "Deploy" {
  on = "push"
  resolves = [
    "yarn deploy",
  ]
}

action "yarn install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  runs = "yarn"
  args = "install"
}

action "yarn deploy" {
  uses = "mythmon/npm@9fdff2785a2f5b7f7d28f636c85ba2c40b1a88a8"
  runs = "yarn"
  args = "deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn install",
  ]
}
