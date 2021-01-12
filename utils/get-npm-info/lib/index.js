'use strict';
const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null;
    }
    const registryUrl = registry || getDefaultRegistry();
    const npmInfoUrl = urlJoin(registryUrl, npmName);
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data;
        }
        return null;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

async function getNpmVersion(npmName, registry) {
    let data = await getNpmInfo(npmName, registry);
    if (data) {
        return Object.keys(data.versions);
    }
    return [];
}

function getSemverVersion(baseVersion, versions) {
    return versions.filter(version => semver.satisfies(version, `>=${baseVersion}`)).sort((a, b) => semver.gt(b, a) ? 1 : -1);
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersion(npmName, registry);
    let newVersion = await getSemverVersion(baseVersion, versions);
    if (newVersion && newVersion.length) {
        return newVersion[0];
    }
    return [];
}
module.exports = {
    getNpmInfo,
    getDefaultRegistry,
    getNpmVersion,
    getSemverVersion,
    getNpmSemverVersion
};

