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
  uses = "mythmon/npm@3d79866426281a617db26e2e5b8218ad0dd56776"
  runs = "yarn"
  args = "deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn install",
  ]
}
