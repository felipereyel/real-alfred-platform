const PORT = process.env.PORT || 3000;

const BASE_URL = "https://psarips.uk/tv-show/";
const DOWNLOAD_PREFIX = 'https://get-to.link/';
const PSA_TAG = '.HEVC-PSA';

const FINDER_1 = '<div class="sp-head" title="Expand">\n';
const FINDER_2 = '\n</div>';
const FINDER = RegExp(FINDER_1 + ".*" + FINDER_2, "g");

const SEASON_VALIDATOR = /S[0-9]{2}/g;
const EPISODE_VALIDATOR = /E[0-9]{2}/g;

const pretify_number = (n) => n > 9 ? `${n}` : `0${n}`;
const SEASON_KEYS = [...Array(10).keys()].map(s => `S${pretify_number(s+1)}`);
const EPISODE_KEYS = [...Array(25).keys()].map(e => `E${pretify_number(e+1)}`);

exports.PORT = PORT;

exports.BASE_URL = BASE_URL;
exports.DOWNLOAD_PREFIX = DOWNLOAD_PREFIX;
exports.PSA_TAG = PSA_TAG;

exports.FINDER_1 = FINDER_1;
exports.FINDER_2 = FINDER_2;
exports.FINDER = FINDER;

exports.SEASON_KEYS = SEASON_KEYS;
exports.EPISODE_KEYS = EPISODE_KEYS;

exports.SEASON_VALIDATOR = SEASON_VALIDATOR;
exports.EPISODE_VALIDATOR = EPISODE_VALIDATOR;