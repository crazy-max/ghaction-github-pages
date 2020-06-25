import addressparser from 'addressparser';
import {copySync} from 'fs-extra';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';
import * as git from './git';

async function run() {
  try {
    const repo: string = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
    const targetBranch: string = core.getInput('target_branch') || git.defaults.targetBranch;
    const keepHistory: boolean = /true/i.test(core.getInput('keep_history'));
    const allowEmptyCommit: boolean = /true/i.test(core.getInput('allow_empty_commit'));
    const buildDir: string = core.getInput('build_dir', {required: true});
    const committer: string = core.getInput('committer') || git.defaults.committer;
    const author: string = core.getInput('author') || git.defaults.author;
    const commitMessage: string = core.getInput('commit_message') || git.defaults.message;
    const fqdn: string = core.getInput('fqdn');
    const nojekyll: boolean = /false/i.test(core.getInput('jekyll'));

    if (!fs.existsSync(buildDir)) {
      core.setFailed('Build dir does not exist');
      return;
    }

    let remoteURL = String('https://');
    if (process.env['GH_PAT']) {
      core.info(`✅ Use GH_PAT`);
      remoteURL = remoteURL.concat(process.env['GH_PAT'].trim());
    } else if (process.env['GITHUB_TOKEN']) {
      core.info(`✅ Use GITHUB_TOKEN`);
      remoteURL = remoteURL.concat('x-access-token:', process.env['GITHUB_TOKEN'].trim());
    } else {
      core.setFailed('You have to provide a GITHUB_TOKEN or GH_PAT');
      return;
    }
    remoteURL = remoteURL.concat('@github.com/', repo, '.git');
    core.debug(`remoteURL=${remoteURL}`);

    const remoteBranchExists: boolean = await git.remoteBranchExists(remoteURL, targetBranch);
    core.debug(`remoteBranchExists=${remoteBranchExists}`);
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'github-pages-'));
    core.debug(`tmpdir=${tmpdir}`);
    const currentdir = path.resolve('.');
    core.debug(`currentdir=${currentdir}`);

    process.chdir(tmpdir);

    if (keepHistory && remoteBranchExists) {
      core.info('🌀 Cloning ${repo}');
      await git.clone(remoteURL, targetBranch, '.');
    } else {
      core.info(`✨ Initializing local git repo`);
      await git.init('.');
      await git.checkout(targetBranch);
    }

    core.info(`🏃 Copying ${path.join(currentdir, buildDir)} contents to ${tmpdir}`);
    await copySync(path.join(currentdir, buildDir), tmpdir);

    if (fqdn) {
      core.info(`✍️ Writing ${fqdn} domain name to ${path.join(tmpdir, 'CNAME')}`);
      await fs.writeFileSync(path.join(tmpdir, 'CNAME'), fqdn.trim());
    }

    if (nojekyll) {
      core.info(`🚫 Disabling Jekyll support via ${path.join(tmpdir, '.nojekyll')}`);
      await fs.writeFileSync(path.join(tmpdir, '.nojekyll'), '');
    }

    const isDirty: boolean = await git.isDirty();
    core.debug(`isDirty=${isDirty}`);
    if (keepHistory && remoteBranchExists && !isDirty) {
      core.info('⚠️ No changes to commit');
      return;
    }

    const committerPrs: addressparser.Address = addressparser(committer)[0];
    core.info(`🔨 Configuring git committer as ${committerPrs.name} <${committerPrs.address}>`);
    await git.setConfig('user.name', committerPrs.name);
    await git.setConfig('user.email', committerPrs.address);

    if (!(await git.hasChanges())) {
      core.info('⚠️ Nothing to deploy');
      return;
    }

    core.info(`📐 Updating index of working tree`);
    await git.add('.');

    core.info(`📦 Committing changes`);
    if (allowEmptyCommit) {
      core.info(`✅ Allow empty commit`);
    }
    const authorPrs: addressparser.Address = addressparser(author)[0];
    core.info(`🔨 Configuring git author as ${authorPrs.name} <${authorPrs.address}>`);
    await git.commit(allowEmptyCommit, `${authorPrs.name} <${authorPrs.address}>`, commitMessage);
    await git.showStat(10).then(output => {
      core.info(output);
    });

    core.info(`🏃 Pushing ${buildDir} directory to ${targetBranch} branch on ${repo} repo`);
    if (!keepHistory) {
      core.info(`✅ Force push`);
    }
    await git.push(remoteURL, targetBranch, !keepHistory);

    process.chdir(currentdir);
    core.info(`🎉 Content of ${buildDir} has been deployed to GitHub Pages`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
