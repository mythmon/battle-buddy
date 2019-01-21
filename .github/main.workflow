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
  uses = "mythmon/npm@db8bf9ccffe2178a566b944ee2109f85f9db8b0f"
  runs = "yarn"
  args = "deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "yarn install",
  ]
}
