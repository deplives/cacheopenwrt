const core = require('@actions/core');
const github = require('@actions/github');
const execSync = require('child_process').execSync;

try {
    var paths = new Array();
    var keyString = 'openwrt-cache';
    const prefix = core.getInput('prefix');
    if (prefix != '') {
        process.chdir(prefix);
    }

    const toolchain = core.getInput('toolchain');
    if (toolchain == 'true') {
        stdout = execSync('git log --pretty=tformat:"%h" -n1 tools toolchain').toString().trim();
        keyString = keyString + '-' + stdout;
        paths.push('staging_dir/host*');
        paths.push('staging_dir/tool*');
        paths.push('build_dir/host*');
        paths.push('build_dir/tool*');
    }

    const ccache = core.getInput('ccache');
    if (ccache == 'true') {
        paths.push('.ccache');
    }

    const cache = require('@actions/cache');
    console.log("存储缓存 Key", keyString)
    const cacheId = cache.saveCache(paths, keyString)

} catch (error) {
    core.setFailed(error.message);
}