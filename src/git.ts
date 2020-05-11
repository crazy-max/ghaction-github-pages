import * as exec from './exec';

export const defaults = {
  targetBranch: 'gh-pages',
  committer: 'GitHub <noreply@github.com>',
  author: 'github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>',
  message: 'Deploy to GitHub pages'
};

const git = async (args: string[] = []): Promise<string> => {
  return await exec.exec(`git`, args, true).then(res => {
    if (res.stderr != '' && !res.success) {
      throw new Error(res.stderr);
    }
    return res.stdout.trim();
  });
};

export async function remoteBranchExists(remoteURL: string, branch: string): Promise<boolean> {
  return await git(['ls-remote', '--heads', remoteURL, branch]).then(output => {
    return output.trim().length > 0;
  });
}

export async function clone(remoteURL: string, branch: string, dest: string): Promise<void> {
  await git(['clone', '--quiet', '--branch', branch, '--depth', '1', remoteURL, dest]);
}

export async function init(dest: string): Promise<void> {
  await git(['init', dest]);
}

export async function checkout(branch: string): Promise<void> {
  await git(['checkout', '--orphan', branch]);
}

export async function isDirty(): Promise<boolean> {
  return await git(['status', '--short']).then(output => {
    return output.trim().length > 0;
  });
}

export async function hasChanges(): Promise<boolean> {
  return await git(['status', '--porcelain']).then(output => {
    return output.trim().length > 0;
  });
}

export async function setConfig(key: string, value: string): Promise<void> {
  await git(['config', key, value]);
}

export async function add(pattern: string): Promise<void> {
  await git(['add', '--all', pattern]);
}

export async function commit(allowEmptyCommit: boolean, author: string, message: string): Promise<void> {
  let args: Array<string> = [];
  args.push('commit');
  if (allowEmptyCommit) {
    args.push('--allow-empty');
  }
  if (author !== '') {
    args.push('--author', author);
  }
  args.push('--message', message);
  await git(args);
}

export async function showStat(count: number): Promise<string> {
  return await git(['show', `--stat-count=${count}`, 'HEAD']).then(output => {
    return output;
  });
}

export async function push(remoteURL: string, branch: string, force: boolean): Promise<void> {
  let args: Array<string> = [];
  args.push('push', '--quiet');
  if (force) {
    args.push('--force');
  }
  args.push(remoteURL, branch);
  await git(args);
}
