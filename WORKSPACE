http_archive(
    name = "io_bazel_rules_closure",
    sha256 = "8e615c1c282ba680e667549e242cfcc0643846ee7c0c8c816bee077b3edda567",
    url = "https://github.com/bazelbuild/rules_closure/archive/f4d0633f14570313b94822223039ebda0f398102.zip",
    strip_prefix = "rules_closure-f4d0633f14570313b94822223039ebda0f398102",
)
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")
closure_repositories()

http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.10.0/rules_go-0.10.0.tar.gz",
    sha256 = "53c8222c6eab05dd49c40184c361493705d4234e60c42c4cd13ab4898da4c6be",
)
load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")
go_rules_dependencies()
go_register_toolchains()

new_http_archive(
    name = "polyfill",
    url = "https://github.com/webcomponents/custom-elements/archive/v1.0.8.zip",
    sha256 = "9606cdeacbb67f21fb495a4b0a0e5ea6a137fc453945907822e1b930e77124d4",
    strip_prefix = "custom-elements-1.0.8",
    build_file = "BUILD.polyfill",
)
