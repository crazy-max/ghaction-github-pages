import * as child_process from 'child_process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

async function run() {
  try {
    const repo = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
    const target_branch = core.getInput('target_branch') || 'gh-pages';
    const build_dir = core.getInput('build_dir', {required: true});
    const comitter_name = core.getInput('comitter_name') || process.env['GITHUB_ACTOR'] || 'github-actions';
    const comitter_email = core.getInput('comitter_email') || `${comitter_name}@users.noreply.github.com`;
    const commit_message = core.getInput('commit_message') || 'Deploy to GitHub pages';

    if (!fs.existsSync(build_dir)) {
      core.setFailed('⛔️ Build dir does not exist');
      return;
    }

    core.info(`🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`);

    process.chdir(build_dir);
    await exec.exec('git', ['init']);
    await exec.exec('git', ['config', 'user.name', comitter_name]);
    await exec.exec('git', ['config', 'user.email', comitter_email]);

    try {
      child_process.execSync('git status --porcelain').toString();
    } catch (err) {
      core.info('⚠️Nothing to deploy');
      return;
    }

    await exec.exec('git', ['add', '.']);
    await exec.exec('git', ['commit', '--allow-empty', '-m', commit_message]);

    let gitURL = String('https://');
    if (process.env['GITHUB_PAT']) {
      gitURL = gitURL.concat(process.env['GITHUB_PAT']);
    } else if (process.env['GITHUB_TOKEN']) {
      gitURL = gitURL.concat('x-access-token:', process.env['GITHUB_TOKEN']);
    } else {
      core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
      return;
    }
    await exec.exec('git', [
      'push',
      '--force',
      '--quiet',
      gitURL.concat('@github.com/', repo, '.git'),
      `master:${target_branch}`
    ]);

    process.chdir(process.env['GITHUB_WORKSPACE'] || '.');
    core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
