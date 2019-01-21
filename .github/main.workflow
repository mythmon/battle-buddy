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
  uses = "mythmon/npm@9fd705a7b7fe8cc792d1ab5fd694cbf69b92fc20"
  args = "run deploy"
  secrets = ["GITHUB_TOKEN"]
  needs = [
    "install",
  ]
}
