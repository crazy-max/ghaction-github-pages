import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

export async function copyDir(from: string, to: string): Promise<void> {
  core.debug(`copyDir ${from} to ${to}`);
  await fs.promises.mkdir(to, {recursive: true}).catch(err => {
    core.warning(err);
  });
  core.debug(`readdir ${from}`);
  await fs.promises.readdir(from).then(async (files: string[]) => {
    for (let fname of files) {
      core.debug(`# ${fname}`);
      core.debug(`stat ${path.join(from, fname)}`);
      const stat = await fs.promises.lstat(path.join(from, fname));
      if (stat.isFile()) {
        core.debug(`stat.isFile`);
        await fs.promises
          .copyFile(path.join(from, fname), path.join(to, fname))
          .then(_ => {
            core.info(
              `${path.join(from, fname).replace(process.env.GITHUB_WORKSPACE || '', '.')} => ${path.join(to, fname)}`
            );
          })
          .catch(err => {
            core.warning(err);
          });
      } else if (stat.isSymbolicLink()) {
        core.debug(`stat.isSymbolicLink`);
        await copySymlink(path.join(from, fname), path.join(to, fname));
      } else if (stat.isDirectory()) {
        core.debug(`stat.isDirectory`);
        await copyDir(path.join(from, fname), path.join(to, fname));
      }
    }
  });
}

async function copySymlink(from: string, to: string): Promise<void> {
  core.debug(`copySymlink ${from} to ${to}`);
  const llink = await fs.promises.readlink(from).catch(err => {
    if (err) {
      core.warning(err);
    }
  });
  core.debug(`llink ${llink}`);
  if (!llink) {
    return;
  }
  const lsrc = path.resolve(llink);
  core.debug(`lsrc ${lsrc}`);
  const lstat = await fs.promises.lstat(llink).catch(err => {
    if (err) {
      core.warning(`Cannot stat symlink ${llink} for ${from.replace(process.env.GITHUB_WORKSPACE || '', '.')}: ${err}`);
    }
  });
  if (!lstat) {
    return;
  }
  if (lstat.isFile()) {
    core.debug(`lstat.isFile`);
    await fs.promises
      .copyFile(lsrc, to)
      .then(_ => {
        core.info(`${lsrc.replace(process.env.GITHUB_WORKSPACE || '', '.')} => ${to}`);
      })
      .catch(err => {
        core.warning(err);
      });
  } else if (lstat.isSymbolicLink()) {
    core.debug(`lstat.isSymbolicLink`);
    await copySymlink(lsrc, to);
  } else if (lstat.isDirectory()) {
    core.debug(`lstat.isDirectory`);
    await copyDir(lsrc, to);
  }
}
