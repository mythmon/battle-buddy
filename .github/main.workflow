workflow "Test and deploy" {
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

action "yarn test" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "test"
  runs = "yarn"
  needs = [
    "yarn install",
  ]
  env = {
    CI = "1"
  }
}

action "yarn deploy" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  runs = "yarn"
  args = "deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn test",
  ]
}
