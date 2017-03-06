#!/bin/bash -eux

pushd dp-performance-dashboard
  npm install --unsafe-perm
popd

cp -r dp-performance-dashboard/dist/* dist/
