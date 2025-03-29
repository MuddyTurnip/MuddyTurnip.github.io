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
function makeRemoveListener(attachTo, dispatch, action, eventName) {
  var handler = dispatch.bind(null, action);
  attachTo.addEventListener(eventName, handler);
  return function() {
    attachTo.removeEventListener(eventName, handler);
  };
}
function keyboardEffect(dispatch, props) {
  var removeListenerForEvent = makeRemoveListener.bind(
    null,
    document,
    dispatch,
    props.action
  );
  var removeDown = props.downs ? removeListenerForEvent("keydown") : null;
  var removeUp = props.ups ? removeListenerForEvent("keyup") : null;
  var removePress = props.presses ? removeListenerForEvent("keypress") : null;
  return function() {
    removeDown && removeDown();
    removeUp && removeUp();
    removePress && removePress();
  };
}
function Keyboard(props) {
  return [keyboardEffect, props];
}
var DisplayType = /* @__PURE__ */ ((DisplayType2) => {
  DisplayType2["None"] = "none";
  DisplayType2["Topics"] = "topics";
  DisplayType2["Article"] = "article";
  DisplayType2["Step"] = "step";
  return DisplayType2;
})(DisplayType || {});
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
class StepUI {
  constructor(uiID) {
    __publicField(this, "uiID");
    __publicField(this, "pegs", []);
    __publicField(this, "title", null);
    __publicField(this, "optionTitle", null);
    __publicField(this, "optionText", null);
    __publicField(this, "autofocus", true);
    __publicField(this, "expanded", false);
    __publicField(this, "expandOptions", false);
    __publicField(this, "end", false);
    __publicField(this, "note", false);
    __publicField(this, "pegCrown", false);
    this.uiID = uiID;
  }
}
class Step {
  constructor(id, uiID, text) {
    __publicField(this, "id");
    __publicField(this, "token", "");
    __publicField(this, "text");
    __publicField(this, "optionIntro", "");
    __publicField(this, "order", 1);
    __publicField(this, "subToken", "");
    __publicField(this, "leaf", false);
    __publicField(this, "type", "");
    __publicField(this, "options", []);
    __publicField(this, "bin", {});
    __publicField(this, "ui");
    this.id = id;
    this.text = text;
    this.ui = new StepUI(uiID);
  }
}
var StepType = /* @__PURE__ */ ((StepType2) => {
  StepType2["None"] = "none";
  StepType2["Root"] = "root";
  StepType2["Step"] = "step";
  StepType2["AncillaryRoot"] = "ancillaryRoot";
  StepType2["AncillaryStep"] = "ancillaryStep";
  return StepType2;
})(StepType || {});
class StepCache {
  constructor(step, parent) {
    __publicField(this, "chainID");
    __publicField(this, "parentChainID");
    __publicField(this, "step");
    __publicField(this, "children", []);
    __publicField(this, "ancillaries", []);
    __publicField(this, "parent");
    __publicField(this, "heir", null);
    __publicField(this, "type", StepType.Step);
    __publicField(this, "isAncillary", false);
    this.step = step;
    this.parent = parent;
    this.parentChainID = parent.chainID;
    this.chainID = `${parent.chainID}.${step.order}`;
    const stepUiID = step.ui.uiID;
    const parentOptions = parent.step.options;
    for (let i = 0; i < parentOptions.length; i++) {
      if (parentOptions[i].ui.uiID === stepUiID) {
        step.ui.optionText = parentOptions[i].text;
        return;
      }
    }
    throw "No matching uiID in parent options!!!";
  }
}
class RootCache {
  constructor(step) {
    __publicField(this, "chainID");
    __publicField(this, "parentChainID");
    __publicField(this, "step");
    __publicField(this, "children", []);
    __publicField(this, "ancillaries", []);
    __publicField(this, "parent", null);
    __publicField(this, "type", StepType.Root);
    __publicField(this, "heir", null);
    __publicField(this, "isAncillary", false);
    this.step = step;
    this.parentChainID = "0";
    this.chainID = "0.1";
  }
}
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
class StepOption extends Step {
  constructor(id, uiID, text) {
    super(
      id,
      uiID,
      text
    );
    __publicField(this, "ancillary", false);
  }
}
class AncillaryCache extends StepCache {
  constructor(step, parent) {
    super(
      step,
      parent
    );
    __publicField(this, "isAncillary", true);
  }
}
class ArticleScene {
  constructor() {
    __publicField(this, "key", "");
    __publicField(this, "r", "");
    __publicField(this, "guid", null);
    __publicField(this, "created", null);
    __publicField(this, "modified", null);
    __publicField(this, "expandedOptionIDs", []);
    __publicField(this, "expandedAncillaryIDs", []);
  }
}
class ChainPayload {
  constructor(stepID, parentChainID, uiID) {
    __publicField(this, "stepID");
    __publicField(this, "parentChainID");
    __publicField(this, "uiID");
    this.stepID = stepID;
    this.parentChainID = parentChainID;
    this.uiID = uiID;
  }
}
class ChainStepPayload {
  constructor(stepID, parentChainID, parent, uiID) {
    __publicField(this, "stepID");
    __publicField(this, "parentChainID");
    __publicField(this, "parent");
    __publicField(this, "uiID");
    this.stepID = stepID;
    this.parentChainID = parentChainID;
    this.parent = parent;
    this.uiID = uiID;
  }
}
const gArticleCode = {
  checkIfOptionsExpanded: (state, stepCache) => {
    if (!state || !stepCache || !state.topicState.articleScene) {
      return;
    }
    const articleScene = state.topicState.articleScene;
    const options = stepCache.step.options;
    let option;
    for (let i = 0; i < options.length; i++) {
      option = options[i];
      if (articleScene.expandedAncillaryIDs.includes(option.id)) {
        const chainPayload = new ChainPayload(
          option.id,
          stepCache.chainID,
          option.ui.uiID
        );
        const action = (state2) => {
          return gStepActions.showAncillary(
            state2,
            chainPayload
          );
        };
        gStateCode.AddRunActionImmediate(
          state,
          action
        );
        continue;
      } else if (articleScene.expandedOptionIDs.includes(option.id)) {
        const chainPayload = new ChainStepPayload(
          option.id,
          stepCache.chainID,
          stepCache.step,
          option.ui.uiID
        );
        const action = (state2) => {
          return gStepActions.expandOption(
            state2,
            chainPayload
          );
        };
        gStateCode.AddRunActionImmediate(
          state,
          action
        );
        continue;
      }
    }
  },
  loadArticleScene: (rawArticleScene) => {
    if (!rawArticleScene || gUtilities.isNullOrWhiteSpace(rawArticleScene.guid) === true) {
      return null;
    }
    const articleScene = new ArticleScene();
    articleScene.key = rawArticleScene.key;
    articleScene.r = rawArticleScene.r;
    articleScene.guid = rawArticleScene.guid;
    articleScene.created = rawArticleScene.created;
    articleScene.modified = rawArticleScene.modified;
    articleScene.expandedAncillaryIDs = [...rawArticleScene.expandedAncillaryIDs];
    articleScene.expandedOptionIDs = [...rawArticleScene.expandedOptionIDs];
    return articleScene;
  },
  loadArticleSceneCache: (state, rawArticleScene) => {
    const articleScene = gArticleCode.loadArticleScene(rawArticleScene);
    if (!articleScene) {
      return;
    }
    state.topicState.articleScene = articleScene;
    state.topicState.ghostArticleScene = gArticleCode.clone(state.topicState.articleScene);
    gHistoryCode.pushBrowserHistoryState(state);
  },
  buildArticleScene: (state) => {
    var _a, _b;
    if (!state || !((_a = state.topicState.topicCache) == null ? void 0 : _a.root) || state.topicState.ui.raw === true) {
      return;
    }
    const articleScene = new ArticleScene();
    const rootCache = (_b = state.topicState.topicCache) == null ? void 0 : _b.root;
    gArticleCode.buildStepScene(
      rootCache,
      articleScene
    );
    state.topicState.articleScene = articleScene;
  },
  buildStepScene: (stepCache, articleScene) => {
    if (!stepCache) {
      return;
    }
    let ancillaryCache;
    for (let i = 0; i < stepCache.ancillaries.length; i++) {
      ancillaryCache = stepCache.ancillaries[i];
      if (ancillaryCache.step.ui.expanded === true) {
        articleScene.expandedAncillaryIDs.push(ancillaryCache.step.id);
        gArticleCode.buildStepScene(
          ancillaryCache,
          articleScene
        );
      }
    }
    const ancillaryCacheCast = stepCache;
    if (ancillaryCacheCast.heir) {
      if (gStepCode.hasMultipleSimpleOptions(stepCache.step.options)) {
        articleScene.expandedOptionIDs.push(ancillaryCacheCast.heir.step.id);
      }
      gArticleCode.buildStepScene(
        ancillaryCacheCast.heir,
        articleScene
      );
    } else if (stepCache.heir) {
      if (gStepCode.hasMultipleSimpleOptions(stepCache.step.options)) {
        articleScene.expandedOptionIDs.push(stepCache.heir.step.id);
      }
      gArticleCode.buildStepScene(
        stepCache.heir,
        articleScene
      );
    }
  },
  clone: (scene) => {
    const clone = new ArticleScene();
    clone.key = scene.key;
    clone.r = scene.r;
    clone.guid = scene.guid;
    clone.created = scene.created;
    clone.modified = scene.modified;
    clone.expandedAncillaryIDs = [...scene.expandedAncillaryIDs];
    clone.expandedOptionIDs = [...scene.expandedOptionIDs];
    return clone;
  },
  isSceneChanged: (state) => {
    const articleScene = state.topicState.articleScene;
    const ghostArticleScene = state.topicState.ghostArticleScene;
    if (!articleScene) {
      return false;
    }
    if (articleScene.expandedAncillaryIDs.length === 0 && articleScene.expandedOptionIDs.length === 0) {
      return false;
    }
    if (!ghostArticleScene) {
      if (articleScene.expandedAncillaryIDs.length > 0 || articleScene.expandedOptionIDs.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    const changed = articleScene.created !== ghostArticleScene.created || articleScene.guid !== ghostArticleScene.guid || articleScene.key !== ghostArticleScene.key || articleScene.modified !== ghostArticleScene.modified || articleScene.r !== ghostArticleScene.r || !gUtilities.checkArraysEqual(articleScene.expandedAncillaryIDs, ghostArticleScene.expandedAncillaryIDs) || !gUtilities.checkArraysEqual(articleScene.expandedOptionIDs, ghostArticleScene.expandedOptionIDs);
    return changed;
  }
};
const buildTitle = (step) => {
  if (gUtilities.isNullOrWhiteSpace(step.ui.title) === false || gUtilities.isNullOrWhiteSpace(step.text)) {
    return;
  }
  const jsonElements = JSON.parse(step.text);
  step.ui.title = buildTitleFromJson(jsonElements);
};
const buildOptionTitle = (step) => {
  if (gUtilities.isNullOrWhiteSpace(step.ui.optionTitle) === false || gUtilities.isNullOrWhiteSpace(step.optionIntro)) {
    return;
  }
  const jsonElements = JSON.parse(step.optionIntro);
  step.ui.optionTitle = buildTitleFromJson(jsonElements);
  if (gUtilities.isNullOrWhiteSpace(step.ui.optionTitle) === true) {
    if (step.ui.pegs.length > 0) {
      step.ui.optionTitle = step.ui.pegs[step.ui.pegs.length - 1];
    }
  }
  if (gUtilities.isNullOrWhiteSpace(step.ui.optionTitle) === true) {
    step.ui.optionTitle = step.ui.title;
  }
};
const buildTitleFromJson = (jsonElements) => {
  if (jsonElements.length === 0) {
    return "";
  }
  const title = checkChildrenForTitle(jsonElements);
  return title;
};
const checkElementForTitle = (element) => {
  if (!element) {
    return "";
  }
  if (typeof element === "string") {
    return element;
  }
  return checkChildrenForTitle(element.children);
};
const checkChildrenForTitle = (children) => {
  if (!children || !children.length || children.length === 0) {
    return "";
  }
  for (let i = 0; i < children.length; i++) {
    return checkElementForTitle(children[i]);
  }
  return "";
};
const findPegs = (step, input) => {
  let element;
  for (let i = 0; i < input.length; i++) {
    element = input[i];
    if (element && element.children) {
      if (element.name) {
        const pattern = /^h[1-3]$/;
        if (pattern.test(element.name)) {
          if (element.children && element.children.length === 1) {
            step.ui.pegs.push(element.children[0]);
            if (!element.attributes) {
              element.attributes = {};
            }
            element.attributes.id = gStepCode.buildPegID(
              step.ui.uiID,
              step.ui.pegs.length
            );
            element.attributes.class = "peg nav";
            if (i === 0) {
              step.ui.pegCrown = true;
              element.attributes.class = `${element.attributes.class} crown`;
            }
          }
        }
      }
      findPegs(
        step,
        element.children
      );
    }
  }
};
const loadPegs = (step) => {
  try {
    const result = JSON.parse(step.text);
    if (Array.isArray(result)) {
      findPegs(
        step,
        result
      );
      step.text = JSON.stringify(result);
    }
  } catch {
  }
};
const scanText = (step) => {
  const text = step.text.trim();
  const note = '[{"name":"p","attributes":{"class":"NOTE"},"children":["Dev"]}';
  if (text.startsWith(note)) {
    let length = note.length;
    if (text[length] === ",") {
      length++;
    }
    step.text = `[${step.text.substring(length)}`;
    step.ui.note = true;
    return;
  }
  const end = '[{"name":"p","attributes":{"class":"END"},"children":["Dev"]}';
  if (text.startsWith(end)) {
    let length = end.length;
    if (text[length] === ",") {
      length++;
    }
    step.text = `[${step.text.substring(length)}`;
    step.ui.end = true;
    return;
  }
  loadPegs(step);
  buildTitle(step);
  buildOptionTitle(step);
};
const loadStep = (state, rawStep, uiID) => {
  var _a;
  const step = new Step(
    rawStep.id,
    uiID,
    // gStateCode.getFreshKeyInt(state),
    rawStep.token
  );
  step.text = rawStep.text;
  step.optionIntro = rawStep.optionIntro;
  step.subToken = rawStep.subToken;
  step.type = rawStep.type;
  step.leaf = ((_a = rawStep.options) == null ? void 0 : _a.length) === 0;
  rawStep.options.forEach((rawOption) => {
    const option = loadOption$1(
      state,
      rawOption
    );
    step.options.push(option);
  });
  step.bin = rawStep.bin;
  scanText(step);
  return step;
};
const loadOption$1 = (state, raw) => {
  const option = new StepOption(
    raw.id,
    gStateCode.getFreshKeyInt(state),
    raw.text
  );
  option.order = raw.order;
  option.ancillary = raw.ancillary === true;
  option.bin = raw.bin;
  return option;
};
const gStepCode = {
  loadAncillaryChain: (state, ancillaryChainStepCache) => {
    gArticleCode.checkIfOptionsExpanded(
      state,
      ancillaryChainStepCache
    );
    const step = ancillaryChainStepCache.step;
    const options = step.options;
    let opt;
    let option = null;
    let optionCount = 0;
    for (let i = 0; i < options.length; i++) {
      opt = options[i];
      if (!opt.ancillary) {
        ++optionCount;
        option = opt;
      }
      if (optionCount > 1) {
        return;
      }
    }
    if (!option) {
      return;
    }
    const stepCache = gStepCode.getRegisteredStep(
      state,
      option.id,
      ancillaryChainStepCache.chainID
    );
    if (stepCache) {
      stepCache.step.ui.uiID = option.ui.uiID;
      gStepCode.loadAncillaryChain(
        state,
        stepCache
      );
      return;
    }
    const path = `Step/${option.id}`;
    const url = `${state.settings.apiUrl}/${path}`;
    const loadAction = (state2, response) => {
      const chainResponse = {
        response,
        parentChainID: ancillaryChainStepCache.chainID,
        uiID: option == null ? void 0 : option.ui.uiID
      };
      return gStepActions.loadAncillaryChainStep(
        state2,
        chainResponse
      );
    };
    gStateCode.AddReLoadDataEffectImmediate(
      state,
      `Load ancillary: ${option.id}`,
      url,
      loadAction
    );
  },
  loadChain: (state, chainStepCache) => {
    gArticleCode.checkIfOptionsExpanded(
      state,
      chainStepCache
    );
    const options = chainStepCache.step.options;
    let opt;
    let option = null;
    let optionCount = 0;
    for (let i = 0; i < options.length; i++) {
      opt = options[i];
      if (!opt.ancillary) {
        ++optionCount;
        option = opt;
      }
      if (optionCount > 1) {
        return;
      }
    }
    if (!option) {
      return;
    }
    const stepCache = gStepCode.getRegisteredStep(
      state,
      option.id,
      chainStepCache.chainID,
      true
    );
    gHistoryCode.resetRaw();
    if (stepCache) {
      gStepCode.setCurrent(
        state,
        stepCache
      );
      stepCache.step.ui.uiID = option.ui.uiID;
      state.loading = false;
      gStepCode.loadChain(
        state,
        stepCache
      );
      return;
    }
    const path = `Step/${option.id}`;
    const url = `${state.settings.apiUrl}/${path}`;
    const loadAction = (state2, response) => {
      const chainResponse = {
        response,
        parentChainID: chainStepCache.chainID,
        uiID: option == null ? void 0 : option.ui.uiID
      };
      return gStepActions.loadChainStep(
        state2,
        chainResponse
      );
    };
    gStateCode.AddReLoadDataEffectImmediate(
      state,
      `Load chain: ${option.id}`,
      url,
      loadAction
    );
  },
  buildPegID: (stepUiID, pegCounter) => {
    return `peg-${stepUiID}-${pegCounter}`;
  },
  buildStepID: (stepUiID) => {
    return `step-${stepUiID}`;
  },
  buildOptionIntroID: (stepUiID) => {
    return `options-${stepUiID}`;
  },
  buildNavID: (stepUiID) => {
    return `nav-${stepUiID}`;
  },
  getIDFromNavID: (navID) => {
    return navID.substring(4);
  },
  hasMultipleSimpleOptions: (options) => {
    let option;
    let optionCount = 0;
    for (let i = 0; i < options.length; i++) {
      option = options[i];
      if (!option.ancillary) {
        ++optionCount;
      }
      if (optionCount > 1) {
        return true;
      }
    }
    return false;
  },
  cloneOptions: (state, inputs) => {
    const options = [];
    let input;
    let option;
    for (let i = 0; i < inputs.length; i++) {
      input = inputs[i];
      option = gStepCode.cloneOption(
        state,
        input
      );
      options.push(option);
    }
    return options;
  },
  cloneOption: (state, input, newID = null) => {
    if (!newID) {
      newID = input.id;
    }
    const option = new StepOption(
      newID,
      gStateCode.getFreshKeyInt(state),
      input.text
    );
    option.order = input.order;
    if (input.bin) {
      option.bin = JSON.parse(JSON.stringify(input.bin));
    }
    option.ancillary = input.ancillary === true;
    return option;
  },
  cloneStepCache: (input, parent) => {
    const clone = new StepCache(
      input.step,
      parent
    );
    return clone;
  },
  cloneRootCache: (input) => {
    const clone = new RootCache(input.step);
    return clone;
  },
  setCurrent: (state, stepCache) => {
    state.topicState.currentStep = stepCache;
  },
  parseAndLoadStep: (state, rawStep, uiID) => {
    if (!rawStep || gUtilities.isNullOrWhiteSpace(rawStep.id) === true) {
      return null;
    }
    const step = loadStep(
      state,
      rawStep,
      uiID
    );
    return step;
  },
  parseAndLoadAncillary: (state, rawAncillary, uiID) => {
    if (!rawAncillary || gUtilities.isNullOrWhiteSpace(rawAncillary.id) === true) {
      return null;
    }
    return loadStep(
      state,
      rawAncillary,
      uiID
    );
  },
  getRegisteredRoot: (state, stepID) => {
    if (gUtilities.isNullOrWhiteSpace(stepID) === true) {
      return null;
    }
    const registered = state.topicState.registeredSteps.filter((reg) => {
      return stepID === reg.step.id;
    });
    if (registered.length === 0) {
      return null;
    }
    let rootCache = registered.find((reg) => {
      return reg.parentChainID === "0";
    });
    if (rootCache) {
      return rootCache;
    }
    return gStepCode.cloneRootCache(registered[0]);
  },
  getRegisteredStep: (state, stepID, parentChainID, registerHeir = false) => {
    if (gUtilities.isNullOrWhiteSpace(stepID) === true) {
      return null;
    }
    const registered = state.topicState.registeredSteps.filter((reg) => {
      return stepID === reg.step.id;
    });
    if (registered.length === 0) {
      return null;
    }
    let stepCache = registered.find((reg) => {
      return parentChainID === reg.parentChainID;
    });
    if (!registerHeir && stepCache) {
      return stepCache;
    }
    let parentCache = state.topicState.registeredSteps.find((reg) => {
      return parentChainID === reg.chainID;
    });
    if (!parentCache) {
      throw "Could not find a parentCache.";
    }
    if (!stepCache) {
      stepCache = gStepCode.cloneStepCache(
        registered[0],
        parentCache
      );
    }
    if (registerHeir === true) {
      parentCache.heir = stepCache;
    }
    return stepCache;
  },
  addAncillaryChildStep: (state, step, parentChainID) => {
    const stepCache = gStepCode.registerAncillaryChild(
      state,
      step,
      parentChainID
    );
    return stepCache;
  },
  addChildStep: (state, step, parentChainID) => {
    const stepCache = gStepCode.registerStep(
      state,
      step,
      parentChainID,
      true
    );
    gStepCode.setCurrent(
      state,
      stepCache
    );
    return stepCache;
  },
  addChildAncillary: (state, ancillary, parentChainID) => {
    const ancillaryCache = gStepCode.registerAncillary(
      state,
      ancillary,
      parentChainID
    );
    return ancillaryCache;
  },
  registerAncillaryChild: (state, step, parentChainID) => {
    let parentCache = state.topicState.registeredSteps.find((reg) => {
      return parentChainID === reg.chainID;
    });
    if (!parentCache) {
      alert("Could not find parent step");
      throw new Error("parenCache was null.");
    }
    const parentAncillaryCache = parentCache;
    for (let i = 0; i < (parentCache == null ? void 0 : parentCache.children.length); i++) {
      if ((parentCache == null ? void 0 : parentCache.children[i].step.id) === step.id) {
        alert("Parent has matching child");
      }
    }
    const ancillaryCache = new AncillaryCache(
      step,
      parentAncillaryCache
    );
    gStepCode.setOrderFromParent(ancillaryCache);
    state.topicState.registeredSteps.push(ancillaryCache);
    parentAncillaryCache.heir = ancillaryCache;
    return ancillaryCache;
  },
  registerAncillary: (state, step, parentChainID) => {
    let parentCache = state.topicState.registeredSteps.find((reg) => {
      return parentChainID === reg.chainID;
    });
    if (!parentCache) {
      alert("Could not find parent step");
      throw new Error("parenCache was null.");
    }
    const option = step;
    for (let i = 0; i < (parentCache == null ? void 0 : parentCache.ancillaries.length); i++) {
      if ((parentCache == null ? void 0 : parentCache.ancillaries[i].step.id) === option.id) {
        alert(`Parent has matching ancillary`);
      }
    }
    const ancillaryCache = new AncillaryCache(
      step,
      parentCache
    );
    gStepCode.setOrderFromParent(ancillaryCache);
    state.topicState.registeredSteps.push(ancillaryCache);
    parentCache.ancillaries.push(ancillaryCache);
    parentCache.ancillaries.sort((a, b) => {
      if (a.step.ui.uiID < b.step.ui.uiID) {
        return -1;
      }
      if (a.step.ui.uiID > b.step.ui.uiID) {
        return 1;
      }
      return 0;
    });
    return ancillaryCache;
  },
  setOrderFromParent: (stepCache) => {
    var _a;
    if (!stepCache || !stepCache.step || !stepCache.parent) {
      return;
    }
    const step = stepCache.step;
    const stepID = step.id;
    const syblings = (_a = stepCache.parent) == null ? void 0 : _a.step.options;
    let sybling;
    for (let i = 0; i < syblings.length; i++) {
      sybling = syblings[i];
      if (sybling.id === stepID) {
        step.order = sybling.order;
        stepCache.chainID = `${stepCache.parentChainID}.${step.order}`;
        return;
      }
    }
  },
  registerStep: (state, step, parentChainID, registerHeir = false) => {
    let parentCache = state.topicState.registeredSteps.find((reg) => {
      return parentChainID === reg.chainID;
    });
    if (!parentCache) {
      alert("Could not find parent step");
      throw new Error("parenCache was null.");
    }
    for (let i = 0; i < (parentCache == null ? void 0 : parentCache.children.length); i++) {
      if ((parentCache == null ? void 0 : parentCache.children[i].step.id) === step.id) {
        alert("Parent has matching child");
      }
    }
    const stepCache = new StepCache(
      step,
      parentCache
    );
    if (registerHeir === true) {
      parentCache.heir = stepCache;
    }
    gStepCode.setOrderFromParent(stepCache);
    state.topicState.registeredSteps.push(stepCache);
    parentCache.children.push(stepCache);
    return stepCache;
  },
  addRootStep: (state, step) => {
    if (!state.topicState.topicCache) {
      throw new Error("topicState.topicCache was null");
    }
    const rootCache = new RootCache(step);
    state.topicState.registeredSteps.push(rootCache);
    state.topicState.topicCache.root = rootCache;
    gStepCode.setCurrent(
      state,
      rootCache
    );
    return rootCache;
  },
  parseChainSteps: (state, rawSteps, uiID) => {
    const registered = state.topicState.registeredSteps;
    let step;
    let stepCache = null;
    let parentCache;
    let count = 1;
    rawSteps.forEach((rawStep) => {
      step = gStepCode.parseAndLoadStep(
        state,
        rawStep,
        uiID
      );
      if (step) {
        if (count === 1) {
          stepCache = new RootCache(step);
        } else {
          stepCache = new StepCache(
            step,
            parentCache
          );
          parentCache.children.push(stepCache);
          parentCache.heir = stepCache;
        }
        registered.push(stepCache);
        parentCache = stepCache;
      }
      count++;
    });
    if (stepCache) {
      gStepCode.setCurrent(
        state,
        stepCache
      );
    }
    return stepCache;
  },
  resetStepUis: (state) => {
    state.topicState.registeredSteps.forEach((stepCacche) => {
      gStepCode.resetStepUi(stepCacche.step);
    });
  },
  resetStepUi: (step) => {
    step.ui.expandOptions = false;
  },
  checkStepForExpandedAncillary: (stepCache) => {
    if (!stepCache) {
      return false;
    }
    let ancillaryCache;
    for (let i = 0; i < stepCache.ancillaries.length; i++) {
      ancillaryCache = stepCache.ancillaries[i];
      if (ancillaryCache.step.ui.expanded === true) {
        return true;
      }
    }
    if (stepCache.parent) {
      return gStepCode.checkStepForExpandedAncillary(stepCache.parent);
    }
    return false;
  }
};
const gSession = {
  getVideoState: () => {
    const videoStateJson = sessionStorage.getItem("videoState");
    if (!videoStateJson) {
      return "";
    }
    return videoStateJson;
  },
  setVideoState: (videoState) => {
    sessionStorage.setItem(
      "videoState",
      JSON.stringify(videoState)
    );
  },
  clearVideoState: () => {
    sessionStorage.removeItem("videoState");
  },
  // Focus
  getFocusFilter: () => {
    const filter = sessionStorage.getItem("focusFilter");
    if (!filter) {
      return "";
    }
    return filter;
  },
  setFocusFilter: (value) => {
    sessionStorage.setItem("focusFilter", value);
  },
  clearAllFocusFilters: () => {
    sessionStorage.removeItem("focusFilter");
  },
  removeFocusFilter: (filter) => {
    const currentFilter = gSession.getFocusFilter();
    if (filter === currentFilter) {
      gSession.clearAllFocusFilters();
    }
  }
};
const gHtmlActions = {
  clearFocus: (state) => {
    gSession.clearAllFocusFilters();
    return state;
  },
  checkAndScrollToTop: (state) => {
    if (!state.topicState.isArticleView) {
      window.TreeSolve.screen.scrollToTop = true;
    }
  }
};
class Topic {
  constructor(id, rootDkID, title, version, token, description, tags, created = null, modified = null) {
    __publicField(this, "id");
    __publicField(this, "rootDkID");
    __publicField(this, "title");
    __publicField(this, "version");
    __publicField(this, "token");
    __publicField(this, "description");
    __publicField(this, "created");
    __publicField(this, "modified");
    __publicField(this, "tags");
    this.id = id;
    this.rootDkID = rootDkID;
    this.title = title;
    this.version = version;
    this.token = token;
    this.description = description;
    this.created = created;
    this.modified = modified;
    this.tags = tags;
  }
}
class TopicCache {
  constructor(topic) {
    __publicField(this, "topic");
    __publicField(this, "root", null);
    this.topic = topic;
  }
}
const gTopicCode = {
  loadTopicCache: (state, rawTopic) => {
    var _a, _b;
    const topic = gTopicCode.loadTopic(rawTopic);
    if (!topic) {
      return;
    }
    if (topic.id === ((_a = state.topicState.topicCache) == null ? void 0 : _a.topic.id)) {
      const topicCache = new TopicCache(topic);
      topicCache.root = (_b = state.topicState.topicCache) == null ? void 0 : _b.root;
      state.topicState.topicCache = topicCache;
    } else {
      state.topicState.topicCache = new TopicCache(topic);
    }
  },
  clearTopic: (state) => {
    state.loading = false;
    state.topicState.currentStep = null;
    state.topicState.registeredSteps.length = 0;
    state.topicState.topicCache = null;
  },
  loadTopic: (rawTopic) => {
    if (!rawTopic || gUtilities.isNullOrWhiteSpace(rawTopic.id) === true) {
      return null;
    }
    const topic = new Topic(
      rawTopic.id,
      rawTopic.rootDkID,
      rawTopic.title,
      rawTopic.version,
      rawTopic.token,
      rawTopic.description,
      rawTopic.tags,
      rawTopic.created,
      rawTopic.modified
    );
    return topic;
  },
  loadTopics: (rawTopics) => {
    const topics = [];
    if (!rawTopics || rawTopics.length === 0) {
      return topics;
    }
    let topic;
    rawTopics.forEach((rawTopic) => {
      topic = gTopicCode.loadTopic(rawTopic);
      if (topic) {
        topics.push(topic);
      }
    });
    return topics;
  },
  getTitle: (topic) => {
    if (!topic) {
      return "";
    }
    return gUtilities.isNullOrWhiteSpace(topic.title) ? "" : topic.title;
  },
  getTitleFromState: (state) => {
    var _a;
    if (!state) {
      return "";
    }
    return gTopicCode.getTitle((_a = state.topicState.topicCache) == null ? void 0 : _a.topic);
  },
  markOptionExpanded: (state) => {
    if (!state) {
      return;
    }
    state.topicState.optionExpanded = true;
  },
  markAncillaryExpanded: (state) => {
    if (!state) {
      return;
    }
    state.topicState.ancillaryExpanded = true;
  },
  isStateDirty: (state) => {
    if (!state) {
      return false;
    }
    return gArticleCode.isSceneChanged(state);
  }
};
const gStepActions = {
  expandOption: (state, chainStepPayload) => {
    if (!chainStepPayload) {
      return state;
    }
    gTopicCode.markOptionExpanded(state);
    gStepCode.resetStepUis(state);
    state.loading = true;
    window.TreeSolve.screen.hideBanner = true;
    gHtmlActions.checkAndScrollToTop(state);
    const stepCache = gStepCode.getRegisteredStep(
      state,
      chainStepPayload.stepID,
      chainStepPayload.parentChainID,
      true
    );
    if (stepCache) {
      gStepCode.setCurrent(
        state,
        stepCache
      );
      state.loading = false;
      gArticleCode.buildArticleScene(state);
      gStepCode.loadChain(
        state,
        stepCache
      );
      return gStateCode.cloneState(state);
    }
    return [
      state,
      gStepEffects.getStep(
        state,
        chainStepPayload.stepID,
        chainStepPayload.parentChainID,
        chainStepPayload.uiID
      )
    ];
  },
  expandAncillaryOption: (state, chainPayload) => {
    if (!chainPayload) {
      return state;
    }
    gStepCode.resetStepUis(state);
    chainPayload.parent.ui.expandOptions = false;
    const stepCache = gStepCode.getRegisteredStep(
      state,
      chainPayload.stepID,
      chainPayload.parentChainID
    );
    if (stepCache) {
      stepCache.step.ui.expanded = true;
      const parentAncillaryCache = stepCache.parent;
      parentAncillaryCache.heir = stepCache;
      gArticleCode.buildArticleScene(state);
      return gStateCode.cloneState(state);
    }
    return [
      state,
      gStepEffects.getAncillaryStep(
        state,
        chainPayload.stepID,
        chainPayload.parentChainID,
        chainPayload.uiID
      )
    ];
  },
  showAncillary: (state, chainPayload) => {
    if (!chainPayload) {
      return state;
    }
    gTopicCode.markAncillaryExpanded(state);
    gStepCode.resetStepUis(state);
    const stepCache = gStepCode.getRegisteredStep(
      state,
      chainPayload.stepID,
      chainPayload.parentChainID
    );
    if (stepCache) {
      stepCache.step.ui.expanded = true;
      gArticleCode.buildArticleScene(state);
      return gStateCode.cloneState(state);
    }
    return [
      state,
      gStepEffects.getAncillary(
        state,
        chainPayload.stepID,
        chainPayload.parentChainID,
        chainPayload.uiID
      )
    ];
  },
  collapseAncillary: (state, ancillaryCache) => {
    if (!ancillaryCache) {
      return state;
    }
    gStepCode.resetStepUis(state);
    ancillaryCache.step.ui.expanded = false;
    gArticleCode.buildArticleScene(state);
    return gStateCode.cloneState(state);
  },
  loadAncillary: (state, response) => {
    if (!state || !response) {
      return state;
    }
    const parentChainID = response.parentChainID;
    const uiID = response.uiID;
    const jsonData = response.response.jsonData;
    const step = gStepCode.parseAndLoadAncillary(
      state,
      jsonData,
      uiID
    );
    if (!step) {
      return gStateCode.cloneState(state);
    }
    step.ui.expanded = true;
    const ancillaryCache = gStepCode.addChildAncillary(
      state,
      step,
      parentChainID
    );
    gHistoryCode.resetRaw();
    gArticleCode.buildArticleScene(state);
    gStepCode.loadAncillaryChain(
      state,
      ancillaryCache
    );
    return gStateCode.cloneState(state);
  },
  loadAncillaryChainStep: (state, response) => {
    if (!state || !response) {
      return state;
    }
    const parentChainID = response.parentChainID;
    const jsonData = response.response.jsonData;
    const step = gStepCode.parseAndLoadAncillary(
      state,
      jsonData,
      response.uiID
    );
    if (!step) {
      return gStateCode.cloneState(state);
    }
    const ancillaryChainStepCache = gStepCode.addAncillaryChildStep(
      state,
      step,
      parentChainID
    );
    gArticleCode.buildArticleScene(state);
    gStepCode.loadAncillaryChain(
      state,
      ancillaryChainStepCache
    );
    return gStateCode.cloneState(state);
  },
  loadChainStep: (state, response) => {
    if (!state || !response) {
      return state;
    }
    const parentChainID = response.parentChainID;
    const jsonData = response.response.jsonData;
    const step = gStepCode.parseAndLoadStep(
      state,
      jsonData,
      response.uiID
    );
    if (!step) {
      return gStateCode.cloneState(state);
    }
    const chainStepCache = gStepCode.addChildStep(
      state,
      step,
      parentChainID
    );
    gStepCode.loadChain(
      state,
      chainStepCache
    );
    return gStateCode.cloneState(state);
  },
  loadStep: (state, response) => {
    if (!state) {
      return state;
    }
    state.loading = false;
    const parentChainID = response.parentChainID;
    const jsonData = response.response.jsonData;
    const step = gStepCode.parseAndLoadStep(
      state,
      jsonData,
      response.uiID
    );
    if (!step) {
      return gStateCode.cloneState(state);
    }
    const stepCache = gStepCode.addChildStep(
      state,
      step,
      parentChainID
    );
    gStepCode.loadChain(
      state,
      stepCache
    );
    return gStateCode.cloneState(state);
  },
  loadRootStep: (state, response) => {
    return gStepActions.loadRawRootStep(
      state,
      response.jsonData
    );
  },
  loadRawRootStep: (state, rawRootStep) => {
    if (!state) {
      return state;
    }
    state.loading = false;
    const step = gStepCode.parseAndLoadStep(
      state,
      rawRootStep,
      gStateCode.getFreshKeyInt(state)
    );
    if (!step) {
      return gStateCode.cloneState(state);
    }
    const rootCache = gStepCode.addRootStep(
      state,
      step
    );
    gStepCode.loadChain(
      state,
      rootCache
    );
    return gStateCode.cloneState(state);
  }
};
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
const gAuthenticationCode = {
  clearAuthentication: (state) => {
    state.user.authorised = false;
    state.user.name = "";
    state.user.sub = "";
    state.user.logoutUrl = "";
  }
};
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
const getStep = (state, stepID, _parentChainID, action, loadAction) => {
  if (!state) {
    return;
  }
  const callID = gUtilities.generateGuid();
  let headers = gAjaxHeaderCode.buildHeaders(
    state,
    callID,
    action
  );
  const path = `Step/${stepID}`;
  const url = `${state.settings.apiUrl}/${path}`;
  return gAuthenticatedHttp({
    url,
    options: {
      method: "GET",
      headers
    },
    response: "json",
    action: loadAction,
    error: (state2, errorDetails) => {
      alert(`{
                "message": "Error getting step data from the server.",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${getStep.name},
                "callID: ${callID}
            }`);
      return gStateCode.cloneState(state2);
    }
  });
};
const gStepEffects = {
  getRootStep: (state, rootID) => {
    if (!state) {
      return;
    }
    return getStep(
      state,
      rootID,
      "0",
      ActionType.GetRoot,
      gStepActions.loadRootStep
    );
  },
  getStep: (state, stepID, parentChainID, uiID) => {
    const loadAction = (state2, response) => {
      const chainResponse = {
        response,
        parentChainID,
        uiID
      };
      return gStepActions.loadStep(
        state2,
        chainResponse
      );
    };
    return getStep(
      state,
      stepID,
      parentChainID,
      ActionType.GetStep,
      loadAction
    );
  },
  getAncillary: (state, stepID, parentChainID, uiID) => {
    const loadAction = (state2, response) => {
      const chainResponse = {
        response,
        parentChainID,
        uiID
      };
      return gStepActions.loadAncillary(
        state2,
        chainResponse
      );
    };
    return getStep(
      state,
      stepID,
      parentChainID,
      ActionType.GetStep,
      loadAction
    );
  },
  getAncillaryStep: (state, stepID, parentChainID, uiID) => {
    const loadAction = (state2, response) => {
      const chainResponse = {
        response,
        parentChainID,
        uiID
      };
      return gStepActions.loadAncillaryChainStep(
        state2,
        chainResponse
      );
    };
    return getStep(
      state,
      stepID,
      parentChainID,
      ActionType.GetStep,
      loadAction
    );
  }
};
const gTopicsStateCode = {
  loadTopics: (state, response) => {
    state.topicsState.topics = gTopicCode.loadTopics(response.values);
    state.topicsState.paginationDetails.totalItems = response.total;
    state.topicsState.topicCount = response.total ?? 0;
    state.topicsState.topicCount = state.topicsState.topicCount < 0 ? 0 : state.topicsState.topicCount;
  }
};
const gTopicsCoreActions = {
  loadViewOrBuildFresh: (state, response) => {
    gTopicsStateCode.loadTopics(
      state,
      response.jsonData
    );
    state.loading = false;
    return gStateCode.cloneState(state);
  }
};
const autoFilter = (state) => {
  if (!state) {
    return state;
  }
  const callID = gUtilities.generateGuid();
  const action = ActionType.FilterTopics;
  let headers = gAjaxHeaderCode.buildHeaders(
    state,
    callID,
    action
  );
  const body = {
    start: state.topicsState.paginationDetails.start,
    batchSize: state.topicsState.paginationDetails.count,
    fragment: state.searchState.text,
    callID,
    action
  };
  const bodyJson = JSON.stringify(body);
  const url = `${state.settings.apiUrl}/Filter/Topics`;
  return gAuthenticatedHttp({
    url,
    options: {
      method: "POST",
      headers,
      body: bodyJson
    },
    response: "json",
    action: gTopicsCoreActions.loadViewOrBuildFresh,
    error: (state2, errorDetails) => {
      alert(`{
                "message": "Error sending topics auto filter data to the server.",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${autoFilter.name},
                "callID: ${callID},
                "state": ${JSON.stringify(state2)}
            }`);
      return gStateCode.cloneState(state2);
    }
  });
};
const gFilterEffects = {
  filter: (state) => {
    return autoFilter(state);
  },
  autoFilter: (state) => {
    return autoFilter(state);
  }
};
const topicActions = {
  setSearchFocus: (state) => {
    state.searchState.ui.hasFocus = true;
    return gStateCode.cloneState(state);
  },
  removeSearchFocus: (state) => {
    state.searchState.ui.hasFocus = false;
    return gStateCode.cloneState(state);
  },
  showTopicsPage: (state, paginationPayload) => {
    if (!state || !paginationPayload) {
      return state;
    }
    state.topicsState.paginationDetails = paginationPayload.paginationDetails;
    return [
      gStateCode.cloneState(state),
      gFilterEffects.filter(state)
    ];
  },
  setSearchText: (state, element) => {
    if (!state || !element) {
      return state;
    }
    const textarea = element;
    state.searchState.text = `${textarea.value}`;
    return gStateCode.cloneState(state);
  },
  search: (state) => {
    if (!state) {
      return state;
    }
    return [
      gStateCode.cloneState(state),
      gFilterEffects.filter(state)
    ];
  },
  checkForEnterKeyPress: (state, keyEvent) => {
    if (keyEvent.keyCode === 13) {
      keyEvent.preventDefault();
      return topicActions.search(state);
    }
    return state;
  },
  showTopic: (state, topic) => {
    gStepCode.resetStepUis(state);
    state.topicState.topicCache = new TopicCache(topic);
    state.displayType = DisplayType.Article;
    gHistoryCode.pushBrowserHistoryState(state);
    window.TreeSolve.screen.hideBanner = true;
    gHtmlActions.checkAndScrollToTop(state);
    const rootCache = gStepCode.getRegisteredRoot(
      state,
      state.topicState.topicCache.topic.rootDkID
    );
    if (rootCache) {
      state.topicState.topicCache.root = rootCache;
      gStepCode.setCurrent(
        state,
        rootCache
      );
      return gStateCode.cloneState(state);
    }
    return [
      state,
      gStepEffects.getRootStep(
        state,
        topic.rootDkID
      )
    ];
  }
};
const topicSubscriptions = (state) => {
  const subscriptions = [];
  if (state.displayType === DisplayType.Topics) {
    subscriptions.push(
      Keyboard({
        downs: true,
        ups: false,
        presses: false,
        action: topicActions.checkForEnterKeyPress
      })
    );
  }
  return subscriptions;
};
const topicsCoreSubscriptions = (state) => {
  const view = [
    ...topicSubscriptions(state)
  ];
  return view;
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
      // buildReLoadData(),
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
    ...topicsCoreSubscriptions(state),
    ...repeatSubscriptions.buildRepeatSubscriptions(state)
  ];
  return subscriptions;
};
const Filters = {
  treeSolveGuideID: "treeSolveGuide",
  treeSolveAssistantBanner: "treeSolveAssistantBanner",
  stepInfo: "#stepInfo",
  stepNodes: "#stepNodes",
  stepBottomNav: "#stepBottomNav",
  navElements: "#stepView .discussion .nav",
  stepNodeElements: "#stepNodes .step-box",
  selectedStepNodeElement: "#stepNodes .step-box.selected",
  upNavElement: "#stepNav .chain-upwards",
  downNavElement: "#stepNav .chain-downwards",
  fragmentBoxDiscussion: "#treeSolveFragments .nt-fr-fragment-box .nt-fr-fragment-discussion"
};
var ScrollHopType = /* @__PURE__ */ ((ScrollHopType2) => {
  ScrollHopType2["None"] = "none";
  ScrollHopType2["Up"] = "up";
  ScrollHopType2["Down"] = "down";
  return ScrollHopType2;
})(ScrollHopType || {});
const scrollStep = {
  scrollUp: () => {
    window.TreeSolve.screen.scrollToElement = null;
    const selectedStepElement = document.querySelector(`${Filters.selectedStepNodeElement}`);
    if (!selectedStepElement) {
      return;
    }
    const stepElements = document.querySelectorAll(`${Filters.stepNodeElements}`);
    for (let i = 0; i < stepElements.length; i++) {
      if (stepElements[i].id === selectedStepElement.id) {
        if (i > 0) {
          const previousStepElement = stepElements[i - 1];
          if (!previousStepElement) {
            return;
          }
          const articleStepID = gStepCode.getIDFromNavID(previousStepElement.id);
          scrollStep.scrollToToElement(articleStepID);
        }
      }
    }
  },
  scrollDown: () => {
    window.TreeSolve.screen.scrollToElement = null;
    const selectedStepElement = document.querySelector(`${Filters.selectedStepNodeElement}`);
    if (!selectedStepElement) {
      return;
    }
    const stepElements = document.querySelectorAll(`${Filters.stepNodeElements}`);
    for (let i = 0; i < stepElements.length; i++) {
      if (stepElements[i].id === selectedStepElement.id) {
        if (i < stepElements.length - 1) {
          const nextStepElement = stepElements[i + 1];
          if (!nextStepElement) {
            return;
          }
          const articleStepID = gStepCode.getIDFromNavID(nextStepElement.id);
          scrollStep.scrollToToElement(articleStepID);
        }
      }
    }
  },
  // scrollToTop: () => {
  //     if (window.TreeSolve.screen.scrollToTop) {
  //         window.TreeSolve.screen.scrollToTop = false;
  //         document.body.scrollTop = 0;
  //     }
  // },
  scrollToToElement: (elementID) => {
    window.TreeSolve.screen.scrollToElement = null;
    const element = document.querySelector(`#${elementID}`);
    if (element) {
      const box = element.getBoundingClientRect();
      const body = document.body;
      const docEl = document.documentElement;
      const scrollTop = docEl.scrollTop || body.scrollTop;
      const clientTop = docEl.clientTop || body.clientTop || 0;
      let topOffset = window.innerHeight / 4 - 10;
      const top = box.top + scrollTop - clientTop - topOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  },
  scroll: () => {
    if (gUtilities.isNullOrWhiteSpace(window.TreeSolve.screen.scrollToElement) === false) {
      scrollStep.scrollToToElement(window.TreeSolve.screen.scrollToElement);
    } else if (window.TreeSolve.screen.scrollHop === ScrollHopType.Up) {
      scrollStep.scrollUp();
    } else if (window.TreeSolve.screen.scrollHop === ScrollHopType.Down) {
      scrollStep.scrollDown();
    }
  }
};
const selectedClass = "selected";
const disabledClass = "disabled";
const setSideBarDimensions = () => {
  const stepInfoElement = document.querySelector(`${Filters.stepInfo}`);
  if (!stepInfoElement) {
    return;
  }
  const stepNodesElement = document.querySelector(`${Filters.stepNodes}`);
  if (!stepNodesElement) {
    return;
  }
  let stepInfoRectangle = stepInfoElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const bottomGap = 20;
  const footerElement = document.querySelector(`footer`);
  if (footerElement) {
    const footerRectangle = footerElement.getBoundingClientRect();
    const footerTop = footerRectangle.top;
    const footerVisible = windowHeight - footerTop;
    if (footerVisible <= bottomGap) {
      stepInfoElement.style.bottom = `${bottomGap}px`;
    } else {
      stepInfoElement.style.bottom = `${footerVisible + bottomGap}px`;
    }
  } else {
    stepInfoElement.style.bottom = `${bottomGap}px`;
  }
  const stepBottomNavElement = document.querySelector(`${Filters.stepBottomNav}`);
  stepInfoRectangle = stepInfoElement.getBoundingClientRect();
  stepInfoRectangle.height = stepInfoRectangle.bottom - stepInfoRectangle.top;
  const stepNodesRectangle = stepNodesElement.getBoundingClientRect();
  const stepNodesTopGap = stepNodesRectangle.top - stepInfoRectangle.top;
  let stepNodesHeight = stepInfoRectangle.height - stepNodesTopGap;
  if (stepBottomNavElement) {
    if (stepInfoRectangle.height > 800) {
      stepBottomNavElement.style.display = "unset";
      stepNodesHeight -= 150;
    } else {
      stepBottomNavElement.style.display = "none";
    }
  }
  stepNodesElement.style.height = `${stepNodesHeight}px`;
};
const setScrollDownSideBarAttention = (navElements) => {
  let navElement;
  let navElementBox;
  let topOffset = window.innerHeight / 4;
  let attention = null;
  let pegCrownID = "";
  for (let i = 0; i < navElements.length; i++) {
    navElement = navElements[i];
    if (navElement.id === pegCrownID) {
      pegCrownID = "";
      continue;
    }
    navElementBox = navElement.getBoundingClientRect();
    if (navElementBox.top > topOffset) {
      break;
    }
    if (navElement.classList.contains("ancillary") === true) {
      if (navElementBox.top + navElementBox.height > topOffset) {
        attention = navElement;
      }
      let id = navElement.id;
      if (id.startsWith("step-")) {
        pegCrownID = `peg-${id.substring(5)}-1`;
      }
      continue;
    }
    attention = navElement;
  }
  if (!attention) {
    return;
  }
  const stepNav = document.querySelector(`#nav-${attention.id}`);
  if (!stepNav) {
    return;
  }
  clearSelectedNavs();
  stepNav.classList.add(selectedClass);
};
const clearSelectedNavs = () => {
  const stepNodeElements = document.querySelectorAll(`${Filters.stepNodeElements}`);
  if (!stepNodeElements) {
    return null;
  }
  let stepNodeElement;
  for (let j = 0; j < stepNodeElements.length; j++) {
    stepNodeElement = stepNodeElements[j];
    if (stepNodeElement.classList.contains(selectedClass)) {
      stepNodeElement.classList.remove(selectedClass);
    }
  }
  return stepNodeElements;
};
const setUpAndDownButtonsState = () => {
  window.TreeSolve.screen.scrollToElement = null;
  const upNavElement = document.querySelector(`${Filters.upNavElement}`);
  const downNavElement = document.querySelector(`${Filters.downNavElement}`);
  if (!upNavElement || !downNavElement) {
    return;
  }
  const selectedStepElement = document.querySelector(`${Filters.selectedStepNodeElement}`);
  if (!selectedStepElement) {
    return;
  }
  const stepElements = document.querySelectorAll(`${Filters.stepNodeElements}`);
  for (let i = 0; i < stepElements.length; i++) {
    if (stepElements[i].id === selectedStepElement.id) {
      if (i > 0) {
        upNavElement.classList.remove(disabledClass);
      } else {
        upNavElement.classList.add(disabledClass);
      }
      if (i < stepElements.length - 1) {
        downNavElement.classList.remove(disabledClass);
      } else {
        downNavElement.classList.add(disabledClass);
      }
    }
  }
};
const setSideBarAttention = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  window.TreeSolve.screen.lastScrollY = scrollTop;
  const navElements = document.querySelectorAll(`${Filters.navElements}`);
  if (!navElements || navElements.length === 0) {
    return;
  }
  const pos = window.innerHeight + Math.round(window.scrollY) + 100;
  if (pos >= document.body.offsetHeight) {
    const stepNodeElements = clearSelectedNavs();
    if (!stepNodeElements) {
      return;
    }
    const lastStepNodeElement = stepNodeElements[stepNodeElements.length - 1];
    if (lastStepNodeElement) {
      lastStepNodeElement.classList.add(selectedClass);
    }
    return;
  }
  setScrollDownSideBarAttention(navElements);
};
const setSideBar = () => {
  setSideBarDimensions();
  setSideBarAttention();
  setUpAndDownButtonsState();
};
const hideBanner = () => {
  const fixedBanner = `__${Filters.treeSolveAssistantBanner}`;
  const bannerElement = document.querySelector(`#${fixedBanner}`);
  if (window.TreeSolve.screen.hideBanner) {
    if (bannerElement) {
      return;
    }
    const divElement = document.querySelector(`#${Filters.treeSolveAssistantBanner}`);
    if (divElement) {
      divElement.id = fixedBanner;
    }
  } else {
    if (bannerElement) {
      bannerElement.id = `${Filters.treeSolveAssistantBanner}`;
    }
  }
};
const setFocus = () => {
  const filter = gSession.getFocusFilter();
  if (filter.length === 0) {
    return;
  }
  const element = document.querySelector(filter);
  if (element) {
    element.focus();
  }
};
const stepDisplayOnRenderFinished = () => {
  setFocus();
  hideBanner();
  scrollStep.scroll();
  setSideBar();
};
const stepCoreOnRenderFinished = () => {
  stepDisplayOnRenderFinished();
};
const showSelected = () => {
  const selectedStepElement = document.querySelector(`${Filters.selectedStepNodeElement}`);
  if (!selectedStepElement) {
    return;
  }
  const stepNodesElement = document.querySelector(`${Filters.stepNodes}`);
  if (!stepNodesElement) {
    return;
  }
  const selectedStepElementRectangle = selectedStepElement.getBoundingClientRect();
  const selectedTop = selectedStepElementRectangle.top;
  const selectedBottom = selectedStepElementRectangle.bottom;
  const stepNodesElementRectangle = stepNodesElement.getBoundingClientRect();
  const parentTop = stepNodesElementRectangle.top;
  const parentBottom = stepNodesElementRectangle.bottom;
  const offsetTop = selectedTop - parentTop;
  const buffer = 50;
  if (selectedTop - buffer >= parentTop && selectedBottom + buffer <= parentBottom) {
    return;
  }
  const middle = (parentBottom - parentTop) / 2;
  const newPos = stepNodesElement.scrollTop + offsetTop - middle;
  stepNodesElement.scrollTo({ top: newPos, behavior: "smooth" });
};
const onScrollEnd = () => {
  showSelected();
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
      fragmentBox.removeAttribute(dataDiscussion);
    }
  }
};
const onRenderFinished = () => {
  onFragmentsRenderFinished();
};
const initEvents = {
  onRenderFinished: () => {
    onRenderFinished();
    stepCoreOnRenderFinished();
  },
  registerGlobalEvents: () => {
    window.onresize = () => {
      initEvents.onRenderFinished();
    };
    onscroll = () => {
      setSideBar();
    };
    window.addEventListener(
      "scrollend",
      onScrollEnd
    );
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
  gFragmentCode.indexChainFragment(
    state,
    option
  );
  if (outlineFragment) {
    for (const outlineOption of outlineFragment.o) {
      if (outlineOption.f === option.id) {
        option.outlineFragmentID = outlineOption.i;
        state.renderState.index_outlineFragments_outlineFragmentID[outlineOption.i] = option;
      }
    }
  }
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
    fragment.parentFragmentID = rawFragment.parentFragmentID ?? "";
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
  expandOption: (fragment, option) => {
    gFragmentCode.collapseFragmentsOptions(fragment);
    option.ui.fragmentOptionsExpanded = false;
    fragment.selected = option;
  },
  resetFragmentUis: (state) => {
    const index_chainFragments_outlineFragmentID = state.renderState.index_chainFragments_outlineFragmentID;
    let fragment;
    for (const fragmentID in index_chainFragments_outlineFragmentID) {
      fragment = index_chainFragments_outlineFragmentID[fragmentID];
      gFragmentCode.resetFragmentUi(fragment);
    }
  },
  resetFragmentUi: (fragment) => {
    fragment.ui.fragmentOptionsExpanded = false;
  },
  setCurrent: (state, parent, fragment) => {
    parent.selected = fragment;
    state.renderState.currentFragment = fragment;
    gHistoryCode.pushBrowserHistoryState(state);
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
  expandOption: (state, parentFragment, option) => {
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
    if (option.ui.discussionLoaded === true) {
      return gStateCode.cloneState(state);
    }
    state.loading = true;
    window.TreeSolve.screen.hideBanner = true;
    gHtmlActions.checkAndScrollToTop(state);
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
        gFragmentCode.expandOption(
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
  // user_expandAncillaryOption: (
  //     state: IState,
  //     chainPayload: IChainStepPayload): IStateAnyArray => {
  //     if (!state) {
  //         return state;
  //     }
  //     state.topicState.ui.raw = false;
  //     return gStepActions.expandAncillaryOption(
  //         state,
  //         chainPayload
  //     )
  // },
  // user_showAncillary: (
  //     state: IState,
  //     chainPayload: IChainStepPayload): IStateAnyArray => {
  //     if (!state) {
  //         return state;
  //     }
  //     state.topicState.ui.raw = false;
  //     return gStepActions.showAncillary(
  //         state,
  //         chainPayload
  //     )
  // },
  // user_collapseAncillary: (
  //     state: IState,
  //     ancillaryCache: IStepCache): IStateAnyArray => {
  //     if (!state) {
  //         return state;
  //     }
  //     state.topicState.ui.raw = false;
  //     return gStepActions.collapseAncillary(
  //         state,
  //         ancillaryCache
  //     )
  // },
  userExpandOption: (state, payload) => {
    if (!state || !(payload == null ? void 0 : payload.parentFragment) || !(payload == null ? void 0 : payload.option)) {
      return state;
    }
    state.renderState.ui.raw = false;
    return gFragmentActions.expandOption(
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
const BuildOptionView = (parent, option) => {
  if (!option || option.isAncillary === true) {
    return null;
  }
  const view = h(
    "div",
    { class: "option-box" },
    [
      h(
        "a",
        {
          class: "option",
          onMouseDown: [
            fragmentActions.userExpandOption,
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
    optionVew = BuildOptionView(
      fragment,
      option
    );
    if (optionVew) {
      optionViews.push(optionVew);
    }
  }
  const view = h("div", { class: `nt-fr-fragment-options` }, [
    optionViews
  ]);
  return view;
};
const buildCollapsedOptionsView = (_fragment) => {
  const view = h("div", { class: `nt-fr-fragment-options` }, [
    h("h1", {}, "Options")
  ]);
  return view;
};
const buildOptionsView = (fragment) => {
  if (!fragment.options || fragment.options.length === 0) {
    return null;
  }
  if (fragment.selected && !fragment.ui.fragmentOptionsExpanded) {
    return buildCollapsedOptionsView();
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
const errorViews = {
  buildGenericError: (_state) => {
    const view = h("div", { id: "error" }, [
      h("h3", {}, "Sorry but the url you requested can't be found.")
    ]);
    return view;
  }
};
const initView = {
  buildView: (state) => {
    if (state.genericError === true) {
      return errorViews.buildGenericError(state);
    }
    const view = h(
      "div",
      {
        onClick: initActions.setNotRaw,
        id: "treeSolveFragments"
      },
      [
        // mainViews.buildContentView(state),
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
class PaginationDetails {
  constructor(start, count, totalItems) {
    __publicField(this, "start");
    __publicField(this, "count");
    __publicField(this, "totalItems");
    this.start = start;
    this.count = count;
    this.totalItems = totalItems;
  }
}
class TopicsState {
  constructor() {
    __publicField(this, "selectedID", "");
    __publicField(this, "queuedKey", "");
    __publicField(this, "topics", []);
    __publicField(this, "topicCount", 0);
    __publicField(this, "paginationDetails", new PaginationDetails(
      0,
      10,
      0
    ));
  }
}
class TopicSceneUI {
  constructor() {
    __publicField(this, "raw", true);
  }
}
class TopicState {
  constructor() {
    __publicField(this, "topicCache", null);
    __publicField(this, "registeredSteps", []);
    __publicField(this, "currentStep", null);
    __publicField(this, "isArticleView", true);
    __publicField(this, "articleScene", null);
    __publicField(this, "ghostArticleScene", null);
    __publicField(this, "ancillaryExpanded", false);
    __publicField(this, "optionExpanded", false);
    __publicField(this, "ui", new TopicSceneUI());
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
class SearchUI {
  constructor() {
    __publicField(this, "hasFocus", false);
  }
}
class SearchState {
  constructor() {
    __publicField(this, "text", "");
    __publicField(this, "ui", new SearchUI());
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
    __publicField(this, "displayType", DisplayType.Topics);
    __publicField(this, "loading", true);
    __publicField(this, "debug", true);
    __publicField(this, "genericError", false);
    __publicField(this, "nextKey", 0);
    __publicField(this, "settings");
    __publicField(this, "user", new User());
    __publicField(this, "topicsState", new TopicsState());
    __publicField(this, "topicState", new TopicState());
    __publicField(this, "searchState", new SearchState());
    __publicField(this, "renderState", new RenderState());
    __publicField(this, "repeatEffects", new RepeateEffects());
    __publicField(this, "stepHistory", new History());
    const settings = new Settings();
    this.settings = settings;
  }
}
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
  const folderPath = rawGuide.fragmentFolderPath ?? null;
  if (!gUtilities.isNullOrWhiteSpace(folderPath)) {
    guide.fragmentFolderUrl = `${location.origin}${folderPath}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguQlZrZjYzLWsuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbC5qcyIsIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyQXBwLWZ4L3V0aWxzLmpzIiwiLi4vLi4vcm9vdC9zcmMvaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmQuanMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nVXRpbGl0aWVzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2VmZmVjdHMvSHR0cEVmZmVjdC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdG9waWMvU3RlcFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwQ2FjaGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1Jvb3RDYWNoZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvaGlzdG9yeS9IaXN0b3J5VXJsLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L1JlbmRlclNuYXBTaG90LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nSGlzdG9yeUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1N0ZXBPcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L0FydGljbGVTY2VuZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5QYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9wYXlsb2Fkcy9DaGFpblN0ZXBQYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nQXJ0aWNsZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9jb2RlL2dTdGVwQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2dTZXNzaW9uLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1RvcGljLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9Ub3BpY0NhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nVG9waWNDb2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nU3RlcEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dIdHRwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL2NvbnN0YW50cy9LZXlzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQXV0aGVudGljYXRpb25Db2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQWpheEhlYWRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHAudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9lZmZlY3RzL2dTdGVwRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1RvcGljc1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ1RvcGljc0NvcmVBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L2FjdGlvbnMvdG9waWNBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3RvcGljc0Rpc3BsYXkvc3Vic2NyaXB0aW9ucy90b3BpY1N1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS90b3BpY3NDb3JlL3N1YnNjcmlwdGlvbnMvdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9oeXBlckFwcC90aW1lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nUmVwZWF0QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9zdWJzY3JpcHRpb25zL2luaXRTdWJzY3JpcHRpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9jb25zdGFudHMvRmlsdGVycy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3N0ZXBEaXNwbGF5L2NvZGUvc2Nyb2xsU3RlcC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3NldFNpZGVCYXIudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL29uU2Nyb2xsRW5kLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL29uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRFdmVudHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9hY3Rpb25zL2luaXRBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJGcmFnbWVudFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nRmlsZUNvbnN0YW50cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvYWN0aW9ucy9mcmFnbWVudEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvdmlld3MvZnJhZ21lbnRWaWV3cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9lcnJvci92aWV3cy9lcnJvclZpZXdzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2luaXQvdmlld3MvaW5pdFZpZXcudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VzZXIvU2V0dGluZ3MudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL1BhZ2luYXRpb25EZXRhaWxzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY3NTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvVG9waWNTY2VuZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY1N0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2hpc3RvcnkvSGlzdG9yeS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdXNlci9Vc2VyLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9zZWFyY2gvU2VhcmNoVUkudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL1NlYXJjaFN0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJTdGF0ZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9SZW5kZXJTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvU3RhdGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9TY3JlZW4udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9UcmVlU29sdmUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUNoYXJ0LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nT3V0bGluZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9hY3Rpb25zL2dPdXRsaW5lQWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ1JlbmRlckVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJHdWlkZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1JlbmRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvcmVuZGVyQ29tbWVudHMudHMiLCIuLi8uLi9yb290L3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUkVDWUNMRURfTk9ERSA9IDFcclxudmFyIExBWllfTk9ERSA9IDJcclxudmFyIFRFWFRfTk9ERSA9IDNcclxudmFyIEVNUFRZX09CSiA9IHt9XHJcbnZhciBFTVBUWV9BUlIgPSBbXVxyXG52YXIgbWFwID0gRU1QVFlfQVJSLm1hcFxyXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXlcclxudmFyIGRlZmVyID1cclxuICB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICA/IHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgOiBzZXRUaW1lb3V0XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbihvYmopIHtcclxuICB2YXIgb3V0ID0gXCJcIlxyXG5cclxuICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIG9ialxyXG5cclxuICBpZiAoaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPiAwKSB7XHJcbiAgICBmb3IgKHZhciBrID0gMCwgdG1wOyBrIDwgb2JqLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgIGlmICgodG1wID0gY3JlYXRlQ2xhc3Mob2JqW2tdKSkgIT09IFwiXCIpIHtcclxuICAgICAgICBvdXQgKz0gKG91dCAmJiBcIiBcIikgKyB0bXBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xyXG4gICAgICBpZiAob2JqW2tdKSB7XHJcbiAgICAgICAgb3V0ICs9IChvdXQgJiYgXCIgXCIpICsga1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0XHJcbn1cclxuXHJcbnZhciBtZXJnZSA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICB2YXIgb3V0ID0ge31cclxuXHJcbiAgZm9yICh2YXIgayBpbiBhKSBvdXRba10gPSBhW2tdXHJcbiAgZm9yICh2YXIgayBpbiBiKSBvdXRba10gPSBiW2tdXHJcblxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxudmFyIGJhdGNoID0gZnVuY3Rpb24obGlzdCkge1xyXG4gIHJldHVybiBsaXN0LnJlZHVjZShmdW5jdGlvbihvdXQsIGl0ZW0pIHtcclxuICAgIHJldHVybiBvdXQuY29uY2F0KFxyXG4gICAgICAhaXRlbSB8fCBpdGVtID09PSB0cnVlXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiB0eXBlb2YgaXRlbVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBbaXRlbV1cclxuICAgICAgICA6IGJhdGNoKGl0ZW0pXHJcbiAgICApXHJcbiAgfSwgRU1QVFlfQVJSKVxyXG59XHJcblxyXG52YXIgaXNTYW1lQWN0aW9uID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIHJldHVybiBpc0FycmF5KGEpICYmIGlzQXJyYXkoYikgJiYgYVswXSA9PT0gYlswXSAmJiB0eXBlb2YgYVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbn1cclxuXHJcbnZhciBzaG91bGRSZXN0YXJ0ID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhICE9PSBiKSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG1lcmdlKGEsIGIpKSB7XHJcbiAgICAgIGlmIChhW2tdICE9PSBiW2tdICYmICFpc1NhbWVBY3Rpb24oYVtrXSwgYltrXSkpIHJldHVybiB0cnVlXHJcbiAgICAgIGJba10gPSBhW2tdXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG52YXIgcGF0Y2hTdWJzID0gZnVuY3Rpb24ob2xkU3VicywgbmV3U3VicywgZGlzcGF0Y2gpIHtcclxuICBmb3IgKFxyXG4gICAgdmFyIGkgPSAwLCBvbGRTdWIsIG5ld1N1Yiwgc3VicyA9IFtdO1xyXG4gICAgaSA8IG9sZFN1YnMubGVuZ3RoIHx8IGkgPCBuZXdTdWJzLmxlbmd0aDtcclxuICAgIGkrK1xyXG4gICkge1xyXG4gICAgb2xkU3ViID0gb2xkU3Vic1tpXVxyXG4gICAgbmV3U3ViID0gbmV3U3Vic1tpXVxyXG4gICAgc3Vicy5wdXNoKFxyXG4gICAgICBuZXdTdWJcclxuICAgICAgICA/ICFvbGRTdWIgfHxcclxuICAgICAgICAgIG5ld1N1YlswXSAhPT0gb2xkU3ViWzBdIHx8XHJcbiAgICAgICAgICBzaG91bGRSZXN0YXJ0KG5ld1N1YlsxXSwgb2xkU3ViWzFdKVxyXG4gICAgICAgICAgPyBbXHJcbiAgICAgICAgICAgICAgbmV3U3ViWzBdLFxyXG4gICAgICAgICAgICAgIG5ld1N1YlsxXSxcclxuICAgICAgICAgICAgICBuZXdTdWJbMF0oZGlzcGF0Y2gsIG5ld1N1YlsxXSksXHJcbiAgICAgICAgICAgICAgb2xkU3ViICYmIG9sZFN1YlsyXSgpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIDogb2xkU3ViXHJcbiAgICAgICAgOiBvbGRTdWIgJiYgb2xkU3ViWzJdKClcclxuICAgIClcclxuICB9XHJcbiAgcmV0dXJuIHN1YnNcclxufVxyXG5cclxudmFyIHBhdGNoUHJvcGVydHkgPSBmdW5jdGlvbihub2RlLCBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgaWYgKGtleSA9PT0gXCJrZXlcIikge1xyXG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcInN0eWxlXCIpIHtcclxuICAgIGZvciAodmFyIGsgaW4gbWVyZ2Uob2xkVmFsdWUsIG5ld1ZhbHVlKSkge1xyXG4gICAgICBvbGRWYWx1ZSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWVba10gPT0gbnVsbCA/IFwiXCIgOiBuZXdWYWx1ZVtrXVxyXG4gICAgICBpZiAoa1swXSA9PT0gXCItXCIpIHtcclxuICAgICAgICBub2RlW2tleV0uc2V0UHJvcGVydHkoaywgb2xkVmFsdWUpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZVtrZXldW2tdID0gb2xkVmFsdWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoa2V5WzBdID09PSBcIm9cIiAmJiBrZXlbMV0gPT09IFwiblwiKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgICEoKG5vZGUuYWN0aW9ucyB8fCAobm9kZS5hY3Rpb25zID0ge30pKVtcclxuICAgICAgICAoa2V5ID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgIF0gPSBuZXdWYWx1ZSlcclxuICAgICkge1xyXG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoa2V5LCBsaXN0ZW5lcilcclxuICAgIH0gZWxzZSBpZiAoIW9sZFZhbHVlKSB7XHJcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihrZXksIGxpc3RlbmVyKVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoIWlzU3ZnICYmIGtleSAhPT0gXCJsaXN0XCIgJiYga2V5IGluIG5vZGUpIHtcclxuICAgIG5vZGVba2V5XSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWUgPT0gXCJ1bmRlZmluZWRcIiA/IFwiXCIgOiBuZXdWYWx1ZVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICBuZXdWYWx1ZSA9PSBudWxsIHx8XHJcbiAgICBuZXdWYWx1ZSA9PT0gZmFsc2UgfHxcclxuICAgIChrZXkgPT09IFwiY2xhc3NcIiAmJiAhKG5ld1ZhbHVlID0gY3JlYXRlQ2xhc3MobmV3VmFsdWUpKSlcclxuICApIHtcclxuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSlcclxuICB9IGVsc2Uge1xyXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBuZXdWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbnZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24odmRvbSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgdmFyIG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgdmFyIHByb3BzID0gdmRvbS5wcm9wc1xyXG4gIHZhciBub2RlID1cclxuICAgIHZkb20udHlwZSA9PT0gVEVYVF9OT0RFXHJcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmRvbS5uYW1lKVxyXG4gICAgICA6IChpc1N2ZyA9IGlzU3ZnIHx8IHZkb20ubmFtZSA9PT0gXCJzdmdcIilcclxuICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuXHJcbiAgZm9yICh2YXIgayBpbiBwcm9wcykge1xyXG4gICAgcGF0Y2hQcm9wZXJ0eShub2RlLCBrLCBudWxsLCBwcm9wc1trXSwgbGlzdGVuZXIsIGlzU3ZnKVxyXG4gIH1cclxuXHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZkb20uY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoXHJcbiAgICAgIGNyZWF0ZU5vZGUoXHJcbiAgICAgICAgKHZkb20uY2hpbGRyZW5baV0gPSBnZXRWTm9kZSh2ZG9tLmNoaWxkcmVuW2ldKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICh2ZG9tLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgZ2V0S2V5ID0gZnVuY3Rpb24odmRvbSkge1xyXG4gIHJldHVybiB2ZG9tID09IG51bGwgPyBudWxsIDogdmRvbS5rZXlcclxufVxyXG5cclxudmFyIHBhdGNoID0gZnVuY3Rpb24ocGFyZW50LCBub2RlLCBvbGRWTm9kZSwgbmV3Vk5vZGUsIGxpc3RlbmVyLCBpc1N2Zykge1xyXG4gIGlmIChvbGRWTm9kZSA9PT0gbmV3Vk5vZGUpIHtcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgb2xkVk5vZGUgIT0gbnVsbCAmJlxyXG4gICAgb2xkVk5vZGUudHlwZSA9PT0gVEVYVF9OT0RFICYmXHJcbiAgICBuZXdWTm9kZS50eXBlID09PSBURVhUX05PREVcclxuICApIHtcclxuICAgIGlmIChvbGRWTm9kZS5uYW1lICE9PSBuZXdWTm9kZS5uYW1lKSBub2RlLm5vZGVWYWx1ZSA9IG5ld1ZOb2RlLm5hbWVcclxuICB9IGVsc2UgaWYgKG9sZFZOb2RlID09IG51bGwgfHwgb2xkVk5vZGUubmFtZSAhPT0gbmV3Vk5vZGUubmFtZSkge1xyXG4gICAgbm9kZSA9IHBhcmVudC5pbnNlcnRCZWZvcmUoXHJcbiAgICAgIGNyZWF0ZU5vZGUoKG5ld1ZOb2RlID0gZ2V0Vk5vZGUobmV3Vk5vZGUpKSwgbGlzdGVuZXIsIGlzU3ZnKSxcclxuICAgICAgbm9kZVxyXG4gICAgKVxyXG4gICAgaWYgKG9sZFZOb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG9sZFZOb2RlLm5vZGUpXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciB0bXBWS2lkXHJcbiAgICB2YXIgb2xkVktpZFxyXG5cclxuICAgIHZhciBvbGRLZXlcclxuICAgIHZhciBuZXdLZXlcclxuXHJcbiAgICB2YXIgb2xkVlByb3BzID0gb2xkVk5vZGUucHJvcHNcclxuICAgIHZhciBuZXdWUHJvcHMgPSBuZXdWTm9kZS5wcm9wc1xyXG5cclxuICAgIHZhciBvbGRWS2lkcyA9IG9sZFZOb2RlLmNoaWxkcmVuXHJcbiAgICB2YXIgbmV3VktpZHMgPSBuZXdWTm9kZS5jaGlsZHJlblxyXG5cclxuICAgIHZhciBvbGRIZWFkID0gMFxyXG4gICAgdmFyIG5ld0hlYWQgPSAwXHJcbiAgICB2YXIgb2xkVGFpbCA9IG9sZFZLaWRzLmxlbmd0aCAtIDFcclxuICAgIHZhciBuZXdUYWlsID0gbmV3VktpZHMubGVuZ3RoIC0gMVxyXG5cclxuICAgIGlzU3ZnID0gaXNTdmcgfHwgbmV3Vk5vZGUubmFtZSA9PT0gXCJzdmdcIlxyXG5cclxuICAgIGZvciAodmFyIGkgaW4gbWVyZ2Uob2xkVlByb3BzLCBuZXdWUHJvcHMpKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAoaSA9PT0gXCJ2YWx1ZVwiIHx8IGkgPT09IFwic2VsZWN0ZWRcIiB8fCBpID09PSBcImNoZWNrZWRcIlxyXG4gICAgICAgICAgPyBub2RlW2ldXHJcbiAgICAgICAgICA6IG9sZFZQcm9wc1tpXSkgIT09IG5ld1ZQcm9wc1tpXVxyXG4gICAgICApIHtcclxuICAgICAgICBwYXRjaFByb3BlcnR5KG5vZGUsIGksIG9sZFZQcm9wc1tpXSwgbmV3VlByb3BzW2ldLCBsaXN0ZW5lciwgaXNTdmcpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsICYmIG9sZEhlYWQgPD0gb2xkVGFpbCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgKG9sZEtleSA9IGdldEtleShvbGRWS2lkc1tvbGRIZWFkXSkpID09IG51bGwgfHxcclxuICAgICAgICBvbGRLZXkgIT09IGdldEtleShuZXdWS2lkc1tuZXdIZWFkXSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGF0Y2goXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRIZWFkXS5ub2RlLFxyXG4gICAgICAgIG9sZFZLaWRzW29sZEhlYWRdLFxyXG4gICAgICAgIChuZXdWS2lkc1tuZXdIZWFkXSA9IGdldFZOb2RlKFxyXG4gICAgICAgICAgbmV3VktpZHNbbmV3SGVhZCsrXSxcclxuICAgICAgICAgIG9sZFZLaWRzW29sZEhlYWQrK11cclxuICAgICAgICApKSxcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBpc1N2Z1xyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKG5ld0hlYWQgPD0gbmV3VGFpbCAmJiBvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIChvbGRLZXkgPSBnZXRLZXkob2xkVktpZHNbb2xkVGFpbF0pKSA9PSBudWxsIHx8XHJcbiAgICAgICAgb2xkS2V5ICE9PSBnZXRLZXkobmV3VktpZHNbbmV3VGFpbF0pXHJcbiAgICAgICkge1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhdGNoKFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgb2xkVktpZHNbb2xkVGFpbF0ubm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRUYWlsXSxcclxuICAgICAgICAobmV3VktpZHNbbmV3VGFpbF0gPSBnZXRWTm9kZShcclxuICAgICAgICAgIG5ld1ZLaWRzW25ld1RhaWwtLV0sXHJcbiAgICAgICAgICBvbGRWS2lkc1tvbGRUYWlsLS1dXHJcbiAgICAgICAgKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvbGRIZWFkID4gb2xkVGFpbCkge1xyXG4gICAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUoXHJcbiAgICAgICAgICBjcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAobmV3VktpZHNbbmV3SGVhZF0gPSBnZXRWTm9kZShuZXdWS2lkc1tuZXdIZWFkKytdKSksXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZF0pICYmIG9sZFZLaWQubm9kZVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChuZXdIZWFkID4gbmV3VGFpbCkge1xyXG4gICAgICB3aGlsZSAob2xkSGVhZCA8PSBvbGRUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkc1tvbGRIZWFkKytdLm5vZGUpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSBvbGRIZWFkLCBrZXllZCA9IHt9LCBuZXdLZXllZCA9IHt9OyBpIDw9IG9sZFRhaWw7IGkrKykge1xyXG4gICAgICAgIGlmICgob2xkS2V5ID0gb2xkVktpZHNbaV0ua2V5KSAhPSBudWxsKSB7XHJcbiAgICAgICAgICBrZXllZFtvbGRLZXldID0gb2xkVktpZHNbaV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChuZXdIZWFkIDw9IG5ld1RhaWwpIHtcclxuICAgICAgICBvbGRLZXkgPSBnZXRLZXkoKG9sZFZLaWQgPSBvbGRWS2lkc1tvbGRIZWFkXSkpXHJcbiAgICAgICAgbmV3S2V5ID0gZ2V0S2V5KFxyXG4gICAgICAgICAgKG5ld1ZLaWRzW25ld0hlYWRdID0gZ2V0Vk5vZGUobmV3VktpZHNbbmV3SGVhZF0sIG9sZFZLaWQpKVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgbmV3S2V5ZWRbb2xkS2V5XSB8fFxyXG4gICAgICAgICAgKG5ld0tleSAhPSBudWxsICYmIG5ld0tleSA9PT0gZ2V0S2V5KG9sZFZLaWRzW29sZEhlYWQgKyAxXSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBpZiAob2xkS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkLm5vZGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvbGRIZWFkKytcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmV3S2V5ID09IG51bGwgfHwgb2xkVk5vZGUudHlwZSA9PT0gUkVDWUNMRURfTk9ERSkge1xyXG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHBhdGNoKFxyXG4gICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCxcclxuICAgICAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkXSxcclxuICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIG5ld0hlYWQrK1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChvbGRLZXkgPT09IG5ld0tleSkge1xyXG4gICAgICAgICAgICBwYXRjaChcclxuICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgIG9sZFZLaWQubm9kZSxcclxuICAgICAgICAgICAgICBvbGRWS2lkLFxyXG4gICAgICAgICAgICAgIG5ld1ZLaWRzW25ld0hlYWRdLFxyXG4gICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgbmV3S2V5ZWRbbmV3S2V5XSA9IHRydWVcclxuICAgICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHRtcFZLaWQgPSBrZXllZFtuZXdLZXldKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUodG1wVktpZC5ub2RlLCBvbGRWS2lkICYmIG9sZFZLaWQubm9kZSksXHJcbiAgICAgICAgICAgICAgICB0bXBWS2lkLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIG5ld0tleWVkW25ld0tleV0gPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBuZXdIZWFkKytcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgICBpZiAoZ2V0S2V5KChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZCsrXSkpID09IG51bGwpIHtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQob2xkVktpZC5ub2RlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yICh2YXIgaSBpbiBrZXllZCkge1xyXG4gICAgICAgIGlmIChuZXdLZXllZFtpXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGtleWVkW2ldLm5vZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKG5ld1ZOb2RlLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgcHJvcHNDaGFuZ2VkID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGZvciAodmFyIGsgaW4gYSkgaWYgKGFba10gIT09IGJba10pIHJldHVybiB0cnVlXHJcbiAgZm9yICh2YXIgayBpbiBiKSBpZiAoYVtrXSAhPT0gYltrXSkgcmV0dXJuIHRydWVcclxufVxyXG5cclxudmFyIGdldFRleHRWTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gdHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIgPyBub2RlIDogY3JlYXRlVGV4dFZOb2RlKG5vZGUpXHJcbn1cclxuXHJcbnZhciBnZXRWTm9kZSA9IGZ1bmN0aW9uKG5ld1ZOb2RlLCBvbGRWTm9kZSkge1xyXG4gIHJldHVybiBuZXdWTm9kZS50eXBlID09PSBMQVpZX05PREVcclxuICAgID8gKCghb2xkVk5vZGUgfHwgIW9sZFZOb2RlLmxhenkgfHwgcHJvcHNDaGFuZ2VkKG9sZFZOb2RlLmxhenksIG5ld1ZOb2RlLmxhenkpKVxyXG4gICAgICAgICYmICgob2xkVk5vZGUgPSBnZXRUZXh0Vk5vZGUobmV3Vk5vZGUubGF6eS52aWV3KG5ld1ZOb2RlLmxhenkpKSkubGF6eSA9XHJcbiAgICAgICAgICBuZXdWTm9kZS5sYXp5KSxcclxuICAgICAgb2xkVk5vZGUpXHJcbiAgICA6IG5ld1ZOb2RlXHJcbn1cclxuXHJcbnZhciBjcmVhdGVWTm9kZSA9IGZ1bmN0aW9uKG5hbWUsIHByb3BzLCBjaGlsZHJlbiwgbm9kZSwga2V5LCB0eXBlKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICBwcm9wczogcHJvcHMsXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBub2RlOiBub2RlLFxyXG4gICAgdHlwZTogdHlwZSxcclxuICAgIGtleToga2V5XHJcbiAgfVxyXG59XHJcblxyXG52YXIgY3JlYXRlVGV4dFZOb2RlID0gZnVuY3Rpb24odmFsdWUsIG5vZGUpIHtcclxuICByZXR1cm4gY3JlYXRlVk5vZGUodmFsdWUsIEVNUFRZX09CSiwgRU1QVFlfQVJSLCBub2RlLCB1bmRlZmluZWQsIFRFWFRfTk9ERSlcclxufVxyXG5cclxudmFyIHJlY3ljbGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBURVhUX05PREVcclxuICAgID8gY3JlYXRlVGV4dFZOb2RlKG5vZGUubm9kZVZhbHVlLCBub2RlKVxyXG4gICAgOiBjcmVhdGVWTm9kZShcclxuICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgRU1QVFlfT0JKLFxyXG4gICAgICAgIG1hcC5jYWxsKG5vZGUuY2hpbGROb2RlcywgcmVjeWNsZU5vZGUpLFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFJFQ1lDTEVEX05PREVcclxuICAgICAgKVxyXG59XHJcblxyXG5leHBvcnQgdmFyIExhenkgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHJldHVybiB7XHJcbiAgICBsYXp5OiBwcm9wcyxcclxuICAgIHR5cGU6IExBWllfTk9ERVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBoID0gZnVuY3Rpb24obmFtZSwgcHJvcHMpIHtcclxuICBmb3IgKHZhciB2ZG9tLCByZXN0ID0gW10sIGNoaWxkcmVuID0gW10sIGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHtcclxuICAgIHJlc3QucHVzaChhcmd1bWVudHNbaV0pXHJcbiAgfVxyXG5cclxuICB3aGlsZSAocmVzdC5sZW5ndGggPiAwKSB7XHJcbiAgICBpZiAoaXNBcnJheSgodmRvbSA9IHJlc3QucG9wKCkpKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gdmRvbS5sZW5ndGg7IGktLSA+IDA7ICkge1xyXG4gICAgICAgIHJlc3QucHVzaCh2ZG9tW2ldKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHZkb20gPT09IGZhbHNlIHx8IHZkb20gPT09IHRydWUgfHwgdmRvbSA9PSBudWxsKSB7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGdldFRleHRWTm9kZSh2ZG9tKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3BzID0gcHJvcHMgfHwgRU1QVFlfT0JKXHJcblxyXG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICA/IG5hbWUocHJvcHMsIGNoaWxkcmVuKVxyXG4gICAgOiBjcmVhdGVWTm9kZShuYW1lLCBwcm9wcywgY2hpbGRyZW4sIHVuZGVmaW5lZCwgcHJvcHMua2V5KVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGFwcCA9IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgdmFyIHN0YXRlID0ge31cclxuICB2YXIgbG9jayA9IGZhbHNlXHJcbiAgdmFyIHZpZXcgPSBwcm9wcy52aWV3XHJcbiAgdmFyIG5vZGUgPSBwcm9wcy5ub2RlXHJcbiAgdmFyIHZkb20gPSBub2RlICYmIHJlY3ljbGVOb2RlKG5vZGUpXHJcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBwcm9wcy5zdWJzY3JpcHRpb25zXHJcbiAgdmFyIHN1YnMgPSBbXVxyXG4gIHZhciBvbkVuZCA9IHByb3BzLm9uRW5kXHJcblxyXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBkaXNwYXRjaCh0aGlzLmFjdGlvbnNbZXZlbnQudHlwZV0sIGV2ZW50KVxyXG4gIH1cclxuXHJcbiAgdmFyIHNldFN0YXRlID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcclxuICAgIGlmIChzdGF0ZSAhPT0gbmV3U3RhdGUpIHtcclxuICAgICAgc3RhdGUgPSBuZXdTdGF0ZVxyXG4gICAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgIHN1YnMgPSBwYXRjaFN1YnMoc3VicywgYmF0Y2goW3N1YnNjcmlwdGlvbnMoc3RhdGUpXSksIGRpc3BhdGNoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh2aWV3ICYmICFsb2NrKSBkZWZlcihyZW5kZXIsIChsb2NrID0gdHJ1ZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGVcclxuICB9XHJcblxyXG4gIHZhciBkaXNwYXRjaCA9IChwcm9wcy5taWRkbGV3YXJlIHx8XHJcbiAgICBmdW5jdGlvbihvYmopIHtcclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfSkoZnVuY3Rpb24oYWN0aW9uLCBwcm9wcykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICA/IGRpc3BhdGNoKGFjdGlvbihzdGF0ZSwgcHJvcHMpKVxyXG4gICAgICA6IGlzQXJyYXkoYWN0aW9uKVxyXG4gICAgICA/IHR5cGVvZiBhY3Rpb25bMF0gPT09IFwiZnVuY3Rpb25cIiB8fCBpc0FycmF5KGFjdGlvblswXSlcclxuICAgICAgICA/IGRpc3BhdGNoKFxyXG4gICAgICAgICAgICBhY3Rpb25bMF0sXHJcbiAgICAgICAgICAgIHR5cGVvZiBhY3Rpb25bMV0gPT09IFwiZnVuY3Rpb25cIiA/IGFjdGlvblsxXShwcm9wcykgOiBhY3Rpb25bMV1cclxuICAgICAgICAgIClcclxuICAgICAgICA6IChiYXRjaChhY3Rpb24uc2xpY2UoMSkpLm1hcChmdW5jdGlvbihmeCkge1xyXG4gICAgICAgICAgICBmeCAmJiBmeFswXShkaXNwYXRjaCwgZnhbMV0pXHJcbiAgICAgICAgICB9LCBzZXRTdGF0ZShhY3Rpb25bMF0pKSxcclxuICAgICAgICAgIHN0YXRlKVxyXG4gICAgICA6IHNldFN0YXRlKGFjdGlvbilcclxuICB9KVxyXG5cclxuICB2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsb2NrID0gZmFsc2VcclxuICAgIG5vZGUgPSBwYXRjaChcclxuICAgICAgbm9kZS5wYXJlbnROb2RlLFxyXG4gICAgICBub2RlLFxyXG4gICAgICB2ZG9tLFxyXG4gICAgICAodmRvbSA9IGdldFRleHRWTm9kZSh2aWV3KHN0YXRlKSkpLFxyXG4gICAgICBsaXN0ZW5lclxyXG4gICAgKVxyXG4gICAgb25FbmQoKVxyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gYXNzaWduKHNvdXJjZSwgYXNzaWdubWVudHMpIHtcclxuICB2YXIgcmVzdWx0ID0ge30sXHJcbiAgICBpXHJcbiAgZm9yIChpIGluIHNvdXJjZSkgcmVzdWx0W2ldID0gc291cmNlW2ldXHJcbiAgZm9yIChpIGluIGFzc2lnbm1lbnRzKSByZXN1bHRbaV0gPSBhc3NpZ25tZW50c1tpXVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZW1vdmVMaXN0ZW5lcihhdHRhY2hUbywgZGlzcGF0Y2gsIGFjdGlvbiwgZXZlbnROYW1lKSB7XHJcbiAgdmFyIGhhbmRsZXIgPSBkaXNwYXRjaC5iaW5kKG51bGwsIGFjdGlvbilcclxuICBhdHRhY2hUby5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICBhdHRhY2hUby5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlRGlzcGF0Y2hUaW1lKGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbiwgcHJvcHMuYXNEYXRlID8gbmV3IERhdGUoKSA6IHBlcmZvcm1hbmNlLm5vdygpKVxyXG4gIH1cclxufVxyXG5cclxudmFyIHdlYlNvY2tldENvbm5lY3Rpb25zID0ge31cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPcGVuV2ViU29ja2V0KHByb3BzKSB7XHJcbiAgdmFyIGNvbm5lY3Rpb24gPSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbiAgaWYgKCFjb25uZWN0aW9uKSB7XHJcbiAgICBjb25uZWN0aW9uID0ge1xyXG4gICAgICBzb2NrZXQ6IG5ldyBXZWJTb2NrZXQocHJvcHMudXJsLCBwcm9wcy5wcm90b2NvbHMpLFxyXG4gICAgICBsaXN0ZW5lcnM6IFtdXHJcbiAgICB9XHJcbiAgICB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdID0gY29ubmVjdGlvblxyXG4gIH1cclxuICByZXR1cm4gY29ubmVjdGlvblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VXZWJTb2NrZXQocHJvcHMpIHtcclxuICB2YXIgY29ubmVjdGlvbiA9IGdldE9wZW5XZWJTb2NrZXQocHJvcHMpXHJcbiAgLy8gRklYTUU6IGhhbmRsZSBjbG9zZSBvbiBvcGVuaW5nXHJcbiAgY29ubmVjdGlvbi5zb2NrZXQuY2xvc2UoKVxyXG4gIGRlbGV0ZSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbn1cclxuIiwiaW1wb3J0IHsgbWFrZVJlbW92ZUxpc3RlbmVyIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcclxuXHJcbmZ1bmN0aW9uIGtleWJvYXJkRWZmZWN0KGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHZhciByZW1vdmVMaXN0ZW5lckZvckV2ZW50ID0gbWFrZVJlbW92ZUxpc3RlbmVyLmJpbmQoXHJcbiAgICBudWxsLFxyXG4gICAgZG9jdW1lbnQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIHByb3BzLmFjdGlvblxyXG4gIClcclxuICB2YXIgcmVtb3ZlRG93biA9IHByb3BzLmRvd25zID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleWRvd25cIikgOiBudWxsXHJcbiAgdmFyIHJlbW92ZVVwID0gcHJvcHMudXBzID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleXVwXCIpIDogbnVsbFxyXG4gIHZhciByZW1vdmVQcmVzcyA9IHByb3BzLnByZXNzZXMgPyByZW1vdmVMaXN0ZW5lckZvckV2ZW50KFwia2V5cHJlc3NcIikgOiBudWxsXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgcmVtb3ZlRG93biAmJiByZW1vdmVEb3duKClcclxuICAgIHJlbW92ZVVwICYmIHJlbW92ZVVwKClcclxuICAgIHJlbW92ZVByZXNzICYmIHJlbW92ZVByZXNzKClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYW4gZWZmZWN0IHRoYXQgY2FuIGNhcHR1cmUgW2tleWRvd25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0V2ZW50cy9rZXlkb3duKSwgW2tleXVwXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5dXApLCBhbmQgW2tleXByZXNzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5cHJlc3MpIGV2ZW50cyBmb3IgeW91ciBlbnRpcmUgZG9jdW1lbnQuIFRoZSBbYEtleWJvYXJkRXZlbnRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudCkgd2lsbCBiZSBwcm92aWRlZCBhcyB0aGUgYWN0aW9uIGBkYXRhYC5cclxuICpcclxuICogQG1lbWJlcm9mIG1vZHVsZTpzdWJzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLmRvd25zIC0gbGlzdGVuIGZvciBrZXlkb3duIGV2ZW50c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLnVwcyAtIGxpc3RlbiBmb3Iga2V5dXAgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJvcHMucHJlc3NlcyAtIGxpc3RlbiBmb3Iga2V5cHJlc3MgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Kn0gcHJvcHMuYWN0aW9uIC0gYWN0aW9uIHRvIGNhbGwgd2hlbiBrZXlib2FyZCBldmVudHMgYXJlIGZpcmVkXHJcbiAqIEBleGFtcGxlXHJcbiAqIGltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcImh5cGVyYXBwLWZ4LWxvY2FsXCJcclxuICpcclxuICogY29uc3QgS2V5U3ViID0gS2V5Ym9hcmQoe1xyXG4gKiAgIGRvd25zOiB0cnVlLFxyXG4gKiAgIHVwczogdHJ1ZSxcclxuICogICBhY3Rpb246IChfLCBrZXlFdmVudCkgPT4ge1xyXG4gKiAgICAgLy8ga2V5RXZlbnQgaGFzIHRoZSBwcm9wcyBvZiB0aGUgS2V5Ym9hcmRFdmVudFxyXG4gKiAgICAgLy8gYWN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBrZXlkb3duIGFuZCBrZXl1cFxyXG4gKiAgIH1cclxuICogfSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBLZXlib2FyZChwcm9wcykge1xyXG4gIHJldHVybiBba2V5Ym9hcmRFZmZlY3QsIHByb3BzXVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBEaXNwbGF5VHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBUb3BpY3MgPSBcInRvcGljc1wiLFxyXG4gICAgQXJ0aWNsZSA9IFwiYXJ0aWNsZVwiLFxyXG4gICAgU3RlcCA9IFwic3RlcFwiXHJcbn1cclxuIiwiXHJcblxyXG5jb25zdCBnVXRpbGl0aWVzID0ge1xyXG5cclxuICAgIHJvdW5kVXBUb05lYXJlc3RUZW46ICh2YWx1ZTogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb29yID0gTWF0aC5mbG9vcih2YWx1ZSAvIDEwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChmbG9vciArIDEpICogMTA7XHJcbiAgICB9LFxyXG5cclxuICAgIHJvdW5kRG93blRvTmVhcmVzdFRlbjogKHZhbHVlOiBudW1iZXIpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yKHZhbHVlIC8gMTApO1xyXG5cclxuICAgICAgICByZXR1cm4gZmxvb3IgKiAxMDtcclxuICAgIH0sXHJcblxyXG4gICAgY29udmVydE1tVG9GZWV0SW5jaGVzOiAobW06IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluY2hlcyA9IG1tICogMC4wMzkzNztcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMuY29udmVydEluY2hlc1RvRmVldEluY2hlcyhpbmNoZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXREaXJlY3Rvcnk6IChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBmaWxlUGF0aC5tYXRjaCgvKC4qKVtcXC9cXFxcXS8pO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hlc1xyXG4gICAgICAgICAgICAmJiBtYXRjaGVzLmxlbmd0aCA+IDBcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb3VudENoYXJhY3RlcjogKFxyXG4gICAgICAgIGlucHV0OiBzdHJpbmcsXHJcbiAgICAgICAgY2hhcmFjdGVyOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5wdXRbaV0gPT09IGNoYXJhY3Rlcikge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfSxcclxuXHJcbiAgICBjb252ZXJ0SW5jaGVzVG9GZWV0SW5jaGVzOiAoaW5jaGVzOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmZWV0ID0gTWF0aC5mbG9vcihpbmNoZXMgLyAxMik7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nID0gaW5jaGVzICUgMTI7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nUm91bmRlZCA9IE1hdGgucm91bmQoaW5jaGVzUmVhbWluaW5nICogMTApIC8gMTA7IC8vIDEgZGVjaW1hbCBwbGFjZXNcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGZlZXQgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBgJHtmZWV0fScgYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmNoZXNSZWFtaW5pbmdSb3VuZGVkID4gMCkge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gYCR7cmVzdWx0fSR7aW5jaGVzUmVhbWluaW5nUm91bmRlZH1cImA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICBpc051bGxPcldoaXRlU3BhY2U6IChpbnB1dDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgaW5wdXQgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dCA9IGAke2lucHV0fWA7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dC5tYXRjaCgvXlxccyokLykgIT09IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrQXJyYXlzRXF1YWw6IChhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgYiA9PT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgeW91IGRvbid0IGNhcmUgYWJvdXQgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbnNpZGVcclxuICAgICAgICAvLyB0aGUgYXJyYXksIHlvdSBzaG91bGQgc29ydCBib3RoIGFycmF5cyBoZXJlLlxyXG4gICAgICAgIC8vIFBsZWFzZSBub3RlIHRoYXQgY2FsbGluZyBzb3J0IG9uIGFuIGFycmF5IHdpbGwgbW9kaWZ5IHRoYXQgYXJyYXkuXHJcbiAgICAgICAgLy8geW91IG1pZ2h0IHdhbnQgdG8gY2xvbmUgeW91ciBhcnJheSBmaXJzdC5cclxuXHJcbiAgICAgICAgY29uc3QgeDogc3RyaW5nW10gPSBbLi4uYV07XHJcbiAgICAgICAgY29uc3QgeTogc3RyaW5nW10gPSBbLi4uYl07XHJcbiAgICAgICAgXHJcbiAgICAgICAgeC5zb3J0KCk7XHJcbiAgICAgICAgeS5zb3J0KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhbaV0gIT09IHlbaV0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlKGFycmF5OiBBcnJheTxhbnk+KTogQXJyYXk8YW55PiB7XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHRlbXBvcmFyeVZhbHVlOiBhbnlcclxuICAgICAgICBsZXQgcmFuZG9tSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UoaW5wdXQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIWlzTmFOKGlucHV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOZWdhdGl2ZU51bWVyaWM6IChpbnB1dDogYW55KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmICghZ1V0aWxpdGllcy5pc051bWVyaWMoaW5wdXQpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gK2lucHV0IDwgMDsgLy8gKyBjb252ZXJ0cyBhIHN0cmluZyB0byBhIG51bWJlciBpZiBpdCBjb25zaXN0cyBvbmx5IG9mIGRpZ2l0cy5cclxuICAgIH0sXHJcblxyXG4gICAgaGFzRHVwbGljYXRlczogPFQ+KGlucHV0OiBBcnJheTxUPik6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAobmV3IFNldChpbnB1dCkuc2l6ZSAhPT0gaW5wdXQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgZXh0ZW5kOiA8VD4oYXJyYXkxOiBBcnJheTxUPiwgYXJyYXkyOiBBcnJheTxUPik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBhcnJheTIuZm9yRWFjaCgoaXRlbTogVCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYXJyYXkxLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21TdHJpbmc6IChpbnB1dDogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMucHJldHR5UHJpbnRKc29uRnJvbU9iamVjdChKU09OLnBhcnNlKGlucHV0KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21PYmplY3Q6IChpbnB1dDogb2JqZWN0IHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgICBpbnB1dCxcclxuICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgNCAvLyBpbmRlbnRlZCA0IHNwYWNlc1xyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzUG9zaXRpdmVOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdW1lcmljKGlucHV0KSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihpbnB1dCkgPj0gMDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VGltZTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdzogRGF0ZSA9IG5ldyBEYXRlKERhdGUubm93KCkpO1xyXG4gICAgICAgIGNvbnN0IHRpbWU6IHN0cmluZyA9IGAke25vdy5nZXRGdWxsWWVhcigpfS0keyhub3cuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0tJHtub3cuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0gJHtub3cuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9Ojoke25vdy5nZXRNaWxsaXNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDMsICcwJyl9OmA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZTogKGlucHV0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGlucHV0LnNwbGl0KC9bXFxyXFxuXSsvKTtcclxuICAgICAgICBjb25zdCBjbGVhbmVkOiBBcnJheTxzdHJpbmc+ID0gW107XHJcblxyXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgodmFsdWU6IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZSh2YWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhbmVkLnB1c2godmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xlYW5lZDtcclxuICAgIH0sXHJcblxyXG4gICAgc3BsaXRCeVBpcGU6IChpbnB1dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZShpbnB1dCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBpbnB1dC5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWQ6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHJcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFuZWQucHVzaCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZUFuZE9yZGVyOiAoaW5wdXQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllc1xyXG4gICAgICAgICAgICAuc3BsaXRCeU5ld0xpbmUoaW5wdXQpXHJcbiAgICAgICAgICAgIC5zb3J0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpvaW5CeU5ld0xpbmU6IChpbnB1dDogQXJyYXk8c3RyaW5nPik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXRcclxuICAgICAgICAgICAgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuam9pbignXFxuJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUFsbENoaWxkcmVuOiAocGFyZW50OiBFbGVtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGlzT2RkOiAoeDogbnVtYmVyKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiB4ICUgMiA9PT0gMTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvcnRQcmludFRleHQ6IChcclxuICAgICAgICBpbnB1dDogc3RyaW5nLFxyXG4gICAgICAgIG1heExlbmd0aDogbnVtYmVyID0gMTAwKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3ROZXdMaW5lSW5kZXg6IG51bWJlciA9IGdVdGlsaXRpZXMuZ2V0Rmlyc3ROZXdMaW5lSW5kZXgoaW5wdXQpO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3ROZXdMaW5lSW5kZXggPiAwXHJcbiAgICAgICAgICAgICYmIGZpcnN0TmV3TGluZUluZGV4IDw9IG1heExlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQuc3Vic3RyKDAsIGZpcnN0TmV3TGluZUluZGV4IC0gMSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy50cmltQW5kQWRkRWxsaXBzaXMob3V0cHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGggPD0gbWF4TGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMudHJpbUFuZEFkZEVsbGlwc2lzKG91dHB1dCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRyaW1BbmRBZGRFbGxpcHNpczogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBpbnB1dC50cmltKCk7XHJcbiAgICAgICAgbGV0IHB1bmN0dWF0aW9uUmVnZXg6IFJlZ0V4cCA9IC9bLixcXC8jISQlXFxeJlxcKjs6e309XFwtX2B+KCldL2c7XHJcbiAgICAgICAgbGV0IHNwYWNlUmVnZXg6IFJlZ0V4cCA9IC9cXFcrL2c7XHJcbiAgICAgICAgbGV0IGxhc3RDaGFyYWN0ZXI6IHN0cmluZyA9IG91dHB1dFtvdXRwdXQubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGxldCBsYXN0Q2hhcmFjdGVySXNQdW5jdHVhdGlvbjogYm9vbGVhbiA9XHJcbiAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICB8fCBzcGFjZVJlZ2V4LnRlc3QobGFzdENoYXJhY3Rlcik7XHJcblxyXG5cclxuICAgICAgICB3aGlsZSAobGFzdENoYXJhY3RlcklzUHVuY3R1YXRpb24gPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zdWJzdHIoMCwgb3V0cHV0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsYXN0Q2hhcmFjdGVyID0gb3V0cHV0W291dHB1dC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGxhc3RDaGFyYWN0ZXJJc1B1bmN0dWF0aW9uID1cclxuICAgICAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICAgICAgfHwgc3BhY2VSZWdleC50ZXN0KGxhc3RDaGFyYWN0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke291dHB1dH0uLi5gO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGaXJzdE5ld0xpbmVJbmRleDogKGlucHV0OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICBsZXQgY2hhcmFjdGVyOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ1xcbidcclxuICAgICAgICAgICAgICAgIHx8IGNoYXJhY3RlciA9PT0gJ1xccicpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cHBlckNhc2VGaXJzdExldHRlcjogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zbGljZSgxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuZXJhdGVHdWlkOiAodXNlSHlwZW5zOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBsZXQgZDIgPSAocGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgJiYgcGVyZm9ybWFuY2Uubm93XHJcbiAgICAgICAgICAgICYmIChwZXJmb3JtYW5jZS5ub3coKSAqIDEwMDApKSB8fCAwO1xyXG5cclxuICAgICAgICBsZXQgcGF0dGVybiA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xyXG5cclxuICAgICAgICBpZiAoIXVzZUh5cGVucykge1xyXG4gICAgICAgICAgICBwYXR0ZXJuID0gJ3h4eHh4eHh4eHh4eDR4eHh5eHh4eHh4eHh4eHh4eHh4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWQgPSBwYXR0ZXJuXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgL1t4eV0vZyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDE2O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZCArIHIpICUgMTYgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZDIgKyByKSAlIDE2IHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZDIgPSBNYXRoLmZsb29yKGQyIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBndWlkO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0lmQ2hyb21lOiAoKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIC8vIHBsZWFzZSBub3RlLCBcclxuICAgICAgICAvLyB0aGF0IElFMTEgbm93IHJldHVybnMgdW5kZWZpbmVkIGFnYWluIGZvciB3aW5kb3cuY2hyb21lXHJcbiAgICAgICAgLy8gYW5kIG5ldyBPcGVyYSAzMCBvdXRwdXRzIHRydWUgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBidXQgbmVlZHMgdG8gY2hlY2sgaWYgd2luZG93Lm9wciBpcyBub3QgdW5kZWZpbmVkXHJcbiAgICAgICAgLy8gYW5kIG5ldyBJRSBFZGdlIG91dHB1dHMgdG8gdHJ1ZSBub3cgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBhbmQgaWYgbm90IGlPUyBDaHJvbWUgY2hlY2tcclxuICAgICAgICAvLyBzbyB1c2UgdGhlIGJlbG93IHVwZGF0ZWQgY29uZGl0aW9uXHJcblxyXG4gICAgICAgIGxldCB0c1dpbmRvdzogYW55ID0gd2luZG93IGFzIGFueTtcclxuICAgICAgICBsZXQgaXNDaHJvbWl1bSA9IHRzV2luZG93LmNocm9tZTtcclxuICAgICAgICBsZXQgd2luTmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcclxuICAgICAgICBsZXQgdmVuZG9yTmFtZSA9IHdpbk5hdi52ZW5kb3I7XHJcbiAgICAgICAgbGV0IGlzT3BlcmEgPSB0eXBlb2YgdHNXaW5kb3cub3ByICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIGxldCBpc0lFZWRnZSA9IHdpbk5hdi51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMTtcclxuICAgICAgICBsZXQgaXNJT1NDaHJvbWUgPSB3aW5OYXYudXNlckFnZW50Lm1hdGNoKFwiQ3JpT1NcIik7XHJcblxyXG4gICAgICAgIGlmIChpc0lPU0Nocm9tZSkge1xyXG4gICAgICAgICAgICAvLyBpcyBHb29nbGUgQ2hyb21lIG9uIElPU1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNDaHJvbWl1bSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAmJiB0eXBlb2YgaXNDaHJvbWl1bSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAmJiB2ZW5kb3JOYW1lID09PSBcIkdvb2dsZSBJbmMuXCJcclxuICAgICAgICAgICAgJiYgaXNPcGVyYSA9PT0gZmFsc2VcclxuICAgICAgICAgICAgJiYgaXNJRWVkZ2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIC8vIGlzIEdvb2dsZSBDaHJvbWVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVXRpbGl0aWVzOyIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuXHJcbiAgICBOb25lID0gJ25vbmUnLFxyXG4gICAgRmlsdGVyVG9waWNzID0gJ2ZpbHRlclRvcGljcycsXHJcbiAgICBHZXRUb3BpYyA9ICdnZXRUb3BpYycsXHJcbiAgICBHZXRUb3BpY0FuZFJvb3QgPSAnZ2V0VG9waWNBbmRSb290JyxcclxuICAgIFNhdmVBcnRpY2xlU2NlbmUgPSAnc2F2ZUFydGljbGVTY2VuZScsXHJcbiAgICBHZXRSb290ID0gJ2dldFJvb3QnLFxyXG4gICAgR2V0U3RlcCA9ICdnZXRTdGVwJyxcclxuICAgIEdldFBhZ2UgPSAnZ2V0UGFnZScsXHJcbiAgICBHZXRDaGFpbiA9ICdnZXRDaGFpbicsXHJcbiAgICBHZXRPdXRsaW5lID0gJ2dldE91dGxpbmUnLFxyXG4gICAgR2V0RnJhZ21lbnQgPSAnZ2V0RnJhZ21lbnQnLFxyXG4gICAgR2V0Q2hhaW5GcmFnbWVudCA9ICdnZXRDaGFpbkZyYWdtZW50J1xyXG59XHJcblxyXG4iLCJpbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwRWZmZWN0IGltcGxlbWVudHMgSUh0dHBFZmZlY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB1cmw6IHN0cmluZyxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25EZWxlZ2F0ZSA9IGFjdGlvbkRlbGVnYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheTtcclxufVxyXG4iLCJpbXBvcnQgSUFjdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQWN0aW9uXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSHR0cEVmZmVjdCBmcm9tIFwiLi4vLi4vc3RhdGUvZWZmZWN0cy9IdHRwRWZmZWN0XCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcblxyXG5cclxuLy8gVGhpcyBpcyB3aGVyZSBhbGwgYWxlcnRzIHRvIGRhdGEgY2hhbmdlcyBzaG91bGQgYmUgbWFkZVxyXG5jb25zdCBnU3RhdGVDb2RlID0ge1xyXG5cclxuICAgIGdldEZyZXNoS2V5SW50OiAoc3RhdGU6IElTdGF0ZSk6IG51bWJlciA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRLZXkgPSArK3N0YXRlLm5leHRLZXk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0S2V5O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGcmVzaEtleTogKHN0YXRlOiBJU3RhdGUpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7Z1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSl9YDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0R3VpZEtleTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBVLmdlbmVyYXRlR3VpZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBuZXdTdGF0ZTogSVN0YXRlID0geyAuLi5zdGF0ZSB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkZFJlTG9hZERhdGFFZmZlY3Q6IChcclxuICAgIC8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgLy8gICAgIG5hbWU6IHN0cmluZyxcclxuICAgIC8vICAgICB1cmw6IHN0cmluZyxcclxuICAgIC8vICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogdm9pZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGVmZmVjdDogSUh0dHBFZmZlY3QgfCB1bmRlZmluZWQgPSBzdGF0ZVxyXG4gICAgLy8gICAgICAgICAucmVwZWF0RWZmZWN0c1xyXG4gICAgLy8gICAgICAgICAucmVMb2FkR2V0SHR0cFxyXG4gICAgLy8gICAgICAgICAuZmluZCgoZWZmZWN0OiBJSHR0cEVmZmVjdCkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBlZmZlY3QubmFtZSA9PT0gbmFtZTtcclxuICAgIC8vICAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIGlmIChlZmZlY3QpIHsgLy8gYWxyZWFkeSBhZGRlZC5cclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgY29uc3QgaHR0cEVmZmVjdDogSUh0dHBFZmZlY3QgPSBuZXcgSHR0cEVmZmVjdChcclxuICAgIC8vICAgICAgICAgbmFtZSxcclxuICAgIC8vICAgICAgICAgdXJsLFxyXG4gICAgLy8gICAgICAgICBhY3Rpb25EZWxlZ2F0ZVxyXG4gICAgLy8gICAgICk7XHJcblxyXG4gICAgLy8gICAgIHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cC5wdXNoKGh0dHBFZmZlY3QpO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBBZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBlZmZlY3Q6IElIdHRwRWZmZWN0IHwgdW5kZWZpbmVkID0gc3RhdGVcclxuICAgICAgICAgICAgLnJlcGVhdEVmZmVjdHNcclxuICAgICAgICAgICAgLnJlTG9hZEdldEh0dHBJbW1lZGlhdGVcclxuICAgICAgICAgICAgLmZpbmQoKGVmZmVjdDogSUh0dHBFZmZlY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWZmZWN0Lm5hbWUgPT09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZWZmZWN0KSB7IC8vIGFscmVhZHkgYWRkZWQuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0ID0gbmV3IEh0dHBFZmZlY3QoXHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgYWN0aW9uRGVsZWdhdGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUucHVzaChodHRwRWZmZWN0KTtcclxuICAgIH0sXHJcblxyXG4gICAgQWRkUnVuQWN0aW9uSW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogSUFjdGlvbik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZS5wdXNoKGFjdGlvbkRlbGVnYXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RhdGVDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGVwVUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXBVSSBpbXBsZW1lbnRzIElTdGVwVUkge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcih1aUlEOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBlZ3M6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb3B0aW9uVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvblRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGF1dG9mb2N1czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBleHBhbmRPcHRpb25zOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbm90ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBlZ0Nyb3duOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcFVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwVUlcIjtcclxuaW1wb3J0IFN0ZXBVSSBmcm9tIFwiLi9TdGVwVUlcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXAgaW1wbGVtZW50cyBJU3RlcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgU3RlcFVJKHVpSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHRva2VuOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBvcHRpb25JbnRybzogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcmRlcjogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBzdWJUb2tlbjogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBsZWFmOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcHRpb25zOiBBcnJheTxJT3B0aW9uPiA9IFtdO1xyXG4gICAgcHVibGljIGJpbjogYW55ID0ge307XHJcblxyXG4gICAgcHVibGljIHVpOiBJU3RlcFVJO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBTdGVwVHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBSb290ID0gXCJyb290XCIsXHJcbiAgICBTdGVwID0gXCJzdGVwXCIsXHJcbiAgICBBbmNpbGxhcnlSb290ID0gXCJhbmNpbGxhcnlSb290XCIsXHJcbiAgICBBbmNpbGxhcnlTdGVwID0gXCJhbmNpbGxhcnlTdGVwXCJcclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcbmltcG9ydCBJT3B0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lPcHRpb25cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGVwQ2FjaGUgaW1wbGVtZW50cyBJU3RlcENhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnQuY2hhaW5JRDtcclxuICAgICAgICB0aGlzLmNoYWluSUQgPSBgJHtwYXJlbnQuY2hhaW5JRH0uJHtzdGVwLm9yZGVyfWA7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBVaUlEOiBudW1iZXIgPSBzdGVwLnVpLnVpSUQ7XHJcbiAgICAgICAgY29uc3QgcGFyZW50T3B0aW9uczogQXJyYXk8SU9wdGlvbj4gPSBwYXJlbnQuc3RlcC5vcHRpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRPcHRpb25zW2ldLnVpLnVpSUQgPT09IHN0ZXBVaUlEKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UZXh0ID0gcGFyZW50T3B0aW9uc1tpXS50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgXCJObyBtYXRjaGluZyB1aUlEIGluIHBhcmVudCBvcHRpb25zISEhXCJcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdGVwOiBJU3RlcDtcclxuICAgIHB1YmxpYyBjaGlsZHJlbjogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBhbmNpbGxhcmllczogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBwYXJlbnQ6IElTdGVwQ2FjaGU7XHJcbiAgICBwdWJsaWMgaGVpcjogSVN0ZXBDYWNoZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHR5cGU6IFN0ZXBUeXBlID0gU3RlcFR5cGUuU3RlcDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdENhY2hlIGltcGxlbWVudHMgSVN0ZXBDYWNoZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RlcDogSVN0ZXApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5jaGFpbklEID0gJzAuMSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXJlbnRDaGFpbklEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RlcDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgYW5jaWxsYXJpZXM6IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgcGFyZW50OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdHlwZTogU3RlcFR5cGUgPSBTdGVwVHlwZS5Sb290O1xyXG4gICAgcHVibGljIGhlaXI6IElTdGVwQ2FjaGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeVVybCBpbXBsZW1lbnRzIElIaXN0b3J5VXJsIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclNuYXBTaG90IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSVJlbmRlclNuYXBTaG90XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU25hcFNob3QgaW1wbGVtZW50cyBJUmVuZGVyU25hcFNob3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxuICAgIHB1YmxpYyBndWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjcmVhdGVkOiBEYXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbW9kaWZpZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBleHBhbmRlZE9wdGlvbklEczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIGV4cGFuZGVkQW5jaWxsYXJ5SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IEhpc3RvcnlVcmwgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvSGlzdG9yeVVybFwiO1xyXG5pbXBvcnQgUmVuZGVyU25hcFNob3QgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvUmVuZGVyU25hcFNob3RcIjtcclxuXHJcblxyXG5jb25zdCBnSGlzdG9yeUNvZGUgPSB7XHJcblxyXG4gICAgcmVzZXRSYXc6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVzaEJyb3dzZXJIaXN0b3J5U3RhdGU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5yZXNldFJhdygpO1xyXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBsYXN0VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaGlzdG9yeS5zdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5oaXN0b3J5LnN0YXRlLnVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhc3RVcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke2xvY2F0aW9uLnNlYXJjaH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0/JHtjdXJyZW50Lm91dGxpbmVGcmFnbWVudElEfWA7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VXJsXHJcbiAgICAgICAgICAgICYmIHVybCA9PT0gbGFzdFVybCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcclxuICAgICAgICAgICAgbmV3IFJlbmRlclNuYXBTaG90KHVybCksXHJcbiAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnN0ZXBIaXN0b3J5Lmhpc3RvcnlDaGFpbi5wdXNoKG5ldyBIaXN0b3J5VXJsKHVybCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0hpc3RvcnlDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi9TdGVwXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcE9wdGlvbiBleHRlbmRzIFN0ZXAgaW1wbGVtZW50cyBJT3B0aW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcixcclxuICAgICAgICB0ZXh0OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICB1aUlELFxyXG4gICAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYW5jaWxsYXJ5OiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSVN0ZXAgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBcIjtcclxuaW1wb3J0IFN0ZXBDYWNoZSBmcm9tIFwiLi9TdGVwQ2FjaGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmNpbGxhcnlDYWNoZSBleHRlbmRzIFN0ZXBDYWNoZSBpbXBsZW1lbnRzIElTdGVwQ2FjaGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNBbmNpbGxhcnk6IGJvb2xlYW4gPSB0cnVlO1xyXG59XHJcbiIsImltcG9ydCBJQXJ0aWNsZVNjZW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUFydGljbGVTY2VuZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGVTY2VuZSBpbXBsZW1lbnRzIElBcnRpY2xlU2NlbmUge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHI6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGd1aWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGV4cGFuZGVkT3B0aW9uSURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwdWJsaWMgZXhwYW5kZWRBbmNpbGxhcnlJRHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxufVxyXG4iLCJpbXBvcnQgSUNoYWluUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5QYXlsb2FkXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhaW5QYXlsb2FkIGltcGxlbWVudHMgSUNoYWluUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcikge1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXBJRCA9IHN0ZXBJRDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIHRoaXMudWlJRCA9IHVpSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0ZXBJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB1aUlEOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYWluU3RlcFBheWxvYWQgaW1wbGVtZW50cyBJQ2hhaW5TdGVwUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXAsXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcElEID0gc3RlcElEO1xyXG4gICAgICAgIHRoaXMucGFyZW50Q2hhaW5JRCA9IHBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RlcElEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcGFyZW50Q2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUFydGljbGVTY2VuZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lBcnRpY2xlU2NlbmVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSU9wdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JT3B0aW9uXCI7XHJcbmltcG9ydCBBcnRpY2xlU2NlbmUgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvQXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL3N0YXRlL3VpL3BheWxvYWRzL0NoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5pbXBvcnQgZ1N0ZXBBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dTdGVwQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuL2dIaXN0b3J5Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcENvZGUgZnJvbSBcIi4vZ1N0ZXBDb2RlXCI7XHJcblxyXG5jb25zdCBnQXJ0aWNsZUNvZGUgPSB7XHJcblxyXG4gICAgY2hlY2tJZk9wdGlvbnNFeHBhbmRlZDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcENhY2hlOiBJU3RlcENhY2hlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZVxyXG4gICAgICAgICAgICB8fCAhc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gYmUgYWJsZSB0byBsb2FkIHRoZSBjaGFpbiBhbmQgbG9hZCBvcHRpb25zIGJ1dCBvbmx5IGFsbG93ZWQgdG8gZG8gb25lPz9cclxuICAgICAgICAvLyBOZWVkIHRvIGxvYWQgdGhlc2UgXHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcENhY2hlLnN0ZXAub3B0aW9ucztcclxuICAgICAgICBsZXQgb3B0aW9uOiBJT3B0aW9uO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5QYXlsb2FkKFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24udWkudWlJRFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5zaG93QW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5TdGVwUGF5bG9hZChcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnVpLnVpSURcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMuZXhwYW5kT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmU6IChyYXdBcnRpY2xlU2NlbmU6IGFueSk6IElBcnRpY2xlU2NlbmUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QXJ0aWNsZVNjZW5lLmd1aWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IG5ldyBBcnRpY2xlU2NlbmUoKTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUua2V5ID0gcmF3QXJ0aWNsZVNjZW5lLmtleTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUuciA9IHJhd0FydGljbGVTY2VuZS5yO1xyXG4gICAgICAgIGFydGljbGVTY2VuZS5ndWlkID0gcmF3QXJ0aWNsZVNjZW5lLmd1aWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgPSByYXdBcnRpY2xlU2NlbmUuY3JlYXRlZDtcclxuICAgICAgICBhcnRpY2xlU2NlbmUubW9kaWZpZWQgPSByYXdBcnRpY2xlU2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEc107XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEc107XHJcblxyXG4gICAgICAgIHJldHVybiBhcnRpY2xlU2NlbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmVDYWNoZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QXJ0aWNsZVNjZW5lOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lIHwgbnVsbCA9IGdBcnRpY2xlQ29kZS5sb2FkQXJ0aWNsZVNjZW5lKHJhd0FydGljbGVTY2VuZSk7XHJcblxyXG4gICAgICAgIGlmICghYXJ0aWNsZVNjZW5lKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmFydGljbGVTY2VuZSA9IGFydGljbGVTY2VuZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lID0gZ0FydGljbGVDb2RlLmNsb25lKHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lKTtcclxuXHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGRBcnRpY2xlU2NlbmU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FsbGVkIGJ1aWxkQXJ0aWNsZVNjZW5lXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGU/LnJvb3RcclxuICAgICAgICAgICAgfHwgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lID0gbmV3IEFydGljbGVTY2VuZSgpO1xyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICByb290Q2FjaGUsXHJcbiAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lID0gYXJ0aWNsZVNjZW5lO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBTY2VuZTogKFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwsXHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RlcENhY2hlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwQ2FjaGUuYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNhY2hlID0gc3RlcENhY2hlLmFuY2lsbGFyaWVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMucHVzaChhbmNpbGxhcnlDYWNoZS5zdGVwLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZVNjZW5lXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZUNhc3Q6IElTdGVwQ2FjaGUgPSBzdGVwQ2FjaGUgYXMgSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ1N0ZXBDb2RlLmhhc011bHRpcGxlU2ltcGxlT3B0aW9ucyhzdGVwQ2FjaGUuc3RlcC5vcHRpb25zKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcy5wdXNoKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyLnN0ZXAuaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICBhbmNpbGxhcnlDYWNoZUNhc3QuaGVpcixcclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzdGVwQ2FjaGUuaGVpcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGdTdGVwQ29kZS5oYXNNdWx0aXBsZVNpbXBsZU9wdGlvbnMoc3RlcENhY2hlLnN0ZXAub3B0aW9ucykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMucHVzaChzdGVwQ2FjaGUuaGVpci5zdGVwLmlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlLmhlaXIsXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lOiAoc2NlbmU6IElBcnRpY2xlU2NlbmUpOiBJQXJ0aWNsZVNjZW5lID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgQXJ0aWNsZVNjZW5lKCk7XHJcbiAgICAgICAgY2xvbmUua2V5ID0gc2NlbmUua2V5O1xyXG4gICAgICAgIGNsb25lLnIgPSBzY2VuZS5yO1xyXG4gICAgICAgIGNsb25lLmd1aWQgPSBzY2VuZS5ndWlkO1xyXG4gICAgICAgIGNsb25lLmNyZWF0ZWQgPSBzY2VuZS5jcmVhdGVkO1xyXG4gICAgICAgIGNsb25lLm1vZGlmaWVkID0gc2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgY2xvbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMgPSBbLi4uc2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHNdO1xyXG4gICAgICAgIGNsb25lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnNjZW5lLmV4cGFuZGVkT3B0aW9uSURzXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc1NjZW5lQ2hhbmdlZDogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lID0gc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmU7XHJcbiAgICAgICAgY29uc3QgZ2hvc3RBcnRpY2xlU2NlbmUgPSBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lO1xyXG5cclxuICAgICAgICBpZiAoIWFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgJiYgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnaG9zdEFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICB8fCBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGFuZ2VkID1cclxuICAgICAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmNyZWF0ZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmd1aWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmd1aWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmtleSAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUua2V5XHJcbiAgICAgICAgICAgIHx8IGFydGljbGVTY2VuZS5tb2RpZmllZCAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUubW9kaWZpZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLnIgIT09IGdob3N0QXJ0aWNsZVNjZW5lLnJcclxuICAgICAgICAgICAgfHwgIVUuY2hlY2tBcnJheXNFcXVhbChhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMsIGdob3N0QXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzKVxyXG4gICAgICAgICAgICB8fCAhVS5jaGVja0FycmF5c0VxdWFsKGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcywgZ2hvc3RBcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hhbmdlZDtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdBcnRpY2xlQ29kZTtcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcFwiO1xyXG5pbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1N0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgUm9vdENhY2hlIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Sb290Q2FjaGVcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcE9wdGlvbiBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcE9wdGlvblwiO1xyXG5pbXBvcnQgQW5jaWxsYXJ5Q2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdTdGVwQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9nU3RlcEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJSEpzb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvaEpzb24vSUhKc29uXCI7XHJcbmltcG9ydCBnQXJ0aWNsZUNvZGUgZnJvbSBcIi4vZ0FydGljbGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYnVpbGRUaXRsZSA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLnRpdGxlKSA9PT0gZmFsc2VcclxuICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnRleHQpKSB7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4gPSBKU09OLnBhcnNlKHN0ZXAudGV4dCk7XHJcbiAgICBzdGVwLnVpLnRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZE9wdGlvblRpdGxlID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSBmYWxzZVxyXG4gICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAub3B0aW9uSW50cm8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGpzb25FbGVtZW50czogQXJyYXk8SUhKc29uPiA9IEpTT04ucGFyc2Uoc3RlcC5vcHRpb25JbnRybyk7XHJcbiAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwLnVpLnBlZ3MubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UaXRsZSA9IHN0ZXAudWkucGVnc1tzdGVwLnVpLnBlZ3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLm9wdGlvblRpdGxlKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gc3RlcC51aS50aXRsZTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkVGl0bGVGcm9tSnNvbiA9IChqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4pOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmIChqc29uRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBjaGVja0NoaWxkcmVuRm9yVGl0bGUoanNvbkVsZW1lbnRzKTtcclxuXHJcbiAgICByZXR1cm4gdGl0bGU7XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0VsZW1lbnRGb3JUaXRsZSA9IChlbGVtZW50OiBJSEpzb24gfCBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmICghZWxlbWVudCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hlY2tDaGlsZHJlbkZvclRpdGxlKGVsZW1lbnQuY2hpbGRyZW4pO1xyXG59O1xyXG5cclxuY29uc3QgY2hlY2tDaGlsZHJlbkZvclRpdGxlID0gKGNoaWxkcmVuOiBBcnJheTxJSEpzb24gfCBzdHJpbmc+KTogc3RyaW5nID0+IHtcclxuXHJcbiAgICBpZiAoIWNoaWxkcmVuXHJcbiAgICAgICAgfHwgIWNoaWxkcmVuLmxlbmd0aFxyXG4gICAgICAgIHx8IGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGVja0VsZW1lbnRGb3JUaXRsZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBmaW5kUGVncyA9IChcclxuICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgaW5wdXQ6IEFycmF5PGFueT4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBsZXQgZWxlbWVudDogYW55O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudFxyXG4gICAgICAgICAgICAmJiBlbGVtZW50LmNoaWxkcmVuKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IC9eaFsxLTNdJC87XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4udGVzdChlbGVtZW50Lm5hbWUpKSB7IC8vIGlzIGEgaGVhZGVyXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ3MucHVzaChlbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5hdHRyaWJ1dGVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5pZCA9IGdTdGVwQ29kZS5idWlsZFBlZ0lEKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS51aUlELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS5wZWdzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLmNsYXNzID0gJ3BlZyBuYXYnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ0Nyb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5jbGFzcyA9IGAke2VsZW1lbnQuYXR0cmlidXRlcy5jbGFzc30gY3Jvd25gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbmRQZWdzKFxyXG4gICAgICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBsb2FkUGVncyA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShzdGVwLnRleHQpO1xyXG5cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcblxyXG4gICAgICAgICAgICBmaW5kUGVncyhcclxuICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0ZXAudGV4dCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2gge1xyXG4gICAgICAgIC8vIHN3YWxsb3dcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNjYW5UZXh0ID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgY29uc3QgdGV4dDogc3RyaW5nID0gc3RlcC50ZXh0LnRyaW0oKTtcclxuICAgIGNvbnN0IG5vdGU6IHN0cmluZyA9ICdbe1wibmFtZVwiOlwicFwiLFwiYXR0cmlidXRlc1wiOntcImNsYXNzXCI6XCJOT1RFXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKG5vdGUpKSB7XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBub3RlLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHRleHRbbGVuZ3RoXSA9PT0gJywnKSB7XHJcblxyXG4gICAgICAgICAgICBsZW5ndGgrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudGV4dCA9IGBbJHtzdGVwLnRleHQuc3Vic3RyaW5nKGxlbmd0aCl9YDtcclxuICAgICAgICBzdGVwLnVpLm5vdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZW5kOiBzdHJpbmcgPSAnW3tcIm5hbWVcIjpcInBcIixcImF0dHJpYnV0ZXNcIjp7XCJjbGFzc1wiOlwiRU5EXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKGVuZCkpIHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGVuZC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0W2xlbmd0aF0gPT09ICcsJykge1xyXG5cclxuICAgICAgICAgICAgbGVuZ3RoKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGVwLnRleHQgPSBgWyR7c3RlcC50ZXh0LnN1YnN0cmluZyhsZW5ndGgpfWA7XHJcbiAgICAgICAgc3RlcC51aS5lbmQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFBlZ3Moc3RlcCk7XHJcbiAgICBidWlsZFRpdGxlKHN0ZXApO1xyXG4gICAgYnVpbGRPcHRpb25UaXRsZShzdGVwKTtcclxufTtcclxuXHJcbmNvbnN0IGxvYWRTdGVwID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd1N0ZXA6IGFueSxcclxuICAgIHVpSUQ6IG51bWJlcik6IElTdGVwID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwOiBJU3RlcCA9IG5ldyBTdGVwKFxyXG4gICAgICAgIHJhd1N0ZXAuaWQsXHJcbiAgICAgICAgdWlJRCwgLy8gZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgcmF3U3RlcC50b2tlblxyXG4gICAgKTtcclxuXHJcbiAgICBzdGVwLnRleHQgPSByYXdTdGVwLnRleHQ7XHJcbiAgICBzdGVwLm9wdGlvbkludHJvID0gcmF3U3RlcC5vcHRpb25JbnRybztcclxuICAgIHN0ZXAuc3ViVG9rZW4gPSByYXdTdGVwLnN1YlRva2VuO1xyXG4gICAgc3RlcC50eXBlID0gcmF3U3RlcC50eXBlO1xyXG4gICAgc3RlcC5sZWFmID0gcmF3U3RlcC5vcHRpb25zPy5sZW5ndGggPT09IDA7XHJcblxyXG4gICAgcmF3U3RlcC5vcHRpb25zLmZvckVhY2goKHJhd09wdGlvbjogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IGxvYWRPcHRpb24oXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdPcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGVwLm9wdGlvbnMucHVzaChvcHRpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3RlcC5iaW4gPSByYXdTdGVwLmJpbjtcclxuICAgIHNjYW5UZXh0KHN0ZXApO1xyXG5cclxuICAgIHJldHVybiBzdGVwO1xyXG59O1xyXG5cclxuY29uc3QgbG9hZE9wdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXc6IGFueSk6IElPcHRpb24gPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgIHJhdy5pZCxcclxuICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKSxcclxuICAgICAgICByYXcudGV4dFxyXG4gICAgKTtcclxuXHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXcub3JkZXI7XHJcbiAgICBvcHRpb24uYW5jaWxsYXJ5ID0gcmF3LmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuICAgIG9wdGlvbi5iaW4gPSByYXcuYmluO1xyXG5cclxuICAgIHJldHVybiBvcHRpb247XHJcbn07XHJcblxyXG5jb25zdCBnU3RlcENvZGUgPSB7XHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBnQXJ0aWNsZUNvZGUuY2hlY2tJZk9wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgbmVlZCB0byBjaGVjayBpZiB0aGUgY2hhaW5TdGVwQ2FjaGUuc3RlcCBoYXMgYSBzaW5nbGUgb3B0aW9uXHJcbiAgICAgICAgLy8gSWYgaXQgZG9lcyBsb2FkIGl0IGluIHRoZSBiYWNrZ3JvdW5kXHJcbiAgICAgICAgLy8gVGhlbiBuZWVkIHRvIGFkZCBpdCB0byB0aGUgY2hpbGRyZW4gb2YgdGhlIHBhcmVudCBhbmQgc2V0IGl0IHRvIHRoZSBjaGFpbiBvZiB0aGUgcGFyZW50XHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgPSBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5zdGVwO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIHplcm8gLSBubyBjaG9pY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBvciBtb3JlIHRoYW4gb25lIG9wdGlvbiAtIHNvIHRoZSB1c2VyIG11c3QgbWFrZSB0aGUgY2hvaWNlLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBPbmUgb3B0aW9uIHNvIGxvYWQgaXQgYW5kIHNhdmUgdGhlIHVzZXIgYSBidXR0b24gY2xpY2suXHJcbiAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2hhaW5TdGVwQ2FjaGUuY2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZS5zdGVwLnVpLnVpSUQgPSBvcHRpb24udWkudWlJRDtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBgU3RlcC8ke29wdGlvbi5pZH1gO1xyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYXBpVXJsfS8ke3BhdGh9YDtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklEOiBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5jaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRDogb3B0aW9uPy51aS51aUlEXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnlDaGFpblN0ZXAoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnU3RhdGVDb2RlLkFkZFJlTG9hZERhdGFFZmZlY3RJbW1lZGlhdGUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBgTG9hZCBhbmNpbGxhcnk6ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5TdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmNoZWNrSWZPcHRpb25zRXhwYW5kZWQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBjaGFpblN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IG5lZWQgdG8gY2hlY2sgaWYgdGhlIGNoYWluU3RlcENhY2hlLnN0ZXAgaGFzIGEgc2luZ2xlIG9wdGlvblxyXG4gICAgICAgIC8vIElmIGl0IGRvZXMgbG9hZCBpdCBpbiB0aGUgYmFja2dyb3VuZFxyXG4gICAgICAgIC8vIFRoZW4gbmVlZCB0byBhZGQgaXQgdG8gdGhlIGNoaWxkcmVuIG9mIHRoZSBwYXJlbnQgYW5kIHNldCBpdCB0byB0aGUgY2hhaW4gb2YgdGhlIHBhcmVudFxyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gY2hhaW5TdGVwQ2FjaGUuc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9yZSB0aGFuIG9uZSBvcHRpb24gLSBzbyB0aGUgdXNlciBtdXN0IG1ha2UgdGhlIGNob2ljZS5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT25lIG9wdGlvbiBzbyBsb2FkIGl0IGFuZCBzYXZlIHRoZSB1c2VyIGEgYnV0dG9uIGNsaWNrLlxyXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgIHRydWVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkudWlJRCA9IG9wdGlvbi51aS51aUlEO1xyXG4gICAgICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgICAgICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBOZWVkIHRvIGxvYWQgY2hhaW4gXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5sb2FkQ2hhaW4oXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF0aDogc3RyaW5nID0gYFN0ZXAvJHtvcHRpb24uaWR9YDtcclxuICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50Q2hhaW5JRDogY2hhaW5TdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgIHVpSUQ6IG9wdGlvbj8udWkudWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQ2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ1N0YXRlQ29kZS5BZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYExvYWQgY2hhaW46ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkUGVnSUQ6IChcclxuICAgICAgICBzdGVwVWlJRDogbnVtYmVyLFxyXG4gICAgICAgIHBlZ0NvdW50ZXI6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBgcGVnLSR7c3RlcFVpSUR9LSR7cGVnQ291bnRlcn1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBJRDogKHN0ZXBVaUlEOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYHN0ZXAtJHtzdGVwVWlJRH1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZE9wdGlvbkludHJvSUQ6IChzdGVwVWlJRDogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBvcHRpb25zLSR7c3RlcFVpSUR9YDtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGROYXZJRDogKHN0ZXBVaUlEOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYG5hdi0ke3N0ZXBVaUlEfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldElERnJvbU5hdklEOiAobmF2SUQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuYXZJRC5zdWJzdHJpbmcoNCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhc011bHRpcGxlU2ltcGxlT3B0aW9uczogKG9wdGlvbnM6IEFycmF5PElPcHRpb24+KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5hbmNpbGxhcnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICArK29wdGlvbkNvdW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9uQ291bnQgPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZU9wdGlvbnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0czogQXJyYXk8SVN0ZXA+KTogQXJyYXk8SVN0ZXA+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9uczogQXJyYXk8SVN0ZXA+ID0gW107XHJcbiAgICAgICAgbGV0IGlucHV0OiBJU3RlcDtcclxuICAgICAgICBsZXQgb3B0aW9uOiBJU3RlcDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gZ1N0ZXBDb2RlLmNsb25lT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0OiBJU3RlcCxcclxuICAgICAgICBuZXdJRDogc3RyaW5nIHwgbnVsbCA9IG51bGwpOiBJT3B0aW9uID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFuZXdJRCkge1xyXG5cclxuICAgICAgICAgICAgbmV3SUQgPSBpbnB1dC5pZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgICAgICBuZXdJRCxcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgICAgIGlucHV0LnRleHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBvcHRpb24ub3JkZXIgPSBpbnB1dC5vcmRlcjtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0LmJpbikge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uLmJpbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5wdXQuYmluKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcHRpb24uYW5jaWxsYXJ5ID0gKGlucHV0IGFzIElPcHRpb24pLmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVTdGVwQ2FjaGU6IChcclxuICAgICAgICBpbnB1dDogSVN0ZXBDYWNoZSxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgU3RlcENhY2hlKFxyXG4gICAgICAgICAgICBpbnB1dC5zdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lUm9vdENhY2hlOiAoaW5wdXQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKGlucHV0LnN0ZXApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEN1cnJlbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUFuZExvYWRTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdTdGVwOiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdTdGVwXHJcbiAgICAgICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHJhd1N0ZXAuaWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlQW5kTG9hZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QW5jaWxsYXJ5OiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBbmNpbGxhcnlcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QW5jaWxsYXJ5LmlkKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdBbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHVpSURcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkUm9vdDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsKTogSVN0ZXBDYWNoZSB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uoc3RlcElEKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkOiBBcnJheTxJU3RlcENhY2hlPiA9IHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLmZpbHRlcigocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcElEID09PSByZWcuc3RlcC5pZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByb290Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSByZWdpc3RlcmVkLmZpbmQoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZy5wYXJlbnRDaGFpbklEID09PSAnMCc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyb290Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByb290Q2FjaGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBDb2RlLmNsb25lUm9vdENhY2hlKHJlZ2lzdGVyZWRbMF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICByZWdpc3RlckhlaXI6IGJvb2xlYW4gPSBmYWxzZSk6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXBJRCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maWx0ZXIoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0ZXBJRCA9PT0gcmVnLnN0ZXAuaWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZWdpc3RlcmVkLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gcmVnaXN0ZXJlZC5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZWdpc3RlckhlaXJcclxuICAgICAgICAgICAgJiYgc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnRDYWNoZS5cIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5jbG9uZVN0ZXBDYWNoZShcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRbMF0sXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEFuY2lsbGFyeUNoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlckFuY2lsbGFyeUNoaWxkKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50Q2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlclN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICB0cnVlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDaGlsZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgYW5jaWxsYXJ5OiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUucmVnaXN0ZXJBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBhbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5Q2hpbGQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyk6IElTdGVwQ2FjaGUgPT4ge1xyXG5cclxuICAgICAgICBsZXQgcGFyZW50Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcuY2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFwYXJlbnRDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZmluZCBwYXJlbnQgc3RlcFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmVuQ2FjaGUgd2FzIG51bGwuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50QW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBwYXJlbnRDYWNoZSBhcyBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudENhY2hlPy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudENhY2hlPy5jaGlsZHJlbltpXS5zdGVwLmlkID09PSBzdGVwLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQYXJlbnQgaGFzIG1hdGNoaW5nIGNoaWxkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBBbmNpbGxhcnlDYWNoZShcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUuc2V0T3JkZXJGcm9tUGFyZW50KGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChhbmNpbGxhcnlDYWNoZSk7XHJcbiAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGUuaGVpciA9IGFuY2lsbGFyeUNhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IHN0ZXAgYXMgSU9wdGlvbjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXNbaV0uc3RlcC5pZCA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYFBhcmVudCBoYXMgbWF0Y2hpbmcgYW5jaWxsYXJ5YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gbmV3IEFuY2lsbGFyeUNhY2hlKFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoYW5jaWxsYXJ5Q2FjaGUpO1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuICAgICAgICBwYXJlbnRDYWNoZS5hbmNpbGxhcmllcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgcGFyZW50Q2FjaGUuYW5jaWxsYXJpZXMuc29ydCgoYSwgYikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEIDwgYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEID4gYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFuY2lsbGFyeUNhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRPcmRlckZyb21QYXJlbnQ6IChzdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZS5zdGVwXHJcbiAgICAgICAgICAgIHx8ICFzdGVwQ2FjaGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gc3RlcENhY2hlLnN0ZXA7XHJcbiAgICAgICAgY29uc3Qgc3RlcElEOiBzdHJpbmcgPSBzdGVwLmlkO1xyXG5cclxuICAgICAgICBjb25zdCBzeWJsaW5nczogQXJyYXk8SU9wdGlvbj4gPSBzdGVwQ2FjaGUucGFyZW50Py5zdGVwLm9wdGlvbnM7XHJcbiAgICAgICAgbGV0IHN5Ymxpbmc6IElPcHRpb247XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3libGluZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHN5YmxpbmcgPSBzeWJsaW5nc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzeWJsaW5nLmlkID09PSBzdGVwSUQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGVwLm9yZGVyID0gc3libGluZy5vcmRlcjtcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZS5jaGFpbklEID0gYCR7c3RlcENhY2hlLnBhcmVudENoYWluSUR9LiR7c3RlcC5vcmRlcn1gO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAgICAgcmVnaXN0ZXJIZWlyOiBib29sZWFuID0gZmFsc2UpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50Q2FjaGU/LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Q2FjaGU/LmNoaWxkcmVuW2ldLnN0ZXAuaWQgPT09IHN0ZXAuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlBhcmVudCBoYXMgbWF0Y2hpbmcgY2hpbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgIHBhcmVudENhY2hlLmNoaWxkcmVuLnB1c2goc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXBDYWNoZTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0b3BpY1N0YXRlLnRvcGljQ2FjaGUgd2FzIG51bGxcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKHN0ZXApO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLnB1c2gocm9vdENhY2hlKTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gcm9vdENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUNoYWluU3RlcHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1N0ZXBzOiBBcnJheTxhbnk+LFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcik6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcztcclxuXHJcbiAgICAgICAgbGV0IHN0ZXA6IElTdGVwIHwgbnVsbDtcclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDE7XHJcblxyXG4gICAgICAgIC8vIGZpcnN0IHN0ZXAgaXMgdGhlIHJvb3RcclxuICAgICAgICAvLyBlYWNoIG5leHQgc3RlcCBpcyBhIGNoaWxkIG9mIHRoZSBwcmV2aW91cyBzdGVwXHJcblxyXG4gICAgICAgIHJhd1N0ZXBzLmZvckVhY2goKHJhd1N0ZXA6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgc3RlcCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlID0gbmV3IFJvb3RDYWNoZShzdGVwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q2FjaGUuY2hpbGRyZW4ucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlLmhlaXIgPSBzdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJlZC5wdXNoKHN0ZXBDYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZSA9IHN0ZXBDYWNoZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gc3RhdGUudG9waWNTdGF0ZS5kZWVwZXN0U3RlcCA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpczogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZm9yRWFjaCgoc3RlcENhY2NoZTogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpKHN0ZXBDYWNjaGUuc3RlcCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpOiAoc3RlcDogSVN0ZXApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RlcC51aS5leHBhbmRPcHRpb25zID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrU3RlcEZvckV4cGFuZGVkQW5jaWxsYXJ5OiAoc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBDYWNoZS5hbmNpbGxhcmllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUgPSBzdGVwQ2FjaGUuYW5jaWxsYXJpZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQ29kZS5jaGVja1N0ZXBGb3JFeHBhbmRlZEFuY2lsbGFyeShzdGVwQ2FjaGUucGFyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBDb2RlO1xyXG5cclxuIiwiXHJcblxyXG5jb25zdCBnU2Vzc2lvbiA9IHtcclxuXHJcbiAgICBnZXRWaWRlb1N0YXRlOiAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZUpzb246IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd2aWRlb1N0YXRlJyk7XHJcblxyXG4gICAgICAgIGlmICghdmlkZW9TdGF0ZUpzb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aWRlb1N0YXRlSnNvblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRWaWRlb1N0YXRlOiAodmlkZW9TdGF0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgICAgICd2aWRlb1N0YXRlJywgXHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHZpZGVvU3RhdGUpKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJWaWRlb1N0YXRlOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ3ZpZGVvU3RhdGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRm9jdXNcclxuICAgIGdldEZvY3VzRmlsdGVyOiAoKTogc3RyaW5nID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgY29uc3QgZmlsdGVyOiBzdHJpbmcgfCBudWxsID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZm9jdXNGaWx0ZXInKTtcclxuXHJcbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbHRlclxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRGb2N1c0ZpbHRlcjogKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZm9jdXNGaWx0ZXInLCB2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQWxsRm9jdXNGaWx0ZXJzOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2ZvY3VzRmlsdGVyJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUZvY3VzRmlsdGVyOiAoZmlsdGVyOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudEZpbHRlciA9IGdTZXNzaW9uLmdldEZvY3VzRmlsdGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIgPT09IGN1cnJlbnRGaWx0ZXIpIHtcclxuICAgICAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU2Vzc2lvbjsiLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1Nlc3Npb24gZnJvbSBcIi4uL2dTZXNzaW9uXCI7XHJcblxyXG5cclxuY29uc3QgZ0h0bWxBY3Rpb25zID0ge1xyXG5cclxuICAgIGNsZWFyRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0FuZFNjcm9sbFRvVG9wOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlLnRvcGljU3RhdGUuaXNBcnRpY2xlVmlldykge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9Ub3AgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdIdG1sQWN0aW9ucztcclxuIiwiaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpYyBpbXBsZW1lbnRzIElUb3BpYyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICByb290RGtJRDogc3RyaW5nLFxyXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXHJcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nLFxyXG4gICAgICAgIHRva2VuOiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICB0YWdzOiBBcnJheTxzdHJpbmc+LFxyXG4gICAgICAgIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbCxcclxuICAgICAgICBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnJvb3REa0lEID0gcm9vdERrSUQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjcmVhdGVkO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZWQgPSBtb2RpZmllZDtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHJvb3REa0lEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdG9rZW46IHN0cmluZztcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsO1xyXG4gICAgcHVibGljIG1vZGlmaWVkOiBEYXRlIHwgbnVsbDtcclxuICAgIHB1YmxpYyB0YWdzOiBBcnJheTxzdHJpbmc+O1xyXG59XHJcbiIsImltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IElUb3BpY0NhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lUb3BpY0NhY2hlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNDYWNoZSBpbXBsZW1lbnRzIElUb3BpY0NhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0b3BpYzogSVRvcGljKSB7XHJcblxyXG4gICAgICAgIHRoaXMudG9waWMgPSB0b3BpYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9waWM6IElUb3BpYztcclxuICAgIHB1YmxpYyByb290OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IFRvcGljIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Ub3BpY1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljQ2FjaGVcIjtcclxuaW1wb3J0IFRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1RvcGljQ2FjaGVcIjtcclxuaW1wb3J0IGdBcnRpY2xlQ29kZSBmcm9tIFwiLi9nQXJ0aWNsZUNvZGVcIjtcclxuXHJcbmNvbnN0IGdUb3BpY0NvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljQ2FjaGU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1RvcGljOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyB8IG51bGwgPSBnVG9waWNDb2RlLmxvYWRUb3BpYyhyYXdUb3BpYyk7XHJcblxyXG4gICAgICAgIGlmICghdG9waWMpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b3BpYy5pZCA9PT0gc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYy5pZCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdG9waWNDYWNoZTogSVRvcGljQ2FjaGUgPSBuZXcgVG9waWNDYWNoZSh0b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljQ2FjaGUucm9vdCA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuICAgICAgICAgICAgc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlID0gdG9waWNDYWNoZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyVG9waWM6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gbnVsbDtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRUb3BpYzogKHJhd1RvcGljOiBhbnkpOiBJVG9waWMgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdUb3BpY1xyXG4gICAgICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShyYXdUb3BpYy5pZCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyA9IG5ldyBUb3BpYyhcclxuICAgICAgICAgICAgcmF3VG9waWMuaWQsXHJcbiAgICAgICAgICAgIHJhd1RvcGljLnJvb3REa0lELFxyXG4gICAgICAgICAgICByYXdUb3BpYy50aXRsZSxcclxuICAgICAgICAgICAgcmF3VG9waWMudmVyc2lvbixcclxuICAgICAgICAgICAgcmF3VG9waWMudG9rZW4sXHJcbiAgICAgICAgICAgIHJhd1RvcGljLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICByYXdUb3BpYy50YWdzLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5jcmVhdGVkLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5tb2RpZmllZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpYztcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFRvcGljczogKHJhd1RvcGljczogYW55W10pOiBBcnJheTxJVG9waWM+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWNzOiBBcnJheTxJVG9waWM+ID0gW107XHJcblxyXG4gICAgICAgIGlmICghcmF3VG9waWNzXHJcbiAgICAgICAgICAgIHx8IHJhd1RvcGljcy5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9waWM6IElUb3BpYyB8IG51bGw7XHJcblxyXG4gICAgICAgIHJhd1RvcGljcy5mb3JFYWNoKChyYXdUb3BpYzogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0b3BpYyA9IGdUb3BpY0NvZGUubG9hZFRvcGljKHJhd1RvcGljKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xyXG4gICAgICAgICAgICAgICAgdG9waWNzLnB1c2godG9waWMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlOiAodG9waWM6IElUb3BpYyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRvcGljKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBVLmlzTnVsbE9yV2hpdGVTcGFjZSh0b3BpYy50aXRsZSlcclxuICAgICAgICAgICAgPyBcIlwiXHJcbiAgICAgICAgICAgIDogdG9waWMudGl0bGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlRnJvbVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdUb3BpY0NvZGUuZ2V0VGl0bGUoc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtPcHRpb25FeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5vcHRpb25FeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtBbmNpbGxhcnlFeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5hbmNpbGxhcnlFeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzU3RhdGVEaXJ0eTogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdBcnRpY2xlQ29kZS5pc1NjZW5lQ2hhbmdlZChzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IGdTdGVwQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IGdTdGVwRWZmZWN0cyBmcm9tIFwiLi4vZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vY29kZS9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgSUNoYWluU3RlcFBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluU3RlcFBheWxvYWRcIjtcclxuaW1wb3J0IGdIdG1sQWN0aW9ucyBmcm9tIFwiLi9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdUb3BpY0NvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljQ29kZVwiO1xyXG5pbXBvcnQgZ0FydGljbGVDb2RlIGZyb20gXCIuLi9jb2RlL2dBcnRpY2xlQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdTdGVwQWN0aW9ucyA9IHtcclxuXHJcbiAgICBleHBhbmRPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluU3RlcFBheWxvYWQ6IElDaGFpblN0ZXBQYXlsb2FkKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWNoYWluU3RlcFBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya09wdGlvbkV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgZ0h0bWxBY3Rpb25zLmNoZWNrQW5kU2Nyb2xsVG9Ub3Aoc3RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcFBheWxvYWQucGFyZW50Q2hhaW5JRCxcclxuICAgICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGV4cGFuZEFuY2lsbGFyeU9wdGlvbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnQudWkuZXhwYW5kT3B0aW9ucyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGVwQ2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gc3RlcENhY2hlLnBhcmVudCBhcyBJU3RlcENhY2hlO1xyXG4gICAgICAgICAgICBwYXJlbnRBbmNpbGxhcnlDYWNoZS5oZWlyID0gc3RlcENhY2hlIGFzIElTdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0QW5jaWxsYXJ5U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluUGF5bG9hZDogSUNoYWluUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya0FuY2lsbGFyeUV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgLy8gKipBTkNJTExBUlkgTk9URVMqKiBUaGlzIG5lZWRzIHRvIGdldCB0aGUgc3RlcCBmcm9tIHRoZSBjYWNoZSBvciBpZiBub3QgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIEl0IG5lZWRzIHRvIHVzZSB0aGUgcGFyZW50Q2hhaW5JRCBhcyBub3JtYWwgYWZ0ZXIgYWxsIGl0IGlzIGFuIG9wdGlvbiBvZiB0aGUgc3RlcC5cclxuICAgICAgICAvLyBJdCB0aGVuIG5lZWRzIHRvIGFkZCB0aGUgc3RlcGNhY2hlIHRvIHRoZSBwYXJlbnRzU3RlcGNhY2hlIGFuY2lsbGFyaWVzIGxpc3Qgbm90IHRoZSBjaGlsZHJlbiBsaXN0XHJcbiAgICAgICAgLy8gSXQgbmVlZHMgdG8gbWFrZSBzdXJlIGl0IGlzIHJlZ2lzdGVyZWQgYXMgbm9ybWFsXHJcbiAgICAgICAgLy8gQWxzbyBuZWVkIHRvIGJlIHN1cmUgd2hlbiBjbG9uaW5nIGEgc3RlcCBvciByb290IGNhY2hlIHRoYXQgaXQgaXMgYWRkZWQgdG8gdGhlIHJlZ2lzdGVyZWQgY2FjaGUuXHJcbiAgICAgICAgLy8gVGhlIHByb2JsZW0gaGVyZSBpcyB3b3JraW5nIG91dCBob3cgdG8gZHJhdyBpdC4gV2UgYXJlIGRyYXdpbmcgYSBjaGFpbiBzbyBpdCBuZWVkcyB0byBrbm93IHRvIGxvb3AgdW50aWwgZmluaXNoZWQgdGhyb3VnaCB0aGUgZGVzY2VuZGFudHMgYmVmb3JlIG1vdmluZyB0byBwYWludGluZyByZXN0IG9mIHBhcmVudCBzdGVwJ3MgZGlzY3Vzc2lvbi5cclxuICAgICAgICAvLyBBbHNvIGJlYXIgaW4gbWluZCB0aGF0IHdoZXJlIHRoZXJlIGlzIG9ubHkgb25lIG9wdGlvbiBpdCBnZXRzIGF1dG9tYXRpY2FsbHkgcGFpbnRlZCB0b28gd2l0aG91dCBwYWludGluZyBhbnkgb3B0aW9uIGJ1dHRvbnMgLSBpZSBzZWFtbGVzcy5cclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldEFuY2lsbGFyeShcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbGxhcHNlQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFhbmNpbGxhcnlDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpcyhzdGF0ZSk7XHJcbiAgICAgICAgYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50Q2hhaW5JRCA9IHJlc3BvbnNlLnBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgY29uc3QgdWlJRCA9IHJlc3BvbnNlLnVpSUQ7XHJcbiAgICAgICAgY29uc3QganNvbkRhdGEgPSByZXNwb25zZS5yZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgfCBudWxsID0gZ1N0ZXBDb2RlLnBhcnNlQW5kTG9hZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZEFuY2lsbGFyeUNoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmVudENoYWluSUQgPSByZXNwb25zZS5wYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIGNvbnN0IGpzb25EYXRhID0gcmVzcG9uc2UucmVzcG9uc2UuanNvbkRhdGE7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwIHwgbnVsbCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBqc29uRGF0YSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudWlJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRBbmNpbGxhcnlDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpblN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoYWluU3RlcENhY2hlOiBJU3RlcENhY2hlID0gZ1N0ZXBDb2RlLmFkZENoaWxkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZENoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRSYXdSb290U3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFJhd1Jvb3RTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdSb290U3RlcDogYW55KTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd1Jvb3RTdGVwLFxyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUuYWRkUm9vdFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJvb3RDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBBY3Rpb25zO1xyXG4iLCJcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNcIjtcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgSUh0dHBPdXRwdXQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cE91dHB1dFwiO1xyXG5pbXBvcnQgeyBJSHR0cFNlcXVlbnRpYWxGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwU2VxdWVudGlhbEZldGNoSXRlbVwiO1xyXG5cclxuY29uc3Qgc2VxdWVudGlhbEh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgc2VxdWVudGlhbEJsb2NrczogQXJyYXk8SUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jaz4pOiB2b2lkID0+IHtcclxuXHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgd2lsbCBydW4gc2VxdWVudGlhbGx5XHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzIGluIGVhY2ggYmxvY2sgd2lsbCBydW5uIGluIHBhcmFsbGVsXHJcbiAgICBsZXQgYmxvY2s6IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s7XHJcbiAgICBsZXQgc3VjY2VzczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBsZXQgaHR0cENhbGw6IGFueTtcclxuICAgIGxldCBsYXN0SHR0cENhbGw6IGFueTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gc2VxdWVudGlhbEJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICBibG9jayA9IHNlcXVlbnRpYWxCbG9ja3NbaV07XHJcblxyXG4gICAgICAgIGlmIChibG9jayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYmxvY2spKSB7XHJcblxyXG4gICAgICAgICAgICBodHRwQ2FsbCA9IHtcclxuICAgICAgICAgICAgICAgIGRlbGVnYXRlOiBwcm9jZXNzQmxvY2ssXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXHJcbiAgICAgICAgICAgICAgICBibG9jazogYmxvY2ssXHJcbiAgICAgICAgICAgICAgICBpbmRleDogYCR7aX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGh0dHBDYWxsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsZWdhdGU6IHByb2Nlc3NQcm9wcyxcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcclxuICAgICAgICAgICAgICAgIGJsb2NrOiBibG9jayxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBgJHtpfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXN0SHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLm5leHRIdHRwQ2FsbCA9IGxhc3RIdHRwQ2FsbDtcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEluZGV4ID0gbGFzdEh0dHBDYWxsLmluZGV4O1xyXG4gICAgICAgICAgICBodHRwQ2FsbC5uZXh0QmxvY2sgPSBsYXN0SHR0cENhbGwuYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXN0SHR0cENhbGwgPSBodHRwQ2FsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgaHR0cENhbGwuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5ibG9jayxcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5pbmRleFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb2Nlc3NCbG9jayA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBibG9jazogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jayxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgbGV0IHBhcmFsbGVsUHJvcHM6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPiA9IGJsb2NrIGFzIEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPjtcclxuICAgIGNvbnN0IGRlbGVnYXRlczogYW55W10gPSBbXTtcclxuICAgIGxldCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHM7XHJcblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJhbGxlbFByb3BzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgIHByb3BzID0gcGFyYWxsZWxQcm9wc1tqXTtcclxuXHJcbiAgICAgICAgZGVsZWdhdGVzLnB1c2goXHJcbiAgICAgICAgICAgIHByb2Nlc3NQcm9wcyhcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBQcm9taXNlXHJcbiAgICAgICAgICAgIC5hbGwoZGVsZWdhdGVzKVxyXG4gICAgICAgICAgICAudGhlbigpXHJcbiAgICAgICAgICAgIC5jYXRjaCgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgcHJvY2Vzc1Byb3BzID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFwcm9wcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvdXRwdXQ6IElIdHRwT3V0cHV0ID0ge1xyXG4gICAgICAgIG9rOiBmYWxzZSxcclxuICAgICAgICB1cmw6IHByb3BzLnVybCxcclxuICAgICAgICBhdXRoZW50aWNhdGlvbkZhaWw6IGZhbHNlLFxyXG4gICAgICAgIHBhcnNlVHlwZTogXCJ0ZXh0XCIsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0LFxyXG4gICAgICAgIG5leHREZWxlZ2F0ZVxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzXHJcbik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghcHJvcHMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3V0cHV0OiBJSHR0cE91dHB1dCA9IHtcclxuICAgICAgICBvazogZmFsc2UsXHJcbiAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25GYWlsOiBmYWxzZSxcclxuICAgICAgICBwYXJzZVR5cGU6IHByb3BzLnBhcnNlVHlwZSA/PyAnanNvbicsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0XHJcbiAgICApO1xyXG59O1xyXG5cclxuY29uc3QgaHR0cCA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMsXHJcbiAgICBvdXRwdXQ6IElIdHRwT3V0cHV0LFxyXG4gICAgbmV4dERlbGVnYXRlOiBhbnkgPSBudWxsKTogdm9pZCA9PiB7XHJcblxyXG4gICAgZmV0Y2goXHJcbiAgICAgICAgcHJvcHMudXJsLFxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQub2sgPSByZXNwb25zZS5vayA9PT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQudHlwZSA9IHJlc3BvbnNlLnR5cGU7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVkaXJlY3RlZCA9IHJlc3BvbnNlLnJlZGlyZWN0ZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNhbGxJRCA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ2FsbElEXCIpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQuY29udGVudFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgb3V0cHV0LmNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnBhcnNlVHlwZSA9IFwianNvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF1dGhlbnRpY2F0aW9uRmFpbCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlc3BvbnNlTnVsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZTogYW55KSB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5lcnJvciArPSBgRXJyb3IgdGhyb3duIHdpdGggcmVzcG9uc2UudGV4dCgpXHJcbmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dC50ZXh0RGF0YSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRcclxuICAgICAgICAgICAgICAgICYmIG91dHB1dC5wYXJzZVR5cGUgPT09ICdqc29uJ1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5qc29uRGF0YSA9IEpTT04ucGFyc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZXJyb3IgKz0gYEVycm9yIHRocm93biBwYXJzaW5nIHJlc3BvbnNlLnRleHQoKSBhcyBqc29uXHJcbmA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3V0cHV0Lm9rKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHByb3BzLmFjdGlvbixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHREZWxlZ2F0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0RGVsZWdhdGUuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dERlbGVnYXRlLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5ibG9jayxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5pbmRleFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG5cclxuICAgICAgICAgICAgb3V0cHV0LmVycm9yICs9IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBwcm9wcy5lcnJvcixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ0h0dHAgPSAocHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzKTogSUh0dHBGZXRjaEl0ZW0gPT4ge1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgaHR0cEVmZmVjdCxcclxuICAgICAgICBwcm9wc1xyXG4gICAgXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ1NlcXVlbnRpYWxIdHRwID0gKHByb3BzQmxvY2s6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s+KTogSUh0dHBTZXF1ZW50aWFsRmV0Y2hJdGVtID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHNlcXVlbnRpYWxIdHRwRWZmZWN0LFxyXG4gICAgICAgIHByb3BzQmxvY2tcclxuICAgIF1cclxufVxyXG4iLCJcclxuY29uc3QgS2V5cyA9IHtcclxuXHJcbiAgICBzdGFydFVybDogJ3N0YXJ0VXJsJyxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgS2V5cztcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQ29kZSA9IHtcclxuXHJcbiAgICBjbGVhckF1dGhlbnRpY2F0aW9uOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS51c2VyLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRlLnVzZXIuc3ViID0gXCJcIjtcclxuICAgICAgICBzdGF0ZS51c2VyLmxvZ291dFVybCA9IFwiXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25Db2RlO1xyXG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdBamF4SGVhZGVyQ29kZSA9IHtcclxuXHJcbiAgICBidWlsZEhlYWRlcnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNhbGxJRDogc3RyaW5nLFxyXG4gICAgICAgIGFjdGlvbjogQWN0aW9uVHlwZSk6IEhlYWRlcnMgPT4ge1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1gtQ1NSRicsICcxJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1N1YnNjcmlwdGlvbklEJywgc3RhdGUuc2V0dGluZ3Muc3Vic2NyaXB0aW9uSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDYWxsSUQnLCBjYWxsSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdBY3Rpb24nLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnd2l0aENyZWRlbnRpYWxzJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQWpheEhlYWRlckNvZGU7XHJcblxyXG4iLCJpbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcblxyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25BY3Rpb25zXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyA9IHtcclxuXHJcbiAgICBjaGVja1VzZXJBdXRoZW50aWNhdGVkOiAoc3RhdGU6IElTdGF0ZSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNhbGxJRCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5Ob25lXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5iZmZVcmx9LyR7c3RhdGUuc2V0dGluZ3MudXNlclBhdGh9P3NsaWRlPWZhbHNlYDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGFjdGlvbjogZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uLFxyXG4gICAgICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciB0cnlpbmcgdG8gYXV0aGVudGljYXRlIHdpdGggdGhlIHNlcnZlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXJsXCI6ICR7dXJsfSxcclxuICAgICAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RcIjogZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cy5jaGVja1VzZXJBdXRoZW50aWNhdGVkLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6ICR7SlNPTi5zdHJpbmdpZnkoc3RhdGUpfVxyXG4gICAgICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25FZmZlY3RzO1xyXG4iLCJpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IEtleXMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvY29uc3RhbnRzL0tleXNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkNvZGUgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25FZmZlY3RzXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyA9IHtcclxuXHJcbiAgICBsb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVxyXG4gICAgICAgICAgICB8fCByZXNwb25zZS5wYXJzZVR5cGUgIT09IFwianNvblwiXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZS5qc29uRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xhaW1zOiBhbnkgPSByZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZTogYW55ID0gY2xhaW1zLmZpbmQoXHJcbiAgICAgICAgICAgIChjbGFpbTogYW55KSA9PiBjbGFpbS50eXBlID09PSAnbmFtZSdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBzdWI6IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ3N1YidcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIW5hbWVcclxuICAgICAgICAgICAgJiYgIXN1Yikge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9nb3V0VXJsQ2xhaW06IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ2JmZjpsb2dvdXRfdXJsJ1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghbG9nb3V0VXJsQ2xhaW1cclxuICAgICAgICAgICAgfHwgIWxvZ291dFVybENsYWltLnZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSB0cnVlO1xyXG4gICAgICAgIHN0YXRlLnVzZXIubmFtZSA9IG5hbWUudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5zdWIgPSBzdWIudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5sb2dvdXRVcmwgPSBsb2dvdXRVcmxDbGFpbS52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrVXNlckxvZ2dlZEluOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jaGVja1VzZXJMb2dnZWRJblByb3BzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFwcm9wcykge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgY2hlY2tVc2VyTG9nZ2VkSW5Qcm9wczogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLnVzZXIucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnQXV0aGVudGljYXRpb25FZmZlY3RzLmNoZWNrVXNlckF1dGhlbnRpY2F0ZWQoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2dpbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgS2V5cy5zdGFydFVybCxcclxuICAgICAgICAgICAgY3VycmVudFVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYmZmVXJsfS8ke3N0YXRlLnNldHRpbmdzLmRlZmF1bHRMb2dpblBhdGh9P3JldHVyblVybD0vYDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVybCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJBdXRoZW50aWNhdGlvbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcbiAgICAgICAgZ0F1dGhlbnRpY2F0aW9uQ29kZS5jbGVhckF1dGhlbnRpY2F0aW9uKHN0YXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQXV0aGVudGljYXRpb25BbmRTaG93TG9naW46IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBnQXV0aGVudGljYXRpb25Db2RlLmNsZWFyQXV0aGVudGljYXRpb24oc3RhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2dpbihzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvZ291dDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oc3RhdGUudXNlci5sb2dvdXRVcmwpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25BY3Rpb25zO1xyXG4iLCJpbXBvcnQgeyBnSHR0cCB9IGZyb20gXCIuL2dIdHRwXCI7XHJcblxyXG5pbXBvcnQgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc1wiO1xyXG5pbXBvcnQgSUh0dHBQcm9wcyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwUHJvcHNcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQWN0aW9uc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnQXV0aGVudGljYXRlZEh0dHAocHJvcHM6IElIdHRwUHJvcHMpOiBhbnkge1xyXG5cclxuICAgIGNvbnN0IGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBwcm9wcyBhcyBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcztcclxuXHJcbiAgICAvLyAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb25cclxuICAgIC8vIGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbiA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2xlYXJBdXRoZW50aWNhdGlvbjtcclxuXHJcbiAgICAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb24gYW5kIHNob3cgbG9naW4gcGFnZVxyXG4gICAgaHR0cEF1dGhlbnRpY2F0ZWRQcm9wZXJ0aWVzLm9uQXV0aGVudGljYXRpb25GYWlsQWN0aW9uID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jbGVhckF1dGhlbnRpY2F0aW9uQW5kU2hvd0xvZ2luO1xyXG5cclxuICAgIHJldHVybiBnSHR0cChodHRwQXV0aGVudGljYXRlZFByb3BlcnRpZXMpO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ1N0ZXBBY3Rpb25zXCI7XHJcbi8vIGltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuLi9odHRwL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdldFN0ZXAgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICBfcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgYWN0aW9uOiBBY3Rpb25UeXBlLFxyXG4gICAgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IGBTdGVwLyR7c3RlcElEfWA7XHJcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgIGFjdGlvbjogbG9hZEFjdGlvbixcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgZ2V0dGluZyBzdGVwIGRhdGEgZnJvbSB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dldFN0ZXAubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnU3RlcEVmZmVjdHMgPSB7XHJcblxyXG4gICAgZ2V0Um9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJvb3RJRDogc3RyaW5nKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcm9vdElELFxyXG4gICAgICAgICAgICAnMCcsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0Um9vdCxcclxuICAgICAgICAgICAgZ1N0ZXBBY3Rpb25zLmxvYWRSb290U3RlcFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkU3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcElELFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEFuY2lsbGFyeVN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5Q2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RlcEVmZmVjdHM7XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnVG9waWNDb2RlIGZyb20gXCIuL2dUb3BpY0NvZGVcIjtcclxuXHJcblxyXG4vLyBUaGlzIGlzIHdoZXJlIGFsbCBhbGVydHMgdG8gZGF0YSBjaGFuZ2VzIHNob3VsZCBiZSBtYWRlXHJcbmNvbnN0IGdUb3BpY3NTdGF0ZUNvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS50b3BpY3MgPSBnVG9waWNDb2RlLmxvYWRUb3BpY3MocmVzcG9uc2UudmFsdWVzKTtcclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscy50b3RhbEl0ZW1zID0gcmVzcG9uc2UudG90YWw7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHJlc3BvbnNlLnRvdGFsID8/IDA7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQgPCAwID8gMCA6IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQ7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1RvcGljc1N0YXRlQ29kZTtcclxuXHJcbiIsImltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdUb3BpY3NTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljc1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgZ0ZpbHRlckVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZpbHRlckVmZmVjdHNcIjtcclxuXHJcblxyXG5jb25zdCBnVG9waWNzQ29yZUFjdGlvbnMgPSB7XHJcblxyXG4gICAgbG9hZFZpZXdPckJ1aWxkRnJlc2g6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdUb3BpY3NTdGF0ZUNvZGUubG9hZFRvcGljcyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljczogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuVG9waWNzO1xyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5wdXNoQnJvd3Nlckhpc3RvcnlTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5hdXRvRmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNzQ29yZUFjdGlvbnM7XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1RvcGljc0NvcmVBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dUb3BpY3NDb3JlQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYXV0b0ZpbHRlciA9IChzdGF0ZTogSVN0YXRlKTogYW55ID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcbiAgICBjb25zdCBhY3Rpb246IEFjdGlvblR5cGUgPSBBY3Rpb25UeXBlLkZpbHRlclRvcGljcztcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIGFjdGlvblxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBib2R5OiBhbnkgPSB7XHJcbiAgICAgICAgc3RhcnQ6IHN0YXRlLnRvcGljc1N0YXRlLnBhZ2luYXRpb25EZXRhaWxzLnN0YXJ0LFxyXG4gICAgICAgIGJhdGNoU2l6ZTogc3RhdGUudG9waWNzU3RhdGUucGFnaW5hdGlvbkRldGFpbHMuY291bnQsXHJcbiAgICAgICAgZnJhZ21lbnQ6IHN0YXRlLnNlYXJjaFN0YXRlLnRleHQsXHJcbiAgICAgICAgY2FsbElEOiBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uOiBhY3Rpb25cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYm9keUpzb246IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5hcGlVcmx9L0ZpbHRlci9Ub3BpY3NgO1xyXG5cclxuICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogYm9keUpzb25cclxuICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGdUb3BpY3NDb3JlQWN0aW9ucy5sb2FkVmlld09yQnVpbGRGcmVzaCxcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3Igc2VuZGluZyB0b3BpY3MgYXV0byBmaWx0ZXIgZGF0YSB0byB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2F1dG9GaWx0ZXIubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9LFxyXG4gICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHN0YXRlKX1cclxuICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmNvbnN0IGdGaWx0ZXJFZmZlY3RzID0ge1xyXG5cclxuICAgIGZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGlmIChzdGF0ZS5sZW5zLmZpbHRlclRhYi5hZHZhbmNlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGdGaWx0ZXJFZmZlY3RzLmFkdmFuY2VkRmlsdGVyKHN0YXRlKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXV0b0ZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGaWx0ZXJFZmZlY3RzO1xyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG5pbXBvcnQgZ1N0ZXBFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IElQYWdpbmF0aW9uUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JUGFnaW5hdGlvblBheWxvYWRcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGaWx0ZXJFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0c1wiO1xyXG5pbXBvcnQgVG9waWNDYWNoZSBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvdG9waWMvVG9waWNDYWNoZVwiO1xyXG5pbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgZ0h0bWxBY3Rpb25zIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNBY3Rpb25zID0ge1xyXG5cclxuICAgIHNldFNlYXJjaEZvY3VzOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUuc2VhcmNoU3RhdGUudWkuaGFzRm9jdXMgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlU2VhcmNoRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5zZWFyY2hTdGF0ZS51aS5oYXNGb2N1cyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljc1BhZ2U6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhZ2luYXRpb25QYXlsb2FkOiBJUGFnaW5hdGlvblBheWxvYWQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBhZ2luYXRpb25QYXlsb2FkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscyA9IHBhZ2luYXRpb25QYXlsb2FkLnBhZ2luYXRpb25EZXRhaWxzO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5maWx0ZXIoc3RhdGUpXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0U2VhcmNoVGV4dDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIWVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50ID0gZWxlbWVudCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgICAgIHN0YXRlLnNlYXJjaFN0YXRlLnRleHQgPSBgJHt0ZXh0YXJlYS52YWx1ZX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VhcmNoOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKSxcclxuICAgICAgICAgICAgZ0ZpbHRlckVmZmVjdHMuZmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrRm9yRW50ZXJLZXlQcmVzczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAga2V5RXZlbnQ6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGtleUV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcblxyXG4gICAgICAgICAgICBrZXlFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRvcGljQWN0aW9ucy5zZWFyY2goc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93VG9waWM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHRvcGljOiBJVG9waWMpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLkFydGljbGU7XHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5oaWRlQmFubmVyID0gdHJ1ZTtcclxuICAgICAgICBnSHRtbEFjdGlvbnMuY2hlY2tBbmRTY3JvbGxUb1RvcChzdGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFJvb3QoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUudG9waWMucm9vdERrSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAocm9vdENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldFJvb3RTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICB0b3BpYy5yb290RGtJRFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvcGljQWN0aW9ucztcclxuIiwiaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmRcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IHRvcGljQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy90b3BpY0FjdGlvbnNcIjtcclxuXHJcblxyXG5jb25zdCB0b3BpY1N1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSk6IGFueVtdID0+IHtcclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGlmIChzdGF0ZS5kaXNwbGF5VHlwZSA9PT0gRGlzcGxheVR5cGUuVG9waWNzKSB7XHJcblxyXG4gICAgICAgIHN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICAgICAgS2V5Ym9hcmQoe1xyXG4gICAgICAgICAgICAgICAgZG93bnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1cHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJlc3NlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IHRvcGljQWN0aW9ucy5jaGVja0ZvckVudGVyS2V5UHJlc3NcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdWJzY3JpcHRpb25zO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY1N1YnNjcmlwdGlvbnM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgdG9waWNTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L3N1YnNjcmlwdGlvbnMvdG9waWNTdWJzY3JpcHRpb25zXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHZpZXc6IGFueVtdID0gW1xyXG5cclxuICAgICAgICAuLi50b3BpY1N1YnNjcmlwdGlvbnMoc3RhdGUpXHJcbiAgICBdO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY3NDb3JlU3Vic2NyaXB0aW9ucztcclxuXHJcbiIsInZhciB0aW1lRnggPSBmdW5jdGlvbiAoZng6IGFueSkge1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoXHJcbiAgICAgICAgYWN0aW9uOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmeCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBkZWxheTogcHJvcHMuZGVsYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHZhciB0aW1lb3V0ID0gdGltZUZ4KFxyXG5cclxuICAgIGZ1bmN0aW9uIChcclxuICAgICAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgICAgIHByb3BzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb3BzLmRlbGF5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmV4cG9ydCB2YXIgaW50ZXJ2YWwgPSB0aW1lRngoXHJcblxyXG4gICAgZnVuY3Rpb24gKFxyXG4gICAgICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICB2YXIgaWQgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvcHMuZGVsYXlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuKTtcclxuXHJcblxyXG4vLyBleHBvcnQgdmFyIG5vd1xyXG4vLyBleHBvcnQgdmFyIHJldHJ5XHJcbi8vIGV4cG9ydCB2YXIgZGVib3VuY2VcclxuLy8gZXhwb3J0IHZhciB0aHJvdHRsZVxyXG4vLyBleHBvcnQgdmFyIGlkbGVDYWxsYmFjaz9cclxuIiwiXHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJQWN0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lBY3Rpb25cIjtcclxuXHJcbmNvbnN0IHJ1bkFjdGlvbklubmVyID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICBkaXNwYXRjaChcclxuICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IHJ1bkFjdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBxdWV1ZWRFZmZlY3RzOiBBcnJheTxJQWN0aW9uPlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGFjdGlvbjogSUFjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgIGVycm9yOiAoX3N0YXRlOiBJU3RhdGUsIF9lcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcnVubmluZyBhY3Rpb24gaW4gcmVwZWF0QWN0aW9uc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBlZmZlY3RzLnB1c2goW1xyXG4gICAgICAgICAgICBydW5BY3Rpb25Jbm5lcixcclxuICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICBdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IHNlbmRSZXF1ZXN0ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHF1ZXVlZEVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0PlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGdldEVmZmVjdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGh0dHBFZmZlY3QsXHJcbiAgICAgICAgICAgIGVmZmVjdHMsXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IGdldEVmZmVjdCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBodHRwRWZmZWN0OiBJSHR0cEVmZmVjdCxcclxuICAgIGVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0Pik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gaHR0cEVmZmVjdC51cmw7XHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXBcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0ID0gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGh0dHBFZmZlY3QuYWN0aW9uRGVsZWdhdGUsXHJcbiAgICAgICAgZXJyb3I6IChfc3RhdGU6IElTdGF0ZSwgX2Vycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHBvc3RpbmcgZ1JlcGVhdEFjdGlvbnMgZGF0YSB0byB0aGUgc2VydmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGVmZmVjdHMucHVzaChlZmZlY3QpO1xyXG59O1xyXG5cclxuY29uc3QgZ1JlcGVhdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgLy8gaHR0cFNpbGVudFJlTG9hZDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHAubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAvLyAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHA7XHJcbiAgICAvLyAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwID0gW107XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgaHR0cFNpbGVudFJlTG9hZEltbWVkaWF0ZTogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwSW1tZWRpYXRlID0gW107XHJcblxyXG4gICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBNdXN0IHJldHVybiBhbHRlcmVkIHN0YXRlIGZvciB0aGUgc3Vic2NyaXB0aW9uIG5vdCB0byBnZXQgcmVtb3ZlZFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gc3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBydW5BY3Rpb25JbW1lZGlhdGU6IEFycmF5PElBY3Rpb24+ID0gc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGUgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bkFjdGlvbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJ1bkFjdGlvbkltbWVkaWF0ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnUmVwZWF0QWN0aW9ucztcclxuXHJcbiIsImltcG9ydCB7IGludGVydmFsIH0gZnJvbSBcIi4uLy4uL2h5cGVyQXBwL3RpbWVcIjtcclxuXHJcbmltcG9ydCBnUmVwZWF0QWN0aW9ucyBmcm9tIFwiLi4vZ2xvYmFsL2FjdGlvbnMvZ1JlcGVhdEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuXHJcblxyXG5jb25zdCByZXBlYXRTdWJzY3JpcHRpb25zID0ge1xyXG5cclxuICAgIGJ1aWxkUmVwZWF0U3Vic2NyaXB0aW9uczogKHN0YXRlOiBJU3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgYnVpbGRSZUxvYWREYXRhID0gKCk6IGFueSA9PiB7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuaHR0cFNpbGVudFJlTG9hZCxcclxuICAgICAgICAvLyAgICAgICAgICAgICB7IGRlbGF5OiAxMDAgfVxyXG4gICAgICAgIC8vICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cEltbWVkaWF0ZS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVydmFsKFxyXG4gICAgICAgICAgICAgICAgICAgIGdSZXBlYXRBY3Rpb25zLmh0dHBTaWxlbnRSZUxvYWRJbW1lZGlhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgeyBkZWxheTogMTAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUnVuQWN0aW9uc0ltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVsYXk6IDEwIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZXBlYXRTdWJzY3JpcHRpb246IGFueVtdID0gW1xyXG5cclxuICAgICAgICAgICAgLy8gYnVpbGRSZUxvYWREYXRhKCksXHJcbiAgICAgICAgICAgIGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSgpLFxyXG4gICAgICAgICAgICBidWlsZFJ1bkFjdGlvbnNJbW1lZGlhdGUoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJldHVybiByZXBlYXRTdWJzY3JpcHRpb247XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZXBlYXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiLy8gaW1wb3J0IHsgSGlzdG9yeVBvcCB9IGZyb20gXCJoeXBlcmFwcC1meC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IHRvcGljc0NvcmVTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi9jb3JlL3RvcGljc0NvcmUvc3Vic2NyaXB0aW9ucy90b3BpY3NDb3JlU3Vic2NyaXB0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgcmVwZWF0U3Vic2NyaXB0aW9ucyBmcm9tIFwiLi4vLi4vLi4vc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb25cIjtcclxuXHJcblxyXG5jb25zdCBpbml0U3Vic2NyaXB0aW9ucyA9IChzdGF0ZTogSVN0YXRlKSA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtcclxuXHJcbiAgICAgICAgLi4udG9waWNzQ29yZVN1YnNjcmlwdGlvbnMoc3RhdGUpLFxyXG4gICAgICAgIC4uLnJlcGVhdFN1YnNjcmlwdGlvbnMuYnVpbGRSZXBlYXRTdWJzY3JpcHRpb25zKHN0YXRlKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiXHJcbmNvbnN0IEZpbHRlcnMgPSB7XHJcblxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50OiBcIiN0cmVlU29sdmVBc3Npc3RhbnRcIixcclxuICAgIHRyZWVTb2x2ZUd1aWRlSUQ6IFwidHJlZVNvbHZlR3VpZGVcIixcclxuICAgIHRyZWVTb2x2ZUZyYWdtZW50c0lEOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiLFxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50QmFubmVyOiBcInRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lclwiLFxyXG4gICAgc3RlcFZpZXc6IFwiI3N0ZXBWaWV3XCIsXHJcbiAgICBzdGVwSW5mbzogXCIjc3RlcEluZm9cIixcclxuICAgIHN0ZXBOb2RlczogXCIjc3RlcE5vZGVzXCIsXHJcbiAgICBzdGVwQm90dG9tTmF2OiBcIiNzdGVwQm90dG9tTmF2XCIsXHJcbiAgICBzdGVwU2hvd0ZpbHRlcjogJyNzdGVwQm94U2Nyb2xsU2hvdycsXHJcbiAgICB0b3BpY1Nob3dGaWx0ZXI6ICcjdG9waWNzVmlldyAudG9waWMtcm93LnNjcm9sbC1zaG93JyxcclxuICAgIHRvcGljU2hvd0NsYXNzOiAnc2Nyb2xsLXNob3cnLFxyXG4gICAgbWVudUZvY3VzRmlsdGVyOiAnaGVhZGVyIC5tZW51LWJveCcsXHJcbiAgICBzb2x1dGlvbnNNZW51Rm9jdXNGaWx0ZXI6ICdoZWFkZXIgLnNvbHV0aW9uLW1lbnUnLFxyXG4gICAgZm9sZGVkRm9jdXNGaWx0ZXI6ICcjc3RlcFZpZXcgI2ZvbGRlZENvbnRyb2wnLFxyXG4gICAgbmF2RWxlbWVudHM6ICcjc3RlcFZpZXcgLmRpc2N1c3Npb24gLm5hdicsXHJcbiAgICBzdGVwTm9kZUVsZW1lbnRzOiAnI3N0ZXBOb2RlcyAuc3RlcC1ib3gnLFxyXG4gICAgc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnQ6ICcjc3RlcE5vZGVzIC5zdGVwLWJveC5zZWxlY3RlZCcsXHJcbiAgICB1cE5hdkVsZW1lbnQ6ICcjc3RlcE5hdiAuY2hhaW4tdXB3YXJkcycsXHJcbiAgICBkb3duTmF2RWxlbWVudDogJyNzdGVwTmF2IC5jaGFpbi1kb3dud2FyZHMnLFxyXG5cclxuICAgIGZyYWdtZW50Qm94OiAnI3RyZWVTb2x2ZUZyYWdtZW50cyAubnQtZnItZnJhZ21lbnQtYm94JyxcclxuICAgIGZyYWdtZW50Qm94RGlzY3Vzc2lvbjogJyN0cmVlU29sdmVGcmFnbWVudHMgLm50LWZyLWZyYWdtZW50LWJveCAubnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbidcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsdGVycztcclxuIiwiXHJcbmV4cG9ydCBlbnVtIFNjcm9sbEhvcFR5cGUge1xyXG4gICAgTm9uZSA9IFwibm9uZVwiLFxyXG4gICAgVXAgPSBcInVwXCIsXHJcbiAgICBEb3duID0gXCJkb3duXCJcclxufVxyXG4iLCJpbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IFNjcm9sbEhvcFR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IHNjcm9sbFN0ZXAgPSB7XHJcblxyXG4gICAgc2Nyb2xsVXA6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZFN0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke0ZpbHRlcnMuc3RlcE5vZGVFbGVtZW50c31gKSBhcyBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c1N0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFydGljbGVTdGVwSUQ6IHN0cmluZyA9IGdTdGVwQ29kZS5nZXRJREZyb21OYXZJRChwcmV2aW91c1N0ZXBFbGVtZW50LmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxTdGVwLnNjcm9sbFRvVG9FbGVtZW50KGFydGljbGVTdGVwSUQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzY3JvbGxEb3duOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke0ZpbHRlcnMuc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnR9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdGVwRWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLnN0ZXBOb2RlRWxlbWVudHN9YCkgYXMgTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RlcEVsZW1lbnRzW2ldLmlkID09PSBzZWxlY3RlZFN0ZXBFbGVtZW50LmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAoc3RlcEVsZW1lbnRzLmxlbmd0aCAtIDEpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXh0U3RlcEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJ0aWNsZVN0ZXBJRDogc3RyaW5nID0gZ1N0ZXBDb2RlLmdldElERnJvbU5hdklEKG5leHRTdGVwRWxlbWVudC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxUb1RvRWxlbWVudChhcnRpY2xlU3RlcElEKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gc2Nyb2xsVG9Ub3A6ICgpID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvVG9wKSB7XHJcblxyXG4gICAgLy8gICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxUb1RvcCA9IGZhbHNlO1xyXG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICBzY3JvbGxUb1RvRWxlbWVudDogKGVsZW1lbnRJRDogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudElEfWApO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gZG9jRWwuc2Nyb2xsVG9wIHx8IGJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICBjb25zdCBjbGllbnRUb3AgPSBkb2NFbC5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0b3BPZmZzZXQ6IG51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyA0KSAtIDEwO1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wIC0gdG9wT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiB0b3AsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNjcm9sbDogKCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50KSA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHNjcm9sbFN0ZXAuc2Nyb2xsVG9Ub0VsZW1lbnQod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50IGFzIHN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbEhvcCA9PT0gU2Nyb2xsSG9wVHlwZS5VcCkge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxVcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxIb3AgPT09IFNjcm9sbEhvcFR5cGUuRG93bikge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxEb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsU3RlcDsiLCJpbXBvcnQgRmlsdGVycyBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnNcIjtcclxuXHJcblxyXG5jb25zdCBzZWxlY3RlZENsYXNzOiBzdHJpbmcgPSAnc2VsZWN0ZWQnO1xyXG5jb25zdCBkaXNhYmxlZENsYXNzOiBzdHJpbmcgPSAnZGlzYWJsZWQnO1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckRpbWVuc2lvbnMgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3Qgc3RlcEluZm9FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwSW5mb31gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXN0ZXBJbmZvRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwSW5mb1JlY3RhbmdsZSA9IHN0ZXBJbmZvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIGNvbnN0IGJvdHRvbUdhcDogbnVtYmVyID0gMjA7XHJcblxyXG4gICAgY29uc3QgZm9vdGVyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGZvb3RlcmApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmIChmb290ZXJFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvb3RlclJlY3RhbmdsZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZm9vdGVyVG9wID0gZm9vdGVyUmVjdGFuZ2xlLnRvcDtcclxuICAgICAgICBjb25zdCBmb290ZXJWaXNpYmxlID0gd2luZG93SGVpZ2h0IC0gZm9vdGVyVG9wO1xyXG5cclxuICAgICAgICBpZiAoZm9vdGVyVmlzaWJsZSA8PSBib3R0b21HYXApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RlcEluZm9FbGVtZW50LnN0eWxlLmJvdHRvbSA9IGAke2Zvb3RlclZpc2libGUgKyBib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0ZXBCb3R0b21OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwQm90dG9tTmF2fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RlcEluZm9SZWN0YW5nbGUgPSBzdGVwSW5mb0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5ib3R0b20gLSBzdGVwSW5mb1JlY3RhbmdsZS50b3A7XHJcbiAgICBjb25zdCBzdGVwTm9kZXNSZWN0YW5nbGUgPSBzdGVwTm9kZXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc3RlcE5vZGVzVG9wR2FwID0gc3RlcE5vZGVzUmVjdGFuZ2xlLnRvcCAtIHN0ZXBJbmZvUmVjdGFuZ2xlLnRvcDtcclxuICAgIGxldCBzdGVwTm9kZXNIZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgLSBzdGVwTm9kZXNUb3BHYXA7XHJcblxyXG4gICAgaWYgKHN0ZXBCb3R0b21OYXZFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPiA4MDApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBCb3R0b21OYXZFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcInVuc2V0XCI7XHJcbiAgICAgICAgICAgIHN0ZXBOb2Rlc0hlaWdodCAtPSAxNTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdGVwQm90dG9tTmF2RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7c3RlcE5vZGVzSGVpZ2h0fXB4YDtcclxufTtcclxuXHJcbmNvbnN0IHNldFNjcm9sbERvd25TaWRlQmFyQXR0ZW50aW9uID0gKG5hdkVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PikgPT4ge1xyXG4gICAgLy8gc2Nyb2xsaW5nIHRvd2FyZHMgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG5cclxuICAgIGxldCBuYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBuYXZFbGVtZW50Qm94OiBET01SZWN0O1xyXG4gICAgbGV0IHRvcE9mZnNldDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0IC8gNDtcclxuICAgIGxldCBhdHRlbnRpb246IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBjb25zdCBuZXN0ZWQ6IEFycmF5PEhUTUxEaXZFbGVtZW50PiA9IFtdO1xyXG4gICAgbGV0IHBlZ0Nyb3duSUQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgbmF2RWxlbWVudCA9IG5hdkVsZW1lbnRzW2ldO1xyXG5cclxuICAgICAgICBpZiAobmF2RWxlbWVudC5pZCA9PT0gcGVnQ3Jvd25JRCkge1xyXG5cclxuICAgICAgICAgICAgcGVnQ3Jvd25JRCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuYXZFbGVtZW50Qm94ID0gbmF2RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgaWYgKG5hdkVsZW1lbnRCb3gudG9wID4gdG9wT2Zmc2V0KSB7XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuYXZFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYW5jaWxsYXJ5JykgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgLy8gSXQgaXMgYW4gYW5jaWxsYXJ5IC0gaXMgaXRzIGVuZCBoYW5naW5nIG92ZXIgdGhlIHRvcE9mZnNldD8gaWUgaXMgaXQgc3RpbGwgdmlzaWJsZVxyXG5cclxuICAgICAgICAgICAgaWYgKChuYXZFbGVtZW50Qm94LnRvcCArIG5hdkVsZW1lbnRCb3guaGVpZ2h0KSA+IHRvcE9mZnNldCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG5lc3RlZC5wdXNoKG5hdkVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgYXR0ZW50aW9uID0gbmF2RWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGlkID0gbmF2RWxlbWVudC5pZDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnc3RlcC0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgYW5jaWxsYXJ5IGNyb3duc1xyXG4gICAgICAgICAgICAgICAgcGVnQ3Jvd25JRCA9IGBwZWctJHtpZC5zdWJzdHJpbmcoNSl9LTFgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF0dGVudGlvbiA9IG5hdkVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhdHRlbnRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcE5hdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjbmF2LSR7YXR0ZW50aW9uLmlkfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc3RlcE5hdikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkTmF2cygpO1xyXG4gICAgc3RlcE5hdi5jbGFzc0xpc3QuYWRkKHNlbGVjdGVkQ2xhc3MpO1xyXG59O1xyXG5cclxuY29uc3QgY2xlYXJTZWxlY3RlZE5hdnMgPSAoKTogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZUVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghc3RlcE5vZGVFbGVtZW50cykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwTm9kZUVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RlcE5vZGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICBzdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW2pdO1xyXG5cclxuICAgICAgICBpZiAoc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3RlZENsYXNzKSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGVwTm9kZUVsZW1lbnRzO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICBjb25zdCB1cE5hdkVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnVwTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGRvd25OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5kb3duTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXVwTmF2RWxlbWVudFxyXG4gICAgICAgIHx8ICFkb3duTmF2RWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXNlbGVjdGVkU3RlcEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcEVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHVwTmF2RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXBOYXZFbGVtZW50LmNsYXNzTGlzdC5hZGQoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpIDwgKHN0ZXBFbGVtZW50cy5sZW5ndGggLSAxKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRvd25OYXZFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb3duTmF2RWxlbWVudC5jbGFzc0xpc3QuYWRkKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckF0dGVudGlvbiA9ICgpID0+IHtcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4ubGFzdFNjcm9sbFkgPSBzY3JvbGxUb3A7XHJcblxyXG4gICAgY29uc3QgbmF2RWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLm5hdkVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghbmF2RWxlbWVudHNcclxuICAgICAgICB8fCBuYXZFbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9zID0gd2luZG93LmlubmVySGVpZ2h0ICsgTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSkgKyAxMDA7XHJcblxyXG4gICAgaWYgKHBvcyA+PSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCkge1xyXG4gICAgICAgIC8vIEF0IHRoZSBib3R0b20gb2YgdGhlIHBhZ2VcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcE5vZGVFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0gY2xlYXJTZWxlY3RlZE5hdnMoKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwTm9kZUVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxhc3RTdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW3N0ZXBOb2RlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGlmIChsYXN0U3RlcE5vZGVFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsYXN0U3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2Nyb2xsRG93blNpZGVCYXJBdHRlbnRpb24obmF2RWxlbWVudHMpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhciA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRTaWRlQmFyRGltZW5zaW9ucygpO1xyXG4gICAgc2V0U2lkZUJhckF0dGVudGlvbigpO1xyXG4gICAgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlKCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXRTaWRlQmFyOyIsImltcG9ydCBnU2Vzc2lvbiBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2dTZXNzaW9uXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgc2Nyb2xsU3RlcCBmcm9tIFwiLi9zY3JvbGxTdGVwXCI7XHJcbmltcG9ydCBzZXRTaWRlQmFyIGZyb20gXCIuL3NldFNpZGVCYXJcIjtcclxuXHJcblxyXG5jb25zdCBoaWRlQmFubmVyID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpeGVkQmFubmVyID0gYF9fJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgY29uc3QgYmFubmVyRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtmaXhlZEJhbm5lcn1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lcikgeyAvLyBNdXN0IGhpZGUgYmFubmVyXHJcblxyXG4gICAgICAgIGlmIChiYW5uZXJFbGVtZW50KSB7IC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgICAgIHJldHVybjsgLy8gTm8gbmVlZCB0byBjaGFuZ2UgYW55dGhpbmdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBub3QgY3VycmVudGx5IGhpZGRlbiAtIHNvIGhpZGUgaXRcclxuICAgICAgICBjb25zdCBkaXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke0ZpbHRlcnMudHJlZVNvbHZlQXNzaXN0YW50QmFubmVyfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoZGl2RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBiYW5uZXJcclxuICAgICAgICAgICAgZGl2RWxlbWVudC5pZCA9IGZpeGVkQmFubmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBNdXN0IHNob3cgYmFubmVyXHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgaWYgKGJhbm5lckVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEhpZGUgYmFubmVyXHJcbiAgICAgICAgICAgIGJhbm5lckVsZW1lbnQuaWQgPSBgJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNldEZvY3VzID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpbHRlcjogc3RyaW5nID0gZ1Nlc3Npb24uZ2V0Rm9jdXNGaWx0ZXIoKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhgZmlsdGVyOiAke2ZpbHRlcn1gKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihmaWx0ZXIpIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGlmIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYGZvY3VzZWQgb246ICR7ZWxlbWVudH1gKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRGb2N1cygpO1xyXG4gICAgaGlkZUJhbm5lcigpO1xyXG4gICAgc2Nyb2xsU3RlcC5zY3JvbGwoKTtcclxuICAgIHNldFNpZGVCYXIoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZDsiLCJpbXBvcnQgc3RlcERpc3BsYXlPblJlbmRlckZpbmlzaGVkIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3N0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZFwiO1xyXG5cclxuXHJcbmNvbnN0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZDtcclxuXHJcbiIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuY29uc3Qgc2hvd1NlbGVjdGVkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnNlbGVjdGVkU3RlcE5vZGVFbGVtZW50fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnRSZWN0YW5nbGUgPSBzZWxlY3RlZFN0ZXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRUb3AgPSBzZWxlY3RlZFN0ZXBFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHNlbGVjdGVkQm90dG9tID0gc2VsZWN0ZWRTdGVwRWxlbWVudFJlY3RhbmdsZS5ib3R0b207XHJcblxyXG4gICAgY29uc3Qgc3RlcE5vZGVzRWxlbWVudFJlY3RhbmdsZSA9IHN0ZXBOb2Rlc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBzdGVwTm9kZXNFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHBhcmVudEJvdHRvbSA9IHN0ZXBOb2Rlc0VsZW1lbnRSZWN0YW5nbGUuYm90dG9tO1xyXG5cclxuICAgIGNvbnN0IG9mZnNldFRvcCA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wO1xyXG4gICAgY29uc3QgYnVmZmVyID0gNTA7XHJcblxyXG4gICAgLy8gVGhzZXMgc2hvdWxkIGFsbCBiZSByZWxhdGl2ZVxyXG4gICAgaWYgKChzZWxlY3RlZFRvcCAtIGJ1ZmZlcikgPj0gcGFyZW50VG9wXHJcbiAgICAgICAgJiYgKHNlbGVjdGVkQm90dG9tICsgYnVmZmVyKSA8PSBwYXJlbnRCb3R0b20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWlkZGxlID0gKHBhcmVudEJvdHRvbSAtIHBhcmVudFRvcCkgLyAyO1xyXG4gICAgY29uc3QgbmV3UG9zID0gc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUb3AgKyBvZmZzZXRUb3AgLSBtaWRkbGU7XHJcblxyXG4gICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogbmV3UG9zLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcblxyXG4gICAgLy8gaWYgKHNlbGVjdGVkVG9wIDwgcGFyZW50VG9wKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHNlbGVjdGVkWSA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wICsgbWlkZGxlO1xyXG5cclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgSW4gdG9wOiAke3NlbGVjdGVkWX1gKTtcclxuXHJcbiAgICAvLyAgICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogc2VsZWN0ZWRZLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBlbHNlIGlmIChzZWxlY3RlZEJvdHRvbSA+IHBhcmVudEJvdHRvbSkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBzZWxlY3RlZFkgPSBzZWxlY3RlZFRvcCAtIHBhcmVudFRvcCAtIG1pZGRsZTtcclxuXHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYEluIGJvdHRvbTogJHtzZWxlY3RlZFl9YCk7XHJcblxyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG8oeyB0b3A6IHNlbGVjdGVkWSwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG9wID0gNjU7XHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5jb25zdCBvblNjcm9sbEVuZCA9ICgpID0+IHtcclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9uU2Nyb2xsRW5kOyIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRCb3hEaXNjdXNzaW9uczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRmlsdGVycy5mcmFnbWVudEJveERpc2N1c3Npb24pO1xyXG4gICAgbGV0IGZyYWdtZW50Qm94OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBkYXRhRGlzY3Vzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhZ21lbnRCb3hEaXNjdXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBmcmFnbWVudEJveCA9IGZyYWdtZW50Qm94RGlzY3Vzc2lvbnNbaV0gYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgZGF0YURpc2N1c3Npb24gPSBmcmFnbWVudEJveC5kYXRhc2V0LmRpc2N1c3Npb247XHJcblxyXG4gICAgICAgIGlmIChkYXRhRGlzY3Vzc2lvbikge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRCb3guaW5uZXJIVE1MID0gZGF0YURpc2N1c3Npb247XHJcbiAgICAgICAgICAgIGZyYWdtZW50Qm94LnJlbW92ZUF0dHJpYnV0ZShkYXRhRGlzY3Vzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25GcmFnbWVudHNSZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgZnJvbSBcIi4uLy4uL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWRcIjtcclxuXHJcblxyXG4vLyBjb25zdCBzZXRIZWlnaHQgPSAoKSA9PiB7XHJcblxyXG5cclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdHJlZVNvbHZlQXNzaXN0YW50JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4vLyAgICAgaWYgKCFhc3Npc3RhbnQpIHtcclxuLy8gICAgICAgICByZXR1cm47XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgYXNzaXN0YW50LnN0eWxlLmhlaWdodCA9IFwiXCI7IC8vIEdldCBzY3JvbGwgaGVpZ2h0IGFmdGVyIHNldHRpbmcgaGVpZ2h0IHRvIG5vdGhpbmdcclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudFN0eWxlOiBhbnkgPSBnZXRDb21wdXRlZFN0eWxlKGFzc2lzdGFudCk7XHJcbi8vICAgICBjb25zdCBtYXhIZWlnaHQ6IHN0cmluZyA9IGFzc2lzdGFudFN0eWxlWydtYXgtaGVpZ2h0J107XHJcbi8vICAgICBjb25zdCB2aWV3SGVpZ2h0OiBudW1iZXIgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cclxuLy8gICAgIGlmICghbWF4SGVpZ2h0LmVuZHNXaXRoKCdweCcpKSB7XHJcbi8vICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNvbnN0IG1heEhlaWdodEludDogbnVtYmVyID0gK21heEhlaWdodC5zdWJzdHIoMCwgbWF4SGVpZ2h0Lmxlbmd0aCAtIDIpO1xyXG5cclxuLy8gICAgIGlmICh2aWV3SGVpZ2h0ID4gbWF4SGVpZ2h0SW50KSB7XHJcblxyXG4vLyAgICAgICAgIGFzc2lzdGFudC5zdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBhc3Npc3RhbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld0hlaWdodH1weGA7XHJcbi8vICAgICB9XHJcbi8vIH07XHJcblxyXG5jb25zdCBvblJlbmRlckZpbmlzaGVkID0gKCkgPT4ge1xyXG5cclxuICAgIG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIC8vIHNldEhlaWdodCgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25SZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi4vLi4vY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZFwiO1xyXG5pbXBvcnQgc2V0U2lkZUJhciBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zZXRTaWRlQmFyXCI7XHJcbmltcG9ydCBvblNjcm9sbEVuZCBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9vblNjcm9sbEVuZFwiO1xyXG5pbXBvcnQgb25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi9vblJlbmRlckZpbmlzaGVkXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEV2ZW50cyA9IHtcclxuXHJcbiAgb25SZW5kZXJGaW5pc2hlZDogKCkgPT4ge1xyXG5cclxuICAgIG9uUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCgpO1xyXG4gIH0sXHJcblxyXG4gIHJlZ2lzdGVyR2xvYmFsRXZlbnRzOiAoKSA9PiB7XHJcblxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xyXG5cclxuICAgICAgaW5pdEV2ZW50cy5vblJlbmRlckZpbmlzaGVkKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9uc2Nyb2xsID0gKCkgPT4ge1xyXG5cclxuICAgICAgc2V0U2lkZUJhcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgJ3Njcm9sbGVuZCcsXHJcbiAgICAgIG9uU2Nyb2xsRW5kXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEV2ZW50cztcclxuXHJcblxyXG5cclxuLypcclxuXHJcbi8vIElNUExFTUVOVCBvbkVuZCBjYWxsYmFja1xyXG4vLyBDaGFuZ2Ugbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyB0byB0aGlzXHJcbi8vIEFkZCBhIG5ldyBjYWxsYmFjayBwYXJhbSBhbmQgY2FsbCBpdCBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBjb21wbGV0ZXNcclxuLy8gVGhpcyB3aWxsIG5lZWQgdG8gYmUgZG9uZSBhZnRlciBlYWNoIHVwZGF0ZSBvZiBoeXBlcmFwcCEhISEhISEhISEhISEhXHJcbi8vIEFwcC5yZW5kZXIgaXMgbm9ybWFsbHkgY2FsbGVkIHR3aWNlLlxyXG5cclxuZXhwb3J0IHZhciBhcHAgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHZhciBzdGF0ZSA9IHt9XHJcbiAgdmFyIGxvY2sgPSBmYWxzZVxyXG4gIHZhciB2aWV3ID0gcHJvcHMudmlld1xyXG4gIHZhciBub2RlID0gcHJvcHMubm9kZVxyXG4gIHZhciB2ZG9tID0gbm9kZSAmJiByZWN5Y2xlTm9kZShub2RlKVxyXG4gIHZhciBzdWJzY3JpcHRpb25zID0gcHJvcHMuc3Vic2NyaXB0aW9uc1xyXG4gIHZhciBzdWJzID0gW11cclxuICB2YXIgb25FbmQgPSBwcm9wcy5vbkVuZCAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiA8PT09IGNyZWF0ZSBjYWxsYmFjayB2YXJpYWJsZSwgc2V0IHRvIG5ldyBwYXJhbSBwcm9wZXJ0eVxyXG4gIHZhciBjb3VudCA9IDFcclxuXHJcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGRpc3BhdGNoKHRoaXMuYWN0aW9uc1tldmVudC50eXBlXSwgZXZlbnQpXHJcbiAgfVxyXG5cclxuICB2YXIgc2V0U3RhdGUgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlICE9PSBuZXdTdGF0ZSkge1xyXG4gICAgICBzdGF0ZSA9IG5ld1N0YXRlXHJcbiAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgc3VicyA9IHBhdGNoU3VicyhzdWJzLCBiYXRjaChbc3Vic2NyaXB0aW9ucyhzdGF0ZSldKSwgZGlzcGF0Y2gpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZpZXcgJiYgIWxvY2spIGRlZmVyKHJlbmRlciwgKGxvY2sgPSB0cnVlKSlcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxuXHJcbiAgdmFyIGRpc3BhdGNoID0gKHByb3BzLm1pZGRsZXdhcmUgfHxcclxuICAgIGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9KShmdW5jdGlvbihhY3Rpb24sIHByb3BzKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgID8gZGlzcGF0Y2goYWN0aW9uKHN0YXRlLCBwcm9wcykpXHJcbiAgICAgIDogaXNBcnJheShhY3Rpb24pXHJcbiAgICAgID8gdHlwZW9mIGFjdGlvblswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBkaXNwYXRjaChcclxuICAgICAgICAgICAgYWN0aW9uWzBdLFxyXG4gICAgICAgICAgICB0eXBlb2YgYWN0aW9uWzFdID09PSBcImZ1bmN0aW9uXCIgPyBhY3Rpb25bMV0ocHJvcHMpIDogYWN0aW9uWzFdXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiAoYmF0Y2goYWN0aW9uLnNsaWNlKDEpKS5tYXAoZnVuY3Rpb24oZngpIHtcclxuICAgICAgICAgICAgZnggJiYgZnhbMF0oZGlzcGF0Y2gsIGZ4WzFdKVxyXG4gICAgICAgICAgfSwgc2V0U3RhdGUoYWN0aW9uWzBdKSksXHJcbiAgICAgICAgICBzdGF0ZSlcclxuICAgICAgOiBzZXRTdGF0ZShhY3Rpb24pXHJcbiAgfSlcclxuXHJcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbG9jayA9IGZhbHNlXHJcbiAgICBub2RlID0gcGF0Y2goXHJcbiAgICAgIG5vZGUucGFyZW50Tm9kZSxcclxuICAgICAgbm9kZSxcclxuICAgICAgdmRvbSxcclxuICAgICAgKHZkb20gPSBnZXRUZXh0Vk5vZGUodmlldyhzdGF0ZSkpKSxcclxuICAgICAgbGlzdGVuZXJcclxuICAgIClcclxuICAgIG9uRW5kKCkgLy8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gPD09PSBDYWxsIG5ldyBjYWxsYmFjayBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBmaW5pc2hlc1xyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG5cclxuXHJcblxyXG4qLyIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgaW50cm86IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBzbyBmYXJcclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Tm90UmF3OiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93Py5UcmVlU29sdmU/LnNjcmVlbj8uaXNBdXRvZm9jdXNGaXJzdFJ1bikge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudFVJIGltcGxlbWVudHMgSVJlbmRlckZyYWdtZW50VUkge1xyXG5cclxuICAgIHB1YmxpYyBvcHRpb25FeHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGZyYWdtZW50T3B0aW9uc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZGlzY3Vzc2lvbkxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uL3VpL1JlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudCBpbXBsZW1lbnRzIElSZW5kZXJGcmFnbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHRvcExldmVsTWFwS2V5OiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBtYXBLZXlDaGFpbjogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVJRDogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVQYXRoOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwYXJlbnRGcmFnbWVudElEOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvbnM6IEFycmF5PElSZW5kZXJGcmFnbWVudD4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgb3B0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9yZGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1aTogSVJlbmRlckZyYWdtZW50VUkgPSBuZXcgUmVuZGVyRnJhZ21lbnRVSSgpO1xyXG59XHJcbiIsIlxyXG5cclxuY29uc3QgZ0ZpbGVDb25zdGFudHMgPSB7XHJcblxyXG4gICAgZnJhZ21lbnRzRm9sZGVyU3VmZml4OiAnX2ZyYWdzJyxcclxuICAgIGZyYWdtZW50RmlsZUV4dGVuc2lvbjogJy5odG1sJyxcclxuICAgIGd1aWRlT3V0bGluZUZpbGVuYW1lOiAnb3V0bGluZS50c29sbicsXHJcbiAgICBndWlkZVJlbmRlckNvbW1lbnRUYWc6ICd0c0d1aWRlUmVuZGVyQ29tbWVudCAnLFxyXG4gICAgZnJhZ21lbnRSZW5kZXJDb21tZW50VGFnOiAndHNGcmFnbWVudFJlbmRlckNvbW1lbnQgJyxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGaWxlQ29uc3RhbnRzO1xyXG5cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vc3RhdGUvcmVuZGVyL1JlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBnRmlsZUNvbnN0YW50cyBmcm9tIFwiLi4vZ0ZpbGVDb25zdGFudHNcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi9nSGlzdG9yeUNvZGVcIjtcclxuXHJcblxyXG5jb25zdCBwYXJzZUFuZExvYWRGcmFnbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXdGcmFnbWVudDogYW55LFxyXG4gICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4pOiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIXJhd0ZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcbiAgICBsZXQgZnJhZ21lbnQgPSBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmddXHJcbiAgICBsZXQgY2FjaGUgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoIWZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgIGZyYWdtZW50ID0gbmV3IFJlbmRlckZyYWdtZW50KHJhd0ZyYWdtZW50LmlkKTtcclxuICAgICAgICBjYWNoZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgPSBvdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgIGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ10gPSBmcmFnbWVudDtcclxuXHJcbiAgICBnRnJhZ21lbnRDb2RlLmxvYWRGcmFnbWVudChcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICByYXdGcmFnbWVudCxcclxuICAgICAgICBmcmFnbWVudFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoY2FjaGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5pbmRleENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBmcmFnbWVudFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZyYWdtZW50O1xyXG59O1xyXG5cclxuY29uc3QgbG9hZE9wdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXdPcHRpb246IGFueSxcclxuICAgIG91dGxpbmVGcmFnbWVudDogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGxcclxuKTogSVJlbmRlckZyYWdtZW50ID0+IHtcclxuXHJcbiAgICBjb25zdCBvcHRpb24gPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3T3B0aW9uLmlkKTtcclxuICAgIG9wdGlvbi5vcHRpb24gPSByYXdPcHRpb24ub3B0aW9uID8/ICcnO1xyXG4gICAgb3B0aW9uLmlzQW5jaWxsYXJ5ID0gcmF3T3B0aW9uLmlzQW5jaWxsYXJ5ID8/IGZhbHNlO1xyXG4gICAgb3B0aW9uLm9yZGVyID0gcmF3T3B0aW9uLm9yZGVyID8/IDA7XHJcblxyXG4gICAgZ0ZyYWdtZW50Q29kZS5pbmRleENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgb3B0aW9uXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChvdXRsaW5lRnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBvdXRsaW5lT3B0aW9uIG9mIG91dGxpbmVGcmFnbWVudC5vKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAob3V0bGluZU9wdGlvbi5mID09PSBvcHRpb24uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24ub3V0bGluZUZyYWdtZW50SUQgPSBvdXRsaW5lT3B0aW9uLmk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVPcHRpb24uaV0gPSBvcHRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbjtcclxufTtcclxuXHJcbmNvbnN0IGdGcmFnbWVudENvZGUgPSB7XHJcblxyXG4gICAgZ2V0RnJhZ21lbnRFbGVtZW50SUQ6IChmcmFnbWVudElEOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYG50X2ZyX2ZyYWdfJHtmcmFnbWVudElEfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50ID8/IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRGcmFnbWVudEZyb21DaGFpbkZyYWdtZW50czogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVGcmFnbWVudElEID0gZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uob3V0bGluZUZyYWdtZW50SUQpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNhY2hlZGZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICBmcmFnbWVudC50b3BMZXZlbE1hcEtleSA9IGNhY2hlZGZyYWdtZW50LnRvcExldmVsTWFwS2V5O1xyXG4gICAgICAgIGZyYWdtZW50Lm1hcEtleUNoYWluID0gY2FjaGVkZnJhZ21lbnQubWFwS2V5Q2hhaW47XHJcbiAgICAgICAgZnJhZ21lbnQuZ3VpZGVJRCA9IGNhY2hlZGZyYWdtZW50Lmd1aWRlSUQ7XHJcbiAgICAgICAgZnJhZ21lbnQuZ3VpZGVQYXRoID0gY2FjaGVkZnJhZ21lbnQuZ3VpZGVQYXRoO1xyXG4gICAgICAgIGZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQgPSBjYWNoZWRmcmFnbWVudC5wYXJlbnRGcmFnbWVudElEO1xyXG4gICAgICAgIGZyYWdtZW50LnZhbHVlID0gY2FjaGVkZnJhZ21lbnQudmFsdWU7XHJcbiAgICAgICAgZnJhZ21lbnQudWkuZGlzY3Vzc2lvbkxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGZyYWdtZW50Lm9wdGlvbiA9IGNhY2hlZGZyYWdtZW50Lm9wdGlvbjtcclxuICAgICAgICBmcmFnbWVudC5pc0FuY2lsbGFyeSA9IGNhY2hlZGZyYWdtZW50LmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgIGZyYWdtZW50Lm9yZGVyID0gY2FjaGVkZnJhZ21lbnQub3JkZXI7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgaWYgKGNhY2hlZGZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShjYWNoZWRmcmFnbWVudC5vcHRpb25zKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZyYWdtZW50T3B0aW9uIG9mIGNhY2hlZGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24gPSBuZXcgUmVuZGVyRnJhZ21lbnQoZnJhZ21lbnRPcHRpb24uaWQpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLm9wdGlvbiA9IGNhY2hlZGZyYWdtZW50Lm9wdGlvbjtcclxuICAgICAgICAgICAgICAgIG9wdGlvbi5pc0FuY2lsbGFyeSA9IGNhY2hlZGZyYWdtZW50LmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLm9yZGVyID0gY2FjaGVkZnJhZ21lbnQub3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluZGV4Q2hhaW5GcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVGcmFnbWVudElEID0gZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uob3V0bGluZUZyYWdtZW50SUQpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcblxyXG4gICAgICAgIGlmIChpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdID0gZnJhZ21lbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlQW5kTG9hZEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogc3RyaW5nLFxyXG4gICAgICAgIG91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByYXdGcmFnbWVudCA9IGdGcmFnbWVudENvZGUucGFyc2VGcmFnbWVudChyZXNwb25zZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZUFuZExvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IHN0YXRlLnJlbmRlclN0YXRlLnJvb3Q7XHJcblxyXG4gICAgICAgIGlmICghcm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvdXRsaW5lUm9vdCA9IHN0YXRlLnJlbmRlclN0YXRlLm91dGxpbmU/LnI7XHJcblxyXG4gICAgICAgIGlmICghb3V0bGluZVJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJvb3QuaWQgPT09IG91dGxpbmVSb290LmYpIHtcclxuXHJcbiAgICAgICAgICAgIHJvb3Qub3V0bGluZUZyYWdtZW50SUQgPSBvdXRsaW5lUm9vdC5pO1xyXG4gICAgICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtyb290Lm91dGxpbmVGcmFnbWVudElEXSA9IHJvb3Q7XHJcbiAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudCA9IHJvb3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiByb290Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0bGluZU9wdGlvbiBvZiBvdXRsaW5lUm9vdC5vKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG91dGxpbmVPcHRpb24uZiA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVPcHRpb24uaTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvcHRpb24ub3V0bGluZUZyYWdtZW50SURdID0gb3B0aW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VBbmRMb2FkUm9vdEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdGcmFnbWVudDogYW55LFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghcmF3RnJhZ21lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3RnJhZ21lbnQuaWQpO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgICAgICBmcmFnbWVudFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLnJvb3QgPSBmcmFnbWVudDtcclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5zZXRSb290T3V0bGluZUZyYWdtZW50SUQoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnRvcExldmVsTWFwS2V5ID0gcmF3RnJhZ21lbnQudG9wTGV2ZWxNYXBLZXkgPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQubWFwS2V5Q2hhaW4gPSByYXdGcmFnbWVudC5tYXBLZXlDaGFpbiA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5ndWlkZUlEID0gcmF3RnJhZ21lbnQuZ3VpZGVJRCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5ndWlkZVBhdGggPSByYXdGcmFnbWVudC5ndWlkZVBhdGggPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA9IHJhd0ZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQgPz8gJyc7XHJcbiAgICAgICAgZnJhZ21lbnQudmFsdWUgPSByYXdGcmFnbWVudC52YWx1ZSA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC52YWx1ZSA9IGZyYWdtZW50LnZhbHVlLnRyaW0oKTtcclxuICAgICAgICBmcmFnbWVudC51aS5kaXNjdXNzaW9uTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IG91dGxpbmVGcmFnbWVudDogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIVUuaXNOdWxsT3JXaGl0ZVNwYWNlKGZyYWdtZW50Lm91dGxpbmVGcmFnbWVudElEKSkge1xyXG5cclxuICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG5cclxuICAgICAgICBpZiAocmF3RnJhZ21lbnQub3B0aW9uc1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KHJhd0ZyYWdtZW50Lm9wdGlvbnMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmF3T3B0aW9uIG9mIHJhd0ZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24gPSBsb2FkT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhd09wdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lRnJhZ21lbnQ6IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogSVJlbmRlckZyYWdtZW50ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgUmVuZGVyRnJhZ21lbnQoZnJhZ21lbnQuaWQpO1xyXG4gICAgICAgIGNsb25lLnRvcExldmVsTWFwS2V5ID0gZnJhZ21lbnQudG9wTGV2ZWxNYXBLZXk7XHJcbiAgICAgICAgY2xvbmUubWFwS2V5Q2hhaW4gPSBmcmFnbWVudC5tYXBLZXlDaGFpbjtcclxuICAgICAgICBjbG9uZS5ndWlkZUlEID0gZnJhZ21lbnQuZ3VpZGVJRDtcclxuICAgICAgICBjbG9uZS5ndWlkZVBhdGggPSBmcmFnbWVudC5ndWlkZVBhdGg7XHJcbiAgICAgICAgY2xvbmUucGFyZW50RnJhZ21lbnRJRCA9IGZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQ7XHJcbiAgICAgICAgY2xvbmUudmFsdWUgPSBmcmFnbWVudC52YWx1ZTtcclxuICAgICAgICBjbG9uZS51aS5kaXNjdXNzaW9uTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY2xvbmUub3B0aW9uID0gZnJhZ21lbnQub3B0aW9uO1xyXG4gICAgICAgIGNsb25lLmlzQW5jaWxsYXJ5ID0gZnJhZ21lbnQuaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgY2xvbmUub3JkZXIgPSBmcmFnbWVudC5vcmRlcjtcclxuXHJcbiAgICAgICAgbGV0IGNsb25lT3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGlmIChmcmFnbWVudC5vcHRpb25zXHJcbiAgICAgICAgICAgICYmIEFycmF5LmlzQXJyYXkoZnJhZ21lbnQub3B0aW9ucylcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBmcmFnbWVudE9wdGlvbiBvZiBmcmFnbWVudC5vcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvbmVPcHRpb24gPSBuZXcgUmVuZGVyRnJhZ21lbnQoZnJhZ21lbnRPcHRpb24uaWQpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmVPcHRpb24ub3B0aW9uID0gZnJhZ21lbnRPcHRpb24ub3B0aW9uO1xyXG4gICAgICAgICAgICAgICAgY2xvbmVPcHRpb24uaXNBbmNpbGxhcnkgPSBmcmFnbWVudE9wdGlvbi5pc0FuY2lsbGFyeTtcclxuICAgICAgICAgICAgICAgIGNsb25lT3B0aW9uLm9yZGVyID0gZnJhZ21lbnRPcHRpb24ub3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvbmUub3B0aW9ucy5wdXNoKGNsb25lT3B0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUZyYWdtZW50OiAocmVzcG9uc2U6IHN0cmluZyk6IGFueSA9PiB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9XFxcIm1vZHVsZVxcXCIgc3JjPVxcXCIvQHZpdGUvY2xpZW50XFxcIj48L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgIDwhLS0gdHNGcmFnbWVudFJlbmRlckNvbW1lbnQge1xcXCJub2RlXFxcIjp7XFxcImlkXFxcIjpcXFwiZEJ0N0ttMk1sXFxcIixcXFwidG9wTGV2ZWxNYXBLZXlcXFwiOlxcXCJjdjFUUmwwMXJmXFxcIixcXFwibWFwS2V5Q2hhaW5cXFwiOlxcXCJjdjFUUmwwMXJmXFxcIixcXFwiZ3VpZGVJRFxcXCI6XFxcImRCdDdKTjFIZVxcXCIsXFxcImd1aWRlUGF0aFxcXCI6XFxcImM6L0dpdEh1Yi9IQUwuRG9jdW1lbnRhdGlvbi90c21hcHNUZXN0L1Rlc3RPcHRpb25zRm9sZGVyL0hvbGRlci9UZXN0T3B0aW9ucy50c21hcFxcXCIsXFxcInBhcmVudEZyYWdtZW50SURcXFwiOlxcXCJkQnQ3Sk4xdnRcXFwiLFxcXCJjaGFydEtleVxcXCI6XFxcImN2MVRSbDAxcmZcXFwiLFxcXCJvcHRpb25zXFxcIjpbXX19IC0tPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8aDQgaWQ9XFxcIm9wdGlvbi0xLXNvbHV0aW9uXFxcIj5PcHRpb24gMSBzb2x1dGlvbjwvaDQ+XHJcbiAgICAgICAgICAgICAgICA8cD5PcHRpb24gMSBzb2x1dGlvbjwvcD5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lcyA9IHJlc3BvbnNlLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICBjb25zdCByZW5kZXJDb21tZW50U3RhcnQgPSBgPCEtLSAke2dGaWxlQ29uc3RhbnRzLmZyYWdtZW50UmVuZGVyQ29tbWVudFRhZ31gO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbW1lbnRFbmQgPSBgIC0tPmA7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50UmVuZGVyQ29tbWVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IGxpbmU6IHN0cmluZztcclxuICAgICAgICBsZXQgYnVpbGRWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYnVpbGRWYWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYCR7dmFsdWV9XHJcbiR7bGluZX1gO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgocmVuZGVyQ29tbWVudFN0YXJ0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZyYWdtZW50UmVuZGVyQ29tbWVudCA9IGxpbmUuc3Vic3RyaW5nKHJlbmRlckNvbW1lbnRTdGFydC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgYnVpbGRWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZnJhZ21lbnRSZW5kZXJDb21tZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZyYWdtZW50UmVuZGVyQ29tbWVudCA9IGZyYWdtZW50UmVuZGVyQ29tbWVudC50cmltKCk7XHJcblxyXG4gICAgICAgIGlmIChmcmFnbWVudFJlbmRlckNvbW1lbnQuZW5kc1dpdGgocmVuZGVyQ29tbWVudEVuZCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGZyYWdtZW50UmVuZGVyQ29tbWVudC5sZW5ndGggLSByZW5kZXJDb21tZW50RW5kLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50UmVuZGVyQ29tbWVudCA9IGZyYWdtZW50UmVuZGVyQ29tbWVudC5zdWJzdHJpbmcoXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgbGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmcmFnbWVudFJlbmRlckNvbW1lbnQgPSBmcmFnbWVudFJlbmRlckNvbW1lbnQudHJpbSgpO1xyXG4gICAgICAgIGxldCByYXdGcmFnbWVudDogYW55IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJhd0ZyYWdtZW50ID0gSlNPTi5wYXJzZShmcmFnbWVudFJlbmRlckNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0ZyYWdtZW50LnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiByYXdGcmFnbWVudDtcclxuICAgIH0sXHJcblxyXG4gICAgbWFya09wdGlvbnNFeHBhbmRlZDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUucmVzZXRGcmFnbWVudFVpcyhzdGF0ZSk7XHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUudWkub3B0aW9uc0V4cGFuZGVkID0gdHJ1ZTtcclxuICAgICAgICBmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbGxhcHNlRnJhZ21lbnRzT3B0aW9uczogKGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFmcmFnbWVudFxyXG4gICAgICAgICAgICB8fCBmcmFnbWVudC5vcHRpb25zLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBmcmFnbWVudC5vcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb24udWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGV4cGFuZE9wdGlvbjogKFxyXG4gICAgICAgIGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmNvbGxhcHNlRnJhZ21lbnRzT3B0aW9ucyhmcmFnbWVudCk7XHJcbiAgICAgICAgb3B0aW9uLnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgZnJhZ21lbnQuc2VsZWN0ZWQgPSBvcHRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0RnJhZ21lbnRVaXM6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZnJhZ21lbnRJRCBpbiBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRCkge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnQgPSBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudElEXTtcclxuICAgICAgICAgICAgZ0ZyYWdtZW50Q29kZS5yZXNldEZyYWdtZW50VWkoZnJhZ21lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRGcmFnbWVudFVpOiAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDdXJyZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXJlbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgcGFyZW50LnNlbGVjdGVkID0gZnJhZ21lbnQ7XHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50ID0gZnJhZ21lbnQ7XHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnRnJhZ21lbnRDb2RlO1xyXG5cclxuIiwiXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dGcmFnbWVudEFjdGlvbnNcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcblxyXG5cclxuY29uc3QgZ2V0RnJhZ21lbnQgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgZnJhZ21lbnRJRDogc3RyaW5nLFxyXG4gICAgZnJhZ21lbnRQYXRoOiBzdHJpbmcsXHJcbiAgICBhY3Rpb246IEFjdGlvblR5cGUsXHJcbiAgICBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBhY3Rpb25cclxuICAgICk7XHJcblxyXG4gICAgLy8gY29uc3QgcGF0aDogc3RyaW5nID0gYFN0ZXAvJHtzdGVwSUR9YDtcclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7ZnJhZ21lbnRQYXRofWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgcGFyc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc3BvbnNlOiAndGV4dCcsXHJcbiAgICAgICAgYWN0aW9uOiBsb2FkQWN0aW9uLFxyXG4gICAgICAgIGVycm9yOiAoc3RhdGU6IElTdGF0ZSwgZXJyb3JEZXRhaWxzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KGB7XHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciBnZXR0aW5nIGZyYWdtZW50IGZyb20gdGhlIHNlcnZlciwgcGF0aDogJHtmcmFnbWVudFBhdGh9LCBpZDogJHtmcmFnbWVudElEfVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dldEZyYWdtZW50Lm5hbWV9LFxyXG4gICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfVxyXG4gICAgICAgICAgICB9YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuY29uc3QgZ0ZyYWdtZW50RWZmZWN0cyA9IHtcclxuXHJcbiAgICAvLyBnZXRSb290U3RlcDogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgcm9vdElEOiBzdHJpbmcpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICByb290SUQsXHJcbiAgICAvLyAgICAgICAgICcwJyxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRSb290LFxyXG4gICAgLy8gICAgICAgICBnU3RlcEFjdGlvbnMubG9hZFJvb3RTdGVwXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgZ2V0RnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50UGF0aDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ0ZyYWdtZW50QWN0aW9ucy5sb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgb3B0aW9uLmlkLFxyXG4gICAgICAgICAgICBmcmFnbWVudFBhdGgsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRDaGFpbkZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudElEOiBzdHJpbmcsXHJcbiAgICAgICAgZnJhZ21lbnRQYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdGcmFnbWVudEFjdGlvbnMubG9hZENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBmcmFnbWVudElELFxyXG4gICAgICAgICAgICBmcmFnbWVudFBhdGgsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0Q2hhaW5GcmFnbWVudCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGdldEFuY2lsbGFyeTogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgLy8gICAgIHVpSUQ6IG51bWJlcik6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXNwb25zZSxcclxuICAgIC8vICAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAvLyAgICAgICAgICAgICB1aUlEXHJcbiAgICAvLyAgICAgICAgIH07XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnkoXHJcbiAgICAvLyAgICAgICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgIC8vICAgICAgICAgKTtcclxuICAgIC8vICAgICB9O1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHN0ZXBJRCxcclxuICAgIC8vICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRTdGVwLFxyXG4gICAgLy8gICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gZ2V0QW5jaWxsYXJ5U3RlcDogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgLy8gICAgIHVpSUQ6IG51bWJlcik6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXNwb25zZSxcclxuICAgIC8vICAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAvLyAgICAgICAgICAgICB1aUlEXHJcbiAgICAvLyAgICAgICAgIH07XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnlDaGFpblN0ZXAoXHJcbiAgICAvLyAgICAgICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgIC8vICAgICAgICAgKTtcclxuICAgIC8vICAgICB9O1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHN0ZXBJRCxcclxuICAgIC8vICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgQWN0aW9uVHlwZS5HZXRTdGVwLFxyXG4gICAgLy8gICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGcmFnbWVudEVmZmVjdHM7XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4uL2NvZGUvZ0ZyYWdtZW50Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRFZmZlY3RzIGZyb20gXCIuLi9lZmZlY3RzL2dGcmFnbWVudEVmZmVjdHNcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0h0bWxBY3Rpb25zIGZyb20gXCIuL2dIdG1sQWN0aW9uc1wiO1xyXG5cclxuXHJcbmNvbnN0IGdGcmFnbWVudEFjdGlvbnMgPSB7XHJcblxyXG4gICAgZXhwYW5kT3B0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXJlbnRGcmFnbWVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghb3B0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLm1hcmtPcHRpb25zRXhwYW5kZWQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBwYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbi51aS5kaXNjdXNzaW9uTG9hZGVkID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLmhpZGVCYW5uZXIgPSB0cnVlO1xyXG4gICAgICAgIGdIdG1sQWN0aW9ucy5jaGVja0FuZFNjcm9sbFRvVG9wKHN0YXRlKTtcclxuICAgICAgICBjb25zdCBmcmFnbWVudFBhdGggPSBgJHtzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZT8uZnJhZ21lbnRGb2xkZXJVcmx9LyR7b3B0aW9uLmlkfSR7Z0ZpbGVDb25zdGFudHMuZnJhZ21lbnRGaWxlRXh0ZW5zaW9ufWA7XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnRnJhZ21lbnRFZmZlY3RzLmdldEZyYWdtZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBvcHRpb24sXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudFBhdGhcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSxcclxuICAgICAgICBvcHRpb246IElSZW5kZXJGcmFnbWVudCxcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShvcHRpb24ub3V0bGluZUZyYWdtZW50SUQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUucGFyc2VBbmRMb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByZXNwb25zZS50ZXh0RGF0YSxcclxuICAgICAgICAgICAgb3B0aW9uLm91dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpbkZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55LFxyXG4gICAgICAgIG91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCAhc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5wYXJzZUFuZExvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnRleHREYXRhLFxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHMgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5sb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzO1xyXG5cclxuICAgICAgICBpZiAobG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cykge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV4dE91dGxpbmVGcmFnbWVudCA9IGxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHMuYXQoLTEpID8/IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAobmV4dE91dGxpbmVGcmFnbWVudCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWRPcHRpb246IElSZW5kZXJGcmFnbWVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW25leHRPdXRsaW5lRnJhZ21lbnQuaV07XHJcbiAgICAgICAgICAgICAgICBleHBhbmRlZE9wdGlvbi51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgZ0ZyYWdtZW50Q29kZS5leHBhbmRPcHRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50RnJhZ21lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWRPcHRpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ0ZyYWdtZW50Q29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE9wdGlvblxyXG4gICAgICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgTWFrZSBzdXJlIHN5YmxpbmdzIGFyZSBjb2xsYXBzZWRcclxuICAgICAgICAgICAgICAgIC8vICAgICAgTWFrZSBzdXJlIGl0IGlzIGFkZGVkIHRvIHRoZSByb290IGNoYWluISEhXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgIENoZWNrIHdoeSBpdCBpc24ndCBkcmF3aW5nXHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZyYWdtZW50QWN0aW9ucztcclxuIiwiaW1wb3J0IGdGcmFnbWVudEFjdGlvbnMgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9hY3Rpb25zL2dGcmFnbWVudEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJRnJhZ21lbnRQYXlsb2FkIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL3BheWxvYWRzL0lGcmFnbWVudFBheWxvYWRcIjtcclxuXHJcblxyXG5jb25zdCBmcmFnbWVudEFjdGlvbnMgPSB7XHJcblxyXG4gICAgLy8gdXNlcl9leHBhbmRBbmNpbGxhcnlPcHRpb246IChcclxuICAgIC8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgLy8gICAgIGNoYWluUGF5bG9hZDogSUNoYWluU3RlcFBheWxvYWQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5leHBhbmRBbmNpbGxhcnlPcHRpb24oXHJcbiAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICBjaGFpblBheWxvYWRcclxuICAgIC8vICAgICApXHJcbiAgICAvLyB9LFxyXG5cclxuICAgIC8vIHVzZXJfc2hvd0FuY2lsbGFyeTogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgIC8vICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICBzdGF0ZS50b3BpY1N0YXRlLnVpLnJhdyA9IGZhbHNlO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLnNob3dBbmNpbGxhcnkoXHJcbiAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICBjaGFpblBheWxvYWRcclxuICAgIC8vICAgICApXHJcbiAgICAvLyB9LFxyXG5cclxuICAgIC8vIHVzZXJfY29sbGFwc2VBbmNpbGxhcnk6IChcclxuICAgIC8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgLy8gICAgIGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIC8vICAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIHN0YXRlLnRvcGljU3RhdGUudWkucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnU3RlcEFjdGlvbnMuY29sbGFwc2VBbmNpbGxhcnkoXHJcbiAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICBhbmNpbGxhcnlDYWNoZVxyXG4gICAgLy8gICAgIClcclxuICAgIC8vIH0sXHJcblxyXG4gICAgdXNlckV4cGFuZE9wdGlvbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcGF5bG9hZDogSUZyYWdtZW50UGF5bG9hZFxyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFwYXlsb2FkPy5wYXJlbnRGcmFnbWVudFxyXG4gICAgICAgICAgICB8fCAhcGF5bG9hZD8ub3B0aW9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUudWkucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnRnJhZ21lbnRBY3Rpb25zLmV4cGFuZE9wdGlvbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHBheWxvYWQucGFyZW50RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIHBheWxvYWQub3B0aW9uXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnJhZ21lbnRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyYWdtZW50UGF5bG9hZCBpbXBsZW1lbnRzIElGcmFnbWVudFBheWxvYWQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnRGcmFnbWVudCA9IHBhcmVudEZyYWdtZW50O1xyXG4gICAgICAgIHRoaXMub3B0aW9uID0gb3B0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwYXJlbnRGcmFnbWVudDogSVJlbmRlckZyYWdtZW50O1xyXG4gICAgcHVibGljIG9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG59XHJcbiIsImltcG9ydCB7IENoaWxkcmVuLCBWTm9kZSB9IGZyb20gXCJoeXBlci1hcHAtbG9jYWxcIjtcclxuaW1wb3J0IHsgaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgZnJhZ21lbnRBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZVwiO1xyXG5pbXBvcnQgRnJhZ21lbnRQYXlsb2FkIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS91aS9wYXlsb2Fkcy9GcmFnbWVudFBheWxvYWRcIjtcclxuXHJcbmltcG9ydCBcIi4uL3Njc3MvZnJhZ21lbnRzLnNjc3NcIjtcclxuXHJcblxyXG5jb25zdCBCdWlsZE9wdGlvblZpZXcgPSAoXHJcbiAgICBwYXJlbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50XHJcbik6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgaWYgKCFvcHRpb25cclxuICAgICAgICB8fCBvcHRpb24uaXNBbmNpbGxhcnkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICBoKFwiZGl2XCIsIHsgY2xhc3M6IFwib3B0aW9uLWJveFwiIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYWdtZW50QWN0aW9ucy51c2VyRXhwYW5kT3B0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9ldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGcmFnbWVudFBheWxvYWQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwic3BhblwiLCB7fSwgb3B0aW9uLm9wdGlvbilcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59XHJcblxyXG5jb25zdCBidWlsZEV4cGFuZGVkT3B0aW9uc1ZpZXcgPSAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgY29uc3Qgb3B0aW9uVmlld3M6IENoaWxkcmVuW10gPSBbXTtcclxuICAgIGxldCBvcHRpb25WZXc6IFZOb2RlIHwgbnVsbDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBmcmFnbWVudC5vcHRpb25zKSB7XHJcblxyXG4gICAgICAgIG9wdGlvblZldyA9IEJ1aWxkT3B0aW9uVmlldyhcclxuICAgICAgICAgICAgZnJhZ21lbnQsXHJcbiAgICAgICAgICAgIG9wdGlvblxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25WZXcpIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvblZpZXdzLnB1c2gob3B0aW9uVmV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICBoKFwiZGl2XCIsIHsgY2xhc3M6IGBudC1mci1mcmFnbWVudC1vcHRpb25zYCB9LCBbXHJcblxyXG4gICAgICAgICAgICBvcHRpb25WaWV3c1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRDb2xsYXBzZWRPcHRpb25zVmlldyA9IChfZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICBoKFwiZGl2XCIsIHsgY2xhc3M6IGBudC1mci1mcmFnbWVudC1vcHRpb25zYCB9LCBbXHJcbiAgICAgICAgICAgIGgoXCJoMVwiLCB7fSwgXCJPcHRpb25zXCIpXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZE9wdGlvbnNWaWV3ID0gKGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQpOiBWTm9kZSB8IG51bGwgPT4ge1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQub3B0aW9uc1xyXG4gICAgICAgIHx8IGZyYWdtZW50Lm9wdGlvbnMubGVuZ3RoID09PSAwXHJcbiAgICApIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZnJhZ21lbnQuc2VsZWN0ZWRcclxuICAgICAgICAmJiAhZnJhZ21lbnQudWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1aWxkQ29sbGFwc2VkT3B0aW9uc1ZpZXcoZnJhZ21lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBidWlsZEV4cGFuZGVkT3B0aW9uc1ZpZXcoZnJhZ21lbnQpO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRGcmFnbWVudFZpZXcgPSAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwpOiBDaGlsZHJlbltdID0+IHtcclxuXHJcbiAgICBpZiAoIWZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmcmFnbWVudEVMZW1lbnRJRCA9IGdGcmFnbWVudENvZGUuZ2V0RnJhZ21lbnRFbGVtZW50SUQoZnJhZ21lbnQuaWQpO1xyXG5cclxuICAgIGNvbnN0IHZpZXc6IENoaWxkcmVuW10gPSBbXHJcblxyXG4gICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGAke2ZyYWdtZW50RUxlbWVudElEfWAsXHJcbiAgICAgICAgICAgICAgICBjbGFzczogXCJudC1mci1mcmFnbWVudC1ib3hcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogYG50LWZyLWZyYWdtZW50LWRpc2N1c3Npb25gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtZGlzY3Vzc2lvblwiOiBmcmFnbWVudC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcIlxyXG4gICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBidWlsZE9wdGlvbnNWaWV3KGZyYWdtZW50KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSxcclxuXHJcbiAgICAgICAgYnVpbGRGcmFnbWVudFZpZXcoZnJhZ21lbnQuc2VsZWN0ZWQpXHJcbiAgICBdO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59O1xyXG5cclxuY29uc3QgZnJhZ21lbnRWaWV3cyA9IHtcclxuXHJcbiAgICBidWlsZENvbnRlbnRWaWV3OiAoc3RhdGU6IElTdGF0ZSk6IFZOb2RlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICAgICAgaChcImRpdlwiLCB7IGlkOiBcIm50X2ZyX0ZyYWdtZW50c1wiIH0sIFtcclxuXHJcbiAgICAgICAgICAgICAgICBidWlsZEZyYWdtZW50VmlldyhzdGF0ZS5yZW5kZXJTdGF0ZS5yb290KVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmcmFnbWVudFZpZXdzO1xyXG5cclxuXHJcbiIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcImh5cGVyLWFwcC1sb2NhbFwiO1xyXG5pbXBvcnQgeyBoIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuXHJcbmltcG9ydCBcIi4uL3Njc3MvaW5kZXguc2Nzc1wiO1xyXG5cclxuXHJcbmNvbnN0IGVycm9yVmlld3MgPSB7XHJcblxyXG4gICAgYnVpbGRHZW5lcmljRXJyb3I6IChfc3RhdGU6IElTdGF0ZSk6IFZOb2RlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICAgICAgaChcImRpdlwiLCB7IGlkOiAnZXJyb3InIH0sIFtcclxuICAgICAgICAgICAgICAgIGgoXCJoM1wiLHt9LCBcIlNvcnJ5IGJ1dCB0aGUgdXJsIHlvdSByZXF1ZXN0ZWQgY2FuJ3QgYmUgZm91bmQuXCIgKSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBlcnJvclZpZXdzO1xyXG5cclxuIiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiaHlwZXItYXBwLWxvY2FsXCI7XHJcbmltcG9ydCB7IGggfSBmcm9tIFwiLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXItYXBwLWxvY2FsXCI7XHJcblxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgaW5pdEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvaW5pdEFjdGlvbnNcIjtcclxuaW1wb3J0IGZyYWdtZW50Vmlld3MgZnJvbSBcIi4uLy4uL2ZyYWdtZW50cy92aWV3cy9mcmFnbWVudFZpZXdzXCI7XHJcbmltcG9ydCBlcnJvclZpZXdzIGZyb20gXCIuLi8uLi9lcnJvci92aWV3cy9lcnJvclZpZXdzXCI7XHJcblxyXG5pbXBvcnQgXCIuLi9zY3NzL2luaXQuc2Nzc1wiO1xyXG5cclxuXHJcbmNvbnN0IGluaXRWaWV3ID0ge1xyXG5cclxuICAgIGJ1aWxkVmlldzogKHN0YXRlOiBJU3RhdGUpOiBWTm9kZSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5nZW5lcmljRXJyb3IgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvclZpZXdzLmJ1aWxkR2VuZXJpY0Vycm9yKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIChzdGF0ZS51c2VyXHJcbiAgICAgICAgLy8gICAgICYmICFzdGF0ZT8udXNlcj8udXNlVnNDb2RlXHJcbiAgICAgICAgLy8gICAgICYmICFzdGF0ZT8udXNlcj8uYXV0aG9yaXNlZCkge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGxvZ2luVmlldy5idWlsZFZpZXcoc3RhdGUpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmlldzogVk5vZGUgPVxyXG5cclxuICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGluaXRBY3Rpb25zLnNldE5vdFJhdyxcclxuICAgICAgICAgICAgICAgICAgICBpZDogXCJ0cmVlU29sdmVGcmFnbWVudHNcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYWluVmlld3MuYnVpbGRDb250ZW50VmlldyhzdGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRWaWV3cy5idWlsZENvbnRlbnRWaWV3KHN0YXRlKSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRWaWV3O1xyXG5cclxuIiwiaW1wb3J0IElTZXR0aW5ncyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91c2VyL0lTZXR0aW5nc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIGltcGxlbWVudHMgSVNldHRpbmdzIHtcclxuXHJcbiAgICBwdWJsaWMga2V5OiBzdHJpbmcgPSBcIi0xXCI7XHJcbiAgICBwdWJsaWMgcjogc3RyaW5nID0gXCItMVwiO1xyXG5cclxuICAgIC8vIEF1dGhlbnRpY2F0aW9uXHJcbiAgICBwdWJsaWMgdXNlclBhdGg6IHN0cmluZyA9IGB1c2VyYDtcclxuICAgIHB1YmxpYyBkZWZhdWx0TG9nb3V0UGF0aDogc3RyaW5nID0gYGxvZ291dGA7XHJcbiAgICBwdWJsaWMgZGVmYXVsdExvZ2luUGF0aDogc3RyaW5nID0gYGxvZ2luYDtcclxuICAgIHB1YmxpYyByZXR1cm5VcmxTdGFydDogc3RyaW5nID0gYHJldHVyblVybGA7XHJcblxyXG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmcgPSAod2luZG93IGFzIGFueSkuQVNTSVNUQU5UX0JBU0VfVVJMID8/ICcnO1xyXG4gICAgcHVibGljIGxpbmtVcmw6IHN0cmluZyA9ICh3aW5kb3cgYXMgYW55KS5BU1NJU1RBTlRfTElOS19VUkwgPz8gJyc7XHJcbiAgICBwdWJsaWMgc3Vic2NyaXB0aW9uSUQ6IHN0cmluZyA9ICh3aW5kb3cgYXMgYW55KS5BU1NJU1RBTlRfU1VCU0NSSVBUSU9OX0lEID8/ICcnO1xyXG5cclxuICAgIHB1YmxpYyBhcGlVcmw6IHN0cmluZyA9IGAke3RoaXMuYmFzZVVybH0vYXBpYDtcclxuICAgIHB1YmxpYyBiZmZVcmw6IHN0cmluZyA9IGAke3RoaXMuYmFzZVVybH0vYmZmYDtcclxuICAgIHB1YmxpYyBmaWxlVXJsOiBzdHJpbmcgPSBgJHt0aGlzLmJhc2VVcmx9L2ZpbGVgO1xyXG59XHJcbiIsImltcG9ydCBJUGFnaW5hdGlvbkRldGFpbHMgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSVBhZ2luYXRpb25EZXRhaWxzXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnaW5hdGlvbkRldGFpbHMgaW1wbGVtZW50cyBJUGFnaW5hdGlvbkRldGFpbHMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXHJcbiAgICAgICAgY291bnQ6IG51bWJlcixcclxuICAgICAgICB0b3RhbEl0ZW1zOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgIHRoaXMuY291bnQgPSBjb3VudDtcclxuICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSB0b3RhbEl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydDogbnVtYmVyO1xyXG4gICAgcHVibGljIGNvdW50OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxJdGVtczogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCBQYWdpbmF0aW9uRGV0YWlscyBmcm9tIFwiLi91aS9wYXlsb2Fkcy9QYWdpbmF0aW9uRGV0YWlsc1wiO1xyXG5pbXBvcnQgSVBhZ2luYXRpb25EZXRhaWxzIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VpL3BheWxvYWRzL0lQYWdpbmF0aW9uRGV0YWlsc1wiO1xyXG5pbXBvcnQgSVRvcGljc1N0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lUb3BpY3NTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lUb3BpY1wiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcGljc1N0YXRlIGltcGxlbWVudHMgSVRvcGljc1N0YXRlIHtcclxuICAgIFxyXG4gICAgcHVibGljIHNlbGVjdGVkSUQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgcXVldWVkS2V5OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHRvcGljczogQXJyYXk8SVRvcGljPiA9IFtdO1xyXG4gICAgcHVibGljIHRvcGljQ291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIHB1YmxpYyBwYWdpbmF0aW9uRGV0YWlsczogSVBhZ2luYXRpb25EZXRhaWxzID0gbmV3IFBhZ2luYXRpb25EZXRhaWxzKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgMTAsXHJcbiAgICAgICAgMFxyXG4gICAgKTtcclxufVxyXG4iLCJpbXBvcnQgSVRvcGljU2NlbmVVSSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JVG9waWNTY2VuZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNTY2VuZVVJIGltcGxlbWVudHMgSVRvcGljU2NlbmVVSSB7XHJcblxyXG4gICAgcHVibGljIHJhdzogYm9vbGVhbiA9IHRydWU7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSVRvcGljU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVRvcGljU3RhdGVcIjtcclxuaW1wb3J0IElUb3BpY0NhY2hlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lUb3BpY0NhY2hlXCI7XHJcbmltcG9ydCBJQXJ0aWNsZVNjZW5lIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUFydGljbGVTY2VuZVwiO1xyXG5pbXBvcnQgSVRvcGljU2NlbmVVSSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JVG9waWNTY2VuZVVJXCI7XHJcbmltcG9ydCBUb3BpY1NjZW5lVUkgZnJvbSBcIi4vdWkvVG9waWNTY2VuZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNTdGF0ZSBpbXBsZW1lbnRzIElUb3BpY1N0YXRlIHtcclxuXHJcbiAgICBwdWJsaWMgdG9waWNDYWNoZTogSVRvcGljQ2FjaGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyByZWdpc3RlcmVkU3RlcHM6IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgY3VycmVudFN0ZXA6IElTdGVwQ2FjaGUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaXNBcnRpY2xlVmlldzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ2hvc3RBcnRpY2xlU2NlbmU6IElBcnRpY2xlU2NlbmUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBhbmNpbGxhcnlFeHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9wdGlvbkV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHB1YmxpYyB1aTogSVRvcGljU2NlbmVVSSA9IG5ldyBUb3BpY1NjZW5lVUkoKTtcclxufVxyXG4iLCJcclxuZXhwb3J0IGVudW0gbmF2aWdhdGlvbkRpcmVjdGlvbiB7XHJcblxyXG4gICAgQnV0dG9ucyA9ICdidXR0b25zJyxcclxuICAgIEJhY2t3YXJkcyA9ICdiYWNrd2FyZHMnLFxyXG4gICAgRm9yd2FyZHMgPSAnZm9yd2FyZHMnXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IG5hdmlnYXRpb25EaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9uYXZpZ2F0aW9uRGlyZWN0aW9uXCI7XHJcbmltcG9ydCBJSGlzdG9yeSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5XCI7XHJcbmltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSBpbXBsZW1lbnRzIElIaXN0b3J5IHtcclxuXHJcbiAgICBwdWJsaWMgaGlzdG9yeUNoYWluOiBBcnJheTxJSGlzdG9yeVVybD4gPSBbXTtcclxuICAgIHB1YmxpYyBkaXJlY3Rpb246IG5hdmlnYXRpb25EaXJlY3Rpb24gPSBuYXZpZ2F0aW9uRGlyZWN0aW9uLkJ1dHRvbnM7XHJcbiAgICBwdWJsaWMgY3VycmVudEluZGV4OiBudW1iZXIgPSAwO1xyXG59XHJcbiIsImltcG9ydCBJVXNlciBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91c2VyL0lVc2VyXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciBpbXBsZW1lbnRzIElVc2VyIHtcclxuXHJcbiAgICBwdWJsaWMga2V5OiBzdHJpbmcgPSBgMDEyMzQ1Njc4OWA7XHJcbiAgICBwdWJsaWMgcjogc3RyaW5nID0gXCItMVwiO1xyXG4gICAgcHVibGljIHVzZVZzQ29kZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgYXV0aG9yaXNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHJhdzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgbG9nb3V0VXJsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHNob3dNZW51OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBzdWI6IHN0cmluZyA9IFwiXCI7XHJcbn1cclxuIiwiaW1wb3J0IElTZWFyY2hVSSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9zZWFyY2gvSVNlYXJjaFVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoVUkgaW1wbGVtZW50cyBJU2VhcmNoVUkge1xyXG5cclxuICAgIHB1YmxpYyBoYXNGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJU2VhcmNoU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVNlYXJjaFN0YXRlXCI7XHJcbmltcG9ydCBJU2VhcmNoVUkgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdWkvc2VhcmNoL0lTZWFyY2hVSVwiO1xyXG5pbXBvcnQgU2VhcmNoVUkgZnJvbSBcIi4vdWkvc2VhcmNoL1NlYXJjaFVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoU3RhdGUgaW1wbGVtZW50cyBJU2VhcmNoU3RhdGUge1xyXG4gICBcclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgfCBudWxsID0gXCJcIjtcclxuICAgIHB1YmxpYyB1aTogSVNlYXJjaFVJID0gbmV3IFNlYXJjaFVJKCk7XHJcbn1cclxuIiwiaW1wb3J0IElSZXBlYXRFZmZlY3RzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2VmZmVjdHMvSVJlcGVhdEVmZmVjdHNcIjtcclxuaW1wb3J0IElIdHRwRWZmZWN0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2VmZmVjdHMvSUh0dHBFZmZlY3RcIjtcclxuaW1wb3J0IElBY3Rpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSUFjdGlvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcGVhdGVFZmZlY3RzIGltcGxlbWVudHMgSVJlcGVhdEVmZmVjdHMge1xyXG5cclxuICAgIHB1YmxpYyBzaG9ydEludGVydmFsSHR0cDogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICAvLyBwdWJsaWMgcmVMb2FkR2V0SHR0cDogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICBwdWJsaWMgcmVMb2FkR2V0SHR0cEltbWVkaWF0ZTogQXJyYXk8SUh0dHBFZmZlY3Q+ID0gW107XHJcbiAgICBwdWJsaWMgcnVuQWN0aW9uSW1tZWRpYXRlOiBBcnJheTxJQWN0aW9uPiA9IFtdO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyU3RhdGVVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlclN0YXRlVUkgaW1wbGVtZW50cyBJUmVuZGVyU3RhdGVVSSB7XHJcblxyXG4gICAgcHVibGljIHJhdzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgb3B0aW9uc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JUmVuZGVyU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyR3VpZGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJHdWlkZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBJUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9JUmVuZGVyU3RhdGVVSVwiO1xyXG5pbXBvcnQgUmVuZGVyU3RhdGVVSSBmcm9tIFwiLi91aS9SZW5kZXJTdGF0ZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU3RhdGUgaW1wbGVtZW50cyBJUmVuZGVyU3RhdGUge1xyXG5cclxuICAgIHB1YmxpYyBndWlkZTogSVJlbmRlckd1aWRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgcm9vdDogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgY3VycmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBvdXRsaW5lOiBJUmVuZGVyT3V0bGluZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8vIFNlYXJjaCBpbmRpY2VzXHJcbiAgICBwdWJsaWMgaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDogYW55ID0ge307XHJcbiAgICBwdWJsaWMgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ6IGFueSA9IHt9O1xyXG4gICAgcHVibGljIGluZGV4X3Jhd0ZyYWdtZW50c19mcmFnbWVudElEOiBhbnkgPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgdWk6IElSZW5kZXJTdGF0ZVVJID0gbmV3IFJlbmRlclN0YXRlVUkoKTtcclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vdXNlci9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgSVNldHRpbmdzIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVNldHRpbmdzXCI7XHJcbmltcG9ydCBJVG9waWNzU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVRvcGljc1N0YXRlXCI7XHJcbmltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IFRvcGljc1N0YXRlIGZyb20gXCIuL1RvcGljc1N0YXRlXCI7XHJcbmltcG9ydCBJVG9waWNTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JVG9waWNTdGF0ZVwiO1xyXG5pbXBvcnQgVG9waWNTdGF0ZSBmcm9tIFwiLi9Ub3BpY1N0YXRlXCI7XHJcbmltcG9ydCBJSGlzdG9yeSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5XCI7XHJcbmltcG9ydCBTdGVwSGlzdG9yeSBmcm9tIFwiLi9oaXN0b3J5L0hpc3RvcnlcIjtcclxuaW1wb3J0IElVc2VyIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVVzZXJcIjtcclxuaW1wb3J0IFVzZXIgZnJvbSBcIi4vdXNlci9Vc2VyXCI7XHJcbmltcG9ydCBJU2VhcmNoU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVNlYXJjaFN0YXRlXCI7XHJcbmltcG9ydCBTZWFyY2hTdGF0ZSBmcm9tIFwiLi9TZWFyY2hTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlcGVhdEVmZmVjdHMgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JUmVwZWF0RWZmZWN0c1wiO1xyXG5pbXBvcnQgUmVwZWF0ZUVmZmVjdHMgZnJvbSBcIi4vZWZmZWN0cy9SZXBlYXRlRWZmZWN0c1wiO1xyXG5pbXBvcnQgSVJlbmRlclN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lSZW5kZXJTdGF0ZVwiO1xyXG5pbXBvcnQgUmVuZGVyU3RhdGUgZnJvbSBcIi4vUmVuZGVyU3RhdGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSBpbXBsZW1lbnRzIElTdGF0ZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzOiBJU2V0dGluZ3MgPSBuZXcgU2V0dGluZ3MoKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dNZW51OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc2hvd1NvbHV0aW9uc01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyB0d2l0dGVyVXJsOiBzdHJpbmcgPSAnaHR0cHM6Ly90d2l0dGVyLmNvbS9uZXRvZnRyZWVzJztcclxuICAgIHB1YmxpYyBsaW5rZWRpblVybDogc3RyaW5nID0gJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb21wYW55L25ldG9mdHJlZXMvYWJvdXQnO1xyXG5cclxuICAgIHB1YmxpYyBkaXNwbGF5VHlwZTogRGlzcGxheVR5cGUgPSBEaXNwbGF5VHlwZS5Ub3BpY3M7XHJcbiAgICBwdWJsaWMgbG9hZGluZzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZGVidWc6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGdlbmVyaWNFcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG5leHRLZXk6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc2V0dGluZ3M6IElTZXR0aW5ncztcclxuICAgIHB1YmxpYyB1c2VyOiBJVXNlciA9IG5ldyBVc2VyKCk7XHJcblxyXG4gICAgcHVibGljIHRvcGljc1N0YXRlOiBJVG9waWNzU3RhdGUgPSBuZXcgVG9waWNzU3RhdGUoKTtcclxuICAgIHB1YmxpYyB0b3BpY1N0YXRlOiBJVG9waWNTdGF0ZSA9IG5ldyBUb3BpY1N0YXRlKCk7XHJcbiAgICBwdWJsaWMgc2VhcmNoU3RhdGU6IElTZWFyY2hTdGF0ZSA9IG5ldyBTZWFyY2hTdGF0ZSgpO1xyXG4gICAgcHVibGljIHJlbmRlclN0YXRlOiBJUmVuZGVyU3RhdGUgPSBuZXcgUmVuZGVyU3RhdGUoKTtcclxuXHJcbiAgICBwdWJsaWMgcmVwZWF0RWZmZWN0czogSVJlcGVhdEVmZmVjdHMgPSBuZXcgUmVwZWF0ZUVmZmVjdHMoKTtcclxuXHJcbiAgICBwdWJsaWMgc3RlcEhpc3Rvcnk6IElIaXN0b3J5ID0gbmV3IFN0ZXBIaXN0b3J5KCk7XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBTY3JvbGxIb3BUeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvU2Nyb2xsSG9wVHlwZVwiO1xyXG5pbXBvcnQgSVNjcmVlbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy93aW5kb3cvSVNjcmVlblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbiBpbXBsZW1lbnRzIElTY3JlZW4ge1xyXG5cclxuICAgIHB1YmxpYyBhdXRvZm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0F1dG9mb2N1c0ZpcnN0UnVuOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBoaWRlQmFubmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc2Nyb2xsVG9Ub3A6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzY3JvbGxUb0VsZW1lbnQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHNjcm9sbEhvcDogU2Nyb2xsSG9wVHlwZSA9IFNjcm9sbEhvcFR5cGUuTm9uZTtcclxuICAgIHB1YmxpYyBsYXN0U2Nyb2xsWTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgdWE6IGFueSB8IG51bGwgPSBudWxsO1xyXG59XHJcbiIsImltcG9ydCBJU2NyZWVuIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3dpbmRvdy9JU2NyZWVuXCI7XHJcbmltcG9ydCBJVHJlZVNvbHZlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3dpbmRvdy9JVHJlZVNvbHZlXCI7XHJcbmltcG9ydCBTY3JlZW4gZnJvbSBcIi4vU2NyZWVuXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJlZVNvbHZlIGltcGxlbWVudHMgSVRyZWVTb2x2ZSB7XHJcblxyXG4gICAgcHVibGljIHJlbmRlcmluZ0NvbW1lbnQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHNjcmVlbjogSVNjcmVlbiA9IG5ldyBTY3JlZW4oKTtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlck91dGxpbmVGcmFnbWVudCBpbXBsZW1lbnRzIElSZW5kZXJPdXRsaW5lRnJhZ21lbnQge1xyXG5cclxuICAgIHB1YmxpYyBpOiBzdHJpbmcgPSAnJzsgLy8gaWRcclxuICAgIHB1YmxpYyBmOiBzdHJpbmcgPSAnJzsgLy8gZnJhZ21lbnQgaWRcclxuICAgIHB1YmxpYyBjOiBzdHJpbmcgPSAnJzsgLy8gY2hhcnQgaWQgZnJvbSBvdXRsaW5lIGNoYXJ0IGFycmF5XHJcbiAgICBwdWJsaWMgbzogQXJyYXk8SVJlbmRlck91dGxpbmVGcmFnbWVudD4gPSBbXTsgLy8gb3B0aW9uc1xyXG4gICAgcHVibGljIHBhcmVudDogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyT3V0bGluZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lQ2hhcnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lQ2hhcnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IFJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi9SZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJPdXRsaW5lIGltcGxlbWVudHMgSVJlbmRlck91dGxpbmUge1xyXG5cclxuICAgIHB1YmxpYyB2OiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyByOiBJUmVuZGVyT3V0bGluZUZyYWdtZW50ID0gbmV3IFJlbmRlck91dGxpbmVGcmFnbWVudCgpO1xyXG4gICAgcHVibGljIGM6IEFycmF5PElSZW5kZXJPdXRsaW5lQ2hhcnQ+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJPdXRsaW5lQ2hhcnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lQ2hhcnRcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJPdXRsaW5lQ2hhcnQgaW1wbGVtZW50cyBJUmVuZGVyT3V0bGluZUNoYXJ0IHtcclxuXHJcbiAgICBwdWJsaWMgaTogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgcDogc3RyaW5nID0gJyc7XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVDaGFydFwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZSBmcm9tIFwiLi4vLi4vc3RhdGUvcmVuZGVyL1JlbmRlck91dGxpbmVcIjtcclxuaW1wb3J0IFJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vc3RhdGUvcmVuZGVyL1JlbmRlck91dGxpbmVDaGFydFwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBnRnJhZ21lbnRDb2RlIGZyb20gXCIuL2dGcmFnbWVudENvZGVcIjtcclxuXHJcblxyXG5jb25zdCBsb2FkRnJhZ21lbnQgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcmF3RnJhZ21lbnQ6IGFueSxcclxuICAgIHBhcmVudDogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGwgPSBudWxsXHJcbik6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZyYWdtZW50ID0gbmV3IFJlbmRlck91dGxpbmVGcmFnbWVudCgpO1xyXG4gICAgZnJhZ21lbnQuaSA9IHJhd0ZyYWdtZW50Lmk7XHJcbiAgICBmcmFnbWVudC5mID0gcmF3RnJhZ21lbnQuZjtcclxuICAgIGZyYWdtZW50LnBhcmVudCA9IHBhcmVudDtcclxuICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X291dGxpbmVGcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbZnJhZ21lbnQuaV0gPSBmcmFnbWVudDtcclxuXHJcbiAgICBpZiAocmF3RnJhZ21lbnQub1xyXG4gICAgICAgICYmIEFycmF5LmlzQXJyYXkocmF3RnJhZ21lbnQubykgPT09IHRydWVcclxuICAgICAgICAmJiByYXdGcmFnbWVudC5vLmxlbmd0aCA+IDBcclxuICAgICkge1xyXG4gICAgICAgIGxldCBvOiBJUmVuZGVyT3V0bGluZUZyYWdtZW50O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiByYXdGcmFnbWVudC5vKSB7XHJcblxyXG4gICAgICAgICAgICBvID0gbG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBvcHRpb24sXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnQuby5wdXNoKG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkQ2hhcnRzID0gKFxyXG4gICAgb3V0bGluZTogSVJlbmRlck91dGxpbmUsXHJcbiAgICByYXdPdXRsaW5lQ2hhcnRzOiBBcnJheTxhbnk+XHJcbik6IHZvaWQgPT4ge1xyXG5cclxuICAgIG91dGxpbmUuYyA9IFtdO1xyXG4gICAgbGV0IGM6IElSZW5kZXJPdXRsaW5lQ2hhcnQ7XHJcblxyXG4gICAgZm9yIChjb25zdCBjaGFydCBvZiByYXdPdXRsaW5lQ2hhcnRzKSB7XHJcblxyXG4gICAgICAgIGMgPSBuZXcgUmVuZGVyT3V0bGluZUNoYXJ0KCk7XHJcbiAgICAgICAgYy5pID0gY2hhcnQuaTtcclxuICAgICAgICBjLnAgPSBjaGFydC5wO1xyXG4gICAgICAgIG91dGxpbmUuYy5wdXNoKGMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgZ091dGxpbmVDb2RlID0ge1xyXG5cclxuICAgIGdldE91dGxpbmVGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudElEXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50ID8/IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldE91dGxpbmVGcmFnbWVudENoYWluOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IEFycmF5PHN0cmluZz4gPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudElEczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgIGxldCBmcmFnbWVudDogSVJlbmRlck91dGxpbmVGcmFnbWVudCB8IG51bGw7XHJcblxyXG4gICAgICAgIHdoaWxlIChmcmFnbWVudElEKSB7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudCA9IGdPdXRsaW5lQ29kZS5nZXRPdXRsaW5lRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50SURcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZnJhZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudElEID0gZnJhZ21lbnQuaTtcclxuICAgICAgICAgICAgZnJhZ21lbnRJRHMucHVzaChmcmFnbWVudElEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmcmFnbWVudElEcztcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZE91dGxpbmU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG91dGxpbmVSZXNwb25zZTogYW55XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcmF3T3V0bGluZSA9IG91dGxpbmVSZXNwb25zZS5qc29uRGF0YTtcclxuICAgICAgICBjb25zdCBvdXRsaW5lID0gbmV3IFJlbmRlck91dGxpbmUoKTtcclxuICAgICAgICBvdXRsaW5lLnYgPSByYXdPdXRsaW5lLnY7XHJcblxyXG4gICAgICAgIGlmIChyYXdPdXRsaW5lLmNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShyYXdPdXRsaW5lLmMpID09PSB0cnVlXHJcbiAgICAgICAgICAgICYmIHJhd091dGxpbmUuYy5sZW5ndGggPiAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxvYWRDaGFydHMoXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lLFxyXG4gICAgICAgICAgICAgICAgcmF3T3V0bGluZS5jXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXRsaW5lLnYgPSByYXdPdXRsaW5lLnY7XHJcblxyXG4gICAgICAgIG91dGxpbmUuciA9IGxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsIFxyXG4gICAgICAgICAgICByYXdPdXRsaW5lLnJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5vdXRsaW5lID0gb3V0bGluZTtcclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5zZXRSb290T3V0bGluZUZyYWdtZW50SUQoc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ091dGxpbmVDb2RlO1xyXG5cclxuIiwiaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdPdXRsaW5lQ29kZSBmcm9tIFwiLi4vY29kZS9nT3V0bGluZUNvZGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50RWZmZWN0cyBmcm9tIFwiLi4vZWZmZWN0cy9nRnJhZ21lbnRFZmZlY3RzXCI7XHJcbmltcG9ydCBnRmlsZUNvbnN0YW50cyBmcm9tIFwiLi4vZ0ZpbGVDb25zdGFudHNcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuXHJcblxyXG5jb25zdCBnT3V0bGluZUFjdGlvbnMgPSB7XHJcblxyXG4gICAgbG9hZE91dGxpbmU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG91dGxpbmVSZXNwb25zZTogYW55XHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdPdXRsaW5lQ29kZS5sb2FkT3V0bGluZShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG91dGxpbmVSZXNwb25zZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkT3V0bGluZUFuZFJlcXVlc3RGcmFnbWVudHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIG91dGxpbmVSZXNwb25zZTogYW55LFxyXG4gICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50Rm9sZGVyVXJsID0gc3RhdGUucmVuZGVyU3RhdGUuZ3VpZGU/LmZyYWdtZW50Rm9sZGVyVXJsO1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2UoZnJhZ21lbnRGb2xkZXJVcmwpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnT3V0bGluZUNvZGUubG9hZE91dGxpbmUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvdXRsaW5lUmVzcG9uc2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBGaW5kIG91dGxpbmVmcmFnbWVudCB3aXRoIGlkID0gbGFzdEZyYWdtZW50SUQ7XHJcbiAgICAgICAgLy8gVGhlbiB3YWxrIHVwIHRocm91Z2ggdGhlIHBhcmVudHMsIGxvYWRpbmcgZWFjaCBpbiB0dXJuIHVudGlsIHJlYWNoaW5nIHJvb3RcclxuXHJcbiAgICAgICAgbGV0IGNoYWluT3V0bGluZUZyYWdtZW50czogQXJyYXk8SVJlbmRlck91dGxpbmVGcmFnbWVudD4gPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG91dGxpbmVGcmFnbWVudCA9IGdPdXRsaW5lQ29kZS5nZXRPdXRsaW5lRnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB3aGlsZSAob3V0bGluZUZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBjaGFpbk91dGxpbmVGcmFnbWVudHMucHVzaChvdXRsaW5lRnJhZ21lbnQpO1xyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQgPSBvdXRsaW5lRnJhZ21lbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhaW5PdXRsaW5lRnJhZ21lbnRzLnBvcCgpOyAvLyBSZW1vdmUgYXMgdGhpcyBpcyB0aGUgcm9vdCBhbmQgaXMgYWxyZWFkeSBsb2FkZWQgd2l0aCB0aGUgZ3VpZGVcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5sb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzID0gY2hhaW5PdXRsaW5lRnJhZ21lbnRzO1xyXG4gICAgICAgIGNvbnN0IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50TG9hZEVmZmVjdHM6IEFycmF5PElIdHRwRmV0Y2hJdGVtPiA9IFtdO1xyXG4gICAgICAgIGxldCBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50O1xyXG4gICAgICAgIGxldCBmcmFnbWVudFBhdGg6IHN0cmluZztcclxuICAgICAgICBsZXQgbG9hZEZyYWdtZW50RWZmZWN0OiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGNoYWluT3V0bGluZUZyYWdtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50ID0gY2hhaW5PdXRsaW5lRnJhZ21lbnRzW2ldO1xyXG4gICAgICAgICAgICBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudC5mXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgJiYgZnJhZ21lbnQudWkuZGlzY3Vzc2lvbkxvYWRlZCA9PT0gdHJ1ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudFBhdGggPSBgJHtmcmFnbWVudEZvbGRlclVybH0vJHtvdXRsaW5lRnJhZ21lbnQuZn0ke2dGaWxlQ29uc3RhbnRzLmZyYWdtZW50RmlsZUV4dGVuc2lvbn1gO1xyXG5cclxuICAgICAgICAgICAgbG9hZEZyYWdtZW50RWZmZWN0ID0gZ0ZyYWdtZW50RWZmZWN0cy5nZXRDaGFpbkZyYWdtZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQuZixcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50UGF0aCxcclxuICAgICAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudC5pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAobG9hZEZyYWdtZW50RWZmZWN0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRMb2FkRWZmZWN0cy5wdXNoKGxvYWRGcmFnbWVudEVmZmVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBmcmFnbWVudExvYWRFZmZlY3RzXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdPdXRsaW5lQWN0aW9ucztcclxuIiwiXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuaW1wb3J0IGdBamF4SGVhZGVyQ29kZSBmcm9tIFwiLi4vaHR0cC9nQWpheEhlYWRlckNvZGVcIjtcclxuaW1wb3J0IGdSZW5kZXJBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dPdXRsaW5lQWN0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5cclxuXHJcbmNvbnN0IGdldEd1aWRlT3V0bGluZSA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBsb2FkRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCBvdXRsaW5lUmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXlcclxuKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuZ3VpZGU/LnBhdGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgQWN0aW9uVHlwZS5HZXRPdXRsaW5lXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGZyYWdtZW50Rm9sZGVyVXJsOiBzdHJpbmcgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZS5mcmFnbWVudEZvbGRlclVybCA/PyAnbnVsbCc7XHJcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke2ZyYWdtZW50Rm9sZGVyVXJsfS8ke2dGaWxlQ29uc3RhbnRzLmd1aWRlT3V0bGluZUZpbGVuYW1lfWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgIGFjdGlvbjogbG9hZERlbGVnYXRlLFxyXG4gICAgICAgIGVycm9yOiAoc3RhdGU6IElTdGF0ZSwgZXJyb3JEZXRhaWxzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KGB7XHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciBnZXR0aW5nIG91dGxpbmUgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXCIsXHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiAke3VybH0sXHJcbiAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgIFwic3RhY2tcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMuc3RhY2spfSxcclxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6ICR7Z1JlbmRlckVmZmVjdHMuZ2V0R3VpZGVPdXRsaW5lLm5hbWV9LFxyXG4gICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfVxyXG4gICAgICAgICAgICB9YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdSZW5kZXJFZmZlY3RzID0ge1xyXG5cclxuICAgIGdldEd1aWRlT3V0bGluZTogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdldEd1aWRlT3V0bGluZShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGdSZW5kZXJBY3Rpb25zLmxvYWRPdXRsaW5lXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0R3VpZGVPdXRsaW5lQW5kTG9hZEZyYWdtZW50czogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2FkRGVsZWdhdGUgPSAoXHJcbiAgICAgICAgICAgIHN0YXRlOiBJU3RhdGUsIFxyXG4gICAgICAgICAgICBvdXRsaW5lUmVzcG9uc2U6IGFueVxyXG4gICAgICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnUmVuZGVyQWN0aW9ucy5sb2FkT3V0bGluZUFuZFJlcXVlc3RGcmFnbWVudHMoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmVSZXNwb25zZSxcclxuICAgICAgICAgICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRHdWlkZU91dGxpbmUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBsb2FkRGVsZWdhdGVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1JlbmRlckVmZmVjdHM7XHJcbiIsImltcG9ydCBJUmVuZGVyR3VpZGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJHdWlkZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlckd1aWRlIGltcGxlbWVudHMgSVJlbmRlckd1aWRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHBhdGg6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGZyYWdtZW50Rm9sZGVyVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckd1aWRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyR3VpZGVcIjtcclxuaW1wb3J0IEZpbHRlcnMgZnJvbSBcIi4uLy4uL3N0YXRlL2NvbnN0YW50cy9GaWx0ZXJzXCI7XHJcbmltcG9ydCBSZW5kZXJHdWlkZSBmcm9tIFwiLi4vLi4vc3RhdGUvcmVuZGVyL1JlbmRlckd1aWRlXCI7XHJcbmltcG9ydCBUcmVlU29sdmUgZnJvbSBcIi4uLy4uL3N0YXRlL3dpbmRvdy9UcmVlU29sdmVcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi9nRnJhZ21lbnRDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgcGFyc2VHdWlkZSA9IChyYXdHdWlkZTogYW55KTogSVJlbmRlckd1aWRlID0+IHtcclxuXHJcbiAgICBjb25zdCBndWlkZTogSVJlbmRlckd1aWRlID0gbmV3IFJlbmRlckd1aWRlKHJhd0d1aWRlLmlkKTtcclxuICAgIGd1aWRlLnRpdGxlID0gcmF3R3VpZGUudGl0bGUgPz8gJyc7XHJcbiAgICBndWlkZS5kZXNjcmlwdGlvbiA9IHJhd0d1aWRlLmRlc2NyaXB0aW9uID8/ICcnO1xyXG4gICAgZ3VpZGUucGF0aCA9IHJhd0d1aWRlLnBhdGggPz8gbnVsbDtcclxuICAgIGNvbnN0IGZvbGRlclBhdGggPSByYXdHdWlkZS5mcmFnbWVudEZvbGRlclBhdGggPz8gbnVsbDtcclxuXHJcbiAgICBpZiAoIVUuaXNOdWxsT3JXaGl0ZVNwYWNlKGZvbGRlclBhdGgpKSB7XHJcblxyXG4gICAgICAgIGd1aWRlLmZyYWdtZW50Rm9sZGVyVXJsID0gYCR7bG9jYXRpb24ub3JpZ2lufSR7Zm9sZGVyUGF0aH1gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBndWlkZTtcclxufTtcclxuXHJcbmNvbnN0IHBhcnNlUmVuZGVyaW5nQ29tbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXc6IGFueVxyXG4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBpZiAoIXJhdykge1xyXG4gICAgICAgIHJldHVybiByYXc7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxue1xyXG4gICAgXCJndWlkZVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcImRCdDdKTjF2dFwiXHJcbiAgICB9LFxyXG4gICAgXCJmcmFnbWVudFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcImRCdDdKTjF2dFwiLFxyXG4gICAgICAgIFwidG9wTGV2ZWxNYXBLZXlcIjogXCJjdjFUUmwwMXJmXCIsXHJcbiAgICAgICAgXCJtYXBLZXlDaGFpblwiOiBcImN2MVRSbDAxcmZcIixcclxuICAgICAgICBcImd1aWRlSURcIjogXCJkQnQ3Sk4xSGVcIixcclxuICAgICAgICBcImd1aWRlUGF0aFwiOiBcImM6L0dpdEh1Yi9IQUwuRG9jdW1lbnRhdGlvbi90c21hcHNUZXN0L1Rlc3RPcHRpb25zRm9sZGVyL0hvbGRlci9UZXN0T3B0aW9ucy50c21hcFwiLFxyXG4gICAgICAgIFwicGFyZW50RnJhZ21lbnRJRFwiOiBudWxsLFxyXG4gICAgICAgIFwiY2hhcnRLZXlcIjogXCJjdjFUUmwwMXJmXCIsXHJcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBcImRCdDdLWjFBTlwiLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25cIjogXCJPcHRpb24gMVwiLFxyXG4gICAgICAgICAgICAgICAgXCJpc0FuY2lsbGFyeVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib3JkZXJcIjogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwiZEJ0N0taMVJiXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvblwiOiBcIk9wdGlvbiAyXCIsXHJcbiAgICAgICAgICAgICAgICBcImlzQW5jaWxsYXJ5XCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkQnQ3S1oyNEJcIixcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uXCI6IFwiT3B0aW9uIDNcIixcclxuICAgICAgICAgICAgICAgIFwiaXNBbmNpbGxhcnlcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IDNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSAgICBcclxuICAgICovXHJcblxyXG4gICAgc3RhdGUucmVuZGVyU3RhdGUuZ3VpZGUgPSBwYXJzZUd1aWRlKHJhdy5ndWlkZSk7XHJcblxyXG4gICAgZ0ZyYWdtZW50Q29kZS5wYXJzZUFuZExvYWRSb290RnJhZ21lbnQoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgcmF3LmZyYWdtZW50XHJcbiAgICApO1xyXG59O1xyXG5cclxuY29uc3QgZ1JlbmRlckNvZGUgPSB7XHJcblxyXG4gICAgcmVnaXN0ZXJHdWlkZUNvbW1lbnQ6ICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdHJlZVNvbHZlR3VpZGU6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsdGVycy50cmVlU29sdmVHdWlkZUlEKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRyZWVTb2x2ZUd1aWRlXHJcbiAgICAgICAgICAgICYmIHRyZWVTb2x2ZUd1aWRlLmhhc0NoaWxkTm9kZXMoKSA9PT0gdHJ1ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGROb2RlOiBDaGlsZE5vZGU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVTb2x2ZUd1aWRlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSB0cmVlU29sdmVHdWlkZS5jaGlsZE5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghd2luZG93LlRyZWVTb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZSA9IG5ldyBUcmVlU29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUucmVuZGVyaW5nQ29tbWVudCA9IGNoaWxkTm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hpbGROb2RlLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZVJlbmRlcmluZ0NvbW1lbnQ6IChzdGF0ZTogSVN0YXRlKSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93LlRyZWVTb2x2ZT8ucmVuZGVyaW5nQ29tbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgZ3VpZGVSZW5kZXJDb21tZW50ID0gd2luZG93LlRyZWVTb2x2ZS5yZW5kZXJpbmdDb21tZW50O1xyXG4gICAgICAgICAgICBndWlkZVJlbmRlckNvbW1lbnQgPSBndWlkZVJlbmRlckNvbW1lbnQudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFndWlkZVJlbmRlckNvbW1lbnQuc3RhcnRzV2l0aChnRmlsZUNvbnN0YW50cy5ndWlkZVJlbmRlckNvbW1lbnRUYWcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGd1aWRlUmVuZGVyQ29tbWVudCA9IGd1aWRlUmVuZGVyQ29tbWVudC5zdWJzdHJpbmcoZ0ZpbGVDb25zdGFudHMuZ3VpZGVSZW5kZXJDb21tZW50VGFnLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IEpTT04ucGFyc2UoZ3VpZGVSZW5kZXJDb21tZW50KTtcclxuXHJcbiAgICAgICAgICAgIHBhcnNlUmVuZGVyaW5nQ29tbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcmF3XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZWdpc3RlckZyYWdtZW50Q29tbWVudDogKCkgPT4ge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1JlbmRlckNvZGU7XHJcbiIsIi8vIGltcG9ydCB0b3BpY3NJbml0U3RhdGUgZnJvbSBcIi4uLy4uL2NvcmUvdG9waWNzQ29yZS9jb2RlL3RvcGljc0luaXRTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IFN0YXRlIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9TdGF0ZVwiO1xyXG4vLyBpbXBvcnQgc3RlcEluaXRTdGF0ZSBmcm9tIFwiLi4vLi4vY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBJbml0U3RhdGVcIjtcclxuaW1wb3J0IFRyZWVTb2x2ZSBmcm9tIFwiLi4vLi4vLi4vc3RhdGUvd2luZG93L1RyZWVTb2x2ZVwiO1xyXG4vLyBpbXBvcnQgSUJyb3dzZXJEZXRhaWxzIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lCcm93c2VyRGV0YWlsc1wiO1xyXG4vLyBpbXBvcnQgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2h0dHAvZ0F1dGhlbnRpY2F0aW9uQWN0aW9uc1wiO1xyXG4vLyBpbXBvcnQgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc1wiO1xyXG4vLyBpbXBvcnQgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jayBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2tcIjtcclxuLy8gaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbi8vIGltcG9ydCB7IGdTZXF1ZW50aWFsSHR0cCB9IGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvaHR0cC9nSHR0cFwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2dVdGlsaXRpZXNcIjtcclxuLy8gaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbi8vIGltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuLy8gaW1wb3J0IGFydGljbGVJbml0U3RhdGUgZnJvbSBcIi4uLy4uL2NvcmUvc3RlcENvcmUvY29kZS9hcnRpY2xlSW5pdFN0YXRlXCI7XHJcbmltcG9ydCBnUmVuZGVyRWZmZWN0cyBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2VmZmVjdHMvZ1JlbmRlckVmZmVjdHNcIjtcclxuaW1wb3J0IGdSZW5kZXJDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nUmVuZGVyQ29kZVwiO1xyXG5cclxuXHJcbi8vIGNvbnN0IGRlYnVnRml4ID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuLy8gICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5zdGFydHNXaXRoKFwiaHR0cHM6Ly9sb2NhbGhvc3Q6XCIpKSB7XHJcblxyXG4vLyAgICAgICAgIC8vIElkZW50aXR5U2VydmVyIGhhcyB0aGUgY2FsbGJhY2sgYWRkcmVzcyBhcyAxMjcuMC4wLjEgbm90IGxvY2Fob3N0XHJcbi8vICAgICAgICAgLy8gVGhpcyBtZWFucyB0aGUgbG9jYWxzdG9yYWdlIGlzIHdyaXR0ZW4gdG8gdGhlIGxvY2FsaG9zdCB1cmwgYW5kIHJlcXVlc3RlZCBvbiBjYWxsYmFjayBmcm9tIHRoZSAxMjcuMC4wLjEgdXJsXHJcbi8vICAgICAgICAgLy8gc28gaXMgbnVsbFxyXG4vLyAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShcImh0dHBzOi8vbG9jYWxob3N0OlwiLCBcImh0dHBzOi8vMTI3LjAuMC4xOlwiKVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVN0YXRlID0gKCk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgLy8gZGVidWdGaXgoKTtcclxuXHJcbiAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmUpIHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZSA9IG5ldyBUcmVlU29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGF0ZTogSVN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgICBnUmVuZGVyQ29kZS5wYXJzZVJlbmRlcmluZ0NvbW1lbnQoc3RhdGUpO1xyXG5cclxuICAgIC8vIGxvYWRCcm93c2VyRGV0YWlscygpO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZTtcclxufTtcclxuXHJcblxyXG4vLyBjb25zdCBsb2FkQnJvd3NlckRldGFpbHMgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4vLyAgICAgdHJ5IHtcclxuXHJcbi8vICAgICAgICAgY29uc3QgaXNJT1MgPSBbXHJcbi8vICAgICAgICAgICAgICdpUGFkJyxcclxuLy8gICAgICAgICAgICAgJ2lQaG9uZScsXHJcbi8vICAgICAgICAgICAgICdpUG9kJ1xyXG4vLyAgICAgICAgIF0uaW5jbHVkZXMobmF2aWdhdG9yLnBsYXRmb3JtKVxyXG4vLyAgICAgICAgICAgICAvLyBpUGFkIG9uIGlPUyAxMyBkZXRlY3Rpb25cclxuLy8gICAgICAgICAgICAgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoXCJNYWNcIikgJiYgXCJvbnRvdWNoZW5kXCIgaW4gZG9jdW1lbnQpO1xyXG5cclxuLy8gICAgICAgICBpZiAoaXNJT1MpIHtcclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJEZXRhaWxzID0ge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIHBsYXRmb3JtOiBcImlPU1wiLFxyXG4vLyAgICAgICAgICAgICAgICAgbW9iaWxlOiB0cnVlXHJcbi8vICAgICAgICAgICAgIH07XHJcblxyXG4vLyAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi51YSA9IGJyb3dzZXJEZXRhaWxzIGFzIElCcm93c2VyRGV0YWlscztcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IG5hdjogYW55ID0gbmF2aWdhdG9yIGFzIGFueTtcclxuXHJcbi8vICAgICAgICAgICAgIG5hdi51c2VyQWdlbnREYXRhLmdldEhpZ2hFbnRyb3B5VmFsdWVzKFxyXG4vLyAgICAgICAgICAgICAgICAgW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIFwiYXJjaGl0ZWN0dXJlXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgXCJtb2RlbFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIFwicGxhdGZvcm1cIixcclxuLy8gICAgICAgICAgICAgICAgICAgICBcInBsYXRmb3JtVmVyc2lvblwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIFwidWFGdWxsVmVyc2lvblwiXHJcbi8vICAgICAgICAgICAgICAgICBdKVxyXG4vLyAgICAgICAgICAgICAgICAgLnRoZW4oKHVhOiBJQnJvd3NlckRldGFpbHMpID0+IHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4udWEgPSB1YTtcclxuLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gICAgIGNhdGNoIHtcclxuLy8gICAgICAgICAvL2RvIG5vdGhpbmcuLi5cclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuLy8gY29uc3QgaW5pdGlhbGlzZVdpdGhBdXRob3Jpc2F0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4vLyAgICAgLy8gU29tZXRpbWVzICcuJyBjYW4gc3RvcCBhIHVybCBiZWluZyBzZW50IGhlcmUsIGlmIHRoaXMgaGFwcGVucyBhZGQgYSAvIHRvIHRoZSBlbmQgb2YgdGhlIHVybFxyXG5cclxuLy8gICAgIC8vIElmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3Qgd29yayB5b3UgbmVlZCB0byBpZGVudGl0eSBzZXJ2ZXIgaW4gYW5vdGhlciB0YWJcclxuLy8gICAgIC8vIFRoaXMgc2l0ZSB3aWxsIGJlIGJsb2NrZWQgYmVjYXVzZSBvZiB0aGUgc2VsZiBjZXJ0LlxyXG4vLyAgICAgLy8gQ2xpY2sgYWR2YW5jZWQgZXRjIHRvIGFsbG93IHRoZSBjZXJ0XHJcbi8vICAgICAvLyBUaGVuIHJlbGF1bmNoIHRoaXMgc2l0ZSBhbmQgaXQgc2hvdWxkIHdvcmtcclxuLy8gICAgIC8vIGFsZXJ0KCdUZXN0Jyk7XHJcblxyXG4vLyAgICAgY29uc3QgZWZmZWN0czogQXJyYXk8SUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jaz4gPSBbXTtcclxuLy8gICAgIGNvbnN0IGh0dHBGZXRjaEl0ZW06IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jaGVja1VzZXJMb2dnZWRJblByb3BzKHN0YXRlKTtcclxuXHJcbi8vICAgICAvLyBDb2xsZWN0IGp1c3QgdGhlIHByb3BlcnRpZXMgZnJvbSB0aGUgZWZmZWN0cywgZGlzY2FyZGluZyB0aGUgSHR0cFxyXG4vLyAgICAgLy8gVGhlbiByZWJ1aWxkIHRoZW0gYXQgdGhlIGZpcnN0IGxldmVsIHdpdGggc2VxdWVudGlhbEh0dHAgaW5zdGVhZFxyXG5cclxuLy8gICAgIGlmIChodHRwRmV0Y2hJdGVtKSB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyA9IGh0dHBGZXRjaEl0ZW1bMV07XHJcbi8vICAgICAgICAgZWZmZWN0cy5wdXNoKHByb3BzKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBjb25zdCBwYXRoQXJyYXk6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XHJcblxyXG4vLyAgICAgaWYgKHBhdGhBcnJheVxyXG4vLyAgICAgICAgICYmIHBhdGhBcnJheS5sZW5ndGggPT09IDJcclxuLy8gICAgICAgICAmJiBwYXRoQXJyYXlbMV0gPT09IFwidG9waWNzXCIpIHtcclxuXHJcbi8vICAgICAgICAgY29uc3QgaHR0cEZldGNoSXRlbTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPSB0b3BpY3NJbml0U3RhdGUuaW5pdGlhbGlzZVRvcGljc0Rpc3BsYXlQcm9wcyhzdGF0ZSk7XHJcblxyXG4vLyAgICAgICAgIGlmIChodHRwRmV0Y2hJdGVtKSB7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBodHRwRmV0Y2hJdGVtWzFdO1xyXG4vLyAgICAgICAgICAgICBlZmZlY3RzLnB1c2gocHJvcHMpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gICAgIGVsc2UgaWYgKHBhdGhBcnJheVxyXG4vLyAgICAgICAgICYmIHBhdGhBcnJheVsxXSA9PT0gXCJzdGVwXCIpIHtcclxuXHJcbi8vICAgICAgICAgY29uc3Qgc3RlcElEOiBzdHJpbmcgPSBwYXRoQXJyYXlbMl07XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IGh0dHBGZXRjaEl0ZW06IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gc3RlcEluaXRTdGF0ZS5pbml0aWFsaXNlU3RlcERpc3BsYXlQcm9wcyhcclxuLy8gICAgICAgICAgICAgc3RhdGUsXHJcbi8vICAgICAgICAgICAgIHN0ZXBJRFxyXG4vLyAgICAgICAgICk7XHJcblxyXG4vLyAgICAgICAgIGlmIChodHRwRmV0Y2hJdGVtKSB7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBodHRwRmV0Y2hJdGVtWzFdO1xyXG4vLyAgICAgICAgICAgICBlZmZlY3RzLnB1c2gocHJvcHMpO1xyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBjb25zdCBodHRwRmV0Y2hJdGVtOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9IHRvcGljc0luaXRTdGF0ZS5pbml0aWFsaXNlVG9waWNzRGlzcGxheVByb3BzKHN0YXRlKTtcclxuXHJcbi8vICAgICAgICAgaWYgKGh0dHBGZXRjaEl0ZW0pIHtcclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyA9IGh0dHBGZXRjaEl0ZW1bMV07XHJcbi8vICAgICAgICAgICAgIGVmZmVjdHMucHVzaChwcm9wcyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHJldHVybiBbXHJcbi8vICAgICAgICAgc3RhdGUsXHJcbi8vICAgICAgICAgZ1NlcXVlbnRpYWxIdHRwKGVmZmVjdHMpXHJcbi8vICAgICBdO1xyXG4vLyB9O1xyXG5cclxuY29uc3QgYnVpbGRSZW5kZXJEaXNwbGF5ID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBnUmVuZGVyRWZmZWN0cy5nZXRHdWlkZU91dGxpbmUoc3RhdGUpXHJcbiAgICBdO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRSZW5kZXJDaGFpbkRpc3BsYXkgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcXVlcnlTdHJpbmc6IHN0cmluZ1xyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgaWYgKHF1ZXJ5U3RyaW5nLnN0YXJ0c1dpdGgoJz8nKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nLnN1YnN0cmluZygxKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsYXN0T3V0bGluZUZyYWdtZW50SUQgPSBxdWVyeVN0cmluZztcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGdSZW5kZXJFZmZlY3RzLmdldEd1aWRlT3V0bGluZUFuZExvYWRGcmFnbWVudHMoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICApXHJcbiAgICBdO1xyXG59O1xyXG5cclxuLy8gY29uc3QgYnVpbGRUb3BpY3NEaXNwbGF5ID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4vLyAgICAgLy8gVE9ETyBBZGQgcGFnaW5hdGlvbi4uLlxyXG4vLyAgICAgc3RhdGUuZGlzcGxheVR5cGUgPSBEaXNwbGF5VHlwZS5Ub3BpY3M7XHJcbi8vICAgICBnSGlzdG9yeUNvZGUucHVzaEJyb3dzZXJIaXN0b3J5U3RhdGUoc3RhdGUpO1xyXG5cclxuLy8gICAgIHJldHVybiB0b3BpY3NJbml0U3RhdGUuaW5pdGlhbGlzZVRvcGljc0Rpc3BsYXkoc3RhdGUpO1xyXG4vLyB9O1xyXG5cclxuLy8gY29uc3QgYnVpbGRBcnRpY2xlRGlzcGxheSA9IChcclxuLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbi8vICAgICB0b3BpY0lEOiBzdHJpbmcsXHJcbi8vICAgICBxdWVyeVN0cmluZzogc3RyaW5nIHwgbnVsbCA9IG51bGwpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4vLyAgICAgc3RhdGUuZGlzcGxheVR5cGUgPSBEaXNwbGF5VHlwZS5BcnRpY2xlO1xyXG4vLyAgICAgbGV0IGd1aWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG5cclxuLy8gICAgIGlmIChxdWVyeVN0cmluZz8uc3RhcnRzV2l0aCgnP2lkPScpKSB7XHJcblxyXG4vLyAgICAgICAgIGd1aWQgPSBxdWVyeVN0cmluZy5zdWJzdHJpbmcoNCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIGFydGljbGVJbml0U3RhdGUuaW5pdGlhbGlzZUFydGljbGVEaXNwbGF5KFxyXG4vLyAgICAgICAgIHN0YXRlLFxyXG4vLyAgICAgICAgIHRvcGljSUQsXHJcbi8vICAgICAgICAgZ3VpZFxyXG4vLyAgICAgKTtcclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGJ1aWxkU3RlcHNEaXNwbGF5ID0gKFxyXG4vLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuLy8gICAgIHN0ZXBJRDogc3RyaW5nKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuLy8gICAgIGlmICghVS5pc051bGxPcldoaXRlU3BhY2Uoc3RlcElEKSkge1xyXG5cclxuLy8gICAgICAgICBzdGVwSUQgPSBzdGVwSUQucmVwbGFjZSgnficsICcuJyk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgc3RhdGUuZGlzcGxheVR5cGUgPSBEaXNwbGF5VHlwZS5TdGVwO1xyXG5cclxuLy8gICAgIHJldHVybiBzdGVwSW5pdFN0YXRlLmluaXRpYWxpc2VTdGVwRGlzcGxheShcclxuLy8gICAgICAgICBzdGF0ZSxcclxuLy8gICAgICAgICBzdGVwSURcclxuLy8gICAgICk7XHJcbi8vIH07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlV2l0aG91dEF1dGhvcmlzYXRpb24gPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAvLyBTb21ldGltZXMgJy4nIGNhbiBzdG9wIGEgdXJsIGJlaW5nIHNlbnQgaGVyZSwgaWYgdGhpcyBoYXBwZW5zIGFkZCBhIC8gdG8gdGhlIGVuZCBvZiB0aGUgdXJsXHJcblxyXG4gICAgLy8gSWYgYXV0aGVudGljYXRpb24gZG9lc24ndCB3b3JrIHlvdSBuZWVkIHRvIGlkZW50aXR5IHNlcnZlciBpbiBhbm90aGVyIHRhYlxyXG4gICAgLy8gVGhpcyBzaXRlIHdpbGwgYmUgYmxvY2tlZCBiZWNhdXNlIG9mIHRoZSBzZWxmIGNlcnQuXHJcbiAgICAvLyBDbGljayBhZHZhbmNlZCBldGMgdG8gYWxsb3cgdGhlIGNlcnRcclxuICAgIC8vIFRoZW4gcmVsYXVuY2ggdGhpcyBzaXRlIGFuZCBpdCBzaG91bGQgd29ya1xyXG4gICAgLy8gYWxlcnQoJ1Rlc3QnKTtcclxuXHJcbiAgICAvLyBjb25zdCBwYXRoQXJyYXk6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XHJcbiAgICBjb25zdCBxdWVyeVN0cmluZzogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIGlmIChwYXRoQXJyYXlcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5Lmxlbmd0aCA9PT0gMlxyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXlbMV0gPT09IFwidG9waWNzXCIpIHtcclxuXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBidWlsZFRvcGljc0Rpc3BsYXkoc3RhdGUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIGlmIChwYXRoQXJyYXlcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5Lmxlbmd0aCA9PT0gM1xyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXlbMV0gPT09IFwidG9waWNcIikge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGJ1aWxkQXJ0aWNsZURpc3BsYXkoXHJcbiAgICAgICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgICAgICAvLyAgICAgICAgIHBhdGhBcnJheVsyXSxcclxuICAgICAgICAvLyAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2hcclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZSBpZiAocGF0aEFycmF5XHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheS5sZW5ndGggPT09IDJcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5WzFdID09PSBcInN0ZXBcIikge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGJ1aWxkU3RlcHNEaXNwbGF5KFxyXG4gICAgICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgLy8gICAgICAgICBwYXRoQXJyYXlbMl1cclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICghVS5pc051bGxPcldoaXRlU3BhY2UocXVlcnlTdHJpbmcpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYnVpbGRSZW5kZXJDaGFpbkRpc3BsYXkoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYnVpbGRSZW5kZXJEaXNwbGF5KHN0YXRlKTtcclxuICAgICAgICAvLyByZXR1cm4gYnVpbGRUb3BpY3NEaXNwbGF5KHN0YXRlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlOiBhbnkpIHtcclxuXHJcbiAgICAgICAgc3RhdGUuZ2VuZXJpY0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U3RhdGUgPSB7XHJcblxyXG4gICAgaW5pdGlhbGlzZTogKCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhdGU6IElTdGF0ZSA9IGluaXRpYWxpc2VTdGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBpZiAoc3RhdGU/LnVzZXI/LnVzZVZzQ29kZSA9PT0gdHJ1ZSlcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpc2VXaXRob3V0QXV0aG9yaXNhdGlvbihzdGF0ZSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyByZXR1cm4gaW5pdGlhbGlzZVdpdGhBdXRob3Jpc2F0aW9uKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRTdGF0ZTtcclxuXHJcbiIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgVHJlZVNvbHZlIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS93aW5kb3cvVHJlZVNvbHZlXCI7XHJcblxyXG5cclxuY29uc3QgcmVuZGVyQ29tbWVudHMgPSB7XHJcblxyXG4gICAgcmVnaXN0ZXJHdWlkZUNvbW1lbnQ6ICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdHJlZVNvbHZlR3VpZGU6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsdGVycy50cmVlU29sdmVHdWlkZUlEKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRyZWVTb2x2ZUd1aWRlXHJcbiAgICAgICAgICAgICYmIHRyZWVTb2x2ZUd1aWRlLmhhc0NoaWxkTm9kZXMoKSA9PT0gdHJ1ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGROb2RlOiBDaGlsZE5vZGU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVTb2x2ZUd1aWRlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSB0cmVlU29sdmVHdWlkZS5jaGlsZE5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghd2luZG93LlRyZWVTb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZSA9IG5ldyBUcmVlU29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUucmVuZGVyaW5nQ29tbWVudCA9IGNoaWxkTm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hpbGROb2RlLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZW5kZXJDb21tZW50cztcclxuIiwiaW1wb3J0IHsgYXBwIH0gZnJvbSBcIi4vaHlwZXJBcHAvaHlwZXItYXBwLWxvY2FsXCI7XG5cbmltcG9ydCBpbml0U3Vic2NyaXB0aW9ucyBmcm9tIFwiLi9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9zdWJzY3JpcHRpb25zL2luaXRTdWJzY3JpcHRpb25zXCI7XG5pbXBvcnQgaW5pdEV2ZW50cyBmcm9tIFwiLi9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRFdmVudHNcIjtcbmltcG9ydCBpbml0VmlldyBmcm9tIFwiLi9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC92aWV3cy9pbml0Vmlld1wiO1xuaW1wb3J0IGluaXRTdGF0ZSBmcm9tIFwiLi9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRTdGF0ZVwiO1xuaW1wb3J0IHJlbmRlckNvbW1lbnRzIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvcmVuZGVyQ29tbWVudHNcIjtcblxuXG5pbml0RXZlbnRzLnJlZ2lzdGVyR2xvYmFsRXZlbnRzKCk7XG5yZW5kZXJDb21tZW50cy5yZWdpc3Rlckd1aWRlQ29tbWVudCgpO1xuXG4od2luZG93IGFzIGFueSkuQ29tcG9zaXRlRmxvd3NBdXRob3IgPSBhcHAoe1xuICAgIFxuICAgIG5vZGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJlZVNvbHZlRnJhZ21lbnRzXCIpLFxuICAgIGluaXQ6IGluaXRTdGF0ZS5pbml0aWFsaXNlLFxuICAgIHZpZXc6IGluaXRWaWV3LmJ1aWxkVmlldyxcbiAgICBzdWJzY3JpcHRpb25zOiBpbml0U3Vic2NyaXB0aW9ucyxcbiAgICBvbkVuZDogaW5pdEV2ZW50cy5vblJlbmRlckZpbmlzaGVkXG59KTtcblxuXG4iXSwibmFtZXMiOlsicHJvcHMiLCJEaXNwbGF5VHlwZSIsIm91dHB1dCIsIkFjdGlvblR5cGUiLCJVIiwiZWZmZWN0IiwiaHR0cEVmZmVjdCIsIlN0ZXBUeXBlIiwibG9jYXRpb24iLCJzdGF0ZSIsImxvYWRPcHRpb24iLCJTY3JvbGxIb3BUeXBlIiwibmF2aWdhdGlvbkRpcmVjdGlvbiIsIlN0ZXBIaXN0b3J5IiwiZ1JlbmRlckFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLGdCQUFnQjtBQUNwQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxZQUFZO0FBQ2hCLElBQUksWUFBWSxDQUFFO0FBQ2xCLElBQUksWUFBWSxDQUFFO0FBQ2xCLElBQUksTUFBTSxVQUFVO0FBQ3BCLElB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
