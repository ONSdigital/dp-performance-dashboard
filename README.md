#Performance dashboard for ons.gov.uk
A static website for displaying performance data and analytics for the ONS website.

Local development requires running `npm run webpack` (watches file and automatically re-builds JS) or `npm run webpack-server` (watches file and hosts on port 9876). 

All files needed for production can be built by running `npm run webpack-production` and will then be kept under `/dist`.