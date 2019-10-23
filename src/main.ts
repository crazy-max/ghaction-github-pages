import * as child_process from 'child_process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

async function run() {
  try {
    const repo =
      core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
    const target_branch = core.getInput('target_branch') || 'gh-pages';
    const build_dir = core.getInput('build_dir', {required: true});
    const username =
      core.getInput('comitter_name') ||
      process.env['GITHUB_ACTOR'] ||
      'github-actions';
    const useremail =
      core.getInput('comitter_email') || `${username}@users.noreply.github.com`;
    const commitmessage =
      core.getInput('commit_message') || 'Deploy to GitHub pages';

    if (!fs.existsSync(build_dir)) {
      core.setFailed('⛔️ Build dir does not exist');
      return;
    }

    core.info(
      `🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`
    );

    process.chdir(build_dir);
    await exec.exec('git', ['init']);
    await exec.exec('git', ['config', 'user.name', username]);
    await exec.exec('git', ['config', 'user.email', useremail]);

    try {
      child_process.execSync('git status --porcelain').toString();
    } catch (err) {
      core.info('⚠️Nothing to deploy');
      return;
    }

    await exec.exec('git', ['add', '.']);
    await exec.exec('git', ['commit', '--allow-empty', '-m', commitmessage]);

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
