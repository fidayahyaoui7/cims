window.config = {
  routerBasename: '/',
  showStudyList: true,
  servers: {
    dicomWeb: [
      {
        name: 'DCM4CHEE',
        wadoUriRoot: 'https://pacs.example.com/wado',
        qidoRoot: 'https://pacs.example.com/dicomweb',
        wadoRoot: 'https://pacs.example.com/dicomweb',
        qidoSupportsIncludeField: true,
        imageRendering: 'wadouri',
        thumbnailRendering: 'wadouri',
        enableStudyLazyLoad: true,
      }
    ]
  }
};
