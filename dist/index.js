'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

console.log(process.env.BITCOINCOID_API_KEY);
console.log(process.env.BITCOINCOID_SECRET);
