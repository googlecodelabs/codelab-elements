# Codelab Custom Elements

The next generation of the codelab elements without any framework or library
dependencies, only the [Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
standard spec.

## Dev environment

All you need is [bazel](https://docs.bazel.build/versions/master/install.html).

After bazel is installed, try executing the following:

    bazel test --test_output=all //demo:hello_test

It will take some time at the first run because bazel will download and compile
all dependencies needed to work with the code and run tests. This includes
Google Closure library and compiler, Go language and browsers to run local JS
tests on.

### Building

Check out a demo HelloElement target. To build the element, execute the following:

    bazel build //demo:hello_bin

It should output something like this:

    INFO: Analysed target //demo:hello_bin (0 packages loaded).
    INFO: Found 1 target...
    Target //demo:hello_bin up-to-date:
      bazel-bin/demo/hello_bin.js
      bazel-bin/demo/hello_bin.js.map
    INFO: Elapsed time: 0.716s, Critical Path: 0.03s
    INFO: Build completed successfully, 1 total action

### Testing

All elements should have their test targets.
As a starting point, check out HelloElement tests:

    bazel test --test_output=errors //demo:hello_test

You should see something like this:

    INFO: Elapsed time: 5.394s, Critical Path: 4.60s
    INFO: Build completed successfully, 2 total actions
    //demo:hello_test_chromium-local                      PASSED in 4.6s

When things go wrong, it is usually easier to inspect and analyze output
with debug enabled:

    bazel test -s --verbose_failures --test_output=all --test_arg=-debug demo/hello_test

### Manual inspection from a browser

To browse things around manually with a real browser, execute the following:

    bazel run //tools:server

and navigate to http://localhost:8080.

## Notes

This is not an official Google product.
