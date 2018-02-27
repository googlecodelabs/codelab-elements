load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary", "closure_js_library", "closure_js_test")
load("@io_bazel_rules_go//go:def.bzl", "go_binary")

closure_js_library(
    name = "hello_lib",
    srcs = ["hello.js"],
    convention = "GOOGLE",
)

closure_js_binary(
    name = "hello_bin",
    deps = [":hello_lib"],
    output_wrapper = "(function(){%output%}).call(this);",
    language = "ECMASCRIPT5_STRICT",
    compilation_level = "ADVANCED",
    dependency_mode = "STRICT",
    entry_points = ["googlecodelabs.HelloElement"],
    defs = [
        "--assume_function_wrapper",
	"--new_type_inf",
	"--rewrite_polyfills=false",
    ],
)

closure_js_test(
    name = "hello_test",
    srcs = ["hello_test.js"],
    deps = [
	":hello_lib",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
    entry_points = ["googlecodelabs.hello_test"],
    language = "ECMASCRIPT5_STRICT",
    #compilation_level = "WHITESPACE_ONLY",
    suppress = ["JSC_EXTRA_REQUIRE_WARNING"],
    html = "hello_test.html",
    data = [
        "@polyfill//:custom_elements",
        "@polyfill//:native_shim",
    ],
)

go_binary(
    name = "server",
    srcs = ["server.go"],
    data = glob(["*.html", "*.png"]) + [
        "@polyfill//:custom_elements",
        "@polyfill//:native_shim",
	":hello_bin",
    ],
)
