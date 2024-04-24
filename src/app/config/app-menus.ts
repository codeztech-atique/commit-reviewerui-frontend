var customer = [{
  'icon': 'fa fa-home',
  'title': 'Dashboard',
  'url': 'dashboard',
  'caret': 'false'
},
{
  'icon': 'fas fa-users',
  'title': 'Accounts',
  'url': '',
  'label': 'NEW',
  'caret': 'true',
  'submenu': [{
    'url': 'account/add',
    'title': 'Add',
    'highlight': 'true'
  },{
    'url': 'commit/list',
    'title': 'List commits'
  }]
}
];


var admin = [{
}];

export {
  customer,
  admin
};