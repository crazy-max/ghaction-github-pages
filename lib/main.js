"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = __importStar(require("child_process"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const fs_extra_1 = require("fs-extra");
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
            const target_branch = core.getInput('target_branch') || 'gh-pages';
            const keep_history = /true/i.test(core.getInput('keep_history'));
            const allow_empty_commit = /true/i.test(core.getInput('allow_empty_commit'));
            const build_dir = core.getInput('build_dir', { required: true });
            const committer_name = core.getInput('committer_name') || process.env['GITHUB_ACTOR'] || 'github-actions';
            const committer_email = core.getInput('committer_email') || `${committer_name}@users.noreply.github.com`;
            const commit_message = core.getInput('commit_message') || 'Deploy to GitHub pages';
            const fqdn = core.getInput('fqdn');
            if (!fs.existsSync(build_dir)) {
                core.setFailed('⛔️ Build dir does not exist');
                return;
            }
            let remote_url = String('https://');
            if (process.env['GITHUB_PAT']) {
                core.info(`✅ Use GITHUB_PAT`);
                remote_url = remote_url.concat(process.env['GITHUB_PAT'].trim());
            }
            else if (process.env['GITHUB_TOKEN']) {
                core.info(`✅ Use GITHUB_TOKEN`);
                remote_url = remote_url.concat('x-access-token:', process.env['GITHUB_TOKEN'].trim());
            }
            else {
                core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
                return;
            }
            remote_url = remote_url.concat('@github.com/', repo, '.git');
            const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'github-pages-'));
            const currentdir = path.resolve('.');
            process.chdir(tmpdir);
            const remote_branch_exists = child_process.execSync(`git ls-remote --heads ${remote_url} ${target_branch}`, { encoding: 'utf8' }).trim().length >
                0;
            if (keep_history && remote_branch_exists) {
                yield exec.exec('git', ['clone', '--quiet', '--branch', target_branch, '--depth', '1', remote_url, '.']);
            }
            else {
                core.info(`🏃 Initializing local git repo`);
                yield exec.exec('git', ['init', '.']);
                yield exec.exec('git', ['checkout', '--orphan', target_branch]);
            }
            core.info(`🏃 Copying ${path.join(currentdir, build_dir)} contents to ${tmpdir}`);
            fs_extra_1.copySync(path.join(currentdir, build_dir), tmpdir);
            if (fqdn) {
                core.info(`✍️ Writing ${fqdn} domain name to ${path.join(tmpdir, build_dir, 'CNAME')}`);
                fs.writeFileSync(path.join(tmpdir, build_dir, 'CNAME'), fqdn.trim());
            }
            core.info(`🔨 Configuring git committer to be ${committer_name} <${committer_email}>`);
            yield exec.exec('git', ['config', 'user.name', committer_name]);
            yield exec.exec('git', ['config', 'user.email', committer_email]);
            try {
                child_process.execSync('git status --porcelain').toString();
            }
            catch (err) {
                core.info('⚠️ Nothing to deploy');
                return;
            }
            yield exec.exec('git', ['add', '--all', '.']);
            let gitCommitCmd = [];
            gitCommitCmd.push('commit');
            if (allow_empty_commit) {
                core.info(`✅ Allow empty commit`);
                gitCommitCmd.push('--allow-empty');
            }
            gitCommitCmd.push('-m', commit_message);
            yield exec.exec('git', gitCommitCmd);
            yield exec.exec('git', ['show', '--stat-count=10', 'HEAD']);
            let gitPushCmd = [];
            gitPushCmd.push('push', '--quiet');
            if (!keep_history) {
                core.info(`✅ Force push`);
                gitPushCmd.push('--force');
            }
            gitPushCmd.push(remote_url, target_branch);
            core.info(`🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`);
            yield exec.exec('git', gitPushCmd);
            process.chdir(currentdir);
            core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
