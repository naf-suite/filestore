'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const { sep, extname } = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const assert = require('assert');

class FilesController extends Controller {

  async upload() {
    const { ctx, app } = this;
    const { appid, catalog } = ctx.params;
    assert(appid);
    const stream = await ctx.getFileStream();
    ctx.logger.debug(stream);

    const rootPath = `${app.config.cdn.repos_root_path}`;
    const rootUrl = `${app.config.cdn.repos_root_url}`;
    const dirs = [ appid ];
    if (catalog) {
      dirs.push(catalog);
    }
    const saved = await this.saveFile(rootPath, dirs, stream);
    const uri = `${rootUrl}/${dirs.join('/')}/${saved.fileName}`;
    ctx.body = { errcode: 0, errmsg: 'ok', id: saved.id, name: saved.fileName, uri };
  }

  async saveFile(rootPath, dirs, stream) {
    const ctx = this.ctx;
    const ext = extname(stream.filename).toLowerCase();
    const name = moment().format('YYYYMMDDHHmmss');
    // TODO: 检查根路径是否存在，不存在则创建
    ctx.logger.debug('rootPath: ', rootPath);
    if (!fs.existsSync(rootPath)) {
      ctx.logger.debug('create dir: ', rootPath);
      fs.mkdirSync(rootPath);
    }
    // TODO: 检查分级目录是否存在，不存在则创建
    for (let i = 0; i < dirs.length; i++) {
      const p = `${rootPath}${sep}${dirs.slice(0, i + 1).join(sep)}`;
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
      }
    }

    const filePath = `${rootPath}${sep}${dirs.join(sep)}${sep}`;
    const fileName = `${name}${ext}`;
    const writeStream = fs.createWriteStream(filePath + fileName);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    return { filePath, fileName, id: name };
  }

}

module.exports = FilesController;
