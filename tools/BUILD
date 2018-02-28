load("@io_bazel_rules_go//go:def.bzl", "go_binary")

go_binary(
    name = "server",
    srcs = ["server.go"],
    data = [
        "//demo:demo_files",
        "//demo:hello_bin",
        "@polyfill//:custom_elements",
        "@polyfill//:native_shim",
    ],
)
