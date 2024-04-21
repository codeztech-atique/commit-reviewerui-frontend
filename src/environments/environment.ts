// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  websocketUrl: 'https://qftmcnc3i9.execute-api.us-west-1.amazonaws.com/production/@connections',
  websocketUrlClient: 'wss://qftmcnc3i9.execute-api.us-west-1.amazonaws.com/production',
  produrl: 'https://9rxczrthyh.execute-api.us-west-1.amazonaws.com/production',
  localurl: 'https://9rxczrthyh.execute-api.us-west-1.amazonaws.com/production',
  url : 'https://9rxczrthyh.execute-api.us-west-1.amazonaws.com/production',
  chargebee_site : 'analysts24x7-test',

  linkedinClientId: '77mmjfsz45aw22',
  linkedinLoginRedirectUri: 'https://dashboard.analysts24x7.com/',
  linkedinStateLogin: '8805116637',
  linkedinStateRegistration: '8805036597',
  linkedinRegisterRedirectUri: 'https://dashboard.analysts24x7.com/register/',
};
