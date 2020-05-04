import * as child_process from 'child_process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {copySync} from 'fs-extra';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

async function run() {
  try {
    const repo: string = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
    const target_branch: string = core.getInput('target_branch') || 'gh-pages';
    const keep_history: boolean = /true/i.test(core.getInput('keep_history'));
    const allow_empty_commit: boolean = /true/i.test(core.getInput('allow_empty_commit'));
    const build_dir: string = core.getInput('build_dir', {required: true});
    const committer_name: string = core.getInput('committer_name') || process.env['GITHUB_ACTOR'] || 'github-actions';
    const committer_email: string = core.getInput('committer_email') || `${committer_name}@users.noreply.github.com`;
    const commit_message: string = core.getInput('commit_message') || 'Deploy to GitHub pages';
    const fqdn: string = core.getInput('fqdn');

    if (!fs.existsSync(build_dir)) {
      core.setFailed('⛔️ Build dir does not exist');
      return;
    }

    let remote_url = String('https://');
    if (process.env['GITHUB_PAT']) {
      core.info(`✅ Use GITHUB_PAT`);
      remote_url = remote_url.concat(process.env['GITHUB_PAT'].trim());
    } else if (process.env['GITHUB_TOKEN']) {
      core.info(`✅ Use GITHUB_TOKEN`);
      remote_url = remote_url.concat('x-access-token:', process.env['GITHUB_TOKEN'].trim());
    } else {
      core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
      return;
    }
    remote_url = remote_url.concat('@github.com/', repo, '.git');

    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'github-pages-'));
    const currentdir = path.resolve('.');
    process.chdir(tmpdir);

    const remote_branch_exists =
      child_process.execSync(`git ls-remote --heads ${remote_url} ${target_branch}`, {encoding: 'utf8'}).trim().length >
      0;
    if (keep_history && remote_branch_exists) {
      await exec.exec('git', ['clone', '--quiet', '--branch', target_branch, '--depth', '1', remote_url, '.']);
    } else {
      core.info(`🏃 Initializing local git repo`);
      await exec.exec('git', ['init', '.']);
      await exec.exec('git', ['checkout', '--orphan', target_branch]);
    }

    core.info(`🏃 Copying ${path.join(currentdir, build_dir)} contents to ${tmpdir}`);
    copySync(path.join(currentdir, build_dir), tmpdir);

    if (fqdn) {
      core.info(`✍️ Writing ${fqdn} domain name to ${path.join(tmpdir, 'CNAME')}`);
      fs.writeFileSync(path.join(tmpdir, 'CNAME'), fqdn.trim());
    }

    const dirty = child_process.execSync(`git status --short`, {encoding: 'utf8'}).trim().length > 0;
    if (keep_history && remote_branch_exists && !dirty) {
      core.info('⚠️ There are no changes to commit, stopping.');
      return;
    }

    core.info(`🔨 Configuring git committer to be ${committer_name} <${committer_email}>`);
    await exec.exec('git', ['config', 'user.name', committer_name]);
    await exec.exec('git', ['config', 'user.email', committer_email]);

    try {
      child_process.execSync('git status --porcelain').toString();
    } catch (err) {
      core.info('⚠️ Nothing to deploy');
      return;
    }

    await exec.exec('git', ['add', '--all', '.']);

    let gitCommitCmd: Array<string> = [];
    gitCommitCmd.push('commit');
    if (allow_empty_commit) {
      core.info(`✅ Allow empty commit`);
      gitCommitCmd.push('--allow-empty');
    }
    gitCommitCmd.push('-m', commit_message);
    await exec.exec('git', gitCommitCmd);

    await exec.exec('git', ['show', '--stat-count=10', 'HEAD']);

    let gitPushCmd: Array<string> = [];
    gitPushCmd.push('push', '--quiet');
    if (!keep_history) {
      core.info(`✅ Force push`);
      gitPushCmd.push('--force');
    }
    gitPushCmd.push(remote_url, target_branch);

    core.info(`🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`);
    await exec.exec('git', gitPushCmd);

    process.chdir(currentdir);
    core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
