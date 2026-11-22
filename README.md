## Overview

Admin interface to slice & dice whatever is in the MDB.



## Contributing

Develop your feature locally and submit a pull request.

Make sure you have [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/) installed. Then:

1. Clone this repo
```shell
$ git clone https://github.com/Bnei-Baruch/mdb-admin.git
```

2. Install all dependencies
```shell
$ cd kmedia-mdb
$ yarn install
```

3. Configure environment
```shell
$ cp .env.sample .env
```
Open `.env` in your favorite editor and set all variables to their appropriate values.


4. Run dev server (Vite) — the app is served at http://localhost:3000/admin/
```shell
$ yarn start
```

5. Build
```shell
$ yarn build                    # uses .env (+ process env)
$ yarn build:production         # also loads .env.production (same for staging, external, suitcase)
$ yarn preview                  # serve the build locally
```
Environment variables keep the `REACT_APP_` prefix and are read via `import.meta.env`.


## License

MIT