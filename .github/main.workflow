workflow "Deploy" {
  on = "push"
  resolves = [    
    "deploy",
  ]
}

action "install" {
  uses = "borales/actions-yarn@master"
  args = "install"
}

action "build" {
  uses = "borales/actions-yarn@master"
  args = "run build"
  needs = ["install"]
}

action "lint" {
  uses = "borales/actions-yarn@master"
  args = "run lint"
  needs = ["install"]
}

action "deploy" {
  uses = "mythmon/actions-gh-pages@master"
  needs = ["lint", "build"]
  secrets = ["PERSONAL_ACCESS_TOKEN"]
}
