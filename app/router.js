'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/:appid/upload', controller.files.upload);
  router.post('/:appid/:catalog/upload', controller.files.upload);
};
