#!/bin/bash
set -ex

# Make this repo's bazel workspace the current work dir.
# Relative to this script location.
cd $(dirname $0)/..
bazel info

BAZEL_FLAGS="--color=no \
       --curses=no \
       --verbose_failures \
       --show_task_finish \
       --show_timestamps"

# TODO(#2): Use more sensitive build/test targets when CI is working.
bazel build -s $BAZEL_FLAGS //demo:hello_test
bazel test -s $BAZEL_FLAGS --test_output=all --test_arg=-debug //demo:hello_test
