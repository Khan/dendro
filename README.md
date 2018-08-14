# dendro

A tool that can analyze dependency trees.

## Getting Started

- yarn install
- yarn link
- dep-walker path/to/file (you can run this from any folder)

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
