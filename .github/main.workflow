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

action "build" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "run build"
  needs = ["install"]
}

action "lint" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "run lint"
  needs = ["install"]
}

action "deploy" {
  uses = "mythmon/npm@9fd705a7b7fe8cc792d1ab5fd694cbf69b92fc20"
  args = "run ci-deploy -- --silent --repo $GHPAGES_REPO"
  needs = [
    "build",
    "lint",
  ]
  secrets = ["GHPAGES_REPO"]
}
