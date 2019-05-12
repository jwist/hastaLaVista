"use strict";onmessage=function(b){var c=b.data.message;b.data.message=JSON.parse(c),postMessage(b.data)};
