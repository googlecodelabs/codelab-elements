load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary", "closure_js_library", "closure_js_test")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "demo_files",
    srcs = glob([
        "*.html",
        "*.png",
    ]),
)

closure_js_library(
    name = "hello_lib",
    srcs = ["hello.js"],
    convention = "GOOGLE",
)

closure_js_binary(
    name = "hello_bin",
    compilation_level = "ADVANCED",
    defs = [
        "--assume_function_wrapper",
        "--new_type_inf",
        "--rewrite_polyfills=false",
    ],
    dependency_mode = "STRICT",
    entry_points = ["googlecodelabs.HelloElement"],
    language = "ECMASCRIPT5_STRICT",
    output_wrapper = "(function(){%output%}).call(this);",
    deps = [":hello_lib"],
)

closure_js_test(
    name = "hello_test",
    srcs = ["hello_test.js"],
    data = [
        "@polyfill//:custom_elements",
        "@polyfill//:native_shim",
    ],
    entry_points = ["googlecodelabs.hello_test"],
    html = "hello_test.html",
    suppress = ["JSC_EXTRA_REQUIRE_WARNING"],
    deps = [
        ":hello_lib",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)
