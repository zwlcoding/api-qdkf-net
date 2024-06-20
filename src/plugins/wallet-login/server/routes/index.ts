export default [
  {
    method: 'POST',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
      auth: false
    }
  },
];
