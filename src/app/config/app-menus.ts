var customer = [{
  'icon': 'fa fa-home',
  'title': 'Dashboard',
  'url': 'dashboard',
  'caret': 'false'
},
{
  'icon': 'fa fa-file',
  'title': 'Files',
  'url': '',
  'label': 'NEW',
  'caret': 'true',
  'submenu': [{
    'url': 'file/upload',
    'title': 'Upload',
    'highlight': 'true'
  },{
    'url': 'task/quick-request/list',
    'title': 'List quick request'
  },
  {
    'url': 'task/project-request/list',
    'title': 'List project request'
  }]
},
{
  'icon': 'fa fa-book',
  'title': 'Work',
  'url': '',
  'label': 'NEW',
  'caret': 'true',
  'submenu': [
    // {
    //   'url': 'review/work',
    //   'title': 'Review work',
    //   'highlight': 'true'
    // },
    {
      'url': 'completed/work',
      'title': 'Completed work',
      'highlight': 'true'
    }
  ]
},
{
    'icon': 'fa fa-usd',
    'title': 'Balance',
    'url': '',
    'caret': 'true',
    'label': 'NEW',
    'submenu': [{
      'url': 'balance/add-credit',
      'title': 'Add Credit'
    }]
  },
];


var admin = [{
}];

export {
  customer,
  admin
};