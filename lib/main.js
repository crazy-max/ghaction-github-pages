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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
            const target_branch = core.getInput('target_branch') || 'gh-pages';
            const keep_history = /true/i.test(core.getInput('keep_history'));
            const allow_empty_commit = /true/i.test(core.getInput('allow_empty_commit'));
            const build_dir = core.getInput('build_dir', { required: true });
            const commit_name = core.getInput('commit_name') || process.env['GITHUB_ACTOR'] || 'github-actions';
            const commit_email = core.getInput('commit_email') || `${commit_name}@users.noreply.github.com`;
            const commit_message = core.getInput('commit_message') || 'Deploy to GitHub pages';
            const fqdn = core.getInput('fqdn');
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
            yield exec.exec('git', ['init']);
            yield exec.exec('git', ['config', 'user.name', commit_name]);
            yield exec.exec('git', ['config', 'user.email', commit_email]);
            try {
                child_process.execSync('git status --porcelain').toString();
            }
            catch (err) {
                core.info('⚠️ Nothing to deploy');
                return;
            }
            yield exec.exec('git', ['add', '.']);
            let gitCommitCmd = [];
            gitCommitCmd.push('commit');
            if (allow_empty_commit) {
                core.info(`✅ Allow empty commit`);
                gitCommitCmd.push('--allow-empty');
            }
            gitCommitCmd.push('-m', commit_message);
            yield exec.exec('git', gitCommitCmd);
            yield exec.exec('git', ['show', '--stat-count=10', 'HEAD']);
            let gitURL = String('https://');
            if (process.env['GITHUB_PAT']) {
                core.info(`✅ Use GITHUB_PAT`);
                gitURL = gitURL.concat(process.env['GITHUB_PAT']);
            }
            else if (process.env['GITHUB_TOKEN']) {
                core.info(`✅ Use GITHUB_TOKEN`);
                gitURL = gitURL.concat('x-access-token:', process.env['GITHUB_TOKEN']);
            }
            else {
                core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
                return;
            }
            let gitPushCmd = [];
            gitPushCmd.push('push', '--quiet');
            if (!keep_history) {
                core.info(`✅ Force push`);
                gitPushCmd.push('--force');
            }
            gitPushCmd.push(gitURL.concat('@github.com/', repo, '.git'), `${target_branch}:${target_branch}`);
            yield exec.exec('git', gitPushCmd);
            process.chdir(process.env['GITHUB_WORKSPACE'] || '.');
            core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
