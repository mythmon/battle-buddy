workflow "Deploy" {
  on = "push"
  resolves = [
    "build",
    "lint",
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
