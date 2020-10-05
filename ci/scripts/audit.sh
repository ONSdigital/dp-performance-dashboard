#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/dp-performance-dashboard
  make audit
popd
