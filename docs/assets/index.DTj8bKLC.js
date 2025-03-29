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
  const url = `${window.location.origin}${fragmentFolderUrl}.tsoln`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguRFRqOGJLTEMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbC5qcyIsIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyQXBwLWZ4L3V0aWxzLmpzIiwiLi4vLi4vcm9vdC9zcmMvaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmQuanMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nVXRpbGl0aWVzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2VmZmVjdHMvSHR0cEVmZmVjdC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdG9waWMvU3RlcFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwQ2FjaGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1Jvb3RDYWNoZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvaGlzdG9yeS9IaXN0b3J5VXJsLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L1JlbmRlclNuYXBTaG90LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nSGlzdG9yeUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1N0ZXBPcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L0FydGljbGVTY2VuZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5QYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9wYXlsb2Fkcy9DaGFpblN0ZXBQYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nQXJ0aWNsZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9jb2RlL2dTdGVwQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2dTZXNzaW9uLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1RvcGljLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9Ub3BpY0NhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nVG9waWNDb2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nU3RlcEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dIdHRwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL2NvbnN0YW50cy9LZXlzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQXV0aGVudGljYXRpb25Db2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQWpheEhlYWRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHAudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9lZmZlY3RzL2dTdGVwRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1RvcGljc1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ1RvcGljc0NvcmVBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L2FjdGlvbnMvdG9waWNBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3RvcGljc0Rpc3BsYXkvc3Vic2NyaXB0aW9ucy90b3BpY1N1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS90b3BpY3NDb3JlL3N1YnNjcmlwdGlvbnMvdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9oeXBlckFwcC90aW1lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nUmVwZWF0QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9zdWJzY3JpcHRpb25zL2luaXRTdWJzY3JpcHRpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9jb25zdGFudHMvRmlsdGVycy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3N0ZXBEaXNwbGF5L2NvZGUvc2Nyb2xsU3RlcC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3NldFNpZGVCYXIudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL29uU2Nyb2xsRW5kLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL29uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRFdmVudHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9hY3Rpb25zL2luaXRBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJGcmFnbWVudFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nRmlsZUNvbnN0YW50cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvYWN0aW9ucy9mcmFnbWVudEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvdmlld3MvZnJhZ21lbnRWaWV3cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9lcnJvci92aWV3cy9lcnJvclZpZXdzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2luaXQvdmlld3MvaW5pdFZpZXcudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VzZXIvU2V0dGluZ3MudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL1BhZ2luYXRpb25EZXRhaWxzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY3NTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvVG9waWNTY2VuZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY1N0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2hpc3RvcnkvSGlzdG9yeS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdXNlci9Vc2VyLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9zZWFyY2gvU2VhcmNoVUkudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL1NlYXJjaFN0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJTdGF0ZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9SZW5kZXJTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvU3RhdGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9TY3JlZW4udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9UcmVlU29sdmUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUNoYXJ0LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nT3V0bGluZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9hY3Rpb25zL2dPdXRsaW5lQWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ1JlbmRlckVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJHdWlkZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1JlbmRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvcmVuZGVyQ29tbWVudHMudHMiLCIuLi8uLi9yb290L3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUkVDWUNMRURfTk9ERSA9IDFcclxudmFyIExBWllfTk9ERSA9IDJcclxudmFyIFRFWFRfTk9ERSA9IDNcclxudmFyIEVNUFRZX09CSiA9IHt9XHJcbnZhciBFTVBUWV9BUlIgPSBbXVxyXG52YXIgbWFwID0gRU1QVFlfQVJSLm1hcFxyXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXlcclxudmFyIGRlZmVyID1cclxuICB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICA/IHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgOiBzZXRUaW1lb3V0XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbihvYmopIHtcclxuICB2YXIgb3V0ID0gXCJcIlxyXG5cclxuICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIG9ialxyXG5cclxuICBpZiAoaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPiAwKSB7XHJcbiAgICBmb3IgKHZhciBrID0gMCwgdG1wOyBrIDwgb2JqLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgIGlmICgodG1wID0gY3JlYXRlQ2xhc3Mob2JqW2tdKSkgIT09IFwiXCIpIHtcclxuICAgICAgICBvdXQgKz0gKG91dCAmJiBcIiBcIikgKyB0bXBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xyXG4gICAgICBpZiAob2JqW2tdKSB7XHJcbiAgICAgICAgb3V0ICs9IChvdXQgJiYgXCIgXCIpICsga1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0XHJcbn1cclxuXHJcbnZhciBtZXJnZSA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICB2YXIgb3V0ID0ge31cclxuXHJcbiAgZm9yICh2YXIgayBpbiBhKSBvdXRba10gPSBhW2tdXHJcbiAgZm9yICh2YXIgayBpbiBiKSBvdXRba10gPSBiW2tdXHJcblxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxudmFyIGJhdGNoID0gZnVuY3Rpb24obGlzdCkge1xyXG4gIHJldHVybiBsaXN0LnJlZHVjZShmdW5jdGlvbihvdXQsIGl0ZW0pIHtcclxuICAgIHJldHVybiBvdXQuY29uY2F0KFxyXG4gICAgICAhaXRlbSB8fCBpdGVtID09PSB0cnVlXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiB0eXBlb2YgaXRlbVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBbaXRlbV1cclxuICAgICAgICA6IGJhdGNoKGl0ZW0pXHJcbiAgICApXHJcbiAgfSwgRU1QVFlfQVJSKVxyXG59XHJcblxyXG52YXIgaXNTYW1lQWN0aW9uID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIHJldHVybiBpc0FycmF5KGEpICYmIGlzQXJyYXkoYikgJiYgYVswXSA9PT0gYlswXSAmJiB0eXBlb2YgYVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbn1cclxuXHJcbnZhciBzaG91bGRSZXN0YXJ0ID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhICE9PSBiKSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG1lcmdlKGEsIGIpKSB7XHJcbiAgICAgIGlmIChhW2tdICE9PSBiW2tdICYmICFpc1NhbWVBY3Rpb24oYVtrXSwgYltrXSkpIHJldHVybiB0cnVlXHJcbiAgICAgIGJba10gPSBhW2tdXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG52YXIgcGF0Y2hTdWJzID0gZnVuY3Rpb24ob2xkU3VicywgbmV3U3VicywgZGlzcGF0Y2gpIHtcclxuICBmb3IgKFxyXG4gICAgdmFyIGkgPSAwLCBvbGRTdWIsIG5ld1N1Yiwgc3VicyA9IFtdO1xyXG4gICAgaSA8IG9sZFN1YnMubGVuZ3RoIHx8IGkgPCBuZXdTdWJzLmxlbmd0aDtcclxuICAgIGkrK1xyXG4gICkge1xyXG4gICAgb2xkU3ViID0gb2xkU3Vic1tpXVxyXG4gICAgbmV3U3ViID0gbmV3U3Vic1tpXVxyXG4gICAgc3Vicy5wdXNoKFxyXG4gICAgICBuZXdTdWJcclxuICAgICAgICA/ICFvbGRTdWIgfHxcclxuICAgICAgICAgIG5ld1N1YlswXSAhPT0gb2xkU3ViWzBdIHx8XHJcbiAgICAgICAgICBzaG91bGRSZXN0YXJ0KG5ld1N1YlsxXSwgb2xkU3ViWzFdKVxyXG4gICAgICAgICAgPyBbXHJcbiAgICAgICAgICAgICAgbmV3U3ViWzBdLFxyXG4gICAgICAgICAgICAgIG5ld1N1YlsxXSxcclxuICAgICAgICAgICAgICBuZXdTdWJbMF0oZGlzcGF0Y2gsIG5ld1N1YlsxXSksXHJcbiAgICAgICAgICAgICAgb2xkU3ViICYmIG9sZFN1YlsyXSgpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIDogb2xkU3ViXHJcbiAgICAgICAgOiBvbGRTdWIgJiYgb2xkU3ViWzJdKClcclxuICAgIClcclxuICB9XHJcbiAgcmV0dXJuIHN1YnNcclxufVxyXG5cclxudmFyIHBhdGNoUHJvcGVydHkgPSBmdW5jdGlvbihub2RlLCBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgaWYgKGtleSA9PT0gXCJrZXlcIikge1xyXG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcInN0eWxlXCIpIHtcclxuICAgIGZvciAodmFyIGsgaW4gbWVyZ2Uob2xkVmFsdWUsIG5ld1ZhbHVlKSkge1xyXG4gICAgICBvbGRWYWx1ZSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWVba10gPT0gbnVsbCA/IFwiXCIgOiBuZXdWYWx1ZVtrXVxyXG4gICAgICBpZiAoa1swXSA9PT0gXCItXCIpIHtcclxuICAgICAgICBub2RlW2tleV0uc2V0UHJvcGVydHkoaywgb2xkVmFsdWUpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZVtrZXldW2tdID0gb2xkVmFsdWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoa2V5WzBdID09PSBcIm9cIiAmJiBrZXlbMV0gPT09IFwiblwiKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgICEoKG5vZGUuYWN0aW9ucyB8fCAobm9kZS5hY3Rpb25zID0ge30pKVtcclxuICAgICAgICAoa2V5ID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgIF0gPSBuZXdWYWx1ZSlcclxuICAgICkge1xyXG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoa2V5LCBsaXN0ZW5lcilcclxuICAgIH0gZWxzZSBpZiAoIW9sZFZhbHVlKSB7XHJcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihrZXksIGxpc3RlbmVyKVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoIWlzU3ZnICYmIGtleSAhPT0gXCJsaXN0XCIgJiYga2V5IGluIG5vZGUpIHtcclxuICAgIG5vZGVba2V5XSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWUgPT0gXCJ1bmRlZmluZWRcIiA/IFwiXCIgOiBuZXdWYWx1ZVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICBuZXdWYWx1ZSA9PSBudWxsIHx8XHJcbiAgICBuZXdWYWx1ZSA9PT0gZmFsc2UgfHxcclxuICAgIChrZXkgPT09IFwiY2xhc3NcIiAmJiAhKG5ld1ZhbHVlID0gY3JlYXRlQ2xhc3MobmV3VmFsdWUpKSlcclxuICApIHtcclxuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSlcclxuICB9IGVsc2Uge1xyXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBuZXdWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbnZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24odmRvbSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgdmFyIG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgdmFyIHByb3BzID0gdmRvbS5wcm9wc1xyXG4gIHZhciBub2RlID1cclxuICAgIHZkb20udHlwZSA9PT0gVEVYVF9OT0RFXHJcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmRvbS5uYW1lKVxyXG4gICAgICA6IChpc1N2ZyA9IGlzU3ZnIHx8IHZkb20ubmFtZSA9PT0gXCJzdmdcIilcclxuICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuXHJcbiAgZm9yICh2YXIgayBpbiBwcm9wcykge1xyXG4gICAgcGF0Y2hQcm9wZXJ0eShub2RlLCBrLCBudWxsLCBwcm9wc1trXSwgbGlzdGVuZXIsIGlzU3ZnKVxyXG4gIH1cclxuXHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZkb20uY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoXHJcbiAgICAgIGNyZWF0ZU5vZGUoXHJcbiAgICAgICAgKHZkb20uY2hpbGRyZW5baV0gPSBnZXRWTm9kZSh2ZG9tLmNoaWxkcmVuW2ldKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICh2ZG9tLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgZ2V0S2V5ID0gZnVuY3Rpb24odmRvbSkge1xyXG4gIHJldHVybiB2ZG9tID09IG51bGwgPyBudWxsIDogdmRvbS5rZXlcclxufVxyXG5cclxudmFyIHBhdGNoID0gZnVuY3Rpb24ocGFyZW50LCBub2RlLCBvbGRWTm9kZSwgbmV3Vk5vZGUsIGxpc3RlbmVyLCBpc1N2Zykge1xyXG4gIGlmIChvbGRWTm9kZSA9PT0gbmV3Vk5vZGUpIHtcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgb2xkVk5vZGUgIT0gbnVsbCAmJlxyXG4gICAgb2xkVk5vZGUudHlwZSA9PT0gVEVYVF9OT0RFICYmXHJcbiAgICBuZXdWTm9kZS50eXBlID09PSBURVhUX05PREVcclxuICApIHtcclxuICAgIGlmIChvbGRWTm9kZS5uYW1lICE9PSBuZXdWTm9kZS5uYW1lKSBub2RlLm5vZGVWYWx1ZSA9IG5ld1ZOb2RlLm5hbWVcclxuICB9IGVsc2UgaWYgKG9sZFZOb2RlID09IG51bGwgfHwgb2xkVk5vZGUubmFtZSAhPT0gbmV3Vk5vZGUubmFtZSkge1xyXG4gICAgbm9kZSA9IHBhcmVudC5pbnNlcnRCZWZvcmUoXHJcbiAgICAgIGNyZWF0ZU5vZGUoKG5ld1ZOb2RlID0gZ2V0Vk5vZGUobmV3Vk5vZGUpKSwgbGlzdGVuZXIsIGlzU3ZnKSxcclxuICAgICAgbm9kZVxyXG4gICAgKVxyXG4gICAgaWYgKG9sZFZOb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG9sZFZOb2RlLm5vZGUpXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciB0bXBWS2lkXHJcbiAgICB2YXIgb2xkVktpZFxyXG5cclxuICAgIHZhciBvbGRLZXlcclxuICAgIHZhciBuZXdLZXlcclxuXHJcbiAgICB2YXIgb2xkVlByb3BzID0gb2xkVk5vZGUucHJvcHNcclxuICAgIHZhciBuZXdWUHJvcHMgPSBuZXdWTm9kZS5wcm9wc1xyXG5cclxuICAgIHZhciBvbGRWS2lkcyA9IG9sZFZOb2RlLmNoaWxkcmVuXHJcbiAgICB2YXIgbmV3VktpZHMgPSBuZXdWTm9kZS5jaGlsZHJlblxyXG5cclxuICAgIHZhciBvbGRIZWFkID0gMFxyXG4gICAgdmFyIG5ld0hlYWQgPSAwXHJcbiAgICB2YXIgb2xkVGFpbCA9IG9sZFZLaWRzLmxlbmd0aCAtIDFcclxuICAgIHZhciBuZXdUYWlsID0gbmV3VktpZHMubGVuZ3RoIC0gMVxyXG5cclxuICAgIGlzU3ZnID0gaXNTdmcgfHwgbmV3Vk5vZGUubmFtZSA9PT0gXCJzdmdcIlxyXG5cclxuICAgIGZvciAodmFyIGkgaW4gbWVyZ2Uob2xkVlByb3BzLCBuZXdWUHJvcHMpKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAoaSA9PT0gXCJ2YWx1ZVwiIHx8IGkgPT09IFwic2VsZWN0ZWRcIiB8fCBpID09PSBcImNoZWNrZWRcIlxyXG4gICAgICAgICAgPyBub2RlW2ldXHJcbiAgICAgICAgICA6IG9sZFZQcm9wc1tpXSkgIT09IG5ld1ZQcm9wc1tpXVxyXG4gICAgICApIHtcclxuICAgICAgICBwYXRjaFByb3BlcnR5KG5vZGUsIGksIG9sZFZQcm9wc1tpXSwgbmV3VlByb3BzW2ldLCBsaXN0ZW5lciwgaXNTdmcpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsICYmIG9sZEhlYWQgPD0gb2xkVGFpbCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgKG9sZEtleSA9IGdldEtleShvbGRWS2lkc1tvbGRIZWFkXSkpID09IG51bGwgfHxcclxuICAgICAgICBvbGRLZXkgIT09IGdldEtleShuZXdWS2lkc1tuZXdIZWFkXSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGF0Y2goXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRIZWFkXS5ub2RlLFxyXG4gICAgICAgIG9sZFZLaWRzW29sZEhlYWRdLFxyXG4gICAgICAgIChuZXdWS2lkc1tuZXdIZWFkXSA9IGdldFZOb2RlKFxyXG4gICAgICAgICAgbmV3VktpZHNbbmV3SGVhZCsrXSxcclxuICAgICAgICAgIG9sZFZLaWRzW29sZEhlYWQrK11cclxuICAgICAgICApKSxcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBpc1N2Z1xyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKG5ld0hlYWQgPD0gbmV3VGFpbCAmJiBvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIChvbGRLZXkgPSBnZXRLZXkob2xkVktpZHNbb2xkVGFpbF0pKSA9PSBudWxsIHx8XHJcbiAgICAgICAgb2xkS2V5ICE9PSBnZXRLZXkobmV3VktpZHNbbmV3VGFpbF0pXHJcbiAgICAgICkge1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhdGNoKFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgb2xkVktpZHNbb2xkVGFpbF0ubm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRUYWlsXSxcclxuICAgICAgICAobmV3VktpZHNbbmV3VGFpbF0gPSBnZXRWTm9kZShcclxuICAgICAgICAgIG5ld1ZLaWRzW25ld1RhaWwtLV0sXHJcbiAgICAgICAgICBvbGRWS2lkc1tvbGRUYWlsLS1dXHJcbiAgICAgICAgKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvbGRIZWFkID4gb2xkVGFpbCkge1xyXG4gICAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUoXHJcbiAgICAgICAgICBjcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAobmV3VktpZHNbbmV3SGVhZF0gPSBnZXRWTm9kZShuZXdWS2lkc1tuZXdIZWFkKytdKSksXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZF0pICYmIG9sZFZLaWQubm9kZVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChuZXdIZWFkID4gbmV3VGFpbCkge1xyXG4gICAgICB3aGlsZSAob2xkSGVhZCA8PSBvbGRUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkc1tvbGRIZWFkKytdLm5vZGUpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSBvbGRIZWFkLCBrZXllZCA9IHt9LCBuZXdLZXllZCA9IHt9OyBpIDw9IG9sZFRhaWw7IGkrKykge1xyXG4gICAgICAgIGlmICgob2xkS2V5ID0gb2xkVktpZHNbaV0ua2V5KSAhPSBudWxsKSB7XHJcbiAgICAgICAgICBrZXllZFtvbGRLZXldID0gb2xkVktpZHNbaV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChuZXdIZWFkIDw9IG5ld1RhaWwpIHtcclxuICAgICAgICBvbGRLZXkgPSBnZXRLZXkoKG9sZFZLaWQgPSBvbGRWS2lkc1tvbGRIZWFkXSkpXHJcbiAgICAgICAgbmV3S2V5ID0gZ2V0S2V5KFxyXG4gICAgICAgICAgKG5ld1ZLaWRzW25ld0hlYWRdID0gZ2V0Vk5vZGUobmV3VktpZHNbbmV3SGVhZF0sIG9sZFZLaWQpKVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgbmV3S2V5ZWRbb2xkS2V5XSB8fFxyXG4gICAgICAgICAgKG5ld0tleSAhPSBudWxsICYmIG5ld0tleSA9PT0gZ2V0S2V5KG9sZFZLaWRzW29sZEhlYWQgKyAxXSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBpZiAob2xkS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkLm5vZGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvbGRIZWFkKytcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmV3S2V5ID09IG51bGwgfHwgb2xkVk5vZGUudHlwZSA9PT0gUkVDWUNMRURfTk9ERSkge1xyXG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHBhdGNoKFxyXG4gICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCxcclxuICAgICAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkXSxcclxuICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIG5ld0hlYWQrK1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChvbGRLZXkgPT09IG5ld0tleSkge1xyXG4gICAgICAgICAgICBwYXRjaChcclxuICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgIG9sZFZLaWQubm9kZSxcclxuICAgICAgICAgICAgICBvbGRWS2lkLFxyXG4gICAgICAgICAgICAgIG5ld1ZLaWRzW25ld0hlYWRdLFxyXG4gICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgbmV3S2V5ZWRbbmV3S2V5XSA9IHRydWVcclxuICAgICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHRtcFZLaWQgPSBrZXllZFtuZXdLZXldKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUodG1wVktpZC5ub2RlLCBvbGRWS2lkICYmIG9sZFZLaWQubm9kZSksXHJcbiAgICAgICAgICAgICAgICB0bXBWS2lkLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIG5ld0tleWVkW25ld0tleV0gPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBuZXdIZWFkKytcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgICBpZiAoZ2V0S2V5KChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZCsrXSkpID09IG51bGwpIHtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQob2xkVktpZC5ub2RlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yICh2YXIgaSBpbiBrZXllZCkge1xyXG4gICAgICAgIGlmIChuZXdLZXllZFtpXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGtleWVkW2ldLm5vZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKG5ld1ZOb2RlLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgcHJvcHNDaGFuZ2VkID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGZvciAodmFyIGsgaW4gYSkgaWYgKGFba10gIT09IGJba10pIHJldHVybiB0cnVlXHJcbiAgZm9yICh2YXIgayBpbiBiKSBpZiAoYVtrXSAhPT0gYltrXSkgcmV0dXJuIHRydWVcclxufVxyXG5cclxudmFyIGdldFRleHRWTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gdHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIgPyBub2RlIDogY3JlYXRlVGV4dFZOb2RlKG5vZGUpXHJcbn1cclxuXHJcbnZhciBnZXRWTm9kZSA9IGZ1bmN0aW9uKG5ld1ZOb2RlLCBvbGRWTm9kZSkge1xyXG4gIHJldHVybiBuZXdWTm9kZS50eXBlID09PSBMQVpZX05PREVcclxuICAgID8gKCghb2xkVk5vZGUgfHwgIW9sZFZOb2RlLmxhenkgfHwgcHJvcHNDaGFuZ2VkKG9sZFZOb2RlLmxhenksIG5ld1ZOb2RlLmxhenkpKVxyXG4gICAgICAgICYmICgob2xkVk5vZGUgPSBnZXRUZXh0Vk5vZGUobmV3Vk5vZGUubGF6eS52aWV3KG5ld1ZOb2RlLmxhenkpKSkubGF6eSA9XHJcbiAgICAgICAgICBuZXdWTm9kZS5sYXp5KSxcclxuICAgICAgb2xkVk5vZGUpXHJcbiAgICA6IG5ld1ZOb2RlXHJcbn1cclxuXHJcbnZhciBjcmVhdGVWTm9kZSA9IGZ1bmN0aW9uKG5hbWUsIHByb3BzLCBjaGlsZHJlbiwgbm9kZSwga2V5LCB0eXBlKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICBwcm9wczogcHJvcHMsXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBub2RlOiBub2RlLFxyXG4gICAgdHlwZTogdHlwZSxcclxuICAgIGtleToga2V5XHJcbiAgfVxyXG59XHJcblxyXG52YXIgY3JlYXRlVGV4dFZOb2RlID0gZnVuY3Rpb24odmFsdWUsIG5vZGUpIHtcclxuICByZXR1cm4gY3JlYXRlVk5vZGUodmFsdWUsIEVNUFRZX09CSiwgRU1QVFlfQVJSLCBub2RlLCB1bmRlZmluZWQsIFRFWFRfTk9ERSlcclxufVxyXG5cclxudmFyIHJlY3ljbGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBURVhUX05PREVcclxuICAgID8gY3JlYXRlVGV4dFZOb2RlKG5vZGUubm9kZVZhbHVlLCBub2RlKVxyXG4gICAgOiBjcmVhdGVWTm9kZShcclxuICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgRU1QVFlfT0JKLFxyXG4gICAgICAgIG1hcC5jYWxsKG5vZGUuY2hpbGROb2RlcywgcmVjeWNsZU5vZGUpLFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFJFQ1lDTEVEX05PREVcclxuICAgICAgKVxyXG59XHJcblxyXG5leHBvcnQgdmFyIExhenkgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHJldHVybiB7XHJcbiAgICBsYXp5OiBwcm9wcyxcclxuICAgIHR5cGU6IExBWllfTk9ERVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBoID0gZnVuY3Rpb24obmFtZSwgcHJvcHMpIHtcclxuICBmb3IgKHZhciB2ZG9tLCByZXN0ID0gW10sIGNoaWxkcmVuID0gW10sIGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHtcclxuICAgIHJlc3QucHVzaChhcmd1bWVudHNbaV0pXHJcbiAgfVxyXG5cclxuICB3aGlsZSAocmVzdC5sZW5ndGggPiAwKSB7XHJcbiAgICBpZiAoaXNBcnJheSgodmRvbSA9IHJlc3QucG9wKCkpKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gdmRvbS5sZW5ndGg7IGktLSA+IDA7ICkge1xyXG4gICAgICAgIHJlc3QucHVzaCh2ZG9tW2ldKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHZkb20gPT09IGZhbHNlIHx8IHZkb20gPT09IHRydWUgfHwgdmRvbSA9PSBudWxsKSB7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGdldFRleHRWTm9kZSh2ZG9tKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3BzID0gcHJvcHMgfHwgRU1QVFlfT0JKXHJcblxyXG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICA/IG5hbWUocHJvcHMsIGNoaWxkcmVuKVxyXG4gICAgOiBjcmVhdGVWTm9kZShuYW1lLCBwcm9wcywgY2hpbGRyZW4sIHVuZGVmaW5lZCwgcHJvcHMua2V5KVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGFwcCA9IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgdmFyIHN0YXRlID0ge31cclxuICB2YXIgbG9jayA9IGZhbHNlXHJcbiAgdmFyIHZpZXcgPSBwcm9wcy52aWV3XHJcbiAgdmFyIG5vZGUgPSBwcm9wcy5ub2RlXHJcbiAgdmFyIHZkb20gPSBub2RlICYmIHJlY3ljbGVOb2RlKG5vZGUpXHJcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBwcm9wcy5zdWJzY3JpcHRpb25zXHJcbiAgdmFyIHN1YnMgPSBbXVxyXG4gIHZhciBvbkVuZCA9IHByb3BzLm9uRW5kXHJcblxyXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBkaXNwYXRjaCh0aGlzLmFjdGlvbnNbZXZlbnQudHlwZV0sIGV2ZW50KVxyXG4gIH1cclxuXHJcbiAgdmFyIHNldFN0YXRlID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcclxuICAgIGlmIChzdGF0ZSAhPT0gbmV3U3RhdGUpIHtcclxuICAgICAgc3RhdGUgPSBuZXdTdGF0ZVxyXG4gICAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgIHN1YnMgPSBwYXRjaFN1YnMoc3VicywgYmF0Y2goW3N1YnNjcmlwdGlvbnMoc3RhdGUpXSksIGRpc3BhdGNoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh2aWV3ICYmICFsb2NrKSBkZWZlcihyZW5kZXIsIChsb2NrID0gdHJ1ZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGVcclxuICB9XHJcblxyXG4gIHZhciBkaXNwYXRjaCA9IChwcm9wcy5taWRkbGV3YXJlIHx8XHJcbiAgICBmdW5jdGlvbihvYmopIHtcclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfSkoZnVuY3Rpb24oYWN0aW9uLCBwcm9wcykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICA/IGRpc3BhdGNoKGFjdGlvbihzdGF0ZSwgcHJvcHMpKVxyXG4gICAgICA6IGlzQXJyYXkoYWN0aW9uKVxyXG4gICAgICA/IHR5cGVvZiBhY3Rpb25bMF0gPT09IFwiZnVuY3Rpb25cIiB8fCBpc0FycmF5KGFjdGlvblswXSlcclxuICAgICAgICA/IGRpc3BhdGNoKFxyXG4gICAgICAgICAgICBhY3Rpb25bMF0sXHJcbiAgICAgICAgICAgIHR5cGVvZiBhY3Rpb25bMV0gPT09IFwiZnVuY3Rpb25cIiA/IGFjdGlvblsxXShwcm9wcykgOiBhY3Rpb25bMV1cclxuICAgICAgICAgIClcclxuICAgICAgICA6IChiYXRjaChhY3Rpb24uc2xpY2UoMSkpLm1hcChmdW5jdGlvbihmeCkge1xyXG4gICAgICAgICAgICBmeCAmJiBmeFswXShkaXNwYXRjaCwgZnhbMV0pXHJcbiAgICAgICAgICB9LCBzZXRTdGF0ZShhY3Rpb25bMF0pKSxcclxuICAgICAgICAgIHN0YXRlKVxyXG4gICAgICA6IHNldFN0YXRlKGFjdGlvbilcclxuICB9KVxyXG5cclxuICB2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsb2NrID0gZmFsc2VcclxuICAgIG5vZGUgPSBwYXRjaChcclxuICAgICAgbm9kZS5wYXJlbnROb2RlLFxyXG4gICAgICBub2RlLFxyXG4gICAgICB2ZG9tLFxyXG4gICAgICAodmRvbSA9IGdldFRleHRWTm9kZSh2aWV3KHN0YXRlKSkpLFxyXG4gICAgICBsaXN0ZW5lclxyXG4gICAgKVxyXG4gICAgb25FbmQoKVxyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gYXNzaWduKHNvdXJjZSwgYXNzaWdubWVudHMpIHtcclxuICB2YXIgcmVzdWx0ID0ge30sXHJcbiAgICBpXHJcbiAgZm9yIChpIGluIHNvdXJjZSkgcmVzdWx0W2ldID0gc291cmNlW2ldXHJcbiAgZm9yIChpIGluIGFzc2lnbm1lbnRzKSByZXN1bHRbaV0gPSBhc3NpZ25tZW50c1tpXVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZW1vdmVMaXN0ZW5lcihhdHRhY2hUbywgZGlzcGF0Y2gsIGFjdGlvbiwgZXZlbnROYW1lKSB7XHJcbiAgdmFyIGhhbmRsZXIgPSBkaXNwYXRjaC5iaW5kKG51bGwsIGFjdGlvbilcclxuICBhdHRhY2hUby5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICBhdHRhY2hUby5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlRGlzcGF0Y2hUaW1lKGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbiwgcHJvcHMuYXNEYXRlID8gbmV3IERhdGUoKSA6IHBlcmZvcm1hbmNlLm5vdygpKVxyXG4gIH1cclxufVxyXG5cclxudmFyIHdlYlNvY2tldENvbm5lY3Rpb25zID0ge31cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPcGVuV2ViU29ja2V0KHByb3BzKSB7XHJcbiAgdmFyIGNvbm5lY3Rpb24gPSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbiAgaWYgKCFjb25uZWN0aW9uKSB7XHJcbiAgICBjb25uZWN0aW9uID0ge1xyXG4gICAgICBzb2NrZXQ6IG5ldyBXZWJTb2NrZXQocHJvcHMudXJsLCBwcm9wcy5wcm90b2NvbHMpLFxyXG4gICAgICBsaXN0ZW5lcnM6IFtdXHJcbiAgICB9XHJcbiAgICB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdID0gY29ubmVjdGlvblxyXG4gIH1cclxuICByZXR1cm4gY29ubmVjdGlvblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VXZWJTb2NrZXQocHJvcHMpIHtcclxuICB2YXIgY29ubmVjdGlvbiA9IGdldE9wZW5XZWJTb2NrZXQocHJvcHMpXHJcbiAgLy8gRklYTUU6IGhhbmRsZSBjbG9zZSBvbiBvcGVuaW5nXHJcbiAgY29ubmVjdGlvbi5zb2NrZXQuY2xvc2UoKVxyXG4gIGRlbGV0ZSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbn1cclxuIiwiaW1wb3J0IHsgbWFrZVJlbW92ZUxpc3RlbmVyIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcclxuXHJcbmZ1bmN0aW9uIGtleWJvYXJkRWZmZWN0KGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHZhciByZW1vdmVMaXN0ZW5lckZvckV2ZW50ID0gbWFrZVJlbW92ZUxpc3RlbmVyLmJpbmQoXHJcbiAgICBudWxsLFxyXG4gICAgZG9jdW1lbnQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIHByb3BzLmFjdGlvblxyXG4gIClcclxuICB2YXIgcmVtb3ZlRG93biA9IHByb3BzLmRvd25zID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleWRvd25cIikgOiBudWxsXHJcbiAgdmFyIHJlbW92ZVVwID0gcHJvcHMudXBzID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleXVwXCIpIDogbnVsbFxyXG4gIHZhciByZW1vdmVQcmVzcyA9IHByb3BzLnByZXNzZXMgPyByZW1vdmVMaXN0ZW5lckZvckV2ZW50KFwia2V5cHJlc3NcIikgOiBudWxsXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgcmVtb3ZlRG93biAmJiByZW1vdmVEb3duKClcclxuICAgIHJlbW92ZVVwICYmIHJlbW92ZVVwKClcclxuICAgIHJlbW92ZVByZXNzICYmIHJlbW92ZVByZXNzKClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYW4gZWZmZWN0IHRoYXQgY2FuIGNhcHR1cmUgW2tleWRvd25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0V2ZW50cy9rZXlkb3duKSwgW2tleXVwXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5dXApLCBhbmQgW2tleXByZXNzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5cHJlc3MpIGV2ZW50cyBmb3IgeW91ciBlbnRpcmUgZG9jdW1lbnQuIFRoZSBbYEtleWJvYXJkRXZlbnRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudCkgd2lsbCBiZSBwcm92aWRlZCBhcyB0aGUgYWN0aW9uIGBkYXRhYC5cclxuICpcclxuICogQG1lbWJlcm9mIG1vZHVsZTpzdWJzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLmRvd25zIC0gbGlzdGVuIGZvciBrZXlkb3duIGV2ZW50c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLnVwcyAtIGxpc3RlbiBmb3Iga2V5dXAgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJvcHMucHJlc3NlcyAtIGxpc3RlbiBmb3Iga2V5cHJlc3MgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Kn0gcHJvcHMuYWN0aW9uIC0gYWN0aW9uIHRvIGNhbGwgd2hlbiBrZXlib2FyZCBldmVudHMgYXJlIGZpcmVkXHJcbiAqIEBleGFtcGxlXHJcbiAqIGltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcImh5cGVyYXBwLWZ4LWxvY2FsXCJcclxuICpcclxuICogY29uc3QgS2V5U3ViID0gS2V5Ym9hcmQoe1xyXG4gKiAgIGRvd25zOiB0cnVlLFxyXG4gKiAgIHVwczogdHJ1ZSxcclxuICogICBhY3Rpb246IChfLCBrZXlFdmVudCkgPT4ge1xyXG4gKiAgICAgLy8ga2V5RXZlbnQgaGFzIHRoZSBwcm9wcyBvZiB0aGUgS2V5Ym9hcmRFdmVudFxyXG4gKiAgICAgLy8gYWN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBrZXlkb3duIGFuZCBrZXl1cFxyXG4gKiAgIH1cclxuICogfSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBLZXlib2FyZChwcm9wcykge1xyXG4gIHJldHVybiBba2V5Ym9hcmRFZmZlY3QsIHByb3BzXVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBEaXNwbGF5VHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBUb3BpY3MgPSBcInRvcGljc1wiLFxyXG4gICAgQXJ0aWNsZSA9IFwiYXJ0aWNsZVwiLFxyXG4gICAgU3RlcCA9IFwic3RlcFwiXHJcbn1cclxuIiwiXHJcblxyXG5jb25zdCBnVXRpbGl0aWVzID0ge1xyXG5cclxuICAgIHJvdW5kVXBUb05lYXJlc3RUZW46ICh2YWx1ZTogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb29yID0gTWF0aC5mbG9vcih2YWx1ZSAvIDEwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChmbG9vciArIDEpICogMTA7XHJcbiAgICB9LFxyXG5cclxuICAgIHJvdW5kRG93blRvTmVhcmVzdFRlbjogKHZhbHVlOiBudW1iZXIpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yKHZhbHVlIC8gMTApO1xyXG5cclxuICAgICAgICByZXR1cm4gZmxvb3IgKiAxMDtcclxuICAgIH0sXHJcblxyXG4gICAgY29udmVydE1tVG9GZWV0SW5jaGVzOiAobW06IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluY2hlcyA9IG1tICogMC4wMzkzNztcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMuY29udmVydEluY2hlc1RvRmVldEluY2hlcyhpbmNoZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXREaXJlY3Rvcnk6IChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBmaWxlUGF0aC5tYXRjaCgvKC4qKVtcXC9cXFxcXS8pO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hlc1xyXG4gICAgICAgICAgICAmJiBtYXRjaGVzLmxlbmd0aCA+IDBcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb3VudENoYXJhY3RlcjogKFxyXG4gICAgICAgIGlucHV0OiBzdHJpbmcsXHJcbiAgICAgICAgY2hhcmFjdGVyOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5wdXRbaV0gPT09IGNoYXJhY3Rlcikge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfSxcclxuXHJcbiAgICBjb252ZXJ0SW5jaGVzVG9GZWV0SW5jaGVzOiAoaW5jaGVzOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmZWV0ID0gTWF0aC5mbG9vcihpbmNoZXMgLyAxMik7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nID0gaW5jaGVzICUgMTI7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nUm91bmRlZCA9IE1hdGgucm91bmQoaW5jaGVzUmVhbWluaW5nICogMTApIC8gMTA7IC8vIDEgZGVjaW1hbCBwbGFjZXNcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGZlZXQgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBgJHtmZWV0fScgYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmNoZXNSZWFtaW5pbmdSb3VuZGVkID4gMCkge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gYCR7cmVzdWx0fSR7aW5jaGVzUmVhbWluaW5nUm91bmRlZH1cImA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICBpc051bGxPcldoaXRlU3BhY2U6IChpbnB1dDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgaW5wdXQgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dCA9IGAke2lucHV0fWA7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dC5tYXRjaCgvXlxccyokLykgIT09IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrQXJyYXlzRXF1YWw6IChhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgYiA9PT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgeW91IGRvbid0IGNhcmUgYWJvdXQgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbnNpZGVcclxuICAgICAgICAvLyB0aGUgYXJyYXksIHlvdSBzaG91bGQgc29ydCBib3RoIGFycmF5cyBoZXJlLlxyXG4gICAgICAgIC8vIFBsZWFzZSBub3RlIHRoYXQgY2FsbGluZyBzb3J0IG9uIGFuIGFycmF5IHdpbGwgbW9kaWZ5IHRoYXQgYXJyYXkuXHJcbiAgICAgICAgLy8geW91IG1pZ2h0IHdhbnQgdG8gY2xvbmUgeW91ciBhcnJheSBmaXJzdC5cclxuXHJcbiAgICAgICAgY29uc3QgeDogc3RyaW5nW10gPSBbLi4uYV07XHJcbiAgICAgICAgY29uc3QgeTogc3RyaW5nW10gPSBbLi4uYl07XHJcbiAgICAgICAgXHJcbiAgICAgICAgeC5zb3J0KCk7XHJcbiAgICAgICAgeS5zb3J0KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhbaV0gIT09IHlbaV0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlKGFycmF5OiBBcnJheTxhbnk+KTogQXJyYXk8YW55PiB7XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHRlbXBvcmFyeVZhbHVlOiBhbnlcclxuICAgICAgICBsZXQgcmFuZG9tSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UoaW5wdXQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIWlzTmFOKGlucHV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOZWdhdGl2ZU51bWVyaWM6IChpbnB1dDogYW55KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmICghZ1V0aWxpdGllcy5pc051bWVyaWMoaW5wdXQpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gK2lucHV0IDwgMDsgLy8gKyBjb252ZXJ0cyBhIHN0cmluZyB0byBhIG51bWJlciBpZiBpdCBjb25zaXN0cyBvbmx5IG9mIGRpZ2l0cy5cclxuICAgIH0sXHJcblxyXG4gICAgaGFzRHVwbGljYXRlczogPFQ+KGlucHV0OiBBcnJheTxUPik6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAobmV3IFNldChpbnB1dCkuc2l6ZSAhPT0gaW5wdXQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgZXh0ZW5kOiA8VD4oYXJyYXkxOiBBcnJheTxUPiwgYXJyYXkyOiBBcnJheTxUPik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBhcnJheTIuZm9yRWFjaCgoaXRlbTogVCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYXJyYXkxLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21TdHJpbmc6IChpbnB1dDogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMucHJldHR5UHJpbnRKc29uRnJvbU9iamVjdChKU09OLnBhcnNlKGlucHV0KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21PYmplY3Q6IChpbnB1dDogb2JqZWN0IHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgICBpbnB1dCxcclxuICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgNCAvLyBpbmRlbnRlZCA0IHNwYWNlc1xyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzUG9zaXRpdmVOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdW1lcmljKGlucHV0KSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihpbnB1dCkgPj0gMDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VGltZTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdzogRGF0ZSA9IG5ldyBEYXRlKERhdGUubm93KCkpO1xyXG4gICAgICAgIGNvbnN0IHRpbWU6IHN0cmluZyA9IGAke25vdy5nZXRGdWxsWWVhcigpfS0keyhub3cuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0tJHtub3cuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0gJHtub3cuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9Ojoke25vdy5nZXRNaWxsaXNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDMsICcwJyl9OmA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZTogKGlucHV0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGlucHV0LnNwbGl0KC9bXFxyXFxuXSsvKTtcclxuICAgICAgICBjb25zdCBjbGVhbmVkOiBBcnJheTxzdHJpbmc+ID0gW107XHJcblxyXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgodmFsdWU6IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZSh2YWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhbmVkLnB1c2godmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xlYW5lZDtcclxuICAgIH0sXHJcblxyXG4gICAgc3BsaXRCeVBpcGU6IChpbnB1dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZShpbnB1dCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBpbnB1dC5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWQ6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHJcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFuZWQucHVzaCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZUFuZE9yZGVyOiAoaW5wdXQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllc1xyXG4gICAgICAgICAgICAuc3BsaXRCeU5ld0xpbmUoaW5wdXQpXHJcbiAgICAgICAgICAgIC5zb3J0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpvaW5CeU5ld0xpbmU6IChpbnB1dDogQXJyYXk8c3RyaW5nPik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXRcclxuICAgICAgICAgICAgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuam9pbignXFxuJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUFsbENoaWxkcmVuOiAocGFyZW50OiBFbGVtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGlzT2RkOiAoeDogbnVtYmVyKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiB4ICUgMiA9PT0gMTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvcnRQcmludFRleHQ6IChcclxuICAgICAgICBpbnB1dDogc3RyaW5nLFxyXG4gICAgICAgIG1heExlbmd0aDogbnVtYmVyID0gMTAwKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3ROZXdMaW5lSW5kZXg6IG51bWJlciA9IGdVdGlsaXRpZXMuZ2V0Rmlyc3ROZXdMaW5lSW5kZXgoaW5wdXQpO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3ROZXdMaW5lSW5kZXggPiAwXHJcbiAgICAgICAgICAgICYmIGZpcnN0TmV3TGluZUluZGV4IDw9IG1heExlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQuc3Vic3RyKDAsIGZpcnN0TmV3TGluZUluZGV4IC0gMSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy50cmltQW5kQWRkRWxsaXBzaXMob3V0cHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGggPD0gbWF4TGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMudHJpbUFuZEFkZEVsbGlwc2lzKG91dHB1dCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRyaW1BbmRBZGRFbGxpcHNpczogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBpbnB1dC50cmltKCk7XHJcbiAgICAgICAgbGV0IHB1bmN0dWF0aW9uUmVnZXg6IFJlZ0V4cCA9IC9bLixcXC8jISQlXFxeJlxcKjs6e309XFwtX2B+KCldL2c7XHJcbiAgICAgICAgbGV0IHNwYWNlUmVnZXg6IFJlZ0V4cCA9IC9cXFcrL2c7XHJcbiAgICAgICAgbGV0IGxhc3RDaGFyYWN0ZXI6IHN0cmluZyA9IG91dHB1dFtvdXRwdXQubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGxldCBsYXN0Q2hhcmFjdGVySXNQdW5jdHVhdGlvbjogYm9vbGVhbiA9XHJcbiAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICB8fCBzcGFjZVJlZ2V4LnRlc3QobGFzdENoYXJhY3Rlcik7XHJcblxyXG5cclxuICAgICAgICB3aGlsZSAobGFzdENoYXJhY3RlcklzUHVuY3R1YXRpb24gPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zdWJzdHIoMCwgb3V0cHV0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsYXN0Q2hhcmFjdGVyID0gb3V0cHV0W291dHB1dC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGxhc3RDaGFyYWN0ZXJJc1B1bmN0dWF0aW9uID1cclxuICAgICAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICAgICAgfHwgc3BhY2VSZWdleC50ZXN0KGxhc3RDaGFyYWN0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke291dHB1dH0uLi5gO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGaXJzdE5ld0xpbmVJbmRleDogKGlucHV0OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICBsZXQgY2hhcmFjdGVyOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ1xcbidcclxuICAgICAgICAgICAgICAgIHx8IGNoYXJhY3RlciA9PT0gJ1xccicpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cHBlckNhc2VGaXJzdExldHRlcjogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zbGljZSgxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuZXJhdGVHdWlkOiAodXNlSHlwZW5zOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBsZXQgZDIgPSAocGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgJiYgcGVyZm9ybWFuY2Uubm93XHJcbiAgICAgICAgICAgICYmIChwZXJmb3JtYW5jZS5ub3coKSAqIDEwMDApKSB8fCAwO1xyXG5cclxuICAgICAgICBsZXQgcGF0dGVybiA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xyXG5cclxuICAgICAgICBpZiAoIXVzZUh5cGVucykge1xyXG4gICAgICAgICAgICBwYXR0ZXJuID0gJ3h4eHh4eHh4eHh4eDR4eHh5eHh4eHh4eHh4eHh4eHh4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWQgPSBwYXR0ZXJuXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgL1t4eV0vZyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDE2O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZCArIHIpICUgMTYgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZDIgKyByKSAlIDE2IHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZDIgPSBNYXRoLmZsb29yKGQyIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBndWlkO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0lmQ2hyb21lOiAoKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIC8vIHBsZWFzZSBub3RlLCBcclxuICAgICAgICAvLyB0aGF0IElFMTEgbm93IHJldHVybnMgdW5kZWZpbmVkIGFnYWluIGZvciB3aW5kb3cuY2hyb21lXHJcbiAgICAgICAgLy8gYW5kIG5ldyBPcGVyYSAzMCBvdXRwdXRzIHRydWUgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBidXQgbmVlZHMgdG8gY2hlY2sgaWYgd2luZG93Lm9wciBpcyBub3QgdW5kZWZpbmVkXHJcbiAgICAgICAgLy8gYW5kIG5ldyBJRSBFZGdlIG91dHB1dHMgdG8gdHJ1ZSBub3cgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBhbmQgaWYgbm90IGlPUyBDaHJvbWUgY2hlY2tcclxuICAgICAgICAvLyBzbyB1c2UgdGhlIGJlbG93IHVwZGF0ZWQgY29uZGl0aW9uXHJcblxyXG4gICAgICAgIGxldCB0c1dpbmRvdzogYW55ID0gd2luZG93IGFzIGFueTtcclxuICAgICAgICBsZXQgaXNDaHJvbWl1bSA9IHRzV2luZG93LmNocm9tZTtcclxuICAgICAgICBsZXQgd2luTmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcclxuICAgICAgICBsZXQgdmVuZG9yTmFtZSA9IHdpbk5hdi52ZW5kb3I7XHJcbiAgICAgICAgbGV0IGlzT3BlcmEgPSB0eXBlb2YgdHNXaW5kb3cub3ByICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIGxldCBpc0lFZWRnZSA9IHdpbk5hdi51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMTtcclxuICAgICAgICBsZXQgaXNJT1NDaHJvbWUgPSB3aW5OYXYudXNlckFnZW50Lm1hdGNoKFwiQ3JpT1NcIik7XHJcblxyXG4gICAgICAgIGlmIChpc0lPU0Nocm9tZSkge1xyXG4gICAgICAgICAgICAvLyBpcyBHb29nbGUgQ2hyb21lIG9uIElPU1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNDaHJvbWl1bSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAmJiB0eXBlb2YgaXNDaHJvbWl1bSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAmJiB2ZW5kb3JOYW1lID09PSBcIkdvb2dsZSBJbmMuXCJcclxuICAgICAgICAgICAgJiYgaXNPcGVyYSA9PT0gZmFsc2VcclxuICAgICAgICAgICAgJiYgaXNJRWVkZ2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIC8vIGlzIEdvb2dsZSBDaHJvbWVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVXRpbGl0aWVzOyIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuXHJcbiAgICBOb25lID0gJ25vbmUnLFxyXG4gICAgRmlsdGVyVG9waWNzID0gJ2ZpbHRlclRvcGljcycsXHJcbiAgICBHZXRUb3BpYyA9ICdnZXRUb3BpYycsXHJcbiAgICBHZXRUb3BpY0FuZFJvb3QgPSAnZ2V0VG9waWNBbmRSb290JyxcclxuICAgIFNhdmVBcnRpY2xlU2NlbmUgPSAnc2F2ZUFydGljbGVTY2VuZScsXHJcbiAgICBHZXRSb290ID0gJ2dldFJvb3QnLFxyXG4gICAgR2V0U3RlcCA9ICdnZXRTdGVwJyxcclxuICAgIEdldFBhZ2UgPSAnZ2V0UGFnZScsXHJcbiAgICBHZXRDaGFpbiA9ICdnZXRDaGFpbicsXHJcbiAgICBHZXRPdXRsaW5lID0gJ2dldE91dGxpbmUnLFxyXG4gICAgR2V0RnJhZ21lbnQgPSAnZ2V0RnJhZ21lbnQnLFxyXG4gICAgR2V0Q2hhaW5GcmFnbWVudCA9ICdnZXRDaGFpbkZyYWdtZW50J1xyXG59XHJcblxyXG4iLCJpbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwRWZmZWN0IGltcGxlbWVudHMgSUh0dHBFZmZlY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB1cmw6IHN0cmluZyxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25EZWxlZ2F0ZSA9IGFjdGlvbkRlbGVnYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheTtcclxufVxyXG4iLCJpbXBvcnQgSUFjdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQWN0aW9uXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSHR0cEVmZmVjdCBmcm9tIFwiLi4vLi4vc3RhdGUvZWZmZWN0cy9IdHRwRWZmZWN0XCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcblxyXG5cclxuLy8gVGhpcyBpcyB3aGVyZSBhbGwgYWxlcnRzIHRvIGRhdGEgY2hhbmdlcyBzaG91bGQgYmUgbWFkZVxyXG5jb25zdCBnU3RhdGVDb2RlID0ge1xyXG5cclxuICAgIGdldEZyZXNoS2V5SW50OiAoc3RhdGU6IElTdGF0ZSk6IG51bWJlciA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRLZXkgPSArK3N0YXRlLm5leHRLZXk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0S2V5O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGcmVzaEtleTogKHN0YXRlOiBJU3RhdGUpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7Z1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSl9YDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0R3VpZEtleTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBVLmdlbmVyYXRlR3VpZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBuZXdTdGF0ZTogSVN0YXRlID0geyAuLi5zdGF0ZSB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkZFJlTG9hZERhdGFFZmZlY3Q6IChcclxuICAgIC8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgLy8gICAgIG5hbWU6IHN0cmluZyxcclxuICAgIC8vICAgICB1cmw6IHN0cmluZyxcclxuICAgIC8vICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogdm9pZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGVmZmVjdDogSUh0dHBFZmZlY3QgfCB1bmRlZmluZWQgPSBzdGF0ZVxyXG4gICAgLy8gICAgICAgICAucmVwZWF0RWZmZWN0c1xyXG4gICAgLy8gICAgICAgICAucmVMb2FkR2V0SHR0cFxyXG4gICAgLy8gICAgICAgICAuZmluZCgoZWZmZWN0OiBJSHR0cEVmZmVjdCkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBlZmZlY3QubmFtZSA9PT0gbmFtZTtcclxuICAgIC8vICAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIGlmIChlZmZlY3QpIHsgLy8gYWxyZWFkeSBhZGRlZC5cclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgY29uc3QgaHR0cEVmZmVjdDogSUh0dHBFZmZlY3QgPSBuZXcgSHR0cEVmZmVjdChcclxuICAgIC8vICAgICAgICAgbmFtZSxcclxuICAgIC8vICAgICAgICAgdXJsLFxyXG4gICAgLy8gICAgICAgICBhY3Rpb25EZWxlZ2F0ZVxyXG4gICAgLy8gICAgICk7XHJcblxyXG4gICAgLy8gICAgIHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cC5wdXNoKGh0dHBFZmZlY3QpO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBBZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBlZmZlY3Q6IElIdHRwRWZmZWN0IHwgdW5kZWZpbmVkID0gc3RhdGVcclxuICAgICAgICAgICAgLnJlcGVhdEVmZmVjdHNcclxuICAgICAgICAgICAgLnJlTG9hZEdldEh0dHBJbW1lZGlhdGVcclxuICAgICAgICAgICAgLmZpbmQoKGVmZmVjdDogSUh0dHBFZmZlY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWZmZWN0Lm5hbWUgPT09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZWZmZWN0KSB7IC8vIGFscmVhZHkgYWRkZWQuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0ID0gbmV3IEh0dHBFZmZlY3QoXHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgYWN0aW9uRGVsZWdhdGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUucHVzaChodHRwRWZmZWN0KTtcclxuICAgIH0sXHJcblxyXG4gICAgQWRkUnVuQWN0aW9uSW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogSUFjdGlvbik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZS5wdXNoKGFjdGlvbkRlbGVnYXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RhdGVDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGVwVUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXBVSSBpbXBsZW1lbnRzIElTdGVwVUkge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcih1aUlEOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBlZ3M6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb3B0aW9uVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvblRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGF1dG9mb2N1czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBleHBhbmRPcHRpb25zOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbm90ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBlZ0Nyb3duOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcFVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwVUlcIjtcclxuaW1wb3J0IFN0ZXBVSSBmcm9tIFwiLi9TdGVwVUlcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXAgaW1wbGVtZW50cyBJU3RlcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgU3RlcFVJKHVpSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHRva2VuOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBvcHRpb25JbnRybzogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcmRlcjogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBzdWJUb2tlbjogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBsZWFmOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcHRpb25zOiBBcnJheTxJT3B0aW9uPiA9IFtdO1xyXG4gICAgcHVibGljIGJpbjogYW55ID0ge307XHJcblxyXG4gICAgcHVibGljIHVpOiBJU3RlcFVJO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBTdGVwVHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBSb290ID0gXCJyb290XCIsXHJcbiAgICBTdGVwID0gXCJzdGVwXCIsXHJcbiAgICBBbmNpbGxhcnlSb290ID0gXCJhbmNpbGxhcnlSb290XCIsXHJcbiAgICBBbmNpbGxhcnlTdGVwID0gXCJhbmNpbGxhcnlTdGVwXCJcclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcbmltcG9ydCBJT3B0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lPcHRpb25cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGVwQ2FjaGUgaW1wbGVtZW50cyBJU3RlcENhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnQuY2hhaW5JRDtcclxuICAgICAgICB0aGlzLmNoYWluSUQgPSBgJHtwYXJlbnQuY2hhaW5JRH0uJHtzdGVwLm9yZGVyfWA7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBVaUlEOiBudW1iZXIgPSBzdGVwLnVpLnVpSUQ7XHJcbiAgICAgICAgY29uc3QgcGFyZW50T3B0aW9uczogQXJyYXk8SU9wdGlvbj4gPSBwYXJlbnQuc3RlcC5vcHRpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRPcHRpb25zW2ldLnVpLnVpSUQgPT09IHN0ZXBVaUlEKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UZXh0ID0gcGFyZW50T3B0aW9uc1tpXS50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgXCJObyBtYXRjaGluZyB1aUlEIGluIHBhcmVudCBvcHRpb25zISEhXCJcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdGVwOiBJU3RlcDtcclxuICAgIHB1YmxpYyBjaGlsZHJlbjogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBhbmNpbGxhcmllczogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBwYXJlbnQ6IElTdGVwQ2FjaGU7XHJcbiAgICBwdWJsaWMgaGVpcjogSVN0ZXBDYWNoZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHR5cGU6IFN0ZXBUeXBlID0gU3RlcFR5cGUuU3RlcDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdENhY2hlIGltcGxlbWVudHMgSVN0ZXBDYWNoZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RlcDogSVN0ZXApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5jaGFpbklEID0gJzAuMSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXJlbnRDaGFpbklEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RlcDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgYW5jaWxsYXJpZXM6IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgcGFyZW50OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdHlwZTogU3RlcFR5cGUgPSBTdGVwVHlwZS5Sb290O1xyXG4gICAgcHVibGljIGhlaXI6IElTdGVwQ2FjaGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeVVybCBpbXBsZW1lbnRzIElIaXN0b3J5VXJsIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclNuYXBTaG90IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSVJlbmRlclNuYXBTaG90XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU25hcFNob3QgaW1wbGVtZW50cyBJUmVuZGVyU25hcFNob3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxuICAgIHB1YmxpYyBndWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjcmVhdGVkOiBEYXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbW9kaWZpZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBleHBhbmRlZE9wdGlvbklEczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIGV4cGFuZGVkQW5jaWxsYXJ5SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IEhpc3RvcnlVcmwgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvSGlzdG9yeVVybFwiO1xyXG5pbXBvcnQgUmVuZGVyU25hcFNob3QgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvUmVuZGVyU25hcFNob3RcIjtcclxuXHJcblxyXG5jb25zdCBnSGlzdG9yeUNvZGUgPSB7XHJcblxyXG4gICAgcmVzZXRSYXc6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVzaEJyb3dzZXJIaXN0b3J5U3RhdGU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5yZXNldFJhdygpO1xyXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBsYXN0VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaGlzdG9yeS5zdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5oaXN0b3J5LnN0YXRlLnVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhc3RVcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke2xvY2F0aW9uLnNlYXJjaH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0/JHtjdXJyZW50Lm91dGxpbmVGcmFnbWVudElEfWA7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VXJsXHJcbiAgICAgICAgICAgICYmIHVybCA9PT0gbGFzdFVybCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcclxuICAgICAgICAgICAgbmV3IFJlbmRlclNuYXBTaG90KHVybCksXHJcbiAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnN0ZXBIaXN0b3J5Lmhpc3RvcnlDaGFpbi5wdXNoKG5ldyBIaXN0b3J5VXJsKHVybCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0hpc3RvcnlDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi9TdGVwXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcE9wdGlvbiBleHRlbmRzIFN0ZXAgaW1wbGVtZW50cyBJT3B0aW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcixcclxuICAgICAgICB0ZXh0OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICB1aUlELFxyXG4gICAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYW5jaWxsYXJ5OiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSVN0ZXAgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBcIjtcclxuaW1wb3J0IFN0ZXBDYWNoZSBmcm9tIFwiLi9TdGVwQ2FjaGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmNpbGxhcnlDYWNoZSBleHRlbmRzIFN0ZXBDYWNoZSBpbXBsZW1lbnRzIElTdGVwQ2FjaGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNBbmNpbGxhcnk6IGJvb2xlYW4gPSB0cnVlO1xyXG59XHJcbiIsImltcG9ydCBJQXJ0aWNsZVNjZW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUFydGljbGVTY2VuZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGVTY2VuZSBpbXBsZW1lbnRzIElBcnRpY2xlU2NlbmUge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHI6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGd1aWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGV4cGFuZGVkT3B0aW9uSURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwdWJsaWMgZXhwYW5kZWRBbmNpbGxhcnlJRHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxufVxyXG4iLCJpbXBvcnQgSUNoYWluUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5QYXlsb2FkXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhaW5QYXlsb2FkIGltcGxlbWVudHMgSUNoYWluUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcikge1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXBJRCA9IHN0ZXBJRDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIHRoaXMudWlJRCA9IHVpSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0ZXBJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB1aUlEOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYWluU3RlcFBheWxvYWQgaW1wbGVtZW50cyBJQ2hhaW5TdGVwUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXAsXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcElEID0gc3RlcElEO1xyXG4gICAgICAgIHRoaXMucGFyZW50Q2hhaW5JRCA9IHBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RlcElEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcGFyZW50Q2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUFydGljbGVTY2VuZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lBcnRpY2xlU2NlbmVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSU9wdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JT3B0aW9uXCI7XHJcbmltcG9ydCBBcnRpY2xlU2NlbmUgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvQXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL3N0YXRlL3VpL3BheWxvYWRzL0NoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5pbXBvcnQgZ1N0ZXBBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dTdGVwQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuL2dIaXN0b3J5Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcENvZGUgZnJvbSBcIi4vZ1N0ZXBDb2RlXCI7XHJcblxyXG5jb25zdCBnQXJ0aWNsZUNvZGUgPSB7XHJcblxyXG4gICAgY2hlY2tJZk9wdGlvbnNFeHBhbmRlZDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcENhY2hlOiBJU3RlcENhY2hlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZVxyXG4gICAgICAgICAgICB8fCAhc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gYmUgYWJsZSB0byBsb2FkIHRoZSBjaGFpbiBhbmQgbG9hZCBvcHRpb25zIGJ1dCBvbmx5IGFsbG93ZWQgdG8gZG8gb25lPz9cclxuICAgICAgICAvLyBOZWVkIHRvIGxvYWQgdGhlc2UgXHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcENhY2hlLnN0ZXAub3B0aW9ucztcclxuICAgICAgICBsZXQgb3B0aW9uOiBJT3B0aW9uO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5QYXlsb2FkKFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24udWkudWlJRFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5zaG93QW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5TdGVwUGF5bG9hZChcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnVpLnVpSURcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMuZXhwYW5kT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmU6IChyYXdBcnRpY2xlU2NlbmU6IGFueSk6IElBcnRpY2xlU2NlbmUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QXJ0aWNsZVNjZW5lLmd1aWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IG5ldyBBcnRpY2xlU2NlbmUoKTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUua2V5ID0gcmF3QXJ0aWNsZVNjZW5lLmtleTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUuciA9IHJhd0FydGljbGVTY2VuZS5yO1xyXG4gICAgICAgIGFydGljbGVTY2VuZS5ndWlkID0gcmF3QXJ0aWNsZVNjZW5lLmd1aWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgPSByYXdBcnRpY2xlU2NlbmUuY3JlYXRlZDtcclxuICAgICAgICBhcnRpY2xlU2NlbmUubW9kaWZpZWQgPSByYXdBcnRpY2xlU2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEc107XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEc107XHJcblxyXG4gICAgICAgIHJldHVybiBhcnRpY2xlU2NlbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmVDYWNoZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QXJ0aWNsZVNjZW5lOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lIHwgbnVsbCA9IGdBcnRpY2xlQ29kZS5sb2FkQXJ0aWNsZVNjZW5lKHJhd0FydGljbGVTY2VuZSk7XHJcblxyXG4gICAgICAgIGlmICghYXJ0aWNsZVNjZW5lKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmFydGljbGVTY2VuZSA9IGFydGljbGVTY2VuZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lID0gZ0FydGljbGVDb2RlLmNsb25lKHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lKTtcclxuXHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGRBcnRpY2xlU2NlbmU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FsbGVkIGJ1aWxkQXJ0aWNsZVNjZW5lXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGU/LnJvb3RcclxuICAgICAgICAgICAgfHwgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lID0gbmV3IEFydGljbGVTY2VuZSgpO1xyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICByb290Q2FjaGUsXHJcbiAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lID0gYXJ0aWNsZVNjZW5lO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBTY2VuZTogKFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwsXHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RlcENhY2hlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwQ2FjaGUuYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNhY2hlID0gc3RlcENhY2hlLmFuY2lsbGFyaWVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMucHVzaChhbmNpbGxhcnlDYWNoZS5zdGVwLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZVNjZW5lXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZUNhc3Q6IElTdGVwQ2FjaGUgPSBzdGVwQ2FjaGUgYXMgSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ1N0ZXBDb2RlLmhhc011bHRpcGxlU2ltcGxlT3B0aW9ucyhzdGVwQ2FjaGUuc3RlcC5vcHRpb25zKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcy5wdXNoKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyLnN0ZXAuaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICBhbmNpbGxhcnlDYWNoZUNhc3QuaGVpcixcclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzdGVwQ2FjaGUuaGVpcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGdTdGVwQ29kZS5oYXNNdWx0aXBsZVNpbXBsZU9wdGlvbnMoc3RlcENhY2hlLnN0ZXAub3B0aW9ucykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMucHVzaChzdGVwQ2FjaGUuaGVpci5zdGVwLmlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlLmhlaXIsXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lOiAoc2NlbmU6IElBcnRpY2xlU2NlbmUpOiBJQXJ0aWNsZVNjZW5lID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgQXJ0aWNsZVNjZW5lKCk7XHJcbiAgICAgICAgY2xvbmUua2V5ID0gc2NlbmUua2V5O1xyXG4gICAgICAgIGNsb25lLnIgPSBzY2VuZS5yO1xyXG4gICAgICAgIGNsb25lLmd1aWQgPSBzY2VuZS5ndWlkO1xyXG4gICAgICAgIGNsb25lLmNyZWF0ZWQgPSBzY2VuZS5jcmVhdGVkO1xyXG4gICAgICAgIGNsb25lLm1vZGlmaWVkID0gc2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgY2xvbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMgPSBbLi4uc2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHNdO1xyXG4gICAgICAgIGNsb25lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnNjZW5lLmV4cGFuZGVkT3B0aW9uSURzXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc1NjZW5lQ2hhbmdlZDogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lID0gc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmU7XHJcbiAgICAgICAgY29uc3QgZ2hvc3RBcnRpY2xlU2NlbmUgPSBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lO1xyXG5cclxuICAgICAgICBpZiAoIWFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgJiYgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnaG9zdEFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICB8fCBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGFuZ2VkID1cclxuICAgICAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmNyZWF0ZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmd1aWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmd1aWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmtleSAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUua2V5XHJcbiAgICAgICAgICAgIHx8IGFydGljbGVTY2VuZS5tb2RpZmllZCAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUubW9kaWZpZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLnIgIT09IGdob3N0QXJ0aWNsZVNjZW5lLnJcclxuICAgICAgICAgICAgfHwgIVUuY2hlY2tBcnJheXNFcXVhbChhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMsIGdob3N0QXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzKVxyXG4gICAgICAgICAgICB8fCAhVS5jaGVja0FycmF5c0VxdWFsKGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcywgZ2hvc3RBcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hhbmdlZDtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdBcnRpY2xlQ29kZTtcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcFwiO1xyXG5pbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1N0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgUm9vdENhY2hlIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Sb290Q2FjaGVcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcE9wdGlvbiBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcE9wdGlvblwiO1xyXG5pbXBvcnQgQW5jaWxsYXJ5Q2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdTdGVwQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9nU3RlcEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJSEpzb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvaEpzb24vSUhKc29uXCI7XHJcbmltcG9ydCBnQXJ0aWNsZUNvZGUgZnJvbSBcIi4vZ0FydGljbGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYnVpbGRUaXRsZSA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLnRpdGxlKSA9PT0gZmFsc2VcclxuICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnRleHQpKSB7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4gPSBKU09OLnBhcnNlKHN0ZXAudGV4dCk7XHJcbiAgICBzdGVwLnVpLnRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZE9wdGlvblRpdGxlID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSBmYWxzZVxyXG4gICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAub3B0aW9uSW50cm8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGpzb25FbGVtZW50czogQXJyYXk8SUhKc29uPiA9IEpTT04ucGFyc2Uoc3RlcC5vcHRpb25JbnRybyk7XHJcbiAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwLnVpLnBlZ3MubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UaXRsZSA9IHN0ZXAudWkucGVnc1tzdGVwLnVpLnBlZ3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLm9wdGlvblRpdGxlKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gc3RlcC51aS50aXRsZTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkVGl0bGVGcm9tSnNvbiA9IChqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4pOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmIChqc29uRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBjaGVja0NoaWxkcmVuRm9yVGl0bGUoanNvbkVsZW1lbnRzKTtcclxuXHJcbiAgICByZXR1cm4gdGl0bGU7XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0VsZW1lbnRGb3JUaXRsZSA9IChlbGVtZW50OiBJSEpzb24gfCBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmICghZWxlbWVudCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hlY2tDaGlsZHJlbkZvclRpdGxlKGVsZW1lbnQuY2hpbGRyZW4pO1xyXG59O1xyXG5cclxuY29uc3QgY2hlY2tDaGlsZHJlbkZvclRpdGxlID0gKGNoaWxkcmVuOiBBcnJheTxJSEpzb24gfCBzdHJpbmc+KTogc3RyaW5nID0+IHtcclxuXHJcbiAgICBpZiAoIWNoaWxkcmVuXHJcbiAgICAgICAgfHwgIWNoaWxkcmVuLmxlbmd0aFxyXG4gICAgICAgIHx8IGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGVja0VsZW1lbnRGb3JUaXRsZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBmaW5kUGVncyA9IChcclxuICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgaW5wdXQ6IEFycmF5PGFueT4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBsZXQgZWxlbWVudDogYW55O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudFxyXG4gICAgICAgICAgICAmJiBlbGVtZW50LmNoaWxkcmVuKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IC9eaFsxLTNdJC87XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4udGVzdChlbGVtZW50Lm5hbWUpKSB7IC8vIGlzIGEgaGVhZGVyXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ3MucHVzaChlbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5hdHRyaWJ1dGVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5pZCA9IGdTdGVwQ29kZS5idWlsZFBlZ0lEKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS51aUlELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS5wZWdzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLmNsYXNzID0gJ3BlZyBuYXYnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ0Nyb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5jbGFzcyA9IGAke2VsZW1lbnQuYXR0cmlidXRlcy5jbGFzc30gY3Jvd25gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbmRQZWdzKFxyXG4gICAgICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBsb2FkUGVncyA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShzdGVwLnRleHQpO1xyXG5cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcblxyXG4gICAgICAgICAgICBmaW5kUGVncyhcclxuICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0ZXAudGV4dCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2gge1xyXG4gICAgICAgIC8vIHN3YWxsb3dcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNjYW5UZXh0ID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgY29uc3QgdGV4dDogc3RyaW5nID0gc3RlcC50ZXh0LnRyaW0oKTtcclxuICAgIGNvbnN0IG5vdGU6IHN0cmluZyA9ICdbe1wibmFtZVwiOlwicFwiLFwiYXR0cmlidXRlc1wiOntcImNsYXNzXCI6XCJOT1RFXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKG5vdGUpKSB7XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBub3RlLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHRleHRbbGVuZ3RoXSA9PT0gJywnKSB7XHJcblxyXG4gICAgICAgICAgICBsZW5ndGgrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudGV4dCA9IGBbJHtzdGVwLnRleHQuc3Vic3RyaW5nKGxlbmd0aCl9YDtcclxuICAgICAgICBzdGVwLnVpLm5vdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZW5kOiBzdHJpbmcgPSAnW3tcIm5hbWVcIjpcInBcIixcImF0dHJpYnV0ZXNcIjp7XCJjbGFzc1wiOlwiRU5EXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKGVuZCkpIHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGVuZC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0W2xlbmd0aF0gPT09ICcsJykge1xyXG5cclxuICAgICAgICAgICAgbGVuZ3RoKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGVwLnRleHQgPSBgWyR7c3RlcC50ZXh0LnN1YnN0cmluZyhsZW5ndGgpfWA7XHJcbiAgICAgICAgc3RlcC51aS5lbmQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFBlZ3Moc3RlcCk7XHJcbiAgICBidWlsZFRpdGxlKHN0ZXApO1xyXG4gICAgYnVpbGRPcHRpb25UaXRsZShzdGVwKTtcclxufTtcclxuXHJcbmNvbnN0IGxvYWRTdGVwID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd1N0ZXA6IGFueSxcclxuICAgIHVpSUQ6IG51bWJlcik6IElTdGVwID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwOiBJU3RlcCA9IG5ldyBTdGVwKFxyXG4gICAgICAgIHJhd1N0ZXAuaWQsXHJcbiAgICAgICAgdWlJRCwgLy8gZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgcmF3U3RlcC50b2tlblxyXG4gICAgKTtcclxuXHJcbiAgICBzdGVwLnRleHQgPSByYXdTdGVwLnRleHQ7XHJcbiAgICBzdGVwLm9wdGlvbkludHJvID0gcmF3U3RlcC5vcHRpb25JbnRybztcclxuICAgIHN0ZXAuc3ViVG9rZW4gPSByYXdTdGVwLnN1YlRva2VuO1xyXG4gICAgc3RlcC50eXBlID0gcmF3U3RlcC50eXBlO1xyXG4gICAgc3RlcC5sZWFmID0gcmF3U3RlcC5vcHRpb25zPy5sZW5ndGggPT09IDA7XHJcblxyXG4gICAgcmF3U3RlcC5vcHRpb25zLmZvckVhY2goKHJhd09wdGlvbjogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IGxvYWRPcHRpb24oXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdPcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGVwLm9wdGlvbnMucHVzaChvcHRpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3RlcC5iaW4gPSByYXdTdGVwLmJpbjtcclxuICAgIHNjYW5UZXh0KHN0ZXApO1xyXG5cclxuICAgIHJldHVybiBzdGVwO1xyXG59O1xyXG5cclxuY29uc3QgbG9hZE9wdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXc6IGFueSk6IElPcHRpb24gPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgIHJhdy5pZCxcclxuICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKSxcclxuICAgICAgICByYXcudGV4dFxyXG4gICAgKTtcclxuXHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXcub3JkZXI7XHJcbiAgICBvcHRpb24uYW5jaWxsYXJ5ID0gcmF3LmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuICAgIG9wdGlvbi5iaW4gPSByYXcuYmluO1xyXG5cclxuICAgIHJldHVybiBvcHRpb247XHJcbn07XHJcblxyXG5jb25zdCBnU3RlcENvZGUgPSB7XHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBnQXJ0aWNsZUNvZGUuY2hlY2tJZk9wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgbmVlZCB0byBjaGVjayBpZiB0aGUgY2hhaW5TdGVwQ2FjaGUuc3RlcCBoYXMgYSBzaW5nbGUgb3B0aW9uXHJcbiAgICAgICAgLy8gSWYgaXQgZG9lcyBsb2FkIGl0IGluIHRoZSBiYWNrZ3JvdW5kXHJcbiAgICAgICAgLy8gVGhlbiBuZWVkIHRvIGFkZCBpdCB0byB0aGUgY2hpbGRyZW4gb2YgdGhlIHBhcmVudCBhbmQgc2V0IGl0IHRvIHRoZSBjaGFpbiBvZiB0aGUgcGFyZW50XHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgPSBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5zdGVwO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIHplcm8gLSBubyBjaG9pY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBvciBtb3JlIHRoYW4gb25lIG9wdGlvbiAtIHNvIHRoZSB1c2VyIG11c3QgbWFrZSB0aGUgY2hvaWNlLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBPbmUgb3B0aW9uIHNvIGxvYWQgaXQgYW5kIHNhdmUgdGhlIHVzZXIgYSBidXR0b24gY2xpY2suXHJcbiAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2hhaW5TdGVwQ2FjaGUuY2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZS5zdGVwLnVpLnVpSUQgPSBvcHRpb24udWkudWlJRDtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBgU3RlcC8ke29wdGlvbi5pZH1gO1xyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYXBpVXJsfS8ke3BhdGh9YDtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklEOiBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5jaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRDogb3B0aW9uPy51aS51aUlEXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnlDaGFpblN0ZXAoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnU3RhdGVDb2RlLkFkZFJlTG9hZERhdGFFZmZlY3RJbW1lZGlhdGUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBgTG9hZCBhbmNpbGxhcnk6ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5TdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmNoZWNrSWZPcHRpb25zRXhwYW5kZWQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBjaGFpblN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IG5lZWQgdG8gY2hlY2sgaWYgdGhlIGNoYWluU3RlcENhY2hlLnN0ZXAgaGFzIGEgc2luZ2xlIG9wdGlvblxyXG4gICAgICAgIC8vIElmIGl0IGRvZXMgbG9hZCBpdCBpbiB0aGUgYmFja2dyb3VuZFxyXG4gICAgICAgIC8vIFRoZW4gbmVlZCB0byBhZGQgaXQgdG8gdGhlIGNoaWxkcmVuIG9mIHRoZSBwYXJlbnQgYW5kIHNldCBpdCB0byB0aGUgY2hhaW4gb2YgdGhlIHBhcmVudFxyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gY2hhaW5TdGVwQ2FjaGUuc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9yZSB0aGFuIG9uZSBvcHRpb24gLSBzbyB0aGUgdXNlciBtdXN0IG1ha2UgdGhlIGNob2ljZS5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT25lIG9wdGlvbiBzbyBsb2FkIGl0IGFuZCBzYXZlIHRoZSB1c2VyIGEgYnV0dG9uIGNsaWNrLlxyXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgIHRydWVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkudWlJRCA9IG9wdGlvbi51aS51aUlEO1xyXG4gICAgICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgICAgICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBOZWVkIHRvIGxvYWQgY2hhaW4gXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5sb2FkQ2hhaW4oXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF0aDogc3RyaW5nID0gYFN0ZXAvJHtvcHRpb24uaWR9YDtcclxuICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50Q2hhaW5JRDogY2hhaW5TdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgIHVpSUQ6IG9wdGlvbj8udWkudWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQ2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ1N0YXRlQ29kZS5BZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYExvYWQgY2hhaW46ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkUGVnSUQ6IChcclxuICAgICAgICBzdGVwVWlJRDogbnVtYmVyLFxyXG4gICAgICAgIHBlZ0NvdW50ZXI6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBgcGVnLSR7c3RlcFVpSUR9LSR7cGVnQ291bnRlcn1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBJRDogKHN0ZXBVaUlEOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYHN0ZXAtJHtzdGVwVWlJRH1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZE9wdGlvbkludHJvSUQ6IChzdGVwVWlJRDogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBvcHRpb25zLSR7c3RlcFVpSUR9YDtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGROYXZJRDogKHN0ZXBVaUlEOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYG5hdi0ke3N0ZXBVaUlEfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldElERnJvbU5hdklEOiAobmF2SUQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuYXZJRC5zdWJzdHJpbmcoNCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhc011bHRpcGxlU2ltcGxlT3B0aW9uczogKG9wdGlvbnM6IEFycmF5PElPcHRpb24+KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5hbmNpbGxhcnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICArK29wdGlvbkNvdW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9uQ291bnQgPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZU9wdGlvbnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0czogQXJyYXk8SVN0ZXA+KTogQXJyYXk8SVN0ZXA+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9uczogQXJyYXk8SVN0ZXA+ID0gW107XHJcbiAgICAgICAgbGV0IGlucHV0OiBJU3RlcDtcclxuICAgICAgICBsZXQgb3B0aW9uOiBJU3RlcDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gZ1N0ZXBDb2RlLmNsb25lT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0OiBJU3RlcCxcclxuICAgICAgICBuZXdJRDogc3RyaW5nIHwgbnVsbCA9IG51bGwpOiBJT3B0aW9uID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFuZXdJRCkge1xyXG5cclxuICAgICAgICAgICAgbmV3SUQgPSBpbnB1dC5pZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgICAgICBuZXdJRCxcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgICAgIGlucHV0LnRleHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBvcHRpb24ub3JkZXIgPSBpbnB1dC5vcmRlcjtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0LmJpbikge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uLmJpbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5wdXQuYmluKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcHRpb24uYW5jaWxsYXJ5ID0gKGlucHV0IGFzIElPcHRpb24pLmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVTdGVwQ2FjaGU6IChcclxuICAgICAgICBpbnB1dDogSVN0ZXBDYWNoZSxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgU3RlcENhY2hlKFxyXG4gICAgICAgICAgICBpbnB1dC5zdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lUm9vdENhY2hlOiAoaW5wdXQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKGlucHV0LnN0ZXApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEN1cnJlbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUFuZExvYWRTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdTdGVwOiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdTdGVwXHJcbiAgICAgICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHJhd1N0ZXAuaWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlQW5kTG9hZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QW5jaWxsYXJ5OiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBbmNpbGxhcnlcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QW5jaWxsYXJ5LmlkKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdBbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHVpSURcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkUm9vdDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsKTogSVN0ZXBDYWNoZSB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uoc3RlcElEKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkOiBBcnJheTxJU3RlcENhY2hlPiA9IHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLmZpbHRlcigocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcElEID09PSByZWcuc3RlcC5pZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByb290Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSByZWdpc3RlcmVkLmZpbmQoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZy5wYXJlbnRDaGFpbklEID09PSAnMCc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyb290Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByb290Q2FjaGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBDb2RlLmNsb25lUm9vdENhY2hlKHJlZ2lzdGVyZWRbMF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICByZWdpc3RlckhlaXI6IGJvb2xlYW4gPSBmYWxzZSk6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXBJRCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maWx0ZXIoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0ZXBJRCA9PT0gcmVnLnN0ZXAuaWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZWdpc3RlcmVkLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gcmVnaXN0ZXJlZC5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZWdpc3RlckhlaXJcclxuICAgICAgICAgICAgJiYgc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnRDYWNoZS5cIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5jbG9uZVN0ZXBDYWNoZShcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRbMF0sXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEFuY2lsbGFyeUNoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlckFuY2lsbGFyeUNoaWxkKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50Q2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlclN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICB0cnVlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDaGlsZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgYW5jaWxsYXJ5OiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUucmVnaXN0ZXJBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBhbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5Q2hpbGQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyk6IElTdGVwQ2FjaGUgPT4ge1xyXG5cclxuICAgICAgICBsZXQgcGFyZW50Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcuY2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFwYXJlbnRDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZmluZCBwYXJlbnQgc3RlcFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmVuQ2FjaGUgd2FzIG51bGwuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50QW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBwYXJlbnRDYWNoZSBhcyBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudENhY2hlPy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudENhY2hlPy5jaGlsZHJlbltpXS5zdGVwLmlkID09PSBzdGVwLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQYXJlbnQgaGFzIG1hdGNoaW5nIGNoaWxkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBBbmNpbGxhcnlDYWNoZShcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUuc2V0T3JkZXJGcm9tUGFyZW50KGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChhbmNpbGxhcnlDYWNoZSk7XHJcbiAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGUuaGVpciA9IGFuY2lsbGFyeUNhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IHN0ZXAgYXMgSU9wdGlvbjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXNbaV0uc3RlcC5pZCA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYFBhcmVudCBoYXMgbWF0Y2hpbmcgYW5jaWxsYXJ5YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gbmV3IEFuY2lsbGFyeUNhY2hlKFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoYW5jaWxsYXJ5Q2FjaGUpO1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuICAgICAgICBwYXJlbnRDYWNoZS5hbmNpbGxhcmllcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgcGFyZW50Q2FjaGUuYW5jaWxsYXJpZXMuc29ydCgoYSwgYikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEIDwgYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEID4gYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFuY2lsbGFyeUNhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRPcmRlckZyb21QYXJlbnQ6IChzdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZS5zdGVwXHJcbiAgICAgICAgICAgIHx8ICFzdGVwQ2FjaGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gc3RlcENhY2hlLnN0ZXA7XHJcbiAgICAgICAgY29uc3Qgc3RlcElEOiBzdHJpbmcgPSBzdGVwLmlkO1xyXG5cclxuICAgICAgICBjb25zdCBzeWJsaW5nczogQXJyYXk8SU9wdGlvbj4gPSBzdGVwQ2FjaGUucGFyZW50Py5zdGVwLm9wdGlvbnM7XHJcbiAgICAgICAgbGV0IHN5Ymxpbmc6IElPcHRpb247XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3libGluZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHN5YmxpbmcgPSBzeWJsaW5nc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzeWJsaW5nLmlkID09PSBzdGVwSUQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGVwLm9yZGVyID0gc3libGluZy5vcmRlcjtcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZS5jaGFpbklEID0gYCR7c3RlcENhY2hlLnBhcmVudENoYWluSUR9LiR7c3RlcC5vcmRlcn1gO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAgICAgcmVnaXN0ZXJIZWlyOiBib29sZWFuID0gZmFsc2UpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50Q2FjaGU/LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Q2FjaGU/LmNoaWxkcmVuW2ldLnN0ZXAuaWQgPT09IHN0ZXAuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlBhcmVudCBoYXMgbWF0Y2hpbmcgY2hpbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgIHBhcmVudENhY2hlLmNoaWxkcmVuLnB1c2goc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXBDYWNoZTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0b3BpY1N0YXRlLnRvcGljQ2FjaGUgd2FzIG51bGxcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKHN0ZXApO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLnB1c2gocm9vdENhY2hlKTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gcm9vdENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUNoYWluU3RlcHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1N0ZXBzOiBBcnJheTxhbnk+LFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcik6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcztcclxuXHJcbiAgICAgICAgbGV0IHN0ZXA6IElTdGVwIHwgbnVsbDtcclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDE7XHJcblxyXG4gICAgICAgIC8vIGZpcnN0IHN0ZXAgaXMgdGhlIHJvb3RcclxuICAgICAgICAvLyBlYWNoIG5leHQgc3RlcCBpcyBhIGNoaWxkIG9mIHRoZSBwcmV2aW91cyBzdGVwXHJcblxyXG4gICAgICAgIHJhd1N0ZXBzLmZvckVhY2goKHJhd1N0ZXA6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgc3RlcCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlID0gbmV3IFJvb3RDYWNoZShzdGVwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q2FjaGUuY2hpbGRyZW4ucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlLmhlaXIgPSBzdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJlZC5wdXNoKHN0ZXBDYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZSA9IHN0ZXBDYWNoZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gc3RhdGUudG9waWNTdGF0ZS5kZWVwZXN0U3RlcCA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpczogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZm9yRWFjaCgoc3RlcENhY2NoZTogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpKHN0ZXBDYWNjaGUuc3RlcCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpOiAoc3RlcDogSVN0ZXApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RlcC51aS5leHBhbmRPcHRpb25zID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrU3RlcEZvckV4cGFuZGVkQW5jaWxsYXJ5OiAoc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBDYWNoZS5hbmNpbGxhcmllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUgPSBzdGVwQ2FjaGUuYW5jaWxsYXJpZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQ29kZS5jaGVja1N0ZXBGb3JFeHBhbmRlZEFuY2lsbGFyeShzdGVwQ2FjaGUucGFyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBDb2RlO1xyXG5cclxuIiwiXHJcblxyXG5jb25zdCBnU2Vzc2lvbiA9IHtcclxuXHJcbiAgICBnZXRWaWRlb1N0YXRlOiAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZUpzb246IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd2aWRlb1N0YXRlJyk7XHJcblxyXG4gICAgICAgIGlmICghdmlkZW9TdGF0ZUpzb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aWRlb1N0YXRlSnNvblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRWaWRlb1N0YXRlOiAodmlkZW9TdGF0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgICAgICd2aWRlb1N0YXRlJywgXHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHZpZGVvU3RhdGUpKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJWaWRlb1N0YXRlOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ3ZpZGVvU3RhdGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRm9jdXNcclxuICAgIGdldEZvY3VzRmlsdGVyOiAoKTogc3RyaW5nID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgY29uc3QgZmlsdGVyOiBzdHJpbmcgfCBudWxsID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZm9jdXNGaWx0ZXInKTtcclxuXHJcbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbHRlclxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRGb2N1c0ZpbHRlcjogKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZm9jdXNGaWx0ZXInLCB2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQWxsRm9jdXNGaWx0ZXJzOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2ZvY3VzRmlsdGVyJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUZvY3VzRmlsdGVyOiAoZmlsdGVyOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudEZpbHRlciA9IGdTZXNzaW9uLmdldEZvY3VzRmlsdGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIgPT09IGN1cnJlbnRGaWx0ZXIpIHtcclxuICAgICAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU2Vzc2lvbjsiLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1Nlc3Npb24gZnJvbSBcIi4uL2dTZXNzaW9uXCI7XHJcblxyXG5cclxuY29uc3QgZ0h0bWxBY3Rpb25zID0ge1xyXG5cclxuICAgIGNsZWFyRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0FuZFNjcm9sbFRvVG9wOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlLnRvcGljU3RhdGUuaXNBcnRpY2xlVmlldykge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9Ub3AgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdIdG1sQWN0aW9ucztcclxuIiwiaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpYyBpbXBsZW1lbnRzIElUb3BpYyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICByb290RGtJRDogc3RyaW5nLFxyXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXHJcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nLFxyXG4gICAgICAgIHRva2VuOiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICB0YWdzOiBBcnJheTxzdHJpbmc+LFxyXG4gICAgICAgIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbCxcclxuICAgICAgICBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnJvb3REa0lEID0gcm9vdERrSUQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjcmVhdGVkO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZWQgPSBtb2RpZmllZDtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHJvb3REa0lEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdG9rZW46IHN0cmluZztcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsO1xyXG4gICAgcHVibGljIG1vZGlmaWVkOiBEYXRlIHwgbnVsbDtcclxuICAgIHB1YmxpYyB0YWdzOiBBcnJheTxzdHJpbmc+O1xyXG59XHJcbiIsImltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IElUb3BpY0NhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lUb3BpY0NhY2hlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNDYWNoZSBpbXBsZW1lbnRzIElUb3BpY0NhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0b3BpYzogSVRvcGljKSB7XHJcblxyXG4gICAgICAgIHRoaXMudG9waWMgPSB0b3BpYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9waWM6IElUb3BpYztcclxuICAgIHB1YmxpYyByb290OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IFRvcGljIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Ub3BpY1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljQ2FjaGVcIjtcclxuaW1wb3J0IFRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1RvcGljQ2FjaGVcIjtcclxuaW1wb3J0IGdBcnRpY2xlQ29kZSBmcm9tIFwiLi9nQXJ0aWNsZUNvZGVcIjtcclxuXHJcbmNvbnN0IGdUb3BpY0NvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljQ2FjaGU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1RvcGljOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyB8IG51bGwgPSBnVG9waWNDb2RlLmxvYWRUb3BpYyhyYXdUb3BpYyk7XHJcblxyXG4gICAgICAgIGlmICghdG9waWMpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b3BpYy5pZCA9PT0gc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYy5pZCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdG9waWNDYWNoZTogSVRvcGljQ2FjaGUgPSBuZXcgVG9waWNDYWNoZSh0b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljQ2FjaGUucm9vdCA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuICAgICAgICAgICAgc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlID0gdG9waWNDYWNoZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyVG9waWM6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gbnVsbDtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRUb3BpYzogKHJhd1RvcGljOiBhbnkpOiBJVG9waWMgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdUb3BpY1xyXG4gICAgICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShyYXdUb3BpYy5pZCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyA9IG5ldyBUb3BpYyhcclxuICAgICAgICAgICAgcmF3VG9waWMuaWQsXHJcbiAgICAgICAgICAgIHJhd1RvcGljLnJvb3REa0lELFxyXG4gICAgICAgICAgICByYXdUb3BpYy50aXRsZSxcclxuICAgICAgICAgICAgcmF3VG9waWMudmVyc2lvbixcclxuICAgICAgICAgICAgcmF3VG9waWMudG9rZW4sXHJcbiAgICAgICAgICAgIHJhd1RvcGljLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICByYXdUb3BpYy50YWdzLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5jcmVhdGVkLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5tb2RpZmllZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpYztcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFRvcGljczogKHJhd1RvcGljczogYW55W10pOiBBcnJheTxJVG9waWM+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWNzOiBBcnJheTxJVG9waWM+ID0gW107XHJcblxyXG4gICAgICAgIGlmICghcmF3VG9waWNzXHJcbiAgICAgICAgICAgIHx8IHJhd1RvcGljcy5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9waWM6IElUb3BpYyB8IG51bGw7XHJcblxyXG4gICAgICAgIHJhd1RvcGljcy5mb3JFYWNoKChyYXdUb3BpYzogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0b3BpYyA9IGdUb3BpY0NvZGUubG9hZFRvcGljKHJhd1RvcGljKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xyXG4gICAgICAgICAgICAgICAgdG9waWNzLnB1c2godG9waWMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlOiAodG9waWM6IElUb3BpYyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRvcGljKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBVLmlzTnVsbE9yV2hpdGVTcGFjZSh0b3BpYy50aXRsZSlcclxuICAgICAgICAgICAgPyBcIlwiXHJcbiAgICAgICAgICAgIDogdG9waWMudGl0bGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlRnJvbVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdUb3BpY0NvZGUuZ2V0VGl0bGUoc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtPcHRpb25FeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5vcHRpb25FeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtBbmNpbGxhcnlFeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5hbmNpbGxhcnlFeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzU3RhdGVEaXJ0eTogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdBcnRpY2xlQ29kZS5pc1NjZW5lQ2hhbmdlZChzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IGdTdGVwQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IGdTdGVwRWZmZWN0cyBmcm9tIFwiLi4vZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vY29kZS9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgSUNoYWluU3RlcFBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluU3RlcFBheWxvYWRcIjtcclxuaW1wb3J0IGdIdG1sQWN0aW9ucyBmcm9tIFwiLi9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdUb3BpY0NvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljQ29kZVwiO1xyXG5pbXBvcnQgZ0FydGljbGVDb2RlIGZyb20gXCIuLi9jb2RlL2dBcnRpY2xlQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdTdGVwQWN0aW9ucyA9IHtcclxuXHJcbiAgICBleHBhbmRPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluU3RlcFBheWxvYWQ6IElDaGFpblN0ZXBQYXlsb2FkKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWNoYWluU3RlcFBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya09wdGlvbkV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgZ0h0bWxBY3Rpb25zLmNoZWNrQW5kU2Nyb2xsVG9Ub3Aoc3RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcFBheWxvYWQucGFyZW50Q2hhaW5JRCxcclxuICAgICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGV4cGFuZEFuY2lsbGFyeU9wdGlvbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnQudWkuZXhwYW5kT3B0aW9ucyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGVwQ2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gc3RlcENhY2hlLnBhcmVudCBhcyBJU3RlcENhY2hlO1xyXG4gICAgICAgICAgICBwYXJlbnRBbmNpbGxhcnlDYWNoZS5oZWlyID0gc3RlcENhY2hlIGFzIElTdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0QW5jaWxsYXJ5U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluUGF5bG9hZDogSUNoYWluUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya0FuY2lsbGFyeUV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgLy8gKipBTkNJTExBUlkgTk9URVMqKiBUaGlzIG5lZWRzIHRvIGdldCB0aGUgc3RlcCBmcm9tIHRoZSBjYWNoZSBvciBpZiBub3QgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIEl0IG5lZWRzIHRvIHVzZSB0aGUgcGFyZW50Q2hhaW5JRCBhcyBub3JtYWwgYWZ0ZXIgYWxsIGl0IGlzIGFuIG9wdGlvbiBvZiB0aGUgc3RlcC5cclxuICAgICAgICAvLyBJdCB0aGVuIG5lZWRzIHRvIGFkZCB0aGUgc3RlcGNhY2hlIHRvIHRoZSBwYXJlbnRzU3RlcGNhY2hlIGFuY2lsbGFyaWVzIGxpc3Qgbm90IHRoZSBjaGlsZHJlbiBsaXN0XHJcbiAgICAgICAgLy8gSXQgbmVlZHMgdG8gbWFrZSBzdXJlIGl0IGlzIHJlZ2lzdGVyZWQgYXMgbm9ybWFsXHJcbiAgICAgICAgLy8gQWxzbyBuZWVkIHRvIGJlIHN1cmUgd2hlbiBjbG9uaW5nIGEgc3RlcCBvciByb290IGNhY2hlIHRoYXQgaXQgaXMgYWRkZWQgdG8gdGhlIHJlZ2lzdGVyZWQgY2FjaGUuXHJcbiAgICAgICAgLy8gVGhlIHByb2JsZW0gaGVyZSBpcyB3b3JraW5nIG91dCBob3cgdG8gZHJhdyBpdC4gV2UgYXJlIGRyYXdpbmcgYSBjaGFpbiBzbyBpdCBuZWVkcyB0byBrbm93IHRvIGxvb3AgdW50aWwgZmluaXNoZWQgdGhyb3VnaCB0aGUgZGVzY2VuZGFudHMgYmVmb3JlIG1vdmluZyB0byBwYWludGluZyByZXN0IG9mIHBhcmVudCBzdGVwJ3MgZGlzY3Vzc2lvbi5cclxuICAgICAgICAvLyBBbHNvIGJlYXIgaW4gbWluZCB0aGF0IHdoZXJlIHRoZXJlIGlzIG9ubHkgb25lIG9wdGlvbiBpdCBnZXRzIGF1dG9tYXRpY2FsbHkgcGFpbnRlZCB0b28gd2l0aG91dCBwYWludGluZyBhbnkgb3B0aW9uIGJ1dHRvbnMgLSBpZSBzZWFtbGVzcy5cclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldEFuY2lsbGFyeShcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbGxhcHNlQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFhbmNpbGxhcnlDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpcyhzdGF0ZSk7XHJcbiAgICAgICAgYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50Q2hhaW5JRCA9IHJlc3BvbnNlLnBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgY29uc3QgdWlJRCA9IHJlc3BvbnNlLnVpSUQ7XHJcbiAgICAgICAgY29uc3QganNvbkRhdGEgPSByZXNwb25zZS5yZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgfCBudWxsID0gZ1N0ZXBDb2RlLnBhcnNlQW5kTG9hZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZEFuY2lsbGFyeUNoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmVudENoYWluSUQgPSByZXNwb25zZS5wYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIGNvbnN0IGpzb25EYXRhID0gcmVzcG9uc2UucmVzcG9uc2UuanNvbkRhdGE7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwIHwgbnVsbCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBqc29uRGF0YSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudWlJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRBbmNpbGxhcnlDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpblN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoYWluU3RlcENhY2hlOiBJU3RlcENhY2hlID0gZ1N0ZXBDb2RlLmFkZENoaWxkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZENoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRSYXdSb290U3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFJhd1Jvb3RTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdSb290U3RlcDogYW55KTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd1Jvb3RTdGVwLFxyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUuYWRkUm9vdFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJvb3RDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBBY3Rpb25zO1xyXG4iLCJcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNcIjtcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgSUh0dHBPdXRwdXQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cE91dHB1dFwiO1xyXG5pbXBvcnQgeyBJSHR0cFNlcXVlbnRpYWxGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwU2VxdWVudGlhbEZldGNoSXRlbVwiO1xyXG5cclxuY29uc3Qgc2VxdWVudGlhbEh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgc2VxdWVudGlhbEJsb2NrczogQXJyYXk8SUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jaz4pOiB2b2lkID0+IHtcclxuXHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgd2lsbCBydW4gc2VxdWVudGlhbGx5XHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzIGluIGVhY2ggYmxvY2sgd2lsbCBydW5uIGluIHBhcmFsbGVsXHJcbiAgICBsZXQgYmxvY2s6IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s7XHJcbiAgICBsZXQgc3VjY2VzczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBsZXQgaHR0cENhbGw6IGFueTtcclxuICAgIGxldCBsYXN0SHR0cENhbGw6IGFueTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gc2VxdWVudGlhbEJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICBibG9jayA9IHNlcXVlbnRpYWxCbG9ja3NbaV07XHJcblxyXG4gICAgICAgIGlmIChibG9jayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYmxvY2spKSB7XHJcblxyXG4gICAgICAgICAgICBodHRwQ2FsbCA9IHtcclxuICAgICAgICAgICAgICAgIGRlbGVnYXRlOiBwcm9jZXNzQmxvY2ssXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXHJcbiAgICAgICAgICAgICAgICBibG9jazogYmxvY2ssXHJcbiAgICAgICAgICAgICAgICBpbmRleDogYCR7aX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGh0dHBDYWxsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsZWdhdGU6IHByb2Nlc3NQcm9wcyxcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcclxuICAgICAgICAgICAgICAgIGJsb2NrOiBibG9jayxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBgJHtpfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXN0SHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLm5leHRIdHRwQ2FsbCA9IGxhc3RIdHRwQ2FsbDtcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEluZGV4ID0gbGFzdEh0dHBDYWxsLmluZGV4O1xyXG4gICAgICAgICAgICBodHRwQ2FsbC5uZXh0QmxvY2sgPSBsYXN0SHR0cENhbGwuYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXN0SHR0cENhbGwgPSBodHRwQ2FsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgaHR0cENhbGwuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5ibG9jayxcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5pbmRleFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb2Nlc3NCbG9jayA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBibG9jazogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jayxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgbGV0IHBhcmFsbGVsUHJvcHM6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPiA9IGJsb2NrIGFzIEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPjtcclxuICAgIGNvbnN0IGRlbGVnYXRlczogYW55W10gPSBbXTtcclxuICAgIGxldCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHM7XHJcblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJhbGxlbFByb3BzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgIHByb3BzID0gcGFyYWxsZWxQcm9wc1tqXTtcclxuXHJcbiAgICAgICAgZGVsZWdhdGVzLnB1c2goXHJcbiAgICAgICAgICAgIHByb2Nlc3NQcm9wcyhcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBQcm9taXNlXHJcbiAgICAgICAgICAgIC5hbGwoZGVsZWdhdGVzKVxyXG4gICAgICAgICAgICAudGhlbigpXHJcbiAgICAgICAgICAgIC5jYXRjaCgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgcHJvY2Vzc1Byb3BzID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFwcm9wcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvdXRwdXQ6IElIdHRwT3V0cHV0ID0ge1xyXG4gICAgICAgIG9rOiBmYWxzZSxcclxuICAgICAgICB1cmw6IHByb3BzLnVybCxcclxuICAgICAgICBhdXRoZW50aWNhdGlvbkZhaWw6IGZhbHNlLFxyXG4gICAgICAgIHBhcnNlVHlwZTogXCJ0ZXh0XCIsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0LFxyXG4gICAgICAgIG5leHREZWxlZ2F0ZVxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzXHJcbik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghcHJvcHMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3V0cHV0OiBJSHR0cE91dHB1dCA9IHtcclxuICAgICAgICBvazogZmFsc2UsXHJcbiAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25GYWlsOiBmYWxzZSxcclxuICAgICAgICBwYXJzZVR5cGU6IHByb3BzLnBhcnNlVHlwZSA/PyAnanNvbicsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0XHJcbiAgICApO1xyXG59O1xyXG5cclxuY29uc3QgaHR0cCA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMsXHJcbiAgICBvdXRwdXQ6IElIdHRwT3V0cHV0LFxyXG4gICAgbmV4dERlbGVnYXRlOiBhbnkgPSBudWxsKTogdm9pZCA9PiB7XHJcblxyXG4gICAgZmV0Y2goXHJcbiAgICAgICAgcHJvcHMudXJsLFxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQub2sgPSByZXNwb25zZS5vayA9PT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQudHlwZSA9IHJlc3BvbnNlLnR5cGU7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVkaXJlY3RlZCA9IHJlc3BvbnNlLnJlZGlyZWN0ZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNhbGxJRCA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ2FsbElEXCIpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQuY29udGVudFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgb3V0cHV0LmNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnBhcnNlVHlwZSA9IFwianNvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF1dGhlbnRpY2F0aW9uRmFpbCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlc3BvbnNlTnVsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZTogYW55KSB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5lcnJvciArPSBgRXJyb3IgdGhyb3duIHdpdGggcmVzcG9uc2UudGV4dCgpXHJcbmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dC50ZXh0RGF0YSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRcclxuICAgICAgICAgICAgICAgICYmIG91dHB1dC5wYXJzZVR5cGUgPT09ICdqc29uJ1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5qc29uRGF0YSA9IEpTT04ucGFyc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZXJyb3IgKz0gYEVycm9yIHRocm93biBwYXJzaW5nIHJlc3BvbnNlLnRleHQoKSBhcyBqc29uXHJcbmA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3V0cHV0Lm9rKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHByb3BzLmFjdGlvbixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHREZWxlZ2F0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0RGVsZWdhdGUuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dERlbGVnYXRlLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5ibG9jayxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5pbmRleFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG5cclxuICAgICAgICAgICAgb3V0cHV0LmVycm9yICs9IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBwcm9wcy5lcnJvcixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ0h0dHAgPSAocHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzKTogSUh0dHBGZXRjaEl0ZW0gPT4ge1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgaHR0cEVmZmVjdCxcclxuICAgICAgICBwcm9wc1xyXG4gICAgXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ1NlcXVlbnRpYWxIdHRwID0gKHByb3BzQmxvY2s6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s+KTogSUh0dHBTZXF1ZW50aWFsRmV0Y2hJdGVtID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHNlcXVlbnRpYWxIdHRwRWZmZWN0LFxyXG4gICAgICAgIHByb3BzQmxvY2tcclxuICAgIF1cclxufVxyXG4iLCJcclxuY29uc3QgS2V5cyA9IHtcclxuXHJcbiAgICBzdGFydFVybDogJ3N0YXJ0VXJsJyxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgS2V5cztcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQ29kZSA9IHtcclxuXHJcbiAgICBjbGVhckF1dGhlbnRpY2F0aW9uOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS51c2VyLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRlLnVzZXIuc3ViID0gXCJcIjtcclxuICAgICAgICBzdGF0ZS51c2VyLmxvZ291dFVybCA9IFwiXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25Db2RlO1xyXG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdBamF4SGVhZGVyQ29kZSA9IHtcclxuXHJcbiAgICBidWlsZEhlYWRlcnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNhbGxJRDogc3RyaW5nLFxyXG4gICAgICAgIGFjdGlvbjogQWN0aW9uVHlwZSk6IEhlYWRlcnMgPT4ge1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1gtQ1NSRicsICcxJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1N1YnNjcmlwdGlvbklEJywgc3RhdGUuc2V0dGluZ3Muc3Vic2NyaXB0aW9uSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDYWxsSUQnLCBjYWxsSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdBY3Rpb24nLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnd2l0aENyZWRlbnRpYWxzJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQWpheEhlYWRlckNvZGU7XHJcblxyXG4iLCJpbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcblxyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25BY3Rpb25zXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyA9IHtcclxuXHJcbiAgICBjaGVja1VzZXJBdXRoZW50aWNhdGVkOiAoc3RhdGU6IElTdGF0ZSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNhbGxJRCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5Ob25lXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5iZmZVcmx9LyR7c3RhdGUuc2V0dGluZ3MudXNlclBhdGh9P3NsaWRlPWZhbHNlYDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGFjdGlvbjogZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uLFxyXG4gICAgICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciB0cnlpbmcgdG8gYXV0aGVudGljYXRlIHdpdGggdGhlIHNlcnZlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXJsXCI6ICR7dXJsfSxcclxuICAgICAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RcIjogZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cy5jaGVja1VzZXJBdXRoZW50aWNhdGVkLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6ICR7SlNPTi5zdHJpbmdpZnkoc3RhdGUpfVxyXG4gICAgICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25FZmZlY3RzO1xyXG4iLCJpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IEtleXMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvY29uc3RhbnRzL0tleXNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkNvZGUgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25FZmZlY3RzXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyA9IHtcclxuXHJcbiAgICBsb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVxyXG4gICAgICAgICAgICB8fCByZXNwb25zZS5wYXJzZVR5cGUgIT09IFwianNvblwiXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZS5qc29uRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xhaW1zOiBhbnkgPSByZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZTogYW55ID0gY2xhaW1zLmZpbmQoXHJcbiAgICAgICAgICAgIChjbGFpbTogYW55KSA9PiBjbGFpbS50eXBlID09PSAnbmFtZSdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBzdWI6IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ3N1YidcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIW5hbWVcclxuICAgICAgICAgICAgJiYgIXN1Yikge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9nb3V0VXJsQ2xhaW06IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ2JmZjpsb2dvdXRfdXJsJ1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghbG9nb3V0VXJsQ2xhaW1cclxuICAgICAgICAgICAgfHwgIWxvZ291dFVybENsYWltLnZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSB0cnVlO1xyXG4gICAgICAgIHN0YXRlLnVzZXIubmFtZSA9IG5hbWUudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5zdWIgPSBzdWIudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5sb2dvdXRVcmwgPSBsb2dvdXRVcmxDbGFpbS52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrVXNlckxvZ2dlZEluOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jaGVja1VzZXJMb2dnZWRJblByb3BzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFwcm9wcykge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgY2hlY2tVc2VyTG9nZ2VkSW5Qcm9wczogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLnVzZXIucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnQXV0aGVudGljYXRpb25FZmZlY3RzLmNoZWNrVXNlckF1dGhlbnRpY2F0ZWQoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2dpbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgS2V5cy5zdGFydFVybCxcclxuICAgICAgICAgICAgY3VycmVudFVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYmZmVXJsfS8ke3N0YXRlLnNldHRpbmdzLmRlZmF1bHRMb2dpblBhdGh9P3JldHVyblVybD0vYDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVybCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJBdXRoZW50aWNhdGlvbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcbiAgICAgICAgZ0F1dGhlbnRpY2F0aW9uQ29kZS5jbGVhckF1dGhlbnRpY2F0aW9uKHN0YXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQXV0aGVudGljYXRpb25BbmRTaG93TG9naW46IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBnQXV0aGVudGljYXRpb25Db2RlLmNsZWFyQXV0aGVudGljYXRpb24oc3RhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2dpbihzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvZ291dDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oc3RhdGUudXNlci5sb2dvdXRVcmwpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25BY3Rpb25zO1xyXG4iLCJpbXBvcnQgeyBnSHR0cCB9IGZyb20gXCIuL2dIdHRwXCI7XHJcblxyXG5pbXBvcnQgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc1wiO1xyXG5pbXBvcnQgSUh0dHBQcm9wcyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwUHJvcHNcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQWN0aW9uc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnQXV0aGVudGljYXRlZEh0dHAocHJvcHM6IElIdHRwUHJvcHMpOiBhbnkge1xyXG5cclxuICAgIGNvbnN0IGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBwcm9wcyBhcyBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcztcclxuXHJcbiAgICAvLyAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb25cclxuICAgIC8vIGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbiA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2xlYXJBdXRoZW50aWNhdGlvbjtcclxuXHJcbiAgICAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb24gYW5kIHNob3cgbG9naW4gcGFnZVxyXG4gICAgaHR0cEF1dGhlbnRpY2F0ZWRQcm9wZXJ0aWVzLm9uQXV0aGVudGljYXRpb25GYWlsQWN0aW9uID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jbGVhckF1dGhlbnRpY2F0aW9uQW5kU2hvd0xvZ2luO1xyXG5cclxuICAgIHJldHVybiBnSHR0cChodHRwQXV0aGVudGljYXRlZFByb3BlcnRpZXMpO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ1N0ZXBBY3Rpb25zXCI7XHJcbi8vIGltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuLi9odHRwL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdldFN0ZXAgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICBfcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgYWN0aW9uOiBBY3Rpb25UeXBlLFxyXG4gICAgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IGBTdGVwLyR7c3RlcElEfWA7XHJcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgIGFjdGlvbjogbG9hZEFjdGlvbixcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgZ2V0dGluZyBzdGVwIGRhdGEgZnJvbSB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dldFN0ZXAubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnU3RlcEVmZmVjdHMgPSB7XHJcblxyXG4gICAgZ2V0Um9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJvb3RJRDogc3RyaW5nKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcm9vdElELFxyXG4gICAgICAgICAgICAnMCcsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0Um9vdCxcclxuICAgICAgICAgICAgZ1N0ZXBBY3Rpb25zLmxvYWRSb290U3RlcFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkU3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcElELFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEFuY2lsbGFyeVN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5Q2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RlcEVmZmVjdHM7XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnVG9waWNDb2RlIGZyb20gXCIuL2dUb3BpY0NvZGVcIjtcclxuXHJcblxyXG4vLyBUaGlzIGlzIHdoZXJlIGFsbCBhbGVydHMgdG8gZGF0YSBjaGFuZ2VzIHNob3VsZCBiZSBtYWRlXHJcbmNvbnN0IGdUb3BpY3NTdGF0ZUNvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS50b3BpY3MgPSBnVG9waWNDb2RlLmxvYWRUb3BpY3MocmVzcG9uc2UudmFsdWVzKTtcclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscy50b3RhbEl0ZW1zID0gcmVzcG9uc2UudG90YWw7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHJlc3BvbnNlLnRvdGFsID8/IDA7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQgPCAwID8gMCA6IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQ7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1RvcGljc1N0YXRlQ29kZTtcclxuXHJcbiIsImltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdUb3BpY3NTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljc1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgZ0ZpbHRlckVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZpbHRlckVmZmVjdHNcIjtcclxuXHJcblxyXG5jb25zdCBnVG9waWNzQ29yZUFjdGlvbnMgPSB7XHJcblxyXG4gICAgbG9hZFZpZXdPckJ1aWxkRnJlc2g6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdUb3BpY3NTdGF0ZUNvZGUubG9hZFRvcGljcyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljczogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuVG9waWNzO1xyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5wdXNoQnJvd3Nlckhpc3RvcnlTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5hdXRvRmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNzQ29yZUFjdGlvbnM7XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1RvcGljc0NvcmVBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dUb3BpY3NDb3JlQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYXV0b0ZpbHRlciA9IChzdGF0ZTogSVN0YXRlKTogYW55ID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcbiAgICBjb25zdCBhY3Rpb246IEFjdGlvblR5cGUgPSBBY3Rpb25UeXBlLkZpbHRlclRvcGljcztcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIGFjdGlvblxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBib2R5OiBhbnkgPSB7XHJcbiAgICAgICAgc3RhcnQ6IHN0YXRlLnRvcGljc1N0YXRlLnBhZ2luYXRpb25EZXRhaWxzLnN0YXJ0LFxyXG4gICAgICAgIGJhdGNoU2l6ZTogc3RhdGUudG9waWNzU3RhdGUucGFnaW5hdGlvbkRldGFpbHMuY291bnQsXHJcbiAgICAgICAgZnJhZ21lbnQ6IHN0YXRlLnNlYXJjaFN0YXRlLnRleHQsXHJcbiAgICAgICAgY2FsbElEOiBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uOiBhY3Rpb25cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYm9keUpzb246IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5hcGlVcmx9L0ZpbHRlci9Ub3BpY3NgO1xyXG5cclxuICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogYm9keUpzb25cclxuICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGdUb3BpY3NDb3JlQWN0aW9ucy5sb2FkVmlld09yQnVpbGRGcmVzaCxcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3Igc2VuZGluZyB0b3BpY3MgYXV0byBmaWx0ZXIgZGF0YSB0byB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2F1dG9GaWx0ZXIubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9LFxyXG4gICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHN0YXRlKX1cclxuICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmNvbnN0IGdGaWx0ZXJFZmZlY3RzID0ge1xyXG5cclxuICAgIGZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGlmIChzdGF0ZS5sZW5zLmZpbHRlclRhYi5hZHZhbmNlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGdGaWx0ZXJFZmZlY3RzLmFkdmFuY2VkRmlsdGVyKHN0YXRlKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXV0b0ZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGaWx0ZXJFZmZlY3RzO1xyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG5pbXBvcnQgZ1N0ZXBFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IElQYWdpbmF0aW9uUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JUGFnaW5hdGlvblBheWxvYWRcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGaWx0ZXJFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0c1wiO1xyXG5pbXBvcnQgVG9waWNDYWNoZSBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvdG9waWMvVG9waWNDYWNoZVwiO1xyXG5pbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgZ0h0bWxBY3Rpb25zIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNBY3Rpb25zID0ge1xyXG5cclxuICAgIHNldFNlYXJjaEZvY3VzOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUuc2VhcmNoU3RhdGUudWkuaGFzRm9jdXMgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlU2VhcmNoRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5zZWFyY2hTdGF0ZS51aS5oYXNGb2N1cyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljc1BhZ2U6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhZ2luYXRpb25QYXlsb2FkOiBJUGFnaW5hdGlvblBheWxvYWQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBhZ2luYXRpb25QYXlsb2FkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscyA9IHBhZ2luYXRpb25QYXlsb2FkLnBhZ2luYXRpb25EZXRhaWxzO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5maWx0ZXIoc3RhdGUpXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0U2VhcmNoVGV4dDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIWVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50ID0gZWxlbWVudCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgICAgIHN0YXRlLnNlYXJjaFN0YXRlLnRleHQgPSBgJHt0ZXh0YXJlYS52YWx1ZX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VhcmNoOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKSxcclxuICAgICAgICAgICAgZ0ZpbHRlckVmZmVjdHMuZmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrRm9yRW50ZXJLZXlQcmVzczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAga2V5RXZlbnQ6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGtleUV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcblxyXG4gICAgICAgICAgICBrZXlFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRvcGljQWN0aW9ucy5zZWFyY2goc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93VG9waWM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHRvcGljOiBJVG9waWMpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLkFydGljbGU7XHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5oaWRlQmFubmVyID0gdHJ1ZTtcclxuICAgICAgICBnSHRtbEFjdGlvbnMuY2hlY2tBbmRTY3JvbGxUb1RvcChzdGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFJvb3QoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUudG9waWMucm9vdERrSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAocm9vdENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldFJvb3RTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICB0b3BpYy5yb290RGtJRFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvcGljQWN0aW9ucztcclxuIiwiaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmRcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IHRvcGljQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy90b3BpY0FjdGlvbnNcIjtcclxuXHJcblxyXG5jb25zdCB0b3BpY1N1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSk6IGFueVtdID0+IHtcclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGlmIChzdGF0ZS5kaXNwbGF5VHlwZSA9PT0gRGlzcGxheVR5cGUuVG9waWNzKSB7XHJcblxyXG4gICAgICAgIHN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICAgICAgS2V5Ym9hcmQoe1xyXG4gICAgICAgICAgICAgICAgZG93bnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1cHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJlc3NlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IHRvcGljQWN0aW9ucy5jaGVja0ZvckVudGVyS2V5UHJlc3NcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdWJzY3JpcHRpb25zO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY1N1YnNjcmlwdGlvbnM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgdG9waWNTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L3N1YnNjcmlwdGlvbnMvdG9waWNTdWJzY3JpcHRpb25zXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHZpZXc6IGFueVtdID0gW1xyXG5cclxuICAgICAgICAuLi50b3BpY1N1YnNjcmlwdGlvbnMoc3RhdGUpXHJcbiAgICBdO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY3NDb3JlU3Vic2NyaXB0aW9ucztcclxuXHJcbiIsInZhciB0aW1lRnggPSBmdW5jdGlvbiAoZng6IGFueSkge1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoXHJcbiAgICAgICAgYWN0aW9uOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmeCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBkZWxheTogcHJvcHMuZGVsYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHZhciB0aW1lb3V0ID0gdGltZUZ4KFxyXG5cclxuICAgIGZ1bmN0aW9uIChcclxuICAgICAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgICAgIHByb3BzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb3BzLmRlbGF5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmV4cG9ydCB2YXIgaW50ZXJ2YWwgPSB0aW1lRngoXHJcblxyXG4gICAgZnVuY3Rpb24gKFxyXG4gICAgICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICB2YXIgaWQgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvcHMuZGVsYXlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuKTtcclxuXHJcblxyXG4vLyBleHBvcnQgdmFyIG5vd1xyXG4vLyBleHBvcnQgdmFyIHJldHJ5XHJcbi8vIGV4cG9ydCB2YXIgZGVib3VuY2VcclxuLy8gZXhwb3J0IHZhciB0aHJvdHRsZVxyXG4vLyBleHBvcnQgdmFyIGlkbGVDYWxsYmFjaz9cclxuIiwiXHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJQWN0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lBY3Rpb25cIjtcclxuXHJcbmNvbnN0IHJ1bkFjdGlvbklubmVyID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICBkaXNwYXRjaChcclxuICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IHJ1bkFjdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBxdWV1ZWRFZmZlY3RzOiBBcnJheTxJQWN0aW9uPlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGFjdGlvbjogSUFjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgIGVycm9yOiAoX3N0YXRlOiBJU3RhdGUsIF9lcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcnVubmluZyBhY3Rpb24gaW4gcmVwZWF0QWN0aW9uc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBlZmZlY3RzLnB1c2goW1xyXG4gICAgICAgICAgICBydW5BY3Rpb25Jbm5lcixcclxuICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICBdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IHNlbmRSZXF1ZXN0ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHF1ZXVlZEVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0PlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGdldEVmZmVjdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGh0dHBFZmZlY3QsXHJcbiAgICAgICAgICAgIGVmZmVjdHMsXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IGdldEVmZmVjdCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBodHRwRWZmZWN0OiBJSHR0cEVmZmVjdCxcclxuICAgIGVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0Pik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gaHR0cEVmZmVjdC51cmw7XHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXBcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0ID0gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGh0dHBFZmZlY3QuYWN0aW9uRGVsZWdhdGUsXHJcbiAgICAgICAgZXJyb3I6IChfc3RhdGU6IElTdGF0ZSwgX2Vycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHBvc3RpbmcgZ1JlcGVhdEFjdGlvbnMgZGF0YSB0byB0aGUgc2VydmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGVmZmVjdHMucHVzaChlZmZlY3QpO1xyXG59O1xyXG5cclxuY29uc3QgZ1JlcGVhdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgLy8gaHR0cFNpbGVudFJlTG9hZDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHAubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAvLyAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHA7XHJcbiAgICAvLyAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwID0gW107XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgaHR0cFNpbGVudFJlTG9hZEltbWVkaWF0ZTogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwSW1tZWRpYXRlID0gW107XHJcblxyXG4gICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBNdXN0IHJldHVybiBhbHRlcmVkIHN0YXRlIGZvciB0aGUgc3Vic2NyaXB0aW9uIG5vdCB0byBnZXQgcmVtb3ZlZFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gc3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBydW5BY3Rpb25JbW1lZGlhdGU6IEFycmF5PElBY3Rpb24+ID0gc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGUgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bkFjdGlvbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJ1bkFjdGlvbkltbWVkaWF0ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnUmVwZWF0QWN0aW9ucztcclxuXHJcbiIsImltcG9ydCB7IGludGVydmFsIH0gZnJvbSBcIi4uLy4uL2h5cGVyQXBwL3RpbWVcIjtcclxuXHJcbmltcG9ydCBnUmVwZWF0QWN0aW9ucyBmcm9tIFwiLi4vZ2xvYmFsL2FjdGlvbnMvZ1JlcGVhdEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuXHJcblxyXG5jb25zdCByZXBlYXRTdWJzY3JpcHRpb25zID0ge1xyXG5cclxuICAgIGJ1aWxkUmVwZWF0U3Vic2NyaXB0aW9uczogKHN0YXRlOiBJU3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgYnVpbGRSZUxvYWREYXRhID0gKCk6IGFueSA9PiB7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuaHR0cFNpbGVudFJlTG9hZCxcclxuICAgICAgICAvLyAgICAgICAgICAgICB7IGRlbGF5OiAxMDAgfVxyXG4gICAgICAgIC8vICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cEltbWVkaWF0ZS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVydmFsKFxyXG4gICAgICAgICAgICAgICAgICAgIGdSZXBlYXRBY3Rpb25zLmh0dHBTaWxlbnRSZUxvYWRJbW1lZGlhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgeyBkZWxheTogMTAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUnVuQWN0aW9uc0ltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVsYXk6IDEwIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZXBlYXRTdWJzY3JpcHRpb246IGFueVtdID0gW1xyXG5cclxuICAgICAgICAgICAgLy8gYnVpbGRSZUxvYWREYXRhKCksXHJcbiAgICAgICAgICAgIGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSgpLFxyXG4gICAgICAgICAgICBidWlsZFJ1bkFjdGlvbnNJbW1lZGlhdGUoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJldHVybiByZXBlYXRTdWJzY3JpcHRpb247XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZXBlYXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiLy8gaW1wb3J0IHsgSGlzdG9yeVBvcCB9IGZyb20gXCJoeXBlcmFwcC1meC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IHRvcGljc0NvcmVTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi9jb3JlL3RvcGljc0NvcmUvc3Vic2NyaXB0aW9ucy90b3BpY3NDb3JlU3Vic2NyaXB0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgcmVwZWF0U3Vic2NyaXB0aW9ucyBmcm9tIFwiLi4vLi4vLi4vc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb25cIjtcclxuXHJcblxyXG5jb25zdCBpbml0U3Vic2NyaXB0aW9ucyA9IChzdGF0ZTogSVN0YXRlKSA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtcclxuXHJcbiAgICAgICAgLi4udG9waWNzQ29yZVN1YnNjcmlwdGlvbnMoc3RhdGUpLFxyXG4gICAgICAgIC4uLnJlcGVhdFN1YnNjcmlwdGlvbnMuYnVpbGRSZXBlYXRTdWJzY3JpcHRpb25zKHN0YXRlKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiXHJcbmNvbnN0IEZpbHRlcnMgPSB7XHJcblxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50OiBcIiN0cmVlU29sdmVBc3Npc3RhbnRcIixcclxuICAgIHRyZWVTb2x2ZUd1aWRlSUQ6IFwidHJlZVNvbHZlR3VpZGVcIixcclxuICAgIHRyZWVTb2x2ZUZyYWdtZW50c0lEOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiLFxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50QmFubmVyOiBcInRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lclwiLFxyXG4gICAgc3RlcFZpZXc6IFwiI3N0ZXBWaWV3XCIsXHJcbiAgICBzdGVwSW5mbzogXCIjc3RlcEluZm9cIixcclxuICAgIHN0ZXBOb2RlczogXCIjc3RlcE5vZGVzXCIsXHJcbiAgICBzdGVwQm90dG9tTmF2OiBcIiNzdGVwQm90dG9tTmF2XCIsXHJcbiAgICBzdGVwU2hvd0ZpbHRlcjogJyNzdGVwQm94U2Nyb2xsU2hvdycsXHJcbiAgICB0b3BpY1Nob3dGaWx0ZXI6ICcjdG9waWNzVmlldyAudG9waWMtcm93LnNjcm9sbC1zaG93JyxcclxuICAgIHRvcGljU2hvd0NsYXNzOiAnc2Nyb2xsLXNob3cnLFxyXG4gICAgbWVudUZvY3VzRmlsdGVyOiAnaGVhZGVyIC5tZW51LWJveCcsXHJcbiAgICBzb2x1dGlvbnNNZW51Rm9jdXNGaWx0ZXI6ICdoZWFkZXIgLnNvbHV0aW9uLW1lbnUnLFxyXG4gICAgZm9sZGVkRm9jdXNGaWx0ZXI6ICcjc3RlcFZpZXcgI2ZvbGRlZENvbnRyb2wnLFxyXG4gICAgbmF2RWxlbWVudHM6ICcjc3RlcFZpZXcgLmRpc2N1c3Npb24gLm5hdicsXHJcbiAgICBzdGVwTm9kZUVsZW1lbnRzOiAnI3N0ZXBOb2RlcyAuc3RlcC1ib3gnLFxyXG4gICAgc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnQ6ICcjc3RlcE5vZGVzIC5zdGVwLWJveC5zZWxlY3RlZCcsXHJcbiAgICB1cE5hdkVsZW1lbnQ6ICcjc3RlcE5hdiAuY2hhaW4tdXB3YXJkcycsXHJcbiAgICBkb3duTmF2RWxlbWVudDogJyNzdGVwTmF2IC5jaGFpbi1kb3dud2FyZHMnLFxyXG5cclxuICAgIGZyYWdtZW50Qm94OiAnI3RyZWVTb2x2ZUZyYWdtZW50cyAubnQtZnItZnJhZ21lbnQtYm94JyxcclxuICAgIGZyYWdtZW50Qm94RGlzY3Vzc2lvbjogJyN0cmVlU29sdmVGcmFnbWVudHMgLm50LWZyLWZyYWdtZW50LWJveCAubnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbidcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsdGVycztcclxuIiwiXHJcbmV4cG9ydCBlbnVtIFNjcm9sbEhvcFR5cGUge1xyXG4gICAgTm9uZSA9IFwibm9uZVwiLFxyXG4gICAgVXAgPSBcInVwXCIsXHJcbiAgICBEb3duID0gXCJkb3duXCJcclxufVxyXG4iLCJpbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IFNjcm9sbEhvcFR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IHNjcm9sbFN0ZXAgPSB7XHJcblxyXG4gICAgc2Nyb2xsVXA6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZFN0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke0ZpbHRlcnMuc3RlcE5vZGVFbGVtZW50c31gKSBhcyBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c1N0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFydGljbGVTdGVwSUQ6IHN0cmluZyA9IGdTdGVwQ29kZS5nZXRJREZyb21OYXZJRChwcmV2aW91c1N0ZXBFbGVtZW50LmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxTdGVwLnNjcm9sbFRvVG9FbGVtZW50KGFydGljbGVTdGVwSUQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzY3JvbGxEb3duOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke0ZpbHRlcnMuc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnR9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdGVwRWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLnN0ZXBOb2RlRWxlbWVudHN9YCkgYXMgTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RlcEVsZW1lbnRzW2ldLmlkID09PSBzZWxlY3RlZFN0ZXBFbGVtZW50LmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAoc3RlcEVsZW1lbnRzLmxlbmd0aCAtIDEpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXh0U3RlcEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJ0aWNsZVN0ZXBJRDogc3RyaW5nID0gZ1N0ZXBDb2RlLmdldElERnJvbU5hdklEKG5leHRTdGVwRWxlbWVudC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxUb1RvRWxlbWVudChhcnRpY2xlU3RlcElEKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gc2Nyb2xsVG9Ub3A6ICgpID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvVG9wKSB7XHJcblxyXG4gICAgLy8gICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxUb1RvcCA9IGZhbHNlO1xyXG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICBzY3JvbGxUb1RvRWxlbWVudDogKGVsZW1lbnRJRDogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudElEfWApO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gZG9jRWwuc2Nyb2xsVG9wIHx8IGJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICBjb25zdCBjbGllbnRUb3AgPSBkb2NFbC5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0b3BPZmZzZXQ6IG51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyA0KSAtIDEwO1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wIC0gdG9wT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiB0b3AsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNjcm9sbDogKCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50KSA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHNjcm9sbFN0ZXAuc2Nyb2xsVG9Ub0VsZW1lbnQod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50IGFzIHN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbEhvcCA9PT0gU2Nyb2xsSG9wVHlwZS5VcCkge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxVcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxIb3AgPT09IFNjcm9sbEhvcFR5cGUuRG93bikge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxEb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsU3RlcDsiLCJpbXBvcnQgRmlsdGVycyBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnNcIjtcclxuXHJcblxyXG5jb25zdCBzZWxlY3RlZENsYXNzOiBzdHJpbmcgPSAnc2VsZWN0ZWQnO1xyXG5jb25zdCBkaXNhYmxlZENsYXNzOiBzdHJpbmcgPSAnZGlzYWJsZWQnO1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckRpbWVuc2lvbnMgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3Qgc3RlcEluZm9FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwSW5mb31gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXN0ZXBJbmZvRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwSW5mb1JlY3RhbmdsZSA9IHN0ZXBJbmZvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIGNvbnN0IGJvdHRvbUdhcDogbnVtYmVyID0gMjA7XHJcblxyXG4gICAgY29uc3QgZm9vdGVyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGZvb3RlcmApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmIChmb290ZXJFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvb3RlclJlY3RhbmdsZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZm9vdGVyVG9wID0gZm9vdGVyUmVjdGFuZ2xlLnRvcDtcclxuICAgICAgICBjb25zdCBmb290ZXJWaXNpYmxlID0gd2luZG93SGVpZ2h0IC0gZm9vdGVyVG9wO1xyXG5cclxuICAgICAgICBpZiAoZm9vdGVyVmlzaWJsZSA8PSBib3R0b21HYXApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RlcEluZm9FbGVtZW50LnN0eWxlLmJvdHRvbSA9IGAke2Zvb3RlclZpc2libGUgKyBib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0ZXBCb3R0b21OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwQm90dG9tTmF2fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RlcEluZm9SZWN0YW5nbGUgPSBzdGVwSW5mb0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5ib3R0b20gLSBzdGVwSW5mb1JlY3RhbmdsZS50b3A7XHJcbiAgICBjb25zdCBzdGVwTm9kZXNSZWN0YW5nbGUgPSBzdGVwTm9kZXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc3RlcE5vZGVzVG9wR2FwID0gc3RlcE5vZGVzUmVjdGFuZ2xlLnRvcCAtIHN0ZXBJbmZvUmVjdGFuZ2xlLnRvcDtcclxuICAgIGxldCBzdGVwTm9kZXNIZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgLSBzdGVwTm9kZXNUb3BHYXA7XHJcblxyXG4gICAgaWYgKHN0ZXBCb3R0b21OYXZFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPiA4MDApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBCb3R0b21OYXZFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcInVuc2V0XCI7XHJcbiAgICAgICAgICAgIHN0ZXBOb2Rlc0hlaWdodCAtPSAxNTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdGVwQm90dG9tTmF2RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7c3RlcE5vZGVzSGVpZ2h0fXB4YDtcclxufTtcclxuXHJcbmNvbnN0IHNldFNjcm9sbERvd25TaWRlQmFyQXR0ZW50aW9uID0gKG5hdkVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PikgPT4ge1xyXG4gICAgLy8gc2Nyb2xsaW5nIHRvd2FyZHMgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG5cclxuICAgIGxldCBuYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBuYXZFbGVtZW50Qm94OiBET01SZWN0O1xyXG4gICAgbGV0IHRvcE9mZnNldDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0IC8gNDtcclxuICAgIGxldCBhdHRlbnRpb246IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBjb25zdCBuZXN0ZWQ6IEFycmF5PEhUTUxEaXZFbGVtZW50PiA9IFtdO1xyXG4gICAgbGV0IHBlZ0Nyb3duSUQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgbmF2RWxlbWVudCA9IG5hdkVsZW1lbnRzW2ldO1xyXG5cclxuICAgICAgICBpZiAobmF2RWxlbWVudC5pZCA9PT0gcGVnQ3Jvd25JRCkge1xyXG5cclxuICAgICAgICAgICAgcGVnQ3Jvd25JRCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuYXZFbGVtZW50Qm94ID0gbmF2RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgaWYgKG5hdkVsZW1lbnRCb3gudG9wID4gdG9wT2Zmc2V0KSB7XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuYXZFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYW5jaWxsYXJ5JykgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgLy8gSXQgaXMgYW4gYW5jaWxsYXJ5IC0gaXMgaXRzIGVuZCBoYW5naW5nIG92ZXIgdGhlIHRvcE9mZnNldD8gaWUgaXMgaXQgc3RpbGwgdmlzaWJsZVxyXG5cclxuICAgICAgICAgICAgaWYgKChuYXZFbGVtZW50Qm94LnRvcCArIG5hdkVsZW1lbnRCb3guaGVpZ2h0KSA+IHRvcE9mZnNldCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG5lc3RlZC5wdXNoKG5hdkVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgYXR0ZW50aW9uID0gbmF2RWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGlkID0gbmF2RWxlbWVudC5pZDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnc3RlcC0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgYW5jaWxsYXJ5IGNyb3duc1xyXG4gICAgICAgICAgICAgICAgcGVnQ3Jvd25JRCA9IGBwZWctJHtpZC5zdWJzdHJpbmcoNSl9LTFgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF0dGVudGlvbiA9IG5hdkVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhdHRlbnRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcE5hdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjbmF2LSR7YXR0ZW50aW9uLmlkfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc3RlcE5hdikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkTmF2cygpO1xyXG4gICAgc3RlcE5hdi5jbGFzc0xpc3QuYWRkKHNlbGVjdGVkQ2xhc3MpO1xyXG59O1xyXG5cclxuY29uc3QgY2xlYXJTZWxlY3RlZE5hdnMgPSAoKTogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZUVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghc3RlcE5vZGVFbGVtZW50cykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwTm9kZUVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RlcE5vZGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICBzdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW2pdO1xyXG5cclxuICAgICAgICBpZiAoc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3RlZENsYXNzKSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGVwTm9kZUVsZW1lbnRzO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICBjb25zdCB1cE5hdkVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnVwTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGRvd25OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5kb3duTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXVwTmF2RWxlbWVudFxyXG4gICAgICAgIHx8ICFkb3duTmF2RWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXNlbGVjdGVkU3RlcEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcEVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHVwTmF2RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXBOYXZFbGVtZW50LmNsYXNzTGlzdC5hZGQoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpIDwgKHN0ZXBFbGVtZW50cy5sZW5ndGggLSAxKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRvd25OYXZFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb3duTmF2RWxlbWVudC5jbGFzc0xpc3QuYWRkKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckF0dGVudGlvbiA9ICgpID0+IHtcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4ubGFzdFNjcm9sbFkgPSBzY3JvbGxUb3A7XHJcblxyXG4gICAgY29uc3QgbmF2RWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLm5hdkVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghbmF2RWxlbWVudHNcclxuICAgICAgICB8fCBuYXZFbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9zID0gd2luZG93LmlubmVySGVpZ2h0ICsgTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSkgKyAxMDA7XHJcblxyXG4gICAgaWYgKHBvcyA+PSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCkge1xyXG4gICAgICAgIC8vIEF0IHRoZSBib3R0b20gb2YgdGhlIHBhZ2VcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcE5vZGVFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0gY2xlYXJTZWxlY3RlZE5hdnMoKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwTm9kZUVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxhc3RTdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW3N0ZXBOb2RlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGlmIChsYXN0U3RlcE5vZGVFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsYXN0U3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2Nyb2xsRG93blNpZGVCYXJBdHRlbnRpb24obmF2RWxlbWVudHMpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhciA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRTaWRlQmFyRGltZW5zaW9ucygpO1xyXG4gICAgc2V0U2lkZUJhckF0dGVudGlvbigpO1xyXG4gICAgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlKCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXRTaWRlQmFyOyIsImltcG9ydCBnU2Vzc2lvbiBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2dTZXNzaW9uXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgc2Nyb2xsU3RlcCBmcm9tIFwiLi9zY3JvbGxTdGVwXCI7XHJcbmltcG9ydCBzZXRTaWRlQmFyIGZyb20gXCIuL3NldFNpZGVCYXJcIjtcclxuXHJcblxyXG5jb25zdCBoaWRlQmFubmVyID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpeGVkQmFubmVyID0gYF9fJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgY29uc3QgYmFubmVyRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtmaXhlZEJhbm5lcn1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lcikgeyAvLyBNdXN0IGhpZGUgYmFubmVyXHJcblxyXG4gICAgICAgIGlmIChiYW5uZXJFbGVtZW50KSB7IC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgICAgIHJldHVybjsgLy8gTm8gbmVlZCB0byBjaGFuZ2UgYW55dGhpbmdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBub3QgY3VycmVudGx5IGhpZGRlbiAtIHNvIGhpZGUgaXRcclxuICAgICAgICBjb25zdCBkaXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke0ZpbHRlcnMudHJlZVNvbHZlQXNzaXN0YW50QmFubmVyfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoZGl2RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBiYW5uZXJcclxuICAgICAgICAgICAgZGl2RWxlbWVudC5pZCA9IGZpeGVkQmFubmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBNdXN0IHNob3cgYmFubmVyXHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgaWYgKGJhbm5lckVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEhpZGUgYmFubmVyXHJcbiAgICAgICAgICAgIGJhbm5lckVsZW1lbnQuaWQgPSBgJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNldEZvY3VzID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpbHRlcjogc3RyaW5nID0gZ1Nlc3Npb24uZ2V0Rm9jdXNGaWx0ZXIoKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhgZmlsdGVyOiAke2ZpbHRlcn1gKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihmaWx0ZXIpIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGlmIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYGZvY3VzZWQgb246ICR7ZWxlbWVudH1gKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRGb2N1cygpO1xyXG4gICAgaGlkZUJhbm5lcigpO1xyXG4gICAgc2Nyb2xsU3RlcC5zY3JvbGwoKTtcclxuICAgIHNldFNpZGVCYXIoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZDsiLCJpbXBvcnQgc3RlcERpc3BsYXlPblJlbmRlckZpbmlzaGVkIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3N0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZFwiO1xyXG5cclxuXHJcbmNvbnN0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZDtcclxuXHJcbiIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuY29uc3Qgc2hvd1NlbGVjdGVkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnNlbGVjdGVkU3RlcE5vZGVFbGVtZW50fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnRSZWN0YW5nbGUgPSBzZWxlY3RlZFN0ZXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRUb3AgPSBzZWxlY3RlZFN0ZXBFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHNlbGVjdGVkQm90dG9tID0gc2VsZWN0ZWRTdGVwRWxlbWVudFJlY3RhbmdsZS5ib3R0b207XHJcblxyXG4gICAgY29uc3Qgc3RlcE5vZGVzRWxlbWVudFJlY3RhbmdsZSA9IHN0ZXBOb2Rlc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBzdGVwTm9kZXNFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHBhcmVudEJvdHRvbSA9IHN0ZXBOb2Rlc0VsZW1lbnRSZWN0YW5nbGUuYm90dG9tO1xyXG5cclxuICAgIGNvbnN0IG9mZnNldFRvcCA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wO1xyXG4gICAgY29uc3QgYnVmZmVyID0gNTA7XHJcblxyXG4gICAgLy8gVGhzZXMgc2hvdWxkIGFsbCBiZSByZWxhdGl2ZVxyXG4gICAgaWYgKChzZWxlY3RlZFRvcCAtIGJ1ZmZlcikgPj0gcGFyZW50VG9wXHJcbiAgICAgICAgJiYgKHNlbGVjdGVkQm90dG9tICsgYnVmZmVyKSA8PSBwYXJlbnRCb3R0b20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWlkZGxlID0gKHBhcmVudEJvdHRvbSAtIHBhcmVudFRvcCkgLyAyO1xyXG4gICAgY29uc3QgbmV3UG9zID0gc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUb3AgKyBvZmZzZXRUb3AgLSBtaWRkbGU7XHJcblxyXG4gICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogbmV3UG9zLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcblxyXG4gICAgLy8gaWYgKHNlbGVjdGVkVG9wIDwgcGFyZW50VG9wKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHNlbGVjdGVkWSA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wICsgbWlkZGxlO1xyXG5cclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgSW4gdG9wOiAke3NlbGVjdGVkWX1gKTtcclxuXHJcbiAgICAvLyAgICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogc2VsZWN0ZWRZLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBlbHNlIGlmIChzZWxlY3RlZEJvdHRvbSA+IHBhcmVudEJvdHRvbSkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBzZWxlY3RlZFkgPSBzZWxlY3RlZFRvcCAtIHBhcmVudFRvcCAtIG1pZGRsZTtcclxuXHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYEluIGJvdHRvbTogJHtzZWxlY3RlZFl9YCk7XHJcblxyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG8oeyB0b3A6IHNlbGVjdGVkWSwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG9wID0gNjU7XHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5jb25zdCBvblNjcm9sbEVuZCA9ICgpID0+IHtcclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9uU2Nyb2xsRW5kOyIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRCb3hEaXNjdXNzaW9uczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRmlsdGVycy5mcmFnbWVudEJveERpc2N1c3Npb24pO1xyXG4gICAgbGV0IGZyYWdtZW50Qm94OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBkYXRhRGlzY3Vzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhZ21lbnRCb3hEaXNjdXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBmcmFnbWVudEJveCA9IGZyYWdtZW50Qm94RGlzY3Vzc2lvbnNbaV0gYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgZGF0YURpc2N1c3Npb24gPSBmcmFnbWVudEJveC5kYXRhc2V0LmRpc2N1c3Npb247XHJcblxyXG4gICAgICAgIGlmIChkYXRhRGlzY3Vzc2lvbikge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRCb3guaW5uZXJIVE1MID0gZGF0YURpc2N1c3Npb247XHJcbiAgICAgICAgICAgIGZyYWdtZW50Qm94LnJlbW92ZUF0dHJpYnV0ZShkYXRhRGlzY3Vzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25GcmFnbWVudHNSZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgZnJvbSBcIi4uLy4uL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWRcIjtcclxuXHJcblxyXG4vLyBjb25zdCBzZXRIZWlnaHQgPSAoKSA9PiB7XHJcblxyXG5cclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdHJlZVNvbHZlQXNzaXN0YW50JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4vLyAgICAgaWYgKCFhc3Npc3RhbnQpIHtcclxuLy8gICAgICAgICByZXR1cm47XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgYXNzaXN0YW50LnN0eWxlLmhlaWdodCA9IFwiXCI7IC8vIEdldCBzY3JvbGwgaGVpZ2h0IGFmdGVyIHNldHRpbmcgaGVpZ2h0IHRvIG5vdGhpbmdcclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudFN0eWxlOiBhbnkgPSBnZXRDb21wdXRlZFN0eWxlKGFzc2lzdGFudCk7XHJcbi8vICAgICBjb25zdCBtYXhIZWlnaHQ6IHN0cmluZyA9IGFzc2lzdGFudFN0eWxlWydtYXgtaGVpZ2h0J107XHJcbi8vICAgICBjb25zdCB2aWV3SGVpZ2h0OiBudW1iZXIgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cclxuLy8gICAgIGlmICghbWF4SGVpZ2h0LmVuZHNXaXRoKCdweCcpKSB7XHJcbi8vICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNvbnN0IG1heEhlaWdodEludDogbnVtYmVyID0gK21heEhlaWdodC5zdWJzdHIoMCwgbWF4SGVpZ2h0Lmxlbmd0aCAtIDIpO1xyXG5cclxuLy8gICAgIGlmICh2aWV3SGVpZ2h0ID4gbWF4SGVpZ2h0SW50KSB7XHJcblxyXG4vLyAgICAgICAgIGFzc2lzdGFudC5zdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBhc3Npc3RhbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld0hlaWdodH1weGA7XHJcbi8vICAgICB9XHJcbi8vIH07XHJcblxyXG5jb25zdCBvblJlbmRlckZpbmlzaGVkID0gKCkgPT4ge1xyXG5cclxuICAgIG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIC8vIHNldEhlaWdodCgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25SZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi4vLi4vY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZFwiO1xyXG5pbXBvcnQgc2V0U2lkZUJhciBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zZXRTaWRlQmFyXCI7XHJcbmltcG9ydCBvblNjcm9sbEVuZCBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9vblNjcm9sbEVuZFwiO1xyXG5pbXBvcnQgb25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi9vblJlbmRlckZpbmlzaGVkXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEV2ZW50cyA9IHtcclxuXHJcbiAgb25SZW5kZXJGaW5pc2hlZDogKCkgPT4ge1xyXG5cclxuICAgIG9uUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCgpO1xyXG4gIH0sXHJcblxyXG4gIHJlZ2lzdGVyR2xvYmFsRXZlbnRzOiAoKSA9PiB7XHJcblxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xyXG5cclxuICAgICAgaW5pdEV2ZW50cy5vblJlbmRlckZpbmlzaGVkKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9uc2Nyb2xsID0gKCkgPT4ge1xyXG5cclxuICAgICAgc2V0U2lkZUJhcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgJ3Njcm9sbGVuZCcsXHJcbiAgICAgIG9uU2Nyb2xsRW5kXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEV2ZW50cztcclxuXHJcblxyXG5cclxuLypcclxuXHJcbi8vIElNUExFTUVOVCBvbkVuZCBjYWxsYmFja1xyXG4vLyBDaGFuZ2Ugbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyB0byB0aGlzXHJcbi8vIEFkZCBhIG5ldyBjYWxsYmFjayBwYXJhbSBhbmQgY2FsbCBpdCBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBjb21wbGV0ZXNcclxuLy8gVGhpcyB3aWxsIG5lZWQgdG8gYmUgZG9uZSBhZnRlciBlYWNoIHVwZGF0ZSBvZiBoeXBlcmFwcCEhISEhISEhISEhISEhXHJcbi8vIEFwcC5yZW5kZXIgaXMgbm9ybWFsbHkgY2FsbGVkIHR3aWNlLlxyXG5cclxuZXhwb3J0IHZhciBhcHAgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHZhciBzdGF0ZSA9IHt9XHJcbiAgdmFyIGxvY2sgPSBmYWxzZVxyXG4gIHZhciB2aWV3ID0gcHJvcHMudmlld1xyXG4gIHZhciBub2RlID0gcHJvcHMubm9kZVxyXG4gIHZhciB2ZG9tID0gbm9kZSAmJiByZWN5Y2xlTm9kZShub2RlKVxyXG4gIHZhciBzdWJzY3JpcHRpb25zID0gcHJvcHMuc3Vic2NyaXB0aW9uc1xyXG4gIHZhciBzdWJzID0gW11cclxuICB2YXIgb25FbmQgPSBwcm9wcy5vbkVuZCAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiA8PT09IGNyZWF0ZSBjYWxsYmFjayB2YXJpYWJsZSwgc2V0IHRvIG5ldyBwYXJhbSBwcm9wZXJ0eVxyXG4gIHZhciBjb3VudCA9IDFcclxuXHJcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGRpc3BhdGNoKHRoaXMuYWN0aW9uc1tldmVudC50eXBlXSwgZXZlbnQpXHJcbiAgfVxyXG5cclxuICB2YXIgc2V0U3RhdGUgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlICE9PSBuZXdTdGF0ZSkge1xyXG4gICAgICBzdGF0ZSA9IG5ld1N0YXRlXHJcbiAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgc3VicyA9IHBhdGNoU3VicyhzdWJzLCBiYXRjaChbc3Vic2NyaXB0aW9ucyhzdGF0ZSldKSwgZGlzcGF0Y2gpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZpZXcgJiYgIWxvY2spIGRlZmVyKHJlbmRlciwgKGxvY2sgPSB0cnVlKSlcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxuXHJcbiAgdmFyIGRpc3BhdGNoID0gKHByb3BzLm1pZGRsZXdhcmUgfHxcclxuICAgIGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9KShmdW5jdGlvbihhY3Rpb24sIHByb3BzKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgID8gZGlzcGF0Y2goYWN0aW9uKHN0YXRlLCBwcm9wcykpXHJcbiAgICAgIDogaXNBcnJheShhY3Rpb24pXHJcbiAgICAgID8gdHlwZW9mIGFjdGlvblswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBkaXNwYXRjaChcclxuICAgICAgICAgICAgYWN0aW9uWzBdLFxyXG4gICAgICAgICAgICB0eXBlb2YgYWN0aW9uWzFdID09PSBcImZ1bmN0aW9uXCIgPyBhY3Rpb25bMV0ocHJvcHMpIDogYWN0aW9uWzFdXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiAoYmF0Y2goYWN0aW9uLnNsaWNlKDEpKS5tYXAoZnVuY3Rpb24oZngpIHtcclxuICAgICAgICAgICAgZnggJiYgZnhbMF0oZGlzcGF0Y2gsIGZ4WzFdKVxyXG4gICAgICAgICAgfSwgc2V0U3RhdGUoYWN0aW9uWzBdKSksXHJcbiAgICAgICAgICBzdGF0ZSlcclxuICAgICAgOiBzZXRTdGF0ZShhY3Rpb24pXHJcbiAgfSlcclxuXHJcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbG9jayA9IGZhbHNlXHJcbiAgICBub2RlID0gcGF0Y2goXHJcbiAgICAgIG5vZGUucGFyZW50Tm9kZSxcclxuICAgICAgbm9kZSxcclxuICAgICAgdmRvbSxcclxuICAgICAgKHZkb20gPSBnZXRUZXh0Vk5vZGUodmlldyhzdGF0ZSkpKSxcclxuICAgICAgbGlzdGVuZXJcclxuICAgIClcclxuICAgIG9uRW5kKCkgLy8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gPD09PSBDYWxsIG5ldyBjYWxsYmFjayBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBmaW5pc2hlc1xyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG5cclxuXHJcblxyXG4qLyIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgaW50cm86IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBzbyBmYXJcclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Tm90UmF3OiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93Py5UcmVlU29sdmU/LnNjcmVlbj8uaXNBdXRvZm9jdXNGaXJzdFJ1bikge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudFVJIGltcGxlbWVudHMgSVJlbmRlckZyYWdtZW50VUkge1xyXG5cclxuICAgIHB1YmxpYyBvcHRpb25FeHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGZyYWdtZW50T3B0aW9uc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZGlzY3Vzc2lvbkxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uL3VpL1JlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudCBpbXBsZW1lbnRzIElSZW5kZXJGcmFnbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHRvcExldmVsTWFwS2V5OiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBtYXBLZXlDaGFpbjogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVJRDogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVQYXRoOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwYXJlbnRGcmFnbWVudElEOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvbnM6IEFycmF5PElSZW5kZXJGcmFnbWVudD4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgb3B0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9yZGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1aTogSVJlbmRlckZyYWdtZW50VUkgPSBuZXcgUmVuZGVyRnJhZ21lbnRVSSgpO1xyXG59XHJcbiIsIlxyXG5cclxuY29uc3QgZ0ZpbGVDb25zdGFudHMgPSB7XHJcblxyXG4gICAgZnJhZ21lbnRzRm9sZGVyU3VmZml4OiAnX2ZyYWdzJyxcclxuICAgIGZyYWdtZW50RmlsZUV4dGVuc2lvbjogJy5odG1sJyxcclxuICAgIGd1aWRlUmVuZGVyQ29tbWVudFRhZzogJ3RzR3VpZGVSZW5kZXJDb21tZW50ICcsXHJcbiAgICBmcmFnbWVudFJlbmRlckNvbW1lbnRUYWc6ICd0c0ZyYWdtZW50UmVuZGVyQ29tbWVudCAnLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZpbGVDb25zdGFudHM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuL2dIaXN0b3J5Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IHBhcnNlQW5kTG9hZEZyYWdtZW50ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbik6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgIGlmICghcmF3RnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgIGxldCBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ11cclxuICAgIGxldCBjYWNoZSA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQgPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3RnJhZ21lbnQuaWQpO1xyXG4gICAgICAgIGNhY2hlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVGcmFnbWVudElEO1xyXG4gICAgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXSA9IGZyYWdtZW50O1xyXG5cclxuICAgIGdGcmFnbWVudENvZGUubG9hZEZyYWdtZW50KFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50XHJcbiAgICApO1xyXG5cclxuICAgIGlmIChjYWNoZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkT3B0aW9uID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd09wdGlvbjogYW55LFxyXG4gICAgb3V0bGluZUZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbFxyXG4pOiBJUmVuZGVyRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChyYXdPcHRpb24uaWQpO1xyXG4gICAgb3B0aW9uLm9wdGlvbiA9IHJhd09wdGlvbi5vcHRpb24gPz8gJyc7XHJcbiAgICBvcHRpb24uaXNBbmNpbGxhcnkgPSByYXdPcHRpb24uaXNBbmNpbGxhcnkgPz8gZmFsc2U7XHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXdPcHRpb24ub3JkZXIgPz8gMDtcclxuXHJcbiAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBvcHRpb25cclxuICAgICk7XHJcblxyXG4gICAgaWYgKG91dGxpbmVGcmFnbWVudCkge1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG91dGxpbmVPcHRpb24gb2Ygb3V0bGluZUZyYWdtZW50Lm8pIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChvdXRsaW5lT3B0aW9uLmYgPT09IG9wdGlvbi5pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVPcHRpb24uaTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X291dGxpbmVGcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZU9wdGlvbi5pXSA9IG9wdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9uO1xyXG59O1xyXG5cclxuY29uc3QgZ0ZyYWdtZW50Q29kZSA9IHtcclxuXHJcbiAgICBnZXRGcmFnbWVudEVsZW1lbnRJRDogKGZyYWdtZW50SUQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBgbnRfZnJfZnJhZ18ke2ZyYWdtZW50SUR9YDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2hhaW5GcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQgPz8gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEZyYWdtZW50RnJvbUNoYWluRnJhZ21lbnRzOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0bGluZUZyYWdtZW50SUQgPSBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShvdXRsaW5lRnJhZ21lbnRJRCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2FjaGVkZnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF07XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnRvcExldmVsTWFwS2V5ID0gY2FjaGVkZnJhZ21lbnQudG9wTGV2ZWxNYXBLZXk7XHJcbiAgICAgICAgZnJhZ21lbnQubWFwS2V5Q2hhaW4gPSBjYWNoZWRmcmFnbWVudC5tYXBLZXlDaGFpbjtcclxuICAgICAgICBmcmFnbWVudC5ndWlkZUlEID0gY2FjaGVkZnJhZ21lbnQuZ3VpZGVJRDtcclxuICAgICAgICBmcmFnbWVudC5ndWlkZVBhdGggPSBjYWNoZWRmcmFnbWVudC5ndWlkZVBhdGg7XHJcbiAgICAgICAgZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA9IGNhY2hlZGZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQ7XHJcbiAgICAgICAgZnJhZ21lbnQudmFsdWUgPSBjYWNoZWRmcmFnbWVudC52YWx1ZTtcclxuICAgICAgICBmcmFnbWVudC51aS5kaXNjdXNzaW9uTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQub3B0aW9uID0gY2FjaGVkZnJhZ21lbnQub3B0aW9uO1xyXG4gICAgICAgIGZyYWdtZW50LmlzQW5jaWxsYXJ5ID0gY2FjaGVkZnJhZ21lbnQuaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgZnJhZ21lbnQub3JkZXIgPSBjYWNoZWRmcmFnbWVudC5vcmRlcjtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG5cclxuICAgICAgICBpZiAoY2FjaGVkZnJhZ21lbnQub3B0aW9uc1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KGNhY2hlZGZyYWdtZW50Lm9wdGlvbnMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnJhZ21lbnRPcHRpb24gb2YgY2FjaGVkZnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudE9wdGlvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24ub3B0aW9uID0gY2FjaGVkZnJhZ21lbnQub3B0aW9uO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLmlzQW5jaWxsYXJ5ID0gY2FjaGVkZnJhZ21lbnQuaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24ub3JkZXIgPSBjYWNoZWRmcmFnbWVudC5vcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5vcHRpb25zLnB1c2gob3B0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5kZXhDaGFpbkZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0bGluZUZyYWdtZW50SUQgPSBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShvdXRsaW5lRnJhZ21lbnRJRCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEXSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF0gPSBmcmFnbWVudDtcclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VBbmRMb2FkRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBzdHJpbmcsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhd0ZyYWdtZW50ID0gZ0ZyYWdtZW50Q29kZS5wYXJzZUZyYWdtZW50KHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlQW5kTG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Um9vdE91dGxpbmVGcmFnbWVudElEOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByb290ID0gc3RhdGUucmVuZGVyU3RhdGUucm9vdDtcclxuXHJcbiAgICAgICAgaWYgKCFyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVSb290ID0gc3RhdGUucmVuZGVyU3RhdGUub3V0bGluZT8ucjtcclxuXHJcbiAgICAgICAgaWYgKCFvdXRsaW5lUm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocm9vdC5pZCA9PT0gb3V0bGluZVJvb3QuZikge1xyXG5cclxuICAgICAgICAgICAgcm9vdC5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVSb290Lmk7XHJcbiAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW3Jvb3Qub3V0bGluZUZyYWdtZW50SURdID0gcm9vdDtcclxuICAgICAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50ID0gcm9vdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHJvb3Qub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBvdXRsaW5lT3B0aW9uIG9mIG91dGxpbmVSb290Lm8pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3V0bGluZU9wdGlvbi5mID09PSBvcHRpb24uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLm91dGxpbmVGcmFnbWVudElEID0gb3V0bGluZU9wdGlvbi5pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW29wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRF0gPSBvcHRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUFuZExvYWRSb290RnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdGcmFnbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IG5ldyBSZW5kZXJGcmFnbWVudChyYXdGcmFnbWVudC5pZCk7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUubG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUucm9vdCA9IGZyYWdtZW50O1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRChzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3RnJhZ21lbnQ6IGFueSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQudG9wTGV2ZWxNYXBLZXkgPSByYXdGcmFnbWVudC50b3BMZXZlbE1hcEtleSA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5tYXBLZXlDaGFpbiA9IHJhd0ZyYWdtZW50Lm1hcEtleUNoYWluID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50Lmd1aWRlSUQgPSByYXdGcmFnbWVudC5ndWlkZUlEID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50Lmd1aWRlUGF0aCA9IHJhd0ZyYWdtZW50Lmd1aWRlUGF0aCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5wYXJlbnRGcmFnbWVudElEID0gcmF3RnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC52YWx1ZSA9IHJhd0ZyYWdtZW50LnZhbHVlID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50LnZhbHVlID0gZnJhZ21lbnQudmFsdWUudHJpbSgpO1xyXG4gICAgICAgIGZyYWdtZW50LnVpLmRpc2N1c3Npb25Mb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgb3V0bGluZUZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghVS5pc051bGxPcldoaXRlU3BhY2UoZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQpKSB7XHJcblxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50Lm91dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGlmIChyYXdGcmFnbWVudC5vcHRpb25zXHJcbiAgICAgICAgICAgICYmIEFycmF5LmlzQXJyYXkocmF3RnJhZ21lbnQub3B0aW9ucylcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByYXdPcHRpb24gb2YgcmF3RnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IGxvYWRPcHRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmF3T3B0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5vcHRpb25zLnB1c2gob3B0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVGcmFnbWVudDogKGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQpOiBJUmVuZGVyRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudC5pZCk7XHJcbiAgICAgICAgY2xvbmUudG9wTGV2ZWxNYXBLZXkgPSBmcmFnbWVudC50b3BMZXZlbE1hcEtleTtcclxuICAgICAgICBjbG9uZS5tYXBLZXlDaGFpbiA9IGZyYWdtZW50Lm1hcEtleUNoYWluO1xyXG4gICAgICAgIGNsb25lLmd1aWRlSUQgPSBmcmFnbWVudC5ndWlkZUlEO1xyXG4gICAgICAgIGNsb25lLmd1aWRlUGF0aCA9IGZyYWdtZW50Lmd1aWRlUGF0aDtcclxuICAgICAgICBjbG9uZS5wYXJlbnRGcmFnbWVudElEID0gZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRDtcclxuICAgICAgICBjbG9uZS52YWx1ZSA9IGZyYWdtZW50LnZhbHVlO1xyXG4gICAgICAgIGNsb25lLnVpLmRpc2N1c3Npb25Mb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjbG9uZS5vcHRpb24gPSBmcmFnbWVudC5vcHRpb247XHJcbiAgICAgICAgY2xvbmUuaXNBbmNpbGxhcnkgPSBmcmFnbWVudC5pc0FuY2lsbGFyeTtcclxuICAgICAgICBjbG9uZS5vcmRlciA9IGZyYWdtZW50Lm9yZGVyO1xyXG5cclxuICAgICAgICBsZXQgY2xvbmVPcHRpb246IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgaWYgKGZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShmcmFnbWVudC5vcHRpb25zKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZyYWdtZW50T3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudE9wdGlvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbi5vcHRpb24gPSBmcmFnbWVudE9wdGlvbi5vcHRpb247XHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbi5pc0FuY2lsbGFyeSA9IGZyYWdtZW50T3B0aW9uLmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgICAgICAgICAgY2xvbmVPcHRpb24ub3JkZXIgPSBmcmFnbWVudE9wdGlvbi5vcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjbG9uZS5vcHRpb25zLnB1c2goY2xvbmVPcHRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlRnJhZ21lbnQ6IChyZXNwb25zZTogc3RyaW5nKTogYW55ID0+IHtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cXFwibW9kdWxlXFxcIiBzcmM9XFxcIi9Adml0ZS9jbGllbnRcXFwiPjwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgPCEtLSB0c0ZyYWdtZW50UmVuZGVyQ29tbWVudCB7XFxcIm5vZGVcXFwiOntcXFwiaWRcXFwiOlxcXCJkQnQ3S20yTWxcXFwiLFxcXCJ0b3BMZXZlbE1hcEtleVxcXCI6XFxcImN2MVRSbDAxcmZcXFwiLFxcXCJtYXBLZXlDaGFpblxcXCI6XFxcImN2MVRSbDAxcmZcXFwiLFxcXCJndWlkZUlEXFxcIjpcXFwiZEJ0N0pOMUhlXFxcIixcXFwiZ3VpZGVQYXRoXFxcIjpcXFwiYzovR2l0SHViL0hBTC5Eb2N1bWVudGF0aW9uL3RzbWFwc1Rlc3QvVGVzdE9wdGlvbnNGb2xkZXIvSG9sZGVyL1Rlc3RPcHRpb25zLnRzbWFwXFxcIixcXFwicGFyZW50RnJhZ21lbnRJRFxcXCI6XFxcImRCdDdKTjF2dFxcXCIsXFxcImNoYXJ0S2V5XFxcIjpcXFwiY3YxVFJsMDFyZlxcXCIsXFxcIm9wdGlvbnNcXFwiOltdfX0gLS0+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxoNCBpZD1cXFwib3B0aW9uLTEtc29sdXRpb25cXFwiPk9wdGlvbiAxIHNvbHV0aW9uPC9oND5cclxuICAgICAgICAgICAgICAgIDxwPk9wdGlvbiAxIHNvbHV0aW9uPC9wPlxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gcmVzcG9uc2Uuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbW1lbnRTdGFydCA9IGA8IS0tICR7Z0ZpbGVDb25zdGFudHMuZnJhZ21lbnRSZW5kZXJDb21tZW50VGFnfWA7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQ29tbWVudEVuZCA9IGAgLS0+YDtcclxuICAgICAgICBsZXQgZnJhZ21lbnRSZW5kZXJDb21tZW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBsZXQgbGluZTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBidWlsZFZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChidWlsZFZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBgJHt2YWx1ZX1cclxuJHtsaW5lfWA7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aChyZW5kZXJDb21tZW50U3RhcnQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gbGluZS5zdWJzdHJpbmcocmVuZGVyQ29tbWVudFN0YXJ0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBidWlsZFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFmcmFnbWVudFJlbmRlckNvbW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gZnJhZ21lbnRSZW5kZXJDb21tZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKGZyYWdtZW50UmVuZGVyQ29tbWVudC5lbmRzV2l0aChyZW5kZXJDb21tZW50RW5kKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gZnJhZ21lbnRSZW5kZXJDb21tZW50Lmxlbmd0aCAtIHJlbmRlckNvbW1lbnRFbmQubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gZnJhZ21lbnRSZW5kZXJDb21tZW50LnN1YnN0cmluZyhcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBsZW5ndGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZyYWdtZW50UmVuZGVyQ29tbWVudCA9IGZyYWdtZW50UmVuZGVyQ29tbWVudC50cmltKCk7XHJcbiAgICAgICAgbGV0IHJhd0ZyYWdtZW50OiBhbnkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQgPSBKU09OLnBhcnNlKGZyYWdtZW50UmVuZGVyQ29tbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RnJhZ21lbnQudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJhd0ZyYWdtZW50O1xyXG4gICAgfSxcclxuXHJcbiAgICBtYXJrT3B0aW9uc0V4cGFuZGVkOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5yZXNldEZyYWdtZW50VWlzKHN0YXRlKTtcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5vcHRpb25zRXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIGZyYWdtZW50LnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY29sbGFwc2VGcmFnbWVudHNPcHRpb25zOiAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWZyYWdtZW50XHJcbiAgICAgICAgICAgIHx8IGZyYWdtZW50Lm9wdGlvbnMubGVuZ3RoID09PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbi51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZXhwYW5kT3B0aW9uOiAoXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBvcHRpb246IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuY29sbGFwc2VGcmFnbWVudHNPcHRpb25zKGZyYWdtZW50KTtcclxuICAgICAgICBvcHRpb24udWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgICAgICBmcmFnbWVudC5zZWxlY3RlZCA9IG9wdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRGcmFnbWVudFVpczogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgICAgICBsZXQgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBmcmFnbWVudElEIGluIGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEKSB7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50SURdO1xyXG4gICAgICAgICAgICBnRnJhZ21lbnRDb2RlLnJlc2V0RnJhZ21lbnRVaShmcmFnbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldEZyYWdtZW50VWk6IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEN1cnJlbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhcmVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBwYXJlbnQuc2VsZWN0ZWQgPSBmcmFnbWVudDtcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnQgPSBmcmFnbWVudDtcclxuICAgICAgICBnSGlzdG9yeUNvZGUucHVzaEJyb3dzZXJIaXN0b3J5U3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGcmFnbWVudENvZGU7XHJcblxyXG4iLCJcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuaW1wb3J0IGdBamF4SGVhZGVyQ29kZSBmcm9tIFwiLi4vaHR0cC9nQWpheEhlYWRlckNvZGVcIjtcclxuaW1wb3J0IGdGcmFnbWVudEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuXHJcblxyXG5jb25zdCBnZXRGcmFnbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBmcmFnbWVudElEOiBzdHJpbmcsXHJcbiAgICBmcmFnbWVudFBhdGg6IHN0cmluZyxcclxuICAgIGFjdGlvbjogQWN0aW9uVHlwZSxcclxuICAgIGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhbGxJRDogc3RyaW5nID0gVS5nZW5lcmF0ZUd1aWQoKTtcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIGFjdGlvblxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjb25zdCBwYXRoOiBzdHJpbmcgPSBgU3RlcC8ke3N0ZXBJRH1gO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtmcmFnbWVudFBhdGh9YDtcclxuXHJcbiAgICByZXR1cm4gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBwYXJzZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICd0ZXh0JyxcclxuICAgICAgICBhY3Rpb246IGxvYWRBY3Rpb24sXHJcbiAgICAgICAgZXJyb3I6IChzdGF0ZTogSVN0YXRlLCBlcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIkVycm9yIGdldHRpbmcgZnJhZ21lbnQgZnJvbSB0aGUgc2VydmVyLCBwYXRoOiAke2ZyYWdtZW50UGF0aH0sIGlkOiAke2ZyYWdtZW50SUR9XCIsXHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiAke3VybH0sXHJcbiAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgIFwic3RhY2tcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMuc3RhY2spfSxcclxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6ICR7Z2V0RnJhZ21lbnQubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnRnJhZ21lbnRFZmZlY3RzID0ge1xyXG5cclxuICAgIC8vIGdldFJvb3RTdGVwOiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICByb290SUQ6IHN0cmluZyk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHJvb3RJRCxcclxuICAgIC8vICAgICAgICAgJzAnLFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFJvb3QsXHJcbiAgICAvLyAgICAgICAgIGdTdGVwQWN0aW9ucy5sb2FkUm9vdFN0ZXBcclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBnZXRGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgZnJhZ21lbnRQYXRoOiBzdHJpbmdcclxuICAgICk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnRnJhZ21lbnRBY3Rpb25zLmxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5HZXRGcmFnbWVudCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50SUQ6IHN0cmluZyxcclxuICAgICAgICBmcmFnbWVudFBhdGg6IHN0cmluZyxcclxuICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ0ZyYWdtZW50QWN0aW9ucy5sb2FkQ2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50SUQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5HZXRDaGFpbkZyYWdtZW50LFxyXG4gICAgICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZ2V0QW5jaWxsYXJ5OiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBzdGVwSUQ6IHN0cmluZyxcclxuICAgIC8vICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgdWlJRDogbnVtYmVyKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgY29uc3QgY2hhaW5SZXNwb25zZSA9IHtcclxuICAgIC8vICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgLy8gICAgICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgICAgIHVpSURcclxuICAgIC8vICAgICAgICAgfTtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMubG9hZEFuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgLy8gICAgICAgICApO1xyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgc3RlcElELFxyXG4gICAgLy8gICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAvLyAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICAvLyBnZXRBbmNpbGxhcnlTdGVwOiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBzdGVwSUQ6IHN0cmluZyxcclxuICAgIC8vICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgdWlJRDogbnVtYmVyKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgY29uc3QgY2hhaW5SZXNwb25zZSA9IHtcclxuICAgIC8vICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgLy8gICAgICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgICAgIHVpSURcclxuICAgIC8vICAgICAgICAgfTtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMubG9hZEFuY2lsbGFyeUNoYWluU3RlcChcclxuICAgIC8vICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgLy8gICAgICAgICApO1xyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgc3RlcElELFxyXG4gICAgLy8gICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAvLyAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZyYWdtZW50RWZmZWN0cztcclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi4vY29kZS9nRnJhZ21lbnRDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGcmFnbWVudEVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0c1wiO1xyXG5pbXBvcnQgZ0ZpbGVDb25zdGFudHMgZnJvbSBcIi4uL2dGaWxlQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBnSHRtbEFjdGlvbnMgZnJvbSBcIi4vZ0h0bWxBY3Rpb25zXCI7XHJcblxyXG5cclxuY29uc3QgZ0ZyYWdtZW50QWN0aW9ucyA9IHtcclxuXHJcbiAgICBleHBhbmRPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUubWFya09wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvblxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuc2V0Q3VycmVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHBhcmVudEZyYWdtZW50LFxyXG4gICAgICAgICAgICBvcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9uLnVpLmRpc2N1c3Npb25Mb2FkZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgZ0h0bWxBY3Rpb25zLmNoZWNrQW5kU2Nyb2xsVG9Ub3Aoc3RhdGUpO1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50UGF0aCA9IGAke3N0YXRlLnJlbmRlclN0YXRlLmd1aWRlPy5mcmFnbWVudEZvbGRlclVybH0vJHtvcHRpb24uaWR9JHtnRmlsZUNvbnN0YW50cy5mcmFnbWVudEZpbGVFeHRlbnNpb259YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGdGcmFnbWVudEVmZmVjdHMuZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbixcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50UGF0aFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55LFxyXG4gICAgICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5wYXJzZUFuZExvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnRleHREYXRhLFxyXG4gICAgICAgICAgICBvcHRpb24ub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnksXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnBhcnNlQW5kTG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudGV4dERhdGEsXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cyA9IHN0YXRlLnJlbmRlclN0YXRlLmxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHM7XHJcblxyXG4gICAgICAgIGlmIChsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0T3V0bGluZUZyYWdtZW50ID0gbG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cy5hdCgtMSkgPz8gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXh0T3V0bGluZUZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50RnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZE9wdGlvbjogSVJlbmRlckZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbbmV4dE91dGxpbmVGcmFnbWVudC5pXTtcclxuICAgICAgICAgICAgICAgIGV4cGFuZGVkT3B0aW9uLnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBnRnJhZ21lbnRDb2RlLmV4cGFuZE9wdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE9wdGlvblxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnRnJhZ21lbnRDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkT3B0aW9uXHJcbiAgICAgICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICBNYWtlIHN1cmUgc3libGluZ3MgYXJlIGNvbGxhcHNlZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICBNYWtlIHN1cmUgaXQgaXMgYWRkZWQgdG8gdGhlIHJvb3QgY2hhaW4hISFcclxuICAgICAgICAgICAgICAgIC8vICAgICAgQ2hlY2sgd2h5IGl0IGlzbid0IGRyYXdpbmdcclxuXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnRnJhZ21lbnRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgZ0ZyYWdtZW50QWN0aW9ucyBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuXHJcbmNvbnN0IGZyYWdtZW50QWN0aW9ucyA9IHtcclxuXHJcbiAgICAvLyB1c2VyX2V4cGFuZEFuY2lsbGFyeU9wdGlvbjogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgIC8vICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICBzdGF0ZS50b3BpY1N0YXRlLnVpLnJhdyA9IGZhbHNlO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmV4cGFuZEFuY2lsbGFyeU9wdGlvbihcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGNoYWluUGF5bG9hZFxyXG4gICAgLy8gICAgIClcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gdXNlcl9zaG93QW5jaWxsYXJ5OiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBjaGFpblBheWxvYWQ6IElDaGFpblN0ZXBQYXlsb2FkKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIC8vICAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIHN0YXRlLnRvcGljU3RhdGUudWkucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnU3RlcEFjdGlvbnMuc2hvd0FuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGNoYWluUGF5bG9hZFxyXG4gICAgLy8gICAgIClcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gdXNlcl9jb2xsYXBzZUFuY2lsbGFyeTogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgYW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5jb2xsYXBzZUFuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGFuY2lsbGFyeUNhY2hlXHJcbiAgICAvLyAgICAgKVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICB1c2VyRXhwYW5kT3B0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXlsb2FkOiBJRnJhZ21lbnRQYXlsb2FkXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBheWxvYWQ/LnBhcmVudEZyYWdtZW50XHJcbiAgICAgICAgICAgIHx8ICFwYXlsb2FkPy5vcHRpb25cclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdGcmFnbWVudEFjdGlvbnMuZXhwYW5kT3B0aW9uKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcGF5bG9hZC5wYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgcGF5bG9hZC5vcHRpb25cclxuICAgICAgICApXHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmcmFnbWVudEFjdGlvbnM7XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSUZyYWdtZW50UGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JRnJhZ21lbnRQYXlsb2FkXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJhZ21lbnRQYXlsb2FkIGltcGxlbWVudHMgSUZyYWdtZW50UGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGFyZW50RnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBvcHRpb246IElSZW5kZXJGcmFnbWVudFxyXG4gICAgICAgICkge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudEZyYWdtZW50ID0gcGFyZW50RnJhZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5vcHRpb24gPSBvcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcbiAgICBwdWJsaWMgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hpbGRyZW4sIFZOb2RlIH0gZnJvbSBcImh5cGVyLWFwcC1sb2NhbFwiO1xyXG5pbXBvcnQgeyBoIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBmcmFnbWVudEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZnJhZ21lbnRBY3Rpb25zXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nRnJhZ21lbnRDb2RlXCI7XHJcbmltcG9ydCBGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuaW1wb3J0IFwiLi4vc2Nzcy9mcmFnbWVudHMuc2Nzc1wiO1xyXG5cclxuXHJcbmNvbnN0IEJ1aWxkT3B0aW9uVmlldyA9IChcclxuICAgIHBhcmVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuKTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIW9wdGlvblxyXG4gICAgICAgIHx8IG9wdGlvbi5pc0FuY2lsbGFyeSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogXCJvcHRpb24tYm94XCIgfSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgaChcImFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRBY3Rpb25zLnVzZXJFeHBhbmRPcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2V2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWdtZW50UGF5bG9hZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuXCIsIHt9LCBvcHRpb24ub3B0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn1cclxuXHJcbmNvbnN0IGJ1aWxkRXhwYW5kZWRPcHRpb25zVmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCBvcHRpb25WaWV3czogQ2hpbGRyZW5bXSA9IFtdO1xyXG4gICAgbGV0IG9wdGlvblZldzogVk5vZGUgfCBudWxsO1xyXG5cclxuICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgb3B0aW9uVmV3ID0gQnVpbGRPcHRpb25WaWV3KFxyXG4gICAgICAgICAgICBmcmFnbWVudCxcclxuICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvblZldykge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uVmlld3MucHVzaChvcHRpb25WZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogYG50LWZyLWZyYWdtZW50LW9wdGlvbnNgIH0sIFtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvblZpZXdzXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZENvbGxhcHNlZE9wdGlvbnNWaWV3ID0gKF9mcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogYG50LWZyLWZyYWdtZW50LW9wdGlvbnNgIH0sIFtcclxuICAgICAgICAgICAgaChcImgxXCIsIHt9LCBcIk9wdGlvbnNcIilcclxuICAgICAgICBdKTtcclxuXHJcbiAgICByZXR1cm4gdmlldztcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkT3B0aW9uc1ZpZXcgPSAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgaWYgKCFmcmFnbWVudC5vcHRpb25zXHJcbiAgICAgICAgfHwgZnJhZ21lbnQub3B0aW9ucy5sZW5ndGggPT09IDBcclxuICAgICkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmcmFnbWVudC5zZWxlY3RlZFxyXG4gICAgICAgICYmICFmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCkge1xyXG5cclxuICAgICAgICByZXR1cm4gYnVpbGRDb2xsYXBzZWRPcHRpb25zVmlldyhmcmFnbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWxkRXhwYW5kZWRPcHRpb25zVmlldyhmcmFnbWVudCk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZEZyYWdtZW50VmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50IHwgbnVsbCk6IENoaWxkcmVuW10gPT4ge1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZyYWdtZW50RUxlbWVudElEID0gZ0ZyYWdtZW50Q29kZS5nZXRGcmFnbWVudEVsZW1lbnRJRChmcmFnbWVudC5pZCk7XHJcblxyXG4gICAgY29uc3QgdmlldzogQ2hpbGRyZW5bXSA9IFtcclxuXHJcbiAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogYCR7ZnJhZ21lbnRFTGVtZW50SUR9YCxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcIm50LWZyLWZyYWdtZW50LWJveFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBgbnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1kaXNjdXNzaW9uXCI6IGZyYWdtZW50LnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIlwiXHJcbiAgICAgICAgICAgICAgICApLFxyXG5cclxuICAgICAgICAgICAgICAgIGJ1aWxkT3B0aW9uc1ZpZXcoZnJhZ21lbnQpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApLFxyXG5cclxuICAgICAgICBidWlsZEZyYWdtZW50VmlldyhmcmFnbWVudC5zZWxlY3RlZClcclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn07XHJcblxyXG5jb25zdCBmcmFnbWVudFZpZXdzID0ge1xyXG5cclxuICAgIGJ1aWxkQ29udGVudFZpZXc6IChzdGF0ZTogSVN0YXRlKTogVk5vZGUgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsIHsgaWQ6IFwibnRfZnJfRnJhZ21lbnRzXCIgfSwgW1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1aWxkRnJhZ21lbnRWaWV3KHN0YXRlLnJlbmRlclN0YXRlLnJvb3QpXHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZyYWdtZW50Vmlld3M7XHJcblxyXG5cclxuIiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiaHlwZXItYXBwLWxvY2FsXCI7XHJcbmltcG9ydCB7IGggfSBmcm9tIFwiLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXItYXBwLWxvY2FsXCI7XHJcblxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuaW1wb3J0IFwiLi4vc2Nzcy9pbmRleC5zY3NzXCI7XHJcblxyXG5cclxuY29uc3QgZXJyb3JWaWV3cyA9IHtcclxuXHJcbiAgICBidWlsZEdlbmVyaWNFcnJvcjogKF9zdGF0ZTogSVN0YXRlKTogVk5vZGUgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsIHsgaWQ6ICdlcnJvcicgfSwgW1xyXG4gICAgICAgICAgICAgICAgaChcImgzXCIse30sIFwiU29ycnkgYnV0IHRoZSB1cmwgeW91IHJlcXVlc3RlZCBjYW4ndCBiZSBmb3VuZC5cIiApLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGVycm9yVmlld3M7XHJcblxyXG4iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCJoeXBlci1hcHAtbG9jYWxcIjtcclxuaW1wb3J0IHsgaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBpbml0QWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9pbml0QWN0aW9uc1wiO1xyXG5pbXBvcnQgZnJhZ21lbnRWaWV3cyBmcm9tIFwiLi4vLi4vZnJhZ21lbnRzL3ZpZXdzL2ZyYWdtZW50Vmlld3NcIjtcclxuaW1wb3J0IGVycm9yVmlld3MgZnJvbSBcIi4uLy4uL2Vycm9yL3ZpZXdzL2Vycm9yVmlld3NcIjtcclxuXHJcbmltcG9ydCBcIi4uL3Njc3MvaW5pdC5zY3NzXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdFZpZXcgPSB7XHJcblxyXG4gICAgYnVpbGRWaWV3OiAoc3RhdGU6IElTdGF0ZSk6IFZOb2RlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLmdlbmVyaWNFcnJvciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVycm9yVmlld3MuYnVpbGRHZW5lcmljRXJyb3Ioc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKHN0YXRlLnVzZXJcclxuICAgICAgICAvLyAgICAgJiYgIXN0YXRlPy51c2VyPy51c2VWc0NvZGVcclxuICAgICAgICAvLyAgICAgJiYgIXN0YXRlPy51c2VyPy5hdXRob3Jpc2VkKSB7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gbG9naW5WaWV3LmJ1aWxkVmlldyhzdGF0ZSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogaW5pdEFjdGlvbnMuc2V0Tm90UmF3LFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1haW5WaWV3cy5idWlsZENvbnRlbnRWaWV3KHN0YXRlKSxcclxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudFZpZXdzLmJ1aWxkQ29udGVudFZpZXcoc3RhdGUpLFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdFZpZXc7XHJcblxyXG4iLCJpbXBvcnQgSVNldHRpbmdzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVNldHRpbmdzXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3MgaW1wbGVtZW50cyBJU2V0dGluZ3Mge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9IFwiLTFcIjtcclxuICAgIHB1YmxpYyByOiBzdHJpbmcgPSBcIi0xXCI7XHJcblxyXG4gICAgLy8gQXV0aGVudGljYXRpb25cclxuICAgIHB1YmxpYyB1c2VyUGF0aDogc3RyaW5nID0gYHVzZXJgO1xyXG4gICAgcHVibGljIGRlZmF1bHRMb2dvdXRQYXRoOiBzdHJpbmcgPSBgbG9nb3V0YDtcclxuICAgIHB1YmxpYyBkZWZhdWx0TG9naW5QYXRoOiBzdHJpbmcgPSBgbG9naW5gO1xyXG4gICAgcHVibGljIHJldHVyblVybFN0YXJ0OiBzdHJpbmcgPSBgcmV0dXJuVXJsYDtcclxuXHJcbiAgICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZyA9ICh3aW5kb3cgYXMgYW55KS5BU1NJU1RBTlRfQkFTRV9VUkwgPz8gJyc7XHJcbiAgICBwdWJsaWMgbGlua1VybDogc3RyaW5nID0gKHdpbmRvdyBhcyBhbnkpLkFTU0lTVEFOVF9MSU5LX1VSTCA/PyAnJztcclxuICAgIHB1YmxpYyBzdWJzY3JpcHRpb25JRDogc3RyaW5nID0gKHdpbmRvdyBhcyBhbnkpLkFTU0lTVEFOVF9TVUJTQ1JJUFRJT05fSUQgPz8gJyc7XHJcblxyXG4gICAgcHVibGljIGFwaVVybDogc3RyaW5nID0gYCR7dGhpcy5iYXNlVXJsfS9hcGlgO1xyXG4gICAgcHVibGljIGJmZlVybDogc3RyaW5nID0gYCR7dGhpcy5iYXNlVXJsfS9iZmZgO1xyXG4gICAgcHVibGljIGZpbGVVcmw6IHN0cmluZyA9IGAke3RoaXMuYmFzZVVybH0vZmlsZWA7XHJcbn1cclxuIiwiaW1wb3J0IElQYWdpbmF0aW9uRGV0YWlscyBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JUGFnaW5hdGlvbkRldGFpbHNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdpbmF0aW9uRGV0YWlscyBpbXBsZW1lbnRzIElQYWdpbmF0aW9uRGV0YWlscyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcclxuICAgICAgICBjb3VudDogbnVtYmVyLFxyXG4gICAgICAgIHRvdGFsSXRlbXM6IG51bWJlcikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IHRvdGFsSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY291bnQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbEl0ZW1zOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IFBhZ2luYXRpb25EZXRhaWxzIGZyb20gXCIuL3VpL3BheWxvYWRzL1BhZ2luYXRpb25EZXRhaWxzXCI7XHJcbmltcG9ydCBJUGFnaW5hdGlvbkRldGFpbHMgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSVBhZ2luYXRpb25EZXRhaWxzXCI7XHJcbmltcG9ydCBJVG9waWNzU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVRvcGljc1N0YXRlXCI7XHJcbmltcG9ydCBJVG9waWMgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNzU3RhdGUgaW1wbGVtZW50cyBJVG9waWNzU3RhdGUge1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRJRDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBxdWV1ZWRLZXk6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgdG9waWNzOiBBcnJheTxJVG9waWM+ID0gW107XHJcbiAgICBwdWJsaWMgdG9waWNDb3VudDogbnVtYmVyID0gMDtcclxuICAgIFxyXG4gICAgcHVibGljIHBhZ2luYXRpb25EZXRhaWxzOiBJUGFnaW5hdGlvbkRldGFpbHMgPSBuZXcgUGFnaW5hdGlvbkRldGFpbHMoXHJcbiAgICAgICAgMCxcclxuICAgICAgICAxMCxcclxuICAgICAgICAwXHJcbiAgICApO1xyXG59XHJcbiIsImltcG9ydCBJVG9waWNTY2VuZVVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lUb3BpY1NjZW5lVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpY1NjZW5lVUkgaW1wbGVtZW50cyBJVG9waWNTY2VuZVVJIHtcclxuXHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJVG9waWNTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JVG9waWNTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljQ2FjaGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljQ2FjaGVcIjtcclxuaW1wb3J0IElBcnRpY2xlU2NlbmUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvaGlzdG9yeS9JQXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBJVG9waWNTY2VuZVVJIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lUb3BpY1NjZW5lVUlcIjtcclxuaW1wb3J0IFRvcGljU2NlbmVVSSBmcm9tIFwiLi91aS9Ub3BpY1NjZW5lVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpY1N0YXRlIGltcGxlbWVudHMgSVRvcGljU3RhdGUge1xyXG5cclxuICAgIHB1YmxpYyB0b3BpY0NhY2hlOiBJVG9waWNDYWNoZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyZWRTdGVwczogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBjdXJyZW50U3RlcDogSVN0ZXBDYWNoZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpc0FydGljbGVWaWV3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBhcnRpY2xlU2NlbmU6IElBcnRpY2xlU2NlbmUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnaG9zdEFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGFuY2lsbGFyeUV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgb3B0aW9uRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgcHVibGljIHVpOiBJVG9waWNTY2VuZVVJID0gbmV3IFRvcGljU2NlbmVVSSgpO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBuYXZpZ2F0aW9uRGlyZWN0aW9uIHtcclxuXHJcbiAgICBCdXR0b25zID0gJ2J1dHRvbnMnLFxyXG4gICAgQmFja3dhcmRzID0gJ2JhY2t3YXJkcycsXHJcbiAgICBGb3J3YXJkcyA9ICdmb3J3YXJkcydcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgbmF2aWdhdGlvbkRpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb25cIjtcclxuaW1wb3J0IElIaXN0b3J5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlcIjtcclxuaW1wb3J0IElIaXN0b3J5VXJsIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlVcmxcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaXN0b3J5IGltcGxlbWVudHMgSUhpc3Rvcnkge1xyXG5cclxuICAgIHB1YmxpYyBoaXN0b3J5Q2hhaW46IEFycmF5PElIaXN0b3J5VXJsPiA9IFtdO1xyXG4gICAgcHVibGljIGRpcmVjdGlvbjogbmF2aWdhdGlvbkRpcmVjdGlvbiA9IG5hdmlnYXRpb25EaXJlY3Rpb24uQnV0dG9ucztcclxuICAgIHB1YmxpYyBjdXJyZW50SW5kZXg6IG51bWJlciA9IDA7XHJcbn1cclxuIiwiaW1wb3J0IElVc2VyIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVVzZXJcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGltcGxlbWVudHMgSVVzZXIge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9IGAwMTIzNDU2Nzg5YDtcclxuICAgIHB1YmxpYyByOiBzdHJpbmcgPSBcIi0xXCI7XHJcbiAgICBwdWJsaWMgdXNlVnNDb2RlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBhdXRob3Jpc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBsb2dvdXRVcmw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHN1Yjogc3RyaW5nID0gXCJcIjtcclxufVxyXG4iLCJpbXBvcnQgSVNlYXJjaFVJIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL3NlYXJjaC9JU2VhcmNoVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hVSSBpbXBsZW1lbnRzIElTZWFyY2hVSSB7XHJcblxyXG4gICAgcHVibGljIGhhc0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTZWFyY2hTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU2VhcmNoU3RhdGVcIjtcclxuaW1wb3J0IElTZWFyY2hVSSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9zZWFyY2gvSVNlYXJjaFVJXCI7XHJcbmltcG9ydCBTZWFyY2hVSSBmcm9tIFwiLi91aS9zZWFyY2gvU2VhcmNoVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hTdGF0ZSBpbXBsZW1lbnRzIElTZWFyY2hTdGF0ZSB7XHJcbiAgIFxyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZyB8IG51bGwgPSBcIlwiO1xyXG4gICAgcHVibGljIHVpOiBJU2VhcmNoVUkgPSBuZXcgU2VhcmNoVUkoKTtcclxufVxyXG4iLCJpbXBvcnQgSVJlcGVhdEVmZmVjdHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JUmVwZWF0RWZmZWN0c1wiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSUFjdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQWN0aW9uXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwZWF0ZUVmZmVjdHMgaW1wbGVtZW50cyBJUmVwZWF0RWZmZWN0cyB7XHJcblxyXG4gICAgcHVibGljIHNob3J0SW50ZXJ2YWxIdHRwOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIC8vIHB1YmxpYyByZUxvYWRHZXRIdHRwOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIHB1YmxpYyByZUxvYWRHZXRIdHRwSW1tZWRpYXRlOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIHB1YmxpYyBydW5BY3Rpb25JbW1lZGlhdGU6IEFycmF5PElBY3Rpb24+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJTdGF0ZVVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lSZW5kZXJTdGF0ZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU3RhdGVVSSBpbXBsZW1lbnRzIElSZW5kZXJTdGF0ZVVJIHtcclxuXHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBvcHRpb25zRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lSZW5kZXJTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJHdWlkZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckd1aWRlXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJTdGF0ZVVJIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lSZW5kZXJTdGF0ZVVJXCI7XHJcbmltcG9ydCBSZW5kZXJTdGF0ZVVJIGZyb20gXCIuL3VpL1JlbmRlclN0YXRlVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJTdGF0ZSBpbXBsZW1lbnRzIElSZW5kZXJTdGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGd1aWRlOiBJUmVuZGVyR3VpZGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyByb290OiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjdXJyZW50RnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG91dGxpbmU6IElSZW5kZXJPdXRsaW5lIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHM6IEFycmF5PElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gU2VhcmNoIGluZGljZXNcclxuICAgIHB1YmxpYyBpbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEOiBhbnkgPSB7fTtcclxuICAgIHB1YmxpYyBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDogYW55ID0ge307XHJcbiAgICBwdWJsaWMgaW5kZXhfcmF3RnJhZ21lbnRzX2ZyYWdtZW50SUQ6IGFueSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyB1aTogSVJlbmRlclN0YXRlVUkgPSBuZXcgUmVuZGVyU3RhdGVVSSgpO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiLi91c2VyL1NldHRpbmdzXCI7XHJcbmltcG9ydCBJU2V0dGluZ3MgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdXNlci9JU2V0dGluZ3NcIjtcclxuaW1wb3J0IElUb3BpY3NTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JVG9waWNzU3RhdGVcIjtcclxuaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG5pbXBvcnQgVG9waWNzU3RhdGUgZnJvbSBcIi4vVG9waWNzU3RhdGVcIjtcclxuaW1wb3J0IElUb3BpY1N0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lUb3BpY1N0YXRlXCI7XHJcbmltcG9ydCBUb3BpY1N0YXRlIGZyb20gXCIuL1RvcGljU3RhdGVcIjtcclxuaW1wb3J0IElIaXN0b3J5IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlcIjtcclxuaW1wb3J0IFN0ZXBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnkvSGlzdG9yeVwiO1xyXG5pbXBvcnQgSVVzZXIgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdXNlci9JVXNlclwiO1xyXG5pbXBvcnQgVXNlciBmcm9tIFwiLi91c2VyL1VzZXJcIjtcclxuaW1wb3J0IElTZWFyY2hTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU2VhcmNoU3RhdGVcIjtcclxuaW1wb3J0IFNlYXJjaFN0YXRlIGZyb20gXCIuL1NlYXJjaFN0YXRlXCI7XHJcbmltcG9ydCBJUmVwZWF0RWZmZWN0cyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9lZmZlY3RzL0lSZXBlYXRFZmZlY3RzXCI7XHJcbmltcG9ydCBSZXBlYXRlRWZmZWN0cyBmcm9tIFwiLi9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzXCI7XHJcbmltcG9ydCBJUmVuZGVyU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVJlbmRlclN0YXRlXCI7XHJcbmltcG9ydCBSZW5kZXJTdGF0ZSBmcm9tIFwiLi9SZW5kZXJTdGF0ZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3M6IElTZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzaG93U29sdXRpb25zTWVudTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHR3aXR0ZXJVcmw6IHN0cmluZyA9ICdodHRwczovL3R3aXR0ZXIuY29tL25ldG9mdHJlZXMnO1xyXG4gICAgcHVibGljIGxpbmtlZGluVXJsOiBzdHJpbmcgPSAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvbmV0b2Z0cmVlcy9hYm91dCc7XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlUeXBlOiBEaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLlRvcGljcztcclxuICAgIHB1YmxpYyBsb2FkaW5nOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBkZWJ1ZzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ2VuZXJpY0Vycm9yOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmV4dEtleTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzZXR0aW5nczogSVNldHRpbmdzO1xyXG4gICAgcHVibGljIHVzZXI6IElVc2VyID0gbmV3IFVzZXIoKTtcclxuXHJcbiAgICBwdWJsaWMgdG9waWNzU3RhdGU6IElUb3BpY3NTdGF0ZSA9IG5ldyBUb3BpY3NTdGF0ZSgpO1xyXG4gICAgcHVibGljIHRvcGljU3RhdGU6IElUb3BpY1N0YXRlID0gbmV3IFRvcGljU3RhdGUoKTtcclxuICAgIHB1YmxpYyBzZWFyY2hTdGF0ZTogSVNlYXJjaFN0YXRlID0gbmV3IFNlYXJjaFN0YXRlKCk7XHJcbiAgICBwdWJsaWMgcmVuZGVyU3RhdGU6IElSZW5kZXJTdGF0ZSA9IG5ldyBSZW5kZXJTdGF0ZSgpO1xyXG5cclxuICAgIHB1YmxpYyByZXBlYXRFZmZlY3RzOiBJUmVwZWF0RWZmZWN0cyA9IG5ldyBSZXBlYXRlRWZmZWN0cygpO1xyXG5cclxuICAgIHB1YmxpYyBzdGVwSGlzdG9yeTogSUhpc3RvcnkgPSBuZXcgU3RlcEhpc3RvcnkoKTtcclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7IFNjcm9sbEhvcFR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlXCI7XHJcbmltcG9ydCBJU2NyZWVuIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3dpbmRvdy9JU2NyZWVuXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuIGltcGxlbWVudHMgSVNjcmVlbiB7XHJcblxyXG4gICAgcHVibGljIGF1dG9mb2N1czogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQXV0b2ZvY3VzRmlyc3RSdW46IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGhpZGVCYW5uZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzY3JvbGxUb1RvcDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHNjcm9sbFRvRWxlbWVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2Nyb2xsSG9wOiBTY3JvbGxIb3BUeXBlID0gU2Nyb2xsSG9wVHlwZS5Ob25lO1xyXG4gICAgcHVibGljIGxhc3RTY3JvbGxZOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1YTogYW55IHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElTY3JlZW4gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvd2luZG93L0lTY3JlZW5cIjtcclxuaW1wb3J0IElUcmVlU29sdmUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvd2luZG93L0lUcmVlU29sdmVcIjtcclxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9TY3JlZW5cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlU29sdmUgaW1wbGVtZW50cyBJVHJlZVNvbHZlIHtcclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyaW5nQ29tbWVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2NyZWVuOiBJU2NyZWVuID0gbmV3IFNjcmVlbigpO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyT3V0bGluZUZyYWdtZW50IGltcGxlbWVudHMgSVJlbmRlck91dGxpbmVGcmFnbWVudCB7XHJcblxyXG4gICAgcHVibGljIGk6IHN0cmluZyA9ICcnOyAvLyBpZFxyXG4gICAgcHVibGljIGY6IHN0cmluZyA9ICcnOyAvLyBmcmFnbWVudCBpZFxyXG4gICAgcHVibGljIGM6IHN0cmluZyA9ICcnOyAvLyBjaGFydCBpZCBmcm9tIG91dGxpbmUgY2hhcnQgYXJyYXlcclxuICAgIHB1YmxpYyBvOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiA9IFtdOyAvLyBvcHRpb25zXHJcbiAgICBwdWJsaWMgcGFyZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJPdXRsaW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVDaGFydFwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuL1JlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlck91dGxpbmUgaW1wbGVtZW50cyBJUmVuZGVyT3V0bGluZSB7XHJcblxyXG4gICAgcHVibGljIHY6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHI6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgPSBuZXcgUmVuZGVyT3V0bGluZUZyYWdtZW50KCk7XHJcbiAgICBwdWJsaWMgYzogQXJyYXk8SVJlbmRlck91dGxpbmVDaGFydD4gPSBbXTtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVDaGFydFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlck91dGxpbmVDaGFydCBpbXBsZW1lbnRzIElSZW5kZXJPdXRsaW5lQ2hhcnQge1xyXG5cclxuICAgIHB1YmxpYyBpOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwOiBzdHJpbmcgPSAnJztcclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lIGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZVwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4vZ0ZyYWdtZW50Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRGcmFnbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXdGcmFnbWVudDogYW55LFxyXG4gICAgcGFyZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGxcclxuKTogSVJlbmRlck91dGxpbmVGcmFnbWVudCA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnQgPSBuZXcgUmVuZGVyT3V0bGluZUZyYWdtZW50KCk7XHJcbiAgICBmcmFnbWVudC5pID0gcmF3RnJhZ21lbnQuaTtcclxuICAgIGZyYWdtZW50LmYgPSByYXdGcmFnbWVudC5mO1xyXG4gICAgZnJhZ21lbnQucGFyZW50ID0gcGFyZW50O1xyXG4gICAgc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudC5pXSA9IGZyYWdtZW50O1xyXG5cclxuICAgIGlmIChyYXdGcmFnbWVudC5vXHJcbiAgICAgICAgJiYgQXJyYXkuaXNBcnJheShyYXdGcmFnbWVudC5vKSA9PT0gdHJ1ZVxyXG4gICAgICAgICYmIHJhd0ZyYWdtZW50Lm8ubGVuZ3RoID4gMFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IG86IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHJhd0ZyYWdtZW50Lm8pIHtcclxuXHJcbiAgICAgICAgICAgIG8gPSBsb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbixcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudC5vLnB1c2gobyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmcmFnbWVudDtcclxufTtcclxuXHJcbmNvbnN0IGxvYWRDaGFydHMgPSAoXHJcbiAgICBvdXRsaW5lOiBJUmVuZGVyT3V0bGluZSxcclxuICAgIHJhd091dGxpbmVDaGFydHM6IEFycmF5PGFueT5cclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgb3V0bGluZS5jID0gW107XHJcbiAgICBsZXQgYzogSVJlbmRlck91dGxpbmVDaGFydDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGNoYXJ0IG9mIHJhd091dGxpbmVDaGFydHMpIHtcclxuXHJcbiAgICAgICAgYyA9IG5ldyBSZW5kZXJPdXRsaW5lQ2hhcnQoKTtcclxuICAgICAgICBjLmkgPSBjaGFydC5pO1xyXG4gICAgICAgIGMucCA9IGNoYXJ0LnA7XHJcbiAgICAgICAgb3V0bGluZS5jLnB1c2goYyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBnT3V0bGluZUNvZGUgPSB7XHJcblxyXG4gICAgZ2V0T3V0bGluZUZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQgPz8gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0T3V0bGluZUZyYWdtZW50Q2hhaW46IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGZyYWdtZW50SUQpIHtcclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50ID0gZ091dGxpbmVDb2RlLmdldE91dGxpbmVGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRJRFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmcmFnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50SUQgPSBmcmFnbWVudC5pO1xyXG4gICAgICAgICAgICBmcmFnbWVudElEcy5wdXNoKGZyYWdtZW50SUQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50SURzO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkT3V0bGluZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByYXdPdXRsaW5lID0gb3V0bGluZVJlc3BvbnNlLmpzb25EYXRhO1xyXG4gICAgICAgIGNvbnN0IG91dGxpbmUgPSBuZXcgUmVuZGVyT3V0bGluZSgpO1xyXG4gICAgICAgIG91dGxpbmUudiA9IHJhd091dGxpbmUudjtcclxuXHJcbiAgICAgICAgaWYgKHJhd091dGxpbmUuY1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KHJhd091dGxpbmUuYykgPT09IHRydWVcclxuICAgICAgICAgICAgJiYgcmF3T3V0bGluZS5jLmxlbmd0aCA+IDBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbG9hZENoYXJ0cyhcclxuICAgICAgICAgICAgICAgIG91dGxpbmUsXHJcbiAgICAgICAgICAgICAgICByYXdPdXRsaW5lLmNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmUudiA9IHJhd091dGxpbmUudjtcclxuXHJcbiAgICAgICAgb3V0bGluZS5yID0gbG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSwgXHJcbiAgICAgICAgICAgIHJhd091dGxpbmUuclxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLm91dGxpbmUgPSBvdXRsaW5lO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRChzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnT3V0bGluZUNvZGU7XHJcblxyXG4iLCJpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgZ091dGxpbmVDb2RlIGZyb20gXCIuLi9jb2RlL2dPdXRsaW5lQ29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRFZmZlY3RzIGZyb20gXCIuLi9lZmZlY3RzL2dGcmFnbWVudEVmZmVjdHNcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5cclxuXHJcbmNvbnN0IGdPdXRsaW5lQWN0aW9ucyA9IHtcclxuXHJcbiAgICBsb2FkT3V0bGluZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgZ091dGxpbmVDb2RlLmxvYWRPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRPdXRsaW5lQW5kUmVxdWVzdEZyYWdtZW50czogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnksXHJcbiAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRGb2xkZXJVcmwgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZT8uZnJhZ21lbnRGb2xkZXJVcmw7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShmcmFnbWVudEZvbGRlclVybCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdPdXRsaW5lQ29kZS5sb2FkT3V0bGluZShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG91dGxpbmVSZXNwb25zZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgb3V0bGluZWZyYWdtZW50IHdpdGggaWQgPSBsYXN0RnJhZ21lbnRJRDtcclxuICAgICAgICAvLyBUaGVuIHdhbGsgdXAgdGhyb3VnaCB0aGUgcGFyZW50cywgbG9hZGluZyBlYWNoIGluIHR1cm4gdW50aWwgcmVhY2hpbmcgcm9vdFxyXG5cclxuICAgICAgICBsZXQgY2hhaW5PdXRsaW5lRnJhZ21lbnRzOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3V0bGluZUZyYWdtZW50ID0gZ091dGxpbmVDb2RlLmdldE91dGxpbmVGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHdoaWxlIChvdXRsaW5lRnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNoYWluT3V0bGluZUZyYWdtZW50cy5wdXNoKG91dGxpbmVGcmFnbWVudCk7XHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudCA9IG91dGxpbmVGcmFnbWVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFpbk91dGxpbmVGcmFnbWVudHMucG9wKCk7IC8vIFJlbW92ZSBhcyB0aGlzIGlzIHRoZSByb290IGFuZCBpcyBhbHJlYWR5IGxvYWRlZCB3aXRoIHRoZSBndWlkZVxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHMgPSBjaGFpbk91dGxpbmVGcmFnbWVudHM7XHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRMb2FkRWZmZWN0czogQXJyYXk8SUh0dHBGZXRjaEl0ZW0+ID0gW107XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50UGF0aDogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsb2FkRnJhZ21lbnRFZmZlY3Q6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gY2hhaW5PdXRsaW5lRnJhZ21lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQgPSBjaGFpbk91dGxpbmVGcmFnbWVudHNbaV07XHJcbiAgICAgICAgICAgIGZyYWdtZW50ID0gaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50LmZdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZyYWdtZW50XHJcbiAgICAgICAgICAgICAgICAmJiBmcmFnbWVudC51aS5kaXNjdXNzaW9uTG9hZGVkID09PSB0cnVlXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCA9IGAke2ZyYWdtZW50Rm9sZGVyVXJsfS8ke291dGxpbmVGcmFnbWVudC5mfSR7Z0ZpbGVDb25zdGFudHMuZnJhZ21lbnRGaWxlRXh0ZW5zaW9ufWA7XHJcblxyXG4gICAgICAgICAgICBsb2FkRnJhZ21lbnRFZmZlY3QgPSBnRnJhZ21lbnRFZmZlY3RzLmdldENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudC5mLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQYXRoLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50LmlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsb2FkRnJhZ21lbnRFZmZlY3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudExvYWRFZmZlY3RzLnB1c2gobG9hZEZyYWdtZW50RWZmZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50TG9hZEVmZmVjdHNcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ091dGxpbmVBY3Rpb25zO1xyXG4iLCJcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuLi9odHRwL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5pbXBvcnQgZ1JlbmRlckFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ091dGxpbmVBY3Rpb25zXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5cclxuXHJcbmNvbnN0IGdldEd1aWRlT3V0bGluZSA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBsb2FkRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCBvdXRsaW5lUmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXlcclxuKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuZ3VpZGU/LnBhdGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgQWN0aW9uVHlwZS5HZXRPdXRsaW5lXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGZyYWdtZW50Rm9sZGVyVXJsOiBzdHJpbmcgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZS5mcmFnbWVudEZvbGRlclVybCA/PyAnbnVsbCc7XHJcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHtmcmFnbWVudEZvbGRlclVybH0udHNvbG5gO1xyXG5cclxuICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGxvYWREZWxlZ2F0ZSxcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgZ2V0dGluZyBvdXRsaW5lIGRhdGEgZnJvbSB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dSZW5kZXJFZmZlY3RzLmdldEd1aWRlT3V0bGluZS5uYW1lfSxcclxuICAgICAgICAgICAgICAgIFwiY2FsbElEOiAke2NhbGxJRH1cclxuICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnUmVuZGVyRWZmZWN0cyA9IHtcclxuXHJcbiAgICBnZXRHdWlkZU91dGxpbmU6IChzdGF0ZTogSVN0YXRlKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRHdWlkZU91dGxpbmUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnUmVuZGVyQWN0aW9ucy5sb2FkT3V0bGluZVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEd1aWRlT3V0bGluZUFuZExvYWRGcmFnbWVudHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9hZERlbGVnYXRlID0gKFxyXG4gICAgICAgICAgICBzdGF0ZTogSVN0YXRlLCBcclxuICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1JlbmRlckFjdGlvbnMubG9hZE91dGxpbmVBbmRSZXF1ZXN0RnJhZ21lbnRzKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lUmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SURcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0R3VpZGVPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgbG9hZERlbGVnYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdSZW5kZXJFZmZlY3RzO1xyXG4iLCJpbXBvcnQgSVJlbmRlckd1aWRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyR3VpZGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJHdWlkZSBpbXBsZW1lbnRzIElSZW5kZXJHdWlkZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBmcmFnbWVudEZvbGRlclVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJHdWlkZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckd1aWRlXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgUmVuZGVyR3VpZGUgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJHdWlkZVwiO1xyXG5pbXBvcnQgVHJlZVNvbHZlIGZyb20gXCIuLi8uLi9zdGF0ZS93aW5kb3cvVHJlZVNvbHZlXCI7XHJcbmltcG9ydCBnRmlsZUNvbnN0YW50cyBmcm9tIFwiLi4vZ0ZpbGVDb25zdGFudHNcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4vZ0ZyYWdtZW50Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IHBhcnNlR3VpZGUgPSAocmF3R3VpZGU6IGFueSk6IElSZW5kZXJHdWlkZSA9PiB7XHJcblxyXG4gICAgY29uc3QgZ3VpZGU6IElSZW5kZXJHdWlkZSA9IG5ldyBSZW5kZXJHdWlkZShyYXdHdWlkZS5pZCk7XHJcbiAgICBndWlkZS50aXRsZSA9IHJhd0d1aWRlLnRpdGxlID8/ICcnO1xyXG4gICAgZ3VpZGUuZGVzY3JpcHRpb24gPSByYXdHdWlkZS5kZXNjcmlwdGlvbiA/PyAnJztcclxuICAgIGd1aWRlLnBhdGggPSByYXdHdWlkZS5wYXRoID8/IG51bGw7XHJcbiAgICBjb25zdCBmb2xkZXJQYXRoID0gcmF3R3VpZGUuZnJhZ21lbnRGb2xkZXJQYXRoID8/IG51bGw7XHJcblxyXG4gICAgaWYgKCFVLmlzTnVsbE9yV2hpdGVTcGFjZShmb2xkZXJQYXRoKSkge1xyXG5cclxuICAgICAgICBndWlkZS5mcmFnbWVudEZvbGRlclVybCA9IGAke2xvY2F0aW9uLm9yaWdpbn0ke2ZvbGRlclBhdGh9YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3VpZGU7XHJcbn07XHJcblxyXG5jb25zdCBwYXJzZVJlbmRlcmluZ0NvbW1lbnQgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgcmF3OiBhbnlcclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFyYXcpIHtcclxuICAgICAgICByZXR1cm4gcmF3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbntcclxuICAgIFwiZ3VpZGVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCJkQnQ3Sk4xdnRcIlxyXG4gICAgfSxcclxuICAgIFwiZnJhZ21lbnRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCJkQnQ3Sk4xdnRcIixcclxuICAgICAgICBcInRvcExldmVsTWFwS2V5XCI6IFwiY3YxVFJsMDFyZlwiLFxyXG4gICAgICAgIFwibWFwS2V5Q2hhaW5cIjogXCJjdjFUUmwwMXJmXCIsXHJcbiAgICAgICAgXCJndWlkZUlEXCI6IFwiZEJ0N0pOMUhlXCIsXHJcbiAgICAgICAgXCJndWlkZVBhdGhcIjogXCJjOi9HaXRIdWIvSEFMLkRvY3VtZW50YXRpb24vdHNtYXBzVGVzdC9UZXN0T3B0aW9uc0ZvbGRlci9Ib2xkZXIvVGVzdE9wdGlvbnMudHNtYXBcIixcclxuICAgICAgICBcInBhcmVudEZyYWdtZW50SURcIjogbnVsbCxcclxuICAgICAgICBcImNoYXJ0S2V5XCI6IFwiY3YxVFJsMDFyZlwiLFxyXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkQnQ3S1oxQU5cIixcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uXCI6IFwiT3B0aW9uIDFcIixcclxuICAgICAgICAgICAgICAgIFwiaXNBbmNpbGxhcnlcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IDFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBcImRCdDdLWjFSYlwiLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25cIjogXCJPcHRpb24gMlwiLFxyXG4gICAgICAgICAgICAgICAgXCJpc0FuY2lsbGFyeVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib3JkZXJcIjogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwiZEJ0N0taMjRCXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvblwiOiBcIk9wdGlvbiAzXCIsXHJcbiAgICAgICAgICAgICAgICBcImlzQW5jaWxsYXJ5XCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiAzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0gICAgXHJcbiAgICAqL1xyXG5cclxuICAgIHN0YXRlLnJlbmRlclN0YXRlLmd1aWRlID0gcGFyc2VHdWlkZShyYXcuZ3VpZGUpO1xyXG5cclxuICAgIGdGcmFnbWVudENvZGUucGFyc2VBbmRMb2FkUm9vdEZyYWdtZW50KFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIHJhdy5mcmFnbWVudFxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGdSZW5kZXJDb2RlID0ge1xyXG5cclxuICAgIHJlZ2lzdGVyR3VpZGVDb21tZW50OiAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyZWVTb2x2ZUd1aWRlOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbHRlcnMudHJlZVNvbHZlR3VpZGVJRCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0cmVlU29sdmVHdWlkZVxyXG4gICAgICAgICAgICAmJiB0cmVlU29sdmVHdWlkZS5oYXNDaGlsZE5vZGVzKCkgPT09IHRydWVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkTm9kZTogQ2hpbGROb2RlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlU29sdmVHdWlkZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hpbGROb2RlID0gdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUgPSBuZXcgVHJlZVNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnJlbmRlcmluZ0NvbW1lbnQgPSBjaGlsZE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VSZW5kZXJpbmdDb21tZW50OiAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmU/LnJlbmRlcmluZ0NvbW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGd1aWRlUmVuZGVyQ29tbWVudCA9IHdpbmRvdy5UcmVlU29sdmUucmVuZGVyaW5nQ29tbWVudDtcclxuICAgICAgICAgICAgZ3VpZGVSZW5kZXJDb21tZW50ID0gZ3VpZGVSZW5kZXJDb21tZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ3VpZGVSZW5kZXJDb21tZW50LnN0YXJ0c1dpdGgoZ0ZpbGVDb25zdGFudHMuZ3VpZGVSZW5kZXJDb21tZW50VGFnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBndWlkZVJlbmRlckNvbW1lbnQgPSBndWlkZVJlbmRlckNvbW1lbnQuc3Vic3RyaW5nKGdGaWxlQ29uc3RhbnRzLmd1aWRlUmVuZGVyQ29tbWVudFRhZy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCByYXcgPSBKU09OLnBhcnNlKGd1aWRlUmVuZGVyQ29tbWVudCk7XHJcblxyXG4gICAgICAgICAgICBwYXJzZVJlbmRlcmluZ0NvbW1lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHJhd1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJGcmFnbWVudENvbW1lbnQ6ICgpID0+IHtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdSZW5kZXJDb2RlO1xyXG4iLCIvLyBpbXBvcnQgdG9waWNzSW5pdFN0YXRlIGZyb20gXCIuLi8uLi9jb3JlL3RvcGljc0NvcmUvY29kZS90b3BpY3NJbml0U3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vc3RhdGUvU3RhdGVcIjtcclxuLy8gaW1wb3J0IHN0ZXBJbml0U3RhdGUgZnJvbSBcIi4uLy4uL2NvcmUvc3RlcENvcmUvY29kZS9zdGVwSW5pdFN0YXRlXCI7XHJcbmltcG9ydCBUcmVlU29sdmUgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL3dpbmRvdy9UcmVlU29sdmVcIjtcclxuLy8gaW1wb3J0IElCcm93c2VyRGV0YWlscyBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQnJvd3NlckRldGFpbHNcIjtcclxuLy8gaW1wb3J0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkFjdGlvbnNcIjtcclxuLy8gaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNcIjtcclxuLy8gaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrXCI7XHJcbi8vIGltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG4vLyBpbXBvcnQgeyBnU2VxdWVudGlhbEh0dHAgfSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2h0dHAvZ0h0dHBcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9nVXRpbGl0aWVzXCI7XHJcbi8vIGltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9jb2RlL2dIaXN0b3J5Q29kZVwiO1xyXG4vLyBpbXBvcnQgeyBEaXNwbGF5VHlwZSB9IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL2VudW1zL0Rpc3BsYXlUeXBlXCI7XHJcbi8vIGltcG9ydCBhcnRpY2xlSW5pdFN0YXRlIGZyb20gXCIuLi8uLi9jb3JlL3N0ZXBDb3JlL2NvZGUvYXJ0aWNsZUluaXRTdGF0ZVwiO1xyXG5pbXBvcnQgZ1JlbmRlckVmZmVjdHMgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9lZmZlY3RzL2dSZW5kZXJFZmZlY3RzXCI7XHJcbmltcG9ydCBnUmVuZGVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ1JlbmRlckNvZGVcIjtcclxuXHJcblxyXG4vLyBjb25zdCBkZWJ1Z0ZpeCA9ICgpOiB2b2lkID0+IHtcclxuXHJcbi8vICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vbG9jYWxob3N0OlwiKSkge1xyXG5cclxuLy8gICAgICAgICAvLyBJZGVudGl0eVNlcnZlciBoYXMgdGhlIGNhbGxiYWNrIGFkZHJlc3MgYXMgMTI3LjAuMC4xIG5vdCBsb2NhaG9zdFxyXG4vLyAgICAgICAgIC8vIFRoaXMgbWVhbnMgdGhlIGxvY2Fsc3RvcmFnZSBpcyB3cml0dGVuIHRvIHRoZSBsb2NhbGhvc3QgdXJsIGFuZCByZXF1ZXN0ZWQgb24gY2FsbGJhY2sgZnJvbSB0aGUgMTI3LjAuMC4xIHVybFxyXG4vLyAgICAgICAgIC8vIHNvIGlzIG51bGxcclxuLy8gICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoXCJodHRwczovL2xvY2FsaG9zdDpcIiwgXCJodHRwczovLzEyNy4wLjAuMTpcIilcclxuLy8gICAgIH1cclxuLy8gfTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VTdGF0ZSA9ICgpOiBJU3RhdGUgPT4ge1xyXG5cclxuICAgIC8vIGRlYnVnRml4KCk7XHJcblxyXG4gICAgaWYgKCF3aW5kb3cuVHJlZVNvbHZlKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUgPSBuZXcgVHJlZVNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RhdGU6IElTdGF0ZSA9IG5ldyBTdGF0ZSgpO1xyXG4gICAgZ1JlbmRlckNvZGUucGFyc2VSZW5kZXJpbmdDb21tZW50KHN0YXRlKTtcclxuXHJcbiAgICAvLyBsb2FkQnJvd3NlckRldGFpbHMoKTtcclxuXHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn07XHJcblxyXG5cclxuLy8gY29uc3QgbG9hZEJyb3dzZXJEZXRhaWxzID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuLy8gICAgIHRyeSB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IGlzSU9TID0gW1xyXG4vLyAgICAgICAgICAgICAnaVBhZCcsXHJcbi8vICAgICAgICAgICAgICdpUGhvbmUnLFxyXG4vLyAgICAgICAgICAgICAnaVBvZCdcclxuLy8gICAgICAgICBdLmluY2x1ZGVzKG5hdmlnYXRvci5wbGF0Zm9ybSlcclxuLy8gICAgICAgICAgICAgLy8gaVBhZCBvbiBpT1MgMTMgZGV0ZWN0aW9uXHJcbi8vICAgICAgICAgICAgIHx8IChuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKFwiTWFjXCIpICYmIFwib250b3VjaGVuZFwiIGluIGRvY3VtZW50KTtcclxuXHJcbi8vICAgICAgICAgaWYgKGlzSU9TKSB7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBicm93c2VyRGV0YWlscyA9IHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICBwbGF0Zm9ybTogXCJpT1NcIixcclxuLy8gICAgICAgICAgICAgICAgIG1vYmlsZTogdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4udWEgPSBicm93c2VyRGV0YWlscyBhcyBJQnJvd3NlckRldGFpbHM7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2Uge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBuYXY6IGFueSA9IG5hdmlnYXRvciBhcyBhbnk7XHJcblxyXG4vLyAgICAgICAgICAgICBuYXYudXNlckFnZW50RGF0YS5nZXRIaWdoRW50cm9weVZhbHVlcyhcclxuLy8gICAgICAgICAgICAgICAgIFtcclxuLy8gICAgICAgICAgICAgICAgICAgICBcImFyY2hpdGVjdHVyZVwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIFwibW9kZWxcIixcclxuLy8gICAgICAgICAgICAgICAgICAgICBcInBsYXRmb3JtXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgXCJwbGF0Zm9ybVZlcnNpb25cIixcclxuLy8gICAgICAgICAgICAgICAgICAgICBcInVhRnVsbFZlcnNpb25cIlxyXG4vLyAgICAgICAgICAgICAgICAgXSlcclxuLy8gICAgICAgICAgICAgICAgIC50aGVuKCh1YTogSUJyb3dzZXJEZXRhaWxzKSA9PiB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnVhID0gdWE7XHJcbi8vICAgICAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vICAgICBjYXRjaCB7XHJcbi8vICAgICAgICAgLy9kbyBub3RoaW5nLi4uXHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbi8vIGNvbnN0IGluaXRpYWxpc2VXaXRoQXV0aG9yaXNhdGlvbiA9IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuLy8gICAgIC8vIFNvbWV0aW1lcyAnLicgY2FuIHN0b3AgYSB1cmwgYmVpbmcgc2VudCBoZXJlLCBpZiB0aGlzIGhhcHBlbnMgYWRkIGEgLyB0byB0aGUgZW5kIG9mIHRoZSB1cmxcclxuXHJcbi8vICAgICAvLyBJZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IHdvcmsgeW91IG5lZWQgdG8gaWRlbnRpdHkgc2VydmVyIGluIGFub3RoZXIgdGFiXHJcbi8vICAgICAvLyBUaGlzIHNpdGUgd2lsbCBiZSBibG9ja2VkIGJlY2F1c2Ugb2YgdGhlIHNlbGYgY2VydC5cclxuLy8gICAgIC8vIENsaWNrIGFkdmFuY2VkIGV0YyB0byBhbGxvdyB0aGUgY2VydFxyXG4vLyAgICAgLy8gVGhlbiByZWxhdW5jaCB0aGlzIHNpdGUgYW5kIGl0IHNob3VsZCB3b3JrXHJcbi8vICAgICAvLyBhbGVydCgnVGVzdCcpO1xyXG5cclxuLy8gICAgIGNvbnN0IGVmZmVjdHM6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s+ID0gW107XHJcbi8vICAgICBjb25zdCBodHRwRmV0Y2hJdGVtOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2hlY2tVc2VyTG9nZ2VkSW5Qcm9wcyhzdGF0ZSk7XHJcblxyXG4vLyAgICAgLy8gQ29sbGVjdCBqdXN0IHRoZSBwcm9wZXJ0aWVzIGZyb20gdGhlIGVmZmVjdHMsIGRpc2NhcmRpbmcgdGhlIEh0dHBcclxuLy8gICAgIC8vIFRoZW4gcmVidWlsZCB0aGVtIGF0IHRoZSBmaXJzdCBsZXZlbCB3aXRoIHNlcXVlbnRpYWxIdHRwIGluc3RlYWRcclxuXHJcbi8vICAgICBpZiAoaHR0cEZldGNoSXRlbSkge1xyXG5cclxuLy8gICAgICAgICBjb25zdCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBodHRwRmV0Y2hJdGVtWzFdO1xyXG4vLyAgICAgICAgIGVmZmVjdHMucHVzaChwcm9wcyk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgY29uc3QgcGF0aEFycmF5OiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG5cclxuLy8gICAgIGlmIChwYXRoQXJyYXlcclxuLy8gICAgICAgICAmJiBwYXRoQXJyYXkubGVuZ3RoID09PSAyXHJcbi8vICAgICAgICAgJiYgcGF0aEFycmF5WzFdID09PSBcInRvcGljc1wiKSB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IGh0dHBGZXRjaEl0ZW06IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gdG9waWNzSW5pdFN0YXRlLmluaXRpYWxpc2VUb3BpY3NEaXNwbGF5UHJvcHMoc3RhdGUpO1xyXG5cclxuLy8gICAgICAgICBpZiAoaHR0cEZldGNoSXRlbSkge1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzID0gaHR0cEZldGNoSXRlbVsxXTtcclxuLy8gICAgICAgICAgICAgZWZmZWN0cy5wdXNoKHByb3BzKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIGlmIChwYXRoQXJyYXlcclxuLy8gICAgICAgICAmJiBwYXRoQXJyYXlbMV0gPT09IFwic3RlcFwiKSB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IHN0ZXBJRDogc3RyaW5nID0gcGF0aEFycmF5WzJdO1xyXG5cclxuLy8gICAgICAgICBjb25zdCBodHRwRmV0Y2hJdGVtOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9IHN0ZXBJbml0U3RhdGUuaW5pdGlhbGlzZVN0ZXBEaXNwbGF5UHJvcHMoXHJcbi8vICAgICAgICAgICAgIHN0YXRlLFxyXG4vLyAgICAgICAgICAgICBzdGVwSURcclxuLy8gICAgICAgICApO1xyXG5cclxuLy8gICAgICAgICBpZiAoaHR0cEZldGNoSXRlbSkge1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzID0gaHR0cEZldGNoSXRlbVsxXTtcclxuLy8gICAgICAgICAgICAgZWZmZWN0cy5wdXNoKHByb3BzKTtcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgfVxyXG4vLyAgICAgZWxzZSB7XHJcbi8vICAgICAgICAgY29uc3QgaHR0cEZldGNoSXRlbTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPSB0b3BpY3NJbml0U3RhdGUuaW5pdGlhbGlzZVRvcGljc0Rpc3BsYXlQcm9wcyhzdGF0ZSk7XHJcblxyXG4vLyAgICAgICAgIGlmIChodHRwRmV0Y2hJdGVtKSB7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBodHRwRmV0Y2hJdGVtWzFdO1xyXG4vLyAgICAgICAgICAgICBlZmZlY3RzLnB1c2gocHJvcHMpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICByZXR1cm4gW1xyXG4vLyAgICAgICAgIHN0YXRlLFxyXG4vLyAgICAgICAgIGdTZXF1ZW50aWFsSHR0cChlZmZlY3RzKVxyXG4vLyAgICAgXTtcclxuLy8gfTtcclxuXHJcbmNvbnN0IGJ1aWxkUmVuZGVyRGlzcGxheSA9IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgZ1JlbmRlckVmZmVjdHMuZ2V0R3VpZGVPdXRsaW5lKHN0YXRlKVxyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkUmVuZGVyQ2hhaW5EaXNwbGF5ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHF1ZXJ5U3RyaW5nOiBzdHJpbmdcclxuKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIGlmIChxdWVyeVN0cmluZy5zdGFydHNXaXRoKCc/JykgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZy5zdWJzdHJpbmcoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGFzdE91dGxpbmVGcmFnbWVudElEID0gcXVlcnlTdHJpbmc7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBnUmVuZGVyRWZmZWN0cy5nZXRHdWlkZU91dGxpbmVBbmRMb2FkRnJhZ21lbnRzKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKVxyXG4gICAgXTtcclxufTtcclxuXHJcbi8vIGNvbnN0IGJ1aWxkVG9waWNzRGlzcGxheSA9IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuLy8gICAgIC8vIFRPRE8gQWRkIHBhZ2luYXRpb24uLi5cclxuLy8gICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuVG9waWNzO1xyXG4vLyAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuXHJcbi8vICAgICByZXR1cm4gdG9waWNzSW5pdFN0YXRlLmluaXRpYWxpc2VUb3BpY3NEaXNwbGF5KHN0YXRlKTtcclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGJ1aWxkQXJ0aWNsZURpc3BsYXkgPSAoXHJcbi8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4vLyAgICAgdG9waWNJRDogc3RyaW5nLFxyXG4vLyAgICAgcXVlcnlTdHJpbmc6IHN0cmluZyB8IG51bGwgPSBudWxsKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuLy8gICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuQXJ0aWNsZTtcclxuLy8gICAgIGxldCBndWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuXHJcbi8vICAgICBpZiAocXVlcnlTdHJpbmc/LnN0YXJ0c1dpdGgoJz9pZD0nKSkge1xyXG5cclxuLy8gICAgICAgICBndWlkID0gcXVlcnlTdHJpbmcuc3Vic3RyaW5nKDQpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHJldHVybiBhcnRpY2xlSW5pdFN0YXRlLmluaXRpYWxpc2VBcnRpY2xlRGlzcGxheShcclxuLy8gICAgICAgICBzdGF0ZSxcclxuLy8gICAgICAgICB0b3BpY0lELFxyXG4vLyAgICAgICAgIGd1aWRcclxuLy8gICAgICk7XHJcbi8vIH07XHJcblxyXG4vLyBjb25zdCBidWlsZFN0ZXBzRGlzcGxheSA9IChcclxuLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbi8vICAgICBzdGVwSUQ6IHN0cmluZyk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbi8vICAgICBpZiAoIVUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXBJRCkpIHtcclxuXHJcbi8vICAgICAgICAgc3RlcElEID0gc3RlcElELnJlcGxhY2UoJ34nLCAnLicpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuU3RlcDtcclxuXHJcbi8vICAgICByZXR1cm4gc3RlcEluaXRTdGF0ZS5pbml0aWFsaXNlU3RlcERpc3BsYXkoXHJcbi8vICAgICAgICAgc3RhdGUsXHJcbi8vICAgICAgICAgc3RlcElEXHJcbi8vICAgICApO1xyXG4vLyB9O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVdpdGhvdXRBdXRob3Jpc2F0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gU29tZXRpbWVzICcuJyBjYW4gc3RvcCBhIHVybCBiZWluZyBzZW50IGhlcmUsIGlmIHRoaXMgaGFwcGVucyBhZGQgYSAvIHRvIHRoZSBlbmQgb2YgdGhlIHVybFxyXG5cclxuICAgIC8vIElmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3Qgd29yayB5b3UgbmVlZCB0byBpZGVudGl0eSBzZXJ2ZXIgaW4gYW5vdGhlciB0YWJcclxuICAgIC8vIFRoaXMgc2l0ZSB3aWxsIGJlIGJsb2NrZWQgYmVjYXVzZSBvZiB0aGUgc2VsZiBjZXJ0LlxyXG4gICAgLy8gQ2xpY2sgYWR2YW5jZWQgZXRjIHRvIGFsbG93IHRoZSBjZXJ0XHJcbiAgICAvLyBUaGVuIHJlbGF1bmNoIHRoaXMgc2l0ZSBhbmQgaXQgc2hvdWxkIHdvcmtcclxuICAgIC8vIGFsZXJ0KCdUZXN0Jyk7XHJcblxyXG4gICAgLy8gY29uc3QgcGF0aEFycmF5OiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG4gICAgY29uc3QgcXVlcnlTdHJpbmc6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICAvLyBpZiAocGF0aEFycmF5XHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheS5sZW5ndGggPT09IDJcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5WzFdID09PSBcInRvcGljc1wiKSB7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gYnVpbGRUb3BpY3NEaXNwbGF5KHN0YXRlKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZSBpZiAocGF0aEFycmF5XHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheS5sZW5ndGggPT09IDNcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5WzFdID09PSBcInRvcGljXCIpIHtcclxuXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBidWlsZEFydGljbGVEaXNwbGF5KFxyXG4gICAgICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgLy8gICAgICAgICBwYXRoQXJyYXlbMl0sXHJcbiAgICAgICAgLy8gICAgICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHBhdGhBcnJheVxyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXkubGVuZ3RoID09PSAyXHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheVsxXSA9PT0gXCJzdGVwXCIpIHtcclxuXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBidWlsZFN0ZXBzRGlzcGxheShcclxuICAgICAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgIC8vICAgICAgICAgcGF0aEFycmF5WzJdXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBpZiAoIVUuaXNOdWxsT3JXaGl0ZVNwYWNlKHF1ZXJ5U3RyaW5nKSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkUmVuZGVyQ2hhaW5EaXNwbGF5KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1aWxkUmVuZGVyRGlzcGxheShzdGF0ZSk7XHJcbiAgICAgICAgLy8gcmV0dXJuIGJ1aWxkVG9waWNzRGlzcGxheShzdGF0ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZTogYW55KSB7XHJcblxyXG4gICAgICAgIHN0YXRlLmdlbmVyaWNFcnJvciA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaW5pdFN0YXRlID0ge1xyXG5cclxuICAgIGluaXRpYWxpc2U6ICgpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YXRlOiBJU3RhdGUgPSBpbml0aWFsaXNlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKHN0YXRlPy51c2VyPy51c2VWc0NvZGUgPT09IHRydWUpXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIHJldHVybiBpbml0aWFsaXNlV2l0aG91dEF1dGhvcmlzYXRpb24oc3RhdGUpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIGluaXRpYWxpc2VXaXRoQXV0aG9yaXNhdGlvbihzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbml0U3RhdGU7XHJcblxyXG4iLCJpbXBvcnQgRmlsdGVycyBmcm9tIFwiLi4vLi4vLi4vc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnNcIjtcclxuaW1wb3J0IFRyZWVTb2x2ZSBmcm9tIFwiLi4vLi4vLi4vc3RhdGUvd2luZG93L1RyZWVTb2x2ZVwiO1xyXG5cclxuXHJcbmNvbnN0IHJlbmRlckNvbW1lbnRzID0ge1xyXG5cclxuICAgIHJlZ2lzdGVyR3VpZGVDb21tZW50OiAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyZWVTb2x2ZUd1aWRlOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbHRlcnMudHJlZVNvbHZlR3VpZGVJRCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0cmVlU29sdmVHdWlkZVxyXG4gICAgICAgICAgICAmJiB0cmVlU29sdmVHdWlkZS5oYXNDaGlsZE5vZGVzKCkgPT09IHRydWVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkTm9kZTogQ2hpbGROb2RlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlU29sdmVHdWlkZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hpbGROb2RlID0gdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5UcmVlU29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUgPSBuZXcgVHJlZVNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnJlbmRlcmluZ0NvbW1lbnQgPSBjaGlsZE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyQ29tbWVudHM7XHJcbiIsImltcG9ydCB7IGFwcCB9IGZyb20gXCIuL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbFwiO1xuXG5pbXBvcnQgaW5pdFN1YnNjcmlwdGlvbnMgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvc3Vic2NyaXB0aW9ucy9pbml0U3Vic2NyaXB0aW9uc1wiO1xuaW1wb3J0IGluaXRFdmVudHMgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvY29kZS9pbml0RXZlbnRzXCI7XG5pbXBvcnQgaW5pdFZpZXcgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvdmlld3MvaW5pdFZpZXdcIjtcbmltcG9ydCBpbml0U3RhdGUgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvY29kZS9pbml0U3RhdGVcIjtcbmltcG9ydCByZW5kZXJDb21tZW50cyBmcm9tIFwiLi9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL3JlbmRlckNvbW1lbnRzXCI7XG5cblxuaW5pdEV2ZW50cy5yZWdpc3Rlckdsb2JhbEV2ZW50cygpO1xucmVuZGVyQ29tbWVudHMucmVnaXN0ZXJHdWlkZUNvbW1lbnQoKTtcblxuKHdpbmRvdyBhcyBhbnkpLkNvbXBvc2l0ZUZsb3dzQXV0aG9yID0gYXBwKHtcbiAgICBcbiAgICBub2RlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyZWVTb2x2ZUZyYWdtZW50c1wiKSxcbiAgICBpbml0OiBpbml0U3RhdGUuaW5pdGlhbGlzZSxcbiAgICB2aWV3OiBpbml0Vmlldy5idWlsZFZpZXcsXG4gICAgc3Vic2NyaXB0aW9uczogaW5pdFN1YnNjcmlwdGlvbnMsXG4gICAgb25FbmQ6IGluaXRFdmVudHMub25SZW5kZXJGaW5pc2hlZFxufSk7XG5cblxuIl0sIm5hbWVzIjpbInByb3BzIiwiRGlzcGxheVR5cGUiLCJvdXRwdXQiLCJBY3Rpb25UeXBlIiwiVSIsImVmZmVjdCIsImh0dHBFZmZlY3QiLCJTdGVwVHlwZSIsImxvY2F0aW9uIiwic3RhdGUiLCJsb2FkT3B0aW9uIiwiU2Nyb2xsSG9wVHlwZSIsIm5hdmlnYXRpb25EaXJlY3Rpb24iLCJTdGVwSGlzdG9yeSIsImdSZW5kZXJBY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxnQkFBZ0I7QUFDcEIsSUFBSSxZQUFZO0FBQ2hCLElBQUksWUFBWTtBQUNoQixJQUFJLFlBQVksQ0FBRTtBQUNsQixJQUFJLFlBQVksQ0FBRTtBQUNsQixJQUFJLE1BQU0sVUFBVTtBQUNwQixJQUFJLFVBQVUsTUFBTTtBQUNwQixJQUFJLFFBQ0YsT0FBTywwQkFBMEIsY0FDN0Isd0JBQ0E7QUFFTixJQUFJLGNBQWMsU0FBUyxLQUFLO0FBQzlCLE1BQUksTUFBTTtBQUVWLE1BQUksT0FB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
