
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','3e0'),
  
  routes: [
{
  path: '/',
  component: ComponentCreator('/','350'),
  exact: true,
},
{
  path: '/basic-usage',
  component: ComponentCreator('/basic-usage','ddc'),
  exact: true,
},
{
  path: '/component-props',
  component: ComponentCreator('/component-props','30a'),
  exact: true,
},
{
  path: '/component-ref-methods',
  component: ComponentCreator('/component-ref-methods','ef1'),
  exact: true,
},
{
  path: '/faq',
  component: ComponentCreator('/faq','142'),
  exact: true,
},
{
  path: '/install',
  component: ComponentCreator('/install','4a4'),
  exact: true,
},
{
  path: '/module-methods',
  component: ComponentCreator('/module-methods','666'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
