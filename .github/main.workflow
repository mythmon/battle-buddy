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
  uses = "mythmon/npm@fb6b77bf2154131f58a5dd65b67cc5c6ad50e2f6"
  runs = "yarn"
  args = "deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn install",
  ]
}
