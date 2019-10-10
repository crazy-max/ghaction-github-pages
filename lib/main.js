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
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo = core.getInput('repo') || process.env['GITHUB_REPOSITORY'] || '';
            const target_branch = core.getInput('target_branch') || 'gh-pages';
            const build_dir = core.getInput('build_dir', { required: true });
            const username = process.env['GITHUB_ACTOR'] || 'github-actions';
            if (!fs.existsSync(build_dir)) {
                core.setFailed('⛔️ Build dir does not exist');
                return;
            }
            core.info(`🏃 Deploying ${build_dir} directory to ${target_branch} branch on ${repo} repo`);
            process.chdir(build_dir);
            yield exec.exec('git', ['init']);
            yield exec.exec('git', ['config', 'user.name', username]);
            yield exec.exec('git', [
                'config',
                'user.email',
                `${username}@users.noreply.github.com`
            ]);
            try {
                child_process.execSync('git status --porcelain').toString();
            }
            catch (err) {
                core.info('⚠️Nothing to deploy');
                return;
            }
            yield exec.exec('git', ['add', '.']);
            yield exec.exec('git', [
                'commit',
                '--allow-empty',
                '-m',
                'Deploy to GitHub pages'
            ]);
            let gitURL = String('https://');
            if (process.env['GITHUB_PAT']) {
                gitURL = gitURL.concat(process.env['GITHUB_PAT']);
            }
            else if (process.env['GITHUB_TOKEN']) {
                gitURL = gitURL.concat('x-access-token:', process.env['GITHUB_TOKEN']);
            }
            else {
                core.setFailed('❌️ You have to provide a GITHUB_TOKEN or GITHUB_PAT');
                return;
            }
            yield exec.exec('git', [
                'push',
                '--force',
                '--quiet',
                gitURL.concat('@github.com/', repo, '.git'),
                `master:${target_branch}`
            ]);
            process.chdir(process.env['GITHUB_WORKSPACE'] || '.');
            core.info(`🎉 Content of ${build_dir} has been deployed to GitHub Pages.`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
