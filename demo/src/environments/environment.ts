// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  // Set to null for internal data-souce.service
  // or clone and start the demo project at https://github.com/vitocmpl/ng2-ya-table.DataSource.Core 
  apiBaseUrl: location.origin //null
};
