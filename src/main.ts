import * as child_process from 'child_process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  try {
    const repo: string = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
    const target_branch: string = core.getInput('target_branch') || 'gh-pages';
    const keep_history: boolean = /true/i.test(core.getInput('keep_history'));
    const allow_empty_commit: boolean = /true/i.test(core.getInput('allow_empty_commit'));
    const build_dir: string = core.getInput('build_dir', {required: true});
    const commit_name: string = core.getInput('commit_name') || process.env['GITHUB_ACTOR'] || 'github-actions';
    const commit_email: string = core.getInput('commit_email') || `${commit_name}@users.noreply.github.com`;
    const commit_message: string = core.getInput('commit_message') || 'Deploy to GitHub pages';
    const fqdn: string = core.getInput('fqdn');

    if (!fs.existsSync(build_dir)) {
      core.setFailed('⛔️ Build dir does not exist');
      return;
    }

    if (fqdn) {
      core.info(`✍️ Writing ${fqdn} domain name to ${path.join(build_dir, 'CNAME')}`);
      fs.writeFileSync(path.join(build_dir, 'CNAME'), fqdn.trim());
    }

    core.info(`🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`);

    process.chdir(build_dir);
    await exec.exec('git', ['init']);
    await exec.exec('git', ['config', 'user.name', commit_name]);
    await exec.exec('git', ['config', 'user.email', commit_email]);

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

    let gitURL = String('https://');
    if (process.env['GITHUB_PAT']) {
      core.info(`✅ Use GITHUB_PAT`);
      gitURL = gitURL.concat(process.env['GITHUB_PAT']);
    } else if (process.env['GITHUB_TOKEN']) {
      core.info(`✅ Use GITHUB_TOKEN`);
      gitURL = gitURL.concat('x-access-token:', process.env['GITHUB_TOKEN']);
    } else {
      core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
      return;
    }

    let gitPushCmd: Array<string> = [];
    gitPushCmd.push('push', '--quiet');
    if (!keep_history) {
      core.info(`✅ Force push`);
      gitPushCmd.push('--force');
    }
    gitPushCmd.push(gitURL.concat('@github.com/', repo, '.git'), target_branch);
    await exec.exec('git', gitPushCmd);

    process.chdir(process.env['GITHUB_WORKSPACE'] || '.');
    core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
