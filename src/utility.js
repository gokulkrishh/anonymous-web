//Source: https://kmturley.blogspot.in/2013/12/detect-device-browser-and-version-using.html

var osArr = [
  { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
  { name: 'Windows', value: 'Win', version: 'NT' },
  { name: 'iPhone', value: 'iPhone', version: 'OS' },
  { name: 'iPad', value: 'iPad', version: 'OS' },
  { name: 'Android', value: 'Android', version: 'Android' },
  { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
  { name: 'Macintosh', value: 'Mac', version: 'OS X' },
  { name: 'Linux', value: 'Linux', version: 'rv' }
];

var browserArr = [
  { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
  { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
  { name: 'Safari', value: 'Safari', version: 'Version' },
  { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
  { name: 'Opera', value: 'Opera', version: 'Opera' },
  { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
];

var headerArr = [
  navigator.platform,
  navigator.userAgent,
  navigator.appVersion,
  navigator.vendor,
  window.opera
];

/*eslint no-unused-vars: 0*/ 
function matchItem(string, data) {
  var i = 0,
    j = 0,
    html = '',
    regex,
    regexv,
    match,
    matches,
    version;

  for (i = 0; i < data.length; i += 1) {
    regex = new RegExp(data[i].value, 'i');
    match = regex.test(string);
    if (match) {
      regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
      matches = string.match(regexv);
      version = '';
      if (matches) { if (matches[1]) { matches = matches[1]; } }
      if (matches) {
        matches = matches.split(/[._]+/);
        for (j = 0; j < matches.length; j += 1) {
          if (j === 0) {
            version += matches[j] + '.';
          }
          else {
            version += matches[j];
          }
        }
      }
      else {
        version = '0';
      }
      return {
        name: data[i].name,
        version: parseFloat(version)
      };
    }
  }
  return { name: 'unknown', version: 0 };
}

const agent = headerArr.join(' ');
const os = matchItem(agent, osArr);
const browser = matchItem(agent, browserArr);

export { agent, browser, os };
