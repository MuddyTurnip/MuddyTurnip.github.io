var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var RECYCLED_NODE = 1;
var LAZY_NODE = 2;
var TEXT_NODE = 3;
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var map = EMPTY_ARR.map;
var isArray = Array.isArray;
var defer = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout;
var createClass = function(obj) {
  var out = "";
  if (typeof obj === "string") return obj;
  if (isArray(obj) && obj.length > 0) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = createClass(obj[k])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) {
        out += (out && " ") + k;
      }
    }
  }
  return out;
};
var merge = function(a, b) {
  var out = {};
  for (var k in a) out[k] = a[k];
  for (var k in b) out[k] = b[k];
  return out;
};
var batch = function(list) {
  return list.reduce(function(out, item) {
    return out.concat(
      !item || item === true ? 0 : typeof item[0] === "function" ? [item] : batch(item)
    );
  }, EMPTY_ARR);
};
var isSameAction = function(a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function";
};
var shouldRestart = function(a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true;
      b[k] = a[k];
    }
  }
};
var patchSubs = function(oldSubs, newSubs, dispatch) {
  for (var i = 0, oldSub, newSub, subs = []; i < oldSubs.length || i < newSubs.length; i++) {
    oldSub = oldSubs[i];
    newSub = newSubs[i];
    subs.push(
      newSub ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1]) ? [
        newSub[0],
        newSub[1],
        newSub[0](dispatch, newSub[1]),
        oldSub && oldSub[2]()
      ] : oldSub : oldSub && oldSub[2]()
    );
  }
  return subs;
};
var patchProperty = function(node, key, oldValue, newValue, listener, isSvg) {
  if (key === "key") ;
  else if (key === "style") {
    for (var k in merge(oldValue, newValue)) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k];
      if (k[0] === "-") {
        node[key].setProperty(k, oldValue);
      } else {
        node[key][k] = oldValue;
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (!((node.actions || (node.actions = {}))[key = key.slice(2).toLowerCase()] = newValue)) {
      node.removeEventListener(key, listener);
    } else if (!oldValue) {
      node.addEventListener(key, listener);
    }
  } else if (!isSvg && key !== "list" && key in node) {
    node[key] = newValue == null || newValue == "undefined" ? "" : newValue;
  } else if (newValue == null || newValue === false || key === "class" && !(newValue = createClass(newValue))) {
    node.removeAttribute(key);
  } else {
    node.setAttribute(key, newValue);
  }
};
var createNode = function(vdom, listener, isSvg) {
  var ns = "http://www.w3.org/2000/svg";
  var props = vdom.props;
  var node = vdom.type === TEXT_NODE ? document.createTextNode(vdom.name) : (isSvg = isSvg || vdom.name === "svg") ? document.createElementNS(ns, vdom.name, { is: props.is }) : document.createElement(vdom.name, { is: props.is });
  for (var k in props) {
    patchProperty(node, k, null, props[k], listener, isSvg);
  }
  for (var i = 0, len = vdom.children.length; i < len; i++) {
    node.appendChild(
      createNode(
        vdom.children[i] = getVNode(vdom.children[i]),
        listener,
        isSvg
      )
    );
  }
  return vdom.node = node;
};
var getKey = function(vdom) {
  return vdom == null ? null : vdom.key;
};
var patch = function(parent, node, oldVNode, newVNode, listener, isSvg) {
  if (oldVNode === newVNode) ;
  else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
    node = parent.insertBefore(
      createNode(newVNode = getVNode(newVNode), listener, isSvg),
      node
    );
    if (oldVNode != null) {
      parent.removeChild(oldVNode.node);
    }
  } else {
    var tmpVKid;
    var oldVKid;
    var oldKey;
    var newKey;
    var oldVProps = oldVNode.props;
    var newVProps = newVNode.props;
    var oldVKids = oldVNode.children;
    var newVKids = newVNode.children;
    var oldHead = 0;
    var newHead = 0;
    var oldTail = oldVKids.length - 1;
    var newTail = newVKids.length - 1;
    isSvg = isSvg || newVNode.name === "svg";
    for (var i in merge(oldVProps, newVProps)) {
      if ((i === "value" || i === "selected" || i === "checked" ? node[i] : oldVProps[i]) !== newVProps[i]) {
        patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg);
      }
    }
    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
        break;
      }
      patch(
        node,
        oldVKids[oldHead].node,
        oldVKids[oldHead],
        newVKids[newHead] = getVNode(
          newVKids[newHead++],
          oldVKids[oldHead++]
        ),
        listener,
        isSvg
      );
    }
    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
        break;
      }
      patch(
        node,
        oldVKids[oldTail].node,
        oldVKids[oldTail],
        newVKids[newTail] = getVNode(
          newVKids[newTail--],
          oldVKids[oldTail--]
        ),
        listener,
        isSvg
      );
    }
    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(
          createNode(
            newVKids[newHead] = getVNode(newVKids[newHead++]),
            listener,
            isSvg
          ),
          (oldVKid = oldVKids[oldHead]) && oldVKid.node
        );
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node);
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }
      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(
          newVKids[newHead] = getVNode(newVKids[newHead], oldVKid)
        );
        if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node);
          }
          oldHead++;
          continue;
        }
        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patch(
              node,
              oldVKid && oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            );
            newHead++;
          }
          oldHead++;
        } else {
          if (oldKey === newKey) {
            patch(
              node,
              oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            );
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patch(
                node,
                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                tmpVKid,
                newVKids[newHead],
                listener,
                isSvg
              );
              newKeyed[newKey] = true;
            } else {
              patch(
                node,
                oldVKid && oldVKid.node,
                null,
                newVKids[newHead],
                listener,
                isSvg
              );
            }
          }
          newHead++;
        }
      }
      while (oldHead <= oldTail) {
        if (getKey(oldVKid = oldVKids[oldHead++]) == null) {
          node.removeChild(oldVKid.node);
        }
      }
      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node);
        }
      }
    }
  }
  return newVNode.node = node;
};
var propsChanged = function(a, b) {
  for (var k in a) if (a[k] !== b[k]) return true;
  for (var k in b) if (a[k] !== b[k]) return true;
};
var getTextVNode = function(node) {
  return typeof node === "object" ? node : createTextVNode(node);
};
var getVNode = function(newVNode, oldVNode) {
  return newVNode.type === LAZY_NODE ? ((!oldVNode || !oldVNode.lazy || propsChanged(oldVNode.lazy, newVNode.lazy)) && ((oldVNode = getTextVNode(newVNode.lazy.view(newVNode.lazy))).lazy = newVNode.lazy), oldVNode) : newVNode;
};
var createVNode = function(name, props, children, node, key, type) {
  return {
    name,
    props,
    children,
    node,
    type,
    key
  };
};
var createTextVNode = function(value, node) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, void 0, TEXT_NODE);
};
var recycleNode = function(node) {
  return node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(
    node.nodeName.toLowerCase(),
    EMPTY_OBJ,
    map.call(node.childNodes, recycleNode),
    node,
    void 0,
    RECYCLED_NODE
  );
};
var h = function(name, props) {
  for (var vdom, rest = [], children = [], i = arguments.length; i-- > 2; ) {
    rest.push(arguments[i]);
  }
  while (rest.length > 0) {
    if (isArray(vdom = rest.pop())) {
      for (var i = vdom.length; i-- > 0; ) {
        rest.push(vdom[i]);
      }
    } else if (vdom === false || vdom === true || vdom == null) ;
    else {
      children.push(getTextVNode(vdom));
    }
  }
  props = props || EMPTY_OBJ;
  return typeof name === "function" ? name(props, children) : createVNode(name, props, children, void 0, props.key);
};
var app = function(props) {
  var state = {};
  var lock = false;
  var view = props.view;
  var node = props.node;
  var vdom = node && recycleNode(node);
  var subscriptions = props.subscriptions;
  var subs = [];
  var onEnd = props.onEnd;
  var listener = function(event) {
    dispatch(this.actions[event.type], event);
  };
  var setState = function(newState) {
    if (state !== newState) {
      state = newState;
      if (subscriptions) {
        subs = patchSubs(subs, batch([subscriptions(state)]), dispatch);
      }
      if (view && !lock) defer(render, lock = true);
    }
    return state;
  };
  var dispatch = (props.middleware || function(obj) {
    return obj;
  })(function(action, props2) {
    return typeof action === "function" ? dispatch(action(state, props2)) : isArray(action) ? typeof action[0] === "function" || isArray(action[0]) ? dispatch(
      action[0],
      typeof action[1] === "function" ? action[1](props2) : action[1]
    ) : (batch(action.slice(1)).map(function(fx) {
      fx && fx[0](dispatch, fx[1]);
    }, setState(action[0])), state) : setState(action);
  });
  var render = function() {
    lock = false;
    node = patch(
      node.parentNode,
      node,
      vdom,
      vdom = getTextVNode(view(state)),
      listener
    );
    onEnd();
  };
  dispatch(props.init);
};
var timeFx = function(fx) {
  return function(action, props) {
    return [
      fx,
      {
        action,
        delay: props.delay
      }
    ];
  };
};
var interval = timeFx(
  function(dispatch, props) {
    var id = setInterval(
      function() {
        dispatch(
          props.action,
          Date.now()
        );
      },
      props.delay
    );
    return function() {
      clearInterval(id);
    };
  }
);
const httpEffect = (dispatch, props) => {
  if (!props) {
    return;
  }
  const output = {
    ok: false,
    url: props.url,
    authenticationFail: false,
    parseType: props.parseType ?? "json"
  };
  http(
    dispatch,
    props,
    output
  );
};
const http = (dispatch, props, output, nextDelegate = null) => {
  fetch(
    props.url,
    props.options
  ).then(function(response) {
    if (response) {
      output.ok = response.ok === true;
      output.status = response.status;
      output.type = response.type;
      output.redirected = response.redirected;
      if (response.headers) {
        output.callID = response.headers.get("CallID");
        output.contentType = response.headers.get("content-type");
        if (output.contentType && output.contentType.indexOf("application/json") !== -1) {
          output.parseType = "json";
        }
      }
      if (response.status === 401) {
        output.authenticationFail = true;
        dispatch(
          props.onAuthenticationFailAction,
          output
        );
        return;
      }
    } else {
      output.responseNull = true;
    }
    return response;
  }).then(function(response) {
    try {
      return response.text();
    } catch (error) {
      output.error += `Error thrown with response.text()
`;
    }
  }).then(function(result) {
    output.textData = result;
    if (result && output.parseType === "json") {
      try {
        output.jsonData = JSON.parse(result);
      } catch (err) {
        output.error += `Error thrown parsing response.text() as json
`;
      }
    }
    if (!output.ok) {
      throw result;
    }
    dispatch(
      props.action,
      output
    );
  }).then(function() {
    if (nextDelegate) {
      return nextDelegate.delegate(
        nextDelegate.dispatch,
        nextDelegate.block,
        nextDelegate.nextHttpCall,
        nextDelegate.index
      );
    }
  }).catch(function(error) {
    output.error += error;
    dispatch(
      props.error,
      output
    );
  });
};
const gHttp = (props) => {
  return [
    httpEffect,
    props
  ];
};
const Keys = {
  startUrl: "startUrl"
};
class HttpEffect {
  constructor(name, url, actionDelegate) {
    __publicField(this, "name");
    __publicField(this, "url");
    __publicField(this, "actionDelegate");
    this.name = name;
    this.url = url;
    this.actionDelegate = actionDelegate;
  }
}
const gUtilities = {
  roundUpToNearestTen: (value) => {
    const floor = Math.floor(value / 10);
    return (floor + 1) * 10;
  },
  roundDownToNearestTen: (value) => {
    const floor = Math.floor(value / 10);
    return floor * 10;
  },
  convertMmToFeetInches: (mm) => {
    const inches = mm * 0.03937;
    return gUtilities.convertInchesToFeetInches(inches);
  },
  getDirectory: (filePath) => {
    var matches = filePath.match(/(.*)[\/\\]/);
    if (matches && matches.length > 0) {
      return matches[1];
    }
    return "";
  },
  countCharacter: (input, character) => {
    let length = input.length;
    let count = 0;
    for (let i = 0; i < length; i++) {
      if (input[i] === character) {
        count++;
      }
    }
    return count;
  },
  convertInchesToFeetInches: (inches) => {
    const feet = Math.floor(inches / 12);
    const inchesReamining = inches % 12;
    const inchesReaminingRounded = Math.round(inchesReamining * 10) / 10;
    let result = "";
    if (feet > 0) {
      result = `${feet}' `;
    }
    if (inchesReaminingRounded > 0) {
      result = `${result}${inchesReaminingRounded}"`;
    }
    return result;
  },
  isNullOrWhiteSpace: (input) => {
    if (input === null || input === void 0) {
      return true;
    }
    input = `${input}`;
    return input.match(/^\s*$/) !== null;
  },
  checkArraysEqual: (a, b) => {
    if (a === b) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    const x = [...a];
    const y = [...b];
    x.sort();
    y.sort();
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  },
  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  isNumeric: (input) => {
    if (gUtilities.isNullOrWhiteSpace(input) === true) {
      return false;
    }
    return !isNaN(input);
  },
  isNegativeNumeric: (input) => {
    if (!gUtilities.isNumeric(input)) {
      return false;
    }
    return +input < 0;
  },
  hasDuplicates: (input) => {
    if (new Set(input).size !== input.length) {
      return true;
    }
    return false;
  },
  extend: (array1, array2) => {
    array2.forEach((item) => {
      array1.push(item);
    });
  },
  prettyPrintJsonFromString: (input) => {
    if (!input) {
      return "";
    }
    return gUtilities.prettyPrintJsonFromObject(JSON.parse(input));
  },
  prettyPrintJsonFromObject: (input) => {
    if (!input) {
      return "";
    }
    return JSON.stringify(
      input,
      null,
      4
      // indented 4 spaces
    );
  },
  isPositiveNumeric: (input) => {
    if (!gUtilities.isNumeric(input)) {
      return false;
    }
    return Number(input) >= 0;
  },
  getTime: () => {
    const now = new Date(Date.now());
    const time = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}::${now.getMilliseconds().toString().padStart(3, "0")}:`;
    return time;
  },
  splitByNewLine: (input) => {
    if (gUtilities.isNullOrWhiteSpace(input) === true) {
      return [];
    }
    const results = input.split(/[\r\n]+/);
    const cleaned = [];
    results.forEach((value) => {
      if (!gUtilities.isNullOrWhiteSpace(value)) {
        cleaned.push(value.trim());
      }
    });
    return cleaned;
  },
  splitByPipe: (input) => {
    if (gUtilities.isNullOrWhiteSpace(input) === true) {
      return [];
    }
    const results = input.split("|");
    const cleaned = [];
    results.forEach((value) => {
      if (!gUtilities.isNullOrWhiteSpace(value)) {
        cleaned.push(value.trim());
      }
    });
    return cleaned;
  },
  splitByNewLineAndOrder: (input) => {
    return gUtilities.splitByNewLine(input).sort();
  },
  joinByNewLine: (input) => {
    if (!input || input.length === 0) {
      return "";
    }
    return input.join("\n");
  },
  removeAllChildren: (parent) => {
    if (parent !== null) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
  },
  isOdd: (x) => {
    return x % 2 === 1;
  },
  shortPrintText: (input, maxLength = 100) => {
    if (gUtilities.isNullOrWhiteSpace(input) === true) {
      return "";
    }
    const firstNewLineIndex = gUtilities.getFirstNewLineIndex(input);
    if (firstNewLineIndex > 0 && firstNewLineIndex <= maxLength) {
      const output2 = input.substr(0, firstNewLineIndex - 1);
      return gUtilities.trimAndAddEllipsis(output2);
    }
    if (input.length <= maxLength) {
      return input;
    }
    const output = input.substr(0, maxLength);
    return gUtilities.trimAndAddEllipsis(output);
  },
  trimAndAddEllipsis: (input) => {
    let output = input.trim();
    let punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
    let spaceRegex = /\W+/g;
    let lastCharacter = output[output.length - 1];
    let lastCharacterIsPunctuation = punctuationRegex.test(lastCharacter) || spaceRegex.test(lastCharacter);
    while (lastCharacterIsPunctuation === true) {
      output = output.substr(0, output.length - 1);
      lastCharacter = output[output.length - 1];
      lastCharacterIsPunctuation = punctuationRegex.test(lastCharacter) || spaceRegex.test(lastCharacter);
    }
    return `${output}...`;
  },
  getFirstNewLineIndex: (input) => {
    let character;
    for (let i = 0; i < input.length; i++) {
      character = input[i];
      if (character === "\n" || character === "\r") {
        return i;
      }
    }
    return -1;
  },
  upperCaseFirstLetter: (input) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  },
  generateGuid: (useHypens = false) => {
    let d = (/* @__PURE__ */ new Date()).getTime();
    let d2 = performance && performance.now && performance.now() * 1e3 || 0;
    let pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    if (!useHypens) {
      pattern = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";
    }
    const guid = pattern.replace(
      /[xy]/g,
      function(c) {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : r & 3 | 8).toString(16);
      }
    );
    return guid;
  },
  checkIfChrome: () => {
    let tsWindow = window;
    let isChromium = tsWindow.chrome;
    let winNav = window.navigator;
    let vendorName = winNav.vendor;
    let isOpera = typeof tsWindow.opr !== "undefined";
    let isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    let isIOSChrome = winNav.userAgent.match("CriOS");
    if (isIOSChrome) {
      return true;
    } else if (isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && isOpera === false && isIEedge === false) {
      return true;
    }
    return false;
  }
};
const gStateCode = {
  getFreshKeyInt: (state) => {
    const nextKey = ++state.nextKey;
    return nextKey;
  },
  getFreshKey: (state) => {
    return `${gStateCode.getFreshKeyInt(state)}`;
  },
  getGuidKey: () => {
    return gUtilities.generateGuid();
  },
  cloneState: (state) => {
    let newState = { ...state };
    return newState;
  },
  // AddReLoadDataEffect: (
  //     state: IState,
  //     name: string,
  //     url: string,
  //     actionDelegate: (state: IState, response: any) => IStateAnyArray): void => {
  //     const effect: IHttpEffect | undefined = state
  //         .repeatEffects
  //         .reLoadGetHttp
  //         .find((effect: IHttpEffect) => {
  //             return effect.name === name;
  //         });
  //     if (effect) { // already added.
  //         return;
  //     }
  //     const httpEffect: IHttpEffect = new HttpEffect(
  //         name,
  //         url,
  //         actionDelegate
  //     );
  //     state.repeatEffects.reLoadGetHttp.push(httpEffect);
  // },
  AddReLoadDataEffectImmediate: (state, name, url, actionDelegate) => {
    const effect = state.repeatEffects.reLoadGetHttpImmediate.find((effect2) => {
      return effect2.name === name;
    });
    if (effect) {
      return;
    }
    const httpEffect2 = new HttpEffect(
      name,
      url,
      actionDelegate
    );
    state.repeatEffects.reLoadGetHttpImmediate.push(httpEffect2);
  },
  AddRunActionImmediate: (state, actionDelegate) => {
    state.repeatEffects.runActionImmediate.push(actionDelegate);
  }
};
const gAuthenticationCode = {
  clearAuthentication: (state) => {
    state.user.authorised = false;
    state.user.name = "";
    state.user.sub = "";
    state.user.logoutUrl = "";
  }
};
var ActionType = /* @__PURE__ */ ((ActionType2) => {
  ActionType2["None"] = "none";
  ActionType2["FilterTopics"] = "filterTopics";
  ActionType2["GetTopic"] = "getTopic";
  ActionType2["GetTopicAndRoot"] = "getTopicAndRoot";
  ActionType2["SaveArticleScene"] = "saveArticleScene";
  ActionType2["GetRoot"] = "getRoot";
  ActionType2["GetStep"] = "getStep";
  ActionType2["GetPage"] = "getPage";
  ActionType2["GetChain"] = "getChain";
  ActionType2["GetOutline"] = "getOutline";
  ActionType2["GetFragment"] = "getFragment";
  ActionType2["GetChainFragment"] = "getChainFragment";
  return ActionType2;
})(ActionType || {});
const gAjaxHeaderCode = {
  buildHeaders: (state, callID, action) => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-CSRF", "1");
    headers.append("SubscriptionID", state.settings.subscriptionID);
    headers.append("CallID", callID);
    headers.append("Action", action);
    headers.append("withCredentials", "true");
    return headers;
  }
};
const gAuthenticationEffects = {
  checkUserAuthenticated: (state) => {
    if (!state) {
      return;
    }
    const callID = gUtilities.generateGuid();
    let headers = gAjaxHeaderCode.buildHeaders(
      state,
      callID,
      ActionType.None
    );
    const url = `${state.settings.bffUrl}/${state.settings.userPath}?slide=false`;
    return gAuthenticatedHttp({
      url,
      options: {
        method: "GET",
        headers
      },
      response: "json",
      action: gAuthenticationActions.loadSuccessfulAuthentication,
      error: (state2, errorDetails) => {
        alert(`{
                    "message": "Error trying to authenticate with the server",
                    "url": ${url},
                    "error Details": ${JSON.stringify(errorDetails)},
                    "stack": ${JSON.stringify(errorDetails.stack)},
                    "method": gAuthenticationEffects.checkUserAuthenticated.name,
                    "callID: ${callID},
                    "state": ${JSON.stringify(state2)}
                }`);
        return gStateCode.cloneState(state2);
      }
    });
  }
};
const gAuthenticationActions = {
  loadSuccessfulAuthentication: (state, response) => {
    if (!state || !response || response.parseType !== "json" || !response.jsonData) {
      return state;
    }
    const claims = response.jsonData;
    const name = claims.find(
      (claim) => claim.type === "name"
    );
    const sub = claims.find(
      (claim) => claim.type === "sub"
    );
    if (!name && !sub) {
      return state;
    }
    const logoutUrlClaim = claims.find(
      (claim) => claim.type === "bff:logout_url"
    );
    if (!logoutUrlClaim || !logoutUrlClaim.value) {
      return state;
    }
    state.user.authorised = true;
    state.user.name = name.value;
    state.user.sub = sub.value;
    state.user.logoutUrl = logoutUrlClaim.value;
    return gStateCode.cloneState(state);
  },
  checkUserLoggedIn: (state) => {
    const props = gAuthenticationActions.checkUserLoggedInProps(state);
    if (!props) {
      return state;
    }
    return [
      state,
      props
    ];
  },
  checkUserLoggedInProps: (state) => {
    state.user.raw = false;
    return gAuthenticationEffects.checkUserAuthenticated(state);
  },
  login: (state) => {
    const currentUrl = window.location.href;
    sessionStorage.setItem(
      Keys.startUrl,
      currentUrl
    );
    const url = `${state.settings.bffUrl}/${state.settings.defaultLoginPath}?returnUrl=/`;
    window.location.assign(url);
    return state;
  },
  clearAuthentication: (state) => {
    gAuthenticationCode.clearAuthentication(state);
    return gStateCode.cloneState(state);
  },
  clearAuthenticationAndShowLogin: (state) => {
    gAuthenticationCode.clearAuthentication(state);
    return gAuthenticationActions.login(state);
  },
  logout: (state) => {
    window.location.assign(state.user.logoutUrl);
    return state;
  }
};
function gAuthenticatedHttp(props) {
  const httpAuthenticatedProperties = props;
  httpAuthenticatedProperties.onAuthenticationFailAction = gAuthenticationActions.clearAuthenticationAndShowLogin;
  return gHttp(httpAuthenticatedProperties);
}
const runActionInner = (dispatch, props) => {
  dispatch(
    props.action
  );
};
const runAction = (state, queuedEffects) => {
  const effects = [];
  queuedEffects.forEach((action) => {
    const props = {
      action,
      error: (_state, _errorDetails) => {
        alert("Error running action in repeatActions");
      }
    };
    effects.push([
      runActionInner,
      props
    ]);
  });
  return [
    gStateCode.cloneState(state),
    ...effects
  ];
};
const sendRequest = (state, queuedEffects) => {
  const effects = [];
  queuedEffects.forEach((httpEffect2) => {
    getEffect(
      state,
      httpEffect2,
      effects
    );
  });
  return [
    gStateCode.cloneState(state),
    ...effects
  ];
};
const getEffect = (state, httpEffect2, effects) => {
  const url = httpEffect2.url;
  const callID = gUtilities.generateGuid();
  let headers = gAjaxHeaderCode.buildHeaders(
    state,
    callID,
    ActionType.GetStep
  );
  const effect = gAuthenticatedHttp({
    url,
    options: {
      method: "GET",
      headers
    },
    response: "json",
    action: httpEffect2.actionDelegate,
    error: (_state, _errorDetails) => {
      alert("Error posting gRepeatActions data to the server");
    }
  });
  effects.push(effect);
};
const gRepeatActions = {
  // httpSilentReLoad: (state: IState): IStateAnyArray => {
  //     if (!state) {
  //         return state;
  //     }
  //     if (state.repeatEffects.reLoadGetHttp.length === 0) {
  //         // Must return altered state for the subscription not to get removed
  //         // return stateCode.cloneState(state);
  //         return state;
  //     }
  //     const reLoadHttpEffects: Array<IHttpEffect> = state.repeatEffects.reLoadGetHttp;
  //     state.repeatEffects.reLoadGetHttp = [];
  //     return sendRequest(
  //         state,
  //         reLoadHttpEffects
  //     );
  // },
  httpSilentReLoadImmediate: (state) => {
    if (!state) {
      return state;
    }
    if (state.repeatEffects.reLoadGetHttpImmediate.length === 0) {
      return state;
    }
    const reLoadHttpEffectsImmediate = state.repeatEffects.reLoadGetHttpImmediate;
    state.repeatEffects.reLoadGetHttpImmediate = [];
    return sendRequest(
      state,
      reLoadHttpEffectsImmediate
    );
  },
  silentRunActionImmediate: (state) => {
    if (!state) {
      return state;
    }
    if (state.repeatEffects.runActionImmediate.length === 0) {
      return state;
    }
    const runActionImmediate = state.repeatEffects.runActionImmediate;
    state.repeatEffects.runActionImmediate = [];
    return runAction(
      state,
      runActionImmediate
    );
  }
};
const repeatSubscriptions = {
  buildRepeatSubscriptions: (state) => {
    const buildReLoadDataImmediate = () => {
      if (state.repeatEffects.reLoadGetHttpImmediate.length > 0) {
        return interval(
          gRepeatActions.httpSilentReLoadImmediate,
          { delay: 10 }
        );
      }
    };
    const buildRunActionsImmediate = () => {
      if (state.repeatEffects.runActionImmediate.length > 0) {
        return interval(
          gRepeatActions.silentRunActionImmediate,
          { delay: 10 }
        );
      }
    };
    const repeatSubscription = [
      buildReLoadDataImmediate(),
      buildRunActionsImmediate()
    ];
    return repeatSubscription;
  }
};
const initSubscriptions = (state) => {
  if (!state) {
    return;
  }
  const subscriptions = [
    ...repeatSubscriptions.buildRepeatSubscriptions(state)
  ];
  return subscriptions;
};
const Filters = {
  treeSolveGuideID: "treeSolveGuide",
  fragmentBoxDiscussion: "#treeSolveFragments .nt-fr-fragment-box .nt-fr-fragment-discussion"
};
const onFragmentsRenderFinished = () => {
  const fragmentBoxDiscussions = document.querySelectorAll(Filters.fragmentBoxDiscussion);
  let fragmentBox;
  let dataDiscussion;
  for (let i = 0; i < fragmentBoxDiscussions.length; i++) {
    fragmentBox = fragmentBoxDiscussions[i];
    dataDiscussion = fragmentBox.dataset.discussion;
    if (dataDiscussion) {
      fragmentBox.innerHTML = dataDiscussion;
    }
  }
};
const onRenderFinished = () => {
  onFragmentsRenderFinished();
};
const initEvents = {
  onRenderFinished: () => {
    onRenderFinished();
  },
  registerGlobalEvents: () => {
    window.onresize = () => {
      initEvents.onRenderFinished();
    };
  }
};
const initActions = {
  setNotRaw: (state) => {
    var _a, _b;
    if (!((_b = (_a = window == null ? void 0 : window.TreeSolve) == null ? void 0 : _a.screen) == null ? void 0 : _b.isAutofocusFirstRun)) {
      window.TreeSolve.screen.autofocus = false;
    } else {
      window.TreeSolve.screen.isAutofocusFirstRun = false;
    }
    return gStateCode.cloneState(state);
  }
};
class RenderFragmentUI {
  constructor() {
    __publicField(this, "optionExpanded", false);
    __publicField(this, "fragmentOptionsExpanded", false);
    __publicField(this, "discussionLoaded", false);
  }
}
class RenderFragment {
  constructor(id) {
    __publicField(this, "id");
    __publicField(this, "outlineFragmentID", null);
    __publicField(this, "topLevelMapKey", "");
    __publicField(this, "mapKeyChain", "");
    __publicField(this, "guideID", "");
    __publicField(this, "guidePath", "");
    __publicField(this, "parentFragmentID", null);
    __publicField(this, "value", "");
    __publicField(this, "selected", null);
    __publicField(this, "options", []);
    __publicField(this, "option", "");
    __publicField(this, "isAncillary", false);
    __publicField(this, "order", 0);
    __publicField(this, "ui", new RenderFragmentUI());
    this.id = id;
  }
}
const gFileConstants = {
  fragmentsFolderSuffix: "_frags",
  fragmentFileExtension: ".html",
  guideOutlineFilename: "outline.tsoln",
  guideRenderCommentTag: "tsGuideRenderComment ",
  fragmentRenderCommentTag: "tsFragmentRenderComment "
};
const parseAndLoadFragment = (state, rawFragment, outlineFragmentID) => {
  if (!rawFragment) {
    return null;
  }
  const index_chainFragments_outlineFragmentID = state.renderState.index_chainFragments_outlineFragmentID;
  let fragment = index_chainFragments_outlineFragmentID[outlineFragmentID];
  let cache = false;
  if (!fragment) {
    fragment = new RenderFragment(rawFragment.id);
    cache = true;
  }
  fragment.outlineFragmentID = outlineFragmentID;
  index_chainFragments_outlineFragmentID[outlineFragmentID] = fragment;
  gFragmentCode.loadFragment(
    state,
    rawFragment,
    fragment
  );
  if (cache === true) {
    gFragmentCode.indexChainFragment(
      state,
      fragment
    );
  }
  return fragment;
};
const loadOption = (state, rawOption, outlineFragment) => {
  const option = new RenderFragment(rawOption.id);
  option.option = rawOption.option ?? "";
  option.isAncillary = rawOption.isAncillary ?? false;
  option.order = rawOption.order ?? 0;
  if (outlineFragment) {
    for (const outlineOption of outlineFragment.o) {
      if (outlineOption.f === option.id) {
        option.outlineFragmentID = outlineOption.i;
        state.renderState.index_outlineFragments_outlineFragmentID[outlineOption.i] = outlineOption;
        break;
      }
    }
  }
  gFragmentCode.indexChainFragment(
    state,
    option
  );
  return option;
};
const gFragmentCode = {
  getFragmentElementID: (fragmentID) => {
    return `nt_fr_frag_${fragmentID}`;
  },
  getChainFragment: (state, outlineFragmentID) => {
    const fragment = state.renderState.index_chainFragments_outlineFragmentID[outlineFragmentID];
    return fragment ?? null;
  },
  loadFragmentFromChainFragments: (state, fragment) => {
    const outlineFragmentID = fragment.outlineFragmentID;
    if (gUtilities.isNullOrWhiteSpace(outlineFragmentID) === true) {
      return;
    }
    const cachedfragment = state.renderState.index_chainFragments_outlineFragmentID[outlineFragmentID];
    fragment.topLevelMapKey = cachedfragment.topLevelMapKey;
    fragment.mapKeyChain = cachedfragment.mapKeyChain;
    fragment.guideID = cachedfragment.guideID;
    fragment.guidePath = cachedfragment.guidePath;
    fragment.parentFragmentID = cachedfragment.parentFragmentID;
    fragment.value = cachedfragment.value;
    fragment.ui.discussionLoaded = true;
    fragment.option = cachedfragment.option;
    fragment.isAncillary = cachedfragment.isAncillary;
    fragment.order = cachedfragment.order;
    let option;
    if (cachedfragment.options && Array.isArray(cachedfragment.options)) {
      for (const fragmentOption of cachedfragment.options) {
        option = new RenderFragment(fragmentOption.id);
        option.option = cachedfragment.option;
        option.isAncillary = cachedfragment.isAncillary;
        option.order = cachedfragment.order;
        fragment.options.push(option);
      }
    }
  },
  indexChainFragment: (state, fragment) => {
    const outlineFragmentID = fragment.outlineFragmentID;
    if (gUtilities.isNullOrWhiteSpace(outlineFragmentID) === true) {
      return;
    }
    const index_chainFragments_outlineFragmentID = state.renderState.index_chainFragments_outlineFragmentID;
    if (index_chainFragments_outlineFragmentID[outlineFragmentID]) {
      return;
    }
    index_chainFragments_outlineFragmentID[outlineFragmentID] = fragment;
  },
  parseAndLoadFragment: (state, response, outlineFragmentID) => {
    const rawFragment = gFragmentCode.parseFragment(response);
    return parseAndLoadFragment(
      state,
      rawFragment,
      outlineFragmentID
    );
  },
  setRootOutlineFragmentID: (state) => {
    var _a;
    const root = state.renderState.root;
    if (!root) {
      return;
    }
    const outlineRoot = (_a = state.renderState.outline) == null ? void 0 : _a.r;
    if (!outlineRoot) {
      return;
    }
    if (root.id === outlineRoot.f) {
      root.outlineFragmentID = outlineRoot.i;
      state.renderState.index_chainFragments_outlineFragmentID[root.outlineFragmentID] = root;
      state.renderState.currentFragment = root;
    }
    for (const option of root.options) {
      for (const outlineOption of outlineRoot.o) {
        if (outlineOption.f === option.id) {
          option.outlineFragmentID = outlineOption.i;
          state.renderState.index_chainFragments_outlineFragmentID[option.outlineFragmentID] = option;
          break;
        }
      }
    }
  },
  parseAndLoadRootFragment: (state, rawFragment) => {
    if (!rawFragment) {
      return;
    }
    const fragment = new RenderFragment(rawFragment.id);
    gFragmentCode.loadFragment(
      state,
      rawFragment,
      fragment
    );
    state.renderState.root = fragment;
    gFragmentCode.setRootOutlineFragmentID(state);
  },
  loadFragment: (state, rawFragment, fragment) => {
    fragment.topLevelMapKey = rawFragment.topLevelMapKey ?? "";
    fragment.mapKeyChain = rawFragment.mapKeyChain ?? "";
    fragment.guideID = rawFragment.guideID ?? "";
    fragment.guidePath = rawFragment.guidePath ?? "";
    fragment.parentFragmentID = fragment.id ?? "";
    fragment.value = rawFragment.value ?? "";
    fragment.value = fragment.value.trim();
    fragment.ui.discussionLoaded = true;
    let outlineFragment = null;
    if (!gUtilities.isNullOrWhiteSpace(fragment.outlineFragmentID)) {
      outlineFragment = state.renderState.index_outlineFragments_outlineFragmentID[fragment.outlineFragmentID];
    }
    let option;
    if (rawFragment.options && Array.isArray(rawFragment.options)) {
      for (const rawOption of rawFragment.options) {
        option = loadOption(
          state,
          rawOption,
          outlineFragment
        );
        fragment.options.push(option);
      }
    }
  },
  cloneFragment: (fragment) => {
    const clone = new RenderFragment(fragment.id);
    clone.topLevelMapKey = fragment.topLevelMapKey;
    clone.mapKeyChain = fragment.mapKeyChain;
    clone.guideID = fragment.guideID;
    clone.guidePath = fragment.guidePath;
    clone.parentFragmentID = fragment.parentFragmentID;
    clone.value = fragment.value;
    clone.ui.discussionLoaded = true;
    clone.option = fragment.option;
    clone.isAncillary = fragment.isAncillary;
    clone.order = fragment.order;
    let cloneOption;
    if (fragment.options && Array.isArray(fragment.options)) {
      for (const fragmentOption of fragment.options) {
        cloneOption = new RenderFragment(fragmentOption.id);
        cloneOption.option = fragmentOption.option;
        cloneOption.isAncillary = fragmentOption.isAncillary;
        cloneOption.order = fragmentOption.order;
        clone.options.push(cloneOption);
      }
    }
    return clone;
  },
  parseFragment: (response) => {
    const lines = response.split("\n");
    const renderCommentStart = `<!-- ${gFileConstants.fragmentRenderCommentTag}`;
    const renderCommentEnd = ` -->`;
    let fragmentRenderComment = null;
    let line;
    let buildValue = false;
    let value = "";
    for (let i = 0; i < lines.length; i++) {
      line = lines[i];
      if (buildValue) {
        value = `${value}
${line}`;
        continue;
      }
      if (line.startsWith(renderCommentStart) === true) {
        fragmentRenderComment = line.substring(renderCommentStart.length);
        buildValue = true;
      }
    }
    if (!fragmentRenderComment) {
      return;
    }
    fragmentRenderComment = fragmentRenderComment.trim();
    if (fragmentRenderComment.endsWith(renderCommentEnd) === true) {
      const length = fragmentRenderComment.length - renderCommentEnd.length;
      fragmentRenderComment = fragmentRenderComment.substring(
        0,
        length
      );
    }
    fragmentRenderComment = fragmentRenderComment.trim();
    let rawFragment = null;
    try {
      rawFragment = JSON.parse(fragmentRenderComment);
    } catch (e) {
      console.log(e);
    }
    rawFragment.value = value;
    return rawFragment;
  },
  markOptionsExpanded: (state, fragment) => {
    if (!state) {
      return;
    }
    gFragmentCode.resetFragmentUis(state);
    state.renderState.ui.optionsExpanded = true;
    fragment.ui.fragmentOptionsExpanded = true;
  },
  collapseFragmentsOptions: (fragment) => {
    if (!fragment || fragment.options.length === 0) {
      return;
    }
    for (const option of fragment.options) {
      option.ui.fragmentOptionsExpanded = false;
    }
  },
  showOptionNode: (fragment, option) => {
    gFragmentCode.collapseFragmentsOptions(fragment);
    option.ui.fragmentOptionsExpanded = false;
    fragment.selected = option;
  },
  resetFragmentUis: (state) => {
    console.log("resetFragmentUis called");
    const chainFragments = state.renderState.index_chainFragments_outlineFragmentID;
    for (const propName in chainFragments) {
      gFragmentCode.resetFragmentUi(chainFragments[propName]);
    }
    const index_chainFragments_outlineFragmentID = state.renderState.index_chainFragments_outlineFragmentID;
    let fragment;
    for (const fragmentID in index_chainFragments_outlineFragmentID) {
      fragment = index_chainFragments_outlineFragmentID[fragmentID];
      if (fragment.ui.fragmentOptionsExpanded === true) {
        throw new Error("Not all options were collapsed");
      }
    }
  },
  resetFragmentUi: (fragment) => {
    fragment.ui.fragmentOptionsExpanded = false;
  },
  setCurrent: (state, parent, fragment) => {
    parent.selected = fragment;
    state.renderState.currentFragment = fragment;
  }
};
class HistoryUrl {
  constructor(url) {
    __publicField(this, "url");
    this.url = url;
  }
}
class RenderSnapShot {
  constructor(url) {
    __publicField(this, "url");
    __publicField(this, "guid", null);
    __publicField(this, "created", null);
    __publicField(this, "modified", null);
    __publicField(this, "expandedOptionIDs", []);
    __publicField(this, "expandedAncillaryIDs", []);
    this.url = url;
  }
}
const gHistoryCode = {
  resetRaw: () => {
    window.TreeSolve.screen.autofocus = true;
    window.TreeSolve.screen.isAutofocusFirstRun = true;
  },
  pushBrowserHistoryState: (state) => {
    if (!state.renderState.currentFragment) {
      return;
    }
    gHistoryCode.resetRaw();
    const location2 = window.location;
    let lastUrl;
    if (window.history.state) {
      lastUrl = window.history.state.url;
    } else {
      lastUrl = `${location2.origin}${location2.pathname}${location2.search}`;
    }
    const current = state.renderState.currentFragment;
    const url = `${location2.origin}${location2.pathname}?${current.outlineFragmentID}`;
    if (lastUrl && url === lastUrl) {
      return;
    }
    history.pushState(
      new RenderSnapShot(url),
      "",
      url
    );
    state.stepHistory.historyChain.push(new HistoryUrl(url));
  }
};
const getFragment = (state, fragmentID, fragmentPath, action, loadAction) => {
  if (!state) {
    return;
  }
  const callID = gUtilities.generateGuid();
  let headers = gAjaxHeaderCode.buildHeaders(
    state,
    callID,
    action
  );
  const url = `${fragmentPath}`;
  return gAuthenticatedHttp({
    url,
    parseType: "text",
    options: {
      method: "GET",
      headers
    },
    response: "text",
    action: loadAction,
    error: (state2, errorDetails) => {
      alert(`{
                "message": "Error getting fragment from the server, path: ${fragmentPath}, id: ${fragmentID}",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${getFragment.name},
                "callID: ${callID}
            }`);
      return gStateCode.cloneState(state2);
    }
  });
};
const gFragmentEffects = {
  // getRootStep: (
  //     state: IState,
  //     rootID: string): IHttpFetchItem | undefined => {
  //     if (!state) {
  //         return;
  //     }
  //     return getStep(
  //         state,
  //         rootID,
  //         '0',
  //         ActionType.GetRoot,
  //         gStepActions.loadRootStep
  //     );
  // },
  getFragment: (state, option, fragmentPath) => {
    const loadAction = (state2, response) => {
      return gFragmentActions.loadFragment(
        state2,
        response,
        option
      );
    };
    return getFragment(
      state,
      option.id,
      fragmentPath,
      ActionType.GetFragment,
      loadAction
    );
  },
  getChainFragment: (state, fragmentID, fragmentPath, outlineFragmentID) => {
    const loadAction = (state2, response) => {
      return gFragmentActions.loadChainFragment(
        state2,
        response,
        outlineFragmentID
      );
    };
    return getFragment(
      state,
      fragmentID,
      fragmentPath,
      ActionType.GetChainFragment,
      loadAction
    );
  }
  // getAncillary: (
  //     state: IState,
  //     stepID: string,
  //     parentChainID: string,
  //     uiID: number): IHttpFetchItem | undefined => {
  //     const loadAction: (state: IState, response: any) => IStateAnyArray = (state: IState, response: any) => {
  //         const chainResponse = {
  //             response,
  //             parentChainID,
  //             uiID
  //         };
  //         return gStepActions.loadAncillary(
  //             state,
  //             chainResponse
  //         );
  //     };
  //     return getStep(
  //         state,
  //         stepID,
  //         parentChainID,
  //         ActionType.GetStep,
  //         loadAction
  //     );
  // },
  // getAncillaryStep: (
  //     state: IState,
  //     stepID: string,
  //     parentChainID: string,
  //     uiID: number): IHttpFetchItem | undefined => {
  //     const loadAction: (state: IState, response: any) => IStateAnyArray = (state: IState, response: any) => {
  //         const chainResponse = {
  //             response,
  //             parentChainID,
  //             uiID
  //         };
  //         return gStepActions.loadAncillaryChainStep(
  //             state,
  //             chainResponse
  //         );
  //     };
  //     return getStep(
  //         state,
  //         stepID,
  //         parentChainID,
  //         ActionType.GetStep,
  //         loadAction
  //     );
  // }
};
const gFragmentActions = {
  showOptionNode: (state, parentFragment, option) => {
    var _a;
    if (!option) {
      return state;
    }
    gFragmentCode.markOptionsExpanded(
      state,
      option
    );
    gFragmentCode.setCurrent(
      state,
      parentFragment,
      option
    );
    gHistoryCode.pushBrowserHistoryState(state);
    if (option.ui.discussionLoaded === true) {
      return gStateCode.cloneState(state);
    }
    state.loading = true;
    window.TreeSolve.screen.hideBanner = true;
    const fragmentPath = `${(_a = state.renderState.guide) == null ? void 0 : _a.fragmentFolderUrl}/${option.id}${gFileConstants.fragmentFileExtension}`;
    return [
      state,
      gFragmentEffects.getFragment(
        state,
        option,
        fragmentPath
      )
    ];
  },
  loadFragment: (state, response, option) => {
    if (!state || gUtilities.isNullOrWhiteSpace(option.outlineFragmentID)) {
      return state;
    }
    gFragmentCode.parseAndLoadFragment(
      state,
      response.textData,
      option.outlineFragmentID
    );
    state.loading = false;
    return gStateCode.cloneState(state);
  },
  loadChainFragment: (state, response, outlineFragmentID) => {
    if (!state || !state.renderState.currentFragment) {
      return state;
    }
    state.loading = false;
    gFragmentCode.parseAndLoadFragment(
      state,
      response.textData,
      outlineFragmentID
    );
    const loadingChainCache_OutlineFragments = state.renderState.loadingChainCache_OutlineFragments;
    if (loadingChainCache_OutlineFragments) {
      const nextOutlineFragment = loadingChainCache_OutlineFragments.at(-1) ?? null;
      if (nextOutlineFragment) {
        const parentFragment = state.renderState.currentFragment;
        const expandedOption = state.renderState.index_chainFragments_outlineFragmentID[nextOutlineFragment.i];
        expandedOption.ui.fragmentOptionsExpanded = true;
        gFragmentCode.showOptionNode(
          parentFragment,
          expandedOption
        );
        gFragmentCode.setCurrent(
          state,
          state.renderState.currentFragment,
          expandedOption
        );
      }
    }
    return gStateCode.cloneState(state);
  }
};
const fragmentActions = {
  expandOptions: (state, fragment) => {
    if (!state || !fragment) {
      return state;
    }
    state.renderState.ui.raw = false;
    gFragmentCode.resetFragmentUis(state);
    const expanded = fragment.ui.fragmentOptionsExpanded !== true;
    state.renderState.ui.optionsExpanded = expanded;
    fragment.ui.fragmentOptionsExpanded = expanded;
    return gStateCode.cloneState(state);
  },
  hideOptions: (state, fragment) => {
    if (!state || !fragment) {
      return state;
    }
    state.renderState.ui.raw = false;
    gFragmentCode.resetFragmentUis(state);
    fragment.ui.fragmentOptionsExpanded = false;
    state.renderState.ui.optionsExpanded = false;
    return gStateCode.cloneState(state);
  },
  showOptionNode: (state, payload) => {
    if (!state || !(payload == null ? void 0 : payload.parentFragment) || !(payload == null ? void 0 : payload.option)) {
      return state;
    }
    state.renderState.ui.raw = false;
    return gFragmentActions.showOptionNode(
      state,
      payload.parentFragment,
      payload.option
    );
  }
};
class FragmentPayload {
  constructor(parentFragment, option) {
    __publicField(this, "parentFragment");
    __publicField(this, "option");
    this.parentFragment = parentFragment;
    this.option = option;
  }
}
const BuildExpandedOptionView = (parent, option) => {
  if (!option || option.isAncillary === true) {
    return null;
  }
  const view = h(
    "div",
    { class: "nt-fr-option-box" },
    [
      h(
        "a",
        {
          class: "nt-fr-option",
          onMouseDown: [
            fragmentActions.showOptionNode,
            (_event) => {
              return new FragmentPayload(
                parent,
                option
              );
            }
          ]
        },
        [
          h("span", {}, option.option)
        ]
      )
    ]
  );
  return view;
};
const buildExpandedOptionsView = (fragment) => {
  const optionViews = [];
  let optionVew;
  for (const option of fragment.options) {
    optionVew = BuildExpandedOptionView(
      fragment,
      option
    );
    if (optionVew) {
      optionViews.push(optionVew);
    }
  }
  let optionsClasses = "nt-fr-fragment-options";
  if (fragment.selected) {
    optionsClasses = `${optionsClasses} nt-fr-fragment-chain`;
  }
  const view = h(
    "div",
    {
      class: `${optionsClasses}`,
      tabindex: 0,
      onBlur: [
        fragmentActions.hideOptions,
        (_event) => fragment
      ]
    },
    [
      optionViews
    ]
  );
  return view;
};
const buildCollapsedOptionsView = (fragment) => {
  var _a;
  const view = h(
    "a",
    {
      class: `nt-fr-fragment-options nt-fr-collapsed`,
      onMouseDown: [
        fragmentActions.expandOptions,
        (_event) => fragment
      ]
    },
    [
      h("span", { class: `nt-fr-option-selected` }, `${(_a = fragment.selected) == null ? void 0 : _a.option}`)
    ]
  );
  return view;
};
const buildOptionsView = (fragment) => {
  if (!fragment.options || fragment.options.length === 0) {
    return null;
  }
  if (fragment.selected && !fragment.ui.fragmentOptionsExpanded) {
    return buildCollapsedOptionsView(fragment);
  }
  return buildExpandedOptionsView(fragment);
};
const buildFragmentView = (fragment) => {
  if (!fragment) {
    return [];
  }
  const fragmentELementID = gFragmentCode.getFragmentElementID(fragment.id);
  const view = [
    h(
      "div",
      {
        id: `${fragmentELementID}`,
        class: "nt-fr-fragment-box"
      },
      [
        h(
          "div",
          {
            class: `nt-fr-fragment-discussion`,
            "data-discussion": fragment.value
          },
          ""
        ),
        buildOptionsView(fragment)
      ]
    ),
    buildFragmentView(fragment.selected)
  ];
  return view;
};
const fragmentViews = {
  buildContentView: (state) => {
    const view = h("div", { id: "nt_fr_Fragments" }, [
      buildFragmentView(state.renderState.root)
    ]);
    return view;
  }
};
const initView = {
  buildView: (state) => {
    const view = h(
      "div",
      {
        onClick: initActions.setNotRaw,
        id: "treeSolveFragments"
      },
      [
        fragmentViews.buildContentView(state)
      ]
    );
    return view;
  }
};
class Settings {
  constructor() {
    __publicField(this, "key", "-1");
    __publicField(this, "r", "-1");
    // Authentication
    __publicField(this, "userPath", `user`);
    __publicField(this, "defaultLogoutPath", `logout`);
    __publicField(this, "defaultLoginPath", `login`);
    __publicField(this, "returnUrlStart", `returnUrl`);
    __publicField(this, "baseUrl", window.ASSISTANT_BASE_URL ?? "");
    __publicField(this, "linkUrl", window.ASSISTANT_LINK_URL ?? "");
    __publicField(this, "subscriptionID", window.ASSISTANT_SUBSCRIPTION_ID ?? "");
    __publicField(this, "apiUrl", `${this.baseUrl}/api`);
    __publicField(this, "bffUrl", `${this.baseUrl}/bff`);
    __publicField(this, "fileUrl", `${this.baseUrl}/file`);
  }
}
var navigationDirection = /* @__PURE__ */ ((navigationDirection2) => {
  navigationDirection2["Buttons"] = "buttons";
  navigationDirection2["Backwards"] = "backwards";
  navigationDirection2["Forwards"] = "forwards";
  return navigationDirection2;
})(navigationDirection || {});
class History {
  constructor() {
    __publicField(this, "historyChain", []);
    __publicField(this, "direction", navigationDirection.Buttons);
    __publicField(this, "currentIndex", 0);
  }
}
class User {
  constructor() {
    __publicField(this, "key", `0123456789`);
    __publicField(this, "r", "-1");
    __publicField(this, "useVsCode", true);
    __publicField(this, "authorised", false);
    __publicField(this, "raw", true);
    __publicField(this, "logoutUrl", "");
    __publicField(this, "showMenu", false);
    __publicField(this, "name", "");
    __publicField(this, "sub", "");
  }
}
class RepeateEffects {
  constructor() {
    __publicField(this, "shortIntervalHttp", []);
    // public reLoadGetHttp: Array<IHttpEffect> = [];
    __publicField(this, "reLoadGetHttpImmediate", []);
    __publicField(this, "runActionImmediate", []);
  }
}
class RenderStateUI {
  constructor() {
    __publicField(this, "raw", true);
    __publicField(this, "optionsExpanded", false);
  }
}
class RenderState {
  constructor() {
    __publicField(this, "guide", null);
    __publicField(this, "root", null);
    __publicField(this, "currentFragment", null);
    __publicField(this, "outline", null);
    __publicField(this, "loadingChainCache_OutlineFragments", null);
    // Search indices
    __publicField(this, "index_outlineFragments_outlineFragmentID", {});
    __publicField(this, "index_chainFragments_outlineFragmentID", {});
    __publicField(this, "index_rawFragments_fragmentID", {});
    __publicField(this, "ui", new RenderStateUI());
  }
}
class State {
  constructor() {
    __publicField(this, "showMenu", false);
    __publicField(this, "showSolutionsMenu", false);
    __publicField(this, "twitterUrl", "https://twitter.com/netoftrees");
    __publicField(this, "linkedinUrl", "https://www.linkedin.com/company/netoftrees/about");
    __publicField(this, "loading", true);
    __publicField(this, "debug", true);
    __publicField(this, "genericError", false);
    __publicField(this, "nextKey", 0);
    __publicField(this, "settings");
    __publicField(this, "user", new User());
    __publicField(this, "renderState", new RenderState());
    __publicField(this, "repeatEffects", new RepeateEffects());
    __publicField(this, "stepHistory", new History());
    const settings = new Settings();
    this.settings = settings;
  }
}
var ScrollHopType = /* @__PURE__ */ ((ScrollHopType2) => {
  ScrollHopType2["None"] = "none";
  ScrollHopType2["Up"] = "up";
  ScrollHopType2["Down"] = "down";
  return ScrollHopType2;
})(ScrollHopType || {});
class Screen {
  constructor() {
    __publicField(this, "autofocus", false);
    __publicField(this, "isAutofocusFirstRun", true);
    __publicField(this, "hideBanner", false);
    __publicField(this, "scrollToTop", false);
    __publicField(this, "scrollToElement", null);
    __publicField(this, "scrollHop", ScrollHopType.None);
    __publicField(this, "lastScrollY", 0);
    __publicField(this, "ua", null);
  }
}
class TreeSolve {
  constructor() {
    __publicField(this, "renderingComment", null);
    __publicField(this, "screen", new Screen());
  }
}
class RenderOutlineFragment {
  constructor() {
    __publicField(this, "i", "");
    // id
    __publicField(this, "f", "");
    // fragment id
    __publicField(this, "c", "");
    // chart id from outline chart array
    __publicField(this, "o", []);
    // options
    __publicField(this, "parent", null);
  }
}
class RenderOutline {
  constructor() {
    __publicField(this, "v", "");
    __publicField(this, "r", new RenderOutlineFragment());
    __publicField(this, "c", []);
  }
}
class RenderOutlineChart {
  constructor() {
    __publicField(this, "i", "");
    __publicField(this, "p", "");
  }
}
const loadFragment = (state, rawFragment, parent = null) => {
  const fragment = new RenderOutlineFragment();
  fragment.i = rawFragment.i;
  fragment.f = rawFragment.f;
  fragment.parent = parent;
  state.renderState.index_outlineFragments_outlineFragmentID[fragment.i] = fragment;
  if (rawFragment.o && Array.isArray(rawFragment.o) === true && rawFragment.o.length > 0) {
    let o;
    for (const option of rawFragment.o) {
      o = loadFragment(
        state,
        option,
        fragment
      );
      fragment.o.push(o);
    }
  }
  return fragment;
};
const loadCharts = (outline, rawOutlineCharts) => {
  outline.c = [];
  let c;
  for (const chart of rawOutlineCharts) {
    c = new RenderOutlineChart();
    c.i = chart.i;
    c.p = chart.p;
    outline.c.push(c);
  }
};
const gOutlineCode = {
  getOutlineFragment: (state, fragmentID) => {
    const fragment = state.renderState.index_outlineFragments_outlineFragmentID[fragmentID];
    return fragment ?? null;
  },
  getOutlineFragmentChain: (state, fragmentID) => {
    const fragmentIDs = [];
    let fragment;
    while (fragmentID) {
      fragment = gOutlineCode.getOutlineFragment(
        state,
        fragmentID
      );
      if (!fragment) {
        break;
      }
      fragmentID = fragment.i;
      fragmentIDs.push(fragmentID);
    }
    return fragmentIDs;
  },
  loadOutline: (state, outlineResponse) => {
    const rawOutline = outlineResponse.jsonData;
    const outline = new RenderOutline();
    outline.v = rawOutline.v;
    if (rawOutline.c && Array.isArray(rawOutline.c) === true && rawOutline.c.length > 0) {
      loadCharts(
        outline,
        rawOutline.c
      );
    }
    outline.v = rawOutline.v;
    outline.r = loadFragment(
      state,
      rawOutline.r
    );
    state.renderState.outline = outline;
    gFragmentCode.setRootOutlineFragmentID(state);
  }
};
const gOutlineActions = {
  loadOutline: (state, outlineResponse) => {
    gOutlineCode.loadOutline(
      state,
      outlineResponse
    );
    return gStateCode.cloneState(state);
  },
  loadOutlineAndRequestFragments: (state, outlineResponse, lastOutlineFragmentID) => {
    var _a;
    const fragmentFolderUrl = (_a = state.renderState.guide) == null ? void 0 : _a.fragmentFolderUrl;
    if (gUtilities.isNullOrWhiteSpace(fragmentFolderUrl) === true) {
      return state;
    }
    gOutlineCode.loadOutline(
      state,
      outlineResponse
    );
    let chainOutlineFragments = [];
    let outlineFragment = gOutlineCode.getOutlineFragment(
      state,
      lastOutlineFragmentID
    );
    while (outlineFragment) {
      chainOutlineFragments.push(outlineFragment);
      outlineFragment = outlineFragment.parent;
    }
    chainOutlineFragments.pop();
    state.renderState.loadingChainCache_OutlineFragments = chainOutlineFragments;
    const index_chainFragments_outlineFragmentID = state.renderState.index_chainFragments_outlineFragmentID;
    const fragmentLoadEffects = [];
    let fragment;
    let fragmentPath;
    let loadFragmentEffect;
    for (let i = chainOutlineFragments.length - 1; i >= 0; i--) {
      outlineFragment = chainOutlineFragments[i];
      fragment = index_chainFragments_outlineFragmentID[outlineFragment.f];
      if (fragment && fragment.ui.discussionLoaded === true) {
        continue;
      }
      fragmentPath = `${fragmentFolderUrl}/${outlineFragment.f}${gFileConstants.fragmentFileExtension}`;
      loadFragmentEffect = gFragmentEffects.getChainFragment(
        state,
        outlineFragment.f,
        fragmentPath,
        outlineFragment.i
      );
      if (loadFragmentEffect) {
        fragmentLoadEffects.push(loadFragmentEffect);
      }
    }
    return [
      state,
      fragmentLoadEffects
    ];
  }
};
const getGuideOutline = (state, loadDelegate) => {
  var _a;
  if (!((_a = state.renderState.guide) == null ? void 0 : _a.path)) {
    return;
  }
  const callID = gUtilities.generateGuid();
  let headers = gAjaxHeaderCode.buildHeaders(
    state,
    callID,
    ActionType.GetOutline
  );
  const fragmentFolderUrl = state.renderState.guide.fragmentFolderUrl ?? "null";
  const url = `${fragmentFolderUrl}/${gFileConstants.guideOutlineFilename}`;
  return gAuthenticatedHttp({
    url,
    options: {
      method: "GET",
      headers
    },
    response: "json",
    action: loadDelegate,
    error: (state2, errorDetails) => {
      alert(`{
                "message": "Error getting outline data from the server.",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${gRenderEffects.getGuideOutline.name},
                "callID: ${callID}
            }`);
      return gStateCode.cloneState(state2);
    }
  });
};
const gRenderEffects = {
  getGuideOutline: (state) => {
    if (!state) {
      return;
    }
    return getGuideOutline(
      state,
      gOutlineActions.loadOutline
    );
  },
  getGuideOutlineAndLoadFragments: (state, lastOutlineFragmentID) => {
    if (!state) {
      return;
    }
    const loadDelegate = (state2, outlineResponse) => {
      return gOutlineActions.loadOutlineAndRequestFragments(
        state2,
        outlineResponse,
        lastOutlineFragmentID
      );
    };
    return getGuideOutline(
      state,
      loadDelegate
    );
  }
};
class RenderGuide {
  constructor(id) {
    __publicField(this, "id");
    __publicField(this, "title", "");
    __publicField(this, "description", "");
    __publicField(this, "path", "");
    __publicField(this, "fragmentFolderUrl", null);
    this.id = id;
  }
}
const parseGuide = (rawGuide) => {
  const guide = new RenderGuide(rawGuide.id);
  guide.title = rawGuide.title ?? "";
  guide.description = rawGuide.description ?? "";
  guide.path = rawGuide.path ?? null;
  let folderPath = rawGuide.fragmentFolderPath ?? null;
  let divider = "";
  if (!gUtilities.isNullOrWhiteSpace(folderPath)) {
    if (!location.origin.endsWith("/")) {
      if (!folderPath.startsWith("/")) {
        divider = "/";
      }
    } else {
      if (folderPath.startsWIth("/") === true) {
        folderPath = folderPath.substring(1);
      }
    }
    guide.fragmentFolderUrl = `${location.origin}${divider}${folderPath}`;
  }
  return guide;
};
const parseRenderingComment = (state, raw) => {
  if (!raw) {
    return raw;
  }
  state.renderState.guide = parseGuide(raw.guide);
  gFragmentCode.parseAndLoadRootFragment(
    state,
    raw.fragment
  );
};
const gRenderCode = {
  registerGuideComment: () => {
    const treeSolveGuide = document.getElementById(Filters.treeSolveGuideID);
    if (treeSolveGuide && treeSolveGuide.hasChildNodes() === true) {
      let childNode;
      for (let i = 0; i < treeSolveGuide.childNodes.length; i++) {
        childNode = treeSolveGuide.childNodes[i];
        if (childNode.nodeType === Node.COMMENT_NODE) {
          if (!window.TreeSolve) {
            window.TreeSolve = new TreeSolve();
          }
          window.TreeSolve.renderingComment = childNode.textContent;
          childNode.remove();
          break;
        } else if (childNode.nodeType !== Node.TEXT_NODE) {
          break;
        }
      }
    }
  },
  parseRenderingComment: (state) => {
    var _a;
    if (!((_a = window.TreeSolve) == null ? void 0 : _a.renderingComment)) {
      return;
    }
    try {
      let guideRenderComment = window.TreeSolve.renderingComment;
      guideRenderComment = guideRenderComment.trim();
      if (!guideRenderComment.startsWith(gFileConstants.guideRenderCommentTag)) {
        return;
      }
      guideRenderComment = guideRenderComment.substring(gFileConstants.guideRenderCommentTag.length);
      const raw = JSON.parse(guideRenderComment);
      parseRenderingComment(
        state,
        raw
      );
    } catch (e) {
      console.error(e);
      return;
    }
  },
  registerFragmentComment: () => {
  }
};
const initialiseState = () => {
  if (!window.TreeSolve) {
    window.TreeSolve = new TreeSolve();
  }
  const state = new State();
  gRenderCode.parseRenderingComment(state);
  return state;
};
const buildRenderDisplay = (state) => {
  if (!state.renderState.root || !state.renderState.root.options || state.renderState.root.options.length === 0) {
    return state;
  }
  return [
    state,
    gRenderEffects.getGuideOutline(state)
  ];
};
const buildRenderChainDisplay = (state, queryString) => {
  if (queryString.startsWith("?") === true) {
    queryString = queryString.substring(1);
  }
  const lastOutlineFragmentID = queryString;
  return [
    state,
    gRenderEffects.getGuideOutlineAndLoadFragments(
      state,
      lastOutlineFragmentID
    )
  ];
};
const initialiseWithoutAuthorisation = (state) => {
  const queryString = window.location.search;
  try {
    if (!gUtilities.isNullOrWhiteSpace(queryString)) {
      return buildRenderChainDisplay(
        state,
        queryString
      );
    }
    return buildRenderDisplay(state);
  } catch (e) {
    state.genericError = true;
    return state;
  }
};
const initState = {
  initialise: () => {
    const state = initialiseState();
    return initialiseWithoutAuthorisation(state);
  }
};
const renderComments = {
  registerGuideComment: () => {
    const treeSolveGuide = document.getElementById(Filters.treeSolveGuideID);
    if (treeSolveGuide && treeSolveGuide.hasChildNodes() === true) {
      let childNode;
      for (let i = 0; i < treeSolveGuide.childNodes.length; i++) {
        childNode = treeSolveGuide.childNodes[i];
        if (childNode.nodeType === Node.COMMENT_NODE) {
          if (!window.TreeSolve) {
            window.TreeSolve = new TreeSolve();
          }
          window.TreeSolve.renderingComment = childNode.textContent;
          childNode.remove();
          break;
        } else if (childNode.nodeType !== Node.TEXT_NODE) {
          break;
        }
      }
    }
  }
};
initEvents.registerGlobalEvents();
renderComments.registerGuideComment();
window.CompositeFlowsAuthor = app({
  node: document.getElementById("treeSolveFragments"),
  init: initState.initialise,
  view: initView.buildView,
  subscriptions: initSubscriptions,
  onEnd: initEvents.onRenderFinished
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguS08yTndNZjguanMiLCJzb3VyY2VzIjpbIi4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbC5qcyIsIi4uL3Jvb3Qvc3JjL2h5cGVyQXBwL3RpbWUudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dIdHRwLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL2NvbnN0YW50cy9LZXlzLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9lZmZlY3RzL0h0dHBFZmZlY3QudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nVXRpbGl0aWVzLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nU3RhdGVDb2RlLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQXV0aGVudGljYXRpb25Db2RlLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGUudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBamF4SGVhZGVyQ29kZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2h0dHAvZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2h0dHAvZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ1JlcGVhdEFjdGlvbnMudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N1YnNjcmlwdGlvbnMvcmVwZWF0U3Vic2NyaXB0aW9uLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2luaXQvc3Vic2NyaXB0aW9ucy9pbml0U3Vic2NyaXB0aW9ucy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnMudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvZnJhZ21lbnRzL2NvZGUvb25GcmFnbWVudHNSZW5kZXJGaW5pc2hlZC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvb25SZW5kZXJGaW5pc2hlZC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdEV2ZW50cy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2FjdGlvbnMvaW5pdEFjdGlvbnMudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL1JlbmRlckZyYWdtZW50VUkudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJGcmFnbWVudC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2dGaWxlQ29uc3RhbnRzLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nRnJhZ21lbnRDb2RlLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L0hpc3RvcnlVcmwudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2hpc3RvcnkvUmVuZGVyU25hcFNob3QudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9jb2RlL2dIaXN0b3J5Q29kZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0cy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9ucy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvYWN0aW9ucy9mcmFnbWVudEFjdGlvbnMudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvdmlld3MvZnJhZ21lbnRWaWV3cy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L3ZpZXdzL2luaXRWaWV3LnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91c2VyL1NldHRpbmdzLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb24udHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2hpc3RvcnkvSGlzdG9yeS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdXNlci9Vc2VyLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJTdGF0ZVVJLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9SZW5kZXJTdGF0ZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvU3RhdGUudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2ludGVyZmFjZXMvZW51bXMvU2Nyb2xsSG9wVHlwZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvd2luZG93L1NjcmVlbi50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvd2luZG93L1RyZWVTb2x2ZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvcmVuZGVyL1JlbmRlck91dGxpbmVGcmFnbWVudC50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvcmVuZGVyL1JlbmRlck91dGxpbmUudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lQ2hhcnQudHMiLCIuLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9jb2RlL2dPdXRsaW5lQ29kZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ091dGxpbmVBY3Rpb25zLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvZWZmZWN0cy9nUmVuZGVyRWZmZWN0cy50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvcmVuZGVyL1JlbmRlckd1aWRlLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nUmVuZGVyQ29kZS50cyIsIi4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdFN0YXRlLnRzIiwiLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2luaXQvY29kZS9yZW5kZXJDb21tZW50cy50cyIsIi4uL3Jvb3Qvc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBSRUNZQ0xFRF9OT0RFID0gMVxyXG52YXIgTEFaWV9OT0RFID0gMlxyXG52YXIgVEVYVF9OT0RFID0gM1xyXG52YXIgRU1QVFlfT0JKID0ge31cclxudmFyIEVNUFRZX0FSUiA9IFtdXHJcbnZhciBtYXAgPSBFTVBUWV9BUlIubWFwXHJcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheVxyXG52YXIgZGVmZXIgPVxyXG4gIHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09IFwidW5kZWZpbmVkXCJcclxuICAgID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICA6IHNldFRpbWVvdXRcclxuXHJcbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uKG9iaikge1xyXG4gIHZhciBvdXQgPSBcIlwiXHJcblxyXG4gIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSByZXR1cm4gb2JqXHJcblxyXG4gIGlmIChpc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCA+IDApIHtcclxuICAgIGZvciAodmFyIGsgPSAwLCB0bXA7IGsgPCBvYmoubGVuZ3RoOyBrKyspIHtcclxuICAgICAgaWYgKCh0bXAgPSBjcmVhdGVDbGFzcyhvYmpba10pKSAhPT0gXCJcIikge1xyXG4gICAgICAgIG91dCArPSAob3V0ICYmIFwiIFwiKSArIHRtcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XHJcbiAgICAgIGlmIChvYmpba10pIHtcclxuICAgICAgICBvdXQgKz0gKG91dCAmJiBcIiBcIikgKyBrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxudmFyIG1lcmdlID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIHZhciBvdXQgPSB7fVxyXG5cclxuICBmb3IgKHZhciBrIGluIGEpIG91dFtrXSA9IGFba11cclxuICBmb3IgKHZhciBrIGluIGIpIG91dFtrXSA9IGJba11cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG52YXIgYmF0Y2ggPSBmdW5jdGlvbihsaXN0KSB7XHJcbiAgcmV0dXJuIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG91dCwgaXRlbSkge1xyXG4gICAgcmV0dXJuIG91dC5jb25jYXQoXHJcbiAgICAgICFpdGVtIHx8IGl0ZW0gPT09IHRydWVcclxuICAgICAgICA/IDBcclxuICAgICAgICA6IHR5cGVvZiBpdGVtWzBdID09PSBcImZ1bmN0aW9uXCJcclxuICAgICAgICA/IFtpdGVtXVxyXG4gICAgICAgIDogYmF0Y2goaXRlbSlcclxuICAgIClcclxuICB9LCBFTVBUWV9BUlIpXHJcbn1cclxuXHJcbnZhciBpc1NhbWVBY3Rpb24gPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgcmV0dXJuIGlzQXJyYXkoYSkgJiYgaXNBcnJheShiKSAmJiBhWzBdID09PSBiWzBdICYmIHR5cGVvZiBhWzBdID09PSBcImZ1bmN0aW9uXCJcclxufVxyXG5cclxudmFyIHNob3VsZFJlc3RhcnQgPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgaWYgKGEgIT09IGIpIHtcclxuICAgIGZvciAodmFyIGsgaW4gbWVyZ2UoYSwgYikpIHtcclxuICAgICAgaWYgKGFba10gIT09IGJba10gJiYgIWlzU2FtZUFjdGlvbihhW2tdLCBiW2tdKSkgcmV0dXJuIHRydWVcclxuICAgICAgYltrXSA9IGFba11cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnZhciBwYXRjaFN1YnMgPSBmdW5jdGlvbihvbGRTdWJzLCBuZXdTdWJzLCBkaXNwYXRjaCkge1xyXG4gIGZvciAoXHJcbiAgICB2YXIgaSA9IDAsIG9sZFN1YiwgbmV3U3ViLCBzdWJzID0gW107XHJcbiAgICBpIDwgb2xkU3Vicy5sZW5ndGggfHwgaSA8IG5ld1N1YnMubGVuZ3RoO1xyXG4gICAgaSsrXHJcbiAgKSB7XHJcbiAgICBvbGRTdWIgPSBvbGRTdWJzW2ldXHJcbiAgICBuZXdTdWIgPSBuZXdTdWJzW2ldXHJcbiAgICBzdWJzLnB1c2goXHJcbiAgICAgIG5ld1N1YlxyXG4gICAgICAgID8gIW9sZFN1YiB8fFxyXG4gICAgICAgICAgbmV3U3ViWzBdICE9PSBvbGRTdWJbMF0gfHxcclxuICAgICAgICAgIHNob3VsZFJlc3RhcnQobmV3U3ViWzFdLCBvbGRTdWJbMV0pXHJcbiAgICAgICAgICA/IFtcclxuICAgICAgICAgICAgICBuZXdTdWJbMF0sXHJcbiAgICAgICAgICAgICAgbmV3U3ViWzFdLFxyXG4gICAgICAgICAgICAgIG5ld1N1YlswXShkaXNwYXRjaCwgbmV3U3ViWzFdKSxcclxuICAgICAgICAgICAgICBvbGRTdWIgJiYgb2xkU3ViWzJdKClcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgOiBvbGRTdWJcclxuICAgICAgICA6IG9sZFN1YiAmJiBvbGRTdWJbMl0oKVxyXG4gICAgKVxyXG4gIH1cclxuICByZXR1cm4gc3Vic1xyXG59XHJcblxyXG52YXIgcGF0Y2hQcm9wZXJ0eSA9IGZ1bmN0aW9uKG5vZGUsIGtleSwgb2xkVmFsdWUsIG5ld1ZhbHVlLCBsaXN0ZW5lciwgaXNTdmcpIHtcclxuICBpZiAoa2V5ID09PSBcImtleVwiKSB7XHJcbiAgfSBlbHNlIGlmIChrZXkgPT09IFwic3R5bGVcIikge1xyXG4gICAgZm9yICh2YXIgayBpbiBtZXJnZShvbGRWYWx1ZSwgbmV3VmFsdWUpKSB7XHJcbiAgICAgIG9sZFZhbHVlID0gbmV3VmFsdWUgPT0gbnVsbCB8fCBuZXdWYWx1ZVtrXSA9PSBudWxsID8gXCJcIiA6IG5ld1ZhbHVlW2tdXHJcbiAgICAgIGlmIChrWzBdID09PSBcIi1cIikge1xyXG4gICAgICAgIG5vZGVba2V5XS5zZXRQcm9wZXJ0eShrLCBvbGRWYWx1ZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBub2RlW2tleV1ba10gPSBvbGRWYWx1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChrZXlbMF0gPT09IFwib1wiICYmIGtleVsxXSA9PT0gXCJuXCIpIHtcclxuICAgIGlmIChcclxuICAgICAgISgobm9kZS5hY3Rpb25zIHx8IChub2RlLmFjdGlvbnMgPSB7fSkpW1xyXG4gICAgICAgIChrZXkgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKSlcclxuICAgICAgXSA9IG5ld1ZhbHVlKVxyXG4gICAgKSB7XHJcbiAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihrZXksIGxpc3RlbmVyKVxyXG4gICAgfSBlbHNlIGlmICghb2xkVmFsdWUpIHtcclxuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGtleSwgbGlzdGVuZXIpXHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICghaXNTdmcgJiYga2V5ICE9PSBcImxpc3RcIiAmJiBrZXkgaW4gbm9kZSkge1xyXG4gICAgbm9kZVtrZXldID0gbmV3VmFsdWUgPT0gbnVsbCB8fCBuZXdWYWx1ZSA9PSBcInVuZGVmaW5lZFwiID8gXCJcIiA6IG5ld1ZhbHVlXHJcbiAgfSBlbHNlIGlmIChcclxuICAgIG5ld1ZhbHVlID09IG51bGwgfHxcclxuICAgIG5ld1ZhbHVlID09PSBmYWxzZSB8fFxyXG4gICAgKGtleSA9PT0gXCJjbGFzc1wiICYmICEobmV3VmFsdWUgPSBjcmVhdGVDbGFzcyhuZXdWYWx1ZSkpKVxyXG4gICkge1xyXG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KVxyXG4gIH0gZWxzZSB7XHJcbiAgICBub2RlLnNldEF0dHJpYnV0ZShrZXksIG5ld1ZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxudmFyIGNyZWF0ZU5vZGUgPSBmdW5jdGlvbih2ZG9tLCBsaXN0ZW5lciwgaXNTdmcpIHtcclxuICB2YXIgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICB2YXIgcHJvcHMgPSB2ZG9tLnByb3BzXHJcbiAgdmFyIG5vZGUgPVxyXG4gICAgdmRvbS50eXBlID09PSBURVhUX05PREVcclxuICAgICAgPyBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2ZG9tLm5hbWUpXHJcbiAgICAgIDogKGlzU3ZnID0gaXNTdmcgfHwgdmRvbS5uYW1lID09PSBcInN2Z1wiKVxyXG4gICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgdmRvbS5uYW1lLCB7IGlzOiBwcm9wcy5pcyB9KVxyXG4gICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodmRvbS5uYW1lLCB7IGlzOiBwcm9wcy5pcyB9KVxyXG5cclxuICBmb3IgKHZhciBrIGluIHByb3BzKSB7XHJcbiAgICBwYXRjaFByb3BlcnR5KG5vZGUsIGssIG51bGwsIHByb3BzW2tdLCBsaXN0ZW5lciwgaXNTdmcpXHJcbiAgfVxyXG5cclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmRvbS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgbm9kZS5hcHBlbmRDaGlsZChcclxuICAgICAgY3JlYXRlTm9kZShcclxuICAgICAgICAodmRvbS5jaGlsZHJlbltpXSA9IGdldFZOb2RlKHZkb20uY2hpbGRyZW5baV0pKSxcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBpc1N2Z1xyXG4gICAgICApXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKHZkb20ubm9kZSA9IG5vZGUpXHJcbn1cclxuXHJcbnZhciBnZXRLZXkgPSBmdW5jdGlvbih2ZG9tKSB7XHJcbiAgcmV0dXJuIHZkb20gPT0gbnVsbCA/IG51bGwgOiB2ZG9tLmtleVxyXG59XHJcblxyXG52YXIgcGF0Y2ggPSBmdW5jdGlvbihwYXJlbnQsIG5vZGUsIG9sZFZOb2RlLCBuZXdWTm9kZSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgaWYgKG9sZFZOb2RlID09PSBuZXdWTm9kZSkge1xyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICBvbGRWTm9kZSAhPSBudWxsICYmXHJcbiAgICBvbGRWTm9kZS50eXBlID09PSBURVhUX05PREUgJiZcclxuICAgIG5ld1ZOb2RlLnR5cGUgPT09IFRFWFRfTk9ERVxyXG4gICkge1xyXG4gICAgaWYgKG9sZFZOb2RlLm5hbWUgIT09IG5ld1ZOb2RlLm5hbWUpIG5vZGUubm9kZVZhbHVlID0gbmV3Vk5vZGUubmFtZVxyXG4gIH0gZWxzZSBpZiAob2xkVk5vZGUgPT0gbnVsbCB8fCBvbGRWTm9kZS5uYW1lICE9PSBuZXdWTm9kZS5uYW1lKSB7XHJcbiAgICBub2RlID0gcGFyZW50Lmluc2VydEJlZm9yZShcclxuICAgICAgY3JlYXRlTm9kZSgobmV3Vk5vZGUgPSBnZXRWTm9kZShuZXdWTm9kZSkpLCBsaXN0ZW5lciwgaXNTdmcpLFxyXG4gICAgICBub2RlXHJcbiAgICApXHJcbiAgICBpZiAob2xkVk5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQob2xkVk5vZGUubm9kZSlcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHRtcFZLaWRcclxuICAgIHZhciBvbGRWS2lkXHJcblxyXG4gICAgdmFyIG9sZEtleVxyXG4gICAgdmFyIG5ld0tleVxyXG5cclxuICAgIHZhciBvbGRWUHJvcHMgPSBvbGRWTm9kZS5wcm9wc1xyXG4gICAgdmFyIG5ld1ZQcm9wcyA9IG5ld1ZOb2RlLnByb3BzXHJcblxyXG4gICAgdmFyIG9sZFZLaWRzID0gb2xkVk5vZGUuY2hpbGRyZW5cclxuICAgIHZhciBuZXdWS2lkcyA9IG5ld1ZOb2RlLmNoaWxkcmVuXHJcblxyXG4gICAgdmFyIG9sZEhlYWQgPSAwXHJcbiAgICB2YXIgbmV3SGVhZCA9IDBcclxuICAgIHZhciBvbGRUYWlsID0gb2xkVktpZHMubGVuZ3RoIC0gMVxyXG4gICAgdmFyIG5ld1RhaWwgPSBuZXdWS2lkcy5sZW5ndGggLSAxXHJcblxyXG4gICAgaXNTdmcgPSBpc1N2ZyB8fCBuZXdWTm9kZS5uYW1lID09PSBcInN2Z1wiXHJcblxyXG4gICAgZm9yICh2YXIgaSBpbiBtZXJnZShvbGRWUHJvcHMsIG5ld1ZQcm9wcykpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIChpID09PSBcInZhbHVlXCIgfHwgaSA9PT0gXCJzZWxlY3RlZFwiIHx8IGkgPT09IFwiY2hlY2tlZFwiXHJcbiAgICAgICAgICA/IG5vZGVbaV1cclxuICAgICAgICAgIDogb2xkVlByb3BzW2ldKSAhPT0gbmV3VlByb3BzW2ldXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBhdGNoUHJvcGVydHkobm9kZSwgaSwgb2xkVlByb3BzW2ldLCBuZXdWUHJvcHNbaV0sIGxpc3RlbmVyLCBpc1N2ZylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlIChuZXdIZWFkIDw9IG5ld1RhaWwgJiYgb2xkSGVhZCA8PSBvbGRUYWlsKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAob2xkS2V5ID0gZ2V0S2V5KG9sZFZLaWRzW29sZEhlYWRdKSkgPT0gbnVsbCB8fFxyXG4gICAgICAgIG9sZEtleSAhPT0gZ2V0S2V5KG5ld1ZLaWRzW25ld0hlYWRdKVxyXG4gICAgICApIHtcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwYXRjaChcclxuICAgICAgICBub2RlLFxyXG4gICAgICAgIG9sZFZLaWRzW29sZEhlYWRdLm5vZGUsXHJcbiAgICAgICAgb2xkVktpZHNbb2xkSGVhZF0sXHJcbiAgICAgICAgKG5ld1ZLaWRzW25ld0hlYWRdID0gZ2V0Vk5vZGUoXHJcbiAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkKytdLFxyXG4gICAgICAgICAgb2xkVktpZHNbb2xkSGVhZCsrXVxyXG4gICAgICAgICkpLFxyXG4gICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgIGlzU3ZnXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsICYmIG9sZEhlYWQgPD0gb2xkVGFpbCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgKG9sZEtleSA9IGdldEtleShvbGRWS2lkc1tvbGRUYWlsXSkpID09IG51bGwgfHxcclxuICAgICAgICBvbGRLZXkgIT09IGdldEtleShuZXdWS2lkc1tuZXdUYWlsXSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGF0Y2goXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRUYWlsXS5ub2RlLFxyXG4gICAgICAgIG9sZFZLaWRzW29sZFRhaWxdLFxyXG4gICAgICAgIChuZXdWS2lkc1tuZXdUYWlsXSA9IGdldFZOb2RlKFxyXG4gICAgICAgICAgbmV3VktpZHNbbmV3VGFpbC0tXSxcclxuICAgICAgICAgIG9sZFZLaWRzW29sZFRhaWwtLV1cclxuICAgICAgICApKSxcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBpc1N2Z1xyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9sZEhlYWQgPiBvbGRUYWlsKSB7XHJcbiAgICAgIHdoaWxlIChuZXdIZWFkIDw9IG5ld1RhaWwpIHtcclxuICAgICAgICBub2RlLmluc2VydEJlZm9yZShcclxuICAgICAgICAgIGNyZWF0ZU5vZGUoXHJcbiAgICAgICAgICAgIChuZXdWS2lkc1tuZXdIZWFkXSA9IGdldFZOb2RlKG5ld1ZLaWRzW25ld0hlYWQrK10pKSxcclxuICAgICAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgKG9sZFZLaWQgPSBvbGRWS2lkc1tvbGRIZWFkXSkgJiYgb2xkVktpZC5ub2RlXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKG5ld0hlYWQgPiBuZXdUYWlsKSB7XHJcbiAgICAgIHdoaWxlIChvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG9sZFZLaWRzW29sZEhlYWQrK10ubm9kZSlcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgaSA9IG9sZEhlYWQsIGtleWVkID0ge30sIG5ld0tleWVkID0ge307IGkgPD0gb2xkVGFpbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKChvbGRLZXkgPSBvbGRWS2lkc1tpXS5rZXkpICE9IG51bGwpIHtcclxuICAgICAgICAgIGtleWVkW29sZEtleV0gPSBvbGRWS2lkc1tpXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgd2hpbGUgKG5ld0hlYWQgPD0gbmV3VGFpbCkge1xyXG4gICAgICAgIG9sZEtleSA9IGdldEtleSgob2xkVktpZCA9IG9sZFZLaWRzW29sZEhlYWRdKSlcclxuICAgICAgICBuZXdLZXkgPSBnZXRLZXkoXHJcbiAgICAgICAgICAobmV3VktpZHNbbmV3SGVhZF0gPSBnZXRWTm9kZShuZXdWS2lkc1tuZXdIZWFkXSwgb2xkVktpZCkpXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBuZXdLZXllZFtvbGRLZXldIHx8XHJcbiAgICAgICAgICAobmV3S2V5ICE9IG51bGwgJiYgbmV3S2V5ID09PSBnZXRLZXkob2xkVktpZHNbb2xkSGVhZCArIDFdKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGlmIChvbGRLZXkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG9sZFZLaWQubm9kZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG9sZEhlYWQrK1xyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuZXdLZXkgPT0gbnVsbCB8fCBvbGRWTm9kZS50eXBlID09PSBSRUNZQ0xFRF9OT0RFKSB7XHJcbiAgICAgICAgICBpZiAob2xkS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgbm9kZSxcclxuICAgICAgICAgICAgICBvbGRWS2lkICYmIG9sZFZLaWQubm9kZSxcclxuICAgICAgICAgICAgICBvbGRWS2lkLFxyXG4gICAgICAgICAgICAgIG5ld1ZLaWRzW25ld0hlYWRdLFxyXG4gICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgbmV3SGVhZCsrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvbGRIZWFkKytcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKG9sZEtleSA9PT0gbmV3S2V5KSB7XHJcbiAgICAgICAgICAgIHBhdGNoKFxyXG4gICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZC5ub2RlLFxyXG4gICAgICAgICAgICAgIG9sZFZLaWQsXHJcbiAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgICAgICAgaXNTdmdcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBuZXdLZXllZFtuZXdLZXldID0gdHJ1ZVxyXG4gICAgICAgICAgICBvbGRIZWFkKytcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgodG1wVktpZCA9IGtleWVkW25ld0tleV0pICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICBwYXRjaChcclxuICAgICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgICBub2RlLmluc2VydEJlZm9yZSh0bXBWS2lkLm5vZGUsIG9sZFZLaWQgJiYgb2xkVktpZC5ub2RlKSxcclxuICAgICAgICAgICAgICAgIHRtcFZLaWQsXHJcbiAgICAgICAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkXSxcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgICAgaXNTdmdcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgbmV3S2V5ZWRbbmV3S2V5XSA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBwYXRjaChcclxuICAgICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgICBvbGRWS2lkICYmIG9sZFZLaWQubm9kZSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkXSxcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgICAgaXNTdmdcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG5ld0hlYWQrK1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgd2hpbGUgKG9sZEhlYWQgPD0gb2xkVGFpbCkge1xyXG4gICAgICAgIGlmIChnZXRLZXkoKG9sZFZLaWQgPSBvbGRWS2lkc1tvbGRIZWFkKytdKSkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkLm5vZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKHZhciBpIGluIGtleWVkKSB7XHJcbiAgICAgICAgaWYgKG5ld0tleWVkW2ldID09IG51bGwpIHtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoa2V5ZWRbaV0ubm9kZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAobmV3Vk5vZGUubm9kZSA9IG5vZGUpXHJcbn1cclxuXHJcbnZhciBwcm9wc0NoYW5nZWQgPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgZm9yICh2YXIgayBpbiBhKSBpZiAoYVtrXSAhPT0gYltrXSkgcmV0dXJuIHRydWVcclxuICBmb3IgKHZhciBrIGluIGIpIGlmIChhW2tdICE9PSBiW2tdKSByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG52YXIgZ2V0VGV4dFZOb2RlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIHJldHVybiB0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIiA/IG5vZGUgOiBjcmVhdGVUZXh0Vk5vZGUobm9kZSlcclxufVxyXG5cclxudmFyIGdldFZOb2RlID0gZnVuY3Rpb24obmV3Vk5vZGUsIG9sZFZOb2RlKSB7XHJcbiAgcmV0dXJuIG5ld1ZOb2RlLnR5cGUgPT09IExBWllfTk9ERVxyXG4gICAgPyAoKCFvbGRWTm9kZSB8fCAhb2xkVk5vZGUubGF6eSB8fCBwcm9wc0NoYW5nZWQob2xkVk5vZGUubGF6eSwgbmV3Vk5vZGUubGF6eSkpXHJcbiAgICAgICAgJiYgKChvbGRWTm9kZSA9IGdldFRleHRWTm9kZShuZXdWTm9kZS5sYXp5LnZpZXcobmV3Vk5vZGUubGF6eSkpKS5sYXp5ID1cclxuICAgICAgICAgIG5ld1ZOb2RlLmxhenkpLFxyXG4gICAgICBvbGRWTm9kZSlcclxuICAgIDogbmV3Vk5vZGVcclxufVxyXG5cclxudmFyIGNyZWF0ZVZOb2RlID0gZnVuY3Rpb24obmFtZSwgcHJvcHMsIGNoaWxkcmVuLCBub2RlLCBrZXksIHR5cGUpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogbmFtZSxcclxuICAgIHByb3BzOiBwcm9wcyxcclxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgIG5vZGU6IG5vZGUsXHJcbiAgICB0eXBlOiB0eXBlLFxyXG4gICAga2V5OiBrZXlcclxuICB9XHJcbn1cclxuXHJcbnZhciBjcmVhdGVUZXh0Vk5vZGUgPSBmdW5jdGlvbih2YWx1ZSwgbm9kZSkge1xyXG4gIHJldHVybiBjcmVhdGVWTm9kZSh2YWx1ZSwgRU1QVFlfT0JKLCBFTVBUWV9BUlIsIG5vZGUsIHVuZGVmaW5lZCwgVEVYVF9OT0RFKVxyXG59XHJcblxyXG52YXIgcmVjeWNsZU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IFRFWFRfTk9ERVxyXG4gICAgPyBjcmVhdGVUZXh0Vk5vZGUobm9kZS5ub2RlVmFsdWUsIG5vZGUpXHJcbiAgICA6IGNyZWF0ZVZOb2RlKFxyXG4gICAgICAgIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICBFTVBUWV9PQkosXHJcbiAgICAgICAgbWFwLmNhbGwobm9kZS5jaGlsZE5vZGVzLCByZWN5Y2xlTm9kZSksXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgUkVDWUNMRURfTk9ERVxyXG4gICAgICApXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgTGF6eSA9IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGxhenk6IHByb3BzLFxyXG4gICAgdHlwZTogTEFaWV9OT0RFXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGggPSBmdW5jdGlvbihuYW1lLCBwcm9wcykge1xyXG4gIGZvciAodmFyIHZkb20sIHJlc3QgPSBbXSwgY2hpbGRyZW4gPSBbXSwgaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkge1xyXG4gICAgcmVzdC5wdXNoKGFyZ3VtZW50c1tpXSlcclxuICB9XHJcblxyXG4gIHdoaWxlIChyZXN0Lmxlbmd0aCA+IDApIHtcclxuICAgIGlmIChpc0FycmF5KCh2ZG9tID0gcmVzdC5wb3AoKSkpKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSB2ZG9tLmxlbmd0aDsgaS0tID4gMDsgKSB7XHJcbiAgICAgICAgcmVzdC5wdXNoKHZkb21baV0pXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodmRvbSA9PT0gZmFsc2UgfHwgdmRvbSA9PT0gdHJ1ZSB8fCB2ZG9tID09IG51bGwpIHtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoaWxkcmVuLnB1c2goZ2V0VGV4dFZOb2RlKHZkb20pKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvcHMgPSBwcm9wcyB8fCBFTVBUWV9PQkpcclxuXHJcbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCJcclxuICAgID8gbmFtZShwcm9wcywgY2hpbGRyZW4pXHJcbiAgICA6IGNyZWF0ZVZOb2RlKG5hbWUsIHByb3BzLCBjaGlsZHJlbiwgdW5kZWZpbmVkLCBwcm9wcy5rZXkpXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgYXBwID0gZnVuY3Rpb24ocHJvcHMpIHtcclxuICB2YXIgc3RhdGUgPSB7fVxyXG4gIHZhciBsb2NrID0gZmFsc2VcclxuICB2YXIgdmlldyA9IHByb3BzLnZpZXdcclxuICB2YXIgbm9kZSA9IHByb3BzLm5vZGVcclxuICB2YXIgdmRvbSA9IG5vZGUgJiYgcmVjeWNsZU5vZGUobm9kZSlcclxuICB2YXIgc3Vic2NyaXB0aW9ucyA9IHByb3BzLnN1YnNjcmlwdGlvbnNcclxuICB2YXIgc3VicyA9IFtdXHJcbiAgdmFyIG9uRW5kID0gcHJvcHMub25FbmRcclxuXHJcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGRpc3BhdGNoKHRoaXMuYWN0aW9uc1tldmVudC50eXBlXSwgZXZlbnQpXHJcbiAgfVxyXG5cclxuICB2YXIgc2V0U3RhdGUgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlICE9PSBuZXdTdGF0ZSkge1xyXG4gICAgICBzdGF0ZSA9IG5ld1N0YXRlXHJcbiAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgc3VicyA9IHBhdGNoU3VicyhzdWJzLCBiYXRjaChbc3Vic2NyaXB0aW9ucyhzdGF0ZSldKSwgZGlzcGF0Y2gpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZpZXcgJiYgIWxvY2spIGRlZmVyKHJlbmRlciwgKGxvY2sgPSB0cnVlKSlcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxuXHJcbiAgdmFyIGRpc3BhdGNoID0gKHByb3BzLm1pZGRsZXdhcmUgfHxcclxuICAgIGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9KShmdW5jdGlvbihhY3Rpb24sIHByb3BzKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgID8gZGlzcGF0Y2goYWN0aW9uKHN0YXRlLCBwcm9wcykpXHJcbiAgICAgIDogaXNBcnJheShhY3Rpb24pXHJcbiAgICAgID8gdHlwZW9mIGFjdGlvblswXSA9PT0gXCJmdW5jdGlvblwiIHx8IGlzQXJyYXkoYWN0aW9uWzBdKVxyXG4gICAgICAgID8gZGlzcGF0Y2goXHJcbiAgICAgICAgICAgIGFjdGlvblswXSxcclxuICAgICAgICAgICAgdHlwZW9mIGFjdGlvblsxXSA9PT0gXCJmdW5jdGlvblwiID8gYWN0aW9uWzFdKHByb3BzKSA6IGFjdGlvblsxXVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogKGJhdGNoKGFjdGlvbi5zbGljZSgxKSkubWFwKGZ1bmN0aW9uKGZ4KSB7XHJcbiAgICAgICAgICAgIGZ4ICYmIGZ4WzBdKGRpc3BhdGNoLCBmeFsxXSlcclxuICAgICAgICAgIH0sIHNldFN0YXRlKGFjdGlvblswXSkpLFxyXG4gICAgICAgICAgc3RhdGUpXHJcbiAgICAgIDogc2V0U3RhdGUoYWN0aW9uKVxyXG4gIH0pXHJcblxyXG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIGxvY2sgPSBmYWxzZVxyXG4gICAgbm9kZSA9IHBhdGNoKFxyXG4gICAgICBub2RlLnBhcmVudE5vZGUsXHJcbiAgICAgIG5vZGUsXHJcbiAgICAgIHZkb20sXHJcbiAgICAgICh2ZG9tID0gZ2V0VGV4dFZOb2RlKHZpZXcoc3RhdGUpKSksXHJcbiAgICAgIGxpc3RlbmVyXHJcbiAgICApXHJcbiAgICBvbkVuZCgpXHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaChwcm9wcy5pbml0KVxyXG59XHJcbiIsInZhciB0aW1lRnggPSBmdW5jdGlvbiAoZng6IGFueSkge1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoXHJcbiAgICAgICAgYWN0aW9uOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmeCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBkZWxheTogcHJvcHMuZGVsYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHZhciB0aW1lb3V0ID0gdGltZUZ4KFxyXG5cclxuICAgIGZ1bmN0aW9uIChcclxuICAgICAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgICAgIHByb3BzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb3BzLmRlbGF5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmV4cG9ydCB2YXIgaW50ZXJ2YWwgPSB0aW1lRngoXHJcblxyXG4gICAgZnVuY3Rpb24gKFxyXG4gICAgICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICB2YXIgaWQgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvcHMuZGVsYXlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuKTtcclxuXHJcblxyXG4vLyBleHBvcnQgdmFyIG5vd1xyXG4vLyBleHBvcnQgdmFyIHJldHJ5XHJcbi8vIGV4cG9ydCB2YXIgZGVib3VuY2VcclxuLy8gZXhwb3J0IHZhciB0aHJvdHRsZVxyXG4vLyBleHBvcnQgdmFyIGlkbGVDYWxsYmFjaz9cclxuIiwiXHJcbmltcG9ydCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwQXV0aGVudGljYXRlZFByb3BzXCI7XHJcbmltcG9ydCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9ja1wiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IElIdHRwT3V0cHV0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBPdXRwdXRcIjtcclxuaW1wb3J0IHsgSUh0dHBTZXF1ZW50aWFsRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cFNlcXVlbnRpYWxGZXRjaEl0ZW1cIjtcclxuXHJcbmNvbnN0IHNlcXVlbnRpYWxIdHRwRWZmZWN0ID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHNlcXVlbnRpYWxCbG9ja3M6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s+KTogdm9pZCA9PiB7XHJcblxyXG4gICAgLy8gRWFjaCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrIHdpbGwgcnVuIHNlcXVlbnRpYWxseVxyXG4gICAgLy8gRWFjaCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyBpbiBlYWNoIGJsb2NrIHdpbGwgcnVubiBpbiBwYXJhbGxlbFxyXG4gICAgbGV0IGJsb2NrOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrO1xyXG4gICAgbGV0IHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgbGV0IGh0dHBDYWxsOiBhbnk7XHJcbiAgICBsZXQgbGFzdEh0dHBDYWxsOiBhbnk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IHNlcXVlbnRpYWxCbG9ja3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICAgICAgYmxvY2sgPSBzZXF1ZW50aWFsQmxvY2tzW2ldO1xyXG5cclxuICAgICAgICBpZiAoYmxvY2sgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJsb2NrKSkge1xyXG5cclxuICAgICAgICAgICAgaHR0cENhbGwgPSB7XHJcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZTogcHJvY2Vzc0Jsb2NrLFxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgYmxvY2s6IGJsb2NrLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IGAke2l9YFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBodHRwQ2FsbCA9IHtcclxuICAgICAgICAgICAgICAgIGRlbGVnYXRlOiBwcm9jZXNzUHJvcHMsXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXHJcbiAgICAgICAgICAgICAgICBibG9jazogYmxvY2ssXHJcbiAgICAgICAgICAgICAgICBpbmRleDogYCR7aX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc3VjY2Vzcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGFzdEh0dHBDYWxsKSB7XHJcblxyXG4gICAgICAgICAgICBodHRwQ2FsbC5uZXh0SHR0cENhbGwgPSBsYXN0SHR0cENhbGw7XHJcbiAgICAgICAgICAgIGh0dHBDYWxsLm5leHRJbmRleCA9IGxhc3RIdHRwQ2FsbC5pbmRleDtcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEJsb2NrID0gbGFzdEh0dHBDYWxsLmJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFzdEh0dHBDYWxsID0gaHR0cENhbGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGh0dHBDYWxsKSB7XHJcblxyXG4gICAgICAgIGh0dHBDYWxsLmRlbGVnYXRlKFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5kaXNwYXRjaCxcclxuICAgICAgICAgICAgaHR0cENhbGwuYmxvY2ssXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLm5leHRIdHRwQ2FsbCxcclxuICAgICAgICAgICAgaHR0cENhbGwuaW5kZXhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwcm9jZXNzQmxvY2sgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgYmxvY2s6IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2ssXHJcbiAgICBuZXh0RGVsZWdhdGU6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGxldCBwYXJhbGxlbFByb3BzOiBBcnJheTxJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcz4gPSBibG9jayBhcyBBcnJheTxJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcz47XHJcbiAgICBjb25zdCBkZWxlZ2F0ZXM6IGFueVtdID0gW107XHJcbiAgICBsZXQgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzO1xyXG5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFyYWxsZWxQcm9wcy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICBwcm9wcyA9IHBhcmFsbGVsUHJvcHNbal07XHJcblxyXG4gICAgICAgIGRlbGVnYXRlcy5wdXNoKFxyXG4gICAgICAgICAgICBwcm9jZXNzUHJvcHMoXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICAgICAgbmV4dERlbGVnYXRlLFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgUHJvbWlzZVxyXG4gICAgICAgICAgICAuYWxsKGRlbGVnYXRlcylcclxuICAgICAgICAgICAgLnRoZW4oKVxyXG4gICAgICAgICAgICAuY2F0Y2goKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHByb2Nlc3NQcm9wcyA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMsXHJcbiAgICBuZXh0RGVsZWdhdGU6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghcHJvcHMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3V0cHV0OiBJSHR0cE91dHB1dCA9IHtcclxuICAgICAgICBvazogZmFsc2UsXHJcbiAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25GYWlsOiBmYWxzZSxcclxuICAgICAgICBwYXJzZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgfTtcclxuXHJcbiAgICBodHRwKFxyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIG91dHB1dCxcclxuICAgICAgICBuZXh0RGVsZWdhdGVcclxuICAgICk7XHJcbn07XHJcblxyXG5jb25zdCBodHRwRWZmZWN0ID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc1xyXG4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBpZiAoIXByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG91dHB1dDogSUh0dHBPdXRwdXQgPSB7XHJcbiAgICAgICAgb2s6IGZhbHNlLFxyXG4gICAgICAgIHVybDogcHJvcHMudXJsLFxyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uRmFpbDogZmFsc2UsXHJcbiAgICAgICAgcGFyc2VUeXBlOiBwcm9wcy5wYXJzZVR5cGUgPz8gJ2pzb24nLFxyXG4gICAgfTtcclxuXHJcbiAgICBodHRwKFxyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIG91dHB1dFxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGh0dHAgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzLFxyXG4gICAgb3V0cHV0OiBJSHR0cE91dHB1dCxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55ID0gbnVsbCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGZldGNoKFxyXG4gICAgICAgIHByb3BzLnVybCxcclxuICAgICAgICBwcm9wcy5vcHRpb25zKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0cHV0Lm9rID0gcmVzcG9uc2Uub2sgPT09IHRydWU7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQuc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnR5cGUgPSByZXNwb25zZS50eXBlO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlZGlyZWN0ZWQgPSByZXNwb25zZS5yZWRpcmVjdGVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oZWFkZXJzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5jYWxsSUQgPSByZXNwb25zZS5oZWFkZXJzLmdldChcIkNhbGxJRFwiKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0LmNvbnRlbnRUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG91dHB1dC5jb250ZW50VHlwZS5pbmRleE9mKFwiYXBwbGljYXRpb24vanNvblwiKSAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wYXJzZVR5cGUgPSBcImpzb25cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5hdXRoZW50aWNhdGlvbkZhaWwgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMub25BdXRoZW50aWNhdGlvbkZhaWxBY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5yZXNwb25zZU51bGwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2U6IGFueSkge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQuZXJyb3IgKz0gYEVycm9yIHRocm93biB3aXRoIHJlc3BvbnNlLnRleHQoKVxyXG5gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblxyXG4gICAgICAgICAgICBvdXRwdXQudGV4dERhdGEgPSByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0XHJcbiAgICAgICAgICAgICAgICAmJiBvdXRwdXQucGFyc2VUeXBlID09PSAnanNvbidcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuanNvbkRhdGEgPSBKU09OLnBhcnNlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmVycm9yICs9IGBFcnJvciB0aHJvd24gcGFyc2luZyByZXNwb25zZS50ZXh0KCkgYXMganNvblxyXG5gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW91dHB1dC5vaykge1xyXG5cclxuICAgICAgICAgICAgICAgIHRocm93IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXh0RGVsZWdhdGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dERlbGVnYXRlLmRlbGVnYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5kaXNwYXRjaCxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUuYmxvY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dERlbGVnYXRlLm5leHRIdHRwQ2FsbCxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUuaW5kZXhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dC5lcnJvciArPSBlcnJvcjtcclxuXHJcbiAgICAgICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgcHJvcHMuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdIdHRwID0gKHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyk6IElIdHRwRmV0Y2hJdGVtID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIGh0dHBFZmZlY3QsXHJcbiAgICAgICAgcHJvcHNcclxuICAgIF1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdTZXF1ZW50aWFsSHR0cCA9IChwcm9wc0Jsb2NrOiBBcnJheTxJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrPik6IElIdHRwU2VxdWVudGlhbEZldGNoSXRlbSA9PiB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBzZXF1ZW50aWFsSHR0cEVmZmVjdCxcclxuICAgICAgICBwcm9wc0Jsb2NrXHJcbiAgICBdXHJcbn1cclxuIiwiXHJcbmNvbnN0IEtleXMgPSB7XHJcblxyXG4gICAgc3RhcnRVcmw6ICdzdGFydFVybCcsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEtleXM7XHJcblxyXG4iLCJpbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwRWZmZWN0IGltcGxlbWVudHMgSUh0dHBFZmZlY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB1cmw6IHN0cmluZyxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25EZWxlZ2F0ZSA9IGFjdGlvbkRlbGVnYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheTtcclxufVxyXG4iLCJcclxuXHJcbmNvbnN0IGdVdGlsaXRpZXMgPSB7XHJcblxyXG4gICAgcm91bmRVcFRvTmVhcmVzdFRlbjogKHZhbHVlOiBudW1iZXIpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yKHZhbHVlIC8gMTApO1xyXG5cclxuICAgICAgICByZXR1cm4gKGZsb29yICsgMSkgKiAxMDtcclxuICAgIH0sXHJcblxyXG4gICAgcm91bmREb3duVG9OZWFyZXN0VGVuOiAodmFsdWU6IG51bWJlcikgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmbG9vciA9IE1hdGguZmxvb3IodmFsdWUgLyAxMCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmbG9vciAqIDEwO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb252ZXJ0TW1Ub0ZlZXRJbmNoZXM6IChtbTogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5jaGVzID0gbW0gKiAwLjAzOTM3O1xyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy5jb252ZXJ0SW5jaGVzVG9GZWV0SW5jaGVzKGluY2hlcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldERpcmVjdG9yeTogKGZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IGZpbGVQYXRoLm1hdGNoKC8oLiopW1xcL1xcXFxdLyk7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzXHJcbiAgICAgICAgICAgICYmIG1hdGNoZXMubGVuZ3RoID4gMFxyXG4gICAgICAgICkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvdW50Q2hhcmFjdGVyOiAoXHJcbiAgICAgICAgaW5wdXQ6IHN0cmluZyxcclxuICAgICAgICBjaGFyYWN0ZXI6IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICBsZXQgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbnB1dFtpXSA9PT0gY2hhcmFjdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbnZlcnRJbmNoZXNUb0ZlZXRJbmNoZXM6IChpbmNoZXM6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZlZXQgPSBNYXRoLmZsb29yKGluY2hlcyAvIDEyKTtcclxuICAgICAgICBjb25zdCBpbmNoZXNSZWFtaW5pbmcgPSBpbmNoZXMgJSAxMjtcclxuICAgICAgICBjb25zdCBpbmNoZXNSZWFtaW5pbmdSb3VuZGVkID0gTWF0aC5yb3VuZChpbmNoZXNSZWFtaW5pbmcgKiAxMCkgLyAxMDsgLy8gMSBkZWNpbWFsIHBsYWNlc1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoZmVldCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGAke2ZlZXR9JyBgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluY2hlc1JlYW1pbmluZ1JvdW5kZWQgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBgJHtyZXN1bHR9JHtpbmNoZXNSZWFtaW5pbmdSb3VuZGVkfVwiYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzTnVsbE9yV2hpdGVTcGFjZTogKGlucHV0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbFxyXG4gICAgICAgICAgICB8fCBpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0ID0gYCR7aW5wdXR9YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0Lm1hdGNoKC9eXFxzKiQvKSAhPT0gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgY2hlY2tBcnJheXNFcXVhbDogKGE6IHN0cmluZ1tdLCBiOiBzdHJpbmdbXSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoYSA9PT0gYikge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYSA9PT0gbnVsbFxyXG4gICAgICAgICAgICB8fCBiID09PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB5b3UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluc2lkZVxyXG4gICAgICAgIC8vIHRoZSBhcnJheSwgeW91IHNob3VsZCBzb3J0IGJvdGggYXJyYXlzIGhlcmUuXHJcbiAgICAgICAgLy8gUGxlYXNlIG5vdGUgdGhhdCBjYWxsaW5nIHNvcnQgb24gYW4gYXJyYXkgd2lsbCBtb2RpZnkgdGhhdCBhcnJheS5cclxuICAgICAgICAvLyB5b3UgbWlnaHQgd2FudCB0byBjbG9uZSB5b3VyIGFycmF5IGZpcnN0LlxyXG5cclxuICAgICAgICBjb25zdCB4OiBzdHJpbmdbXSA9IFsuLi5hXTtcclxuICAgICAgICBjb25zdCB5OiBzdHJpbmdbXSA9IFsuLi5iXTtcclxuICAgICAgICBcclxuICAgICAgICB4LnNvcnQoKTtcclxuICAgICAgICB5LnNvcnQoKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeFtpXSAhPT0geVtpXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGUoYXJyYXk6IEFycmF5PGFueT4pOiBBcnJheTxhbnk+IHtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICAgICAgICBsZXQgdGVtcG9yYXJ5VmFsdWU6IGFueVxyXG4gICAgICAgIGxldCByYW5kb21JbmRleDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICBpc051bWVyaWM6IChpbnB1dDogYW55KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZShpbnB1dCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhaXNOYU4oaW5wdXQpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc05lZ2F0aXZlTnVtZXJpYzogKGlucHV0OiBhbnkpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFnVXRpbGl0aWVzLmlzTnVtZXJpYyhpbnB1dCkpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAraW5wdXQgPCAwOyAvLyArIGNvbnZlcnRzIGEgc3RyaW5nIHRvIGEgbnVtYmVyIGlmIGl0IGNvbnNpc3RzIG9ubHkgb2YgZGlnaXRzLlxyXG4gICAgfSxcclxuXHJcbiAgICBoYXNEdXBsaWNhdGVzOiA8VD4oaW5wdXQ6IEFycmF5PFQ+KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChuZXcgU2V0KGlucHV0KS5zaXplICE9PSBpbnB1dC5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBleHRlbmQ6IDxUPihhcnJheTE6IEFycmF5PFQ+LCBhcnJheTI6IEFycmF5PFQ+KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGFycmF5Mi5mb3JFYWNoKChpdGVtOiBUKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhcnJheTEucHVzaChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJldHR5UHJpbnRKc29uRnJvbVN0cmluZzogKGlucHV0OiBzdHJpbmcgfCBudWxsKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFpbnB1dCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy5wcmV0dHlQcmludEpzb25Gcm9tT2JqZWN0KEpTT04ucGFyc2UoaW5wdXQpKTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJldHR5UHJpbnRKc29uRnJvbU9iamVjdDogKGlucHV0OiBvYmplY3QgfCBudWxsKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFpbnB1dCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgICAgIGlucHV0LFxyXG4gICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICA0IC8vIGluZGVudGVkIDQgc3BhY2VzXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNQb3NpdGl2ZU51bWVyaWM6IChpbnB1dDogYW55KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmICghZ1V0aWxpdGllcy5pc051bWVyaWMoaW5wdXQpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gTnVtYmVyKGlucHV0KSA+PSAwO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRUaW1lOiAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgbm93OiBEYXRlID0gbmV3IERhdGUoRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgY29uc3QgdGltZTogc3RyaW5nID0gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7KG5vdy5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfS0ke25vdy5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfSAke25vdy5nZXRIb3VycygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06JHtub3cuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06JHtub3cuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06OiR7bm93LmdldE1pbGxpc2Vjb25kcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKX06YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwbGl0QnlOZXdMaW5lOiAoaW5wdXQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UoaW5wdXQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHRzID0gaW5wdXQuc3BsaXQoL1tcXHJcXG5dKy8pO1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWQ6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHJcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFuZWQucHVzaCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5UGlwZTogKGlucHV0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGlucHV0LnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgY29uc3QgY2xlYW5lZDogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG5cclxuICAgICAgICByZXN1bHRzLmZvckVhY2goKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UodmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xlYW5lZC5wdXNoKHZhbHVlLnRyaW0oKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsZWFuZWQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwbGl0QnlOZXdMaW5lQW5kT3JkZXI6IChpbnB1dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBnVXRpbGl0aWVzXHJcbiAgICAgICAgICAgIC5zcGxpdEJ5TmV3TGluZShpbnB1dClcclxuICAgICAgICAgICAgLnNvcnQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgam9pbkJ5TmV3TGluZTogKGlucHV0OiBBcnJheTxzdHJpbmc+KTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFpbnB1dFxyXG4gICAgICAgICAgICB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dC5qb2luKCdcXG4nKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlQWxsQ2hpbGRyZW46IChwYXJlbnQ6IEVsZW1lbnQpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHBhcmVudC5maXJzdENoaWxkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaXNPZGQ6ICh4OiBudW1iZXIpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHggJSAyID09PSAxO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG9ydFByaW50VGV4dDogKFxyXG4gICAgICAgIGlucHV0OiBzdHJpbmcsXHJcbiAgICAgICAgbWF4TGVuZ3RoOiBudW1iZXIgPSAxMDApOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UoaW5wdXQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaXJzdE5ld0xpbmVJbmRleDogbnVtYmVyID0gZ1V0aWxpdGllcy5nZXRGaXJzdE5ld0xpbmVJbmRleChpbnB1dCk7XHJcblxyXG4gICAgICAgIGlmIChmaXJzdE5ld0xpbmVJbmRleCA+IDBcclxuICAgICAgICAgICAgJiYgZmlyc3ROZXdMaW5lSW5kZXggPD0gbWF4TGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5zdWJzdHIoMCwgZmlyc3ROZXdMaW5lSW5kZXggLSAxKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnVXRpbGl0aWVzLnRyaW1BbmRBZGRFbGxpcHNpcyhvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCA8PSBtYXhMZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGlucHV0LnN1YnN0cigwLCBtYXhMZW5ndGgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy50cmltQW5kQWRkRWxsaXBzaXMob3V0cHV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgdHJpbUFuZEFkZEVsbGlwc2lzOiAoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXQ6IHN0cmluZyA9IGlucHV0LnRyaW0oKTtcclxuICAgICAgICBsZXQgcHVuY3R1YXRpb25SZWdleDogUmVnRXhwID0gL1suLFxcLyMhJCVcXF4mXFwqOzp7fT1cXC1fYH4oKV0vZztcclxuICAgICAgICBsZXQgc3BhY2VSZWdleDogUmVnRXhwID0gL1xcVysvZztcclxuICAgICAgICBsZXQgbGFzdENoYXJhY3Rlcjogc3RyaW5nID0gb3V0cHV0W291dHB1dC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgbGV0IGxhc3RDaGFyYWN0ZXJJc1B1bmN0dWF0aW9uOiBib29sZWFuID1cclxuICAgICAgICAgICAgcHVuY3R1YXRpb25SZWdleC50ZXN0KGxhc3RDaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgIHx8IHNwYWNlUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKTtcclxuXHJcblxyXG4gICAgICAgIHdoaWxlIChsYXN0Q2hhcmFjdGVySXNQdW5jdHVhdGlvbiA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnN1YnN0cigwLCBvdXRwdXQubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGxhc3RDaGFyYWN0ZXIgPSBvdXRwdXRbb3V0cHV0Lmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgbGFzdENoYXJhY3RlcklzUHVuY3R1YXRpb24gPVxyXG4gICAgICAgICAgICAgICAgcHVuY3R1YXRpb25SZWdleC50ZXN0KGxhc3RDaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICB8fCBzcGFjZVJlZ2V4LnRlc3QobGFzdENoYXJhY3Rlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7b3V0cHV0fS4uLmA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEZpcnN0TmV3TGluZUluZGV4OiAoaW5wdXQ6IHN0cmluZyk6IG51bWJlciA9PiB7XHJcblxyXG4gICAgICAgIGxldCBjaGFyYWN0ZXI6IHN0cmluZztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgY2hhcmFjdGVyID0gaW5wdXRbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hhcmFjdGVyID09PSAnXFxuJ1xyXG4gICAgICAgICAgICAgICAgfHwgY2hhcmFjdGVyID09PSAnXFxyJykge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwcGVyQ2FzZUZpcnN0TGV0dGVyOiAoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGlucHV0LnNsaWNlKDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZW5lcmF0ZUd1aWQ6ICh1c2VIeXBlbnM6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGxldCBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGxldCBkMiA9IChwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICAmJiBwZXJmb3JtYW5jZS5ub3dcclxuICAgICAgICAgICAgJiYgKHBlcmZvcm1hbmNlLm5vdygpICogMTAwMCkpIHx8IDA7XHJcblxyXG4gICAgICAgIGxldCBwYXR0ZXJuID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCc7XHJcblxyXG4gICAgICAgIGlmICghdXNlSHlwZW5zKSB7XHJcbiAgICAgICAgICAgIHBhdHRlcm4gPSAneHh4eHh4eHh4eHh4NHh4eHl4eHh4eHh4eHh4eHh4eHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ3VpZCA9IHBhdHRlcm5cclxuICAgICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgICAvW3h5XS9nLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMTY7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IChkICsgcikgJSAxNiB8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IChkMiArIHIpICUgMTYgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkMiA9IE1hdGguZmxvb3IoZDIgLyAxNik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGd1aWQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrSWZDaHJvbWU6ICgpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgLy8gcGxlYXNlIG5vdGUsIFxyXG4gICAgICAgIC8vIHRoYXQgSUUxMSBub3cgcmV0dXJucyB1bmRlZmluZWQgYWdhaW4gZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBhbmQgbmV3IE9wZXJhIDMwIG91dHB1dHMgdHJ1ZSBmb3Igd2luZG93LmNocm9tZVxyXG4gICAgICAgIC8vIGJ1dCBuZWVkcyB0byBjaGVjayBpZiB3aW5kb3cub3ByIGlzIG5vdCB1bmRlZmluZWRcclxuICAgICAgICAvLyBhbmQgbmV3IElFIEVkZ2Ugb3V0cHV0cyB0byB0cnVlIG5vdyBmb3Igd2luZG93LmNocm9tZVxyXG4gICAgICAgIC8vIGFuZCBpZiBub3QgaU9TIENocm9tZSBjaGVja1xyXG4gICAgICAgIC8vIHNvIHVzZSB0aGUgYmVsb3cgdXBkYXRlZCBjb25kaXRpb25cclxuXHJcbiAgICAgICAgbGV0IHRzV2luZG93OiBhbnkgPSB3aW5kb3cgYXMgYW55O1xyXG4gICAgICAgIGxldCBpc0Nocm9taXVtID0gdHNXaW5kb3cuY2hyb21lO1xyXG4gICAgICAgIGxldCB3aW5OYXYgPSB3aW5kb3cubmF2aWdhdG9yO1xyXG4gICAgICAgIGxldCB2ZW5kb3JOYW1lID0gd2luTmF2LnZlbmRvcjtcclxuICAgICAgICBsZXQgaXNPcGVyYSA9IHR5cGVvZiB0c1dpbmRvdy5vcHIgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICAgICAgbGV0IGlzSUVlZGdlID0gd2luTmF2LnVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSA+IC0xO1xyXG4gICAgICAgIGxldCBpc0lPU0Nocm9tZSA9IHdpbk5hdi51c2VyQWdlbnQubWF0Y2goXCJDcmlPU1wiKTtcclxuXHJcbiAgICAgICAgaWYgKGlzSU9TQ2hyb21lKSB7XHJcbiAgICAgICAgICAgIC8vIGlzIEdvb2dsZSBDaHJvbWUgb24gSU9TXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc0Nocm9taXVtICE9PSBudWxsXHJcbiAgICAgICAgICAgICYmIHR5cGVvZiBpc0Nocm9taXVtICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICYmIHZlbmRvck5hbWUgPT09IFwiR29vZ2xlIEluYy5cIlxyXG4gICAgICAgICAgICAmJiBpc09wZXJhID09PSBmYWxzZVxyXG4gICAgICAgICAgICAmJiBpc0lFZWRnZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgLy8gaXMgR29vZ2xlIENocm9tZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdVdGlsaXRpZXM7IiwiaW1wb3J0IElBY3Rpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSUFjdGlvblwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElIdHRwRWZmZWN0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2VmZmVjdHMvSUh0dHBFZmZlY3RcIjtcclxuaW1wb3J0IEh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL3N0YXRlL2VmZmVjdHMvSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5cclxuXHJcbi8vIFRoaXMgaXMgd2hlcmUgYWxsIGFsZXJ0cyB0byBkYXRhIGNoYW5nZXMgc2hvdWxkIGJlIG1hZGVcclxuY29uc3QgZ1N0YXRlQ29kZSA9IHtcclxuXHJcbiAgICBnZXRGcmVzaEtleUludDogKHN0YXRlOiBJU3RhdGUpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBuZXh0S2V5ID0gKytzdGF0ZS5uZXh0S2V5O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV4dEtleTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0RnJlc2hLZXk6IChzdGF0ZTogSVN0YXRlKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke2dTdGF0ZUNvZGUuZ2V0RnJlc2hLZXlJbnQoc3RhdGUpfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEd1aWRLZXk6ICgpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gVS5nZW5lcmF0ZUd1aWQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVTdGF0ZTogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICBsZXQgbmV3U3RhdGU6IElTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGRSZUxvYWREYXRhRWZmZWN0OiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IHZvaWQgPT4ge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBlZmZlY3Q6IElIdHRwRWZmZWN0IHwgdW5kZWZpbmVkID0gc3RhdGVcclxuICAgIC8vICAgICAgICAgLnJlcGVhdEVmZmVjdHNcclxuICAgIC8vICAgICAgICAgLnJlTG9hZEdldEh0dHBcclxuICAgIC8vICAgICAgICAgLmZpbmQoKGVmZmVjdDogSUh0dHBFZmZlY3QpID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZWZmZWN0Lm5hbWUgPT09IG5hbWU7XHJcbiAgICAvLyAgICAgICAgIH0pO1xyXG5cclxuICAgIC8vICAgICBpZiAoZWZmZWN0KSB7IC8vIGFscmVhZHkgYWRkZWQuXHJcbiAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0ID0gbmV3IEh0dHBFZmZlY3QoXHJcbiAgICAvLyAgICAgICAgIG5hbWUsXHJcbiAgICAvLyAgICAgICAgIHVybCxcclxuICAgIC8vICAgICAgICAgYWN0aW9uRGVsZWdhdGVcclxuICAgIC8vICAgICApO1xyXG5cclxuICAgIC8vICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHAucHVzaChodHRwRWZmZWN0KTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgQWRkUmVMb2FkRGF0YUVmZmVjdEltbWVkaWF0ZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHVybDogc3RyaW5nLFxyXG4gICAgICAgIGFjdGlvbkRlbGVnYXRlOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZWZmZWN0OiBJSHR0cEVmZmVjdCB8IHVuZGVmaW5lZCA9IHN0YXRlXHJcbiAgICAgICAgICAgIC5yZXBlYXRFZmZlY3RzXHJcbiAgICAgICAgICAgIC5yZUxvYWRHZXRIdHRwSW1tZWRpYXRlXHJcbiAgICAgICAgICAgIC5maW5kKChlZmZlY3Q6IElIdHRwRWZmZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVmZmVjdC5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGVmZmVjdCkgeyAvLyBhbHJlYWR5IGFkZGVkLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBodHRwRWZmZWN0OiBJSHR0cEVmZmVjdCA9IG5ldyBIdHRwRWZmZWN0KFxyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgIGFjdGlvbkRlbGVnYXRlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwSW1tZWRpYXRlLnB1c2goaHR0cEVmZmVjdCk7XHJcbiAgICB9LFxyXG5cclxuICAgIEFkZFJ1bkFjdGlvbkltbWVkaWF0ZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgYWN0aW9uRGVsZWdhdGU6IElBY3Rpb24pOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGUucHVzaChhY3Rpb25EZWxlZ2F0ZSk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0YXRlQ29kZTtcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQ29kZSA9IHtcclxuXHJcbiAgICBjbGVhckF1dGhlbnRpY2F0aW9uOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS51c2VyLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRlLnVzZXIuc3ViID0gXCJcIjtcclxuICAgICAgICBzdGF0ZS51c2VyLmxvZ291dFVybCA9IFwiXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25Db2RlO1xyXG4iLCJcclxuZXhwb3J0IGVudW0gQWN0aW9uVHlwZSB7XHJcblxyXG4gICAgTm9uZSA9ICdub25lJyxcclxuICAgIEZpbHRlclRvcGljcyA9ICdmaWx0ZXJUb3BpY3MnLFxyXG4gICAgR2V0VG9waWMgPSAnZ2V0VG9waWMnLFxyXG4gICAgR2V0VG9waWNBbmRSb290ID0gJ2dldFRvcGljQW5kUm9vdCcsXHJcbiAgICBTYXZlQXJ0aWNsZVNjZW5lID0gJ3NhdmVBcnRpY2xlU2NlbmUnLFxyXG4gICAgR2V0Um9vdCA9ICdnZXRSb290JyxcclxuICAgIEdldFN0ZXAgPSAnZ2V0U3RlcCcsXHJcbiAgICBHZXRQYWdlID0gJ2dldFBhZ2UnLFxyXG4gICAgR2V0Q2hhaW4gPSAnZ2V0Q2hhaW4nLFxyXG4gICAgR2V0T3V0bGluZSA9ICdnZXRPdXRsaW5lJyxcclxuICAgIEdldEZyYWdtZW50ID0gJ2dldEZyYWdtZW50JyxcclxuICAgIEdldENoYWluRnJhZ21lbnQgPSAnZ2V0Q2hhaW5GcmFnbWVudCdcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuXHJcblxyXG5jb25zdCBnQWpheEhlYWRlckNvZGUgPSB7XHJcblxyXG4gICAgYnVpbGRIZWFkZXJzOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBjYWxsSUQ6IHN0cmluZyxcclxuICAgICAgICBhY3Rpb246IEFjdGlvblR5cGUpOiBIZWFkZXJzID0+IHtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdYLUNTUkYnLCAnMScpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdTdWJzY3JpcHRpb25JRCcsIHN0YXRlLnNldHRpbmdzLnN1YnNjcmlwdGlvbklEKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ2FsbElEJywgY2FsbElEKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQWN0aW9uJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3dpdGhDcmVkZW50aWFscycsICd0cnVlJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0FqYXhIZWFkZXJDb2RlO1xyXG5cclxuIiwiaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5cclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IGdBamF4SGVhZGVyQ29kZSBmcm9tIFwiLi9nQWpheEhlYWRlckNvZGVcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdBdXRoZW50aWNhdGlvbkVmZmVjdHMgPSB7XHJcblxyXG4gICAgY2hlY2tVc2VyQXV0aGVudGljYXRlZDogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuTm9uZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYmZmVXJsfS8ke3N0YXRlLnNldHRpbmdzLnVzZXJQYXRofT9zbGlkZT1mYWxzZWA7XHJcblxyXG4gICAgICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBhY3Rpb246IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMubG9hZFN1Y2Nlc3NmdWxBdXRoZW50aWNhdGlvbixcclxuICAgICAgICAgICAgZXJyb3I6IChzdGF0ZTogSVN0YXRlLCBlcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsZXJ0KGB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgdHJ5aW5nIHRvIGF1dGhlbnRpY2F0ZSB3aXRoIHRoZSBzZXJ2ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBcInVybFwiOiAke3VybH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdGFja1wiOiAke0pTT04uc3RyaW5naWZ5KGVycm9yRGV0YWlscy5zdGFjayl9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IGdBdXRoZW50aWNhdGlvbkVmZmVjdHMuY2hlY2tVc2VyQXV0aGVudGljYXRlZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2FsbElEOiAke2NhbGxJRH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHN0YXRlKX1cclxuICAgICAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cztcclxuIiwiaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbmltcG9ydCBLZXlzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2NvbnN0YW50cy9LZXlzXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnQXV0aGVudGljYXRpb25Db2RlIGZyb20gXCIuL2dBdXRoZW50aWNhdGlvbkNvZGVcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkVmZmVjdHMgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uRWZmZWN0c1wiO1xyXG5cclxuXHJcbmNvbnN0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgPSB7XHJcblxyXG4gICAgbG9hZFN1Y2Nlc3NmdWxBdXRoZW50aWNhdGlvbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2VcclxuICAgICAgICAgICAgfHwgcmVzcG9uc2UucGFyc2VUeXBlICE9PSBcImpzb25cIlxyXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2UuanNvbkRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYWltczogYW55ID0gcmVzcG9uc2UuanNvbkRhdGE7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWU6IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ25hbWUnXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3ViOiBhbnkgPSBjbGFpbXMuZmluZChcclxuICAgICAgICAgICAgKGNsYWltOiBhbnkpID0+IGNsYWltLnR5cGUgPT09ICdzdWInXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFuYW1lXHJcbiAgICAgICAgICAgICYmICFzdWIpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvZ291dFVybENsYWltOiBhbnkgPSBjbGFpbXMuZmluZChcclxuICAgICAgICAgICAgKGNsYWltOiBhbnkpID0+IGNsYWltLnR5cGUgPT09ICdiZmY6bG9nb3V0X3VybCdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIWxvZ291dFVybENsYWltXHJcbiAgICAgICAgICAgIHx8ICFsb2dvdXRVcmxDbGFpbS52YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudXNlci5hdXRob3Jpc2VkID0gdHJ1ZTtcclxuICAgICAgICBzdGF0ZS51c2VyLm5hbWUgPSBuYW1lLnZhbHVlO1xyXG4gICAgICAgIHN0YXRlLnVzZXIuc3ViID0gc3ViLnZhbHVlO1xyXG4gICAgICAgIHN0YXRlLnVzZXIubG9nb3V0VXJsID0gbG9nb3V0VXJsQ2xhaW0udmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja1VzZXJMb2dnZWRJbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb3BzOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2hlY2tVc2VyTG9nZ2VkSW5Qcm9wcyhzdGF0ZSk7XHJcblxyXG4gICAgICAgIGlmICghcHJvcHMpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBwcm9wc1xyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrVXNlckxvZ2dlZEluUHJvcHM6IChzdGF0ZTogSVN0YXRlKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLnJhdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cy5jaGVja1VzZXJBdXRoZW50aWNhdGVkKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9naW46IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgICAgIEtleXMuc3RhcnRVcmwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRVcmxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmJmZlVybH0vJHtzdGF0ZS5zZXR0aW5ncy5kZWZhdWx0TG9naW5QYXRofT9yZXR1cm5Vcmw9L2A7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQXV0aGVudGljYXRpb246IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG4gICAgICAgIGdBdXRoZW50aWNhdGlvbkNvZGUuY2xlYXJBdXRoZW50aWNhdGlvbihzdGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhckF1dGhlbnRpY2F0aW9uQW5kU2hvd0xvZ2luOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgZ0F1dGhlbnRpY2F0aW9uQ29kZS5jbGVhckF1dGhlbnRpY2F0aW9uKHN0YXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdBdXRoZW50aWNhdGlvbkFjdGlvbnMubG9naW4oc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2dvdXQ6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHN0YXRlLnVzZXIubG9nb3V0VXJsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucztcclxuIiwiaW1wb3J0IHsgZ0h0dHAgfSBmcm9tIFwiLi9nSHR0cFwiO1xyXG5cclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNcIjtcclxuaW1wb3J0IElIdHRwUHJvcHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cFByb3BzXCI7XHJcbmltcG9ydCBnQXV0aGVudGljYXRpb25BY3Rpb25zIGZyb20gXCIuL2dBdXRoZW50aWNhdGlvbkFjdGlvbnNcIjtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ0F1dGhlbnRpY2F0ZWRIdHRwKHByb3BzOiBJSHR0cFByb3BzKTogYW55IHtcclxuXHJcbiAgICBjb25zdCBodHRwQXV0aGVudGljYXRlZFByb3BlcnRpZXM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzID0gcHJvcHMgYXMgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHM7XHJcblxyXG4gICAgLy8gLy8gVG8gcmVnaXN0ZXIgZmFpbGVkIGF1dGhlbnRpY2F0aW9uXHJcbiAgICAvLyBodHRwQXV0aGVudGljYXRlZFByb3BlcnRpZXMub25BdXRoZW50aWNhdGlvbkZhaWxBY3Rpb24gPSBnQXV0aGVudGljYXRpb25BY3Rpb25zLmNsZWFyQXV0aGVudGljYXRpb247XHJcblxyXG4gICAgLy8gVG8gcmVnaXN0ZXIgZmFpbGVkIGF1dGhlbnRpY2F0aW9uIGFuZCBzaG93IGxvZ2luIHBhZ2VcclxuICAgIGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbiA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2xlYXJBdXRoZW50aWNhdGlvbkFuZFNob3dMb2dpbjtcclxuXHJcbiAgICByZXR1cm4gZ0h0dHAoaHR0cEF1dGhlbnRpY2F0ZWRQcm9wZXJ0aWVzKTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5cclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJSHR0cEVmZmVjdCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9lZmZlY3RzL0lIdHRwRWZmZWN0XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdBamF4SGVhZGVyQ29kZSBmcm9tIFwiLi4vaHR0cC9nQWpheEhlYWRlckNvZGVcIjtcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IElBY3Rpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSUFjdGlvblwiO1xyXG5cclxuY29uc3QgcnVuQWN0aW9uSW5uZXIgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgcHJvcHM6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGRpc3BhdGNoKFxyXG4gICAgICAgIHByb3BzLmFjdGlvbixcclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuY29uc3QgcnVuQWN0aW9uID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHF1ZXVlZEVmZmVjdHM6IEFycmF5PElBY3Rpb24+XHJcbik6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICBjb25zdCBlZmZlY3RzOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIHF1ZXVlZEVmZmVjdHMuZm9yRWFjaCgoYWN0aW9uOiBJQWN0aW9uKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcclxuICAgICAgICAgICAgZXJyb3I6IChfc3RhdGU6IElTdGF0ZSwgX2Vycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBydW5uaW5nIGFjdGlvbiBpbiByZXBlYXRBY3Rpb25zXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGVmZmVjdHMucHVzaChbXHJcbiAgICAgICAgICAgIHJ1bkFjdGlvbklubmVyLFxyXG4gICAgICAgICAgICBwcm9wc1xyXG4gICAgICAgIF0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuXHJcbiAgICAgICAgZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKSxcclxuICAgICAgICAuLi5lZmZlY3RzXHJcbiAgICBdO1xyXG59O1xyXG5cclxuY29uc3Qgc2VuZFJlcXVlc3QgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcXVldWVkRWZmZWN0czogQXJyYXk8SUh0dHBFZmZlY3Q+XHJcbik6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICBjb25zdCBlZmZlY3RzOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIHF1ZXVlZEVmZmVjdHMuZm9yRWFjaCgoaHR0cEVmZmVjdDogSUh0dHBFZmZlY3QpID0+IHtcclxuXHJcbiAgICAgICAgZ2V0RWZmZWN0KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgaHR0cEVmZmVjdCxcclxuICAgICAgICAgICAgZWZmZWN0cyxcclxuICAgICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuXHJcbiAgICAgICAgZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKSxcclxuICAgICAgICAuLi5lZmZlY3RzXHJcbiAgICBdO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0RWZmZWN0ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0LFxyXG4gICAgZWZmZWN0czogQXJyYXk8SUh0dHBFZmZlY3Q+KTogdm9pZCA9PiB7XHJcblxyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBodHRwRWZmZWN0LnVybDtcclxuICAgIGNvbnN0IGNhbGxJRDogc3RyaW5nID0gVS5nZW5lcmF0ZUd1aWQoKTtcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBlZmZlY3QgPSBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgIGFjdGlvbjogaHR0cEVmZmVjdC5hY3Rpb25EZWxlZ2F0ZSxcclxuICAgICAgICBlcnJvcjogKF9zdGF0ZTogSVN0YXRlLCBfZXJyb3JEZXRhaWxzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcG9zdGluZyBnUmVwZWF0QWN0aW9ucyBkYXRhIHRvIHRoZSBzZXJ2ZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZWZmZWN0cy5wdXNoKGVmZmVjdCk7XHJcbn07XHJcblxyXG5jb25zdCBnUmVwZWF0QWN0aW9ucyA9IHtcclxuXHJcbiAgICAvLyBodHRwU2lsZW50UmVMb2FkOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgIC8vICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cC5sZW5ndGggPT09IDApIHtcclxuICAgIC8vICAgICAgICAgLy8gTXVzdCByZXR1cm4gYWx0ZXJlZCBzdGF0ZSBmb3IgdGhlIHN1YnNjcmlwdGlvbiBub3QgdG8gZ2V0IHJlbW92ZWRcclxuICAgIC8vICAgICAgICAgLy8gcmV0dXJuIHN0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgY29uc3QgcmVMb2FkSHR0cEVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0PiA9IHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cDtcclxuICAgIC8vICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHAgPSBbXTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KFxyXG4gICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgcmVMb2FkSHR0cEVmZmVjdHNcclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBodHRwU2lsZW50UmVMb2FkSW1tZWRpYXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cEltbWVkaWF0ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gTXVzdCByZXR1cm4gYWx0ZXJlZCBzdGF0ZSBmb3IgdGhlIHN1YnNjcmlwdGlvbiBub3QgdG8gZ2V0IHJlbW92ZWRcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHN0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVMb2FkSHR0cEVmZmVjdHNJbW1lZGlhdGU6IEFycmF5PElIdHRwRWZmZWN0PiA9IHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cEltbWVkaWF0ZTtcclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmVMb2FkSHR0cEVmZmVjdHNJbW1lZGlhdGVcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaWxlbnRSdW5BY3Rpb25JbW1lZGlhdGU6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJ1bkFjdGlvbkltbWVkaWF0ZTogQXJyYXk8SUFjdGlvbj4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZTtcclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZSA9IFtdO1xyXG5cclxuICAgICAgICByZXR1cm4gcnVuQWN0aW9uKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcnVuQWN0aW9uSW1tZWRpYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdSZXBlYXRBY3Rpb25zO1xyXG5cclxuIiwiaW1wb3J0IHsgaW50ZXJ2YWwgfSBmcm9tIFwiLi4vLi4vaHlwZXJBcHAvdGltZVwiO1xyXG5cclxuaW1wb3J0IGdSZXBlYXRBY3Rpb25zIGZyb20gXCIuLi9nbG9iYWwvYWN0aW9ucy9nUmVwZWF0QWN0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuXHJcbmNvbnN0IHJlcGVhdFN1YnNjcmlwdGlvbnMgPSB7XHJcblxyXG4gICAgYnVpbGRSZXBlYXRTdWJzY3JpcHRpb25zOiAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZFJlTG9hZERhdGFJbW1lZGlhdGUgPSAoKTogYW55ID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcnZhbChcclxuICAgICAgICAgICAgICAgICAgICBnUmVwZWF0QWN0aW9ucy5odHRwU2lsZW50UmVMb2FkSW1tZWRpYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVsYXk6IDEwIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZFJ1bkFjdGlvbnNJbW1lZGlhdGUgPSAoKTogYW55ID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVydmFsKFxyXG4gICAgICAgICAgICAgICAgICAgIGdSZXBlYXRBY3Rpb25zLnNpbGVudFJ1bkFjdGlvbkltbWVkaWF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7IGRlbGF5OiAxMCB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVwZWF0U3Vic2NyaXB0aW9uOiBhbnlbXSA9IFtcclxuXHJcbiAgICAgICAgICAgIGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSgpLFxyXG4gICAgICAgICAgICBidWlsZFJ1bkFjdGlvbnNJbW1lZGlhdGUoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJldHVybiByZXBlYXRTdWJzY3JpcHRpb247XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZXBlYXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IHJlcGVhdFN1YnNjcmlwdGlvbnMgZnJvbSBcIi4uLy4uLy4uL3N1YnNjcmlwdGlvbnMvcmVwZWF0U3Vic2NyaXB0aW9uXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdFN1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uczogYW55W10gPSBbXHJcblxyXG4gICAgICAgIC4uLnJlcGVhdFN1YnNjcmlwdGlvbnMuYnVpbGRSZXBlYXRTdWJzY3JpcHRpb25zKHN0YXRlKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiXHJcbmNvbnN0IEZpbHRlcnMgPSB7XHJcblxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50OiBcIiN0cmVlU29sdmVBc3Npc3RhbnRcIixcclxuICAgIHRyZWVTb2x2ZUd1aWRlSUQ6IFwidHJlZVNvbHZlR3VpZGVcIixcclxuICAgIHRyZWVTb2x2ZUZyYWdtZW50c0lEOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiLFxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50QmFubmVyOiBcInRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lclwiLFxyXG4gICAgc3RlcFZpZXc6IFwiI3N0ZXBWaWV3XCIsXHJcbiAgICBzdGVwSW5mbzogXCIjc3RlcEluZm9cIixcclxuICAgIHN0ZXBOb2RlczogXCIjc3RlcE5vZGVzXCIsXHJcbiAgICBzdGVwQm90dG9tTmF2OiBcIiNzdGVwQm90dG9tTmF2XCIsXHJcbiAgICBzdGVwU2hvd0ZpbHRlcjogJyNzdGVwQm94U2Nyb2xsU2hvdycsXHJcbiAgICB0b3BpY1Nob3dGaWx0ZXI6ICcjdG9waWNzVmlldyAudG9waWMtcm93LnNjcm9sbC1zaG93JyxcclxuICAgIHRvcGljU2hvd0NsYXNzOiAnc2Nyb2xsLXNob3cnLFxyXG4gICAgbWVudUZvY3VzRmlsdGVyOiAnaGVhZGVyIC5tZW51LWJveCcsXHJcbiAgICBzb2x1dGlvbnNNZW51Rm9jdXNGaWx0ZXI6ICdoZWFkZXIgLnNvbHV0aW9uLW1lbnUnLFxyXG4gICAgZm9sZGVkRm9jdXNGaWx0ZXI6ICcjc3RlcFZpZXcgI2ZvbGRlZENvbnRyb2wnLFxyXG4gICAgbmF2RWxlbWVudHM6ICcjc3RlcFZpZXcgLmRpc2N1c3Npb24gLm5hdicsXHJcbiAgICBzdGVwTm9kZUVsZW1lbnRzOiAnI3N0ZXBOb2RlcyAuc3RlcC1ib3gnLFxyXG4gICAgc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnQ6ICcjc3RlcE5vZGVzIC5zdGVwLWJveC5zZWxlY3RlZCcsXHJcbiAgICB1cE5hdkVsZW1lbnQ6ICcjc3RlcE5hdiAuY2hhaW4tdXB3YXJkcycsXHJcbiAgICBkb3duTmF2RWxlbWVudDogJyNzdGVwTmF2IC5jaGFpbi1kb3dud2FyZHMnLFxyXG5cclxuICAgIGZyYWdtZW50Qm94OiAnI3RyZWVTb2x2ZUZyYWdtZW50cyAubnQtZnItZnJhZ21lbnQtYm94JyxcclxuICAgIGZyYWdtZW50Qm94RGlzY3Vzc2lvbjogJyN0cmVlU29sdmVGcmFnbWVudHMgLm50LWZyLWZyYWdtZW50LWJveCAubnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbicsXHJcbiAgICBkYXRhRGlzY3Vzc2lvbkF0dHJpYnV0ZU5hbWU6ICdkYXRhLWRpc2N1c3Npb24nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpbHRlcnM7XHJcbiIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRCb3hEaXNjdXNzaW9uczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRmlsdGVycy5mcmFnbWVudEJveERpc2N1c3Npb24pO1xyXG4gICAgbGV0IGZyYWdtZW50Qm94OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBkYXRhRGlzY3Vzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhZ21lbnRCb3hEaXNjdXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBmcmFnbWVudEJveCA9IGZyYWdtZW50Qm94RGlzY3Vzc2lvbnNbaV0gYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgZGF0YURpc2N1c3Npb24gPSBmcmFnbWVudEJveC5kYXRhc2V0LmRpc2N1c3Npb247XHJcblxyXG4gICAgICAgIGlmIChkYXRhRGlzY3Vzc2lvbikge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRCb3guaW5uZXJIVE1MID0gZGF0YURpc2N1c3Npb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25GcmFnbWVudHNSZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgZnJvbSBcIi4uLy4uL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWRcIjtcclxuXHJcblxyXG5jb25zdCBvblJlbmRlckZpbmlzaGVkID0gKCkgPT4ge1xyXG5cclxuICAgIG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9uUmVuZGVyRmluaXNoZWQ7XHJcbiIsImltcG9ydCBvblJlbmRlckZpbmlzaGVkIGZyb20gXCIuL29uUmVuZGVyRmluaXNoZWRcIjtcclxuXHJcblxyXG5jb25zdCBpbml0RXZlbnRzID0ge1xyXG5cclxuICBvblJlbmRlckZpbmlzaGVkOiAoKSA9PiB7XHJcblxyXG4gICAgb25SZW5kZXJGaW5pc2hlZCgpO1xyXG4gIH0sXHJcblxyXG4gIHJlZ2lzdGVyR2xvYmFsRXZlbnRzOiAoKSA9PiB7XHJcblxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xyXG5cclxuICAgICAgaW5pdEV2ZW50cy5vblJlbmRlckZpbmlzaGVkKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEV2ZW50cztcclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuXHJcblxyXG5jb25zdCBpbml0QWN0aW9ucyA9IHtcclxuXHJcbiAgICBzZXROb3RSYXc6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF3aW5kb3c/LlRyZWVTb2x2ZT8uc2NyZWVuPy5pc0F1dG9mb2N1c0ZpcnN0UnVuKSB7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5hdXRvZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLmlzQXV0b2ZvY3VzRmlyc3RSdW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEFjdGlvbnM7XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnRVSSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyRnJhZ21lbnRVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlckZyYWdtZW50VUkgaW1wbGVtZW50cyBJUmVuZGVyRnJhZ21lbnRVSSB7XHJcblxyXG4gICAgcHVibGljIG9wdGlvbkV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBkaXNjdXNzaW9uTG9hZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnRVSSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyRnJhZ21lbnRVSVwiO1xyXG5pbXBvcnQgUmVuZGVyRnJhZ21lbnRVSSBmcm9tIFwiLi4vdWkvUmVuZGVyRnJhZ21lbnRVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlckZyYWdtZW50IGltcGxlbWVudHMgSVJlbmRlckZyYWdtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdG9wTGV2ZWxNYXBLZXk6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIG1hcEtleUNoYWluOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBndWlkZUlEOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBndWlkZVBhdGg6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHBhcmVudEZyYWdtZW50SUQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBzZWxlY3RlZDogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb3B0aW9uczogQXJyYXk8SVJlbmRlckZyYWdtZW50PiA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBvcHRpb246IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGlzQW5jaWxsYXJ5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgb3JkZXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIHVpOiBJUmVuZGVyRnJhZ21lbnRVSSA9IG5ldyBSZW5kZXJGcmFnbWVudFVJKCk7XHJcbn1cclxuIiwiXHJcblxyXG5jb25zdCBnRmlsZUNvbnN0YW50cyA9IHtcclxuXHJcbiAgICBmcmFnbWVudHNGb2xkZXJTdWZmaXg6ICdfZnJhZ3MnLFxyXG4gICAgZnJhZ21lbnRGaWxlRXh0ZW5zaW9uOiAnLmh0bWwnLFxyXG4gICAgZ3VpZGVPdXRsaW5lRmlsZW5hbWU6ICdvdXRsaW5lLnRzb2xuJyxcclxuICAgIGd1aWRlUmVuZGVyQ29tbWVudFRhZzogJ3RzR3VpZGVSZW5kZXJDb21tZW50ICcsXHJcbiAgICBmcmFnbWVudFJlbmRlckNvbW1lbnRUYWc6ICd0c0ZyYWdtZW50UmVuZGVyQ29tbWVudCAnLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZpbGVDb25zdGFudHM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5cclxuXHJcbmNvbnN0IHBhcnNlQW5kTG9hZEZyYWdtZW50ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbik6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgIGlmICghcmF3RnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgIGxldCBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ11cclxuICAgIGxldCBjYWNoZSA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQgPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3RnJhZ21lbnQuaWQpO1xyXG4gICAgICAgIGNhY2hlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVGcmFnbWVudElEO1xyXG4gICAgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXSA9IGZyYWdtZW50O1xyXG5cclxuICAgIGdGcmFnbWVudENvZGUubG9hZEZyYWdtZW50KFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50XHJcbiAgICApO1xyXG5cclxuICAgIGlmIChjYWNoZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkT3B0aW9uID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd09wdGlvbjogYW55LFxyXG4gICAgb3V0bGluZUZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbFxyXG4pOiBJUmVuZGVyRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChyYXdPcHRpb24uaWQpO1xyXG4gICAgb3B0aW9uLm9wdGlvbiA9IHJhd09wdGlvbi5vcHRpb24gPz8gJyc7XHJcbiAgICBvcHRpb24uaXNBbmNpbGxhcnkgPSByYXdPcHRpb24uaXNBbmNpbGxhcnkgPz8gZmFsc2U7XHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXdPcHRpb24ub3JkZXIgPz8gMDtcclxuXHJcbiAgICBpZiAob3V0bGluZUZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3V0bGluZU9wdGlvbiBvZiBvdXRsaW5lRnJhZ21lbnQubykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG91dGxpbmVPcHRpb24uZiA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgb3B0aW9uLm91dGxpbmVGcmFnbWVudElEID0gb3V0bGluZU9wdGlvbi5pO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lT3B0aW9uLmldID0gb3V0bGluZU9wdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBvcHRpb25cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbjtcclxufTtcclxuXHJcbmNvbnN0IGdGcmFnbWVudENvZGUgPSB7XHJcblxyXG4gICAgZ2V0RnJhZ21lbnRFbGVtZW50SUQ6IChmcmFnbWVudElEOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYG50X2ZyX2ZyYWdfJHtmcmFnbWVudElEfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50ID8/IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRGcmFnbWVudEZyb21DaGFpbkZyYWdtZW50czogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVGcmFnbWVudElEID0gZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uob3V0bGluZUZyYWdtZW50SUQpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNhY2hlZGZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICBmcmFnbWVudC50b3BMZXZlbE1hcEtleSA9IGNhY2hlZGZyYWdtZW50LnRvcExldmVsTWFwS2V5O1xyXG4gICAgICAgIGZyYWdtZW50Lm1hcEtleUNoYWluID0gY2FjaGVkZnJhZ21lbnQubWFwS2V5Q2hhaW47XHJcbiAgICAgICAgZnJhZ21lbnQuZ3VpZGVJRCA9IGNhY2hlZGZyYWdtZW50Lmd1aWRlSUQ7XHJcbiAgICAgICAgZnJhZ21lbnQuZ3VpZGVQYXRoID0gY2FjaGVkZnJhZ21lbnQuZ3VpZGVQYXRoO1xyXG4gICAgICAgIGZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQgPSBjYWNoZWRmcmFnbWVudC5wYXJlbnRGcmFnbWVudElEO1xyXG4gICAgICAgIGZyYWdtZW50LnZhbHVlID0gY2FjaGVkZnJhZ21lbnQudmFsdWU7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZGlzY3Vzc2lvbkxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGZyYWdtZW50Lm9wdGlvbiA9IGNhY2hlZGZyYWdtZW50Lm9wdGlvbjtcclxuICAgICAgICBmcmFnbWVudC5pc0FuY2lsbGFyeSA9IGNhY2hlZGZyYWdtZW50LmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgIGZyYWdtZW50Lm9yZGVyID0gY2FjaGVkZnJhZ21lbnQub3JkZXI7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgaWYgKGNhY2hlZGZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShjYWNoZWRmcmFnbWVudC5vcHRpb25zKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZyYWdtZW50T3B0aW9uIG9mIGNhY2hlZGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24gPSBuZXcgUmVuZGVyRnJhZ21lbnQoZnJhZ21lbnRPcHRpb24uaWQpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLm9wdGlvbiA9IGNhY2hlZGZyYWdtZW50Lm9wdGlvbjtcclxuICAgICAgICAgICAgICAgIG9wdGlvbi5pc0FuY2lsbGFyeSA9IGNhY2hlZGZyYWdtZW50LmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLm9yZGVyID0gY2FjaGVkZnJhZ21lbnQub3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluZGV4Q2hhaW5GcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVGcmFnbWVudElEID0gZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uob3V0bGluZUZyYWdtZW50SUQpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcblxyXG4gICAgICAgIGlmIChpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdID0gZnJhZ21lbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlQW5kTG9hZEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogc3RyaW5nLFxyXG4gICAgICAgIG91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByYXdGcmFnbWVudCA9IGdGcmFnbWVudENvZGUucGFyc2VGcmFnbWVudChyZXNwb25zZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZUFuZExvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IHN0YXRlLnJlbmRlclN0YXRlLnJvb3Q7XHJcblxyXG4gICAgICAgIGlmICghcm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvdXRsaW5lUm9vdCA9IHN0YXRlLnJlbmRlclN0YXRlLm91dGxpbmU/LnI7XHJcblxyXG4gICAgICAgIGlmICghb3V0bGluZVJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJvb3QuaWQgPT09IG91dGxpbmVSb290LmYpIHtcclxuXHJcbiAgICAgICAgICAgIHJvb3Qub3V0bGluZUZyYWdtZW50SUQgPSBvdXRsaW5lUm9vdC5pO1xyXG4gICAgICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtyb290Lm91dGxpbmVGcmFnbWVudElEXSA9IHJvb3Q7XHJcbiAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudCA9IHJvb3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiByb290Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0bGluZU9wdGlvbiBvZiBvdXRsaW5lUm9vdC5vKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG91dGxpbmVPcHRpb24uZiA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVPcHRpb24uaTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvcHRpb24ub3V0bGluZUZyYWdtZW50SURdID0gb3B0aW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VBbmRMb2FkUm9vdEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdGcmFnbWVudDogYW55LFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghcmF3RnJhZ21lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3RnJhZ21lbnQuaWQpO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgICAgICBmcmFnbWVudFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLnJvb3QgPSBmcmFnbWVudDtcclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5zZXRSb290T3V0bGluZUZyYWdtZW50SUQoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnRvcExldmVsTWFwS2V5ID0gcmF3RnJhZ21lbnQudG9wTGV2ZWxNYXBLZXkgPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQubWFwS2V5Q2hhaW4gPSByYXdGcmFnbWVudC5tYXBLZXlDaGFpbiA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5ndWlkZUlEID0gcmF3RnJhZ21lbnQuZ3VpZGVJRCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5ndWlkZVBhdGggPSByYXdGcmFnbWVudC5ndWlkZVBhdGggPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA9IGZyYWdtZW50LmlkID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50LnZhbHVlID0gcmF3RnJhZ21lbnQudmFsdWUgPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQudmFsdWUgPSBmcmFnbWVudC52YWx1ZS50cmltKCk7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZGlzY3Vzc2lvbkxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBvdXRsaW5lRnJhZ21lbnQ6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFVLmlzTnVsbE9yV2hpdGVTcGFjZShmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCkpIHtcclxuXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X291dGxpbmVGcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHJhd0ZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShyYXdGcmFnbWVudC5vcHRpb25zKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhd09wdGlvbiBvZiByYXdGcmFnbWVudC5vcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgb3B0aW9uID0gbG9hZE9wdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICByYXdPcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIGZyYWdtZW50Lm9wdGlvbnMucHVzaChvcHRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZUZyYWdtZW50OiAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IElSZW5kZXJGcmFnbWVudCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNsb25lID0gbmV3IFJlbmRlckZyYWdtZW50KGZyYWdtZW50LmlkKTtcclxuICAgICAgICBjbG9uZS50b3BMZXZlbE1hcEtleSA9IGZyYWdtZW50LnRvcExldmVsTWFwS2V5O1xyXG4gICAgICAgIGNsb25lLm1hcEtleUNoYWluID0gZnJhZ21lbnQubWFwS2V5Q2hhaW47XHJcbiAgICAgICAgY2xvbmUuZ3VpZGVJRCA9IGZyYWdtZW50Lmd1aWRlSUQ7XHJcbiAgICAgICAgY2xvbmUuZ3VpZGVQYXRoID0gZnJhZ21lbnQuZ3VpZGVQYXRoO1xyXG4gICAgICAgIGNsb25lLnBhcmVudEZyYWdtZW50SUQgPSBmcmFnbWVudC5wYXJlbnRGcmFnbWVudElEO1xyXG4gICAgICAgIGNsb25lLnZhbHVlID0gZnJhZ21lbnQudmFsdWU7XHJcbiAgICAgICAgY2xvbmUudWkuZGlzY3Vzc2lvbkxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNsb25lLm9wdGlvbiA9IGZyYWdtZW50Lm9wdGlvbjtcclxuICAgICAgICBjbG9uZS5pc0FuY2lsbGFyeSA9IGZyYWdtZW50LmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgIGNsb25lLm9yZGVyID0gZnJhZ21lbnQub3JkZXI7XHJcblxyXG4gICAgICAgIGxldCBjbG9uZU9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG5cclxuICAgICAgICBpZiAoZnJhZ21lbnQub3B0aW9uc1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KGZyYWdtZW50Lm9wdGlvbnMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnJhZ21lbnRPcHRpb24gb2YgZnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIGNsb25lT3B0aW9uID0gbmV3IFJlbmRlckZyYWdtZW50KGZyYWdtZW50T3B0aW9uLmlkKTtcclxuICAgICAgICAgICAgICAgIGNsb25lT3B0aW9uLm9wdGlvbiA9IGZyYWdtZW50T3B0aW9uLm9wdGlvbjtcclxuICAgICAgICAgICAgICAgIGNsb25lT3B0aW9uLmlzQW5jaWxsYXJ5ID0gZnJhZ21lbnRPcHRpb24uaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbi5vcmRlciA9IGZyYWdtZW50T3B0aW9uLm9yZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGNsb25lLm9wdGlvbnMucHVzaChjbG9uZU9wdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VGcmFnbWVudDogKHJlc3BvbnNlOiBzdHJpbmcpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVxcXCJtb2R1bGVcXFwiIHNyYz1cXFwiL0B2aXRlL2NsaWVudFxcXCI+PC9zY3JpcHQ+XHJcbiAgICAgICAgICAgICAgICA8IS0tIHRzRnJhZ21lbnRSZW5kZXJDb21tZW50IHtcXFwibm9kZVxcXCI6e1xcXCJpZFxcXCI6XFxcImRCdDdLbTJNbFxcXCIsXFxcInRvcExldmVsTWFwS2V5XFxcIjpcXFwiY3YxVFJsMDFyZlxcXCIsXFxcIm1hcEtleUNoYWluXFxcIjpcXFwiY3YxVFJsMDFyZlxcXCIsXFxcImd1aWRlSURcXFwiOlxcXCJkQnQ3Sk4xSGVcXFwiLFxcXCJndWlkZVBhdGhcXFwiOlxcXCJjOi9HaXRIdWIvSEFMLkRvY3VtZW50YXRpb24vdHNtYXBzVGVzdC9UZXN0T3B0aW9uc0ZvbGRlci9Ib2xkZXIvVGVzdE9wdGlvbnMudHNtYXBcXFwiLFxcXCJwYXJlbnRGcmFnbWVudElEXFxcIjpcXFwiZEJ0N0pOMXZ0XFxcIixcXFwiY2hhcnRLZXlcXFwiOlxcXCJjdjFUUmwwMXJmXFxcIixcXFwib3B0aW9uc1xcXCI6W119fSAtLT5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPGg0IGlkPVxcXCJvcHRpb24tMS1zb2x1dGlvblxcXCI+T3B0aW9uIDEgc29sdXRpb248L2g0PlxyXG4gICAgICAgICAgICAgICAgPHA+T3B0aW9uIDEgc29sdXRpb248L3A+XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgbGluZXMgPSByZXNwb25zZS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQ29tbWVudFN0YXJ0ID0gYDwhLS0gJHtnRmlsZUNvbnN0YW50cy5mcmFnbWVudFJlbmRlckNvbW1lbnRUYWd9YDtcclxuICAgICAgICBjb25zdCByZW5kZXJDb21tZW50RW5kID0gYCAtLT5gO1xyXG4gICAgICAgIGxldCBmcmFnbWVudFJlbmRlckNvbW1lbnQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBsaW5lOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGJ1aWxkVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJ1aWxkVmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGAke3ZhbHVlfVxyXG4ke2xpbmV9YDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKHJlbmRlckNvbW1lbnRTdGFydCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudFJlbmRlckNvbW1lbnQgPSBsaW5lLnN1YnN0cmluZyhyZW5kZXJDb21tZW50U3RhcnQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGJ1aWxkVmFsdWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWZyYWdtZW50UmVuZGVyQ29tbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmcmFnbWVudFJlbmRlckNvbW1lbnQgPSBmcmFnbWVudFJlbmRlckNvbW1lbnQudHJpbSgpO1xyXG5cclxuICAgICAgICBpZiAoZnJhZ21lbnRSZW5kZXJDb21tZW50LmVuZHNXaXRoKHJlbmRlckNvbW1lbnRFbmQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBmcmFnbWVudFJlbmRlckNvbW1lbnQubGVuZ3RoIC0gcmVuZGVyQ29tbWVudEVuZC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudFJlbmRlckNvbW1lbnQgPSBmcmFnbWVudFJlbmRlckNvbW1lbnQuc3Vic3RyaW5nKFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIGxlbmd0aFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gZnJhZ21lbnRSZW5kZXJDb21tZW50LnRyaW0oKTtcclxuICAgICAgICBsZXQgcmF3RnJhZ21lbnQ6IGFueSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByYXdGcmFnbWVudCA9IEpTT04ucGFyc2UoZnJhZ21lbnRSZW5kZXJDb21tZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdGcmFnbWVudC52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF3RnJhZ21lbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtPcHRpb25zRXhwYW5kZWQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnJlc2V0RnJhZ21lbnRVaXMoc3RhdGUpO1xyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLnVpLm9wdGlvbnNFeHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb2xsYXBzZUZyYWdtZW50c09wdGlvbnM6IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghZnJhZ21lbnRcclxuICAgICAgICAgICAgfHwgZnJhZ21lbnQub3B0aW9ucy5sZW5ndGggPT09IDBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgZnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uLnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93T3B0aW9uTm9kZTogKFxyXG4gICAgICAgIGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmNvbGxhcHNlRnJhZ21lbnRzT3B0aW9ucyhmcmFnbWVudCk7XHJcbiAgICAgICAgb3B0aW9uLnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgZnJhZ21lbnQuc2VsZWN0ZWQgPSBvcHRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0RnJhZ21lbnRVaXM6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXNldEZyYWdtZW50VWlzIGNhbGxlZCcpXHJcbiAgICAgICAgY29uc3QgY2hhaW5GcmFnbWVudHMgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBjaGFpbkZyYWdtZW50cykge1xyXG5cclxuICAgICAgICAgICAgZ0ZyYWdtZW50Q29kZS5yZXNldEZyYWdtZW50VWkoY2hhaW5GcmFnbWVudHNbcHJvcE5hbWVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZnJhZ21lbnRJRCBpbiBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRCkge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnQgPSBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudElEXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBhbGwgb3B0aW9ucyB3ZXJlIGNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRGcmFnbWVudFVpOiAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDdXJyZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXJlbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgcGFyZW50LnNlbGVjdGVkID0gZnJhZ21lbnQ7XHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50ID0gZnJhZ21lbnQ7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZyYWdtZW50Q29kZTtcclxuXHJcbiIsImltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeVVybCBpbXBsZW1lbnRzIElIaXN0b3J5VXJsIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclNuYXBTaG90IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSVJlbmRlclNuYXBTaG90XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU25hcFNob3QgaW1wbGVtZW50cyBJUmVuZGVyU25hcFNob3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxuICAgIHB1YmxpYyBndWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjcmVhdGVkOiBEYXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbW9kaWZpZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBleHBhbmRlZE9wdGlvbklEczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIGV4cGFuZGVkQW5jaWxsYXJ5SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IEhpc3RvcnlVcmwgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvSGlzdG9yeVVybFwiO1xyXG5pbXBvcnQgUmVuZGVyU25hcFNob3QgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvUmVuZGVyU25hcFNob3RcIjtcclxuXHJcblxyXG5jb25zdCBnSGlzdG9yeUNvZGUgPSB7XHJcblxyXG4gICAgcmVzZXRSYXc6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVzaEJyb3dzZXJIaXN0b3J5U3RhdGU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5yZXNldFJhdygpO1xyXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBsYXN0VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaGlzdG9yeS5zdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5oaXN0b3J5LnN0YXRlLnVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhc3RVcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke2xvY2F0aW9uLnNlYXJjaH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0/JHtjdXJyZW50Lm91dGxpbmVGcmFnbWVudElEfWA7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VXJsXHJcbiAgICAgICAgICAgICYmIHVybCA9PT0gbGFzdFVybCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcclxuICAgICAgICAgICAgbmV3IFJlbmRlclNuYXBTaG90KHVybCksXHJcbiAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnN0ZXBIaXN0b3J5Lmhpc3RvcnlDaGFpbi5wdXNoKG5ldyBIaXN0b3J5VXJsKHVybCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0hpc3RvcnlDb2RlO1xyXG5cclxuIiwiXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dGcmFnbWVudEFjdGlvbnNcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcblxyXG5cclxuY29uc3QgZ2V0RnJhZ21lbnQgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgZnJhZ21lbnRJRDogc3RyaW5nLFxyXG4gICAgZnJhZ21lbnRQYXRoOiBzdHJpbmcsXHJcbiAgICBhY3Rpb246IEFjdGlvblR5cGUsXHJcbiAgICBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBhY3Rpb25cclxuICAgICk7XHJcblxyXG4gICAgLy8gY29uc3QgcGF0aDogc3RyaW5nID0gYFN0ZXAvJHtzdGVwSUR9YDtcclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7ZnJhZ21lbnRQYXRofWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgcGFyc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc3BvbnNlOiAndGV4dCcsXHJcbiAgICAgICAgYWN0aW9uOiBsb2FkQWN0aW9uLFxyXG4gICAgICAgIGVycm9yOiAoc3RhdGU6IElTdGF0ZSwgZXJyb3JEZXRhaWxzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KGB7XHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciBnZXR0aW5nIGZyYWdtZW50IGZyb20gdGhlIHNlcnZlciwgcGF0aDogJHtmcmFnbWVudFBhdGh9LCBpZDogJHtmcmFnbWVudElEfVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dldEZyYWdtZW50Lm5hbWV9LFxyXG4gICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfVxyXG4gICAgICAgICAgICB9YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuY29uc3QgZ0ZyYWdtZW50RWZmZWN0cyA9IHtcclxuXHJcbiAgICAvLyBnZXRSb290U3RlcDogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgcm9vdElEOiBzdHJpbmcpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICByb290SUQsXHJcbiAgICAvLyAgICAgICAgICcwJyxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRSb290LFxyXG4gICAgLy8gICAgICAgICBnU3RlcEFjdGlvbnMubG9hZFJvb3RTdGVwXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgZ2V0RnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50UGF0aDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ0ZyYWdtZW50QWN0aW9ucy5sb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgb3B0aW9uLmlkLFxyXG4gICAgICAgICAgICBmcmFnbWVudFBhdGgsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRDaGFpbkZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudElEOiBzdHJpbmcsXHJcbiAgICAgICAgZnJhZ21lbnRQYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdGcmFnbWVudEFjdGlvbnMubG9hZENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBmcmFnbWVudElELFxyXG4gICAgICAgICAgICBmcmFnbWVudFBhdGgsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0Q2hhaW5GcmFnbWVudCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGdldEFuY2lsbGFyeTogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgLy8gICAgIHVpSUQ6IG51bWJlcik6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXNwb25zZSxcclxuICAgIC8vICAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAvLyAgICAgICAgICAgICB1aUlEXHJcbiAgICAvLyAgICAgICAgIH07XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnkoXHJcbiAgICAvLyAgICAgICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgIC8vICAgICAgICAgKTtcclxuICAgIC8vICAgICB9O1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHN0ZXBJRCxcclxuICAgIC8vICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRTdGVwLFxyXG4gICAgLy8gICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gZ2V0QW5jaWxsYXJ5U3RlcDogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgLy8gICAgIHVpSUQ6IG51bWJlcik6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXNwb25zZSxcclxuICAgIC8vICAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAvLyAgICAgICAgICAgICB1aUlEXHJcbiAgICAvLyAgICAgICAgIH07XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnlDaGFpblN0ZXAoXHJcbiAgICAvLyAgICAgICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgIC8vICAgICAgICAgKTtcclxuICAgIC8vICAgICB9O1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHN0ZXBJRCxcclxuICAgIC8vICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRTdGVwLFxyXG4gICAgLy8gICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGcmFnbWVudEVmZmVjdHM7XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4uL2NvZGUvZ0ZyYWdtZW50Q29kZVwiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuLi9jb2RlL2dIaXN0b3J5Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRFZmZlY3RzIGZyb20gXCIuLi9lZmZlY3RzL2dGcmFnbWVudEVmZmVjdHNcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5cclxuXHJcbmNvbnN0IGdGcmFnbWVudEFjdGlvbnMgPSB7XHJcblxyXG4gICAgc2hvd09wdGlvbk5vZGU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUubWFya09wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvblxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuc2V0Q3VycmVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHBhcmVudEZyYWdtZW50LFxyXG4gICAgICAgICAgICBvcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucHVzaEJyb3dzZXJIaXN0b3J5U3RhdGUoc3RhdGUpO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9uLnVpLmRpc2N1c3Npb25Mb2FkZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRQYXRoID0gYCR7c3RhdGUucmVuZGVyU3RhdGUuZ3VpZGU/LmZyYWdtZW50Rm9sZGVyVXJsfS8ke29wdGlvbi5pZH0ke2dGaWxlQ29uc3RhbnRzLmZyYWdtZW50RmlsZUV4dGVuc2lvbn1gO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ0ZyYWdtZW50RWZmZWN0cy5nZXRGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQYXRoXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnksXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2Uob3B0aW9uLm91dGxpbmVGcmFnbWVudElEKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnBhcnNlQW5kTG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudGV4dERhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkQ2hhaW5GcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSxcclxuICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUucGFyc2VBbmRMb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByZXNwb25zZS50ZXh0RGF0YSxcclxuICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzID0gc3RhdGUucmVuZGVyU3RhdGUubG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cztcclxuXHJcbiAgICAgICAgaWYgKGxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHMpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRPdXRsaW5lRnJhZ21lbnQgPSBsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzLmF0KC0xKSA/PyBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHRPdXRsaW5lRnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRGcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkT3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtuZXh0T3V0bGluZUZyYWdtZW50LmldO1xyXG4gICAgICAgICAgICAgICAgZXhwYW5kZWRPcHRpb24udWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGdGcmFnbWVudENvZGUuc2hvd09wdGlvbk5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50RnJhZ21lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWRPcHRpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ0ZyYWdtZW50Q29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE9wdGlvblxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnRnJhZ21lbnRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgZ0ZyYWdtZW50QWN0aW9ucyBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJRnJhZ21lbnRQYXlsb2FkIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL3BheWxvYWRzL0lGcmFnbWVudFBheWxvYWRcIjtcclxuXHJcblxyXG5jb25zdCBmcmFnbWVudEFjdGlvbnMgPSB7XHJcblxyXG4gICAgZXhwYW5kT3B0aW9uczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFmcmFnbWVudFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnJlc2V0RnJhZ21lbnRVaXMoc3RhdGUpO1xyXG4gICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZnJhZ21lbnQudWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgIT09IHRydWU7XHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUudWkub3B0aW9uc0V4cGFuZGVkID0gZXhwYW5kZWQ7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSBleHBhbmRlZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhpZGVPcHRpb25zOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIWZyYWdtZW50XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLnVpLnJhdyA9IGZhbHNlO1xyXG4gICAgICAgIGdGcmFnbWVudENvZGUucmVzZXRGcmFnbWVudFVpcyhzdGF0ZSk7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5vcHRpb25zRXhwYW5kZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dPcHRpb25Ob2RlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXlsb2FkOiBJRnJhZ21lbnRQYXlsb2FkXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBheWxvYWQ/LnBhcmVudEZyYWdtZW50XHJcbiAgICAgICAgICAgIHx8ICFwYXlsb2FkPy5vcHRpb25cclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUudWkucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnRnJhZ21lbnRBY3Rpb25zLnNob3dPcHRpb25Ob2RlKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcGF5bG9hZC5wYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgcGF5bG9hZC5vcHRpb25cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnJhZ21lbnRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyYWdtZW50UGF5bG9hZCBpbXBsZW1lbnRzIElGcmFnbWVudFBheWxvYWQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnRGcmFnbWVudCA9IHBhcmVudEZyYWdtZW50O1xyXG4gICAgICAgIHRoaXMub3B0aW9uID0gb3B0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwYXJlbnRGcmFnbWVudDogSVJlbmRlckZyYWdtZW50O1xyXG4gICAgcHVibGljIG9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG59XHJcbiIsImltcG9ydCB7IENoaWxkcmVuLCBWTm9kZSB9IGZyb20gXCJoeXBlci1hcHAtbG9jYWxcIjtcclxuaW1wb3J0IHsgaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgZnJhZ21lbnRBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZVwiO1xyXG5pbXBvcnQgRnJhZ21lbnRQYXlsb2FkIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS91aS9wYXlsb2Fkcy9GcmFnbWVudFBheWxvYWRcIjtcclxuXHJcbmltcG9ydCBcIi4uL3Njc3MvZnJhZ21lbnRzLnNjc3NcIjtcclxuXHJcblxyXG5jb25zdCBCdWlsZEV4cGFuZGVkT3B0aW9uVmlldyA9IChcclxuICAgIHBhcmVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuKTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIW9wdGlvblxyXG4gICAgICAgIHx8IG9wdGlvbi5pc0FuY2lsbGFyeSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogXCJudC1mci1vcHRpb24tYm94XCIgfSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgaChcImFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcIm50LWZyLW9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRBY3Rpb25zLnNob3dPcHRpb25Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9ldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGcmFnbWVudFBheWxvYWQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwic3BhblwiLCB7fSwgb3B0aW9uLm9wdGlvbilcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59XHJcblxyXG5jb25zdCBidWlsZEV4cGFuZGVkT3B0aW9uc1ZpZXcgPSAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgY29uc3Qgb3B0aW9uVmlld3M6IENoaWxkcmVuW10gPSBbXTtcclxuICAgIGxldCBvcHRpb25WZXc6IFZOb2RlIHwgbnVsbDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBmcmFnbWVudC5vcHRpb25zKSB7XHJcblxyXG4gICAgICAgIG9wdGlvblZldyA9IEJ1aWxkRXhwYW5kZWRPcHRpb25WaWV3KFxyXG4gICAgICAgICAgICBmcmFnbWVudCxcclxuICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvblZldykge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uVmlld3MucHVzaChvcHRpb25WZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgb3B0aW9uc0NsYXNzZXMgPSBcIm50LWZyLWZyYWdtZW50LW9wdGlvbnNcIjtcclxuXHJcbiAgICBpZiAoZnJhZ21lbnQuc2VsZWN0ZWQpIHtcclxuXHJcbiAgICAgICAgb3B0aW9uc0NsYXNzZXMgPSBgJHtvcHRpb25zQ2xhc3Nlc30gbnQtZnItZnJhZ21lbnQtY2hhaW5gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBgJHtvcHRpb25zQ2xhc3Nlc31gLFxyXG4gICAgICAgICAgICAgICAgdGFiaW5kZXg6IDAsXHJcbiAgICAgICAgICAgICAgICBvbkJsdXI6IFtcclxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudEFjdGlvbnMuaGlkZU9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgKF9ldmVudDogYW55KSA9PiBmcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LCBbXHJcblxyXG4gICAgICAgICAgICBvcHRpb25WaWV3c1xyXG4gICAgICAgIF1cclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRDb2xsYXBzZWRPcHRpb25zVmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJhXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBgbnQtZnItZnJhZ21lbnQtb3B0aW9ucyBudC1mci1jb2xsYXBzZWRgLFxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd246IFtcclxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudEFjdGlvbnMuZXhwYW5kT3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAoX2V2ZW50OiBhbnkpID0+IGZyYWdtZW50XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJzcGFuXCIsIHsgY2xhc3M6IGBudC1mci1vcHRpb24tc2VsZWN0ZWRgIH0sIGAke2ZyYWdtZW50LnNlbGVjdGVkPy5vcHRpb259YCksXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRPcHRpb25zVmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIWZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICB8fCBmcmFnbWVudC5vcHRpb25zLmxlbmd0aCA9PT0gMFxyXG4gICAgKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZyYWdtZW50LnNlbGVjdGVkXHJcbiAgICAgICAgJiYgIWZyYWdtZW50LnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBidWlsZENvbGxhcHNlZE9wdGlvbnNWaWV3KGZyYWdtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVpbGRFeHBhbmRlZE9wdGlvbnNWaWV3KGZyYWdtZW50KTtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkRnJhZ21lbnRWaWV3ID0gKGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsKTogQ2hpbGRyZW5bXSA9PiB7XHJcblxyXG4gICAgaWYgKCFmcmFnbWVudCkge1xyXG5cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRFTGVtZW50SUQgPSBnRnJhZ21lbnRDb2RlLmdldEZyYWdtZW50RWxlbWVudElEKGZyYWdtZW50LmlkKTtcclxuXHJcbiAgICBjb25zdCB2aWV3OiBDaGlsZHJlbltdID0gW1xyXG5cclxuICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiBgJHtmcmFnbWVudEVMZW1lbnRJRH1gLFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibnQtZnItZnJhZ21lbnQtYm94XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGBudC1mci1mcmFnbWVudC1kaXNjdXNzaW9uYCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWRpc2N1c3Npb25cIjogZnJhZ21lbnQudmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgYnVpbGRPcHRpb25zVmlldyhmcmFnbWVudClcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICksXHJcblxyXG4gICAgICAgIGJ1aWxkRnJhZ21lbnRWaWV3KGZyYWdtZW50LnNlbGVjdGVkKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gdmlldztcclxufTtcclxuXHJcbmNvbnN0IGZyYWdtZW50Vmlld3MgPSB7XHJcblxyXG4gICAgYnVpbGRDb250ZW50VmlldzogKHN0YXRlOiBJU3RhdGUpOiBWTm9kZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXc6IFZOb2RlID1cclxuXHJcbiAgICAgICAgICAgIGgoXCJkaXZcIiwgeyBpZDogXCJudF9mcl9GcmFnbWVudHNcIiB9LCBbXHJcblxyXG4gICAgICAgICAgICAgICAgYnVpbGRGcmFnbWVudFZpZXcoc3RhdGUucmVuZGVyU3RhdGUucm9vdClcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnJhZ21lbnRWaWV3cztcclxuXHJcblxyXG4iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCJoeXBlci1hcHAtbG9jYWxcIjtcclxuaW1wb3J0IHsgaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBpbml0QWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9pbml0QWN0aW9uc1wiO1xyXG5pbXBvcnQgZnJhZ21lbnRWaWV3cyBmcm9tIFwiLi4vLi4vZnJhZ21lbnRzL3ZpZXdzL2ZyYWdtZW50Vmlld3NcIjtcclxuXHJcblxyXG5jb25zdCBpbml0VmlldyA9IHtcclxuXHJcbiAgICBidWlsZFZpZXc6IChzdGF0ZTogSVN0YXRlKTogVk5vZGUgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogaW5pdEFjdGlvbnMuc2V0Tm90UmF3LFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50Vmlld3MuYnVpbGRDb250ZW50VmlldyhzdGF0ZSksXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbml0VmlldztcclxuXHJcbiIsImltcG9ydCBJU2V0dGluZ3MgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdXNlci9JU2V0dGluZ3NcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyBpbXBsZW1lbnRzIElTZXR0aW5ncyB7XHJcblxyXG4gICAgcHVibGljIGtleTogc3RyaW5nID0gXCItMVwiO1xyXG4gICAgcHVibGljIHI6IHN0cmluZyA9IFwiLTFcIjtcclxuXHJcbiAgICAvLyBBdXRoZW50aWNhdGlvblxyXG4gICAgcHVibGljIHVzZXJQYXRoOiBzdHJpbmcgPSBgdXNlcmA7XHJcbiAgICBwdWJsaWMgZGVmYXVsdExvZ291dFBhdGg6IHN0cmluZyA9IGBsb2dvdXRgO1xyXG4gICAgcHVibGljIGRlZmF1bHRMb2dpblBhdGg6IHN0cmluZyA9IGBsb2dpbmA7XHJcbiAgICBwdWJsaWMgcmV0dXJuVXJsU3RhcnQ6IHN0cmluZyA9IGByZXR1cm5VcmxgO1xyXG5cclxuICAgIHByaXZhdGUgYmFzZVVybDogc3RyaW5nID0gKHdpbmRvdyBhcyBhbnkpLkFTU0lTVEFOVF9CQVNFX1VSTCA/PyAnJztcclxuICAgIHB1YmxpYyBsaW5rVXJsOiBzdHJpbmcgPSAod2luZG93IGFzIGFueSkuQVNTSVNUQU5UX0xJTktfVVJMID8/ICcnO1xyXG4gICAgcHVibGljIHN1YnNjcmlwdGlvbklEOiBzdHJpbmcgPSAod2luZG93IGFzIGFueSkuQVNTSVNUQU5UX1NVQlNDUklQVElPTl9JRCA/PyAnJztcclxuXHJcbiAgICBwdWJsaWMgYXBpVXJsOiBzdHJpbmcgPSBgJHt0aGlzLmJhc2VVcmx9L2FwaWA7XHJcbiAgICBwdWJsaWMgYmZmVXJsOiBzdHJpbmcgPSBgJHt0aGlzLmJhc2VVcmx9L2JmZmA7XHJcbiAgICBwdWJsaWMgZmlsZVVybDogc3RyaW5nID0gYCR7dGhpcy5iYXNlVXJsfS9maWxlYDtcclxufVxyXG4iLCJcclxuZXhwb3J0IGVudW0gbmF2aWdhdGlvbkRpcmVjdGlvbiB7XHJcblxyXG4gICAgQnV0dG9ucyA9ICdidXR0b25zJyxcclxuICAgIEJhY2t3YXJkcyA9ICdiYWNrd2FyZHMnLFxyXG4gICAgRm9yd2FyZHMgPSAnZm9yd2FyZHMnXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IG5hdmlnYXRpb25EaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9uYXZpZ2F0aW9uRGlyZWN0aW9uXCI7XHJcbmltcG9ydCBJSGlzdG9yeSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5XCI7XHJcbmltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSBpbXBsZW1lbnRzIElIaXN0b3J5IHtcclxuXHJcbiAgICBwdWJsaWMgaGlzdG9yeUNoYWluOiBBcnJheTxJSGlzdG9yeVVybD4gPSBbXTtcclxuICAgIHB1YmxpYyBkaXJlY3Rpb246IG5hdmlnYXRpb25EaXJlY3Rpb24gPSBuYXZpZ2F0aW9uRGlyZWN0aW9uLkJ1dHRvbnM7XHJcbiAgICBwdWJsaWMgY3VycmVudEluZGV4OiBudW1iZXIgPSAwO1xyXG59XHJcbiIsImltcG9ydCBJVXNlciBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91c2VyL0lVc2VyXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciBpbXBsZW1lbnRzIElVc2VyIHtcclxuXHJcbiAgICBwdWJsaWMga2V5OiBzdHJpbmcgPSBgMDEyMzQ1Njc4OWA7XHJcbiAgICBwdWJsaWMgcjogc3RyaW5nID0gXCItMVwiO1xyXG4gICAgcHVibGljIHVzZVZzQ29kZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgYXV0aG9yaXNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHJhdzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgbG9nb3V0VXJsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHNob3dNZW51OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBzdWI6IHN0cmluZyA9IFwiXCI7XHJcbn1cclxuIiwiaW1wb3J0IElSZXBlYXRFZmZlY3RzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2VmZmVjdHMvSVJlcGVhdEVmZmVjdHNcIjtcclxuaW1wb3J0IElIdHRwRWZmZWN0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2VmZmVjdHMvSUh0dHBFZmZlY3RcIjtcclxuaW1wb3J0IElBY3Rpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSUFjdGlvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcGVhdGVFZmZlY3RzIGltcGxlbWVudHMgSVJlcGVhdEVmZmVjdHMge1xyXG5cclxuICAgIHB1YmxpYyBzaG9ydEludGVydmFsSHR0cDogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICAvLyBwdWJsaWMgcmVMb2FkR2V0SHR0cDogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICBwdWJsaWMgcmVMb2FkR2V0SHR0cEltbWVkaWF0ZTogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICBwdWJsaWMgcnVuQWN0aW9uSW1tZWRpYXRlOiBBcnJheTxJQWN0aW9uPiA9IFtdO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyU3RhdGVVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlclN0YXRlVUkgaW1wbGVtZW50cyBJUmVuZGVyU3RhdGVVSSB7XHJcblxyXG4gICAgcHVibGljIHJhdzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgb3B0aW9uc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JUmVuZGVyU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyR3VpZGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJHdWlkZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyU3RhdGVVSVwiO1xyXG5pbXBvcnQgUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi91aS9SZW5kZXJTdGF0ZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU3RhdGUgaW1wbGVtZW50cyBJUmVuZGVyU3RhdGUge1xyXG5cclxuICAgIHB1YmxpYyBndWlkZTogSVJlbmRlckd1aWRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgcm9vdDogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgY3VycmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBvdXRsaW5lOiBJUmVuZGVyT3V0bGluZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8vIFNlYXJjaCBpbmRpY2VzXHJcbiAgICBwdWJsaWMgaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDogYW55ID0ge307XHJcbiAgICBwdWJsaWMgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ6IGFueSA9IHt9O1xyXG4gICAgcHVibGljIGluZGV4X3Jhd0ZyYWdtZW50c19mcmFnbWVudElEOiBhbnkgPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgdWk6IElSZW5kZXJTdGF0ZVVJID0gbmV3IFJlbmRlclN0YXRlVUkoKTtcclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vdXNlci9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgSVNldHRpbmdzIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVNldHRpbmdzXCI7XHJcbmltcG9ydCBJSGlzdG9yeSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5XCI7XHJcbmltcG9ydCBTdGVwSGlzdG9yeSBmcm9tIFwiLi9oaXN0b3J5L0hpc3RvcnlcIjtcclxuaW1wb3J0IElVc2VyIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVVzZXJcIjtcclxuaW1wb3J0IFVzZXIgZnJvbSBcIi4vdXNlci9Vc2VyXCI7XHJcbmltcG9ydCBJUmVwZWF0RWZmZWN0cyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9lZmZlY3RzL0lSZXBlYXRFZmZlY3RzXCI7XHJcbmltcG9ydCBSZXBlYXRlRWZmZWN0cyBmcm9tIFwiLi9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzXCI7XHJcbmltcG9ydCBJUmVuZGVyU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVJlbmRlclN0YXRlXCI7XHJcbmltcG9ydCBSZW5kZXJTdGF0ZSBmcm9tIFwiLi9SZW5kZXJTdGF0ZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3M6IElTZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzaG93U29sdXRpb25zTWVudTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHR3aXR0ZXJVcmw6IHN0cmluZyA9ICdodHRwczovL3R3aXR0ZXIuY29tL25ldG9mdHJlZXMnO1xyXG4gICAgcHVibGljIGxpbmtlZGluVXJsOiBzdHJpbmcgPSAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvbmV0b2Z0cmVlcy9hYm91dCc7XHJcblxyXG4gICAgcHVibGljIGxvYWRpbmc6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGRlYnVnOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBnZW5lcmljRXJyb3I6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBuZXh0S2V5OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHNldHRpbmdzOiBJU2V0dGluZ3M7XHJcbiAgICBwdWJsaWMgdXNlcjogSVVzZXIgPSBuZXcgVXNlcigpO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVuZGVyU3RhdGU6IElSZW5kZXJTdGF0ZSA9IG5ldyBSZW5kZXJTdGF0ZSgpO1xyXG5cclxuICAgIHB1YmxpYyByZXBlYXRFZmZlY3RzOiBJUmVwZWF0RWZmZWN0cyA9IG5ldyBSZXBlYXRlRWZmZWN0cygpO1xyXG5cclxuICAgIHB1YmxpYyBzdGVwSGlzdG9yeTogSUhpc3RvcnkgPSBuZXcgU3RlcEhpc3RvcnkoKTtcclxufVxyXG5cclxuXHJcbiIsIlxyXG5leHBvcnQgZW51bSBTY3JvbGxIb3BUeXBlIHtcclxuICAgIE5vbmUgPSBcIm5vbmVcIixcclxuICAgIFVwID0gXCJ1cFwiLFxyXG4gICAgRG93biA9IFwiZG93blwiXHJcbn1cclxuIiwiaW1wb3J0IHsgU2Nyb2xsSG9wVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1Njcm9sbEhvcFR5cGVcIjtcclxuaW1wb3J0IElTY3JlZW4gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvd2luZG93L0lTY3JlZW5cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW4gaW1wbGVtZW50cyBJU2NyZWVuIHtcclxuXHJcbiAgICBwdWJsaWMgYXV0b2ZvY3VzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNBdXRvZm9jdXNGaXJzdFJ1bjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgaGlkZUJhbm5lcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc2Nyb2xsVG9FbGVtZW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBzY3JvbGxIb3A6IFNjcm9sbEhvcFR5cGUgPSBTY3JvbGxIb3BUeXBlLk5vbmU7XHJcbiAgICBwdWJsaWMgbGFzdFNjcm9sbFk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIHVhOiBhbnkgfCBudWxsID0gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgSVNjcmVlbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy93aW5kb3cvSVNjcmVlblwiO1xyXG5pbXBvcnQgSVRyZWVTb2x2ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy93aW5kb3cvSVRyZWVTb2x2ZVwiO1xyXG5pbXBvcnQgU2NyZWVuIGZyb20gXCIuL1NjcmVlblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyZWVTb2x2ZSBpbXBsZW1lbnRzIElUcmVlU29sdmUge1xyXG5cclxuICAgIHB1YmxpYyByZW5kZXJpbmdDb21tZW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBzY3JlZW46IElTY3JlZW4gPSBuZXcgU2NyZWVuKCk7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJPdXRsaW5lRnJhZ21lbnQgaW1wbGVtZW50cyBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHtcclxuXHJcbiAgICBwdWJsaWMgaTogc3RyaW5nID0gJyc7IC8vIGlkXHJcbiAgICBwdWJsaWMgZjogc3RyaW5nID0gJyc7IC8vIGZyYWdtZW50IGlkXHJcbiAgICBwdWJsaWMgYzogc3RyaW5nID0gJyc7IC8vIGNoYXJ0IGlkIGZyb20gb3V0bGluZSBjaGFydCBhcnJheVxyXG4gICAgcHVibGljIG86IEFycmF5PElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ+ID0gW107IC8vIG9wdGlvbnNcclxuICAgIHB1YmxpYyBwYXJlbnQ6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlck91dGxpbmUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4vUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyT3V0bGluZSBpbXBsZW1lbnRzIElSZW5kZXJPdXRsaW5lIHtcclxuXHJcbiAgICBwdWJsaWMgdjogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgcjogSVJlbmRlck91dGxpbmVGcmFnbWVudCA9IG5ldyBSZW5kZXJPdXRsaW5lRnJhZ21lbnQoKTtcclxuICAgIHB1YmxpYyBjOiBBcnJheTxJUmVuZGVyT3V0bGluZUNoYXJ0PiA9IFtdO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyT3V0bGluZUNoYXJ0IGltcGxlbWVudHMgSVJlbmRlck91dGxpbmVDaGFydCB7XHJcblxyXG4gICAgcHVibGljIGk6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHA6IHN0cmluZyA9ICcnO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lQ2hhcnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lQ2hhcnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IFJlbmRlck91dGxpbmUgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lQ2hhcnQgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lQ2hhcnRcIjtcclxuaW1wb3J0IFJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vc3RhdGUvcmVuZGVyL1JlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi9nRnJhZ21lbnRDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgbG9hZEZyYWdtZW50ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICBwYXJlbnQ6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsID0gbnVsbFxyXG4pOiBJUmVuZGVyT3V0bGluZUZyYWdtZW50ID0+IHtcclxuXHJcbiAgICBjb25zdCBmcmFnbWVudCA9IG5ldyBSZW5kZXJPdXRsaW5lRnJhZ21lbnQoKTtcclxuICAgIGZyYWdtZW50LmkgPSByYXdGcmFnbWVudC5pO1xyXG4gICAgZnJhZ21lbnQuZiA9IHJhd0ZyYWdtZW50LmY7XHJcbiAgICBmcmFnbWVudC5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50LmldID0gZnJhZ21lbnQ7XHJcblxyXG4gICAgaWYgKHJhd0ZyYWdtZW50Lm9cclxuICAgICAgICAmJiBBcnJheS5pc0FycmF5KHJhd0ZyYWdtZW50Lm8pID09PSB0cnVlXHJcbiAgICAgICAgJiYgcmF3RnJhZ21lbnQuby5sZW5ndGggPiAwXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgbzogSVJlbmRlck91dGxpbmVGcmFnbWVudDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgcmF3RnJhZ21lbnQubykge1xyXG5cclxuICAgICAgICAgICAgbyA9IGxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50Lm8ucHVzaChvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZyYWdtZW50O1xyXG59O1xyXG5cclxuY29uc3QgbG9hZENoYXJ0cyA9IChcclxuICAgIG91dGxpbmU6IElSZW5kZXJPdXRsaW5lLFxyXG4gICAgcmF3T3V0bGluZUNoYXJ0czogQXJyYXk8YW55PlxyXG4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBvdXRsaW5lLmMgPSBbXTtcclxuICAgIGxldCBjOiBJUmVuZGVyT3V0bGluZUNoYXJ0O1xyXG5cclxuICAgIGZvciAoY29uc3QgY2hhcnQgb2YgcmF3T3V0bGluZUNoYXJ0cykge1xyXG5cclxuICAgICAgICBjID0gbmV3IFJlbmRlck91dGxpbmVDaGFydCgpO1xyXG4gICAgICAgIGMuaSA9IGNoYXJ0Lmk7XHJcbiAgICAgICAgYy5wID0gY2hhcnQucDtcclxuICAgICAgICBvdXRsaW5lLmMucHVzaChjKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGdPdXRsaW5lQ29kZSA9IHtcclxuXHJcbiAgICBnZXRPdXRsaW5lRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X291dGxpbmVGcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbZnJhZ21lbnRJRF07XHJcblxyXG4gICAgICAgIHJldHVybiBmcmFnbWVudCA/PyBudWxsO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRPdXRsaW5lRnJhZ21lbnRDaGFpbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRJRHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICBsZXQgZnJhZ21lbnQ6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsO1xyXG5cclxuICAgICAgICB3aGlsZSAoZnJhZ21lbnRJRCkge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnQgPSBnT3V0bGluZUNvZGUuZ2V0T3V0bGluZUZyYWdtZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudElEXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRJRCA9IGZyYWdtZW50Lmk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50SURzLnB1c2goZnJhZ21lbnRJRCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnRJRHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRPdXRsaW5lOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBvdXRsaW5lUmVzcG9uc2U6IGFueVxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhd091dGxpbmUgPSBvdXRsaW5lUmVzcG9uc2UuanNvbkRhdGE7XHJcbiAgICAgICAgY29uc3Qgb3V0bGluZSA9IG5ldyBSZW5kZXJPdXRsaW5lKCk7XHJcbiAgICAgICAgb3V0bGluZS52ID0gcmF3T3V0bGluZS52O1xyXG5cclxuICAgICAgICBpZiAocmF3T3V0bGluZS5jXHJcbiAgICAgICAgICAgICYmIEFycmF5LmlzQXJyYXkocmF3T3V0bGluZS5jKSA9PT0gdHJ1ZVxyXG4gICAgICAgICAgICAmJiByYXdPdXRsaW5lLmMubGVuZ3RoID4gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsb2FkQ2hhcnRzKFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZSxcclxuICAgICAgICAgICAgICAgIHJhd091dGxpbmUuY1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0bGluZS52ID0gcmF3T3V0bGluZS52O1xyXG5cclxuICAgICAgICBvdXRsaW5lLnIgPSBsb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLCBcclxuICAgICAgICAgICAgcmF3T3V0bGluZS5yXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUub3V0bGluZSA9IG91dGxpbmU7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuc2V0Um9vdE91dGxpbmVGcmFnbWVudElEKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdPdXRsaW5lQ29kZTtcclxuXHJcbiIsImltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBnT3V0bGluZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ091dGxpbmVDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGcmFnbWVudEVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0c1wiO1xyXG5pbXBvcnQgZ0ZpbGVDb25zdGFudHMgZnJvbSBcIi4uL2dGaWxlQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcblxyXG5cclxuY29uc3QgZ091dGxpbmVBY3Rpb25zID0ge1xyXG5cclxuICAgIGxvYWRPdXRsaW5lOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBvdXRsaW5lUmVzcG9uc2U6IGFueVxyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBnT3V0bGluZUNvZGUubG9hZE91dGxpbmUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvdXRsaW5lUmVzcG9uc2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZE91dGxpbmVBbmRSZXF1ZXN0RnJhZ21lbnRzOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBvdXRsaW5lUmVzcG9uc2U6IGFueSxcclxuICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudEZvbGRlclVybCA9IHN0YXRlLnJlbmRlclN0YXRlLmd1aWRlPy5mcmFnbWVudEZvbGRlclVybDtcclxuXHJcbiAgICAgICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKGZyYWdtZW50Rm9sZGVyVXJsKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ091dGxpbmVDb2RlLmxvYWRPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRmluZCBvdXRsaW5lZnJhZ21lbnQgd2l0aCBpZCA9IGxhc3RGcmFnbWVudElEO1xyXG4gICAgICAgIC8vIFRoZW4gd2FsayB1cCB0aHJvdWdoIHRoZSBwYXJlbnRzLCBsb2FkaW5nIGVhY2ggaW4gdHVybiB1bnRpbCByZWFjaGluZyByb290XHJcblxyXG4gICAgICAgIGxldCBjaGFpbk91dGxpbmVGcmFnbWVudHM6IEFycmF5PElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ+ID0gW107XHJcblxyXG4gICAgICAgIGxldCBvdXRsaW5lRnJhZ21lbnQgPSBnT3V0bGluZUNvZGUuZ2V0T3V0bGluZUZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKG91dGxpbmVGcmFnbWVudCkge1xyXG5cclxuICAgICAgICAgICAgY2hhaW5PdXRsaW5lRnJhZ21lbnRzLnB1c2gob3V0bGluZUZyYWdtZW50KTtcclxuICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50ID0gb3V0bGluZUZyYWdtZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYWluT3V0bGluZUZyYWdtZW50cy5wb3AoKTsgLy8gUmVtb3ZlIGFzIHRoaXMgaXMgdGhlIHJvb3QgYW5kIGlzIGFscmVhZHkgbG9hZGVkIHdpdGggdGhlIGd1aWRlXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUubG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cyA9IGNoYWluT3V0bGluZUZyYWdtZW50cztcclxuICAgICAgICBjb25zdCBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEO1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudExvYWRFZmZlY3RzOiBBcnJheTxJSHR0cEZldGNoSXRlbT4gPSBbXTtcclxuICAgICAgICBsZXQgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudDtcclxuICAgICAgICBsZXQgZnJhZ21lbnRQYXRoOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGxvYWRGcmFnbWVudEVmZmVjdDogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSBjaGFpbk91dGxpbmVGcmFnbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudCA9IGNoYWluT3V0bGluZUZyYWdtZW50c1tpXTtcclxuICAgICAgICAgICAgZnJhZ21lbnQgPSBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnQuZl07XHJcblxyXG4gICAgICAgICAgICBpZiAoZnJhZ21lbnRcclxuICAgICAgICAgICAgICAgICYmIGZyYWdtZW50LnVpLmRpc2N1c3Npb25Mb2FkZWQgPT09IHRydWVcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRQYXRoID0gYCR7ZnJhZ21lbnRGb2xkZXJVcmx9LyR7b3V0bGluZUZyYWdtZW50LmZ9JHtnRmlsZUNvbnN0YW50cy5mcmFnbWVudEZpbGVFeHRlbnNpb259YDtcclxuXHJcbiAgICAgICAgICAgIGxvYWRGcmFnbWVudEVmZmVjdCA9IGdGcmFnbWVudEVmZmVjdHMuZ2V0Q2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50LmYsXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudFBhdGgsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQuaVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxvYWRGcmFnbWVudEVmZmVjdCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZyYWdtZW50TG9hZEVmZmVjdHMucHVzaChsb2FkRnJhZ21lbnRFZmZlY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZnJhZ21lbnRMb2FkRWZmZWN0c1xyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnT3V0bGluZUFjdGlvbnM7XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCBnUmVuZGVyQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9nT3V0bGluZUFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnRmlsZUNvbnN0YW50cyBmcm9tIFwiLi4vZ0ZpbGVDb25zdGFudHNcIjtcclxuXHJcblxyXG5jb25zdCBnZXRHdWlkZU91dGxpbmUgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgbG9hZERlbGVnYXRlOiAoc3RhdGU6IElTdGF0ZSwgb3V0bGluZVJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5XHJcbik6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlLnJlbmRlclN0YXRlLmd1aWRlPy5wYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhbGxJRDogc3RyaW5nID0gVS5nZW5lcmF0ZUd1aWQoKTtcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIEFjdGlvblR5cGUuR2V0T3V0bGluZVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBmcmFnbWVudEZvbGRlclVybDogc3RyaW5nID0gc3RhdGUucmVuZGVyU3RhdGUuZ3VpZGUuZnJhZ21lbnRGb2xkZXJVcmwgPz8gJ251bGwnO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtmcmFnbWVudEZvbGRlclVybH0vJHtnRmlsZUNvbnN0YW50cy5ndWlkZU91dGxpbmVGaWxlbmFtZX1gO1xyXG5cclxuICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGxvYWREZWxlZ2F0ZSxcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgZ2V0dGluZyBvdXRsaW5lIGRhdGEgZnJvbSB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dSZW5kZXJFZmZlY3RzLmdldEd1aWRlT3V0bGluZS5uYW1lfSxcclxuICAgICAgICAgICAgICAgIFwiY2FsbElEOiAke2NhbGxJRH1cclxuICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnUmVuZGVyRWZmZWN0cyA9IHtcclxuXHJcbiAgICBnZXRHdWlkZU91dGxpbmU6IChzdGF0ZTogSVN0YXRlKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRHdWlkZU91dGxpbmUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnUmVuZGVyQWN0aW9ucy5sb2FkT3V0bGluZVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEd1aWRlT3V0bGluZUFuZExvYWRGcmFnbWVudHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9hZERlbGVnYXRlID0gKFxyXG4gICAgICAgICAgICBzdGF0ZTogSVN0YXRlLCBcclxuICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1JlbmRlckFjdGlvbnMubG9hZE91dGxpbmVBbmRSZXF1ZXN0RnJhZ21lbnRzKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lUmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0R3VpZGVPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgbG9hZERlbGVnYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdSZW5kZXJFZmZlY3RzO1xyXG4iLCJpbXBvcnQgSVJlbmRlckd1aWRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyR3VpZGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJHdWlkZSBpbXBsZW1lbnRzIElSZW5kZXJHdWlkZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBmcmFnbWVudEZvbGRlclVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJHdWlkZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckd1aWRlXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgUmVuZGVyR3VpZGUgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJHdWlkZVwiO1xyXG5pbXBvcnQgVHJlZVNvbHZlIGZyb20gXCIuLi8uLi9zdGF0ZS93aW5kb3cvVHJlZVNvbHZlXCI7XHJcbmltcG9ydCBnRmlsZUNvbnN0YW50cyBmcm9tIFwiLi4vZ0ZpbGVDb25zdGFudHNcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4vZ0ZyYWdtZW50Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IHBhcnNlR3VpZGUgPSAocmF3R3VpZGU6IGFueSk6IElSZW5kZXJHdWlkZSA9PiB7XHJcblxyXG4gICAgY29uc3QgZ3VpZGU6IElSZW5kZXJHdWlkZSA9IG5ldyBSZW5kZXJHdWlkZShyYXdHdWlkZS5pZCk7XHJcbiAgICBndWlkZS50aXRsZSA9IHJhd0d1aWRlLnRpdGxlID8/ICcnO1xyXG4gICAgZ3VpZGUuZGVzY3JpcHRpb24gPSByYXdHdWlkZS5kZXNjcmlwdGlvbiA/PyAnJztcclxuICAgIGd1aWRlLnBhdGggPSByYXdHdWlkZS5wYXRoID8/IG51bGw7XHJcbiAgICBsZXQgZm9sZGVyUGF0aCA9IHJhd0d1aWRlLmZyYWdtZW50Rm9sZGVyUGF0aCA/PyBudWxsO1xyXG4gICAgbGV0IGRpdmlkZXIgPSAnJztcclxuXHJcbiAgICBpZiAoIVUuaXNOdWxsT3JXaGl0ZVNwYWNlKGZvbGRlclBhdGgpKSB7XHJcblxyXG4gICAgICAgIGlmICghbG9jYXRpb24ub3JpZ2luLmVuZHNXaXRoKCcvJykpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9sZGVyUGF0aC5zdGFydHNXaXRoKCcvJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkaXZpZGVyID0gJy8nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZm9sZGVyUGF0aC5zdGFydHNXSXRoKCcvJykgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb2xkZXJQYXRoID0gZm9sZGVyUGF0aC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGd1aWRlLmZyYWdtZW50Rm9sZGVyVXJsID0gYCR7bG9jYXRpb24ub3JpZ2lufSR7ZGl2aWRlcn0ke2ZvbGRlclBhdGh9YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3VpZGU7XHJcbn07XHJcblxyXG5jb25zdCBwYXJzZVJlbmRlcmluZ0NvbW1lbnQgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcmF3OiBhbnlcclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFyYXcpIHtcclxuICAgICAgICByZXR1cm4gcmF3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbntcclxuICAgIFwiZ3VpZGVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCJkQnQ3Sk4xdnRcIlxyXG4gICAgfSxcclxuICAgIFwiZnJhZ21lbnRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCJkQnQ3Sk4xdnRcIixcclxuICAgICAgICBcInRvcExldmVsTWFwS2V5XCI6IFwiY3YxVFJsMDFyZlwiLFxyXG4gICAgICAgIFwibWFwS2V5Q2hhaW5cIjogXCJjdjFUUmwwMXJmXCIsXHJcbiAgICAgICAgXCJndWlkZUlEXCI6IFwiZEJ0N0pOMUhlXCIsXHJcbiAgICAgICAgXCJndWlkZVBhdGhcIjogXCJjOi9HaXRIdWIvSEFMLkRvY3VtZW50YXRpb24vdHNtYXBzVGVzdC9UZXN0T3B0aW9uc0ZvbGRlci9Ib2xkZXIvVGVzdE9wdGlvbnMudHNtYXBcIixcclxuICAgICAgICBcInBhcmVudEZyYWdtZW50SURcIjogbnVsbCxcclxuICAgICAgICBcImNoYXJ0S2V5XCI6IFwiY3YxVFJsMDFyZlwiLFxyXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkQnQ3S1oxQU5cIixcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uXCI6IFwiT3B0aW9uIDFcIixcclxuICAgICAgICAgICAgICAgIFwiaXNBbmNpbGxhcnlcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IDFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBcImRCdDdLWjFSYlwiLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25cIjogXCJPcHRpb24gMlwiLFxyXG4gICAgICAgICAgICAgICAgXCJpc0FuY2lsbGFyeVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib3JkZXJcIjogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwiZEJ0N0taMjRCXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvblwiOiBcIk9wdGlvbiAzXCIsXHJcbiAgICAgICAgICAgICAgICBcImlzQW5jaWxsYXJ5XCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiAzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0gICAgXHJcbiAgICAqL1xyXG5cclxuICAgIHN0YXRlLnJlbmRlclN0YXRlLmd1aWRlID0gcGFyc2VHdWlkZShyYXcuZ3VpZGUpO1xyXG5cclxuICAgIGdGcmFnbWVudENvZGUucGFyc2VBbmRMb2FkUm9vdEZyYWdtZW50KFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIHJhdy5mcmFnbWVudFxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGdSZW5kZXJDb2RlID0ge1xyXG5cclxuICAgIHJlZ2lzdGVyR3VpZGVDb21tZW50OiAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyZWVTb2x2ZUd1aWRlOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbHRlcnMudHJlZVNvbHZlR3VpZGVJRCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0cmVlU29sdmVHdWlkZVxyXG4gICAgICAgICAgICAmJiB0cmVlU29sdmVHdWlkZS5oYXNDaGlsZE5vZGVzKCkgPT09IHRydWVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkTm9kZTogQ2hpbGROb2RlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlU29sdmVHdWlkZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hpbGROb2RlID0gdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUgPSBuZXcgVHJlZVNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnJlbmRlcmluZ0NvbW1lbnQgPSBjaGlsZE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VSZW5kZXJpbmdDb21tZW50OiAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmU/LnJlbmRlcmluZ0NvbW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGd1aWRlUmVuZGVyQ29tbWVudCA9IHdpbmRvdy5UcmVlU29sdmUucmVuZGVyaW5nQ29tbWVudDtcclxuICAgICAgICAgICAgZ3VpZGVSZW5kZXJDb21tZW50ID0gZ3VpZGVSZW5kZXJDb21tZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ3VpZGVSZW5kZXJDb21tZW50LnN0YXJ0c1dpdGgoZ0ZpbGVDb25zdGFudHMuZ3VpZGVSZW5kZXJDb21tZW50VGFnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBndWlkZVJlbmRlckNvbW1lbnQgPSBndWlkZVJlbmRlckNvbW1lbnQuc3Vic3RyaW5nKGdGaWxlQ29uc3RhbnRzLmd1aWRlUmVuZGVyQ29tbWVudFRhZy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCByYXcgPSBKU09OLnBhcnNlKGd1aWRlUmVuZGVyQ29tbWVudCk7XHJcblxyXG4gICAgICAgICAgICBwYXJzZVJlbmRlcmluZ0NvbW1lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJhd1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJGcmFnbWVudENvbW1lbnQ6ICgpID0+IHtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdSZW5kZXJDb2RlO1xyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IFN0YXRlIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9TdGF0ZVwiO1xyXG5pbXBvcnQgVHJlZVNvbHZlIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS93aW5kb3cvVHJlZVNvbHZlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ1JlbmRlckVmZmVjdHMgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9lZmZlY3RzL2dSZW5kZXJFZmZlY3RzXCI7XHJcbmltcG9ydCBnUmVuZGVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ1JlbmRlckNvZGVcIjtcclxuXHJcblxyXG5jb25zdCBpbml0aWFsaXNlU3RhdGUgPSAoKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmUpIHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZSA9IG5ldyBUcmVlU29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGF0ZTogSVN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgICBnUmVuZGVyQ29kZS5wYXJzZVJlbmRlcmluZ0NvbW1lbnQoc3RhdGUpO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZTtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkUmVuZGVyRGlzcGxheSA9IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUucm9vdFxyXG4gICAgICAgIHx8ICFzdGF0ZS5yZW5kZXJTdGF0ZS5yb290Lm9wdGlvbnNcclxuICAgICAgICB8fCBzdGF0ZS5yZW5kZXJTdGF0ZS5yb290Lm9wdGlvbnMubGVuZ3RoID09PSAwXHJcbiAgICApIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBnUmVuZGVyRWZmZWN0cy5nZXRHdWlkZU91dGxpbmUoc3RhdGUpXHJcbiAgICBdO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRSZW5kZXJDaGFpbkRpc3BsYXkgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcXVlcnlTdHJpbmc6IHN0cmluZ1xyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgaWYgKHF1ZXJ5U3RyaW5nLnN0YXJ0c1dpdGgoJz8nKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nLnN1YnN0cmluZygxKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsYXN0T3V0bGluZUZyYWdtZW50SUQgPSBxdWVyeVN0cmluZztcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGdSZW5kZXJFZmZlY3RzLmdldEd1aWRlT3V0bGluZUFuZExvYWRGcmFnbWVudHMoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICApXHJcbiAgICBdO1xyXG59O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVdpdGhvdXRBdXRob3Jpc2F0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgcXVlcnlTdHJpbmc6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcblxyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgICAgaWYgKCFVLmlzTnVsbE9yV2hpdGVTcGFjZShxdWVyeVN0cmluZykpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBidWlsZFJlbmRlckNoYWluRGlzcGxheShcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcXVlcnlTdHJpbmdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBidWlsZFJlbmRlckRpc3BsYXkoc3RhdGUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGU6IGFueSkge1xyXG5cclxuICAgICAgICBzdGF0ZS5nZW5lcmljRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRTdGF0ZSA9IHtcclxuXHJcbiAgICBpbml0aWFsaXNlOiAoKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBzdGF0ZTogSVN0YXRlID0gaW5pdGlhbGlzZVN0YXRlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbml0aWFsaXNlV2l0aG91dEF1dGhvcmlzYXRpb24oc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdFN0YXRlO1xyXG5cclxuIiwiaW1wb3J0IEZpbHRlcnMgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL2NvbnN0YW50cy9GaWx0ZXJzXCI7XHJcbmltcG9ydCBUcmVlU29sdmUgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL3dpbmRvdy9UcmVlU29sdmVcIjtcclxuXHJcblxyXG5jb25zdCByZW5kZXJDb21tZW50cyA9IHtcclxuXHJcbiAgICByZWdpc3Rlckd1aWRlQ29tbWVudDogKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB0cmVlU29sdmVHdWlkZTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWx0ZXJzLnRyZWVTb2x2ZUd1aWRlSUQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodHJlZVNvbHZlR3VpZGVcclxuICAgICAgICAgICAgJiYgdHJlZVNvbHZlR3VpZGUuaGFzQ2hpbGROb2RlcygpID09PSB0cnVlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZE5vZGU6IENoaWxkTm9kZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkTm9kZSA9IHRyZWVTb2x2ZUd1aWRlLmNoaWxkTm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3aW5kb3cuVHJlZVNvbHZlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlID0gbmV3IFRyZWVTb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5yZW5kZXJpbmdDb21tZW50ID0gY2hpbGROb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlbmRlckNvbW1lbnRzO1xyXG4iLCJpbXBvcnQgeyBhcHAgfSBmcm9tIFwiLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcblxuaW1wb3J0IGluaXRTdWJzY3JpcHRpb25zIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L3N1YnNjcmlwdGlvbnMvaW5pdFN1YnNjcmlwdGlvbnNcIjtcbmltcG9ydCBpbml0RXZlbnRzIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdEV2ZW50c1wiO1xuaW1wb3J0IGluaXRWaWV3IGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L3ZpZXdzL2luaXRWaWV3XCI7XG5pbXBvcnQgaW5pdFN0YXRlIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdFN0YXRlXCI7XG5pbXBvcnQgcmVuZGVyQ29tbWVudHMgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvY29kZS9yZW5kZXJDb21tZW50c1wiO1xuXG5cbmluaXRFdmVudHMucmVnaXN0ZXJHbG9iYWxFdmVudHMoKTtcbnJlbmRlckNvbW1lbnRzLnJlZ2lzdGVyR3VpZGVDb21tZW50KCk7XG5cbih3aW5kb3cgYXMgYW55KS5Db21wb3NpdGVGbG93c0F1dGhvciA9IGFwcCh7XG4gICAgXG4gICAgbm9kZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmVlU29sdmVGcmFnbWVudHNcIiksXG4gICAgaW5pdDogaW5pdFN0YXRlLmluaXRpYWxpc2UsXG4gICAgdmlldzogaW5pdFZpZXcuYnVpbGRWaWV3LFxuICAgIHN1YnNjcmlwdGlvbnM6IGluaXRTdWJzY3JpcHRpb25zLFxuICAgIG9uRW5kOiBpbml0RXZlbnRzLm9uUmVuZGVyRmluaXNoZWRcbn0pO1xuXG5cbiJdLCJuYW1lcyI6WyJwcm9wcyIsIm91dHB1dCIsIlUiLCJlZmZlY3QiLCJodHRwRWZmZWN0IiwiQWN0aW9uVHlwZSIsInN0YXRlIiwibG9jYXRpb24iLCJuYXZpZ2F0aW9uRGlyZWN0aW9uIiwiU3RlcEhpc3RvcnkiLCJTY3JvbGxIb3BUeXBlIiwiZ1JlbmRlckFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLGdCQUFnQjtBQUNwQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxZQUFZO0FBQ2hCLElBQUksWUFBWSxDQUFFO0FBQ2xCLElBQUksWUFBWSxDQUFFO0FBQ2xCLElBQUksTUFBTSxVQUFVO0FBQ3BCLElBQUksVUFBVSxNQUFNO0FBQ3BCLElBQUksUUFDRixPQUFPLDBCQUEwQixjQUM3Qix3QkFDQTtBQUVOLElBQUksY0FBYyxTQUFTLEtBQUs7QUFDOUIsTUFBSSxNQUFNO0FBRVYsTUFBSSxPQUFPLFFBQVEsU0FBVSxRQUFPO0FBRXBDLE1BQUksUUFBUSxHQUFHLEtBQUssSUFBSSxTQUFTLEdBQUc7QUFDbEMsYUFBUyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLO0FBQ3hDLFdBQUssTUFBTSxZQUFZLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSTtBQUN0QyxnQkFBUSxPQUFPLE9BQU87QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQSxFQUNMLE9BQVM7QUFDTCxhQUFTLEtBQUssS0FBSztBQUNqQixVQUFJLElBQUksQ0FBQyxHQUFHO0FBQ1YsZ0JBQVEsT0FBTyxPQUFPO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVELFNBQU87QUFDVDtBQUVBLElBQUksUUFBUSxTQUFTLEdBQUcsR0FBRztBQUN6QixNQUFJLE1BQU0sQ0FBRTtBQUVaLFdBQVMsS0FBSyxFQUFHLEtBQUksQ0FBQyxJQUFJLEVBQUUs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
