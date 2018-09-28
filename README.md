# dendro

A tool that can analyze dependency trees.

## Getting Started

- in khan folder: git checkout https://github.com/khan/dendro
- cd dendro
- yarn install
- yarn link
- cd ../webapp
- dendro -o ../dendro/data/output.json javascript/content-library-package/content-library-modules.js
- cd ../dendro
- yarn build
- yarn start

## Roadmap

- export JSON blob to disk
- flesh out plugin system to support reporting debt/best practices
- interactive tool for 
  - walking dependencies and dependents
  - seeing which files have the most debt/best practice
  - seeing aggregates values
- handle dynamic imports
- handle client-side routing (pass filename and URL as params)
- code use vs code loaded (cross reference javascript-package.json)
- provide a way to display and track data over time
- measure the complexity/maintainability of files
  - check for the presence of A/B test's
  - cyclometric complexity
  - number of props
  - present of renderFoo methods
