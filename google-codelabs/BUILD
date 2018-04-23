load("//tools:defs.bzl",
     "closure_js_library", "closure_js_binary", "closure_js_test")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_template_library")
load("@io_bazel_rules_sass//sass:sass.bzl", "sass_binary", "sass_library")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "google_codelabs_files",
    srcs = glob([
        "*.html",
    ]) + [
        ":google_codelabs_scss_bin",
        ":google_codelabs_bin",
    ],
)

# Codelab step.
closure_js_library(
    name = "google_codelabs",
    srcs = ["google_codelabs.js"],
    deps = [
        "@io_bazel_rules_closure//closure/library",
        ":google_codelabs_soy",
    ]
)

# Compiled version of GoogleCodelabStep element, suitable for distribution.
closure_js_binary(
    name = "google_codelabs_bin",
    entry_points = ["googlecodelabs.Codelabs"],
    deps = [":google_codelabs"],
)

sass_library(
    name = "google_codelab_scss",
    srcs = ["google_codelab.scss"],
)

sass_binary(
    name = "google_codelabs_scss_bin",
    src = "google_codelabs.scss",
    deps = [
    ]
)

closure_js_template_library(
    name = "google_codelabs_soy",
    srcs = ["google_codelabs.soy"]
)