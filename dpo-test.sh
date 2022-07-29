set -o errexit -o nounset -o pipefail

cd automation-scripts-using-headless-chrome
echo -e "USERNAME=${MEDIGY_USERNAME}\nPASSWORD=${MEDIGY_PASSWORD}\nLOGGED_NAME=${MEDIGY_LOGGED_NAME}" > .env
export DPO_SITE_ID=development2021
deno test -A --unstable --jobs=8  *.ts &> /tmp/puppeteer_devl_report.txt
