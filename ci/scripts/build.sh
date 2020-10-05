#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/dp-performance-dashboard
  make build
popd

cp -r $cwd/dp-performance-dashboard/dist/* build/
