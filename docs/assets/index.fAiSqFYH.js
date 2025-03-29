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
  guideOutlineFilename: "outline.html",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZkFpU3FGWUguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbC5qcyIsIi4uLy4uL3Jvb3Qvc3JjL2h5cGVyQXBwL2h5cGVyQXBwLWZ4L3V0aWxzLmpzIiwiLi4vLi4vcm9vdC9zcmMvaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmQuanMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nVXRpbGl0aWVzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2VmZmVjdHMvSHR0cEVmZmVjdC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdG9waWMvU3RlcFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9TdGVwQ2FjaGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1Jvb3RDYWNoZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvaGlzdG9yeS9IaXN0b3J5VXJsLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L1JlbmRlclNuYXBTaG90LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nSGlzdG9yeUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1N0ZXBPcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9oaXN0b3J5L0FydGljbGVTY2VuZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5QYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9wYXlsb2Fkcy9DaGFpblN0ZXBQYXlsb2FkLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nQXJ0aWNsZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9jb2RlL2dTdGVwQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2dTZXNzaW9uLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3RvcGljL1RvcGljLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS90b3BpYy9Ub3BpY0NhY2hlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nVG9waWNDb2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nU3RlcEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dIdHRwLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL2NvbnN0YW50cy9LZXlzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQXV0aGVudGljYXRpb25Db2RlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvaHR0cC9nQWpheEhlYWRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHAudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9lZmZlY3RzL2dTdGVwRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1RvcGljc1N0YXRlQ29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ1RvcGljc0NvcmVBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L2FjdGlvbnMvdG9waWNBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3RvcGljc0Rpc3BsYXkvc3Vic2NyaXB0aW9ucy90b3BpY1N1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS90b3BpY3NDb3JlL3N1YnNjcmlwdGlvbnMvdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9oeXBlckFwcC90aW1lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvYWN0aW9ucy9nUmVwZWF0QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9zdWJzY3JpcHRpb25zL2luaXRTdWJzY3JpcHRpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9jb25zdGFudHMvRmlsdGVycy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2Rpc3BsYXlzL3N0ZXBEaXNwbGF5L2NvZGUvc2Nyb2xsU3RlcC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3NldFNpZGVCYXIudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL29uU2Nyb2xsRW5kLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL29uUmVuZGVyRmluaXNoZWQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRFdmVudHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9hY3Rpb25zL2luaXRBY3Rpb25zLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJGcmFnbWVudFVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9nRmlsZUNvbnN0YW50cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ0ZyYWdtZW50Q29kZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvYWN0aW9ucy9mcmFnbWVudEFjdGlvbnMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZC50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9mcmFnbWVudHMvdmlld3MvZnJhZ21lbnRWaWV3cy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9lcnJvci92aWV3cy9lcnJvclZpZXdzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2luaXQvdmlld3MvaW5pdFZpZXcudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VzZXIvU2V0dGluZ3MudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3VpL3BheWxvYWRzL1BhZ2luYXRpb25EZXRhaWxzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY3NTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdWkvVG9waWNTY2VuZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9Ub3BpY1N0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb24udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL2hpc3RvcnkvSGlzdG9yeS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvdXNlci9Vc2VyLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9zZWFyY2gvU2VhcmNoVUkudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL1NlYXJjaFN0YXRlLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS91aS9SZW5kZXJTdGF0ZVVJLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9SZW5kZXJTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvc3RhdGUvU3RhdGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9TY3JlZW4udHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3dpbmRvdy9UcmVlU29sdmUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lRnJhZ21lbnQudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lLnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUNoYXJ0LnRzIiwiLi4vLi4vcm9vdC9zcmMvbW9kdWxlcy9nbG9iYWwvY29kZS9nT3V0bGluZUNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2dsb2JhbC9hY3Rpb25zL2dPdXRsaW5lQWN0aW9ucy50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2VmZmVjdHMvZ1JlbmRlckVmZmVjdHMudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL3N0YXRlL3JlbmRlci9SZW5kZXJHdWlkZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1JlbmRlckNvZGUudHMiLCIuLi8uLi9yb290L3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvaW5pdC9jb2RlL2luaXRTdGF0ZS50cyIsIi4uLy4uL3Jvb3Qvc3JjL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvcmVuZGVyQ29tbWVudHMudHMiLCIuLi8uLi9yb290L3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUkVDWUNMRURfTk9ERSA9IDFcclxudmFyIExBWllfTk9ERSA9IDJcclxudmFyIFRFWFRfTk9ERSA9IDNcclxudmFyIEVNUFRZX09CSiA9IHt9XHJcbnZhciBFTVBUWV9BUlIgPSBbXVxyXG52YXIgbWFwID0gRU1QVFlfQVJSLm1hcFxyXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXlcclxudmFyIGRlZmVyID1cclxuICB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICA/IHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgOiBzZXRUaW1lb3V0XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbihvYmopIHtcclxuICB2YXIgb3V0ID0gXCJcIlxyXG5cclxuICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIG9ialxyXG5cclxuICBpZiAoaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPiAwKSB7XHJcbiAgICBmb3IgKHZhciBrID0gMCwgdG1wOyBrIDwgb2JqLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgIGlmICgodG1wID0gY3JlYXRlQ2xhc3Mob2JqW2tdKSkgIT09IFwiXCIpIHtcclxuICAgICAgICBvdXQgKz0gKG91dCAmJiBcIiBcIikgKyB0bXBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xyXG4gICAgICBpZiAob2JqW2tdKSB7XHJcbiAgICAgICAgb3V0ICs9IChvdXQgJiYgXCIgXCIpICsga1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0XHJcbn1cclxuXHJcbnZhciBtZXJnZSA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICB2YXIgb3V0ID0ge31cclxuXHJcbiAgZm9yICh2YXIgayBpbiBhKSBvdXRba10gPSBhW2tdXHJcbiAgZm9yICh2YXIgayBpbiBiKSBvdXRba10gPSBiW2tdXHJcblxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxudmFyIGJhdGNoID0gZnVuY3Rpb24obGlzdCkge1xyXG4gIHJldHVybiBsaXN0LnJlZHVjZShmdW5jdGlvbihvdXQsIGl0ZW0pIHtcclxuICAgIHJldHVybiBvdXQuY29uY2F0KFxyXG4gICAgICAhaXRlbSB8fCBpdGVtID09PSB0cnVlXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiB0eXBlb2YgaXRlbVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBbaXRlbV1cclxuICAgICAgICA6IGJhdGNoKGl0ZW0pXHJcbiAgICApXHJcbiAgfSwgRU1QVFlfQVJSKVxyXG59XHJcblxyXG52YXIgaXNTYW1lQWN0aW9uID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIHJldHVybiBpc0FycmF5KGEpICYmIGlzQXJyYXkoYikgJiYgYVswXSA9PT0gYlswXSAmJiB0eXBlb2YgYVswXSA9PT0gXCJmdW5jdGlvblwiXHJcbn1cclxuXHJcbnZhciBzaG91bGRSZXN0YXJ0ID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhICE9PSBiKSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG1lcmdlKGEsIGIpKSB7XHJcbiAgICAgIGlmIChhW2tdICE9PSBiW2tdICYmICFpc1NhbWVBY3Rpb24oYVtrXSwgYltrXSkpIHJldHVybiB0cnVlXHJcbiAgICAgIGJba10gPSBhW2tdXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG52YXIgcGF0Y2hTdWJzID0gZnVuY3Rpb24ob2xkU3VicywgbmV3U3VicywgZGlzcGF0Y2gpIHtcclxuICBmb3IgKFxyXG4gICAgdmFyIGkgPSAwLCBvbGRTdWIsIG5ld1N1Yiwgc3VicyA9IFtdO1xyXG4gICAgaSA8IG9sZFN1YnMubGVuZ3RoIHx8IGkgPCBuZXdTdWJzLmxlbmd0aDtcclxuICAgIGkrK1xyXG4gICkge1xyXG4gICAgb2xkU3ViID0gb2xkU3Vic1tpXVxyXG4gICAgbmV3U3ViID0gbmV3U3Vic1tpXVxyXG4gICAgc3Vicy5wdXNoKFxyXG4gICAgICBuZXdTdWJcclxuICAgICAgICA/ICFvbGRTdWIgfHxcclxuICAgICAgICAgIG5ld1N1YlswXSAhPT0gb2xkU3ViWzBdIHx8XHJcbiAgICAgICAgICBzaG91bGRSZXN0YXJ0KG5ld1N1YlsxXSwgb2xkU3ViWzFdKVxyXG4gICAgICAgICAgPyBbXHJcbiAgICAgICAgICAgICAgbmV3U3ViWzBdLFxyXG4gICAgICAgICAgICAgIG5ld1N1YlsxXSxcclxuICAgICAgICAgICAgICBuZXdTdWJbMF0oZGlzcGF0Y2gsIG5ld1N1YlsxXSksXHJcbiAgICAgICAgICAgICAgb2xkU3ViICYmIG9sZFN1YlsyXSgpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIDogb2xkU3ViXHJcbiAgICAgICAgOiBvbGRTdWIgJiYgb2xkU3ViWzJdKClcclxuICAgIClcclxuICB9XHJcbiAgcmV0dXJuIHN1YnNcclxufVxyXG5cclxudmFyIHBhdGNoUHJvcGVydHkgPSBmdW5jdGlvbihub2RlLCBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgaWYgKGtleSA9PT0gXCJrZXlcIikge1xyXG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcInN0eWxlXCIpIHtcclxuICAgIGZvciAodmFyIGsgaW4gbWVyZ2Uob2xkVmFsdWUsIG5ld1ZhbHVlKSkge1xyXG4gICAgICBvbGRWYWx1ZSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWVba10gPT0gbnVsbCA/IFwiXCIgOiBuZXdWYWx1ZVtrXVxyXG4gICAgICBpZiAoa1swXSA9PT0gXCItXCIpIHtcclxuICAgICAgICBub2RlW2tleV0uc2V0UHJvcGVydHkoaywgb2xkVmFsdWUpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZVtrZXldW2tdID0gb2xkVmFsdWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoa2V5WzBdID09PSBcIm9cIiAmJiBrZXlbMV0gPT09IFwiblwiKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgICEoKG5vZGUuYWN0aW9ucyB8fCAobm9kZS5hY3Rpb25zID0ge30pKVtcclxuICAgICAgICAoa2V5ID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgIF0gPSBuZXdWYWx1ZSlcclxuICAgICkge1xyXG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoa2V5LCBsaXN0ZW5lcilcclxuICAgIH0gZWxzZSBpZiAoIW9sZFZhbHVlKSB7XHJcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihrZXksIGxpc3RlbmVyKVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoIWlzU3ZnICYmIGtleSAhPT0gXCJsaXN0XCIgJiYga2V5IGluIG5vZGUpIHtcclxuICAgIG5vZGVba2V5XSA9IG5ld1ZhbHVlID09IG51bGwgfHwgbmV3VmFsdWUgPT0gXCJ1bmRlZmluZWRcIiA/IFwiXCIgOiBuZXdWYWx1ZVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICBuZXdWYWx1ZSA9PSBudWxsIHx8XHJcbiAgICBuZXdWYWx1ZSA9PT0gZmFsc2UgfHxcclxuICAgIChrZXkgPT09IFwiY2xhc3NcIiAmJiAhKG5ld1ZhbHVlID0gY3JlYXRlQ2xhc3MobmV3VmFsdWUpKSlcclxuICApIHtcclxuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSlcclxuICB9IGVsc2Uge1xyXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBuZXdWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbnZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24odmRvbSwgbGlzdGVuZXIsIGlzU3ZnKSB7XHJcbiAgdmFyIG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgdmFyIHByb3BzID0gdmRvbS5wcm9wc1xyXG4gIHZhciBub2RlID1cclxuICAgIHZkb20udHlwZSA9PT0gVEVYVF9OT0RFXHJcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmRvbS5uYW1lKVxyXG4gICAgICA6IChpc1N2ZyA9IGlzU3ZnIHx8IHZkb20ubmFtZSA9PT0gXCJzdmdcIilcclxuICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZkb20ubmFtZSwgeyBpczogcHJvcHMuaXMgfSlcclxuXHJcbiAgZm9yICh2YXIgayBpbiBwcm9wcykge1xyXG4gICAgcGF0Y2hQcm9wZXJ0eShub2RlLCBrLCBudWxsLCBwcm9wc1trXSwgbGlzdGVuZXIsIGlzU3ZnKVxyXG4gIH1cclxuXHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZkb20uY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoXHJcbiAgICAgIGNyZWF0ZU5vZGUoXHJcbiAgICAgICAgKHZkb20uY2hpbGRyZW5baV0gPSBnZXRWTm9kZSh2ZG9tLmNoaWxkcmVuW2ldKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICh2ZG9tLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgZ2V0S2V5ID0gZnVuY3Rpb24odmRvbSkge1xyXG4gIHJldHVybiB2ZG9tID09IG51bGwgPyBudWxsIDogdmRvbS5rZXlcclxufVxyXG5cclxudmFyIHBhdGNoID0gZnVuY3Rpb24ocGFyZW50LCBub2RlLCBvbGRWTm9kZSwgbmV3Vk5vZGUsIGxpc3RlbmVyLCBpc1N2Zykge1xyXG4gIGlmIChvbGRWTm9kZSA9PT0gbmV3Vk5vZGUpIHtcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgb2xkVk5vZGUgIT0gbnVsbCAmJlxyXG4gICAgb2xkVk5vZGUudHlwZSA9PT0gVEVYVF9OT0RFICYmXHJcbiAgICBuZXdWTm9kZS50eXBlID09PSBURVhUX05PREVcclxuICApIHtcclxuICAgIGlmIChvbGRWTm9kZS5uYW1lICE9PSBuZXdWTm9kZS5uYW1lKSBub2RlLm5vZGVWYWx1ZSA9IG5ld1ZOb2RlLm5hbWVcclxuICB9IGVsc2UgaWYgKG9sZFZOb2RlID09IG51bGwgfHwgb2xkVk5vZGUubmFtZSAhPT0gbmV3Vk5vZGUubmFtZSkge1xyXG4gICAgbm9kZSA9IHBhcmVudC5pbnNlcnRCZWZvcmUoXHJcbiAgICAgIGNyZWF0ZU5vZGUoKG5ld1ZOb2RlID0gZ2V0Vk5vZGUobmV3Vk5vZGUpKSwgbGlzdGVuZXIsIGlzU3ZnKSxcclxuICAgICAgbm9kZVxyXG4gICAgKVxyXG4gICAgaWYgKG9sZFZOb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG9sZFZOb2RlLm5vZGUpXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciB0bXBWS2lkXHJcbiAgICB2YXIgb2xkVktpZFxyXG5cclxuICAgIHZhciBvbGRLZXlcclxuICAgIHZhciBuZXdLZXlcclxuXHJcbiAgICB2YXIgb2xkVlByb3BzID0gb2xkVk5vZGUucHJvcHNcclxuICAgIHZhciBuZXdWUHJvcHMgPSBuZXdWTm9kZS5wcm9wc1xyXG5cclxuICAgIHZhciBvbGRWS2lkcyA9IG9sZFZOb2RlLmNoaWxkcmVuXHJcbiAgICB2YXIgbmV3VktpZHMgPSBuZXdWTm9kZS5jaGlsZHJlblxyXG5cclxuICAgIHZhciBvbGRIZWFkID0gMFxyXG4gICAgdmFyIG5ld0hlYWQgPSAwXHJcbiAgICB2YXIgb2xkVGFpbCA9IG9sZFZLaWRzLmxlbmd0aCAtIDFcclxuICAgIHZhciBuZXdUYWlsID0gbmV3VktpZHMubGVuZ3RoIC0gMVxyXG5cclxuICAgIGlzU3ZnID0gaXNTdmcgfHwgbmV3Vk5vZGUubmFtZSA9PT0gXCJzdmdcIlxyXG5cclxuICAgIGZvciAodmFyIGkgaW4gbWVyZ2Uob2xkVlByb3BzLCBuZXdWUHJvcHMpKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAoaSA9PT0gXCJ2YWx1ZVwiIHx8IGkgPT09IFwic2VsZWN0ZWRcIiB8fCBpID09PSBcImNoZWNrZWRcIlxyXG4gICAgICAgICAgPyBub2RlW2ldXHJcbiAgICAgICAgICA6IG9sZFZQcm9wc1tpXSkgIT09IG5ld1ZQcm9wc1tpXVxyXG4gICAgICApIHtcclxuICAgICAgICBwYXRjaFByb3BlcnR5KG5vZGUsIGksIG9sZFZQcm9wc1tpXSwgbmV3VlByb3BzW2ldLCBsaXN0ZW5lciwgaXNTdmcpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsICYmIG9sZEhlYWQgPD0gb2xkVGFpbCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgKG9sZEtleSA9IGdldEtleShvbGRWS2lkc1tvbGRIZWFkXSkpID09IG51bGwgfHxcclxuICAgICAgICBvbGRLZXkgIT09IGdldEtleShuZXdWS2lkc1tuZXdIZWFkXSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGF0Y2goXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRIZWFkXS5ub2RlLFxyXG4gICAgICAgIG9sZFZLaWRzW29sZEhlYWRdLFxyXG4gICAgICAgIChuZXdWS2lkc1tuZXdIZWFkXSA9IGdldFZOb2RlKFxyXG4gICAgICAgICAgbmV3VktpZHNbbmV3SGVhZCsrXSxcclxuICAgICAgICAgIG9sZFZLaWRzW29sZEhlYWQrK11cclxuICAgICAgICApKSxcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBpc1N2Z1xyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKG5ld0hlYWQgPD0gbmV3VGFpbCAmJiBvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIChvbGRLZXkgPSBnZXRLZXkob2xkVktpZHNbb2xkVGFpbF0pKSA9PSBudWxsIHx8XHJcbiAgICAgICAgb2xkS2V5ICE9PSBnZXRLZXkobmV3VktpZHNbbmV3VGFpbF0pXHJcbiAgICAgICkge1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhdGNoKFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgb2xkVktpZHNbb2xkVGFpbF0ubm9kZSxcclxuICAgICAgICBvbGRWS2lkc1tvbGRUYWlsXSxcclxuICAgICAgICAobmV3VktpZHNbbmV3VGFpbF0gPSBnZXRWTm9kZShcclxuICAgICAgICAgIG5ld1ZLaWRzW25ld1RhaWwtLV0sXHJcbiAgICAgICAgICBvbGRWS2lkc1tvbGRUYWlsLS1dXHJcbiAgICAgICAgKSksXHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgaXNTdmdcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvbGRIZWFkID4gb2xkVGFpbCkge1xyXG4gICAgICB3aGlsZSAobmV3SGVhZCA8PSBuZXdUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUoXHJcbiAgICAgICAgICBjcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAobmV3VktpZHNbbmV3SGVhZF0gPSBnZXRWTm9kZShuZXdWS2lkc1tuZXdIZWFkKytdKSksXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZF0pICYmIG9sZFZLaWQubm9kZVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChuZXdIZWFkID4gbmV3VGFpbCkge1xyXG4gICAgICB3aGlsZSAob2xkSGVhZCA8PSBvbGRUYWlsKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkc1tvbGRIZWFkKytdLm5vZGUpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSBvbGRIZWFkLCBrZXllZCA9IHt9LCBuZXdLZXllZCA9IHt9OyBpIDw9IG9sZFRhaWw7IGkrKykge1xyXG4gICAgICAgIGlmICgob2xkS2V5ID0gb2xkVktpZHNbaV0ua2V5KSAhPSBudWxsKSB7XHJcbiAgICAgICAgICBrZXllZFtvbGRLZXldID0gb2xkVktpZHNbaV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChuZXdIZWFkIDw9IG5ld1RhaWwpIHtcclxuICAgICAgICBvbGRLZXkgPSBnZXRLZXkoKG9sZFZLaWQgPSBvbGRWS2lkc1tvbGRIZWFkXSkpXHJcbiAgICAgICAgbmV3S2V5ID0gZ2V0S2V5KFxyXG4gICAgICAgICAgKG5ld1ZLaWRzW25ld0hlYWRdID0gZ2V0Vk5vZGUobmV3VktpZHNbbmV3SGVhZF0sIG9sZFZLaWQpKVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgbmV3S2V5ZWRbb2xkS2V5XSB8fFxyXG4gICAgICAgICAgKG5ld0tleSAhPSBudWxsICYmIG5ld0tleSA9PT0gZ2V0S2V5KG9sZFZLaWRzW29sZEhlYWQgKyAxXSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBpZiAob2xkS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChvbGRWS2lkLm5vZGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvbGRIZWFkKytcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmV3S2V5ID09IG51bGwgfHwgb2xkVk5vZGUudHlwZSA9PT0gUkVDWUNMRURfTk9ERSkge1xyXG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHBhdGNoKFxyXG4gICAgICAgICAgICAgIG5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgb2xkVktpZCxcclxuICAgICAgICAgICAgICBuZXdWS2lkc1tuZXdIZWFkXSxcclxuICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICBpc1N2Z1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIG5ld0hlYWQrK1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChvbGRLZXkgPT09IG5ld0tleSkge1xyXG4gICAgICAgICAgICBwYXRjaChcclxuICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgIG9sZFZLaWQubm9kZSxcclxuICAgICAgICAgICAgICBvbGRWS2lkLFxyXG4gICAgICAgICAgICAgIG5ld1ZLaWRzW25ld0hlYWRdLFxyXG4gICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgbmV3S2V5ZWRbbmV3S2V5XSA9IHRydWVcclxuICAgICAgICAgICAgb2xkSGVhZCsrXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHRtcFZLaWQgPSBrZXllZFtuZXdLZXldKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5pbnNlcnRCZWZvcmUodG1wVktpZC5ub2RlLCBvbGRWS2lkICYmIG9sZFZLaWQubm9kZSksXHJcbiAgICAgICAgICAgICAgICB0bXBWS2lkLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIG5ld0tleWVkW25ld0tleV0gPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICAgICAgb2xkVktpZCAmJiBvbGRWS2lkLm5vZGUsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmV3VktpZHNbbmV3SGVhZF0sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICAgIGlzU3ZnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBuZXdIZWFkKytcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChvbGRIZWFkIDw9IG9sZFRhaWwpIHtcclxuICAgICAgICBpZiAoZ2V0S2V5KChvbGRWS2lkID0gb2xkVktpZHNbb2xkSGVhZCsrXSkpID09IG51bGwpIHtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQob2xkVktpZC5ub2RlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yICh2YXIgaSBpbiBrZXllZCkge1xyXG4gICAgICAgIGlmIChuZXdLZXllZFtpXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGtleWVkW2ldLm5vZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKG5ld1ZOb2RlLm5vZGUgPSBub2RlKVxyXG59XHJcblxyXG52YXIgcHJvcHNDaGFuZ2VkID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGZvciAodmFyIGsgaW4gYSkgaWYgKGFba10gIT09IGJba10pIHJldHVybiB0cnVlXHJcbiAgZm9yICh2YXIgayBpbiBiKSBpZiAoYVtrXSAhPT0gYltrXSkgcmV0dXJuIHRydWVcclxufVxyXG5cclxudmFyIGdldFRleHRWTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gdHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIgPyBub2RlIDogY3JlYXRlVGV4dFZOb2RlKG5vZGUpXHJcbn1cclxuXHJcbnZhciBnZXRWTm9kZSA9IGZ1bmN0aW9uKG5ld1ZOb2RlLCBvbGRWTm9kZSkge1xyXG4gIHJldHVybiBuZXdWTm9kZS50eXBlID09PSBMQVpZX05PREVcclxuICAgID8gKCghb2xkVk5vZGUgfHwgIW9sZFZOb2RlLmxhenkgfHwgcHJvcHNDaGFuZ2VkKG9sZFZOb2RlLmxhenksIG5ld1ZOb2RlLmxhenkpKVxyXG4gICAgICAgICYmICgob2xkVk5vZGUgPSBnZXRUZXh0Vk5vZGUobmV3Vk5vZGUubGF6eS52aWV3KG5ld1ZOb2RlLmxhenkpKSkubGF6eSA9XHJcbiAgICAgICAgICBuZXdWTm9kZS5sYXp5KSxcclxuICAgICAgb2xkVk5vZGUpXHJcbiAgICA6IG5ld1ZOb2RlXHJcbn1cclxuXHJcbnZhciBjcmVhdGVWTm9kZSA9IGZ1bmN0aW9uKG5hbWUsIHByb3BzLCBjaGlsZHJlbiwgbm9kZSwga2V5LCB0eXBlKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICBwcm9wczogcHJvcHMsXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBub2RlOiBub2RlLFxyXG4gICAgdHlwZTogdHlwZSxcclxuICAgIGtleToga2V5XHJcbiAgfVxyXG59XHJcblxyXG52YXIgY3JlYXRlVGV4dFZOb2RlID0gZnVuY3Rpb24odmFsdWUsIG5vZGUpIHtcclxuICByZXR1cm4gY3JlYXRlVk5vZGUodmFsdWUsIEVNUFRZX09CSiwgRU1QVFlfQVJSLCBub2RlLCB1bmRlZmluZWQsIFRFWFRfTk9ERSlcclxufVxyXG5cclxudmFyIHJlY3ljbGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBURVhUX05PREVcclxuICAgID8gY3JlYXRlVGV4dFZOb2RlKG5vZGUubm9kZVZhbHVlLCBub2RlKVxyXG4gICAgOiBjcmVhdGVWTm9kZShcclxuICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgRU1QVFlfT0JKLFxyXG4gICAgICAgIG1hcC5jYWxsKG5vZGUuY2hpbGROb2RlcywgcmVjeWNsZU5vZGUpLFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFJFQ1lDTEVEX05PREVcclxuICAgICAgKVxyXG59XHJcblxyXG5leHBvcnQgdmFyIExhenkgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHJldHVybiB7XHJcbiAgICBsYXp5OiBwcm9wcyxcclxuICAgIHR5cGU6IExBWllfTk9ERVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBoID0gZnVuY3Rpb24obmFtZSwgcHJvcHMpIHtcclxuICBmb3IgKHZhciB2ZG9tLCByZXN0ID0gW10sIGNoaWxkcmVuID0gW10sIGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHtcclxuICAgIHJlc3QucHVzaChhcmd1bWVudHNbaV0pXHJcbiAgfVxyXG5cclxuICB3aGlsZSAocmVzdC5sZW5ndGggPiAwKSB7XHJcbiAgICBpZiAoaXNBcnJheSgodmRvbSA9IHJlc3QucG9wKCkpKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gdmRvbS5sZW5ndGg7IGktLSA+IDA7ICkge1xyXG4gICAgICAgIHJlc3QucHVzaCh2ZG9tW2ldKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHZkb20gPT09IGZhbHNlIHx8IHZkb20gPT09IHRydWUgfHwgdmRvbSA9PSBudWxsKSB7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGdldFRleHRWTm9kZSh2ZG9tKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3BzID0gcHJvcHMgfHwgRU1QVFlfT0JKXHJcblxyXG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICA/IG5hbWUocHJvcHMsIGNoaWxkcmVuKVxyXG4gICAgOiBjcmVhdGVWTm9kZShuYW1lLCBwcm9wcywgY2hpbGRyZW4sIHVuZGVmaW5lZCwgcHJvcHMua2V5KVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGFwcCA9IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgdmFyIHN0YXRlID0ge31cclxuICB2YXIgbG9jayA9IGZhbHNlXHJcbiAgdmFyIHZpZXcgPSBwcm9wcy52aWV3XHJcbiAgdmFyIG5vZGUgPSBwcm9wcy5ub2RlXHJcbiAgdmFyIHZkb20gPSBub2RlICYmIHJlY3ljbGVOb2RlKG5vZGUpXHJcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBwcm9wcy5zdWJzY3JpcHRpb25zXHJcbiAgdmFyIHN1YnMgPSBbXVxyXG4gIHZhciBvbkVuZCA9IHByb3BzLm9uRW5kXHJcblxyXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBkaXNwYXRjaCh0aGlzLmFjdGlvbnNbZXZlbnQudHlwZV0sIGV2ZW50KVxyXG4gIH1cclxuXHJcbiAgdmFyIHNldFN0YXRlID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcclxuICAgIGlmIChzdGF0ZSAhPT0gbmV3U3RhdGUpIHtcclxuICAgICAgc3RhdGUgPSBuZXdTdGF0ZVxyXG4gICAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgIHN1YnMgPSBwYXRjaFN1YnMoc3VicywgYmF0Y2goW3N1YnNjcmlwdGlvbnMoc3RhdGUpXSksIGRpc3BhdGNoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh2aWV3ICYmICFsb2NrKSBkZWZlcihyZW5kZXIsIChsb2NrID0gdHJ1ZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGVcclxuICB9XHJcblxyXG4gIHZhciBkaXNwYXRjaCA9IChwcm9wcy5taWRkbGV3YXJlIHx8XHJcbiAgICBmdW5jdGlvbihvYmopIHtcclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfSkoZnVuY3Rpb24oYWN0aW9uLCBwcm9wcykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICA/IGRpc3BhdGNoKGFjdGlvbihzdGF0ZSwgcHJvcHMpKVxyXG4gICAgICA6IGlzQXJyYXkoYWN0aW9uKVxyXG4gICAgICA/IHR5cGVvZiBhY3Rpb25bMF0gPT09IFwiZnVuY3Rpb25cIiB8fCBpc0FycmF5KGFjdGlvblswXSlcclxuICAgICAgICA/IGRpc3BhdGNoKFxyXG4gICAgICAgICAgICBhY3Rpb25bMF0sXHJcbiAgICAgICAgICAgIHR5cGVvZiBhY3Rpb25bMV0gPT09IFwiZnVuY3Rpb25cIiA/IGFjdGlvblsxXShwcm9wcykgOiBhY3Rpb25bMV1cclxuICAgICAgICAgIClcclxuICAgICAgICA6IChiYXRjaChhY3Rpb24uc2xpY2UoMSkpLm1hcChmdW5jdGlvbihmeCkge1xyXG4gICAgICAgICAgICBmeCAmJiBmeFswXShkaXNwYXRjaCwgZnhbMV0pXHJcbiAgICAgICAgICB9LCBzZXRTdGF0ZShhY3Rpb25bMF0pKSxcclxuICAgICAgICAgIHN0YXRlKVxyXG4gICAgICA6IHNldFN0YXRlKGFjdGlvbilcclxuICB9KVxyXG5cclxuICB2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsb2NrID0gZmFsc2VcclxuICAgIG5vZGUgPSBwYXRjaChcclxuICAgICAgbm9kZS5wYXJlbnROb2RlLFxyXG4gICAgICBub2RlLFxyXG4gICAgICB2ZG9tLFxyXG4gICAgICAodmRvbSA9IGdldFRleHRWTm9kZSh2aWV3KHN0YXRlKSkpLFxyXG4gICAgICBsaXN0ZW5lclxyXG4gICAgKVxyXG4gICAgb25FbmQoKVxyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gYXNzaWduKHNvdXJjZSwgYXNzaWdubWVudHMpIHtcclxuICB2YXIgcmVzdWx0ID0ge30sXHJcbiAgICBpXHJcbiAgZm9yIChpIGluIHNvdXJjZSkgcmVzdWx0W2ldID0gc291cmNlW2ldXHJcbiAgZm9yIChpIGluIGFzc2lnbm1lbnRzKSByZXN1bHRbaV0gPSBhc3NpZ25tZW50c1tpXVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZW1vdmVMaXN0ZW5lcihhdHRhY2hUbywgZGlzcGF0Y2gsIGFjdGlvbiwgZXZlbnROYW1lKSB7XHJcbiAgdmFyIGhhbmRsZXIgPSBkaXNwYXRjaC5iaW5kKG51bGwsIGFjdGlvbilcclxuICBhdHRhY2hUby5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICBhdHRhY2hUby5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlRGlzcGF0Y2hUaW1lKGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbiwgcHJvcHMuYXNEYXRlID8gbmV3IERhdGUoKSA6IHBlcmZvcm1hbmNlLm5vdygpKVxyXG4gIH1cclxufVxyXG5cclxudmFyIHdlYlNvY2tldENvbm5lY3Rpb25zID0ge31cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPcGVuV2ViU29ja2V0KHByb3BzKSB7XHJcbiAgdmFyIGNvbm5lY3Rpb24gPSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbiAgaWYgKCFjb25uZWN0aW9uKSB7XHJcbiAgICBjb25uZWN0aW9uID0ge1xyXG4gICAgICBzb2NrZXQ6IG5ldyBXZWJTb2NrZXQocHJvcHMudXJsLCBwcm9wcy5wcm90b2NvbHMpLFxyXG4gICAgICBsaXN0ZW5lcnM6IFtdXHJcbiAgICB9XHJcbiAgICB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdID0gY29ubmVjdGlvblxyXG4gIH1cclxuICByZXR1cm4gY29ubmVjdGlvblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VXZWJTb2NrZXQocHJvcHMpIHtcclxuICB2YXIgY29ubmVjdGlvbiA9IGdldE9wZW5XZWJTb2NrZXQocHJvcHMpXHJcbiAgLy8gRklYTUU6IGhhbmRsZSBjbG9zZSBvbiBvcGVuaW5nXHJcbiAgY29ubmVjdGlvbi5zb2NrZXQuY2xvc2UoKVxyXG4gIGRlbGV0ZSB3ZWJTb2NrZXRDb25uZWN0aW9uc1twcm9wcy51cmxdXHJcbn1cclxuIiwiaW1wb3J0IHsgbWFrZVJlbW92ZUxpc3RlbmVyIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcclxuXHJcbmZ1bmN0aW9uIGtleWJvYXJkRWZmZWN0KGRpc3BhdGNoLCBwcm9wcykge1xyXG4gIHZhciByZW1vdmVMaXN0ZW5lckZvckV2ZW50ID0gbWFrZVJlbW92ZUxpc3RlbmVyLmJpbmQoXHJcbiAgICBudWxsLFxyXG4gICAgZG9jdW1lbnQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIHByb3BzLmFjdGlvblxyXG4gIClcclxuICB2YXIgcmVtb3ZlRG93biA9IHByb3BzLmRvd25zID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleWRvd25cIikgOiBudWxsXHJcbiAgdmFyIHJlbW92ZVVwID0gcHJvcHMudXBzID8gcmVtb3ZlTGlzdGVuZXJGb3JFdmVudChcImtleXVwXCIpIDogbnVsbFxyXG4gIHZhciByZW1vdmVQcmVzcyA9IHByb3BzLnByZXNzZXMgPyByZW1vdmVMaXN0ZW5lckZvckV2ZW50KFwia2V5cHJlc3NcIikgOiBudWxsXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgcmVtb3ZlRG93biAmJiByZW1vdmVEb3duKClcclxuICAgIHJlbW92ZVVwICYmIHJlbW92ZVVwKClcclxuICAgIHJlbW92ZVByZXNzICYmIHJlbW92ZVByZXNzKClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYW4gZWZmZWN0IHRoYXQgY2FuIGNhcHR1cmUgW2tleWRvd25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0V2ZW50cy9rZXlkb3duKSwgW2tleXVwXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5dXApLCBhbmQgW2tleXByZXNzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMva2V5cHJlc3MpIGV2ZW50cyBmb3IgeW91ciBlbnRpcmUgZG9jdW1lbnQuIFRoZSBbYEtleWJvYXJkRXZlbnRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudCkgd2lsbCBiZSBwcm92aWRlZCBhcyB0aGUgYWN0aW9uIGBkYXRhYC5cclxuICpcclxuICogQG1lbWJlcm9mIG1vZHVsZTpzdWJzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLmRvd25zIC0gbGlzdGVuIGZvciBrZXlkb3duIGV2ZW50c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHByb3BzLnVwcyAtIGxpc3RlbiBmb3Iga2V5dXAgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJvcHMucHJlc3NlcyAtIGxpc3RlbiBmb3Iga2V5cHJlc3MgZXZlbnRzXHJcbiAqIEBwYXJhbSB7Kn0gcHJvcHMuYWN0aW9uIC0gYWN0aW9uIHRvIGNhbGwgd2hlbiBrZXlib2FyZCBldmVudHMgYXJlIGZpcmVkXHJcbiAqIEBleGFtcGxlXHJcbiAqIGltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcImh5cGVyYXBwLWZ4LWxvY2FsXCJcclxuICpcclxuICogY29uc3QgS2V5U3ViID0gS2V5Ym9hcmQoe1xyXG4gKiAgIGRvd25zOiB0cnVlLFxyXG4gKiAgIHVwczogdHJ1ZSxcclxuICogICBhY3Rpb246IChfLCBrZXlFdmVudCkgPT4ge1xyXG4gKiAgICAgLy8ga2V5RXZlbnQgaGFzIHRoZSBwcm9wcyBvZiB0aGUgS2V5Ym9hcmRFdmVudFxyXG4gKiAgICAgLy8gYWN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBrZXlkb3duIGFuZCBrZXl1cFxyXG4gKiAgIH1cclxuICogfSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBLZXlib2FyZChwcm9wcykge1xyXG4gIHJldHVybiBba2V5Ym9hcmRFZmZlY3QsIHByb3BzXVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBEaXNwbGF5VHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBUb3BpY3MgPSBcInRvcGljc1wiLFxyXG4gICAgQXJ0aWNsZSA9IFwiYXJ0aWNsZVwiLFxyXG4gICAgU3RlcCA9IFwic3RlcFwiXHJcbn1cclxuIiwiXHJcblxyXG5jb25zdCBnVXRpbGl0aWVzID0ge1xyXG5cclxuICAgIHJvdW5kVXBUb05lYXJlc3RUZW46ICh2YWx1ZTogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb29yID0gTWF0aC5mbG9vcih2YWx1ZSAvIDEwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChmbG9vciArIDEpICogMTA7XHJcbiAgICB9LFxyXG5cclxuICAgIHJvdW5kRG93blRvTmVhcmVzdFRlbjogKHZhbHVlOiBudW1iZXIpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yKHZhbHVlIC8gMTApO1xyXG5cclxuICAgICAgICByZXR1cm4gZmxvb3IgKiAxMDtcclxuICAgIH0sXHJcblxyXG4gICAgY29udmVydE1tVG9GZWV0SW5jaGVzOiAobW06IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluY2hlcyA9IG1tICogMC4wMzkzNztcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMuY29udmVydEluY2hlc1RvRmVldEluY2hlcyhpbmNoZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXREaXJlY3Rvcnk6IChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBmaWxlUGF0aC5tYXRjaCgvKC4qKVtcXC9cXFxcXS8pO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hlc1xyXG4gICAgICAgICAgICAmJiBtYXRjaGVzLmxlbmd0aCA+IDBcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb3VudENoYXJhY3RlcjogKFxyXG4gICAgICAgIGlucHV0OiBzdHJpbmcsXHJcbiAgICAgICAgY2hhcmFjdGVyOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5wdXRbaV0gPT09IGNoYXJhY3Rlcikge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfSxcclxuXHJcbiAgICBjb252ZXJ0SW5jaGVzVG9GZWV0SW5jaGVzOiAoaW5jaGVzOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBmZWV0ID0gTWF0aC5mbG9vcihpbmNoZXMgLyAxMik7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nID0gaW5jaGVzICUgMTI7XHJcbiAgICAgICAgY29uc3QgaW5jaGVzUmVhbWluaW5nUm91bmRlZCA9IE1hdGgucm91bmQoaW5jaGVzUmVhbWluaW5nICogMTApIC8gMTA7IC8vIDEgZGVjaW1hbCBwbGFjZXNcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGZlZXQgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBgJHtmZWV0fScgYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmNoZXNSZWFtaW5pbmdSb3VuZGVkID4gMCkge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gYCR7cmVzdWx0fSR7aW5jaGVzUmVhbWluaW5nUm91bmRlZH1cImA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICBpc051bGxPcldoaXRlU3BhY2U6IChpbnB1dDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgaW5wdXQgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dCA9IGAke2lucHV0fWA7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dC5tYXRjaCgvXlxccyokLykgIT09IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrQXJyYXlzRXF1YWw6IChhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEgPT09IG51bGxcclxuICAgICAgICAgICAgfHwgYiA9PT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgeW91IGRvbid0IGNhcmUgYWJvdXQgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbnNpZGVcclxuICAgICAgICAvLyB0aGUgYXJyYXksIHlvdSBzaG91bGQgc29ydCBib3RoIGFycmF5cyBoZXJlLlxyXG4gICAgICAgIC8vIFBsZWFzZSBub3RlIHRoYXQgY2FsbGluZyBzb3J0IG9uIGFuIGFycmF5IHdpbGwgbW9kaWZ5IHRoYXQgYXJyYXkuXHJcbiAgICAgICAgLy8geW91IG1pZ2h0IHdhbnQgdG8gY2xvbmUgeW91ciBhcnJheSBmaXJzdC5cclxuXHJcbiAgICAgICAgY29uc3QgeDogc3RyaW5nW10gPSBbLi4uYV07XHJcbiAgICAgICAgY29uc3QgeTogc3RyaW5nW10gPSBbLi4uYl07XHJcbiAgICAgICAgXHJcbiAgICAgICAgeC5zb3J0KCk7XHJcbiAgICAgICAgeS5zb3J0KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhbaV0gIT09IHlbaV0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlKGFycmF5OiBBcnJheTxhbnk+KTogQXJyYXk8YW55PiB7XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHRlbXBvcmFyeVZhbHVlOiBhbnlcclxuICAgICAgICBsZXQgcmFuZG9tSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoZ1V0aWxpdGllcy5pc051bGxPcldoaXRlU3BhY2UoaW5wdXQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIWlzTmFOKGlucHV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNOZWdhdGl2ZU51bWVyaWM6IChpbnB1dDogYW55KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGlmICghZ1V0aWxpdGllcy5pc051bWVyaWMoaW5wdXQpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gK2lucHV0IDwgMDsgLy8gKyBjb252ZXJ0cyBhIHN0cmluZyB0byBhIG51bWJlciBpZiBpdCBjb25zaXN0cyBvbmx5IG9mIGRpZ2l0cy5cclxuICAgIH0sXHJcblxyXG4gICAgaGFzRHVwbGljYXRlczogPFQ+KGlucHV0OiBBcnJheTxUPik6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAobmV3IFNldChpbnB1dCkuc2l6ZSAhPT0gaW5wdXQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgZXh0ZW5kOiA8VD4oYXJyYXkxOiBBcnJheTxUPiwgYXJyYXkyOiBBcnJheTxUPik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBhcnJheTIuZm9yRWFjaCgoaXRlbTogVCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYXJyYXkxLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21TdHJpbmc6IChpbnB1dDogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMucHJldHR5UHJpbnRKc29uRnJvbU9iamVjdChKU09OLnBhcnNlKGlucHV0KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXR0eVByaW50SnNvbkZyb21PYmplY3Q6IChpbnB1dDogb2JqZWN0IHwgbnVsbCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgICBpbnB1dCxcclxuICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgNCAvLyBpbmRlbnRlZCA0IHNwYWNlc1xyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzUG9zaXRpdmVOdW1lcmljOiAoaW5wdXQ6IGFueSk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdW1lcmljKGlucHV0KSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihpbnB1dCkgPj0gMDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VGltZTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdzogRGF0ZSA9IG5ldyBEYXRlKERhdGUubm93KCkpO1xyXG4gICAgICAgIGNvbnN0IHRpbWU6IHN0cmluZyA9IGAke25vdy5nZXRGdWxsWWVhcigpfS0keyhub3cuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0tJHtub3cuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX0gJHtub3cuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7bm93LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9Ojoke25vdy5nZXRNaWxsaXNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDMsICcwJyl9OmA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZTogKGlucHV0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGlucHV0LnNwbGl0KC9bXFxyXFxuXSsvKTtcclxuICAgICAgICBjb25zdCBjbGVhbmVkOiBBcnJheTxzdHJpbmc+ID0gW107XHJcblxyXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgodmFsdWU6IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZSh2YWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhbmVkLnB1c2godmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xlYW5lZDtcclxuICAgIH0sXHJcblxyXG4gICAgc3BsaXRCeVBpcGU6IChpbnB1dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIGlmIChnVXRpbGl0aWVzLmlzTnVsbE9yV2hpdGVTcGFjZShpbnB1dCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBpbnB1dC5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWQ6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHJcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFuZWQucHVzaCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xyXG4gICAgfSxcclxuXHJcbiAgICBzcGxpdEJ5TmV3TGluZUFuZE9yZGVyOiAoaW5wdXQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1V0aWxpdGllc1xyXG4gICAgICAgICAgICAuc3BsaXRCeU5ld0xpbmUoaW5wdXQpXHJcbiAgICAgICAgICAgIC5zb3J0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpvaW5CeU5ld0xpbmU6IChpbnB1dDogQXJyYXk8c3RyaW5nPik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXRcclxuICAgICAgICAgICAgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuam9pbignXFxuJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUFsbENoaWxkcmVuOiAocGFyZW50OiBFbGVtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGlzT2RkOiAoeDogbnVtYmVyKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiB4ICUgMiA9PT0gMTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvcnRQcmludFRleHQ6IChcclxuICAgICAgICBpbnB1dDogc3RyaW5nLFxyXG4gICAgICAgIG1heExlbmd0aDogbnVtYmVyID0gMTAwKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGdVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZVNwYWNlKGlucHV0KSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3ROZXdMaW5lSW5kZXg6IG51bWJlciA9IGdVdGlsaXRpZXMuZ2V0Rmlyc3ROZXdMaW5lSW5kZXgoaW5wdXQpO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3ROZXdMaW5lSW5kZXggPiAwXHJcbiAgICAgICAgICAgICYmIGZpcnN0TmV3TGluZUluZGV4IDw9IG1heExlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQuc3Vic3RyKDAsIGZpcnN0TmV3TGluZUluZGV4IC0gMSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1V0aWxpdGllcy50cmltQW5kQWRkRWxsaXBzaXMob3V0cHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGggPD0gbWF4TGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdVdGlsaXRpZXMudHJpbUFuZEFkZEVsbGlwc2lzKG91dHB1dCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRyaW1BbmRBZGRFbGxpcHNpczogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBpbnB1dC50cmltKCk7XHJcbiAgICAgICAgbGV0IHB1bmN0dWF0aW9uUmVnZXg6IFJlZ0V4cCA9IC9bLixcXC8jISQlXFxeJlxcKjs6e309XFwtX2B+KCldL2c7XHJcbiAgICAgICAgbGV0IHNwYWNlUmVnZXg6IFJlZ0V4cCA9IC9cXFcrL2c7XHJcbiAgICAgICAgbGV0IGxhc3RDaGFyYWN0ZXI6IHN0cmluZyA9IG91dHB1dFtvdXRwdXQubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGxldCBsYXN0Q2hhcmFjdGVySXNQdW5jdHVhdGlvbjogYm9vbGVhbiA9XHJcbiAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICB8fCBzcGFjZVJlZ2V4LnRlc3QobGFzdENoYXJhY3Rlcik7XHJcblxyXG5cclxuICAgICAgICB3aGlsZSAobGFzdENoYXJhY3RlcklzUHVuY3R1YXRpb24gPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zdWJzdHIoMCwgb3V0cHV0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsYXN0Q2hhcmFjdGVyID0gb3V0cHV0W291dHB1dC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGxhc3RDaGFyYWN0ZXJJc1B1bmN0dWF0aW9uID1cclxuICAgICAgICAgICAgICAgIHB1bmN0dWF0aW9uUmVnZXgudGVzdChsYXN0Q2hhcmFjdGVyKVxyXG4gICAgICAgICAgICAgICAgfHwgc3BhY2VSZWdleC50ZXN0KGxhc3RDaGFyYWN0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke291dHB1dH0uLi5gO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGaXJzdE5ld0xpbmVJbmRleDogKGlucHV0OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICBsZXQgY2hhcmFjdGVyOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ1xcbidcclxuICAgICAgICAgICAgICAgIHx8IGNoYXJhY3RlciA9PT0gJ1xccicpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cHBlckNhc2VGaXJzdExldHRlcjogKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zbGljZSgxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuZXJhdGVHdWlkOiAodXNlSHlwZW5zOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBsZXQgZDIgPSAocGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgJiYgcGVyZm9ybWFuY2Uubm93XHJcbiAgICAgICAgICAgICYmIChwZXJmb3JtYW5jZS5ub3coKSAqIDEwMDApKSB8fCAwO1xyXG5cclxuICAgICAgICBsZXQgcGF0dGVybiA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xyXG5cclxuICAgICAgICBpZiAoIXVzZUh5cGVucykge1xyXG4gICAgICAgICAgICBwYXR0ZXJuID0gJ3h4eHh4eHh4eHh4eDR4eHh5eHh4eHh4eHh4eHh4eHh4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWQgPSBwYXR0ZXJuXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgL1t4eV0vZyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDE2O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZCArIHIpICUgMTYgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSAoZDIgKyByKSAlIDE2IHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZDIgPSBNYXRoLmZsb29yKGQyIC8gMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBndWlkO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0lmQ2hyb21lOiAoKTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIC8vIHBsZWFzZSBub3RlLCBcclxuICAgICAgICAvLyB0aGF0IElFMTEgbm93IHJldHVybnMgdW5kZWZpbmVkIGFnYWluIGZvciB3aW5kb3cuY2hyb21lXHJcbiAgICAgICAgLy8gYW5kIG5ldyBPcGVyYSAzMCBvdXRwdXRzIHRydWUgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBidXQgbmVlZHMgdG8gY2hlY2sgaWYgd2luZG93Lm9wciBpcyBub3QgdW5kZWZpbmVkXHJcbiAgICAgICAgLy8gYW5kIG5ldyBJRSBFZGdlIG91dHB1dHMgdG8gdHJ1ZSBub3cgZm9yIHdpbmRvdy5jaHJvbWVcclxuICAgICAgICAvLyBhbmQgaWYgbm90IGlPUyBDaHJvbWUgY2hlY2tcclxuICAgICAgICAvLyBzbyB1c2UgdGhlIGJlbG93IHVwZGF0ZWQgY29uZGl0aW9uXHJcblxyXG4gICAgICAgIGxldCB0c1dpbmRvdzogYW55ID0gd2luZG93IGFzIGFueTtcclxuICAgICAgICBsZXQgaXNDaHJvbWl1bSA9IHRzV2luZG93LmNocm9tZTtcclxuICAgICAgICBsZXQgd2luTmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcclxuICAgICAgICBsZXQgdmVuZG9yTmFtZSA9IHdpbk5hdi52ZW5kb3I7XHJcbiAgICAgICAgbGV0IGlzT3BlcmEgPSB0eXBlb2YgdHNXaW5kb3cub3ByICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIGxldCBpc0lFZWRnZSA9IHdpbk5hdi51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMTtcclxuICAgICAgICBsZXQgaXNJT1NDaHJvbWUgPSB3aW5OYXYudXNlckFnZW50Lm1hdGNoKFwiQ3JpT1NcIik7XHJcblxyXG4gICAgICAgIGlmIChpc0lPU0Nocm9tZSkge1xyXG4gICAgICAgICAgICAvLyBpcyBHb29nbGUgQ2hyb21lIG9uIElPU1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNDaHJvbWl1bSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAmJiB0eXBlb2YgaXNDaHJvbWl1bSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAmJiB2ZW5kb3JOYW1lID09PSBcIkdvb2dsZSBJbmMuXCJcclxuICAgICAgICAgICAgJiYgaXNPcGVyYSA9PT0gZmFsc2VcclxuICAgICAgICAgICAgJiYgaXNJRWVkZ2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIC8vIGlzIEdvb2dsZSBDaHJvbWVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVXRpbGl0aWVzOyIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuXHJcbiAgICBOb25lID0gJ25vbmUnLFxyXG4gICAgRmlsdGVyVG9waWNzID0gJ2ZpbHRlclRvcGljcycsXHJcbiAgICBHZXRUb3BpYyA9ICdnZXRUb3BpYycsXHJcbiAgICBHZXRUb3BpY0FuZFJvb3QgPSAnZ2V0VG9waWNBbmRSb290JyxcclxuICAgIFNhdmVBcnRpY2xlU2NlbmUgPSAnc2F2ZUFydGljbGVTY2VuZScsXHJcbiAgICBHZXRSb290ID0gJ2dldFJvb3QnLFxyXG4gICAgR2V0U3RlcCA9ICdnZXRTdGVwJyxcclxuICAgIEdldFBhZ2UgPSAnZ2V0UGFnZScsXHJcbiAgICBHZXRDaGFpbiA9ICdnZXRDaGFpbicsXHJcbiAgICBHZXRPdXRsaW5lID0gJ2dldE91dGxpbmUnLFxyXG4gICAgR2V0RnJhZ21lbnQgPSAnZ2V0RnJhZ21lbnQnLFxyXG4gICAgR2V0Q2hhaW5GcmFnbWVudCA9ICdnZXRDaGFpbkZyYWdtZW50J1xyXG59XHJcblxyXG4iLCJpbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwRWZmZWN0IGltcGxlbWVudHMgSUh0dHBFZmZlY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB1cmw6IHN0cmluZyxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25EZWxlZ2F0ZSA9IGFjdGlvbkRlbGVnYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheTtcclxufVxyXG4iLCJpbXBvcnQgSUFjdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQWN0aW9uXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSHR0cEVmZmVjdCBmcm9tIFwiLi4vLi4vc3RhdGUvZWZmZWN0cy9IdHRwRWZmZWN0XCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcblxyXG5cclxuLy8gVGhpcyBpcyB3aGVyZSBhbGwgYWxlcnRzIHRvIGRhdGEgY2hhbmdlcyBzaG91bGQgYmUgbWFkZVxyXG5jb25zdCBnU3RhdGVDb2RlID0ge1xyXG5cclxuICAgIGdldEZyZXNoS2V5SW50OiAoc3RhdGU6IElTdGF0ZSk6IG51bWJlciA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRLZXkgPSArK3N0YXRlLm5leHRLZXk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0S2V5O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRGcmVzaEtleTogKHN0YXRlOiBJU3RhdGUpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7Z1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSl9YDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0R3VpZEtleTogKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBVLmdlbmVyYXRlR3VpZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBuZXdTdGF0ZTogSVN0YXRlID0geyAuLi5zdGF0ZSB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkZFJlTG9hZERhdGFFZmZlY3Q6IChcclxuICAgIC8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgLy8gICAgIG5hbWU6IHN0cmluZyxcclxuICAgIC8vICAgICB1cmw6IHN0cmluZyxcclxuICAgIC8vICAgICBhY3Rpb25EZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogdm9pZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGVmZmVjdDogSUh0dHBFZmZlY3QgfCB1bmRlZmluZWQgPSBzdGF0ZVxyXG4gICAgLy8gICAgICAgICAucmVwZWF0RWZmZWN0c1xyXG4gICAgLy8gICAgICAgICAucmVMb2FkR2V0SHR0cFxyXG4gICAgLy8gICAgICAgICAuZmluZCgoZWZmZWN0OiBJSHR0cEVmZmVjdCkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBlZmZlY3QubmFtZSA9PT0gbmFtZTtcclxuICAgIC8vICAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIGlmIChlZmZlY3QpIHsgLy8gYWxyZWFkeSBhZGRlZC5cclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgY29uc3QgaHR0cEVmZmVjdDogSUh0dHBFZmZlY3QgPSBuZXcgSHR0cEVmZmVjdChcclxuICAgIC8vICAgICAgICAgbmFtZSxcclxuICAgIC8vICAgICAgICAgdXJsLFxyXG4gICAgLy8gICAgICAgICBhY3Rpb25EZWxlZ2F0ZVxyXG4gICAgLy8gICAgICk7XHJcblxyXG4gICAgLy8gICAgIHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cC5wdXNoKGh0dHBFZmZlY3QpO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBBZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgYWN0aW9uRGVsZWdhdGU6IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBlZmZlY3Q6IElIdHRwRWZmZWN0IHwgdW5kZWZpbmVkID0gc3RhdGVcclxuICAgICAgICAgICAgLnJlcGVhdEVmZmVjdHNcclxuICAgICAgICAgICAgLnJlTG9hZEdldEh0dHBJbW1lZGlhdGVcclxuICAgICAgICAgICAgLmZpbmQoKGVmZmVjdDogSUh0dHBFZmZlY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWZmZWN0Lm5hbWUgPT09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZWZmZWN0KSB7IC8vIGFscmVhZHkgYWRkZWQuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0ID0gbmV3IEh0dHBFZmZlY3QoXHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgYWN0aW9uRGVsZWdhdGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUucHVzaChodHRwRWZmZWN0KTtcclxuICAgIH0sXHJcblxyXG4gICAgQWRkUnVuQWN0aW9uSW1tZWRpYXRlOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhY3Rpb25EZWxlZ2F0ZTogSUFjdGlvbik6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJ1bkFjdGlvbkltbWVkaWF0ZS5wdXNoKGFjdGlvbkRlbGVnYXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RhdGVDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGVwVUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBVSVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXBVSSBpbXBsZW1lbnRzIElTdGVwVUkge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcih1aUlEOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBlZ3M6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb3B0aW9uVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvblRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGF1dG9mb2N1czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBleHBhbmRPcHRpb25zOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbm90ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBlZ0Nyb3duOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcFVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwVUlcIjtcclxuaW1wb3J0IFN0ZXBVSSBmcm9tIFwiLi9TdGVwVUlcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXAgaW1wbGVtZW50cyBJU3RlcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgU3RlcFVJKHVpSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHRva2VuOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBvcHRpb25JbnRybzogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcmRlcjogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBzdWJUb2tlbjogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBsZWFmOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBvcHRpb25zOiBBcnJheTxJT3B0aW9uPiA9IFtdO1xyXG4gICAgcHVibGljIGJpbjogYW55ID0ge307XHJcblxyXG4gICAgcHVibGljIHVpOiBJU3RlcFVJO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBTdGVwVHlwZSB7XHJcbiAgICBOb25lID0gXCJub25lXCIsXHJcbiAgICBSb290ID0gXCJyb290XCIsXHJcbiAgICBTdGVwID0gXCJzdGVwXCIsXHJcbiAgICBBbmNpbGxhcnlSb290ID0gXCJhbmNpbGxhcnlSb290XCIsXHJcbiAgICBBbmNpbGxhcnlTdGVwID0gXCJhbmNpbGxhcnlTdGVwXCJcclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcbmltcG9ydCBJT3B0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lPcHRpb25cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGVwQ2FjaGUgaW1wbGVtZW50cyBJU3RlcENhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnQuY2hhaW5JRDtcclxuICAgICAgICB0aGlzLmNoYWluSUQgPSBgJHtwYXJlbnQuY2hhaW5JRH0uJHtzdGVwLm9yZGVyfWA7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBVaUlEOiBudW1iZXIgPSBzdGVwLnVpLnVpSUQ7XHJcbiAgICAgICAgY29uc3QgcGFyZW50T3B0aW9uczogQXJyYXk8SU9wdGlvbj4gPSBwYXJlbnQuc3RlcC5vcHRpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRPcHRpb25zW2ldLnVpLnVpSUQgPT09IHN0ZXBVaUlEKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UZXh0ID0gcGFyZW50T3B0aW9uc1tpXS50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgXCJObyBtYXRjaGluZyB1aUlEIGluIHBhcmVudCBvcHRpb25zISEhXCJcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdGVwOiBJU3RlcDtcclxuICAgIHB1YmxpYyBjaGlsZHJlbjogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBhbmNpbGxhcmllczogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBwYXJlbnQ6IElTdGVwQ2FjaGU7XHJcbiAgICBwdWJsaWMgaGVpcjogSVN0ZXBDYWNoZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHR5cGU6IFN0ZXBUeXBlID0gU3RlcFR5cGUuU3RlcDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgeyBTdGVwVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL1N0ZXBUeXBlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdENhY2hlIGltcGxlbWVudHMgSVN0ZXBDYWNoZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RlcDogSVN0ZXApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5jaGFpbklEID0gJzAuMSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXJlbnRDaGFpbklEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RlcDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgYW5jaWxsYXJpZXM6IEFycmF5PElTdGVwQ2FjaGU+ID0gW107XHJcbiAgICBwdWJsaWMgcGFyZW50OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdHlwZTogU3RlcFR5cGUgPSBTdGVwVHlwZS5Sb290O1xyXG4gICAgcHVibGljIGhlaXI6IElTdGVwQ2FjaGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJSGlzdG9yeVVybCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lIaXN0b3J5VXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeVVybCBpbXBsZW1lbnRzIElIaXN0b3J5VXJsIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclNuYXBTaG90IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSVJlbmRlclNuYXBTaG90XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU25hcFNob3QgaW1wbGVtZW50cyBJUmVuZGVyU25hcFNob3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcclxuICAgIHB1YmxpYyBndWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjcmVhdGVkOiBEYXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbW9kaWZpZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBleHBhbmRlZE9wdGlvbklEczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIGV4cGFuZGVkQW5jaWxsYXJ5SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IEhpc3RvcnlVcmwgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvSGlzdG9yeVVybFwiO1xyXG5pbXBvcnQgUmVuZGVyU25hcFNob3QgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvUmVuZGVyU25hcFNob3RcIjtcclxuXHJcblxyXG5jb25zdCBnSGlzdG9yeUNvZGUgPSB7XHJcblxyXG4gICAgcmVzZXRSYXc6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVzaEJyb3dzZXJIaXN0b3J5U3RhdGU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5yZXNldFJhdygpO1xyXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG4gICAgICAgIGxldCBsYXN0VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaGlzdG9yeS5zdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5oaXN0b3J5LnN0YXRlLnVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhc3RVcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke2xvY2F0aW9uLnNlYXJjaH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHN0YXRlLnJlbmRlclN0YXRlLmN1cnJlbnRGcmFnbWVudDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0/JHtjdXJyZW50Lm91dGxpbmVGcmFnbWVudElEfWA7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VXJsXHJcbiAgICAgICAgICAgICYmIHVybCA9PT0gbGFzdFVybCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcclxuICAgICAgICAgICAgbmV3IFJlbmRlclNuYXBTaG90KHVybCksXHJcbiAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnN0ZXBIaXN0b3J5Lmhpc3RvcnlDaGFpbi5wdXNoKG5ldyBIaXN0b3J5VXJsKHVybCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0hpc3RvcnlDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi9TdGVwXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcE9wdGlvbiBleHRlbmRzIFN0ZXAgaW1wbGVtZW50cyBJT3B0aW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcixcclxuICAgICAgICB0ZXh0OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICB1aUlELFxyXG4gICAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYW5jaWxsYXJ5OiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSVN0ZXAgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBcIjtcclxuaW1wb3J0IFN0ZXBDYWNoZSBmcm9tIFwiLi9TdGVwQ2FjaGVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmNpbGxhcnlDYWNoZSBleHRlbmRzIFN0ZXBDYWNoZSBpbXBsZW1lbnRzIElTdGVwQ2FjaGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNBbmNpbGxhcnk6IGJvb2xlYW4gPSB0cnVlO1xyXG59XHJcbiIsImltcG9ydCBJQXJ0aWNsZVNjZW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUFydGljbGVTY2VuZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGVTY2VuZSBpbXBsZW1lbnRzIElBcnRpY2xlU2NlbmUge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHI6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIGd1aWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGV4cGFuZGVkT3B0aW9uSURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwdWJsaWMgZXhwYW5kZWRBbmNpbGxhcnlJRHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxufVxyXG4iLCJpbXBvcnQgSUNoYWluUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5QYXlsb2FkXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhaW5QYXlsb2FkIGltcGxlbWVudHMgSUNoYWluUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcikge1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXBJRCA9IHN0ZXBJRDtcclxuICAgICAgICB0aGlzLnBhcmVudENoYWluSUQgPSBwYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIHRoaXMudWlJRCA9IHVpSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0ZXBJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudENoYWluSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB1aUlEOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYWluU3RlcFBheWxvYWQgaW1wbGVtZW50cyBJQ2hhaW5TdGVwUGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudDogSVN0ZXAsXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcElEID0gc3RlcElEO1xyXG4gICAgICAgIHRoaXMucGFyZW50Q2hhaW5JRCA9IHBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy51aUlEID0gdWlJRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RlcElEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcGFyZW50Q2hhaW5JRDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhcmVudDogSVN0ZXA7XHJcbiAgICBwdWJsaWMgdWlJRDogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUFydGljbGVTY2VuZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9oaXN0b3J5L0lBcnRpY2xlU2NlbmVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgSU9wdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JT3B0aW9uXCI7XHJcbmltcG9ydCBBcnRpY2xlU2NlbmUgZnJvbSBcIi4uLy4uL3N0YXRlL2hpc3RvcnkvQXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL3N0YXRlL3VpL3BheWxvYWRzL0NoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgQ2hhaW5TdGVwUGF5bG9hZCBmcm9tIFwiLi4vLi4vc3RhdGUvdWkvcGF5bG9hZHMvQ2hhaW5TdGVwUGF5bG9hZFwiO1xyXG5pbXBvcnQgZ1N0ZXBBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dTdGVwQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuL2dIaXN0b3J5Q29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcENvZGUgZnJvbSBcIi4vZ1N0ZXBDb2RlXCI7XHJcblxyXG5jb25zdCBnQXJ0aWNsZUNvZGUgPSB7XHJcblxyXG4gICAgY2hlY2tJZk9wdGlvbnNFeHBhbmRlZDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcENhY2hlOiBJU3RlcENhY2hlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZVxyXG4gICAgICAgICAgICB8fCAhc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gYmUgYWJsZSB0byBsb2FkIHRoZSBjaGFpbiBhbmQgbG9hZCBvcHRpb25zIGJ1dCBvbmx5IGFsbG93ZWQgdG8gZG8gb25lPz9cclxuICAgICAgICAvLyBOZWVkIHRvIGxvYWQgdGhlc2UgXHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcENhY2hlLnN0ZXAub3B0aW9ucztcclxuICAgICAgICBsZXQgb3B0aW9uOiBJT3B0aW9uO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5QYXlsb2FkKFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24udWkudWlJRFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5zaG93QW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmluY2x1ZGVzKG9wdGlvbi5pZCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblBheWxvYWQgPSBuZXcgQ2hhaW5TdGVwUGF5bG9hZChcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnVpLnVpSURcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMuZXhwYW5kT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnU3RhdGVDb2RlLkFkZFJ1bkFjdGlvbkltbWVkaWF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25cclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmU6IChyYXdBcnRpY2xlU2NlbmU6IGFueSk6IElBcnRpY2xlU2NlbmUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QXJ0aWNsZVNjZW5lLmd1aWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSA9IG5ldyBBcnRpY2xlU2NlbmUoKTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUua2V5ID0gcmF3QXJ0aWNsZVNjZW5lLmtleTtcclxuICAgICAgICBhcnRpY2xlU2NlbmUuciA9IHJhd0FydGljbGVTY2VuZS5yO1xyXG4gICAgICAgIGFydGljbGVTY2VuZS5ndWlkID0gcmF3QXJ0aWNsZVNjZW5lLmd1aWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgPSByYXdBcnRpY2xlU2NlbmUuY3JlYXRlZDtcclxuICAgICAgICBhcnRpY2xlU2NlbmUubW9kaWZpZWQgPSByYXdBcnRpY2xlU2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEc107XHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnJhd0FydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEc107XHJcblxyXG4gICAgICAgIHJldHVybiBhcnRpY2xlU2NlbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRBcnRpY2xlU2NlbmVDYWNoZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QXJ0aWNsZVNjZW5lOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lIHwgbnVsbCA9IGdBcnRpY2xlQ29kZS5sb2FkQXJ0aWNsZVNjZW5lKHJhd0FydGljbGVTY2VuZSk7XHJcblxyXG4gICAgICAgIGlmICghYXJ0aWNsZVNjZW5lKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmFydGljbGVTY2VuZSA9IGFydGljbGVTY2VuZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lID0gZ0FydGljbGVDb2RlLmNsb25lKHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lKTtcclxuXHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGRBcnRpY2xlU2NlbmU6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FsbGVkIGJ1aWxkQXJ0aWNsZVNjZW5lXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGU/LnJvb3RcclxuICAgICAgICAgICAgfHwgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lID0gbmV3IEFydGljbGVTY2VuZSgpO1xyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICByb290Q2FjaGUsXHJcbiAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUuYXJ0aWNsZVNjZW5lID0gYXJ0aWNsZVNjZW5lO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBTY2VuZTogKFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwsXHJcbiAgICAgICAgYXJ0aWNsZVNjZW5lOiBJQXJ0aWNsZVNjZW5lKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RlcENhY2hlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwQ2FjaGUuYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNhY2hlID0gc3RlcENhY2hlLmFuY2lsbGFyaWVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMucHVzaChhbmNpbGxhcnlDYWNoZS5zdGVwLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZVNjZW5lXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZUNhc3Q6IElTdGVwQ2FjaGUgPSBzdGVwQ2FjaGUgYXMgSVN0ZXBDYWNoZTtcclxuXHJcbiAgICAgICAgaWYgKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ1N0ZXBDb2RlLmhhc011bHRpcGxlU2ltcGxlT3B0aW9ucyhzdGVwQ2FjaGUuc3RlcC5vcHRpb25zKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcy5wdXNoKGFuY2lsbGFyeUNhY2hlQ2FzdC5oZWlyLnN0ZXAuaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRTdGVwU2NlbmUoXHJcbiAgICAgICAgICAgICAgICBhbmNpbGxhcnlDYWNoZUNhc3QuaGVpcixcclxuICAgICAgICAgICAgICAgIGFydGljbGVTY2VuZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzdGVwQ2FjaGUuaGVpcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGdTdGVwQ29kZS5oYXNNdWx0aXBsZVNpbXBsZU9wdGlvbnMoc3RlcENhY2hlLnN0ZXAub3B0aW9ucykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMucHVzaChzdGVwQ2FjaGUuaGVpci5zdGVwLmlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkU3RlcFNjZW5lKFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlLmhlaXIsXHJcbiAgICAgICAgICAgICAgICBhcnRpY2xlU2NlbmVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lOiAoc2NlbmU6IElBcnRpY2xlU2NlbmUpOiBJQXJ0aWNsZVNjZW5lID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgQXJ0aWNsZVNjZW5lKCk7XHJcbiAgICAgICAgY2xvbmUua2V5ID0gc2NlbmUua2V5O1xyXG4gICAgICAgIGNsb25lLnIgPSBzY2VuZS5yO1xyXG4gICAgICAgIGNsb25lLmd1aWQgPSBzY2VuZS5ndWlkO1xyXG4gICAgICAgIGNsb25lLmNyZWF0ZWQgPSBzY2VuZS5jcmVhdGVkO1xyXG4gICAgICAgIGNsb25lLm1vZGlmaWVkID0gc2NlbmUubW9kaWZpZWQ7XHJcbiAgICAgICAgY2xvbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMgPSBbLi4uc2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHNdO1xyXG4gICAgICAgIGNsb25lLmV4cGFuZGVkT3B0aW9uSURzID0gWy4uLnNjZW5lLmV4cGFuZGVkT3B0aW9uSURzXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc1NjZW5lQ2hhbmdlZDogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNjZW5lID0gc3RhdGUudG9waWNTdGF0ZS5hcnRpY2xlU2NlbmU7XHJcbiAgICAgICAgY29uc3QgZ2hvc3RBcnRpY2xlU2NlbmUgPSBzdGF0ZS50b3BpY1N0YXRlLmdob3N0QXJ0aWNsZVNjZW5lO1xyXG5cclxuICAgICAgICBpZiAoIWFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgJiYgYXJ0aWNsZVNjZW5lLmV4cGFuZGVkT3B0aW9uSURzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnaG9zdEFydGljbGVTY2VuZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFydGljbGVTY2VuZS5leHBhbmRlZEFuY2lsbGFyeUlEcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICB8fCBhcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGFuZ2VkID1cclxuICAgICAgICAgICAgYXJ0aWNsZVNjZW5lLmNyZWF0ZWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmNyZWF0ZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmd1aWQgIT09IGdob3N0QXJ0aWNsZVNjZW5lLmd1aWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLmtleSAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUua2V5XHJcbiAgICAgICAgICAgIHx8IGFydGljbGVTY2VuZS5tb2RpZmllZCAhPT0gZ2hvc3RBcnRpY2xlU2NlbmUubW9kaWZpZWRcclxuICAgICAgICAgICAgfHwgYXJ0aWNsZVNjZW5lLnIgIT09IGdob3N0QXJ0aWNsZVNjZW5lLnJcclxuICAgICAgICAgICAgfHwgIVUuY2hlY2tBcnJheXNFcXVhbChhcnRpY2xlU2NlbmUuZXhwYW5kZWRBbmNpbGxhcnlJRHMsIGdob3N0QXJ0aWNsZVNjZW5lLmV4cGFuZGVkQW5jaWxsYXJ5SURzKVxyXG4gICAgICAgICAgICB8fCAhVS5jaGVja0FycmF5c0VxdWFsKGFydGljbGVTY2VuZS5leHBhbmRlZE9wdGlvbklEcywgZ2hvc3RBcnRpY2xlU2NlbmUuZXhwYW5kZWRPcHRpb25JRHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hhbmdlZDtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdBcnRpY2xlQ29kZTtcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJU3RlcCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcFwiO1xyXG5pbXBvcnQgU3RlcCBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcFwiO1xyXG5pbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1N0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgUm9vdENhY2hlIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Sb290Q2FjaGVcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElPcHRpb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSU9wdGlvblwiO1xyXG5pbXBvcnQgU3RlcE9wdGlvbiBmcm9tIFwiLi4vLi4vc3RhdGUvdG9waWMvU3RlcE9wdGlvblwiO1xyXG5pbXBvcnQgQW5jaWxsYXJ5Q2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL0FuY2lsbGFyeUNhY2hlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdTdGVwQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9nU3RlcEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJSEpzb24gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvaEpzb24vSUhKc29uXCI7XHJcbmltcG9ydCBnQXJ0aWNsZUNvZGUgZnJvbSBcIi4vZ0FydGljbGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYnVpbGRUaXRsZSA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLnRpdGxlKSA9PT0gZmFsc2VcclxuICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnRleHQpKSB7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4gPSBKU09OLnBhcnNlKHN0ZXAudGV4dCk7XHJcbiAgICBzdGVwLnVpLnRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZE9wdGlvblRpdGxlID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSBmYWxzZVxyXG4gICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAub3B0aW9uSW50cm8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGpzb25FbGVtZW50czogQXJyYXk8SUhKc29uPiA9IEpTT04ucGFyc2Uoc3RlcC5vcHRpb25JbnRybyk7XHJcbiAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gYnVpbGRUaXRsZUZyb21Kc29uKGpzb25FbGVtZW50cyk7XHJcblxyXG4gICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXAudWkub3B0aW9uVGl0bGUpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwLnVpLnBlZ3MubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgc3RlcC51aS5vcHRpb25UaXRsZSA9IHN0ZXAudWkucGVnc1tzdGVwLnVpLnBlZ3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwLnVpLm9wdGlvblRpdGxlKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzdGVwLnVpLm9wdGlvblRpdGxlID0gc3RlcC51aS50aXRsZTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkVGl0bGVGcm9tSnNvbiA9IChqc29uRWxlbWVudHM6IEFycmF5PElISnNvbj4pOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmIChqc29uRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBjaGVja0NoaWxkcmVuRm9yVGl0bGUoanNvbkVsZW1lbnRzKTtcclxuXHJcbiAgICByZXR1cm4gdGl0bGU7XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0VsZW1lbnRGb3JUaXRsZSA9IChlbGVtZW50OiBJSEpzb24gfCBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgIGlmICghZWxlbWVudCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hlY2tDaGlsZHJlbkZvclRpdGxlKGVsZW1lbnQuY2hpbGRyZW4pO1xyXG59O1xyXG5cclxuY29uc3QgY2hlY2tDaGlsZHJlbkZvclRpdGxlID0gKGNoaWxkcmVuOiBBcnJheTxJSEpzb24gfCBzdHJpbmc+KTogc3RyaW5nID0+IHtcclxuXHJcbiAgICBpZiAoIWNoaWxkcmVuXHJcbiAgICAgICAgfHwgIWNoaWxkcmVuLmxlbmd0aFxyXG4gICAgICAgIHx8IGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGVja0VsZW1lbnRGb3JUaXRsZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBmaW5kUGVncyA9IChcclxuICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgaW5wdXQ6IEFycmF5PGFueT4pOiB2b2lkID0+IHtcclxuXHJcbiAgICBsZXQgZWxlbWVudDogYW55O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGlucHV0W2ldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudFxyXG4gICAgICAgICAgICAmJiBlbGVtZW50LmNoaWxkcmVuKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IC9eaFsxLTNdJC87XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4udGVzdChlbGVtZW50Lm5hbWUpKSB7IC8vIGlzIGEgaGVhZGVyXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ3MucHVzaChlbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5hdHRyaWJ1dGVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5pZCA9IGdTdGVwQ29kZS5idWlsZFBlZ0lEKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS51aUlELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcC51aS5wZWdzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLmNsYXNzID0gJ3BlZyBuYXYnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwLnVpLnBlZ0Nyb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5jbGFzcyA9IGAke2VsZW1lbnQuYXR0cmlidXRlcy5jbGFzc30gY3Jvd25gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbmRQZWdzKFxyXG4gICAgICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBsb2FkUGVncyA9IChzdGVwOiBJU3RlcCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShzdGVwLnRleHQpO1xyXG5cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcblxyXG4gICAgICAgICAgICBmaW5kUGVncyhcclxuICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0ZXAudGV4dCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2gge1xyXG4gICAgICAgIC8vIHN3YWxsb3dcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNjYW5UZXh0ID0gKHN0ZXA6IElTdGVwKTogdm9pZCA9PiB7XHJcblxyXG4gICAgY29uc3QgdGV4dDogc3RyaW5nID0gc3RlcC50ZXh0LnRyaW0oKTtcclxuICAgIGNvbnN0IG5vdGU6IHN0cmluZyA9ICdbe1wibmFtZVwiOlwicFwiLFwiYXR0cmlidXRlc1wiOntcImNsYXNzXCI6XCJOT1RFXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKG5vdGUpKSB7XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBub3RlLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHRleHRbbGVuZ3RoXSA9PT0gJywnKSB7XHJcblxyXG4gICAgICAgICAgICBsZW5ndGgrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudGV4dCA9IGBbJHtzdGVwLnRleHQuc3Vic3RyaW5nKGxlbmd0aCl9YDtcclxuICAgICAgICBzdGVwLnVpLm5vdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZW5kOiBzdHJpbmcgPSAnW3tcIm5hbWVcIjpcInBcIixcImF0dHJpYnV0ZXNcIjp7XCJjbGFzc1wiOlwiRU5EXCJ9LFwiY2hpbGRyZW5cIjpbXCJEZXZcIl19JztcclxuXHJcbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKGVuZCkpIHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGVuZC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0W2xlbmd0aF0gPT09ICcsJykge1xyXG5cclxuICAgICAgICAgICAgbGVuZ3RoKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGVwLnRleHQgPSBgWyR7c3RlcC50ZXh0LnN1YnN0cmluZyhsZW5ndGgpfWA7XHJcbiAgICAgICAgc3RlcC51aS5lbmQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFBlZ3Moc3RlcCk7XHJcbiAgICBidWlsZFRpdGxlKHN0ZXApO1xyXG4gICAgYnVpbGRPcHRpb25UaXRsZShzdGVwKTtcclxufTtcclxuXHJcbmNvbnN0IGxvYWRTdGVwID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd1N0ZXA6IGFueSxcclxuICAgIHVpSUQ6IG51bWJlcik6IElTdGVwID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwOiBJU3RlcCA9IG5ldyBTdGVwKFxyXG4gICAgICAgIHJhd1N0ZXAuaWQsXHJcbiAgICAgICAgdWlJRCwgLy8gZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgcmF3U3RlcC50b2tlblxyXG4gICAgKTtcclxuXHJcbiAgICBzdGVwLnRleHQgPSByYXdTdGVwLnRleHQ7XHJcbiAgICBzdGVwLm9wdGlvbkludHJvID0gcmF3U3RlcC5vcHRpb25JbnRybztcclxuICAgIHN0ZXAuc3ViVG9rZW4gPSByYXdTdGVwLnN1YlRva2VuO1xyXG4gICAgc3RlcC50eXBlID0gcmF3U3RlcC50eXBlO1xyXG4gICAgc3RlcC5sZWFmID0gcmF3U3RlcC5vcHRpb25zPy5sZW5ndGggPT09IDA7XHJcblxyXG4gICAgcmF3U3RlcC5vcHRpb25zLmZvckVhY2goKHJhd09wdGlvbjogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IGxvYWRPcHRpb24oXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdPcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzdGVwLm9wdGlvbnMucHVzaChvcHRpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3RlcC5iaW4gPSByYXdTdGVwLmJpbjtcclxuICAgIHNjYW5UZXh0KHN0ZXApO1xyXG5cclxuICAgIHJldHVybiBzdGVwO1xyXG59O1xyXG5cclxuY29uc3QgbG9hZE9wdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXc6IGFueSk6IElPcHRpb24gPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgIHJhdy5pZCxcclxuICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKSxcclxuICAgICAgICByYXcudGV4dFxyXG4gICAgKTtcclxuXHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXcub3JkZXI7XHJcbiAgICBvcHRpb24uYW5jaWxsYXJ5ID0gcmF3LmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuICAgIG9wdGlvbi5iaW4gPSByYXcuYmluO1xyXG5cclxuICAgIHJldHVybiBvcHRpb247XHJcbn07XHJcblxyXG5jb25zdCBnU3RlcENvZGUgPSB7XHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBnQXJ0aWNsZUNvZGUuY2hlY2tJZk9wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgbmVlZCB0byBjaGVjayBpZiB0aGUgY2hhaW5TdGVwQ2FjaGUuc3RlcCBoYXMgYSBzaW5nbGUgb3B0aW9uXHJcbiAgICAgICAgLy8gSWYgaXQgZG9lcyBsb2FkIGl0IGluIHRoZSBiYWNrZ3JvdW5kXHJcbiAgICAgICAgLy8gVGhlbiBuZWVkIHRvIGFkZCBpdCB0byB0aGUgY2hpbGRyZW4gb2YgdGhlIHBhcmVudCBhbmQgc2V0IGl0IHRvIHRoZSBjaGFpbiBvZiB0aGUgcGFyZW50XHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgPSBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5zdGVwO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIHplcm8gLSBubyBjaG9pY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBvciBtb3JlIHRoYW4gb25lIG9wdGlvbiAtIHNvIHRoZSB1c2VyIG11c3QgbWFrZSB0aGUgY2hvaWNlLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBPbmUgb3B0aW9uIHNvIGxvYWQgaXQgYW5kIHNhdmUgdGhlIHVzZXIgYSBidXR0b24gY2xpY2suXHJcbiAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvbi5pZCxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2hhaW5TdGVwQ2FjaGUuY2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZS5zdGVwLnVpLnVpSUQgPSBvcHRpb24udWkudWlJRDtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBgU3RlcC8ke29wdGlvbi5pZH1gO1xyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYXBpVXJsfS8ke3BhdGh9YDtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYWluUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklEOiBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZS5jaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRDogb3B0aW9uPy51aS51aUlEXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRBbmNpbGxhcnlDaGFpblN0ZXAoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIGNoYWluUmVzcG9uc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnU3RhdGVDb2RlLkFkZFJlTG9hZERhdGFFZmZlY3RJbW1lZGlhdGUoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBgTG9hZCBhbmNpbGxhcnk6ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5TdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmNoZWNrSWZPcHRpb25zRXhwYW5kZWQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBjaGFpblN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IG5lZWQgdG8gY2hlY2sgaWYgdGhlIGNoYWluU3RlcENhY2hlLnN0ZXAgaGFzIGEgc2luZ2xlIG9wdGlvblxyXG4gICAgICAgIC8vIElmIGl0IGRvZXMgbG9hZCBpdCBpbiB0aGUgYmFja2dyb3VuZFxyXG4gICAgICAgIC8vIFRoZW4gbmVlZCB0byBhZGQgaXQgdG8gdGhlIGNoaWxkcmVuIG9mIHRoZSBwYXJlbnQgYW5kIHNldCBpdCB0byB0aGUgY2hhaW4gb2YgdGhlIHBhcmVudFxyXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEFycmF5PElPcHRpb24+ID0gY2hhaW5TdGVwQ2FjaGUuc3RlcC5vcHRpb25zO1xyXG4gICAgICAgIGxldCBvcHQ6IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbjogSU9wdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBvcHRpb25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuYW5jaWxsYXJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgKytvcHRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG9wdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9yZSB0aGFuIG9uZSBvcHRpb24gLSBzbyB0aGUgdXNlciBtdXN0IG1ha2UgdGhlIGNob2ljZS5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT25lIG9wdGlvbiBzbyBsb2FkIGl0IGFuZCBzYXZlIHRoZSB1c2VyIGEgYnV0dG9uIGNsaWNrLlxyXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcENhY2hlLmNoYWluSUQsXHJcbiAgICAgICAgICAgIHRydWVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkudWlJRCA9IG9wdGlvbi51aS51aUlEO1xyXG4gICAgICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgICAgICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBOZWVkIHRvIGxvYWQgY2hhaW4gXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5sb2FkQ2hhaW4oXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF0aDogc3RyaW5nID0gYFN0ZXAvJHtvcHRpb24uaWR9YDtcclxuICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50Q2hhaW5JRDogY2hhaW5TdGVwQ2FjaGUuY2hhaW5JRCxcclxuICAgICAgICAgICAgICAgIHVpSUQ6IG9wdGlvbj8udWkudWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQ2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ1N0YXRlQ29kZS5BZGRSZUxvYWREYXRhRWZmZWN0SW1tZWRpYXRlKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYExvYWQgY2hhaW46ICR7b3B0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkUGVnSUQ6IChcclxuICAgICAgICBzdGVwVWlJRDogbnVtYmVyLFxyXG4gICAgICAgIHBlZ0NvdW50ZXI6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBgcGVnLSR7c3RlcFVpSUR9LSR7cGVnQ291bnRlcn1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZFN0ZXBJRDogKHN0ZXBVaUlEOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYHN0ZXAtJHtzdGVwVWlJRH1gO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZE9wdGlvbkludHJvSUQ6IChzdGVwVWlJRDogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBvcHRpb25zLSR7c3RlcFVpSUR9YDtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGROYXZJRDogKHN0ZXBVaUlEOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYG5hdi0ke3N0ZXBVaUlEfWA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldElERnJvbU5hdklEOiAobmF2SUQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuYXZJRC5zdWJzdHJpbmcoNCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhc011bHRpcGxlU2ltcGxlT3B0aW9uczogKG9wdGlvbnM6IEFycmF5PElPcHRpb24+KTogYm9vbGVhbiA9PiB7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb246IElPcHRpb247XHJcbiAgICAgICAgbGV0IG9wdGlvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5hbmNpbGxhcnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICArK29wdGlvbkNvdW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9uQ291bnQgPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9uZU9wdGlvbnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0czogQXJyYXk8SVN0ZXA+KTogQXJyYXk8SVN0ZXA+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9uczogQXJyYXk8SVN0ZXA+ID0gW107XHJcbiAgICAgICAgbGV0IGlucHV0OiBJU3RlcDtcclxuICAgICAgICBsZXQgb3B0aW9uOiBJU3RlcDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gZ1N0ZXBDb2RlLmNsb25lT3B0aW9uKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGlucHV0OiBJU3RlcCxcclxuICAgICAgICBuZXdJRDogc3RyaW5nIHwgbnVsbCA9IG51bGwpOiBJT3B0aW9uID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFuZXdJRCkge1xyXG5cclxuICAgICAgICAgICAgbmV3SUQgPSBpbnB1dC5pZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IG5ldyBTdGVwT3B0aW9uKFxyXG4gICAgICAgICAgICBuZXdJRCxcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5nZXRGcmVzaEtleUludChzdGF0ZSksXHJcbiAgICAgICAgICAgIGlucHV0LnRleHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBvcHRpb24ub3JkZXIgPSBpbnB1dC5vcmRlcjtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0LmJpbikge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uLmJpbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5wdXQuYmluKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcHRpb24uYW5jaWxsYXJ5ID0gKGlucHV0IGFzIElPcHRpb24pLmFuY2lsbGFyeSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVTdGVwQ2FjaGU6IChcclxuICAgICAgICBpbnB1dDogSVN0ZXBDYWNoZSxcclxuICAgICAgICBwYXJlbnQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgU3RlcENhY2hlKFxyXG4gICAgICAgICAgICBpbnB1dC5zdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb25lUm9vdENhY2hlOiAoaW5wdXQ6IElTdGVwQ2FjaGUpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKGlucHV0LnN0ZXApO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEN1cnJlbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUFuZExvYWRTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdTdGVwOiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdTdGVwXHJcbiAgICAgICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHJhd1N0ZXAuaWQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlQW5kTG9hZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3QW5jaWxsYXJ5OiBhbnksXHJcbiAgICAgICAgdWlJRDogbnVtYmVyKTogSVN0ZXAgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdBbmNpbGxhcnlcclxuICAgICAgICAgICAgfHwgVS5pc051bGxPcldoaXRlU3BhY2UocmF3QW5jaWxsYXJ5LmlkKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbG9hZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByYXdBbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHVpSURcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkUm9vdDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsKTogSVN0ZXBDYWNoZSB8IG51bGwgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uoc3RlcElEKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkOiBBcnJheTxJU3RlcENhY2hlPiA9IHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLmZpbHRlcigocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcElEID09PSByZWcuc3RlcC5pZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWQubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByb290Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSByZWdpc3RlcmVkLmZpbmQoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZy5wYXJlbnRDaGFpbklEID09PSAnMCc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyb290Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByb290Q2FjaGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBDb2RlLmNsb25lUm9vdENhY2hlKHJlZ2lzdGVyZWRbMF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSZWdpc3RlcmVkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcElEOiBzdHJpbmcgfCBudWxsLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICByZWdpc3RlckhlaXI6IGJvb2xlYW4gPSBmYWxzZSk6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKFUuaXNOdWxsT3JXaGl0ZVNwYWNlKHN0ZXBJRCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maWx0ZXIoKHJlZzogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0ZXBJRCA9PT0gcmVnLnN0ZXAuaWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZWdpc3RlcmVkLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gcmVnaXN0ZXJlZC5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZWdpc3RlckhlaXJcclxuICAgICAgICAgICAgJiYgc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnRDYWNoZS5cIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5jbG9uZVN0ZXBDYWNoZShcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRbMF0sXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEFuY2lsbGFyeUNoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlckFuY2lsbGFyeUNoaWxkKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50Q2hhaW5JRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENoaWxkU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVN0ZXAsXHJcbiAgICAgICAgcGFyZW50Q2hhaW5JRDogc3RyaW5nKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5yZWdpc3RlclN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICB0cnVlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gc3RlcENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RlcENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDaGlsZEFuY2lsbGFyeTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgYW5jaWxsYXJ5OiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUucmVnaXN0ZXJBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBhbmNpbGxhcnksXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5Q2hpbGQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyk6IElTdGVwQ2FjaGUgPT4ge1xyXG5cclxuICAgICAgICBsZXQgcGFyZW50Q2FjaGU6IElTdGVwQ2FjaGUgfCB1bmRlZmluZWQgPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5maW5kKChyZWc6IElTdGVwQ2FjaGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDaGFpbklEID09PSByZWcuY2hhaW5JRDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFwYXJlbnRDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZmluZCBwYXJlbnQgc3RlcFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmVuQ2FjaGUgd2FzIG51bGwuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50QW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUgPSBwYXJlbnRDYWNoZSBhcyBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudENhY2hlPy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudENhY2hlPy5jaGlsZHJlbltpXS5zdGVwLmlkID09PSBzdGVwLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQYXJlbnQgaGFzIG1hdGNoaW5nIGNoaWxkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBBbmNpbGxhcnlDYWNoZShcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUuc2V0T3JkZXJGcm9tUGFyZW50KGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChhbmNpbGxhcnlDYWNoZSk7XHJcbiAgICAgICAgcGFyZW50QW5jaWxsYXJ5Q2FjaGUuaGVpciA9IGFuY2lsbGFyeUNhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gYW5jaWxsYXJ5Q2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvbjogSU9wdGlvbiA9IHN0ZXAgYXMgSU9wdGlvbjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRDYWNoZT8uYW5jaWxsYXJpZXNbaV0uc3RlcC5pZCA9PT0gb3B0aW9uLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYFBhcmVudCBoYXMgbWF0Y2hpbmcgYW5jaWxsYXJ5YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gbmV3IEFuY2lsbGFyeUNhY2hlKFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoYW5jaWxsYXJ5Q2FjaGUpO1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuICAgICAgICBwYXJlbnRDYWNoZS5hbmNpbGxhcmllcy5wdXNoKGFuY2lsbGFyeUNhY2hlKTtcclxuXHJcbiAgICAgICAgcGFyZW50Q2FjaGUuYW5jaWxsYXJpZXMuc29ydCgoYSwgYikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEIDwgYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGEuc3RlcC51aS51aUlEID4gYi5zdGVwLnVpLnVpSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFuY2lsbGFyeUNhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRPcmRlckZyb21QYXJlbnQ6IChzdGVwQ2FjaGU6IElTdGVwQ2FjaGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwQ2FjaGVcclxuICAgICAgICAgICAgfHwgIXN0ZXBDYWNoZS5zdGVwXHJcbiAgICAgICAgICAgIHx8ICFzdGVwQ2FjaGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwID0gc3RlcENhY2hlLnN0ZXA7XHJcbiAgICAgICAgY29uc3Qgc3RlcElEOiBzdHJpbmcgPSBzdGVwLmlkO1xyXG5cclxuICAgICAgICBjb25zdCBzeWJsaW5nczogQXJyYXk8SU9wdGlvbj4gPSBzdGVwQ2FjaGUucGFyZW50Py5zdGVwLm9wdGlvbnM7XHJcbiAgICAgICAgbGV0IHN5Ymxpbmc6IElPcHRpb247XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3libGluZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHN5YmxpbmcgPSBzeWJsaW5nc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzeWJsaW5nLmlkID09PSBzdGVwSUQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGVwLm9yZGVyID0gc3libGluZy5vcmRlcjtcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZS5jaGFpbklEID0gYCR7c3RlcENhY2hlLnBhcmVudENoYWluSUR9LiR7c3RlcC5vcmRlcn1gO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJU3RlcCxcclxuICAgICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAgICAgcmVnaXN0ZXJIZWlyOiBib29sZWFuID0gZmFsc2UpOiBJU3RlcENhY2hlID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlIHwgdW5kZWZpbmVkID0gc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZmluZCgocmVnOiBJU3RlcENhY2hlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50Q2hhaW5JRCA9PT0gcmVnLmNoYWluSUQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50Q2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGZpbmQgcGFyZW50IHN0ZXBcIik7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbkNhY2hlIHdhcyBudWxsLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50Q2FjaGU/LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Q2FjaGU/LmNoaWxkcmVuW2ldLnN0ZXAuaWQgPT09IHN0ZXAuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlBhcmVudCBoYXMgbWF0Y2hpbmcgY2hpbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHJlZ2lzdGVySGVpciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50Q2FjaGUuaGVpciA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5zZXRPcmRlckZyb21QYXJlbnQoc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgIHBhcmVudENhY2hlLmNoaWxkcmVuLnB1c2goc3RlcENhY2hlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ZXBDYWNoZTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXA6IElTdGVwKTogSVN0ZXBDYWNoZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0b3BpY1N0YXRlLnRvcGljQ2FjaGUgd2FzIG51bGxcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBuZXcgUm9vdENhY2hlKHN0ZXApO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUucmVnaXN0ZXJlZFN0ZXBzLnB1c2gocm9vdENhY2hlKTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBzdGF0ZS50b3BpY1N0YXRlLmRlZXBlc3RTdGVwID0gcm9vdENhY2hlO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdENhY2hlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUNoYWluU3RlcHM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1N0ZXBzOiBBcnJheTxhbnk+LFxyXG4gICAgICAgIHVpSUQ6IG51bWJlcik6IElTdGVwQ2FjaGUgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZDogQXJyYXk8SVN0ZXBDYWNoZT4gPSBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcztcclxuXHJcbiAgICAgICAgbGV0IHN0ZXA6IElTdGVwIHwgbnVsbDtcclxuICAgICAgICBsZXQgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHBhcmVudENhY2hlOiBJU3RlcENhY2hlO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDE7XHJcblxyXG4gICAgICAgIC8vIGZpcnN0IHN0ZXAgaXMgdGhlIHJvb3RcclxuICAgICAgICAvLyBlYWNoIG5leHQgc3RlcCBpcyBhIGNoaWxkIG9mIHRoZSBwcmV2aW91cyBzdGVwXHJcblxyXG4gICAgICAgIHJhd1N0ZXBzLmZvckVhY2goKHJhd1N0ZXA6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgc3RlcCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByYXdTdGVwLFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcENhY2hlID0gbmV3IFJvb3RDYWNoZShzdGVwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBDYWNoZSA9IG5ldyBTdGVwQ2FjaGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q2FjaGUuY2hpbGRyZW4ucHVzaChzdGVwQ2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENhY2hlLmhlaXIgPSBzdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJlZC5wdXNoKHN0ZXBDYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDYWNoZSA9IHN0ZXBDYWNoZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gc3RhdGUudG9waWNTdGF0ZS5kZWVwZXN0U3RlcCA9IHN0ZXBDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGVwQ2FjaGU7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpczogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5yZWdpc3RlcmVkU3RlcHMuZm9yRWFjaCgoc3RlcENhY2NoZTogSVN0ZXBDYWNoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpKHN0ZXBDYWNjaGUuc3RlcCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0U3RlcFVpOiAoc3RlcDogSVN0ZXApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc3RlcC51aS5leHBhbmRPcHRpb25zID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrU3RlcEZvckV4cGFuZGVkQW5jaWxsYXJ5OiAoc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBDYWNoZS5hbmNpbGxhcmllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGUgPSBzdGVwQ2FjaGUuYW5jaWxsYXJpZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQ29kZS5jaGVja1N0ZXBGb3JFeHBhbmRlZEFuY2lsbGFyeShzdGVwQ2FjaGUucGFyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBDb2RlO1xyXG5cclxuIiwiXHJcblxyXG5jb25zdCBnU2Vzc2lvbiA9IHtcclxuXHJcbiAgICBnZXRWaWRlb1N0YXRlOiAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZUpzb246IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd2aWRlb1N0YXRlJyk7XHJcblxyXG4gICAgICAgIGlmICghdmlkZW9TdGF0ZUpzb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aWRlb1N0YXRlSnNvblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRWaWRlb1N0YXRlOiAodmlkZW9TdGF0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgICAgICd2aWRlb1N0YXRlJywgXHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHZpZGVvU3RhdGUpKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJWaWRlb1N0YXRlOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ3ZpZGVvU3RhdGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRm9jdXNcclxuICAgIGdldEZvY3VzRmlsdGVyOiAoKTogc3RyaW5nID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgY29uc3QgZmlsdGVyOiBzdHJpbmcgfCBudWxsID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZm9jdXNGaWx0ZXInKTtcclxuXHJcbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbHRlclxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRGb2N1c0ZpbHRlcjogKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZm9jdXNGaWx0ZXInLCB2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQWxsRm9jdXNGaWx0ZXJzOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2ZvY3VzRmlsdGVyJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZUZvY3VzRmlsdGVyOiAoZmlsdGVyOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudEZpbHRlciA9IGdTZXNzaW9uLmdldEZvY3VzRmlsdGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIgPT09IGN1cnJlbnRGaWx0ZXIpIHtcclxuICAgICAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU2Vzc2lvbjsiLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1Nlc3Npb24gZnJvbSBcIi4uL2dTZXNzaW9uXCI7XHJcblxyXG5cclxuY29uc3QgZ0h0bWxBY3Rpb25zID0ge1xyXG5cclxuICAgIGNsZWFyRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgZ1Nlc3Npb24uY2xlYXJBbGxGb2N1c0ZpbHRlcnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0FuZFNjcm9sbFRvVG9wOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlLnRvcGljU3RhdGUuaXNBcnRpY2xlVmlldykge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9Ub3AgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdIdG1sQWN0aW9ucztcclxuIiwiaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpYyBpbXBsZW1lbnRzIElUb3BpYyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICByb290RGtJRDogc3RyaW5nLFxyXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXHJcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nLFxyXG4gICAgICAgIHRva2VuOiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICB0YWdzOiBBcnJheTxzdHJpbmc+LFxyXG4gICAgICAgIGNyZWF0ZWQ6IERhdGUgfCBudWxsID0gbnVsbCxcclxuICAgICAgICBtb2RpZmllZDogRGF0ZSB8IG51bGwgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnJvb3REa0lEID0gcm9vdERrSUQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjcmVhdGVkO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZWQgPSBtb2RpZmllZDtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHJvb3REa0lEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdG9rZW46IHN0cmluZztcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGNyZWF0ZWQ6IERhdGUgfCBudWxsO1xyXG4gICAgcHVibGljIG1vZGlmaWVkOiBEYXRlIHwgbnVsbDtcclxuICAgIHB1YmxpYyB0YWdzOiBBcnJheTxzdHJpbmc+O1xyXG59XHJcbiIsImltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IElUb3BpY0NhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lUb3BpY0NhY2hlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNDYWNoZSBpbXBsZW1lbnRzIElUb3BpY0NhY2hlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0b3BpYzogSVRvcGljKSB7XHJcblxyXG4gICAgICAgIHRoaXMudG9waWMgPSB0b3BpYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9waWM6IElUb3BpYztcclxuICAgIHB1YmxpYyByb290OiBJU3RlcENhY2hlIHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IFRvcGljIGZyb20gXCIuLi8uLi9zdGF0ZS90b3BpYy9Ub3BpY1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljQ2FjaGVcIjtcclxuaW1wb3J0IFRvcGljQ2FjaGUgZnJvbSBcIi4uLy4uL3N0YXRlL3RvcGljL1RvcGljQ2FjaGVcIjtcclxuaW1wb3J0IGdBcnRpY2xlQ29kZSBmcm9tIFwiLi9nQXJ0aWNsZUNvZGVcIjtcclxuXHJcbmNvbnN0IGdUb3BpY0NvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljQ2FjaGU6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd1RvcGljOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyB8IG51bGwgPSBnVG9waWNDb2RlLmxvYWRUb3BpYyhyYXdUb3BpYyk7XHJcblxyXG4gICAgICAgIGlmICghdG9waWMpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b3BpYy5pZCA9PT0gc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYy5pZCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdG9waWNDYWNoZTogSVRvcGljQ2FjaGUgPSBuZXcgVG9waWNDYWNoZSh0b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljQ2FjaGUucm9vdCA9IHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZT8ucm9vdDtcclxuICAgICAgICAgICAgc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlID0gdG9waWNDYWNoZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyVG9waWM6IChzdGF0ZTogSVN0YXRlKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLmN1cnJlbnRTdGVwID0gbnVsbDtcclxuICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnJlZ2lzdGVyZWRTdGVwcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRUb3BpYzogKHJhd1RvcGljOiBhbnkpOiBJVG9waWMgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdUb3BpY1xyXG4gICAgICAgICAgICB8fCBVLmlzTnVsbE9yV2hpdGVTcGFjZShyYXdUb3BpYy5pZCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9waWM6IElUb3BpYyA9IG5ldyBUb3BpYyhcclxuICAgICAgICAgICAgcmF3VG9waWMuaWQsXHJcbiAgICAgICAgICAgIHJhd1RvcGljLnJvb3REa0lELFxyXG4gICAgICAgICAgICByYXdUb3BpYy50aXRsZSxcclxuICAgICAgICAgICAgcmF3VG9waWMudmVyc2lvbixcclxuICAgICAgICAgICAgcmF3VG9waWMudG9rZW4sXHJcbiAgICAgICAgICAgIHJhd1RvcGljLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICByYXdUb3BpYy50YWdzLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5jcmVhdGVkLFxyXG4gICAgICAgICAgICByYXdUb3BpYy5tb2RpZmllZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpYztcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFRvcGljczogKHJhd1RvcGljczogYW55W10pOiBBcnJheTxJVG9waWM+ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9waWNzOiBBcnJheTxJVG9waWM+ID0gW107XHJcblxyXG4gICAgICAgIGlmICghcmF3VG9waWNzXHJcbiAgICAgICAgICAgIHx8IHJhd1RvcGljcy5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9waWM6IElUb3BpYyB8IG51bGw7XHJcblxyXG4gICAgICAgIHJhd1RvcGljcy5mb3JFYWNoKChyYXdUb3BpYzogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0b3BpYyA9IGdUb3BpY0NvZGUubG9hZFRvcGljKHJhd1RvcGljKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xyXG4gICAgICAgICAgICAgICAgdG9waWNzLnB1c2godG9waWMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0b3BpY3M7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlOiAodG9waWM6IElUb3BpYyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRvcGljKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBVLmlzTnVsbE9yV2hpdGVTcGFjZSh0b3BpYy50aXRsZSlcclxuICAgICAgICAgICAgPyBcIlwiXHJcbiAgICAgICAgICAgIDogdG9waWMudGl0bGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRpdGxlRnJvbVN0YXRlOiAoc3RhdGU6IElTdGF0ZSk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdUb3BpY0NvZGUuZ2V0VGl0bGUoc3RhdGUudG9waWNTdGF0ZS50b3BpY0NhY2hlPy50b3BpYyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtPcHRpb25FeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5vcHRpb25FeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hcmtBbmNpbGxhcnlFeHBhbmRlZDogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUudG9waWNTdGF0ZS5hbmNpbGxhcnlFeHBhbmRlZCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzU3RhdGVEaXJ0eTogKHN0YXRlOiBJU3RhdGUpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdBcnRpY2xlQ29kZS5pc1NjZW5lQ2hhbmdlZChzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNDb2RlO1xyXG5cclxuIiwiaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IGdTdGVwQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwXCI7XHJcbmltcG9ydCBJU3RlcENhY2hlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3RvcGljL0lTdGVwQ2FjaGVcIjtcclxuaW1wb3J0IGdTdGVwRWZmZWN0cyBmcm9tIFwiLi4vZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vY29kZS9nSGlzdG9yeUNvZGVcIjtcclxuaW1wb3J0IElDaGFpblBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluUGF5bG9hZFwiO1xyXG5pbXBvcnQgSUNoYWluU3RlcFBheWxvYWQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUNoYWluU3RlcFBheWxvYWRcIjtcclxuaW1wb3J0IGdIdG1sQWN0aW9ucyBmcm9tIFwiLi9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdUb3BpY0NvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljQ29kZVwiO1xyXG5pbXBvcnQgZ0FydGljbGVDb2RlIGZyb20gXCIuLi9jb2RlL2dBcnRpY2xlQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdTdGVwQWN0aW9ucyA9IHtcclxuXHJcbiAgICBleHBhbmRPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluU3RlcFBheWxvYWQ6IElDaGFpblN0ZXBQYXlsb2FkKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWNoYWluU3RlcFBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya09wdGlvbkV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgZ0h0bWxBY3Rpb25zLmNoZWNrQW5kU2Nyb2xsVG9Ub3Aoc3RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluU3RlcFBheWxvYWQucGFyZW50Q2hhaW5JRCxcclxuICAgICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChzdGVwQ2FjaGUpIHtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBzdGVwQ2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbG9hZCBjaGFpbiBcclxuICAgICAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcENhY2hlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5TdGVwUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgICAgICBjaGFpblN0ZXBQYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGV4cGFuZEFuY2lsbGFyeU9wdGlvbjogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnQudWkuZXhwYW5kT3B0aW9ucyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwQ2FjaGU6IElTdGVwQ2FjaGUgfCBudWxsID0gZ1N0ZXBDb2RlLmdldFJlZ2lzdGVyZWRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoc3RlcENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGVwQ2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEFuY2lsbGFyeUNhY2hlOiBJU3RlcENhY2hlID0gc3RlcENhY2hlLnBhcmVudCBhcyBJU3RlcENhY2hlO1xyXG4gICAgICAgICAgICBwYXJlbnRBbmNpbGxhcnlDYWNoZS5oZWlyID0gc3RlcENhY2hlIGFzIElTdGVwQ2FjaGU7XHJcbiAgICAgICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnU3RlcEVmZmVjdHMuZ2V0QW5jaWxsYXJ5U3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNoYWluUGF5bG9hZDogSUNoYWluUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGFpblBheWxvYWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdUb3BpY0NvZGUubWFya0FuY2lsbGFyeUV4cGFuZGVkKHN0YXRlKTtcclxuICAgICAgICBnU3RlcENvZGUucmVzZXRTdGVwVWlzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgLy8gKipBTkNJTExBUlkgTk9URVMqKiBUaGlzIG5lZWRzIHRvIGdldCB0aGUgc3RlcCBmcm9tIHRoZSBjYWNoZSBvciBpZiBub3QgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIEl0IG5lZWRzIHRvIHVzZSB0aGUgcGFyZW50Q2hhaW5JRCBhcyBub3JtYWwgYWZ0ZXIgYWxsIGl0IGlzIGFuIG9wdGlvbiBvZiB0aGUgc3RlcC5cclxuICAgICAgICAvLyBJdCB0aGVuIG5lZWRzIHRvIGFkZCB0aGUgc3RlcGNhY2hlIHRvIHRoZSBwYXJlbnRzU3RlcGNhY2hlIGFuY2lsbGFyaWVzIGxpc3Qgbm90IHRoZSBjaGlsZHJlbiBsaXN0XHJcbiAgICAgICAgLy8gSXQgbmVlZHMgdG8gbWFrZSBzdXJlIGl0IGlzIHJlZ2lzdGVyZWQgYXMgbm9ybWFsXHJcbiAgICAgICAgLy8gQWxzbyBuZWVkIHRvIGJlIHN1cmUgd2hlbiBjbG9uaW5nIGEgc3RlcCBvciByb290IGNhY2hlIHRoYXQgaXQgaXMgYWRkZWQgdG8gdGhlIHJlZ2lzdGVyZWQgY2FjaGUuXHJcbiAgICAgICAgLy8gVGhlIHByb2JsZW0gaGVyZSBpcyB3b3JraW5nIG91dCBob3cgdG8gZHJhdyBpdC4gV2UgYXJlIGRyYXdpbmcgYSBjaGFpbiBzbyBpdCBuZWVkcyB0byBrbm93IHRvIGxvb3AgdW50aWwgZmluaXNoZWQgdGhyb3VnaCB0aGUgZGVzY2VuZGFudHMgYmVmb3JlIG1vdmluZyB0byBwYWludGluZyByZXN0IG9mIHBhcmVudCBzdGVwJ3MgZGlzY3Vzc2lvbi5cclxuICAgICAgICAvLyBBbHNvIGJlYXIgaW4gbWluZCB0aGF0IHdoZXJlIHRoZXJlIGlzIG9ubHkgb25lIG9wdGlvbiBpdCBnZXRzIGF1dG9tYXRpY2FsbHkgcGFpbnRlZCB0b28gd2l0aG91dCBwYWludGluZyBhbnkgb3B0aW9uIGJ1dHRvbnMgLSBpZSBzZWFtbGVzcy5cclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcENhY2hlOiBJU3RlcENhY2hlIHwgbnVsbCA9IGdTdGVwQ29kZS5nZXRSZWdpc3RlcmVkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5zdGVwSUQsXHJcbiAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHN0ZXBDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcENhY2hlLnN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldEFuY2lsbGFyeShcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnN0ZXBJRCxcclxuICAgICAgICAgICAgICAgIGNoYWluUGF5bG9hZC5wYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgY2hhaW5QYXlsb2FkLnVpSURcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbGxhcHNlQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFhbmNpbGxhcnlDYWNoZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLnJlc2V0U3RlcFVpcyhzdGF0ZSk7XHJcbiAgICAgICAgYW5jaWxsYXJ5Q2FjaGUuc3RlcC51aS5leHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGdBcnRpY2xlQ29kZS5idWlsZEFydGljbGVTY2VuZShzdGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkQW5jaWxsYXJ5OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50Q2hhaW5JRCA9IHJlc3BvbnNlLnBhcmVudENoYWluSUQ7XHJcbiAgICAgICAgY29uc3QgdWlJRCA9IHJlc3BvbnNlLnVpSUQ7XHJcbiAgICAgICAgY29uc3QganNvbkRhdGEgPSByZXNwb25zZS5yZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcDogSVN0ZXAgfCBudWxsID0gZ1N0ZXBDb2RlLnBhcnNlQW5kTG9hZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICB1aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXAudWkuZXhwYW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZEFuY2lsbGFyeShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnSGlzdG9yeUNvZGUucmVzZXRSYXcoKTtcclxuICAgICAgICBnQXJ0aWNsZUNvZGUuYnVpbGRBcnRpY2xlU2NlbmUoc3RhdGUpO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZEFuY2lsbGFyeUNoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYW5jaWxsYXJ5Q2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEFuY2lsbGFyeUNoYWluU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZVxyXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmVudENoYWluSUQgPSByZXNwb25zZS5wYXJlbnRDaGFpbklEO1xyXG4gICAgICAgIGNvbnN0IGpzb25EYXRhID0gcmVzcG9uc2UucmVzcG9uc2UuanNvbkRhdGE7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXA6IElTdGVwIHwgbnVsbCA9IGdTdGVwQ29kZS5wYXJzZUFuZExvYWRBbmNpbGxhcnkoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBqc29uRGF0YSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudWlJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNpbGxhcnlDaGFpblN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRBbmNpbGxhcnlDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ0FydGljbGVDb2RlLmJ1aWxkQXJ0aWNsZVNjZW5lKHN0YXRlKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRBbmNpbGxhcnlDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGFuY2lsbGFyeUNoYWluU3RlcENhY2hlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRDaGFpblN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoYWluU3RlcENhY2hlOiBJU3RlcENhY2hlID0gZ1N0ZXBDb2RlLmFkZENoaWxkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnU3RlcENvZGUubG9hZENoYWluKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgY2hhaW5TdGVwQ2FjaGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBwYXJlbnRDaGFpbklEID0gcmVzcG9uc2UucGFyZW50Q2hhaW5JRDtcclxuICAgICAgICBjb25zdCBqc29uRGF0YSA9IHJlc3BvbnNlLnJlc3BvbnNlLmpzb25EYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGpzb25EYXRhLFxyXG4gICAgICAgICAgICByZXNwb25zZS51aUlEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBDYWNoZTogSVN0ZXBDYWNoZSA9IGdTdGVwQ29kZS5hZGRDaGlsZFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHN0ZXBDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkUm9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmxvYWRSYXdSb290U3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFJhd1Jvb3RTdGVwOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByYXdSb290U3RlcDogYW55KTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwOiBJU3RlcCB8IG51bGwgPSBnU3RlcENvZGUucGFyc2VBbmRMb2FkU3RlcChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJhd1Jvb3RTdGVwLFxyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmdldEZyZXNoS2V5SW50KHN0YXRlKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc3RlcCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb290Q2FjaGU6IElTdGVwQ2FjaGUgPSBnU3RlcENvZGUuYWRkUm9vdFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ1N0ZXBDb2RlLmxvYWRDaGFpbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJvb3RDYWNoZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1N0ZXBBY3Rpb25zO1xyXG4iLCJcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNcIjtcclxuaW1wb3J0IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgSUh0dHBPdXRwdXQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cE91dHB1dFwiO1xyXG5pbXBvcnQgeyBJSHR0cFNlcXVlbnRpYWxGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwU2VxdWVudGlhbEZldGNoSXRlbVwiO1xyXG5cclxuY29uc3Qgc2VxdWVudGlhbEh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgc2VxdWVudGlhbEJsb2NrczogQXJyYXk8SUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jaz4pOiB2b2lkID0+IHtcclxuXHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2sgd2lsbCBydW4gc2VxdWVudGlhbGx5XHJcbiAgICAvLyBFYWNoIElIdHRwQXV0aGVudGljYXRlZFByb3BzIGluIGVhY2ggYmxvY2sgd2lsbCBydW5uIGluIHBhcmFsbGVsXHJcbiAgICBsZXQgYmxvY2s6IElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s7XHJcbiAgICBsZXQgc3VjY2VzczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBsZXQgaHR0cENhbGw6IGFueTtcclxuICAgIGxldCBsYXN0SHR0cENhbGw6IGFueTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gc2VxdWVudGlhbEJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICBibG9jayA9IHNlcXVlbnRpYWxCbG9ja3NbaV07XHJcblxyXG4gICAgICAgIGlmIChibG9jayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYmxvY2spKSB7XHJcblxyXG4gICAgICAgICAgICBodHRwQ2FsbCA9IHtcclxuICAgICAgICAgICAgICAgIGRlbGVnYXRlOiBwcm9jZXNzQmxvY2ssXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXHJcbiAgICAgICAgICAgICAgICBibG9jazogYmxvY2ssXHJcbiAgICAgICAgICAgICAgICBpbmRleDogYCR7aX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGh0dHBDYWxsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsZWdhdGU6IHByb2Nlc3NQcm9wcyxcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcclxuICAgICAgICAgICAgICAgIGJsb2NrOiBibG9jayxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBgJHtpfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXN0SHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLm5leHRIdHRwQ2FsbCA9IGxhc3RIdHRwQ2FsbDtcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEluZGV4ID0gbGFzdEh0dHBDYWxsLmluZGV4O1xyXG4gICAgICAgICAgICBodHRwQ2FsbC5uZXh0QmxvY2sgPSBsYXN0SHR0cENhbGwuYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXN0SHR0cENhbGwgPSBodHRwQ2FsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHR0cENhbGwpIHtcclxuXHJcbiAgICAgICAgaHR0cENhbGwuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgIGh0dHBDYWxsLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5ibG9jayxcclxuICAgICAgICAgICAgaHR0cENhbGwubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICBodHRwQ2FsbC5pbmRleFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb2Nlc3NCbG9jayA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBibG9jazogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9jayxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgbGV0IHBhcmFsbGVsUHJvcHM6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPiA9IGJsb2NrIGFzIEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzPjtcclxuICAgIGNvbnN0IGRlbGVnYXRlczogYW55W10gPSBbXTtcclxuICAgIGxldCBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHM7XHJcblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJhbGxlbFByb3BzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgIHByb3BzID0gcGFyYWxsZWxQcm9wc1tqXTtcclxuXHJcbiAgICAgICAgZGVsZWdhdGVzLnB1c2goXHJcbiAgICAgICAgICAgIHByb2Nlc3NQcm9wcyhcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBQcm9taXNlXHJcbiAgICAgICAgICAgIC5hbGwoZGVsZWdhdGVzKVxyXG4gICAgICAgICAgICAudGhlbigpXHJcbiAgICAgICAgICAgIC5jYXRjaCgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgcHJvY2Vzc1Byb3BzID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyxcclxuICAgIG5leHREZWxlZ2F0ZTogYW55KTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFwcm9wcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvdXRwdXQ6IElIdHRwT3V0cHV0ID0ge1xyXG4gICAgICAgIG9rOiBmYWxzZSxcclxuICAgICAgICB1cmw6IHByb3BzLnVybCxcclxuICAgICAgICBhdXRoZW50aWNhdGlvbkZhaWw6IGZhbHNlLFxyXG4gICAgICAgIHBhcnNlVHlwZTogXCJ0ZXh0XCIsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0LFxyXG4gICAgICAgIG5leHREZWxlZ2F0ZVxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IGh0dHBFZmZlY3QgPSAoXHJcbiAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzXHJcbik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghcHJvcHMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3V0cHV0OiBJSHR0cE91dHB1dCA9IHtcclxuICAgICAgICBvazogZmFsc2UsXHJcbiAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25GYWlsOiBmYWxzZSxcclxuICAgICAgICBwYXJzZVR5cGU6IHByb3BzLnBhcnNlVHlwZSA/PyAnanNvbicsXHJcbiAgICB9O1xyXG5cclxuICAgIGh0dHAoXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb3V0cHV0XHJcbiAgICApO1xyXG59O1xyXG5cclxuY29uc3QgaHR0cCA9IChcclxuICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICBwcm9wczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMsXHJcbiAgICBvdXRwdXQ6IElIdHRwT3V0cHV0LFxyXG4gICAgbmV4dERlbGVnYXRlOiBhbnkgPSBudWxsKTogdm9pZCA9PiB7XHJcblxyXG4gICAgZmV0Y2goXHJcbiAgICAgICAgcHJvcHMudXJsLFxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQub2sgPSByZXNwb25zZS5vayA9PT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQudHlwZSA9IHJlc3BvbnNlLnR5cGU7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVkaXJlY3RlZCA9IHJlc3BvbnNlLnJlZGlyZWN0ZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNhbGxJRCA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ2FsbElEXCIpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQuY29udGVudFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgb3V0cHV0LmNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnBhcnNlVHlwZSA9IFwianNvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF1dGhlbnRpY2F0aW9uRmFpbCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlc3BvbnNlTnVsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZTogYW55KSB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5lcnJvciArPSBgRXJyb3IgdGhyb3duIHdpdGggcmVzcG9uc2UudGV4dCgpXHJcbmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHJcbiAgICAgICAgICAgIG91dHB1dC50ZXh0RGF0YSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRcclxuICAgICAgICAgICAgICAgICYmIG91dHB1dC5wYXJzZVR5cGUgPT09ICdqc29uJ1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5qc29uRGF0YSA9IEpTT04ucGFyc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZXJyb3IgKz0gYEVycm9yIHRocm93biBwYXJzaW5nIHJlc3BvbnNlLnRleHQoKSBhcyBqc29uXHJcbmA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3V0cHV0Lm9rKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHByb3BzLmFjdGlvbixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG5leHREZWxlZ2F0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0RGVsZWdhdGUuZGVsZWdhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dERlbGVnYXRlLmRpc3BhdGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5ibG9jayxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RGVsZWdhdGUubmV4dEh0dHBDYWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREZWxlZ2F0ZS5pbmRleFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG5cclxuICAgICAgICAgICAgb3V0cHV0LmVycm9yICs9IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICBwcm9wcy5lcnJvcixcclxuICAgICAgICAgICAgICAgIG91dHB1dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ0h0dHAgPSAocHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzKTogSUh0dHBGZXRjaEl0ZW0gPT4ge1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgaHR0cEVmZmVjdCxcclxuICAgICAgICBwcm9wc1xyXG4gICAgXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ1NlcXVlbnRpYWxIdHRwID0gKHByb3BzQmxvY2s6IEFycmF5PElIdHRwQXV0aGVudGljYXRlZFByb3BzQmxvY2s+KTogSUh0dHBTZXF1ZW50aWFsRmV0Y2hJdGVtID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHNlcXVlbnRpYWxIdHRwRWZmZWN0LFxyXG4gICAgICAgIHByb3BzQmxvY2tcclxuICAgIF1cclxufVxyXG4iLCJcclxuY29uc3QgS2V5cyA9IHtcclxuXHJcbiAgICBzdGFydFVybDogJ3N0YXJ0VXJsJyxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgS2V5cztcclxuXHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQ29kZSA9IHtcclxuXHJcbiAgICBjbGVhckF1dGhlbnRpY2F0aW9uOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGF0ZS51c2VyLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRlLnVzZXIuc3ViID0gXCJcIjtcclxuICAgICAgICBzdGF0ZS51c2VyLmxvZ291dFVybCA9IFwiXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25Db2RlO1xyXG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdBamF4SGVhZGVyQ29kZSA9IHtcclxuXHJcbiAgICBidWlsZEhlYWRlcnM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGNhbGxJRDogc3RyaW5nLFxyXG4gICAgICAgIGFjdGlvbjogQWN0aW9uVHlwZSk6IEhlYWRlcnMgPT4ge1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1gtQ1NSRicsICcxJyk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1N1YnNjcmlwdGlvbklEJywgc3RhdGUuc2V0dGluZ3Muc3Vic2NyaXB0aW9uSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDYWxsSUQnLCBjYWxsSUQpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdBY3Rpb24nLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnd2l0aENyZWRlbnRpYWxzJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQWpheEhlYWRlckNvZGU7XHJcblxyXG4iLCJpbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcblxyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25BY3Rpb25zXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyA9IHtcclxuXHJcbiAgICBjaGVja1VzZXJBdXRoZW50aWNhdGVkOiAoc3RhdGU6IElTdGF0ZSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGNhbGxJRCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5Ob25lXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5iZmZVcmx9LyR7c3RhdGUuc2V0dGluZ3MudXNlclBhdGh9P3NsaWRlPWZhbHNlYDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGFjdGlvbjogZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uLFxyXG4gICAgICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJFcnJvciB0cnlpbmcgdG8gYXV0aGVudGljYXRlIHdpdGggdGhlIHNlcnZlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXJsXCI6ICR7dXJsfSxcclxuICAgICAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RcIjogZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cy5jaGVja1VzZXJBdXRoZW50aWNhdGVkLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjYWxsSUQ6ICR7Y2FsbElEfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6ICR7SlNPTi5zdHJpbmdpZnkoc3RhdGUpfVxyXG4gICAgICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25FZmZlY3RzO1xyXG4iLCJpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IEtleXMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvY29uc3RhbnRzL0tleXNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkNvZGUgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQ29kZVwiO1xyXG5pbXBvcnQgZ0F1dGhlbnRpY2F0aW9uRWZmZWN0cyBmcm9tIFwiLi9nQXV0aGVudGljYXRpb25FZmZlY3RzXCI7XHJcblxyXG5cclxuY29uc3QgZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucyA9IHtcclxuXHJcbiAgICBsb2FkU3VjY2Vzc2Z1bEF1dGhlbnRpY2F0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55KTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVxyXG4gICAgICAgICAgICB8fCByZXNwb25zZS5wYXJzZVR5cGUgIT09IFwianNvblwiXHJcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZS5qc29uRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xhaW1zOiBhbnkgPSByZXNwb25zZS5qc29uRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZTogYW55ID0gY2xhaW1zLmZpbmQoXHJcbiAgICAgICAgICAgIChjbGFpbTogYW55KSA9PiBjbGFpbS50eXBlID09PSAnbmFtZSdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBzdWI6IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ3N1YidcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIW5hbWVcclxuICAgICAgICAgICAgJiYgIXN1Yikge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9nb3V0VXJsQ2xhaW06IGFueSA9IGNsYWltcy5maW5kKFxyXG4gICAgICAgICAgICAoY2xhaW06IGFueSkgPT4gY2xhaW0udHlwZSA9PT0gJ2JmZjpsb2dvdXRfdXJsJ1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghbG9nb3V0VXJsQ2xhaW1cclxuICAgICAgICAgICAgfHwgIWxvZ291dFVybENsYWltLnZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS51c2VyLmF1dGhvcmlzZWQgPSB0cnVlO1xyXG4gICAgICAgIHN0YXRlLnVzZXIubmFtZSA9IG5hbWUudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5zdWIgPSBzdWIudmFsdWU7XHJcbiAgICAgICAgc3RhdGUudXNlci5sb2dvdXRVcmwgPSBsb2dvdXRVcmxDbGFpbS52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrVXNlckxvZ2dlZEluOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jaGVja1VzZXJMb2dnZWRJblByb3BzKHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFwcm9wcykge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgY2hlY2tVc2VyTG9nZ2VkSW5Qcm9wczogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLnVzZXIucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBnQXV0aGVudGljYXRpb25FZmZlY3RzLmNoZWNrVXNlckF1dGhlbnRpY2F0ZWQoc3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2dpbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgS2V5cy5zdGFydFVybCxcclxuICAgICAgICAgICAgY3VycmVudFVybFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7c3RhdGUuc2V0dGluZ3MuYmZmVXJsfS8ke3N0YXRlLnNldHRpbmdzLmRlZmF1bHRMb2dpblBhdGh9P3JldHVyblVybD0vYDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVybCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJBdXRoZW50aWNhdGlvbjogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcbiAgICAgICAgZ0F1dGhlbnRpY2F0aW9uQ29kZS5jbGVhckF1dGhlbnRpY2F0aW9uKHN0YXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyQXV0aGVudGljYXRpb25BbmRTaG93TG9naW46IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBnQXV0aGVudGljYXRpb25Db2RlLmNsZWFyQXV0aGVudGljYXRpb24oc3RhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5sb2dpbihzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvZ291dDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oc3RhdGUudXNlci5sb2dvdXRVcmwpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnQXV0aGVudGljYXRpb25BY3Rpb25zO1xyXG4iLCJpbXBvcnQgeyBnSHR0cCB9IGZyb20gXCIuL2dIdHRwXCI7XHJcblxyXG5pbXBvcnQgSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc1wiO1xyXG5pbXBvcnQgSUh0dHBQcm9wcyBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwUHJvcHNcIjtcclxuaW1wb3J0IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMgZnJvbSBcIi4vZ0F1dGhlbnRpY2F0aW9uQWN0aW9uc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnQXV0aGVudGljYXRlZEh0dHAocHJvcHM6IElIdHRwUHJvcHMpOiBhbnkge1xyXG5cclxuICAgIGNvbnN0IGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllczogSUh0dHBBdXRoZW50aWNhdGVkUHJvcHMgPSBwcm9wcyBhcyBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcztcclxuXHJcbiAgICAvLyAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb25cclxuICAgIC8vIGh0dHBBdXRoZW50aWNhdGVkUHJvcGVydGllcy5vbkF1dGhlbnRpY2F0aW9uRmFpbEFjdGlvbiA9IGdBdXRoZW50aWNhdGlvbkFjdGlvbnMuY2xlYXJBdXRoZW50aWNhdGlvbjtcclxuXHJcbiAgICAvLyBUbyByZWdpc3RlciBmYWlsZWQgYXV0aGVudGljYXRpb24gYW5kIHNob3cgbG9naW4gcGFnZVxyXG4gICAgaHR0cEF1dGhlbnRpY2F0ZWRQcm9wZXJ0aWVzLm9uQXV0aGVudGljYXRpb25GYWlsQWN0aW9uID0gZ0F1dGhlbnRpY2F0aW9uQWN0aW9ucy5jbGVhckF1dGhlbnRpY2F0aW9uQW5kU2hvd0xvZ2luO1xyXG5cclxuICAgIHJldHVybiBnSHR0cChodHRwQXV0aGVudGljYXRlZFByb3BlcnRpZXMpO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvQWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnU3RlcEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ1N0ZXBBY3Rpb25zXCI7XHJcbi8vIGltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuLi9odHRwL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGdldFN0ZXAgPSAoXHJcbiAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgc3RlcElEOiBzdHJpbmcsXHJcbiAgICBfcGFyZW50Q2hhaW5JRDogc3RyaW5nLFxyXG4gICAgYWN0aW9uOiBBY3Rpb25UeXBlLFxyXG4gICAgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5KTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbElEOiBzdHJpbmcgPSBVLmdlbmVyYXRlR3VpZCgpO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gZ0FqYXhIZWFkZXJDb2RlLmJ1aWxkSGVhZGVycyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IGBTdGVwLyR7c3RlcElEfWA7XHJcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGAke3N0YXRlLnNldHRpbmdzLmFwaVVybH0vJHtwYXRofWA7XHJcblxyXG4gICAgcmV0dXJuIGdBdXRoZW50aWNhdGVkSHR0cCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgIGFjdGlvbjogbG9hZEFjdGlvbixcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3IgZ2V0dGluZyBzdGVwIGRhdGEgZnJvbSB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2dldFN0ZXAubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnU3RlcEVmZmVjdHMgPSB7XHJcblxyXG4gICAgZ2V0Um9vdFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJvb3RJRDogc3RyaW5nKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcm9vdElELFxyXG4gICAgICAgICAgICAnMCcsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0Um9vdCxcclxuICAgICAgICAgICAgZ1N0ZXBBY3Rpb25zLmxvYWRSb290U3RlcFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkU3RlcChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgc3RlcElELFxyXG4gICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBbmNpbGxhcnk6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEFuY2lsbGFyeVN0ZXA6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHN0ZXBJRDogc3RyaW5nLFxyXG4gICAgICAgIHBhcmVudENoYWluSUQ6IHN0cmluZyxcclxuICAgICAgICB1aUlEOiBudW1iZXIpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFpblJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgICAgICAgICAgICAgdWlJRFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5sb2FkQW5jaWxsYXJ5Q2hhaW5TdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjaGFpblJlc3BvbnNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldFN0ZXAoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGVwSUQsXHJcbiAgICAgICAgICAgIHBhcmVudENoYWluSUQsXHJcbiAgICAgICAgICAgIEFjdGlvblR5cGUuR2V0U3RlcCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnU3RlcEVmZmVjdHM7XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnVG9waWNDb2RlIGZyb20gXCIuL2dUb3BpY0NvZGVcIjtcclxuXHJcblxyXG4vLyBUaGlzIGlzIHdoZXJlIGFsbCBhbGVydHMgdG8gZGF0YSBjaGFuZ2VzIHNob3VsZCBiZSBtYWRlXHJcbmNvbnN0IGdUb3BpY3NTdGF0ZUNvZGUgPSB7XHJcblxyXG4gICAgbG9hZFRvcGljczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS50b3BpY3MgPSBnVG9waWNDb2RlLmxvYWRUb3BpY3MocmVzcG9uc2UudmFsdWVzKTtcclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscy50b3RhbEl0ZW1zID0gcmVzcG9uc2UudG90YWw7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHJlc3BvbnNlLnRvdGFsID8/IDA7XHJcbiAgICAgICAgc3RhdGUudG9waWNzU3RhdGUudG9waWNDb3VudCA9IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQgPCAwID8gMCA6IHN0YXRlLnRvcGljc1N0YXRlLnRvcGljQ291bnQ7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ1RvcGljc1N0YXRlQ29kZTtcclxuXHJcbiIsImltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBnSGlzdG9yeUNvZGUgZnJvbSBcIi4uL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdUb3BpY3NTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1RvcGljc1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgZ0ZpbHRlckVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZpbHRlckVmZmVjdHNcIjtcclxuXHJcblxyXG5jb25zdCBnVG9waWNzQ29yZUFjdGlvbnMgPSB7XHJcblxyXG4gICAgbG9hZFZpZXdPckJ1aWxkRnJlc2g6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnkpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdUb3BpY3NTdGF0ZUNvZGUubG9hZFRvcGljcyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb25EYXRhXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljczogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIHN0YXRlLmRpc3BsYXlUeXBlID0gRGlzcGxheVR5cGUuVG9waWNzO1xyXG4gICAgICAgIGdIaXN0b3J5Q29kZS5wdXNoQnJvd3Nlckhpc3RvcnlTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5hdXRvRmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnVG9waWNzQ29yZUFjdGlvbnM7XHJcbiIsIlxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1RvcGljc0NvcmVBY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zL2dUb3BpY3NDb3JlQWN0aW9uc1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCB7IElIdHRwRmV0Y2hJdGVtIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvaHR0cC9JSHR0cEZldGNoSXRlbVwiO1xyXG5pbXBvcnQgeyBnQXV0aGVudGljYXRlZEh0dHAgfSBmcm9tIFwiLi4vaHR0cC9nQXV0aGVudGljYXRpb25IdHRwXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgYXV0b0ZpbHRlciA9IChzdGF0ZTogSVN0YXRlKTogYW55ID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcbiAgICBjb25zdCBhY3Rpb246IEFjdGlvblR5cGUgPSBBY3Rpb25UeXBlLkZpbHRlclRvcGljcztcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIGFjdGlvblxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBib2R5OiBhbnkgPSB7XHJcbiAgICAgICAgc3RhcnQ6IHN0YXRlLnRvcGljc1N0YXRlLnBhZ2luYXRpb25EZXRhaWxzLnN0YXJ0LFxyXG4gICAgICAgIGJhdGNoU2l6ZTogc3RhdGUudG9waWNzU3RhdGUucGFnaW5hdGlvbkRldGFpbHMuY291bnQsXHJcbiAgICAgICAgZnJhZ21lbnQ6IHN0YXRlLnNlYXJjaFN0YXRlLnRleHQsXHJcbiAgICAgICAgY2FsbElEOiBjYWxsSUQsXHJcbiAgICAgICAgYWN0aW9uOiBhY3Rpb25cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYm9keUpzb246IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtzdGF0ZS5zZXR0aW5ncy5hcGlVcmx9L0ZpbHRlci9Ub3BpY3NgO1xyXG5cclxuICAgIHJldHVybiBnQXV0aGVudGljYXRlZEh0dHAoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogYm9keUpzb25cclxuICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGdUb3BpY3NDb3JlQWN0aW9ucy5sb2FkVmlld09yQnVpbGRGcmVzaCxcclxuICAgICAgICBlcnJvcjogKHN0YXRlOiBJU3RhdGUsIGVycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiRXJyb3Igc2VuZGluZyB0b3BpY3MgYXV0byBmaWx0ZXIgZGF0YSB0byB0aGUgc2VydmVyLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogJHt1cmx9LFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvciBEZXRhaWxzXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzKX0sXHJcbiAgICAgICAgICAgICAgICBcInN0YWNrXCI6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JEZXRhaWxzLnN0YWNrKX0sXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiAke2F1dG9GaWx0ZXIubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9LFxyXG4gICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHN0YXRlKX1cclxuICAgICAgICAgICAgfWApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmNvbnN0IGdGaWx0ZXJFZmZlY3RzID0ge1xyXG5cclxuICAgIGZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIC8vIGlmIChzdGF0ZS5sZW5zLmZpbHRlclRhYi5hZHZhbmNlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGdGaWx0ZXJFZmZlY3RzLmFkdmFuY2VkRmlsdGVyKHN0YXRlKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXV0b0ZpbHRlcjogKHN0YXRlOiBJU3RhdGUpOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRvRmlsdGVyKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGaWx0ZXJFZmZlY3RzO1xyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElUb3BpYyBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JVG9waWNcIjtcclxuaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG5pbXBvcnQgZ1N0ZXBFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nU3RlcEVmZmVjdHNcIjtcclxuaW1wb3J0IElQYWdpbmF0aW9uUGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JUGFnaW5hdGlvblBheWxvYWRcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGaWx0ZXJFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nRmlsdGVyRWZmZWN0c1wiO1xyXG5pbXBvcnQgVG9waWNDYWNoZSBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvdG9waWMvVG9waWNDYWNoZVwiO1xyXG5pbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IElTdGVwQ2FjaGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVN0ZXBDYWNoZVwiO1xyXG5pbXBvcnQgZ0h0bWxBY3Rpb25zIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvYWN0aW9ucy9nSHRtbEFjdGlvbnNcIjtcclxuaW1wb3J0IGdIaXN0b3J5Q29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2NvZGUvZ0hpc3RvcnlDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNBY3Rpb25zID0ge1xyXG5cclxuICAgIHNldFNlYXJjaEZvY3VzOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgc3RhdGUuc2VhcmNoU3RhdGUudWkuaGFzRm9jdXMgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlU2VhcmNoRm9jdXM6IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBzdGF0ZS5zZWFyY2hTdGF0ZS51aS5oYXNGb2N1cyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd1RvcGljc1BhZ2U6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhZ2luYXRpb25QYXlsb2FkOiBJUGFnaW5hdGlvblBheWxvYWQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBhZ2luYXRpb25QYXlsb2FkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS50b3BpY3NTdGF0ZS5wYWdpbmF0aW9uRGV0YWlscyA9IHBhZ2luYXRpb25QYXlsb2FkLnBhZ2luYXRpb25EZXRhaWxzO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpLFxyXG4gICAgICAgICAgICBnRmlsdGVyRWZmZWN0cy5maWx0ZXIoc3RhdGUpXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0U2VhcmNoVGV4dDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIWVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50ID0gZWxlbWVudCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgICAgIHN0YXRlLnNlYXJjaFN0YXRlLnRleHQgPSBgJHt0ZXh0YXJlYS52YWx1ZX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VhcmNoOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKSxcclxuICAgICAgICAgICAgZ0ZpbHRlckVmZmVjdHMuZmlsdGVyKHN0YXRlKVxyXG4gICAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrRm9yRW50ZXJLZXlQcmVzczogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAga2V5RXZlbnQ6IGFueSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGtleUV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcblxyXG4gICAgICAgICAgICBrZXlFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRvcGljQWN0aW9ucy5zZWFyY2goc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93VG9waWM6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHRvcGljOiBJVG9waWMpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGdTdGVwQ29kZS5yZXNldFN0ZXBVaXMoc3RhdGUpO1xyXG4gICAgICAgIHN0YXRlLnRvcGljU3RhdGUudG9waWNDYWNoZSA9IG5ldyBUb3BpY0NhY2hlKHRvcGljKTtcclxuICAgICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLkFydGljbGU7XHJcbiAgICAgICAgZ0hpc3RvcnlDb2RlLnB1c2hCcm93c2VySGlzdG9yeVN0YXRlKHN0YXRlKTtcclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5oaWRlQmFubmVyID0gdHJ1ZTtcclxuICAgICAgICBnSHRtbEFjdGlvbnMuY2hlY2tBbmRTY3JvbGxUb1RvcChzdGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvb3RDYWNoZTogSVN0ZXBDYWNoZSB8IG51bGwgPSBnU3RlcENvZGUuZ2V0UmVnaXN0ZXJlZFJvb3QoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUudG9waWMucm9vdERrSURcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAocm9vdENhY2hlKSB7XHJcblxyXG4gICAgICAgICAgICBzdGF0ZS50b3BpY1N0YXRlLnRvcGljQ2FjaGUucm9vdCA9IHJvb3RDYWNoZTtcclxuXHJcbiAgICAgICAgICAgIGdTdGVwQ29kZS5zZXRDdXJyZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByb290Q2FjaGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1N0ZXBFZmZlY3RzLmdldFJvb3RTdGVwKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICB0b3BpYy5yb290RGtJRFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvcGljQWN0aW9ucztcclxuIiwiaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXJBcHAtZngvS2V5Ym9hcmRcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCB7IERpc3BsYXlUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ludGVyZmFjZXMvZW51bXMvRGlzcGxheVR5cGVcIjtcclxuaW1wb3J0IHRvcGljQWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy90b3BpY0FjdGlvbnNcIjtcclxuXHJcblxyXG5jb25zdCB0b3BpY1N1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSk6IGFueVtdID0+IHtcclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGlmIChzdGF0ZS5kaXNwbGF5VHlwZSA9PT0gRGlzcGxheVR5cGUuVG9waWNzKSB7XHJcblxyXG4gICAgICAgIHN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICAgICAgS2V5Ym9hcmQoe1xyXG4gICAgICAgICAgICAgICAgZG93bnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1cHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJlc3NlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IHRvcGljQWN0aW9ucy5jaGVja0ZvckVudGVyS2V5UHJlc3NcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdWJzY3JpcHRpb25zO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY1N1YnNjcmlwdGlvbnM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgdG9waWNTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy90b3BpY3NEaXNwbGF5L3N1YnNjcmlwdGlvbnMvdG9waWNTdWJzY3JpcHRpb25zXCI7XHJcblxyXG5cclxuY29uc3QgdG9waWNzQ29yZVN1YnNjcmlwdGlvbnMgPSAoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHZpZXc6IGFueVtdID0gW1xyXG5cclxuICAgICAgICAuLi50b3BpY1N1YnNjcmlwdGlvbnMoc3RhdGUpXHJcbiAgICBdO1xyXG5cclxuICAgIHJldHVybiB2aWV3O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b3BpY3NDb3JlU3Vic2NyaXB0aW9ucztcclxuXHJcbiIsInZhciB0aW1lRnggPSBmdW5jdGlvbiAoZng6IGFueSkge1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoXHJcbiAgICAgICAgYWN0aW9uOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmeCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBkZWxheTogcHJvcHMuZGVsYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHZhciB0aW1lb3V0ID0gdGltZUZ4KFxyXG5cclxuICAgIGZ1bmN0aW9uIChcclxuICAgICAgICBkaXNwYXRjaDogYW55LFxyXG4gICAgICAgIHByb3BzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHByb3BzLmFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb3BzLmRlbGF5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmV4cG9ydCB2YXIgaW50ZXJ2YWwgPSB0aW1lRngoXHJcblxyXG4gICAgZnVuY3Rpb24gKFxyXG4gICAgICAgIGRpc3BhdGNoOiBhbnksXHJcbiAgICAgICAgcHJvcHM6IGFueSkge1xyXG5cclxuICAgICAgICB2YXIgaWQgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvcHMuZGVsYXlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuKTtcclxuXHJcblxyXG4vLyBleHBvcnQgdmFyIG5vd1xyXG4vLyBleHBvcnQgdmFyIHJldHJ5XHJcbi8vIGV4cG9ydCB2YXIgZGVib3VuY2VcclxuLy8gZXhwb3J0IHZhciB0aHJvdHRsZVxyXG4vLyBleHBvcnQgdmFyIGlkbGVDYWxsYmFjaz9cclxuIiwiXHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnQWpheEhlYWRlckNvZGUgZnJvbSBcIi4uL2h0dHAvZ0FqYXhIZWFkZXJDb2RlXCI7XHJcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9BY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBJQWN0aW9uIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lBY3Rpb25cIjtcclxuXHJcbmNvbnN0IHJ1bkFjdGlvbklubmVyID0gKFxyXG4gICAgZGlzcGF0Y2g6IGFueSxcclxuICAgIHByb3BzOiBhbnkpOiB2b2lkID0+IHtcclxuXHJcbiAgICBkaXNwYXRjaChcclxuICAgICAgICBwcm9wcy5hY3Rpb24sXHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IHJ1bkFjdGlvbiA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBxdWV1ZWRFZmZlY3RzOiBBcnJheTxJQWN0aW9uPlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGFjdGlvbjogSUFjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgIGVycm9yOiAoX3N0YXRlOiBJU3RhdGUsIF9lcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcnVubmluZyBhY3Rpb24gaW4gcmVwZWF0QWN0aW9uc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBlZmZlY3RzLnB1c2goW1xyXG4gICAgICAgICAgICBydW5BY3Rpb25Jbm5lcixcclxuICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICBdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IHNlbmRSZXF1ZXN0ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHF1ZXVlZEVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0PlxyXG4pOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0czogYW55W10gPSBbXTtcclxuXHJcbiAgICBxdWV1ZWRFZmZlY3RzLmZvckVhY2goKGh0dHBFZmZlY3Q6IElIdHRwRWZmZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGdldEVmZmVjdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGh0dHBFZmZlY3QsXHJcbiAgICAgICAgICAgIGVmZmVjdHMsXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSksXHJcbiAgICAgICAgLi4uZWZmZWN0c1xyXG4gICAgXTtcclxufTtcclxuXHJcbmNvbnN0IGdldEVmZmVjdCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBodHRwRWZmZWN0OiBJSHR0cEVmZmVjdCxcclxuICAgIGVmZmVjdHM6IEFycmF5PElIdHRwRWZmZWN0Pik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gaHR0cEVmZmVjdC51cmw7XHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXBcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZWZmZWN0ID0gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICdqc29uJyxcclxuICAgICAgICBhY3Rpb246IGh0dHBFZmZlY3QuYWN0aW9uRGVsZWdhdGUsXHJcbiAgICAgICAgZXJyb3I6IChfc3RhdGU6IElTdGF0ZSwgX2Vycm9yRGV0YWlsczogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHBvc3RpbmcgZ1JlcGVhdEFjdGlvbnMgZGF0YSB0byB0aGUgc2VydmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGVmZmVjdHMucHVzaChlZmZlY3QpO1xyXG59O1xyXG5cclxuY29uc3QgZ1JlcGVhdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgLy8gaHR0cFNpbGVudFJlTG9hZDogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHAubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAvLyAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHA7XHJcbiAgICAvLyAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwID0gW107XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzXHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgaHR0cFNpbGVudFJlTG9hZEltbWVkaWF0ZTogKHN0YXRlOiBJU3RhdGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE11c3QgcmV0dXJuIGFsdGVyZWQgc3RhdGUgZm9yIHRoZSBzdWJzY3JpcHRpb24gbm90IHRvIGdldCByZW1vdmVkXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBzdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBzdGF0ZS5yZXBlYXRFZmZlY3RzLnJlTG9hZEdldEh0dHBJbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwSW1tZWRpYXRlID0gW107XHJcblxyXG4gICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlTG9hZEh0dHBFZmZlY3RzSW1tZWRpYXRlXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlOiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBNdXN0IHJldHVybiBhbHRlcmVkIHN0YXRlIGZvciB0aGUgc3Vic2NyaXB0aW9uIG5vdCB0byBnZXQgcmVtb3ZlZFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gc3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBydW5BY3Rpb25JbW1lZGlhdGU6IEFycmF5PElBY3Rpb24+ID0gc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGU7XHJcbiAgICAgICAgc3RhdGUucmVwZWF0RWZmZWN0cy5ydW5BY3Rpb25JbW1lZGlhdGUgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bkFjdGlvbihcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJ1bkFjdGlvbkltbWVkaWF0ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnUmVwZWF0QWN0aW9ucztcclxuXHJcbiIsImltcG9ydCB7IGludGVydmFsIH0gZnJvbSBcIi4uLy4uL2h5cGVyQXBwL3RpbWVcIjtcclxuXHJcbmltcG9ydCBnUmVwZWF0QWN0aW9ucyBmcm9tIFwiLi4vZ2xvYmFsL2FjdGlvbnMvZ1JlcGVhdEFjdGlvbnNcIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuXHJcblxyXG5jb25zdCByZXBlYXRTdWJzY3JpcHRpb25zID0ge1xyXG5cclxuICAgIGJ1aWxkUmVwZWF0U3Vic2NyaXB0aW9uczogKHN0YXRlOiBJU3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgYnVpbGRSZUxvYWREYXRhID0gKCk6IGFueSA9PiB7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoc3RhdGUucmVwZWF0RWZmZWN0cy5yZUxvYWRHZXRIdHRwLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuaHR0cFNpbGVudFJlTG9hZCxcclxuICAgICAgICAvLyAgICAgICAgICAgICB7IGRlbGF5OiAxMDAgfVxyXG4gICAgICAgIC8vICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucmVMb2FkR2V0SHR0cEltbWVkaWF0ZS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVydmFsKFxyXG4gICAgICAgICAgICAgICAgICAgIGdSZXBlYXRBY3Rpb25zLmh0dHBTaWxlbnRSZUxvYWRJbW1lZGlhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgeyBkZWxheTogMTAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkUnVuQWN0aW9uc0ltbWVkaWF0ZSA9ICgpOiBhbnkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlcGVhdEVmZmVjdHMucnVuQWN0aW9uSW1tZWRpYXRlLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgZ1JlcGVhdEFjdGlvbnMuc2lsZW50UnVuQWN0aW9uSW1tZWRpYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVsYXk6IDEwIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZXBlYXRTdWJzY3JpcHRpb246IGFueVtdID0gW1xyXG5cclxuICAgICAgICAgICAgLy8gYnVpbGRSZUxvYWREYXRhKCksXHJcbiAgICAgICAgICAgIGJ1aWxkUmVMb2FkRGF0YUltbWVkaWF0ZSgpLFxyXG4gICAgICAgICAgICBidWlsZFJ1bkFjdGlvbnNJbW1lZGlhdGUoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJldHVybiByZXBlYXRTdWJzY3JpcHRpb247XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZXBlYXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiLy8gaW1wb3J0IHsgSGlzdG9yeVBvcCB9IGZyb20gXCJoeXBlcmFwcC1meC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IHRvcGljc0NvcmVTdWJzY3JpcHRpb25zIGZyb20gXCIuLi8uLi9jb3JlL3RvcGljc0NvcmUvc3Vic2NyaXB0aW9ucy90b3BpY3NDb3JlU3Vic2NyaXB0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgcmVwZWF0U3Vic2NyaXB0aW9ucyBmcm9tIFwiLi4vLi4vLi4vc3Vic2NyaXB0aW9ucy9yZXBlYXRTdWJzY3JpcHRpb25cIjtcclxuXHJcblxyXG5jb25zdCBpbml0U3Vic2NyaXB0aW9ucyA9IChzdGF0ZTogSVN0YXRlKSA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zOiBhbnlbXSA9IFtcclxuXHJcbiAgICAgICAgLi4udG9waWNzQ29yZVN1YnNjcmlwdGlvbnMoc3RhdGUpLFxyXG4gICAgICAgIC4uLnJlcGVhdFN1YnNjcmlwdGlvbnMuYnVpbGRSZXBlYXRTdWJzY3JpcHRpb25zKHN0YXRlKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRTdWJzY3JpcHRpb25zO1xyXG5cclxuIiwiXHJcbmNvbnN0IEZpbHRlcnMgPSB7XHJcblxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50OiBcIiN0cmVlU29sdmVBc3Npc3RhbnRcIixcclxuICAgIHRyZWVTb2x2ZUd1aWRlSUQ6IFwidHJlZVNvbHZlR3VpZGVcIixcclxuICAgIHRyZWVTb2x2ZUZyYWdtZW50c0lEOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiLFxyXG4gICAgdHJlZVNvbHZlQXNzaXN0YW50QmFubmVyOiBcInRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lclwiLFxyXG4gICAgc3RlcFZpZXc6IFwiI3N0ZXBWaWV3XCIsXHJcbiAgICBzdGVwSW5mbzogXCIjc3RlcEluZm9cIixcclxuICAgIHN0ZXBOb2RlczogXCIjc3RlcE5vZGVzXCIsXHJcbiAgICBzdGVwQm90dG9tTmF2OiBcIiNzdGVwQm90dG9tTmF2XCIsXHJcbiAgICBzdGVwU2hvd0ZpbHRlcjogJyNzdGVwQm94U2Nyb2xsU2hvdycsXHJcbiAgICB0b3BpY1Nob3dGaWx0ZXI6ICcjdG9waWNzVmlldyAudG9waWMtcm93LnNjcm9sbC1zaG93JyxcclxuICAgIHRvcGljU2hvd0NsYXNzOiAnc2Nyb2xsLXNob3cnLFxyXG4gICAgbWVudUZvY3VzRmlsdGVyOiAnaGVhZGVyIC5tZW51LWJveCcsXHJcbiAgICBzb2x1dGlvbnNNZW51Rm9jdXNGaWx0ZXI6ICdoZWFkZXIgLnNvbHV0aW9uLW1lbnUnLFxyXG4gICAgZm9sZGVkRm9jdXNGaWx0ZXI6ICcjc3RlcFZpZXcgI2ZvbGRlZENvbnRyb2wnLFxyXG4gICAgbmF2RWxlbWVudHM6ICcjc3RlcFZpZXcgLmRpc2N1c3Npb24gLm5hdicsXHJcbiAgICBzdGVwTm9kZUVsZW1lbnRzOiAnI3N0ZXBOb2RlcyAuc3RlcC1ib3gnLFxyXG4gICAgc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnQ6ICcjc3RlcE5vZGVzIC5zdGVwLWJveC5zZWxlY3RlZCcsXHJcbiAgICB1cE5hdkVsZW1lbnQ6ICcjc3RlcE5hdiAuY2hhaW4tdXB3YXJkcycsXHJcbiAgICBkb3duTmF2RWxlbWVudDogJyNzdGVwTmF2IC5jaGFpbi1kb3dud2FyZHMnLFxyXG5cclxuICAgIGZyYWdtZW50Qm94OiAnI3RyZWVTb2x2ZUZyYWdtZW50cyAubnQtZnItZnJhZ21lbnQtYm94JyxcclxuICAgIGZyYWdtZW50Qm94RGlzY3Vzc2lvbjogJyN0cmVlU29sdmVGcmFnbWVudHMgLm50LWZyLWZyYWdtZW50LWJveCAubnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbidcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsdGVycztcclxuIiwiXHJcbmV4cG9ydCBlbnVtIFNjcm9sbEhvcFR5cGUge1xyXG4gICAgTm9uZSA9IFwibm9uZVwiLFxyXG4gICAgVXAgPSBcInVwXCIsXHJcbiAgICBEb3duID0gXCJkb3duXCJcclxufVxyXG4iLCJpbXBvcnQgZ1N0ZXBDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RlcENvZGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uLy4uLy4uLy4uL2dsb2JhbC9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IFNjcm9sbEhvcFR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IHNjcm9sbFN0ZXAgPSB7XHJcblxyXG4gICAgc2Nyb2xsVXA6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZFN0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke0ZpbHRlcnMuc3RlcE5vZGVFbGVtZW50c31gKSBhcyBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c1N0ZXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFydGljbGVTdGVwSUQ6IHN0cmluZyA9IGdTdGVwQ29kZS5nZXRJREZyb21OYXZJRChwcmV2aW91c1N0ZXBFbGVtZW50LmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxTdGVwLnNjcm9sbFRvVG9FbGVtZW50KGFydGljbGVTdGVwSUQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzY3JvbGxEb3duOiAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke0ZpbHRlcnMuc2VsZWN0ZWRTdGVwTm9kZUVsZW1lbnR9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdGVwRWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLnN0ZXBOb2RlRWxlbWVudHN9YCkgYXMgTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RlcEVsZW1lbnRzW2ldLmlkID09PSBzZWxlY3RlZFN0ZXBFbGVtZW50LmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAoc3RlcEVsZW1lbnRzLmxlbmd0aCAtIDEpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRTdGVwRWxlbWVudDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gc3RlcEVsZW1lbnRzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXh0U3RlcEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJ0aWNsZVN0ZXBJRDogc3RyaW5nID0gZ1N0ZXBDb2RlLmdldElERnJvbU5hdklEKG5leHRTdGVwRWxlbWVudC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxUb1RvRWxlbWVudChhcnRpY2xlU3RlcElEKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gc2Nyb2xsVG9Ub3A6ICgpID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvVG9wKSB7XHJcblxyXG4gICAgLy8gICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxUb1RvcCA9IGZhbHNlO1xyXG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICBzY3JvbGxUb1RvRWxlbWVudDogKGVsZW1lbnRJRDogc3RyaW5nKSA9PiB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudElEfWApO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gZG9jRWwuc2Nyb2xsVG9wIHx8IGJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICBjb25zdCBjbGllbnRUb3AgPSBkb2NFbC5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0b3BPZmZzZXQ6IG51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyA0KSAtIDEwO1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wIC0gdG9wT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiB0b3AsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNjcm9sbDogKCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoVS5pc051bGxPcldoaXRlU3BhY2Uod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50KSA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHNjcm9sbFN0ZXAuc2Nyb2xsVG9Ub0VsZW1lbnQod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uc2Nyb2xsVG9FbGVtZW50IGFzIHN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbEhvcCA9PT0gU2Nyb2xsSG9wVHlwZS5VcCkge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxVcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5zY3JvbGxIb3AgPT09IFNjcm9sbEhvcFR5cGUuRG93bikge1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsU3RlcC5zY3JvbGxEb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsU3RlcDsiLCJpbXBvcnQgRmlsdGVycyBmcm9tIFwiLi4vLi4vLi4vLi4vc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnNcIjtcclxuXHJcblxyXG5jb25zdCBzZWxlY3RlZENsYXNzOiBzdHJpbmcgPSAnc2VsZWN0ZWQnO1xyXG5jb25zdCBkaXNhYmxlZENsYXNzOiBzdHJpbmcgPSAnZGlzYWJsZWQnO1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckRpbWVuc2lvbnMgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3Qgc3RlcEluZm9FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwSW5mb31gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXN0ZXBJbmZvRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwSW5mb1JlY3RhbmdsZSA9IHN0ZXBJbmZvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIGNvbnN0IGJvdHRvbUdhcDogbnVtYmVyID0gMjA7XHJcblxyXG4gICAgY29uc3QgZm9vdGVyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGZvb3RlcmApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmIChmb290ZXJFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvb3RlclJlY3RhbmdsZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZm9vdGVyVG9wID0gZm9vdGVyUmVjdGFuZ2xlLnRvcDtcclxuICAgICAgICBjb25zdCBmb290ZXJWaXNpYmxlID0gd2luZG93SGVpZ2h0IC0gZm9vdGVyVG9wO1xyXG5cclxuICAgICAgICBpZiAoZm9vdGVyVmlzaWJsZSA8PSBib3R0b21HYXApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RlcEluZm9FbGVtZW50LnN0eWxlLmJvdHRvbSA9IGAke2Zvb3RlclZpc2libGUgKyBib3R0b21HYXB9cHhgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0ZXBJbmZvRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHtib3R0b21HYXB9cHhgO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0ZXBCb3R0b21OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwQm90dG9tTmF2fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RlcEluZm9SZWN0YW5nbGUgPSBzdGVwSW5mb0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5ib3R0b20gLSBzdGVwSW5mb1JlY3RhbmdsZS50b3A7XHJcbiAgICBjb25zdCBzdGVwTm9kZXNSZWN0YW5nbGUgPSBzdGVwTm9kZXNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc3RlcE5vZGVzVG9wR2FwID0gc3RlcE5vZGVzUmVjdGFuZ2xlLnRvcCAtIHN0ZXBJbmZvUmVjdGFuZ2xlLnRvcDtcclxuICAgIGxldCBzdGVwTm9kZXNIZWlnaHQgPSBzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgLSBzdGVwTm9kZXNUb3BHYXA7XHJcblxyXG4gICAgaWYgKHN0ZXBCb3R0b21OYXZFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwSW5mb1JlY3RhbmdsZS5oZWlnaHQgPiA4MDApIHtcclxuXHJcbiAgICAgICAgICAgIHN0ZXBCb3R0b21OYXZFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcInVuc2V0XCI7XHJcbiAgICAgICAgICAgIHN0ZXBOb2Rlc0hlaWdodCAtPSAxNTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdGVwQm90dG9tTmF2RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7c3RlcE5vZGVzSGVpZ2h0fXB4YDtcclxufTtcclxuXHJcbmNvbnN0IHNldFNjcm9sbERvd25TaWRlQmFyQXR0ZW50aW9uID0gKG5hdkVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PikgPT4ge1xyXG4gICAgLy8gc2Nyb2xsaW5nIHRvd2FyZHMgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG5cclxuICAgIGxldCBuYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBuYXZFbGVtZW50Qm94OiBET01SZWN0O1xyXG4gICAgbGV0IHRvcE9mZnNldDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0IC8gNDtcclxuICAgIGxldCBhdHRlbnRpb246IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBjb25zdCBuZXN0ZWQ6IEFycmF5PEhUTUxEaXZFbGVtZW50PiA9IFtdO1xyXG4gICAgbGV0IHBlZ0Nyb3duSUQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgbmF2RWxlbWVudCA9IG5hdkVsZW1lbnRzW2ldO1xyXG5cclxuICAgICAgICBpZiAobmF2RWxlbWVudC5pZCA9PT0gcGVnQ3Jvd25JRCkge1xyXG5cclxuICAgICAgICAgICAgcGVnQ3Jvd25JRCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuYXZFbGVtZW50Qm94ID0gbmF2RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgaWYgKG5hdkVsZW1lbnRCb3gudG9wID4gdG9wT2Zmc2V0KSB7XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuYXZFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYW5jaWxsYXJ5JykgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgLy8gSXQgaXMgYW4gYW5jaWxsYXJ5IC0gaXMgaXRzIGVuZCBoYW5naW5nIG92ZXIgdGhlIHRvcE9mZnNldD8gaWUgaXMgaXQgc3RpbGwgdmlzaWJsZVxyXG5cclxuICAgICAgICAgICAgaWYgKChuYXZFbGVtZW50Qm94LnRvcCArIG5hdkVsZW1lbnRCb3guaGVpZ2h0KSA+IHRvcE9mZnNldCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG5lc3RlZC5wdXNoKG5hdkVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgYXR0ZW50aW9uID0gbmF2RWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGlkID0gbmF2RWxlbWVudC5pZDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnc3RlcC0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgYW5jaWxsYXJ5IGNyb3duc1xyXG4gICAgICAgICAgICAgICAgcGVnQ3Jvd25JRCA9IGBwZWctJHtpZC5zdWJzdHJpbmcoNSl9LTFgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF0dGVudGlvbiA9IG5hdkVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhdHRlbnRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcE5hdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjbmF2LSR7YXR0ZW50aW9uLmlkfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc3RlcE5hdikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkTmF2cygpO1xyXG4gICAgc3RlcE5hdi5jbGFzc0xpc3QuYWRkKHNlbGVjdGVkQ2xhc3MpO1xyXG59O1xyXG5cclxuY29uc3QgY2xlYXJTZWxlY3RlZE5hdnMgPSAoKTogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZUVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghc3RlcE5vZGVFbGVtZW50cykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGVwTm9kZUVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RlcE5vZGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICBzdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW2pdO1xyXG5cclxuICAgICAgICBpZiAoc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3RlZENsYXNzKSkge1xyXG5cclxuICAgICAgICAgICAgc3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGVwTm9kZUVsZW1lbnRzO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnNjcm9sbFRvRWxlbWVudCA9IG51bGw7XHJcbiAgICBjb25zdCB1cE5hdkVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnVwTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGRvd25OYXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5kb3duTmF2RWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXVwTmF2RWxlbWVudFxyXG4gICAgICAgIHx8ICFkb3duTmF2RWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZFN0ZXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zZWxlY3RlZFN0ZXBOb2RlRWxlbWVudH1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXNlbGVjdGVkU3RlcEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcEVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7RmlsdGVycy5zdGVwTm9kZUVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGVwRWxlbWVudHNbaV0uaWQgPT09IHNlbGVjdGVkU3RlcEVsZW1lbnQuaWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHVwTmF2RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXBOYXZFbGVtZW50LmNsYXNzTGlzdC5hZGQoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpIDwgKHN0ZXBFbGVtZW50cy5sZW5ndGggLSAxKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRvd25OYXZFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb3duTmF2RWxlbWVudC5jbGFzc0xpc3QuYWRkKGRpc2FibGVkQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhckF0dGVudGlvbiA9ICgpID0+IHtcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4ubGFzdFNjcm9sbFkgPSBzY3JvbGxUb3A7XHJcblxyXG4gICAgY29uc3QgbmF2RWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtGaWx0ZXJzLm5hdkVsZW1lbnRzfWApIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIGlmICghbmF2RWxlbWVudHNcclxuICAgICAgICB8fCBuYXZFbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9zID0gd2luZG93LmlubmVySGVpZ2h0ICsgTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSkgKyAxMDA7XHJcblxyXG4gICAgaWYgKHBvcyA+PSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCkge1xyXG4gICAgICAgIC8vIEF0IHRoZSBib3R0b20gb2YgdGhlIHBhZ2VcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcE5vZGVFbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4gfCBudWxsID0gY2xlYXJTZWxlY3RlZE5hdnMoKTtcclxuXHJcbiAgICAgICAgaWYgKCFzdGVwTm9kZUVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxhc3RTdGVwTm9kZUVsZW1lbnQgPSBzdGVwTm9kZUVsZW1lbnRzW3N0ZXBOb2RlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGlmIChsYXN0U3RlcE5vZGVFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsYXN0U3RlcE5vZGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2Nyb2xsRG93blNpZGVCYXJBdHRlbnRpb24obmF2RWxlbWVudHMpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0U2lkZUJhciA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRTaWRlQmFyRGltZW5zaW9ucygpO1xyXG4gICAgc2V0U2lkZUJhckF0dGVudGlvbigpO1xyXG4gICAgc2V0VXBBbmREb3duQnV0dG9uc1N0YXRlKCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXRTaWRlQmFyOyIsImltcG9ydCBnU2Vzc2lvbiBmcm9tIFwiLi4vLi4vLi4vLi4vZ2xvYmFsL2dTZXNzaW9uXCI7XHJcbmltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5pbXBvcnQgc2Nyb2xsU3RlcCBmcm9tIFwiLi9zY3JvbGxTdGVwXCI7XHJcbmltcG9ydCBzZXRTaWRlQmFyIGZyb20gXCIuL3NldFNpZGVCYXJcIjtcclxuXHJcblxyXG5jb25zdCBoaWRlQmFubmVyID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpeGVkQmFubmVyID0gYF9fJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgY29uc3QgYmFubmVyRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtmaXhlZEJhbm5lcn1gKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZiAod2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lcikgeyAvLyBNdXN0IGhpZGUgYmFubmVyXHJcblxyXG4gICAgICAgIGlmIChiYW5uZXJFbGVtZW50KSB7IC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgICAgIHJldHVybjsgLy8gTm8gbmVlZCB0byBjaGFuZ2UgYW55dGhpbmdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBub3QgY3VycmVudGx5IGhpZGRlbiAtIHNvIGhpZGUgaXRcclxuICAgICAgICBjb25zdCBkaXZFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke0ZpbHRlcnMudHJlZVNvbHZlQXNzaXN0YW50QmFubmVyfWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoZGl2RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBiYW5uZXJcclxuICAgICAgICAgICAgZGl2RWxlbWVudC5pZCA9IGZpeGVkQmFubmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBNdXN0IHNob3cgYmFubmVyXHJcblxyXG4gICAgICAgIC8vIEJhbm5lciBjdXJyZW50bHkgaGlkZGVuXHJcbiAgICAgICAgaWYgKGJhbm5lckVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEhpZGUgYmFubmVyXHJcbiAgICAgICAgICAgIGJhbm5lckVsZW1lbnQuaWQgPSBgJHtGaWx0ZXJzLnRyZWVTb2x2ZUFzc2lzdGFudEJhbm5lcn1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHNldEZvY3VzID0gKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGZpbHRlcjogc3RyaW5nID0gZ1Nlc3Npb24uZ2V0Rm9jdXNGaWx0ZXIoKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhgZmlsdGVyOiAke2ZpbHRlcn1gKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihmaWx0ZXIpIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGlmIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYGZvY3VzZWQgb246ICR7ZWxlbWVudH1gKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzZXRGb2N1cygpO1xyXG4gICAgaGlkZUJhbm5lcigpO1xyXG4gICAgc2Nyb2xsU3RlcC5zY3JvbGwoKTtcclxuICAgIHNldFNpZGVCYXIoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZDsiLCJpbXBvcnQgc3RlcERpc3BsYXlPblJlbmRlckZpbmlzaGVkIGZyb20gXCIuLi8uLi8uLi9kaXNwbGF5cy9zdGVwRGlzcGxheS9jb2RlL3N0ZXBEaXNwbGF5T25SZW5kZXJGaW5pc2hlZFwiO1xyXG5cclxuXHJcbmNvbnN0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCA9ICgpID0+IHtcclxuXHJcbiAgICBzdGVwRGlzcGxheU9uUmVuZGVyRmluaXNoZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZDtcclxuXHJcbiIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuY29uc3Qgc2hvd1NlbGVjdGVkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtGaWx0ZXJzLnNlbGVjdGVkU3RlcE5vZGVFbGVtZW50fWApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmICghc2VsZWN0ZWRTdGVwRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGVwTm9kZXNFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7RmlsdGVycy5zdGVwTm9kZXN9YCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFzdGVwTm9kZXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkU3RlcEVsZW1lbnRSZWN0YW5nbGUgPSBzZWxlY3RlZFN0ZXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRUb3AgPSBzZWxlY3RlZFN0ZXBFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHNlbGVjdGVkQm90dG9tID0gc2VsZWN0ZWRTdGVwRWxlbWVudFJlY3RhbmdsZS5ib3R0b207XHJcblxyXG4gICAgY29uc3Qgc3RlcE5vZGVzRWxlbWVudFJlY3RhbmdsZSA9IHN0ZXBOb2Rlc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBzdGVwTm9kZXNFbGVtZW50UmVjdGFuZ2xlLnRvcDtcclxuICAgIGNvbnN0IHBhcmVudEJvdHRvbSA9IHN0ZXBOb2Rlc0VsZW1lbnRSZWN0YW5nbGUuYm90dG9tO1xyXG5cclxuICAgIGNvbnN0IG9mZnNldFRvcCA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wO1xyXG4gICAgY29uc3QgYnVmZmVyID0gNTA7XHJcblxyXG4gICAgLy8gVGhzZXMgc2hvdWxkIGFsbCBiZSByZWxhdGl2ZVxyXG4gICAgaWYgKChzZWxlY3RlZFRvcCAtIGJ1ZmZlcikgPj0gcGFyZW50VG9wXHJcbiAgICAgICAgJiYgKHNlbGVjdGVkQm90dG9tICsgYnVmZmVyKSA8PSBwYXJlbnRCb3R0b20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWlkZGxlID0gKHBhcmVudEJvdHRvbSAtIHBhcmVudFRvcCkgLyAyO1xyXG4gICAgY29uc3QgbmV3UG9zID0gc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUb3AgKyBvZmZzZXRUb3AgLSBtaWRkbGU7XHJcblxyXG4gICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogbmV3UG9zLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcblxyXG4gICAgLy8gaWYgKHNlbGVjdGVkVG9wIDwgcGFyZW50VG9wKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHNlbGVjdGVkWSA9IHNlbGVjdGVkVG9wIC0gcGFyZW50VG9wICsgbWlkZGxlO1xyXG5cclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgSW4gdG9wOiAke3NlbGVjdGVkWX1gKTtcclxuXHJcbiAgICAvLyAgICAgc3RlcE5vZGVzRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogc2VsZWN0ZWRZLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBlbHNlIGlmIChzZWxlY3RlZEJvdHRvbSA+IHBhcmVudEJvdHRvbSkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBzZWxlY3RlZFkgPSBzZWxlY3RlZFRvcCAtIHBhcmVudFRvcCAtIG1pZGRsZTtcclxuXHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYEluIGJvdHRvbTogJHtzZWxlY3RlZFl9YCk7XHJcblxyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG8oeyB0b3A6IHNlbGVjdGVkWSwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gICAgLy8gICAgIHN0ZXBOb2Rlc0VsZW1lbnQuc2Nyb2xsVG9wID0gNjU7XHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5jb25zdCBvblNjcm9sbEVuZCA9ICgpID0+IHtcclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9uU2Nyb2xsRW5kOyIsImltcG9ydCBGaWx0ZXJzIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS9jb25zdGFudHMvRmlsdGVyc1wiO1xyXG5cclxuXHJcbmNvbnN0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgPSAoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRCb3hEaXNjdXNzaW9uczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRmlsdGVycy5mcmFnbWVudEJveERpc2N1c3Npb24pO1xyXG4gICAgbGV0IGZyYWdtZW50Qm94OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxldCBkYXRhRGlzY3Vzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhZ21lbnRCb3hEaXNjdXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBmcmFnbWVudEJveCA9IGZyYWdtZW50Qm94RGlzY3Vzc2lvbnNbaV0gYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgZGF0YURpc2N1c3Npb24gPSBmcmFnbWVudEJveC5kYXRhc2V0LmRpc2N1c3Npb247XHJcblxyXG4gICAgICAgIGlmIChkYXRhRGlzY3Vzc2lvbikge1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRCb3guaW5uZXJIVE1MID0gZGF0YURpc2N1c3Npb247XHJcbiAgICAgICAgICAgIGZyYWdtZW50Qm94LnJlbW92ZUF0dHJpYnV0ZShkYXRhRGlzY3Vzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25GcmFnbWVudHNSZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQgZnJvbSBcIi4uLy4uL2ZyYWdtZW50cy9jb2RlL29uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWRcIjtcclxuXHJcblxyXG4vLyBjb25zdCBzZXRIZWlnaHQgPSAoKSA9PiB7XHJcblxyXG5cclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdHJlZVNvbHZlQXNzaXN0YW50JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4vLyAgICAgaWYgKCFhc3Npc3RhbnQpIHtcclxuLy8gICAgICAgICByZXR1cm47XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgYXNzaXN0YW50LnN0eWxlLmhlaWdodCA9IFwiXCI7IC8vIEdldCBzY3JvbGwgaGVpZ2h0IGFmdGVyIHNldHRpbmcgaGVpZ2h0IHRvIG5vdGhpbmdcclxuLy8gICAgIGNvbnN0IGFzc2lzdGFudFN0eWxlOiBhbnkgPSBnZXRDb21wdXRlZFN0eWxlKGFzc2lzdGFudCk7XHJcbi8vICAgICBjb25zdCBtYXhIZWlnaHQ6IHN0cmluZyA9IGFzc2lzdGFudFN0eWxlWydtYXgtaGVpZ2h0J107XHJcbi8vICAgICBjb25zdCB2aWV3SGVpZ2h0OiBudW1iZXIgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cclxuLy8gICAgIGlmICghbWF4SGVpZ2h0LmVuZHNXaXRoKCdweCcpKSB7XHJcbi8vICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNvbnN0IG1heEhlaWdodEludDogbnVtYmVyID0gK21heEhlaWdodC5zdWJzdHIoMCwgbWF4SGVpZ2h0Lmxlbmd0aCAtIDIpO1xyXG5cclxuLy8gICAgIGlmICh2aWV3SGVpZ2h0ID4gbWF4SGVpZ2h0SW50KSB7XHJcblxyXG4vLyAgICAgICAgIGFzc2lzdGFudC5zdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBhc3Npc3RhbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld0hlaWdodH1weGA7XHJcbi8vICAgICB9XHJcbi8vIH07XHJcblxyXG5jb25zdCBvblJlbmRlckZpbmlzaGVkID0gKCkgPT4ge1xyXG5cclxuICAgIG9uRnJhZ21lbnRzUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIC8vIHNldEhlaWdodCgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25SZW5kZXJGaW5pc2hlZDtcclxuIiwiaW1wb3J0IHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi4vLi4vY29yZS9zdGVwQ29yZS9jb2RlL3N0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZFwiO1xyXG5pbXBvcnQgc2V0U2lkZUJhciBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9zZXRTaWRlQmFyXCI7XHJcbmltcG9ydCBvblNjcm9sbEVuZCBmcm9tIFwiLi4vLi4vZGlzcGxheXMvc3RlcERpc3BsYXkvY29kZS9vblNjcm9sbEVuZFwiO1xyXG5pbXBvcnQgb25SZW5kZXJGaW5pc2hlZCBmcm9tIFwiLi9vblJlbmRlckZpbmlzaGVkXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEV2ZW50cyA9IHtcclxuXHJcbiAgb25SZW5kZXJGaW5pc2hlZDogKCkgPT4ge1xyXG5cclxuICAgIG9uUmVuZGVyRmluaXNoZWQoKTtcclxuICAgIHN0ZXBDb3JlT25SZW5kZXJGaW5pc2hlZCgpO1xyXG4gIH0sXHJcblxyXG4gIHJlZ2lzdGVyR2xvYmFsRXZlbnRzOiAoKSA9PiB7XHJcblxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xyXG5cclxuICAgICAgaW5pdEV2ZW50cy5vblJlbmRlckZpbmlzaGVkKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9uc2Nyb2xsID0gKCkgPT4ge1xyXG5cclxuICAgICAgc2V0U2lkZUJhcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgJ3Njcm9sbGVuZCcsXHJcbiAgICAgIG9uU2Nyb2xsRW5kXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEV2ZW50cztcclxuXHJcblxyXG5cclxuLypcclxuXHJcbi8vIElNUExFTUVOVCBvbkVuZCBjYWxsYmFja1xyXG4vLyBDaGFuZ2Ugbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyB0byB0aGlzXHJcbi8vIEFkZCBhIG5ldyBjYWxsYmFjayBwYXJhbSBhbmQgY2FsbCBpdCBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBjb21wbGV0ZXNcclxuLy8gVGhpcyB3aWxsIG5lZWQgdG8gYmUgZG9uZSBhZnRlciBlYWNoIHVwZGF0ZSBvZiBoeXBlcmFwcCEhISEhISEhISEhISEhXHJcbi8vIEFwcC5yZW5kZXIgaXMgbm9ybWFsbHkgY2FsbGVkIHR3aWNlLlxyXG5cclxuZXhwb3J0IHZhciBhcHAgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIHZhciBzdGF0ZSA9IHt9XHJcbiAgdmFyIGxvY2sgPSBmYWxzZVxyXG4gIHZhciB2aWV3ID0gcHJvcHMudmlld1xyXG4gIHZhciBub2RlID0gcHJvcHMubm9kZVxyXG4gIHZhciB2ZG9tID0gbm9kZSAmJiByZWN5Y2xlTm9kZShub2RlKVxyXG4gIHZhciBzdWJzY3JpcHRpb25zID0gcHJvcHMuc3Vic2NyaXB0aW9uc1xyXG4gIHZhciBzdWJzID0gW11cclxuICB2YXIgb25FbmQgPSBwcm9wcy5vbkVuZCAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiA8PT09IGNyZWF0ZSBjYWxsYmFjayB2YXJpYWJsZSwgc2V0IHRvIG5ldyBwYXJhbSBwcm9wZXJ0eVxyXG4gIHZhciBjb3VudCA9IDFcclxuXHJcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGRpc3BhdGNoKHRoaXMuYWN0aW9uc1tldmVudC50eXBlXSwgZXZlbnQpXHJcbiAgfVxyXG5cclxuICB2YXIgc2V0U3RhdGUgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlICE9PSBuZXdTdGF0ZSkge1xyXG4gICAgICBzdGF0ZSA9IG5ld1N0YXRlXHJcbiAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgc3VicyA9IHBhdGNoU3VicyhzdWJzLCBiYXRjaChbc3Vic2NyaXB0aW9ucyhzdGF0ZSldKSwgZGlzcGF0Y2gpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZpZXcgJiYgIWxvY2spIGRlZmVyKHJlbmRlciwgKGxvY2sgPSB0cnVlKSlcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxuXHJcbiAgdmFyIGRpc3BhdGNoID0gKHByb3BzLm1pZGRsZXdhcmUgfHxcclxuICAgIGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9KShmdW5jdGlvbihhY3Rpb24sIHByb3BzKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgID8gZGlzcGF0Y2goYWN0aW9uKHN0YXRlLCBwcm9wcykpXHJcbiAgICAgIDogaXNBcnJheShhY3Rpb24pXHJcbiAgICAgID8gdHlwZW9mIGFjdGlvblswXSA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgPyBkaXNwYXRjaChcclxuICAgICAgICAgICAgYWN0aW9uWzBdLFxyXG4gICAgICAgICAgICB0eXBlb2YgYWN0aW9uWzFdID09PSBcImZ1bmN0aW9uXCIgPyBhY3Rpb25bMV0ocHJvcHMpIDogYWN0aW9uWzFdXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiAoYmF0Y2goYWN0aW9uLnNsaWNlKDEpKS5tYXAoZnVuY3Rpb24oZngpIHtcclxuICAgICAgICAgICAgZnggJiYgZnhbMF0oZGlzcGF0Y2gsIGZ4WzFdKVxyXG4gICAgICAgICAgfSwgc2V0U3RhdGUoYWN0aW9uWzBdKSksXHJcbiAgICAgICAgICBzdGF0ZSlcclxuICAgICAgOiBzZXRTdGF0ZShhY3Rpb24pXHJcbiAgfSlcclxuXHJcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbG9jayA9IGZhbHNlXHJcbiAgICBub2RlID0gcGF0Y2goXHJcbiAgICAgIG5vZGUucGFyZW50Tm9kZSxcclxuICAgICAgbm9kZSxcclxuICAgICAgdmRvbSxcclxuICAgICAgKHZkb20gPSBnZXRUZXh0Vk5vZGUodmlldyhzdGF0ZSkpKSxcclxuICAgICAgbGlzdGVuZXJcclxuICAgIClcclxuICAgIG9uRW5kKCkgLy8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gPD09PSBDYWxsIG5ldyBjYWxsYmFjayBhZnRlciB0aGUgcmVuZGVyIG1ldGhvZCBmaW5pc2hlc1xyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2gocHJvcHMuaW5pdClcclxufVxyXG5cclxuXHJcblxyXG4qLyIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nU3RhdGVDb2RlXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdEFjdGlvbnMgPSB7XHJcblxyXG4gICAgaW50cm86IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBzbyBmYXJcclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Tm90UmF3OiAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93Py5UcmVlU29sdmU/LnNjcmVlbj8uaXNBdXRvZm9jdXNGaXJzdFJ1bikge1xyXG5cclxuICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uYXV0b2ZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi5pc0F1dG9mb2N1c0ZpcnN0UnVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudFVJIGltcGxlbWVudHMgSVJlbmRlckZyYWdtZW50VUkge1xyXG5cclxuICAgIHB1YmxpYyBvcHRpb25FeHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGZyYWdtZW50T3B0aW9uc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZGlzY3Vzc2lvbkxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvSVJlbmRlckZyYWdtZW50VUlcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50VUkgZnJvbSBcIi4uL3VpL1JlbmRlckZyYWdtZW50VUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJGcmFnbWVudCBpbXBsZW1lbnRzIElSZW5kZXJGcmFnbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHRvcExldmVsTWFwS2V5OiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBtYXBLZXlDaGFpbjogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVJRDogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZ3VpZGVQYXRoOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwYXJlbnRGcmFnbWVudElEOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9wdGlvbnM6IEFycmF5PElSZW5kZXJGcmFnbWVudD4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgb3B0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBpc0FuY2lsbGFyeTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9yZGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1aTogSVJlbmRlckZyYWdtZW50VUkgPSBuZXcgUmVuZGVyRnJhZ21lbnRVSSgpO1xyXG59XHJcbiIsIlxyXG5cclxuY29uc3QgZ0ZpbGVDb25zdGFudHMgPSB7XHJcblxyXG4gICAgZnJhZ21lbnRzRm9sZGVyU3VmZml4OiAnX2ZyYWdzJyxcclxuICAgIGZyYWdtZW50RmlsZUV4dGVuc2lvbjogJy5odG1sJyxcclxuICAgIGd1aWRlT3V0bGluZUZpbGVuYW1lOiAnb3V0bGluZS5odG1sJyxcclxuICAgIGd1aWRlUmVuZGVyQ29tbWVudFRhZzogJ3RzR3VpZGVSZW5kZXJDb21tZW50ICcsXHJcbiAgICBmcmFnbWVudFJlbmRlckNvbW1lbnRUYWc6ICd0c0ZyYWdtZW50UmVuZGVyQ29tbWVudCAnLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZpbGVDb25zdGFudHM7XHJcblxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IFJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuL2dIaXN0b3J5Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IHBhcnNlQW5kTG9hZEZyYWdtZW50ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbik6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPT4ge1xyXG5cclxuICAgIGlmICghcmF3RnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgIGxldCBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ11cclxuICAgIGxldCBjYWNoZSA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQgPSBuZXcgUmVuZGVyRnJhZ21lbnQocmF3RnJhZ21lbnQuaWQpO1xyXG4gICAgICAgIGNhY2hlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVGcmFnbWVudElEO1xyXG4gICAgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXSA9IGZyYWdtZW50O1xyXG5cclxuICAgIGdGcmFnbWVudENvZGUubG9hZEZyYWdtZW50KFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50XHJcbiAgICApO1xyXG5cclxuICAgIGlmIChjYWNoZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkT3B0aW9uID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhd09wdGlvbjogYW55LFxyXG4gICAgb3V0bGluZUZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbFxyXG4pOiBJUmVuZGVyRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChyYXdPcHRpb24uaWQpO1xyXG4gICAgb3B0aW9uLm9wdGlvbiA9IHJhd09wdGlvbi5vcHRpb24gPz8gJyc7XHJcbiAgICBvcHRpb24uaXNBbmNpbGxhcnkgPSByYXdPcHRpb24uaXNBbmNpbGxhcnkgPz8gZmFsc2U7XHJcbiAgICBvcHRpb24ub3JkZXIgPSByYXdPcHRpb24ub3JkZXIgPz8gMDtcclxuXHJcbiAgICBnRnJhZ21lbnRDb2RlLmluZGV4Q2hhaW5GcmFnbWVudChcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBvcHRpb25cclxuICAgICk7XHJcblxyXG4gICAgaWYgKG91dGxpbmVGcmFnbWVudCkge1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG91dGxpbmVPcHRpb24gb2Ygb3V0bGluZUZyYWdtZW50Lm8pIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChvdXRsaW5lT3B0aW9uLmYgPT09IG9wdGlvbi5pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVPcHRpb24uaTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X291dGxpbmVGcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZU9wdGlvbi5pXSA9IG9wdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9uO1xyXG59O1xyXG5cclxuY29uc3QgZ0ZyYWdtZW50Q29kZSA9IHtcclxuXHJcbiAgICBnZXRGcmFnbWVudEVsZW1lbnRJRDogKGZyYWdtZW50SUQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBgbnRfZnJfZnJhZ18ke2ZyYWdtZW50SUR9YDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2hhaW5GcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQgPz8gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEZyYWdtZW50RnJvbUNoYWluRnJhZ21lbnRzOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0bGluZUZyYWdtZW50SUQgPSBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShvdXRsaW5lRnJhZ21lbnRJRCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2FjaGVkZnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF07XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnRvcExldmVsTWFwS2V5ID0gY2FjaGVkZnJhZ21lbnQudG9wTGV2ZWxNYXBLZXk7XHJcbiAgICAgICAgZnJhZ21lbnQubWFwS2V5Q2hhaW4gPSBjYWNoZWRmcmFnbWVudC5tYXBLZXlDaGFpbjtcclxuICAgICAgICBmcmFnbWVudC5ndWlkZUlEID0gY2FjaGVkZnJhZ21lbnQuZ3VpZGVJRDtcclxuICAgICAgICBmcmFnbWVudC5ndWlkZVBhdGggPSBjYWNoZWRmcmFnbWVudC5ndWlkZVBhdGg7XHJcbiAgICAgICAgZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA9IGNhY2hlZGZyYWdtZW50LnBhcmVudEZyYWdtZW50SUQ7XHJcbiAgICAgICAgZnJhZ21lbnQudmFsdWUgPSBjYWNoZWRmcmFnbWVudC52YWx1ZTtcclxuICAgICAgICBmcmFnbWVudC51aS5kaXNjdXNzaW9uTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQub3B0aW9uID0gY2FjaGVkZnJhZ21lbnQub3B0aW9uO1xyXG4gICAgICAgIGZyYWdtZW50LmlzQW5jaWxsYXJ5ID0gY2FjaGVkZnJhZ21lbnQuaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgZnJhZ21lbnQub3JkZXIgPSBjYWNoZWRmcmFnbWVudC5vcmRlcjtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbjogSVJlbmRlckZyYWdtZW50O1xyXG5cclxuICAgICAgICBpZiAoY2FjaGVkZnJhZ21lbnQub3B0aW9uc1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KGNhY2hlZGZyYWdtZW50Lm9wdGlvbnMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnJhZ21lbnRPcHRpb24gb2YgY2FjaGVkZnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudE9wdGlvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24ub3B0aW9uID0gY2FjaGVkZnJhZ21lbnQub3B0aW9uO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLmlzQW5jaWxsYXJ5ID0gY2FjaGVkZnJhZ21lbnQuaXNBbmNpbGxhcnk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24ub3JkZXIgPSBjYWNoZWRmcmFnbWVudC5vcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5vcHRpb25zLnB1c2gob3B0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5kZXhDaGFpbkZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0bGluZUZyYWdtZW50SUQgPSBmcmFnbWVudC5vdXRsaW5lRnJhZ21lbnRJRCBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShvdXRsaW5lRnJhZ21lbnRJRCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW291dGxpbmVGcmFnbWVudElEXSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtvdXRsaW5lRnJhZ21lbnRJRF0gPSBmcmFnbWVudDtcclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2VBbmRMb2FkRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBzdHJpbmcsXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVJlbmRlckZyYWdtZW50IHwgbnVsbCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhd0ZyYWdtZW50ID0gZ0ZyYWdtZW50Q29kZS5wYXJzZUZyYWdtZW50KHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlQW5kTG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Um9vdE91dGxpbmVGcmFnbWVudElEOiAoc3RhdGU6IElTdGF0ZSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByb290ID0gc3RhdGUucmVuZGVyU3RhdGUucm9vdDtcclxuXHJcbiAgICAgICAgaWYgKCFyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG91dGxpbmVSb290ID0gc3RhdGUucmVuZGVyU3RhdGUub3V0bGluZT8ucjtcclxuXHJcbiAgICAgICAgaWYgKCFvdXRsaW5lUm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocm9vdC5pZCA9PT0gb3V0bGluZVJvb3QuZikge1xyXG5cclxuICAgICAgICAgICAgcm9vdC5vdXRsaW5lRnJhZ21lbnRJRCA9IG91dGxpbmVSb290Lmk7XHJcbiAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW3Jvb3Qub3V0bGluZUZyYWdtZW50SURdID0gcm9vdDtcclxuICAgICAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50ID0gcm9vdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHJvb3Qub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBvdXRsaW5lT3B0aW9uIG9mIG91dGxpbmVSb290Lm8pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3V0bGluZU9wdGlvbi5mID09PSBvcHRpb24uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLm91dGxpbmVGcmFnbWVudElEID0gb3V0bGluZU9wdGlvbi5pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW29wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRF0gPSBvcHRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZUFuZExvYWRSb290RnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJhd0ZyYWdtZW50OiBhbnksXHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFyYXdGcmFnbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IG5ldyBSZW5kZXJGcmFnbWVudChyYXdGcmFnbWVudC5pZCk7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUubG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUucm9vdCA9IGZyYWdtZW50O1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRChzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgcmF3RnJhZ21lbnQ6IGFueSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgZnJhZ21lbnQudG9wTGV2ZWxNYXBLZXkgPSByYXdGcmFnbWVudC50b3BMZXZlbE1hcEtleSA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5tYXBLZXlDaGFpbiA9IHJhd0ZyYWdtZW50Lm1hcEtleUNoYWluID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50Lmd1aWRlSUQgPSByYXdGcmFnbWVudC5ndWlkZUlEID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50Lmd1aWRlUGF0aCA9IHJhd0ZyYWdtZW50Lmd1aWRlUGF0aCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC5wYXJlbnRGcmFnbWVudElEID0gcmF3RnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRCA/PyAnJztcclxuICAgICAgICBmcmFnbWVudC52YWx1ZSA9IHJhd0ZyYWdtZW50LnZhbHVlID8/ICcnO1xyXG4gICAgICAgIGZyYWdtZW50LnZhbHVlID0gZnJhZ21lbnQudmFsdWUudHJpbSgpO1xyXG4gICAgICAgIGZyYWdtZW50LnVpLmRpc2N1c3Npb25Mb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgb3V0bGluZUZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghVS5pc051bGxPcldoaXRlU3BhY2UoZnJhZ21lbnQub3V0bGluZUZyYWdtZW50SUQpKSB7XHJcblxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50Lm91dGxpbmVGcmFnbWVudElEIGFzIHN0cmluZ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGlmIChyYXdGcmFnbWVudC5vcHRpb25zXHJcbiAgICAgICAgICAgICYmIEFycmF5LmlzQXJyYXkocmF3RnJhZ21lbnQub3B0aW9ucylcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByYXdPcHRpb24gb2YgcmF3RnJhZ21lbnQub3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdGlvbiA9IGxvYWRPcHRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmF3T3B0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5vcHRpb25zLnB1c2gob3B0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xvbmVGcmFnbWVudDogKGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQpOiBJUmVuZGVyRnJhZ21lbnQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudC5pZCk7XHJcbiAgICAgICAgY2xvbmUudG9wTGV2ZWxNYXBLZXkgPSBmcmFnbWVudC50b3BMZXZlbE1hcEtleTtcclxuICAgICAgICBjbG9uZS5tYXBLZXlDaGFpbiA9IGZyYWdtZW50Lm1hcEtleUNoYWluO1xyXG4gICAgICAgIGNsb25lLmd1aWRlSUQgPSBmcmFnbWVudC5ndWlkZUlEO1xyXG4gICAgICAgIGNsb25lLmd1aWRlUGF0aCA9IGZyYWdtZW50Lmd1aWRlUGF0aDtcclxuICAgICAgICBjbG9uZS5wYXJlbnRGcmFnbWVudElEID0gZnJhZ21lbnQucGFyZW50RnJhZ21lbnRJRDtcclxuICAgICAgICBjbG9uZS52YWx1ZSA9IGZyYWdtZW50LnZhbHVlO1xyXG4gICAgICAgIGNsb25lLnVpLmRpc2N1c3Npb25Mb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjbG9uZS5vcHRpb24gPSBmcmFnbWVudC5vcHRpb247XHJcbiAgICAgICAgY2xvbmUuaXNBbmNpbGxhcnkgPSBmcmFnbWVudC5pc0FuY2lsbGFyeTtcclxuICAgICAgICBjbG9uZS5vcmRlciA9IGZyYWdtZW50Lm9yZGVyO1xyXG5cclxuICAgICAgICBsZXQgY2xvbmVPcHRpb246IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgaWYgKGZyYWdtZW50Lm9wdGlvbnNcclxuICAgICAgICAgICAgJiYgQXJyYXkuaXNBcnJheShmcmFnbWVudC5vcHRpb25zKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZyYWdtZW50T3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbiA9IG5ldyBSZW5kZXJGcmFnbWVudChmcmFnbWVudE9wdGlvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbi5vcHRpb24gPSBmcmFnbWVudE9wdGlvbi5vcHRpb247XHJcbiAgICAgICAgICAgICAgICBjbG9uZU9wdGlvbi5pc0FuY2lsbGFyeSA9IGZyYWdtZW50T3B0aW9uLmlzQW5jaWxsYXJ5O1xyXG4gICAgICAgICAgICAgICAgY2xvbmVPcHRpb24ub3JkZXIgPSBmcmFnbWVudE9wdGlvbi5vcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjbG9uZS5vcHRpb25zLnB1c2goY2xvbmVPcHRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlRnJhZ21lbnQ6IChyZXNwb25zZTogc3RyaW5nKTogYW55ID0+IHtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cXFwibW9kdWxlXFxcIiBzcmM9XFxcIi9Adml0ZS9jbGllbnRcXFwiPjwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgPCEtLSB0c0ZyYWdtZW50UmVuZGVyQ29tbWVudCB7XFxcIm5vZGVcXFwiOntcXFwiaWRcXFwiOlxcXCJkQnQ3S20yTWxcXFwiLFxcXCJ0b3BMZXZlbE1hcEtleVxcXCI6XFxcImN2MVRSbDAxcmZcXFwiLFxcXCJtYXBLZXlDaGFpblxcXCI6XFxcImN2MVRSbDAxcmZcXFwiLFxcXCJndWlkZUlEXFxcIjpcXFwiZEJ0N0pOMUhlXFxcIixcXFwiZ3VpZGVQYXRoXFxcIjpcXFwiYzovR2l0SHViL0hBTC5Eb2N1bWVudGF0aW9uL3RzbWFwc1Rlc3QvVGVzdE9wdGlvbnNGb2xkZXIvSG9sZGVyL1Rlc3RPcHRpb25zLnRzbWFwXFxcIixcXFwicGFyZW50RnJhZ21lbnRJRFxcXCI6XFxcImRCdDdKTjF2dFxcXCIsXFxcImNoYXJ0S2V5XFxcIjpcXFwiY3YxVFJsMDFyZlxcXCIsXFxcIm9wdGlvbnNcXFwiOltdfX0gLS0+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxoNCBpZD1cXFwib3B0aW9uLTEtc29sdXRpb25cXFwiPk9wdGlvbiAxIHNvbHV0aW9uPC9oND5cclxuICAgICAgICAgICAgICAgIDxwPk9wdGlvbiAxIHNvbHV0aW9uPC9wPlxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gcmVzcG9uc2Uuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbW1lbnRTdGFydCA9IGA8IS0tICR7Z0ZpbGVDb25zdGFudHMuZnJhZ21lbnRSZW5kZXJDb21tZW50VGFnfWA7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQ29tbWVudEVuZCA9IGAgLS0+YDtcclxuICAgICAgICBsZXQgZnJhZ21lbnRSZW5kZXJDb21tZW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBsZXQgbGluZTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBidWlsZFZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChidWlsZFZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBgJHt2YWx1ZX1cclxuJHtsaW5lfWA7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aChyZW5kZXJDb21tZW50U3RhcnQpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gbGluZS5zdWJzdHJpbmcocmVuZGVyQ29tbWVudFN0YXJ0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBidWlsZFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFmcmFnbWVudFJlbmRlckNvbW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gZnJhZ21lbnRSZW5kZXJDb21tZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKGZyYWdtZW50UmVuZGVyQ29tbWVudC5lbmRzV2l0aChyZW5kZXJDb21tZW50RW5kKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gZnJhZ21lbnRSZW5kZXJDb21tZW50Lmxlbmd0aCAtIHJlbmRlckNvbW1lbnRFbmQubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgZnJhZ21lbnRSZW5kZXJDb21tZW50ID0gZnJhZ21lbnRSZW5kZXJDb21tZW50LnN1YnN0cmluZyhcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBsZW5ndGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZyYWdtZW50UmVuZGVyQ29tbWVudCA9IGZyYWdtZW50UmVuZGVyQ29tbWVudC50cmltKCk7XHJcbiAgICAgICAgbGV0IHJhd0ZyYWdtZW50OiBhbnkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmF3RnJhZ21lbnQgPSBKU09OLnBhcnNlKGZyYWdtZW50UmVuZGVyQ29tbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RnJhZ21lbnQudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJhd0ZyYWdtZW50O1xyXG4gICAgfSxcclxuXHJcbiAgICBtYXJrT3B0aW9uc0V4cGFuZGVkOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudDogSVJlbmRlckZyYWdtZW50XHJcbiAgICApOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5yZXNldEZyYWdtZW50VWlzKHN0YXRlKTtcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5vcHRpb25zRXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIGZyYWdtZW50LnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY29sbGFwc2VGcmFnbWVudHNPcHRpb25zOiAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWZyYWdtZW50XHJcbiAgICAgICAgICAgIHx8IGZyYWdtZW50Lm9wdGlvbnMubGVuZ3RoID09PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbi51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZXhwYW5kT3B0aW9uOiAoXHJcbiAgICAgICAgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBvcHRpb246IElSZW5kZXJGcmFnbWVudFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuY29sbGFwc2VGcmFnbWVudHNPcHRpb25zKGZyYWdtZW50KTtcclxuICAgICAgICBvcHRpb24udWkuZnJhZ21lbnRPcHRpb25zRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgICAgICBmcmFnbWVudC5zZWxlY3RlZCA9IG9wdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRGcmFnbWVudFVpczogKHN0YXRlOiBJU3RhdGUpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuICAgICAgICBsZXQgZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBmcmFnbWVudElEIGluIGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEKSB7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudCA9IGluZGV4X2NoYWluRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50SURdO1xyXG4gICAgICAgICAgICBnRnJhZ21lbnRDb2RlLnJlc2V0RnJhZ21lbnRVaShmcmFnbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldEZyYWdtZW50VWk6IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGZyYWdtZW50LnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEN1cnJlbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhcmVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgICAgIGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBwYXJlbnQuc2VsZWN0ZWQgPSBmcmFnbWVudDtcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnQgPSBmcmFnbWVudDtcclxuICAgICAgICBnSGlzdG9yeUNvZGUucHVzaEJyb3dzZXJIaXN0b3J5U3RhdGUoc3RhdGUpO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdGcmFnbWVudENvZGU7XHJcblxyXG4iLCJcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IHsgSUh0dHBGZXRjaEl0ZW0gfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwRmV0Y2hJdGVtXCI7XHJcbmltcG9ydCB7IGdBdXRoZW50aWNhdGVkSHR0cCB9IGZyb20gXCIuLi9odHRwL2dBdXRoZW50aWNhdGlvbkh0dHBcIjtcclxuaW1wb3J0IGdBamF4SGVhZGVyQ29kZSBmcm9tIFwiLi4vaHR0cC9nQWpheEhlYWRlckNvZGVcIjtcclxuaW1wb3J0IGdGcmFnbWVudEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuXHJcblxyXG5jb25zdCBnZXRGcmFnbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBmcmFnbWVudElEOiBzdHJpbmcsXHJcbiAgICBmcmFnbWVudFBhdGg6IHN0cmluZyxcclxuICAgIGFjdGlvbjogQWN0aW9uVHlwZSxcclxuICAgIGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhbGxJRDogc3RyaW5nID0gVS5nZW5lcmF0ZUd1aWQoKTtcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IGdBamF4SGVhZGVyQ29kZS5idWlsZEhlYWRlcnMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgY2FsbElELFxyXG4gICAgICAgIGFjdGlvblxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjb25zdCBwYXRoOiBzdHJpbmcgPSBgU3RlcC8ke3N0ZXBJRH1gO1xyXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBgJHtmcmFnbWVudFBhdGh9YDtcclxuXHJcbiAgICByZXR1cm4gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBwYXJzZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzcG9uc2U6ICd0ZXh0JyxcclxuICAgICAgICBhY3Rpb246IGxvYWRBY3Rpb24sXHJcbiAgICAgICAgZXJyb3I6IChzdGF0ZTogSVN0YXRlLCBlcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIkVycm9yIGdldHRpbmcgZnJhZ21lbnQgZnJvbSB0aGUgc2VydmVyLCBwYXRoOiAke2ZyYWdtZW50UGF0aH0sIGlkOiAke2ZyYWdtZW50SUR9XCIsXHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiAke3VybH0sXHJcbiAgICAgICAgICAgICAgICBcImVycm9yIERldGFpbHNcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMpfSxcclxuICAgICAgICAgICAgICAgIFwic3RhY2tcIjogJHtKU09OLnN0cmluZ2lmeShlcnJvckRldGFpbHMuc3RhY2spfSxcclxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6ICR7Z2V0RnJhZ21lbnQubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnRnJhZ21lbnRFZmZlY3RzID0ge1xyXG5cclxuICAgIC8vIGdldFJvb3RTdGVwOiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICByb290SUQ6IHN0cmluZyk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ2V0U3RlcChcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIHJvb3RJRCxcclxuICAgIC8vICAgICAgICAgJzAnLFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFJvb3QsXHJcbiAgICAvLyAgICAgICAgIGdTdGVwQWN0aW9ucy5sb2FkUm9vdFN0ZXBcclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBnZXRGcmFnbWVudDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgZnJhZ21lbnRQYXRoOiBzdHJpbmdcclxuICAgICk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZEFjdGlvbjogKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IElTdGF0ZUFueUFycmF5ID0gKHN0YXRlOiBJU3RhdGUsIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnRnJhZ21lbnRBY3Rpb25zLmxvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICBvcHRpb24uaWQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5HZXRGcmFnbWVudCxcclxuICAgICAgICAgICAgbG9hZEFjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50SUQ6IHN0cmluZyxcclxuICAgICAgICBmcmFnbWVudFBhdGg6IHN0cmluZyxcclxuICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRDogc3RyaW5nXHJcbiAgICApOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRBY3Rpb246IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheSA9IChzdGF0ZTogSVN0YXRlLCByZXNwb25zZTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZ0ZyYWdtZW50QWN0aW9ucy5sb2FkQ2hhaW5GcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50SUQsXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCxcclxuICAgICAgICAgICAgQWN0aW9uVHlwZS5HZXRDaGFpbkZyYWdtZW50LFxyXG4gICAgICAgICAgICBsb2FkQWN0aW9uXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZ2V0QW5jaWxsYXJ5OiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBzdGVwSUQ6IHN0cmluZyxcclxuICAgIC8vICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgdWlJRDogbnVtYmVyKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgY29uc3QgY2hhaW5SZXNwb25zZSA9IHtcclxuICAgIC8vICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgLy8gICAgICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgICAgIHVpSURcclxuICAgIC8vICAgICAgICAgfTtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMubG9hZEFuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgLy8gICAgICAgICApO1xyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgc3RlcElELFxyXG4gICAgLy8gICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAvLyAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICAvLyBnZXRBbmNpbGxhcnlTdGVwOiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBzdGVwSUQ6IHN0cmluZyxcclxuICAgIC8vICAgICBwYXJlbnRDaGFpbklEOiBzdHJpbmcsXHJcbiAgICAvLyAgICAgdWlJRDogbnVtYmVyKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBsb2FkQWN0aW9uOiAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4gSVN0YXRlQW55QXJyYXkgPSAoc3RhdGU6IElTdGF0ZSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgY29uc3QgY2hhaW5SZXNwb25zZSA9IHtcclxuICAgIC8vICAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgLy8gICAgICAgICAgICAgcGFyZW50Q2hhaW5JRCxcclxuICAgIC8vICAgICAgICAgICAgIHVpSURcclxuICAgIC8vICAgICAgICAgfTtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBnU3RlcEFjdGlvbnMubG9hZEFuY2lsbGFyeUNoYWluU3RlcChcclxuICAgIC8vICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgLy8gICAgICAgICAgICAgY2hhaW5SZXNwb25zZVxyXG4gICAgLy8gICAgICAgICApO1xyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnZXRTdGVwKFxyXG4gICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgIC8vICAgICAgICAgc3RlcElELFxyXG4gICAgLy8gICAgICAgICBwYXJlbnRDaGFpbklELFxyXG4gICAgLy8gICAgICAgICBBY3Rpb25UeXBlLkdldFN0ZXAsXHJcbiAgICAvLyAgICAgICAgIGxvYWRBY3Rpb25cclxuICAgIC8vICAgICApO1xyXG4gICAgLy8gfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ0ZyYWdtZW50RWZmZWN0cztcclxuIiwiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgZ0ZyYWdtZW50Q29kZSBmcm9tIFwiLi4vY29kZS9nRnJhZ21lbnRDb2RlXCI7XHJcbmltcG9ydCBnU3RhdGVDb2RlIGZyb20gXCIuLi9jb2RlL2dTdGF0ZUNvZGVcIjtcclxuaW1wb3J0IGdGcmFnbWVudEVmZmVjdHMgZnJvbSBcIi4uL2VmZmVjdHMvZ0ZyYWdtZW50RWZmZWN0c1wiO1xyXG5pbXBvcnQgZ0ZpbGVDb25zdGFudHMgZnJvbSBcIi4uL2dGaWxlQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBnSHRtbEFjdGlvbnMgZnJvbSBcIi4vZ0h0bWxBY3Rpb25zXCI7XHJcblxyXG5cclxuY29uc3QgZ0ZyYWdtZW50QWN0aW9ucyA9IHtcclxuXHJcbiAgICBleHBhbmRPcHRpb246IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQsXHJcbiAgICAgICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUubWFya09wdGlvbnNFeHBhbmRlZChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG9wdGlvblxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGdGcmFnbWVudENvZGUuc2V0Q3VycmVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHBhcmVudEZyYWdtZW50LFxyXG4gICAgICAgICAgICBvcHRpb25cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9uLnVpLmRpc2N1c3Npb25Mb2FkZWQgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5zY3JlZW4uaGlkZUJhbm5lciA9IHRydWU7XHJcbiAgICAgICAgZ0h0bWxBY3Rpb25zLmNoZWNrQW5kU2Nyb2xsVG9Ub3Aoc3RhdGUpO1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50UGF0aCA9IGAke3N0YXRlLnJlbmRlclN0YXRlLmd1aWRlPy5mcmFnbWVudEZvbGRlclVybH0vJHtvcHRpb24uaWR9JHtnRmlsZUNvbnN0YW50cy5mcmFnbWVudEZpbGVFeHRlbnNpb259YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGdGcmFnbWVudEVmZmVjdHMuZ2V0RnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbixcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50UGF0aFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZEZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICByZXNwb25zZTogYW55LFxyXG4gICAgICAgIG9wdGlvbjogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8IFUuaXNOdWxsT3JXaGl0ZVNwYWNlKG9wdGlvbi5vdXRsaW5lRnJhZ21lbnRJRClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ0ZyYWdtZW50Q29kZS5wYXJzZUFuZExvYWRGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnRleHREYXRhLFxyXG4gICAgICAgICAgICBvcHRpb24ub3V0bGluZUZyYWdtZW50SUQgYXMgc3RyaW5nXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZENoYWluRnJhZ21lbnQ6IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlOiBhbnksXHJcbiAgICAgICAgb3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlXHJcbiAgICAgICAgICAgIHx8ICFzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnBhcnNlQW5kTG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2UudGV4dERhdGEsXHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cyA9IHN0YXRlLnJlbmRlclN0YXRlLmxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHM7XHJcblxyXG4gICAgICAgIGlmIChsb2FkaW5nQ2hhaW5DYWNoZV9PdXRsaW5lRnJhZ21lbnRzKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0T3V0bGluZUZyYWdtZW50ID0gbG9hZGluZ0NoYWluQ2FjaGVfT3V0bGluZUZyYWdtZW50cy5hdCgtMSkgPz8gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXh0T3V0bGluZUZyYWdtZW50KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50RnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5jdXJyZW50RnJhZ21lbnQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZE9wdGlvbjogSVJlbmRlckZyYWdtZW50ID0gc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbbmV4dE91dGxpbmVGcmFnbWVudC5pXTtcclxuICAgICAgICAgICAgICAgIGV4cGFuZGVkT3B0aW9uLnVpLmZyYWdtZW50T3B0aW9uc0V4cGFuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBnRnJhZ21lbnRDb2RlLmV4cGFuZE9wdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE9wdGlvblxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnRnJhZ21lbnRDb2RlLnNldEN1cnJlbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUucmVuZGVyU3RhdGUuY3VycmVudEZyYWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkT3B0aW9uXHJcbiAgICAgICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICBNYWtlIHN1cmUgc3libGluZ3MgYXJlIGNvbGxhcHNlZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICBNYWtlIHN1cmUgaXQgaXMgYWRkZWQgdG8gdGhlIHJvb3QgY2hhaW4hISFcclxuICAgICAgICAgICAgICAgIC8vICAgICAgQ2hlY2sgd2h5IGl0IGlzbid0IGRyYXdpbmdcclxuXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ1N0YXRlQ29kZS5jbG9uZVN0YXRlKHN0YXRlKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnRnJhZ21lbnRBY3Rpb25zO1xyXG4iLCJpbXBvcnQgZ0ZyYWdtZW50QWN0aW9ucyBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL2FjdGlvbnMvZ0ZyYWdtZW50QWN0aW9uc1wiO1xyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVN0YXRlQW55QXJyYXkgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlQW55QXJyYXlcIjtcclxuaW1wb3J0IElGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSUZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuXHJcbmNvbnN0IGZyYWdtZW50QWN0aW9ucyA9IHtcclxuXHJcbiAgICAvLyB1c2VyX2V4cGFuZEFuY2lsbGFyeU9wdGlvbjogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgY2hhaW5QYXlsb2FkOiBJQ2hhaW5TdGVwUGF5bG9hZCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAvLyAgICAgaWYgKCFzdGF0ZSkge1xyXG5cclxuICAgIC8vICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICBzdGF0ZS50b3BpY1N0YXRlLnVpLnJhdyA9IGZhbHNlO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZ1N0ZXBBY3Rpb25zLmV4cGFuZEFuY2lsbGFyeU9wdGlvbihcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGNoYWluUGF5bG9hZFxyXG4gICAgLy8gICAgIClcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gdXNlcl9zaG93QW5jaWxsYXJ5OiAoXHJcbiAgICAvLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIC8vICAgICBjaGFpblBheWxvYWQ6IElDaGFpblN0ZXBQYXlsb2FkKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIC8vICAgICBpZiAoIXN0YXRlKSB7XHJcblxyXG4gICAgLy8gICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIHN0YXRlLnRvcGljU3RhdGUudWkucmF3ID0gZmFsc2U7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBnU3RlcEFjdGlvbnMuc2hvd0FuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGNoYWluUGF5bG9hZFxyXG4gICAgLy8gICAgIClcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gdXNlcl9jb2xsYXBzZUFuY2lsbGFyeTogKFxyXG4gICAgLy8gICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAvLyAgICAgYW5jaWxsYXJ5Q2FjaGU6IElTdGVwQ2FjaGUpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmICghc3RhdGUpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgc3RhdGUudG9waWNTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGdTdGVwQWN0aW9ucy5jb2xsYXBzZUFuY2lsbGFyeShcclxuICAgIC8vICAgICAgICAgc3RhdGUsXHJcbiAgICAvLyAgICAgICAgIGFuY2lsbGFyeUNhY2hlXHJcbiAgICAvLyAgICAgKVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICB1c2VyRXhwYW5kT3B0aW9uOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBwYXlsb2FkOiBJRnJhZ21lbnRQYXlsb2FkXHJcbiAgICApOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGVcclxuICAgICAgICAgICAgfHwgIXBheWxvYWQ/LnBhcmVudEZyYWdtZW50XHJcbiAgICAgICAgICAgIHx8ICFwYXlsb2FkPy5vcHRpb25cclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGF0ZS5yZW5kZXJTdGF0ZS51aS5yYXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdGcmFnbWVudEFjdGlvbnMuZXhwYW5kT3B0aW9uKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgcGF5bG9hZC5wYXJlbnRGcmFnbWVudCxcclxuICAgICAgICAgICAgcGF5bG9hZC5vcHRpb25cclxuICAgICAgICApXHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmcmFnbWVudEFjdGlvbnM7XHJcbiIsImltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSUZyYWdtZW50UGF5bG9hZCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JRnJhZ21lbnRQYXlsb2FkXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJhZ21lbnRQYXlsb2FkIGltcGxlbWVudHMgSUZyYWdtZW50UGF5bG9hZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGFyZW50RnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCxcclxuICAgICAgICBvcHRpb246IElSZW5kZXJGcmFnbWVudFxyXG4gICAgICAgICkge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudEZyYWdtZW50ID0gcGFyZW50RnJhZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5vcHRpb24gPSBvcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhcmVudEZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcbiAgICBwdWJsaWMgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hpbGRyZW4sIFZOb2RlIH0gZnJvbSBcImh5cGVyLWFwcC1sb2NhbFwiO1xyXG5pbXBvcnQgeyBoIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2h5cGVyQXBwL2h5cGVyLWFwcC1sb2NhbFwiO1xyXG5cclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBmcmFnbWVudEFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZnJhZ21lbnRBY3Rpb25zXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nRnJhZ21lbnRDb2RlXCI7XHJcbmltcG9ydCBGcmFnbWVudFBheWxvYWQgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL3VpL3BheWxvYWRzL0ZyYWdtZW50UGF5bG9hZFwiO1xyXG5cclxuaW1wb3J0IFwiLi4vc2Nzcy9mcmFnbWVudHMuc2Nzc1wiO1xyXG5cclxuXHJcbmNvbnN0IEJ1aWxkT3B0aW9uVmlldyA9IChcclxuICAgIHBhcmVudDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgb3B0aW9uOiBJUmVuZGVyRnJhZ21lbnRcclxuKTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIW9wdGlvblxyXG4gICAgICAgIHx8IG9wdGlvbi5pc0FuY2lsbGFyeSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogXCJvcHRpb24tYm94XCIgfSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgaChcImFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRBY3Rpb25zLnVzZXJFeHBhbmRPcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2V2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWdtZW50UGF5bG9hZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuXCIsIHt9LCBvcHRpb24ub3B0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn1cclxuXHJcbmNvbnN0IGJ1aWxkRXhwYW5kZWRPcHRpb25zVmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCBvcHRpb25WaWV3czogQ2hpbGRyZW5bXSA9IFtdO1xyXG4gICAgbGV0IG9wdGlvblZldzogVk5vZGUgfCBudWxsO1xyXG5cclxuICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGZyYWdtZW50Lm9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgb3B0aW9uVmV3ID0gQnVpbGRPcHRpb25WaWV3KFxyXG4gICAgICAgICAgICBmcmFnbWVudCxcclxuICAgICAgICAgICAgb3B0aW9uXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvblZldykge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uVmlld3MucHVzaChvcHRpb25WZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogYG50LWZyLWZyYWdtZW50LW9wdGlvbnNgIH0sIFtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvblZpZXdzXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZENvbGxhcHNlZE9wdGlvbnNWaWV3ID0gKF9mcmFnbWVudDogSVJlbmRlckZyYWdtZW50KTogVk5vZGUgfCBudWxsID0+IHtcclxuXHJcbiAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgIGgoXCJkaXZcIiwgeyBjbGFzczogYG50LWZyLWZyYWdtZW50LW9wdGlvbnNgIH0sIFtcclxuICAgICAgICAgICAgaChcImgxXCIsIHt9LCBcIk9wdGlvbnNcIilcclxuICAgICAgICBdKTtcclxuXHJcbiAgICByZXR1cm4gdmlldztcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkT3B0aW9uc1ZpZXcgPSAoZnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCk6IFZOb2RlIHwgbnVsbCA9PiB7XHJcblxyXG4gICAgaWYgKCFmcmFnbWVudC5vcHRpb25zXHJcbiAgICAgICAgfHwgZnJhZ21lbnQub3B0aW9ucy5sZW5ndGggPT09IDBcclxuICAgICkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmcmFnbWVudC5zZWxlY3RlZFxyXG4gICAgICAgICYmICFmcmFnbWVudC51aS5mcmFnbWVudE9wdGlvbnNFeHBhbmRlZCkge1xyXG5cclxuICAgICAgICByZXR1cm4gYnVpbGRDb2xsYXBzZWRPcHRpb25zVmlldyhmcmFnbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWxkRXhwYW5kZWRPcHRpb25zVmlldyhmcmFnbWVudCk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZEZyYWdtZW50VmlldyA9IChmcmFnbWVudDogSVJlbmRlckZyYWdtZW50IHwgbnVsbCk6IENoaWxkcmVuW10gPT4ge1xyXG5cclxuICAgIGlmICghZnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZyYWdtZW50RUxlbWVudElEID0gZ0ZyYWdtZW50Q29kZS5nZXRGcmFnbWVudEVsZW1lbnRJRChmcmFnbWVudC5pZCk7XHJcblxyXG4gICAgY29uc3QgdmlldzogQ2hpbGRyZW5bXSA9IFtcclxuXHJcbiAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogYCR7ZnJhZ21lbnRFTGVtZW50SUR9YCxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcIm50LWZyLWZyYWdtZW50LWJveFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBgbnQtZnItZnJhZ21lbnQtZGlzY3Vzc2lvbmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1kaXNjdXNzaW9uXCI6IGZyYWdtZW50LnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIlwiXHJcbiAgICAgICAgICAgICAgICApLFxyXG5cclxuICAgICAgICAgICAgICAgIGJ1aWxkT3B0aW9uc1ZpZXcoZnJhZ21lbnQpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApLFxyXG5cclxuICAgICAgICBidWlsZEZyYWdtZW50VmlldyhmcmFnbWVudC5zZWxlY3RlZClcclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIHZpZXc7XHJcbn07XHJcblxyXG5jb25zdCBmcmFnbWVudFZpZXdzID0ge1xyXG5cclxuICAgIGJ1aWxkQ29udGVudFZpZXc6IChzdGF0ZTogSVN0YXRlKTogVk5vZGUgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsIHsgaWQ6IFwibnRfZnJfRnJhZ21lbnRzXCIgfSwgW1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1aWxkRnJhZ21lbnRWaWV3KHN0YXRlLnJlbmRlclN0YXRlLnJvb3QpXHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZyYWdtZW50Vmlld3M7XHJcblxyXG5cclxuIiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiaHlwZXItYXBwLWxvY2FsXCI7XHJcbmltcG9ydCB7IGggfSBmcm9tIFwiLi4vLi4vLi4vLi4vaHlwZXJBcHAvaHlwZXItYXBwLWxvY2FsXCI7XHJcblxyXG5pbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5cclxuaW1wb3J0IFwiLi4vc2Nzcy9pbmRleC5zY3NzXCI7XHJcblxyXG5cclxuY29uc3QgZXJyb3JWaWV3cyA9IHtcclxuXHJcbiAgICBidWlsZEdlbmVyaWNFcnJvcjogKF9zdGF0ZTogSVN0YXRlKTogVk5vZGUgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsIHsgaWQ6ICdlcnJvcicgfSwgW1xyXG4gICAgICAgICAgICAgICAgaChcImgzXCIse30sIFwiU29ycnkgYnV0IHRoZSB1cmwgeW91IHJlcXVlc3RlZCBjYW4ndCBiZSBmb3VuZC5cIiApLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGVycm9yVmlld3M7XHJcblxyXG4iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCJoeXBlci1hcHAtbG9jYWxcIjtcclxuaW1wb3J0IHsgaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcclxuXHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBpbml0QWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9ucy9pbml0QWN0aW9uc1wiO1xyXG5pbXBvcnQgZnJhZ21lbnRWaWV3cyBmcm9tIFwiLi4vLi4vZnJhZ21lbnRzL3ZpZXdzL2ZyYWdtZW50Vmlld3NcIjtcclxuaW1wb3J0IGVycm9yVmlld3MgZnJvbSBcIi4uLy4uL2Vycm9yL3ZpZXdzL2Vycm9yVmlld3NcIjtcclxuXHJcbmltcG9ydCBcIi4uL3Njc3MvaW5pdC5zY3NzXCI7XHJcblxyXG5cclxuY29uc3QgaW5pdFZpZXcgPSB7XHJcblxyXG4gICAgYnVpbGRWaWV3OiAoc3RhdGU6IElTdGF0ZSk6IFZOb2RlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlLmdlbmVyaWNFcnJvciA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVycm9yVmlld3MuYnVpbGRHZW5lcmljRXJyb3Ioc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKHN0YXRlLnVzZXJcclxuICAgICAgICAvLyAgICAgJiYgIXN0YXRlPy51c2VyPy51c2VWc0NvZGVcclxuICAgICAgICAvLyAgICAgJiYgIXN0YXRlPy51c2VyPy5hdXRob3Jpc2VkKSB7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gbG9naW5WaWV3LmJ1aWxkVmlldyhzdGF0ZSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBjb25zdCB2aWV3OiBWTm9kZSA9XHJcblxyXG4gICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogaW5pdEFjdGlvbnMuc2V0Tm90UmF3LFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInRyZWVTb2x2ZUZyYWdtZW50c1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1haW5WaWV3cy5idWlsZENvbnRlbnRWaWV3KHN0YXRlKSxcclxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudFZpZXdzLmJ1aWxkQ29udGVudFZpZXcoc3RhdGUpLFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdFZpZXc7XHJcblxyXG4iLCJpbXBvcnQgSVNldHRpbmdzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVNldHRpbmdzXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3MgaW1wbGVtZW50cyBJU2V0dGluZ3Mge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9IFwiLTFcIjtcclxuICAgIHB1YmxpYyByOiBzdHJpbmcgPSBcIi0xXCI7XHJcblxyXG4gICAgLy8gQXV0aGVudGljYXRpb25cclxuICAgIHB1YmxpYyB1c2VyUGF0aDogc3RyaW5nID0gYHVzZXJgO1xyXG4gICAgcHVibGljIGRlZmF1bHRMb2dvdXRQYXRoOiBzdHJpbmcgPSBgbG9nb3V0YDtcclxuICAgIHB1YmxpYyBkZWZhdWx0TG9naW5QYXRoOiBzdHJpbmcgPSBgbG9naW5gO1xyXG4gICAgcHVibGljIHJldHVyblVybFN0YXJ0OiBzdHJpbmcgPSBgcmV0dXJuVXJsYDtcclxuXHJcbiAgICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZyA9ICh3aW5kb3cgYXMgYW55KS5BU1NJU1RBTlRfQkFTRV9VUkwgPz8gJyc7XHJcbiAgICBwdWJsaWMgbGlua1VybDogc3RyaW5nID0gKHdpbmRvdyBhcyBhbnkpLkFTU0lTVEFOVF9MSU5LX1VSTCA/PyAnJztcclxuICAgIHB1YmxpYyBzdWJzY3JpcHRpb25JRDogc3RyaW5nID0gKHdpbmRvdyBhcyBhbnkpLkFTU0lTVEFOVF9TVUJTQ1JJUFRJT05fSUQgPz8gJyc7XHJcblxyXG4gICAgcHVibGljIGFwaVVybDogc3RyaW5nID0gYCR7dGhpcy5iYXNlVXJsfS9hcGlgO1xyXG4gICAgcHVibGljIGJmZlVybDogc3RyaW5nID0gYCR7dGhpcy5iYXNlVXJsfS9iZmZgO1xyXG4gICAgcHVibGljIGZpbGVVcmw6IHN0cmluZyA9IGAke3RoaXMuYmFzZVVybH0vZmlsZWA7XHJcbn1cclxuIiwiaW1wb3J0IElQYWdpbmF0aW9uRGV0YWlscyBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9wYXlsb2Fkcy9JUGFnaW5hdGlvbkRldGFpbHNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdpbmF0aW9uRGV0YWlscyBpbXBsZW1lbnRzIElQYWdpbmF0aW9uRGV0YWlscyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcclxuICAgICAgICBjb3VudDogbnVtYmVyLFxyXG4gICAgICAgIHRvdGFsSXRlbXM6IG51bWJlcikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IHRvdGFsSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY291bnQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbEl0ZW1zOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IFBhZ2luYXRpb25EZXRhaWxzIGZyb20gXCIuL3VpL3BheWxvYWRzL1BhZ2luYXRpb25EZXRhaWxzXCI7XHJcbmltcG9ydCBJUGFnaW5hdGlvbkRldGFpbHMgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdWkvcGF5bG9hZHMvSVBhZ2luYXRpb25EZXRhaWxzXCI7XHJcbmltcG9ydCBJVG9waWNzU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVRvcGljc1N0YXRlXCI7XHJcbmltcG9ydCBJVG9waWMgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9waWNzU3RhdGUgaW1wbGVtZW50cyBJVG9waWNzU3RhdGUge1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRJRDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBxdWV1ZWRLZXk6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgdG9waWNzOiBBcnJheTxJVG9waWM+ID0gW107XHJcbiAgICBwdWJsaWMgdG9waWNDb3VudDogbnVtYmVyID0gMDtcclxuICAgIFxyXG4gICAgcHVibGljIHBhZ2luYXRpb25EZXRhaWxzOiBJUGFnaW5hdGlvbkRldGFpbHMgPSBuZXcgUGFnaW5hdGlvbkRldGFpbHMoXHJcbiAgICAgICAgMCxcclxuICAgICAgICAxMCxcclxuICAgICAgICAwXHJcbiAgICApO1xyXG59XHJcbiIsImltcG9ydCBJVG9waWNTY2VuZVVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lUb3BpY1NjZW5lVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpY1NjZW5lVUkgaW1wbGVtZW50cyBJVG9waWNTY2VuZVVJIHtcclxuXHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxufVxyXG4iLCJpbXBvcnQgSVN0ZXBDYWNoZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS90b3BpYy9JU3RlcENhY2hlXCI7XHJcbmltcG9ydCBJVG9waWNTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JVG9waWNTdGF0ZVwiO1xyXG5pbXBvcnQgSVRvcGljQ2FjaGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdG9waWMvSVRvcGljQ2FjaGVcIjtcclxuaW1wb3J0IElBcnRpY2xlU2NlbmUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvaGlzdG9yeS9JQXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBJVG9waWNTY2VuZVVJIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lUb3BpY1NjZW5lVUlcIjtcclxuaW1wb3J0IFRvcGljU2NlbmVVSSBmcm9tIFwiLi91aS9Ub3BpY1NjZW5lVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BpY1N0YXRlIGltcGxlbWVudHMgSVRvcGljU3RhdGUge1xyXG5cclxuICAgIHB1YmxpYyB0b3BpY0NhY2hlOiBJVG9waWNDYWNoZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyZWRTdGVwczogQXJyYXk8SVN0ZXBDYWNoZT4gPSBbXTtcclxuICAgIHB1YmxpYyBjdXJyZW50U3RlcDogSVN0ZXBDYWNoZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpc0FydGljbGVWaWV3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBhcnRpY2xlU2NlbmU6IElBcnRpY2xlU2NlbmUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnaG9zdEFydGljbGVTY2VuZTogSUFydGljbGVTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGFuY2lsbGFyeUV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgb3B0aW9uRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgcHVibGljIHVpOiBJVG9waWNTY2VuZVVJID0gbmV3IFRvcGljU2NlbmVVSSgpO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBuYXZpZ2F0aW9uRGlyZWN0aW9uIHtcclxuXHJcbiAgICBCdXR0b25zID0gJ2J1dHRvbnMnLFxyXG4gICAgQmFja3dhcmRzID0gJ2JhY2t3YXJkcycsXHJcbiAgICBGb3J3YXJkcyA9ICdmb3J3YXJkcydcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgbmF2aWdhdGlvbkRpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL25hdmlnYXRpb25EaXJlY3Rpb25cIjtcclxuaW1wb3J0IElIaXN0b3J5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlcIjtcclxuaW1wb3J0IElIaXN0b3J5VXJsIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlVcmxcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaXN0b3J5IGltcGxlbWVudHMgSUhpc3Rvcnkge1xyXG5cclxuICAgIHB1YmxpYyBoaXN0b3J5Q2hhaW46IEFycmF5PElIaXN0b3J5VXJsPiA9IFtdO1xyXG4gICAgcHVibGljIGRpcmVjdGlvbjogbmF2aWdhdGlvbkRpcmVjdGlvbiA9IG5hdmlnYXRpb25EaXJlY3Rpb24uQnV0dG9ucztcclxuICAgIHB1YmxpYyBjdXJyZW50SW5kZXg6IG51bWJlciA9IDA7XHJcbn1cclxuIiwiaW1wb3J0IElVc2VyIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VzZXIvSVVzZXJcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGltcGxlbWVudHMgSVVzZXIge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6IHN0cmluZyA9IGAwMTIzNDU2Nzg5YDtcclxuICAgIHB1YmxpYyByOiBzdHJpbmcgPSBcIi0xXCI7XHJcbiAgICBwdWJsaWMgdXNlVnNDb2RlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBhdXRob3Jpc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBsb2dvdXRVcmw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHN1Yjogc3RyaW5nID0gXCJcIjtcclxufVxyXG4iLCJpbXBvcnQgSVNlYXJjaFVJIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL3NlYXJjaC9JU2VhcmNoVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hVSSBpbXBsZW1lbnRzIElTZWFyY2hVSSB7XHJcblxyXG4gICAgcHVibGljIGhhc0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIiwiaW1wb3J0IElTZWFyY2hTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU2VhcmNoU3RhdGVcIjtcclxuaW1wb3J0IElTZWFyY2hVSSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS91aS9zZWFyY2gvSVNlYXJjaFVJXCI7XHJcbmltcG9ydCBTZWFyY2hVSSBmcm9tIFwiLi91aS9zZWFyY2gvU2VhcmNoVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hTdGF0ZSBpbXBsZW1lbnRzIElTZWFyY2hTdGF0ZSB7XHJcbiAgIFxyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZyB8IG51bGwgPSBcIlwiO1xyXG4gICAgcHVibGljIHVpOiBJU2VhcmNoVUkgPSBuZXcgU2VhcmNoVUkoKTtcclxufVxyXG4iLCJpbXBvcnQgSVJlcGVhdEVmZmVjdHMgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JUmVwZWF0RWZmZWN0c1wiO1xyXG5pbXBvcnQgSUh0dHBFZmZlY3QgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvZWZmZWN0cy9JSHR0cEVmZmVjdFwiO1xyXG5pbXBvcnQgSUFjdGlvbiBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JQWN0aW9uXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwZWF0ZUVmZmVjdHMgaW1wbGVtZW50cyBJUmVwZWF0RWZmZWN0cyB7XHJcblxyXG4gICAgcHVibGljIHNob3J0SW50ZXJ2YWxIdHRwOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIC8vIHB1YmxpYyByZUxvYWRHZXRIdHRwOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIHB1YmxpYyByZUxvYWRHZXRIdHRwSW1tZWRpYXRlOiBBcnJheTxJSHR0cEVmZmVjdD4gPSBbXTtcclxuICAgIHB1YmxpYyBydW5BY3Rpb25JbW1lZGlhdGU6IEFycmF5PElBY3Rpb24+ID0gW107XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJTdGF0ZVVJIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lSZW5kZXJTdGF0ZVVJXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyU3RhdGVVSSBpbXBsZW1lbnRzIElSZW5kZXJTdGF0ZVVJIHtcclxuXHJcbiAgICBwdWJsaWMgcmF3OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBvcHRpb25zRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlclN0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lSZW5kZXJTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJHdWlkZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckd1aWRlXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVcIjtcclxuaW1wb3J0IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IElSZW5kZXJTdGF0ZVVJIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL3VpL0lSZW5kZXJTdGF0ZVVJXCI7XHJcbmltcG9ydCBSZW5kZXJTdGF0ZVVJIGZyb20gXCIuL3VpL1JlbmRlclN0YXRlVUlcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJTdGF0ZSBpbXBsZW1lbnRzIElSZW5kZXJTdGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGd1aWRlOiBJUmVuZGVyR3VpZGUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyByb290OiBJUmVuZGVyRnJhZ21lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjdXJyZW50RnJhZ21lbnQ6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG91dGxpbmU6IElSZW5kZXJPdXRsaW5lIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHM6IEFycmF5PElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gU2VhcmNoIGluZGljZXNcclxuICAgIHB1YmxpYyBpbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEOiBhbnkgPSB7fTtcclxuICAgIHB1YmxpYyBpbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDogYW55ID0ge307XHJcbiAgICBwdWJsaWMgaW5kZXhfcmF3RnJhZ21lbnRzX2ZyYWdtZW50SUQ6IGFueSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyB1aTogSVJlbmRlclN0YXRlVUkgPSBuZXcgUmVuZGVyU3RhdGVVSSgpO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiLi91c2VyL1NldHRpbmdzXCI7XHJcbmltcG9ydCBJU2V0dGluZ3MgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdXNlci9JU2V0dGluZ3NcIjtcclxuaW1wb3J0IElUb3BpY3NTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JVG9waWNzU3RhdGVcIjtcclxuaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG5pbXBvcnQgVG9waWNzU3RhdGUgZnJvbSBcIi4vVG9waWNzU3RhdGVcIjtcclxuaW1wb3J0IElUb3BpY1N0YXRlIGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL0lUb3BpY1N0YXRlXCI7XHJcbmltcG9ydCBUb3BpY1N0YXRlIGZyb20gXCIuL1RvcGljU3RhdGVcIjtcclxuaW1wb3J0IElIaXN0b3J5IGZyb20gXCIuLi9pbnRlcmZhY2VzL3N0YXRlL2hpc3RvcnkvSUhpc3RvcnlcIjtcclxuaW1wb3J0IFN0ZXBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnkvSGlzdG9yeVwiO1xyXG5pbXBvcnQgSVVzZXIgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvdXNlci9JVXNlclwiO1xyXG5pbXBvcnQgVXNlciBmcm9tIFwiLi91c2VyL1VzZXJcIjtcclxuaW1wb3J0IElTZWFyY2hTdGF0ZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU2VhcmNoU3RhdGVcIjtcclxuaW1wb3J0IFNlYXJjaFN0YXRlIGZyb20gXCIuL1NlYXJjaFN0YXRlXCI7XHJcbmltcG9ydCBJUmVwZWF0RWZmZWN0cyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zdGF0ZS9lZmZlY3RzL0lSZXBlYXRFZmZlY3RzXCI7XHJcbmltcG9ydCBSZXBlYXRlRWZmZWN0cyBmcm9tIFwiLi9lZmZlY3RzL1JlcGVhdGVFZmZlY3RzXCI7XHJcbmltcG9ydCBJUmVuZGVyU3RhdGUgZnJvbSBcIi4uL2ludGVyZmFjZXMvc3RhdGUvSVJlbmRlclN0YXRlXCI7XHJcbmltcG9ydCBSZW5kZXJTdGF0ZSBmcm9tIFwiLi9SZW5kZXJTdGF0ZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3M6IElTZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzaG93U29sdXRpb25zTWVudTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHR3aXR0ZXJVcmw6IHN0cmluZyA9ICdodHRwczovL3R3aXR0ZXIuY29tL25ldG9mdHJlZXMnO1xyXG4gICAgcHVibGljIGxpbmtlZGluVXJsOiBzdHJpbmcgPSAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvbmV0b2Z0cmVlcy9hYm91dCc7XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlUeXBlOiBEaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLlRvcGljcztcclxuICAgIHB1YmxpYyBsb2FkaW5nOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBkZWJ1ZzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ2VuZXJpY0Vycm9yOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmV4dEtleTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzZXR0aW5nczogSVNldHRpbmdzO1xyXG4gICAgcHVibGljIHVzZXI6IElVc2VyID0gbmV3IFVzZXIoKTtcclxuXHJcbiAgICBwdWJsaWMgdG9waWNzU3RhdGU6IElUb3BpY3NTdGF0ZSA9IG5ldyBUb3BpY3NTdGF0ZSgpO1xyXG4gICAgcHVibGljIHRvcGljU3RhdGU6IElUb3BpY1N0YXRlID0gbmV3IFRvcGljU3RhdGUoKTtcclxuICAgIHB1YmxpYyBzZWFyY2hTdGF0ZTogSVNlYXJjaFN0YXRlID0gbmV3IFNlYXJjaFN0YXRlKCk7XHJcbiAgICBwdWJsaWMgcmVuZGVyU3RhdGU6IElSZW5kZXJTdGF0ZSA9IG5ldyBSZW5kZXJTdGF0ZSgpO1xyXG5cclxuICAgIHB1YmxpYyByZXBlYXRFZmZlY3RzOiBJUmVwZWF0RWZmZWN0cyA9IG5ldyBSZXBlYXRlRWZmZWN0cygpO1xyXG5cclxuICAgIHB1YmxpYyBzdGVwSGlzdG9yeTogSUhpc3RvcnkgPSBuZXcgU3RlcEhpc3RvcnkoKTtcclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7IFNjcm9sbEhvcFR5cGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9TY3JvbGxIb3BUeXBlXCI7XHJcbmltcG9ydCBJU2NyZWVuIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3dpbmRvdy9JU2NyZWVuXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuIGltcGxlbWVudHMgSVNjcmVlbiB7XHJcblxyXG4gICAgcHVibGljIGF1dG9mb2N1czogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQXV0b2ZvY3VzRmlyc3RSdW46IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGhpZGVCYW5uZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzY3JvbGxUb1RvcDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHNjcm9sbFRvRWxlbWVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2Nyb2xsSG9wOiBTY3JvbGxIb3BUeXBlID0gU2Nyb2xsSG9wVHlwZS5Ob25lO1xyXG4gICAgcHVibGljIGxhc3RTY3JvbGxZOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1YTogYW55IHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElTY3JlZW4gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvd2luZG93L0lTY3JlZW5cIjtcclxuaW1wb3J0IElUcmVlU29sdmUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvd2luZG93L0lUcmVlU29sdmVcIjtcclxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9TY3JlZW5cIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlU29sdmUgaW1wbGVtZW50cyBJVHJlZVNvbHZlIHtcclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyaW5nQ29tbWVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2NyZWVuOiBJU2NyZWVuID0gbmV3IFNjcmVlbigpO1xyXG59XHJcbiIsImltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyT3V0bGluZUZyYWdtZW50IGltcGxlbWVudHMgSVJlbmRlck91dGxpbmVGcmFnbWVudCB7XHJcblxyXG4gICAgcHVibGljIGk6IHN0cmluZyA9ICcnOyAvLyBpZFxyXG4gICAgcHVibGljIGY6IHN0cmluZyA9ICcnOyAvLyBmcmFnbWVudCBpZFxyXG4gICAgcHVibGljIGM6IHN0cmluZyA9ICcnOyAvLyBjaGFydCBpZCBmcm9tIG91dGxpbmUgY2hhcnQgYXJyYXlcclxuICAgIHB1YmxpYyBvOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiA9IFtdOyAvLyBvcHRpb25zXHJcbiAgICBwdWJsaWMgcGFyZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IElSZW5kZXJPdXRsaW5lIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVDaGFydFwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuL1JlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlck91dGxpbmUgaW1wbGVtZW50cyBJUmVuZGVyT3V0bGluZSB7XHJcblxyXG4gICAgcHVibGljIHY6IHN0cmluZyA9ICcnO1xyXG4gICAgcHVibGljIHI6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgPSBuZXcgUmVuZGVyT3V0bGluZUZyYWdtZW50KCk7XHJcbiAgICBwdWJsaWMgYzogQXJyYXk8SVJlbmRlck91dGxpbmVDaGFydD4gPSBbXTtcclxufVxyXG4iLCJpbXBvcnQgSVJlbmRlck91dGxpbmVDaGFydCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVDaGFydFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlck91dGxpbmVDaGFydCBpbXBsZW1lbnRzIElSZW5kZXJPdXRsaW5lQ2hhcnQge1xyXG5cclxuICAgIHB1YmxpYyBpOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBwOiBzdHJpbmcgPSAnJztcclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJPdXRsaW5lXCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcbmltcG9ydCBJUmVuZGVyT3V0bGluZUZyYWdtZW50IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyT3V0bGluZUZyYWdtZW50XCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lIGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZVwiO1xyXG5pbXBvcnQgUmVuZGVyT3V0bGluZUNoYXJ0IGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyT3V0bGluZUNoYXJ0XCI7XHJcbmltcG9ydCBSZW5kZXJPdXRsaW5lRnJhZ21lbnQgZnJvbSBcIi4uLy4uL3N0YXRlL3JlbmRlci9SZW5kZXJPdXRsaW5lRnJhZ21lbnRcIjtcclxuaW1wb3J0IGdGcmFnbWVudENvZGUgZnJvbSBcIi4vZ0ZyYWdtZW50Q29kZVwiO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRGcmFnbWVudCA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICByYXdGcmFnbWVudDogYW55LFxyXG4gICAgcGFyZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbCA9IG51bGxcclxuKTogSVJlbmRlck91dGxpbmVGcmFnbWVudCA9PiB7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnQgPSBuZXcgUmVuZGVyT3V0bGluZUZyYWdtZW50KCk7XHJcbiAgICBmcmFnbWVudC5pID0gcmF3RnJhZ21lbnQuaTtcclxuICAgIGZyYWdtZW50LmYgPSByYXdGcmFnbWVudC5mO1xyXG4gICAgZnJhZ21lbnQucGFyZW50ID0gcGFyZW50O1xyXG4gICAgc3RhdGUucmVuZGVyU3RhdGUuaW5kZXhfb3V0bGluZUZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRFtmcmFnbWVudC5pXSA9IGZyYWdtZW50O1xyXG5cclxuICAgIGlmIChyYXdGcmFnbWVudC5vXHJcbiAgICAgICAgJiYgQXJyYXkuaXNBcnJheShyYXdGcmFnbWVudC5vKSA9PT0gdHJ1ZVxyXG4gICAgICAgICYmIHJhd0ZyYWdtZW50Lm8ubGVuZ3RoID4gMFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IG86IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQ7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHJhd0ZyYWdtZW50Lm8pIHtcclxuXHJcbiAgICAgICAgICAgIG8gPSBsb2FkRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbixcclxuICAgICAgICAgICAgICAgIGZyYWdtZW50XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBmcmFnbWVudC5vLnB1c2gobyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmcmFnbWVudDtcclxufTtcclxuXHJcbmNvbnN0IGxvYWRDaGFydHMgPSAoXHJcbiAgICBvdXRsaW5lOiBJUmVuZGVyT3V0bGluZSxcclxuICAgIHJhd091dGxpbmVDaGFydHM6IEFycmF5PGFueT5cclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgb3V0bGluZS5jID0gW107XHJcbiAgICBsZXQgYzogSVJlbmRlck91dGxpbmVDaGFydDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGNoYXJ0IG9mIHJhd091dGxpbmVDaGFydHMpIHtcclxuXHJcbiAgICAgICAgYyA9IG5ldyBSZW5kZXJPdXRsaW5lQ2hhcnQoKTtcclxuICAgICAgICBjLmkgPSBjaGFydC5pO1xyXG4gICAgICAgIGMucCA9IGNoYXJ0LnA7XHJcbiAgICAgICAgb3V0bGluZS5jLnB1c2goYyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBnT3V0bGluZUNvZGUgPSB7XHJcblxyXG4gICAgZ2V0T3V0bGluZUZyYWdtZW50OiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBmcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElSZW5kZXJPdXRsaW5lRnJhZ21lbnQgfCBudWxsID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9vdXRsaW5lRnJhZ21lbnRzX291dGxpbmVGcmFnbWVudElEW2ZyYWdtZW50SURdO1xyXG5cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQgPz8gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0T3V0bGluZUZyYWdtZW50Q2hhaW46IChcclxuICAgICAgICBzdGF0ZTogSVN0YXRlLFxyXG4gICAgICAgIGZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogQXJyYXk8c3RyaW5nPiA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50SURzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyT3V0bGluZUZyYWdtZW50IHwgbnVsbDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGZyYWdtZW50SUQpIHtcclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50ID0gZ091dGxpbmVDb2RlLmdldE91dGxpbmVGcmFnbWVudChcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRJRFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmcmFnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50SUQgPSBmcmFnbWVudC5pO1xyXG4gICAgICAgICAgICBmcmFnbWVudElEcy5wdXNoKGZyYWdtZW50SUQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50SURzO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkT3V0bGluZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByYXdPdXRsaW5lID0gb3V0bGluZVJlc3BvbnNlLmpzb25EYXRhO1xyXG4gICAgICAgIGNvbnN0IG91dGxpbmUgPSBuZXcgUmVuZGVyT3V0bGluZSgpO1xyXG4gICAgICAgIG91dGxpbmUudiA9IHJhd091dGxpbmUudjtcclxuXHJcbiAgICAgICAgaWYgKHJhd091dGxpbmUuY1xyXG4gICAgICAgICAgICAmJiBBcnJheS5pc0FycmF5KHJhd091dGxpbmUuYykgPT09IHRydWVcclxuICAgICAgICAgICAgJiYgcmF3T3V0bGluZS5jLmxlbmd0aCA+IDBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbG9hZENoYXJ0cyhcclxuICAgICAgICAgICAgICAgIG91dGxpbmUsXHJcbiAgICAgICAgICAgICAgICByYXdPdXRsaW5lLmNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmUudiA9IHJhd091dGxpbmUudjtcclxuXHJcbiAgICAgICAgb3V0bGluZS5yID0gbG9hZEZyYWdtZW50KFxyXG4gICAgICAgICAgICBzdGF0ZSwgXHJcbiAgICAgICAgICAgIHJhd091dGxpbmUuclxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLm91dGxpbmUgPSBvdXRsaW5lO1xyXG5cclxuICAgICAgICBnRnJhZ21lbnRDb2RlLnNldFJvb3RPdXRsaW5lRnJhZ21lbnRJRChzdGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnT3V0bGluZUNvZGU7XHJcblxyXG4iLCJpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElTdGF0ZUFueUFycmF5IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZUFueUFycmF5XCI7XHJcbmltcG9ydCBJUmVuZGVyRnJhZ21lbnQgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJGcmFnbWVudFwiO1xyXG5pbXBvcnQgSVJlbmRlck91dGxpbmVGcmFnbWVudCBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlck91dGxpbmVGcmFnbWVudFwiO1xyXG5pbXBvcnQgZ091dGxpbmVDb2RlIGZyb20gXCIuLi9jb2RlL2dPdXRsaW5lQ29kZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vY29kZS9nU3RhdGVDb2RlXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRFZmZlY3RzIGZyb20gXCIuLi9lZmZlY3RzL2dGcmFnbWVudEVmZmVjdHNcIjtcclxuaW1wb3J0IGdGaWxlQ29uc3RhbnRzIGZyb20gXCIuLi9nRmlsZUNvbnN0YW50c1wiO1xyXG5pbXBvcnQgVSBmcm9tIFwiLi4vZ1V0aWxpdGllc1wiO1xyXG5cclxuXHJcbmNvbnN0IGdPdXRsaW5lQWN0aW9ucyA9IHtcclxuXHJcbiAgICBsb2FkT3V0bGluZTogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnlcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgZ091dGxpbmVDb2RlLmxvYWRPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdTdGF0ZUNvZGUuY2xvbmVTdGF0ZShzdGF0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRPdXRsaW5lQW5kUmVxdWVzdEZyYWdtZW50czogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgb3V0bGluZVJlc3BvbnNlOiBhbnksXHJcbiAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEOiBzdHJpbmdcclxuICAgICk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRGb2xkZXJVcmwgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZT8uZnJhZ21lbnRGb2xkZXJVcmw7XHJcblxyXG4gICAgICAgIGlmIChVLmlzTnVsbE9yV2hpdGVTcGFjZShmcmFnbWVudEZvbGRlclVybCkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdPdXRsaW5lQ29kZS5sb2FkT3V0bGluZShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIG91dGxpbmVSZXNwb25zZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgb3V0bGluZWZyYWdtZW50IHdpdGggaWQgPSBsYXN0RnJhZ21lbnRJRDtcclxuICAgICAgICAvLyBUaGVuIHdhbGsgdXAgdGhyb3VnaCB0aGUgcGFyZW50cywgbG9hZGluZyBlYWNoIGluIHR1cm4gdW50aWwgcmVhY2hpbmcgcm9vdFxyXG5cclxuICAgICAgICBsZXQgY2hhaW5PdXRsaW5lRnJhZ21lbnRzOiBBcnJheTxJUmVuZGVyT3V0bGluZUZyYWdtZW50PiA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3V0bGluZUZyYWdtZW50ID0gZ091dGxpbmVDb2RlLmdldE91dGxpbmVGcmFnbWVudChcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHdoaWxlIChvdXRsaW5lRnJhZ21lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNoYWluT3V0bGluZUZyYWdtZW50cy5wdXNoKG91dGxpbmVGcmFnbWVudCk7XHJcbiAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudCA9IG91dGxpbmVGcmFnbWVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFpbk91dGxpbmVGcmFnbWVudHMucG9wKCk7IC8vIFJlbW92ZSBhcyB0aGlzIGlzIHRoZSByb290IGFuZCBpcyBhbHJlYWR5IGxvYWRlZCB3aXRoIHRoZSBndWlkZVxyXG4gICAgICAgIHN0YXRlLnJlbmRlclN0YXRlLmxvYWRpbmdDaGFpbkNhY2hlX091dGxpbmVGcmFnbWVudHMgPSBjaGFpbk91dGxpbmVGcmFnbWVudHM7XHJcbiAgICAgICAgY29uc3QgaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SUQgPSBzdGF0ZS5yZW5kZXJTdGF0ZS5pbmRleF9jaGFpbkZyYWdtZW50c19vdXRsaW5lRnJhZ21lbnRJRDtcclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRMb2FkRWZmZWN0czogQXJyYXk8SUh0dHBGZXRjaEl0ZW0+ID0gW107XHJcbiAgICAgICAgbGV0IGZyYWdtZW50OiBJUmVuZGVyRnJhZ21lbnQ7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50UGF0aDogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsb2FkRnJhZ21lbnRFZmZlY3Q6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gY2hhaW5PdXRsaW5lRnJhZ21lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICBvdXRsaW5lRnJhZ21lbnQgPSBjaGFpbk91dGxpbmVGcmFnbWVudHNbaV07XHJcbiAgICAgICAgICAgIGZyYWdtZW50ID0gaW5kZXhfY2hhaW5GcmFnbWVudHNfb3V0bGluZUZyYWdtZW50SURbb3V0bGluZUZyYWdtZW50LmZdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZyYWdtZW50XHJcbiAgICAgICAgICAgICAgICAmJiBmcmFnbWVudC51aS5kaXNjdXNzaW9uTG9hZGVkID09PSB0cnVlXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50UGF0aCA9IGAke2ZyYWdtZW50Rm9sZGVyVXJsfS8ke291dGxpbmVGcmFnbWVudC5mfSR7Z0ZpbGVDb25zdGFudHMuZnJhZ21lbnRGaWxlRXh0ZW5zaW9ufWA7XHJcblxyXG4gICAgICAgICAgICBsb2FkRnJhZ21lbnRFZmZlY3QgPSBnRnJhZ21lbnRFZmZlY3RzLmdldENoYWluRnJhZ21lbnQoXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmVGcmFnbWVudC5mLFxyXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQYXRoLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZUZyYWdtZW50LmlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsb2FkRnJhZ21lbnRFZmZlY3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudExvYWRFZmZlY3RzLnB1c2gobG9hZEZyYWdtZW50RWZmZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGZyYWdtZW50TG9hZEVmZmVjdHNcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ091dGxpbmVBY3Rpb25zO1xyXG4iLCJcclxuaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IFUgZnJvbSBcIi4uL2dVdGlsaXRpZXNcIjtcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2VudW1zL0FjdGlvblR5cGVcIjtcclxuaW1wb3J0IGdTdGF0ZUNvZGUgZnJvbSBcIi4uL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuaW1wb3J0IHsgZ0F1dGhlbnRpY2F0ZWRIdHRwIH0gZnJvbSBcIi4uL2h0dHAvZ0F1dGhlbnRpY2F0aW9uSHR0cFwiO1xyXG5pbXBvcnQgZ0FqYXhIZWFkZXJDb2RlIGZyb20gXCIuLi9odHRwL2dBamF4SGVhZGVyQ29kZVwiO1xyXG5pbXBvcnQgZ1JlbmRlckFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnMvZ091dGxpbmVBY3Rpb25zXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgZ0ZpbGVDb25zdGFudHMgZnJvbSBcIi4uL2dGaWxlQ29uc3RhbnRzXCI7XHJcblxyXG5cclxuY29uc3QgZ2V0R3VpZGVPdXRsaW5lID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIGxvYWREZWxlZ2F0ZTogKHN0YXRlOiBJU3RhdGUsIG91dGxpbmVSZXNwb25zZTogYW55KSA9PiBJU3RhdGVBbnlBcnJheVxyXG4pOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZT8ucGF0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsSUQ6IHN0cmluZyA9IFUuZ2VuZXJhdGVHdWlkKCk7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBnQWpheEhlYWRlckNvZGUuYnVpbGRIZWFkZXJzKFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGNhbGxJRCxcclxuICAgICAgICBBY3Rpb25UeXBlLkdldE91dGxpbmVcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZnJhZ21lbnRGb2xkZXJVcmw6IHN0cmluZyA9IHN0YXRlLnJlbmRlclN0YXRlLmd1aWRlLmZyYWdtZW50Rm9sZGVyVXJsID8/ICdudWxsJztcclxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gYCR7ZnJhZ21lbnRGb2xkZXJVcmx9LyR7Z0ZpbGVDb25zdGFudHMuZ3VpZGVPdXRsaW5lRmlsZW5hbWV9YDtcclxuXHJcbiAgICByZXR1cm4gZ0F1dGhlbnRpY2F0ZWRIdHRwKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc3BvbnNlOiAnanNvbicsXHJcbiAgICAgICAgYWN0aW9uOiBsb2FkRGVsZWdhdGUsXHJcbiAgICAgICAgZXJyb3I6IChzdGF0ZTogSVN0YXRlLCBlcnJvckRldGFpbHM6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgYWxlcnQoYHtcclxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIkVycm9yIGdldHRpbmcgb3V0bGluZSBkYXRhIGZyb20gdGhlIHNlcnZlci5cIixcclxuICAgICAgICAgICAgICAgIFwidXJsXCI6ICR7dXJsfSxcclxuICAgICAgICAgICAgICAgIFwiZXJyb3IgRGV0YWlsc1wiOiAke0pTT04uc3RyaW5naWZ5KGVycm9yRGV0YWlscyl9LFxyXG4gICAgICAgICAgICAgICAgXCJzdGFja1wiOiAke0pTT04uc3RyaW5naWZ5KGVycm9yRGV0YWlscy5zdGFjayl9LFxyXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogJHtnUmVuZGVyRWZmZWN0cy5nZXRHdWlkZU91dGxpbmUubmFtZX0sXHJcbiAgICAgICAgICAgICAgICBcImNhbGxJRDogJHtjYWxsSUR9XHJcbiAgICAgICAgICAgIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBnU3RhdGVDb2RlLmNsb25lU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ1JlbmRlckVmZmVjdHMgPSB7XHJcblxyXG4gICAgZ2V0R3VpZGVPdXRsaW5lOiAoc3RhdGU6IElTdGF0ZSk6IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZ2V0R3VpZGVPdXRsaW5lKFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgZ1JlbmRlckFjdGlvbnMubG9hZE91dGxpbmVcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRHdWlkZU91dGxpbmVBbmRMb2FkRnJhZ21lbnRzOiAoXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBsYXN0T3V0bGluZUZyYWdtZW50SUQ6IHN0cmluZ1xyXG4gICAgKTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWREZWxlZ2F0ZSA9IChcclxuICAgICAgICAgICAgc3RhdGU6IElTdGF0ZSwgXHJcbiAgICAgICAgICAgIG91dGxpbmVSZXNwb25zZTogYW55XHJcbiAgICAgICAgKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGdSZW5kZXJBY3Rpb25zLmxvYWRPdXRsaW5lQW5kUmVxdWVzdEZyYWdtZW50cyhcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZVJlc3BvbnNlLFxyXG4gICAgICAgICAgICAgICAgbGFzdE91dGxpbmVGcmFnbWVudElEXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdldEd1aWRlT3V0bGluZShcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGxvYWREZWxlZ2F0ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnUmVuZGVyRWZmZWN0cztcclxuIiwiaW1wb3J0IElSZW5kZXJHdWlkZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckd1aWRlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyR3VpZGUgaW1wbGVtZW50cyBJUmVuZGVyR3VpZGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nID0gJyc7XHJcbiAgICBwdWJsaWMgZnJhZ21lbnRGb2xkZXJVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG59XHJcbiIsImltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJUmVuZGVyR3VpZGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc3RhdGUvcmVuZGVyL0lSZW5kZXJHdWlkZVwiO1xyXG5pbXBvcnQgRmlsdGVycyBmcm9tIFwiLi4vLi4vc3RhdGUvY29uc3RhbnRzL0ZpbHRlcnNcIjtcclxuaW1wb3J0IFJlbmRlckd1aWRlIGZyb20gXCIuLi8uLi9zdGF0ZS9yZW5kZXIvUmVuZGVyR3VpZGVcIjtcclxuaW1wb3J0IFRyZWVTb2x2ZSBmcm9tIFwiLi4vLi4vc3RhdGUvd2luZG93L1RyZWVTb2x2ZVwiO1xyXG5pbXBvcnQgZ0ZpbGVDb25zdGFudHMgZnJvbSBcIi4uL2dGaWxlQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi9nVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBnRnJhZ21lbnRDb2RlIGZyb20gXCIuL2dGcmFnbWVudENvZGVcIjtcclxuXHJcblxyXG5jb25zdCBwYXJzZUd1aWRlID0gKHJhd0d1aWRlOiBhbnkpOiBJUmVuZGVyR3VpZGUgPT4ge1xyXG5cclxuICAgIGNvbnN0IGd1aWRlOiBJUmVuZGVyR3VpZGUgPSBuZXcgUmVuZGVyR3VpZGUocmF3R3VpZGUuaWQpO1xyXG4gICAgZ3VpZGUudGl0bGUgPSByYXdHdWlkZS50aXRsZSA/PyAnJztcclxuICAgIGd1aWRlLmRlc2NyaXB0aW9uID0gcmF3R3VpZGUuZGVzY3JpcHRpb24gPz8gJyc7XHJcbiAgICBndWlkZS5wYXRoID0gcmF3R3VpZGUucGF0aCA/PyBudWxsO1xyXG4gICAgY29uc3QgZm9sZGVyUGF0aCA9IHJhd0d1aWRlLmZyYWdtZW50Rm9sZGVyUGF0aCA/PyBudWxsO1xyXG5cclxuICAgIGlmICghVS5pc051bGxPcldoaXRlU3BhY2UoZm9sZGVyUGF0aCkpIHtcclxuXHJcbiAgICAgICAgZ3VpZGUuZnJhZ21lbnRGb2xkZXJVcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtmb2xkZXJQYXRofWA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGd1aWRlO1xyXG59O1xyXG5cclxuY29uc3QgcGFyc2VSZW5kZXJpbmdDb21tZW50ID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHJhdzogYW55XHJcbik6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghcmF3KSB7XHJcbiAgICAgICAgcmV0dXJuIHJhdztcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG57XHJcbiAgICBcImd1aWRlXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiZEJ0N0pOMXZ0XCJcclxuICAgIH0sXHJcbiAgICBcImZyYWdtZW50XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiZEJ0N0pOMXZ0XCIsXHJcbiAgICAgICAgXCJ0b3BMZXZlbE1hcEtleVwiOiBcImN2MVRSbDAxcmZcIixcclxuICAgICAgICBcIm1hcEtleUNoYWluXCI6IFwiY3YxVFJsMDFyZlwiLFxyXG4gICAgICAgIFwiZ3VpZGVJRFwiOiBcImRCdDdKTjFIZVwiLFxyXG4gICAgICAgIFwiZ3VpZGVQYXRoXCI6IFwiYzovR2l0SHViL0hBTC5Eb2N1bWVudGF0aW9uL3RzbWFwc1Rlc3QvVGVzdE9wdGlvbnNGb2xkZXIvSG9sZGVyL1Rlc3RPcHRpb25zLnRzbWFwXCIsXHJcbiAgICAgICAgXCJwYXJlbnRGcmFnbWVudElEXCI6IG51bGwsXHJcbiAgICAgICAgXCJjaGFydEtleVwiOiBcImN2MVRSbDAxcmZcIixcclxuICAgICAgICBcIm9wdGlvbnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwiZEJ0N0taMUFOXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvblwiOiBcIk9wdGlvbiAxXCIsXHJcbiAgICAgICAgICAgICAgICBcImlzQW5jaWxsYXJ5XCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkQnQ3S1oxUmJcIixcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uXCI6IFwiT3B0aW9uIDJcIixcclxuICAgICAgICAgICAgICAgIFwiaXNBbmNpbGxhcnlcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBcImRCdDdLWjI0QlwiLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25cIjogXCJPcHRpb24gM1wiLFxyXG4gICAgICAgICAgICAgICAgXCJpc0FuY2lsbGFyeVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib3JkZXJcIjogM1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59ICAgIFxyXG4gICAgKi9cclxuXHJcbiAgICBzdGF0ZS5yZW5kZXJTdGF0ZS5ndWlkZSA9IHBhcnNlR3VpZGUocmF3Lmd1aWRlKTtcclxuXHJcbiAgICBnRnJhZ21lbnRDb2RlLnBhcnNlQW5kTG9hZFJvb3RGcmFnbWVudChcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICByYXcuZnJhZ21lbnRcclxuICAgICk7XHJcbn07XHJcblxyXG5jb25zdCBnUmVuZGVyQ29kZSA9IHtcclxuXHJcbiAgICByZWdpc3Rlckd1aWRlQ29tbWVudDogKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB0cmVlU29sdmVHdWlkZTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWx0ZXJzLnRyZWVTb2x2ZUd1aWRlSUQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodHJlZVNvbHZlR3VpZGVcclxuICAgICAgICAgICAgJiYgdHJlZVNvbHZlR3VpZGUuaGFzQ2hpbGROb2RlcygpID09PSB0cnVlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZE5vZGU6IENoaWxkTm9kZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkTm9kZSA9IHRyZWVTb2x2ZUd1aWRlLmNoaWxkTm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3aW5kb3cuVHJlZVNvbHZlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlID0gbmV3IFRyZWVTb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5yZW5kZXJpbmdDb21tZW50ID0gY2hpbGROb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlUmVuZGVyaW5nQ29tbWVudDogKHN0YXRlOiBJU3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF3aW5kb3cuVHJlZVNvbHZlPy5yZW5kZXJpbmdDb21tZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBndWlkZVJlbmRlckNvbW1lbnQgPSB3aW5kb3cuVHJlZVNvbHZlLnJlbmRlcmluZ0NvbW1lbnQ7XHJcbiAgICAgICAgICAgIGd1aWRlUmVuZGVyQ29tbWVudCA9IGd1aWRlUmVuZGVyQ29tbWVudC50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWd1aWRlUmVuZGVyQ29tbWVudC5zdGFydHNXaXRoKGdGaWxlQ29uc3RhbnRzLmd1aWRlUmVuZGVyQ29tbWVudFRhZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3VpZGVSZW5kZXJDb21tZW50ID0gZ3VpZGVSZW5kZXJDb21tZW50LnN1YnN0cmluZyhnRmlsZUNvbnN0YW50cy5ndWlkZVJlbmRlckNvbW1lbnRUYWcubGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc3QgcmF3ID0gSlNPTi5wYXJzZShndWlkZVJlbmRlckNvbW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgcGFyc2VSZW5kZXJpbmdDb21tZW50KFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICByYXdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZ2lzdGVyRnJhZ21lbnRDb21tZW50OiAoKSA9PiB7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnUmVuZGVyQ29kZTtcclxuIiwiLy8gaW1wb3J0IHRvcGljc0luaXRTdGF0ZSBmcm9tIFwiLi4vLi4vY29yZS90b3BpY3NDb3JlL2NvZGUvdG9waWNzSW5pdFN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGUgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSVN0YXRlXCI7XHJcbmltcG9ydCBJU3RhdGVBbnlBcnJheSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVBbnlBcnJheVwiO1xyXG5pbXBvcnQgU3RhdGUgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL1N0YXRlXCI7XHJcbi8vIGltcG9ydCBzdGVwSW5pdFN0YXRlIGZyb20gXCIuLi8uLi9jb3JlL3N0ZXBDb3JlL2NvZGUvc3RlcEluaXRTdGF0ZVwiO1xyXG5pbXBvcnQgVHJlZVNvbHZlIGZyb20gXCIuLi8uLi8uLi9zdGF0ZS93aW5kb3cvVHJlZVNvbHZlXCI7XHJcbi8vIGltcG9ydCBJQnJvd3NlckRldGFpbHMgZnJvbSBcIi4uLy4uLy4uL2ludGVyZmFjZXMvc3RhdGUvSUJyb3dzZXJEZXRhaWxzXCI7XHJcbi8vIGltcG9ydCBnQXV0aGVudGljYXRpb25BY3Rpb25zIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvaHR0cC9nQXV0aGVudGljYXRpb25BY3Rpb25zXCI7XHJcbi8vIGltcG9ydCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9odHRwL0lIdHRwQXV0aGVudGljYXRlZFByb3BzXCI7XHJcbi8vIGltcG9ydCBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrIGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBBdXRoZW50aWNhdGVkUHJvcHNCbG9ja1wiO1xyXG4vLyBpbXBvcnQgeyBJSHR0cEZldGNoSXRlbSB9IGZyb20gXCIuLi8uLi8uLi9pbnRlcmZhY2VzL2h0dHAvSUh0dHBGZXRjaEl0ZW1cIjtcclxuLy8gaW1wb3J0IHsgZ1NlcXVlbnRpYWxIdHRwIH0gZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9odHRwL2dIdHRwXCI7XHJcbmltcG9ydCBVIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvZ1V0aWxpdGllc1wiO1xyXG4vLyBpbXBvcnQgZ0hpc3RvcnlDb2RlIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvY29kZS9nSGlzdG9yeUNvZGVcIjtcclxuLy8gaW1wb3J0IHsgRGlzcGxheVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vaW50ZXJmYWNlcy9lbnVtcy9EaXNwbGF5VHlwZVwiO1xyXG4vLyBpbXBvcnQgYXJ0aWNsZUluaXRTdGF0ZSBmcm9tIFwiLi4vLi4vY29yZS9zdGVwQ29yZS9jb2RlL2FydGljbGVJbml0U3RhdGVcIjtcclxuaW1wb3J0IGdSZW5kZXJFZmZlY3RzIGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvZWZmZWN0cy9nUmVuZGVyRWZmZWN0c1wiO1xyXG5pbXBvcnQgZ1JlbmRlckNvZGUgZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9jb2RlL2dSZW5kZXJDb2RlXCI7XHJcblxyXG5cclxuLy8gY29uc3QgZGVidWdGaXggPSAoKTogdm9pZCA9PiB7XHJcblxyXG4vLyAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL2xvY2FsaG9zdDpcIikpIHtcclxuXHJcbi8vICAgICAgICAgLy8gSWRlbnRpdHlTZXJ2ZXIgaGFzIHRoZSBjYWxsYmFjayBhZGRyZXNzIGFzIDEyNy4wLjAuMSBub3QgbG9jYWhvc3RcclxuLy8gICAgICAgICAvLyBUaGlzIG1lYW5zIHRoZSBsb2NhbHN0b3JhZ2UgaXMgd3JpdHRlbiB0byB0aGUgbG9jYWxob3N0IHVybCBhbmQgcmVxdWVzdGVkIG9uIGNhbGxiYWNrIGZyb20gdGhlIDEyNy4wLjAuMSB1cmxcclxuLy8gICAgICAgICAvLyBzbyBpcyBudWxsXHJcbi8vICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKFwiaHR0cHM6Ly9sb2NhbGhvc3Q6XCIsIFwiaHR0cHM6Ly8xMjcuMC4wLjE6XCIpXHJcbi8vICAgICB9XHJcbi8vIH07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlU3RhdGUgPSAoKTogSVN0YXRlID0+IHtcclxuXHJcbiAgICAvLyBkZWJ1Z0ZpeCgpO1xyXG5cclxuICAgIGlmICghd2luZG93LlRyZWVTb2x2ZSkge1xyXG5cclxuICAgICAgICB3aW5kb3cuVHJlZVNvbHZlID0gbmV3IFRyZWVTb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0YXRlOiBJU3RhdGUgPSBuZXcgU3RhdGUoKTtcclxuICAgIGdSZW5kZXJDb2RlLnBhcnNlUmVuZGVyaW5nQ29tbWVudChzdGF0ZSk7XHJcblxyXG4gICAgLy8gbG9hZEJyb3dzZXJEZXRhaWxzKCk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG59O1xyXG5cclxuXHJcbi8vIGNvbnN0IGxvYWRCcm93c2VyRGV0YWlscyA9ICgpOiB2b2lkID0+IHtcclxuXHJcbi8vICAgICB0cnkge1xyXG5cclxuLy8gICAgICAgICBjb25zdCBpc0lPUyA9IFtcclxuLy8gICAgICAgICAgICAgJ2lQYWQnLFxyXG4vLyAgICAgICAgICAgICAnaVBob25lJyxcclxuLy8gICAgICAgICAgICAgJ2lQb2QnXHJcbi8vICAgICAgICAgXS5pbmNsdWRlcyhuYXZpZ2F0b3IucGxhdGZvcm0pXHJcbi8vICAgICAgICAgICAgIC8vIGlQYWQgb24gaU9TIDEzIGRldGVjdGlvblxyXG4vLyAgICAgICAgICAgICB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIk1hY1wiKSAmJiBcIm9udG91Y2hlbmRcIiBpbiBkb2N1bWVudCk7XHJcblxyXG4vLyAgICAgICAgIGlmIChpc0lPUykge1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgYnJvd3NlckRldGFpbHMgPSB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgcGxhdGZvcm06IFwiaU9TXCIsXHJcbi8vICAgICAgICAgICAgICAgICBtb2JpbGU6IHRydWVcclxuLy8gICAgICAgICAgICAgfTtcclxuXHJcbi8vICAgICAgICAgICAgIHdpbmRvdy5UcmVlU29sdmUuc2NyZWVuLnVhID0gYnJvd3NlckRldGFpbHMgYXMgSUJyb3dzZXJEZXRhaWxzO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIHtcclxuLy8gICAgICAgICAgICAgY29uc3QgbmF2OiBhbnkgPSBuYXZpZ2F0b3IgYXMgYW55O1xyXG5cclxuLy8gICAgICAgICAgICAgbmF2LnVzZXJBZ2VudERhdGEuZ2V0SGlnaEVudHJvcHlWYWx1ZXMoXHJcbi8vICAgICAgICAgICAgICAgICBbXHJcbi8vICAgICAgICAgICAgICAgICAgICAgXCJhcmNoaXRlY3R1cmVcIixcclxuLy8gICAgICAgICAgICAgICAgICAgICBcIm1vZGVsXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgXCJwbGF0Zm9ybVwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIFwicGxhdGZvcm1WZXJzaW9uXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgXCJ1YUZ1bGxWZXJzaW9uXCJcclxuLy8gICAgICAgICAgICAgICAgIF0pXHJcbi8vICAgICAgICAgICAgICAgICAudGhlbigodWE6IElCcm93c2VyRGV0YWlscykgPT4ge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlLnNjcmVlbi51YSA9IHVhO1xyXG4vLyAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyAgICAgY2F0Y2gge1xyXG4vLyAgICAgICAgIC8vZG8gbm90aGluZy4uLlxyXG4vLyAgICAgfVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBpbml0aWFsaXNlV2l0aEF1dGhvcmlzYXRpb24gPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbi8vICAgICAvLyBTb21ldGltZXMgJy4nIGNhbiBzdG9wIGEgdXJsIGJlaW5nIHNlbnQgaGVyZSwgaWYgdGhpcyBoYXBwZW5zIGFkZCBhIC8gdG8gdGhlIGVuZCBvZiB0aGUgdXJsXHJcblxyXG4vLyAgICAgLy8gSWYgYXV0aGVudGljYXRpb24gZG9lc24ndCB3b3JrIHlvdSBuZWVkIHRvIGlkZW50aXR5IHNlcnZlciBpbiBhbm90aGVyIHRhYlxyXG4vLyAgICAgLy8gVGhpcyBzaXRlIHdpbGwgYmUgYmxvY2tlZCBiZWNhdXNlIG9mIHRoZSBzZWxmIGNlcnQuXHJcbi8vICAgICAvLyBDbGljayBhZHZhbmNlZCBldGMgdG8gYWxsb3cgdGhlIGNlcnRcclxuLy8gICAgIC8vIFRoZW4gcmVsYXVuY2ggdGhpcyBzaXRlIGFuZCBpdCBzaG91bGQgd29ya1xyXG4vLyAgICAgLy8gYWxlcnQoJ1Rlc3QnKTtcclxuXHJcbi8vICAgICBjb25zdCBlZmZlY3RzOiBBcnJheTxJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wc0Jsb2NrPiA9IFtdO1xyXG4vLyAgICAgY29uc3QgaHR0cEZldGNoSXRlbTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPSBnQXV0aGVudGljYXRpb25BY3Rpb25zLmNoZWNrVXNlckxvZ2dlZEluUHJvcHMoc3RhdGUpO1xyXG5cclxuLy8gICAgIC8vIENvbGxlY3QganVzdCB0aGUgcHJvcGVydGllcyBmcm9tIHRoZSBlZmZlY3RzLCBkaXNjYXJkaW5nIHRoZSBIdHRwXHJcbi8vICAgICAvLyBUaGVuIHJlYnVpbGQgdGhlbSBhdCB0aGUgZmlyc3QgbGV2ZWwgd2l0aCBzZXF1ZW50aWFsSHR0cCBpbnN0ZWFkXHJcblxyXG4vLyAgICAgaWYgKGh0dHBGZXRjaEl0ZW0pIHtcclxuXHJcbi8vICAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzID0gaHR0cEZldGNoSXRlbVsxXTtcclxuLy8gICAgICAgICBlZmZlY3RzLnB1c2gocHJvcHMpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNvbnN0IHBhdGhBcnJheTogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcclxuXHJcbi8vICAgICBpZiAocGF0aEFycmF5XHJcbi8vICAgICAgICAgJiYgcGF0aEFycmF5Lmxlbmd0aCA9PT0gMlxyXG4vLyAgICAgICAgICYmIHBhdGhBcnJheVsxXSA9PT0gXCJ0b3BpY3NcIikge1xyXG5cclxuLy8gICAgICAgICBjb25zdCBodHRwRmV0Y2hJdGVtOiBJSHR0cEZldGNoSXRlbSB8IHVuZGVmaW5lZCA9IHRvcGljc0luaXRTdGF0ZS5pbml0aWFsaXNlVG9waWNzRGlzcGxheVByb3BzKHN0YXRlKTtcclxuXHJcbi8vICAgICAgICAgaWYgKGh0dHBGZXRjaEl0ZW0pIHtcclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyA9IGh0dHBGZXRjaEl0ZW1bMV07XHJcbi8vICAgICAgICAgICAgIGVmZmVjdHMucHVzaChwcm9wcyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyAgICAgZWxzZSBpZiAocGF0aEFycmF5XHJcbi8vICAgICAgICAgJiYgcGF0aEFycmF5WzFdID09PSBcInN0ZXBcIikge1xyXG5cclxuLy8gICAgICAgICBjb25zdCBzdGVwSUQ6IHN0cmluZyA9IHBhdGhBcnJheVsyXTtcclxuXHJcbi8vICAgICAgICAgY29uc3QgaHR0cEZldGNoSXRlbTogSUh0dHBGZXRjaEl0ZW0gfCB1bmRlZmluZWQgPSBzdGVwSW5pdFN0YXRlLmluaXRpYWxpc2VTdGVwRGlzcGxheVByb3BzKFxyXG4vLyAgICAgICAgICAgICBzdGF0ZSxcclxuLy8gICAgICAgICAgICAgc3RlcElEXHJcbi8vICAgICAgICAgKTtcclxuXHJcbi8vICAgICAgICAgaWYgKGh0dHBGZXRjaEl0ZW0pIHtcclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IHByb3BzOiBJSHR0cEF1dGhlbnRpY2F0ZWRQcm9wcyA9IGh0dHBGZXRjaEl0ZW1bMV07XHJcbi8vICAgICAgICAgICAgIGVmZmVjdHMucHVzaChwcm9wcyk7XHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgIH1cclxuLy8gICAgIGVsc2Uge1xyXG4vLyAgICAgICAgIGNvbnN0IGh0dHBGZXRjaEl0ZW06IElIdHRwRmV0Y2hJdGVtIHwgdW5kZWZpbmVkID0gdG9waWNzSW5pdFN0YXRlLmluaXRpYWxpc2VUb3BpY3NEaXNwbGF5UHJvcHMoc3RhdGUpO1xyXG5cclxuLy8gICAgICAgICBpZiAoaHR0cEZldGNoSXRlbSkge1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgcHJvcHM6IElIdHRwQXV0aGVudGljYXRlZFByb3BzID0gaHR0cEZldGNoSXRlbVsxXTtcclxuLy8gICAgICAgICAgICAgZWZmZWN0cy5wdXNoKHByb3BzKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIFtcclxuLy8gICAgICAgICBzdGF0ZSxcclxuLy8gICAgICAgICBnU2VxdWVudGlhbEh0dHAoZWZmZWN0cylcclxuLy8gICAgIF07XHJcbi8vIH07XHJcblxyXG5jb25zdCBidWlsZFJlbmRlckRpc3BsYXkgPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGdSZW5kZXJFZmZlY3RzLmdldEd1aWRlT3V0bGluZShzdGF0ZSlcclxuICAgIF07XHJcbn07XHJcblxyXG5jb25zdCBidWlsZFJlbmRlckNoYWluRGlzcGxheSA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBxdWVyeVN0cmluZzogc3RyaW5nXHJcbik6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbiAgICBpZiAocXVlcnlTdHJpbmcuc3RhcnRzV2l0aCgnPycpID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc3Vic3RyaW5nKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxhc3RPdXRsaW5lRnJhZ21lbnRJRCA9IHF1ZXJ5U3RyaW5nO1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgZ1JlbmRlckVmZmVjdHMuZ2V0R3VpZGVPdXRsaW5lQW5kTG9hZEZyYWdtZW50cyhcclxuICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgIGxhc3RPdXRsaW5lRnJhZ21lbnRJRFxyXG4gICAgICAgIClcclxuICAgIF07XHJcbn07XHJcblxyXG4vLyBjb25zdCBidWlsZFRvcGljc0Rpc3BsYXkgPSAoc3RhdGU6IElTdGF0ZSk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbi8vICAgICAvLyBUT0RPIEFkZCBwYWdpbmF0aW9uLi4uXHJcbi8vICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLlRvcGljcztcclxuLy8gICAgIGdIaXN0b3J5Q29kZS5wdXNoQnJvd3Nlckhpc3RvcnlTdGF0ZShzdGF0ZSk7XHJcblxyXG4vLyAgICAgcmV0dXJuIHRvcGljc0luaXRTdGF0ZS5pbml0aWFsaXNlVG9waWNzRGlzcGxheShzdGF0ZSk7XHJcbi8vIH07XHJcblxyXG4vLyBjb25zdCBidWlsZEFydGljbGVEaXNwbGF5ID0gKFxyXG4vLyAgICAgc3RhdGU6IElTdGF0ZSxcclxuLy8gICAgIHRvcGljSUQ6IHN0cmluZyxcclxuLy8gICAgIHF1ZXJ5U3RyaW5nOiBzdHJpbmcgfCBudWxsID0gbnVsbCk6IElTdGF0ZUFueUFycmF5ID0+IHtcclxuXHJcbi8vICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLkFydGljbGU7XHJcbi8vICAgICBsZXQgZ3VpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcblxyXG4vLyAgICAgaWYgKHF1ZXJ5U3RyaW5nPy5zdGFydHNXaXRoKCc/aWQ9JykpIHtcclxuXHJcbi8vICAgICAgICAgZ3VpZCA9IHF1ZXJ5U3RyaW5nLnN1YnN0cmluZyg0KTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICByZXR1cm4gYXJ0aWNsZUluaXRTdGF0ZS5pbml0aWFsaXNlQXJ0aWNsZURpc3BsYXkoXHJcbi8vICAgICAgICAgc3RhdGUsXHJcbi8vICAgICAgICAgdG9waWNJRCxcclxuLy8gICAgICAgICBndWlkXHJcbi8vICAgICApO1xyXG4vLyB9O1xyXG5cclxuLy8gY29uc3QgYnVpbGRTdGVwc0Rpc3BsYXkgPSAoXHJcbi8vICAgICBzdGF0ZTogSVN0YXRlLFxyXG4vLyAgICAgc3RlcElEOiBzdHJpbmcpOiBJU3RhdGVBbnlBcnJheSA9PiB7XHJcblxyXG4vLyAgICAgaWYgKCFVLmlzTnVsbE9yV2hpdGVTcGFjZShzdGVwSUQpKSB7XHJcblxyXG4vLyAgICAgICAgIHN0ZXBJRCA9IHN0ZXBJRC5yZXBsYWNlKCd+JywgJy4nKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdGF0ZS5kaXNwbGF5VHlwZSA9IERpc3BsYXlUeXBlLlN0ZXA7XHJcblxyXG4vLyAgICAgcmV0dXJuIHN0ZXBJbml0U3RhdGUuaW5pdGlhbGlzZVN0ZXBEaXNwbGF5KFxyXG4vLyAgICAgICAgIHN0YXRlLFxyXG4vLyAgICAgICAgIHN0ZXBJRFxyXG4vLyAgICAgKTtcclxuLy8gfTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VXaXRob3V0QXV0aG9yaXNhdGlvbiA9IChzdGF0ZTogSVN0YXRlKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgIC8vIFNvbWV0aW1lcyAnLicgY2FuIHN0b3AgYSB1cmwgYmVpbmcgc2VudCBoZXJlLCBpZiB0aGlzIGhhcHBlbnMgYWRkIGEgLyB0byB0aGUgZW5kIG9mIHRoZSB1cmxcclxuXHJcbiAgICAvLyBJZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IHdvcmsgeW91IG5lZWQgdG8gaWRlbnRpdHkgc2VydmVyIGluIGFub3RoZXIgdGFiXHJcbiAgICAvLyBUaGlzIHNpdGUgd2lsbCBiZSBibG9ja2VkIGJlY2F1c2Ugb2YgdGhlIHNlbGYgY2VydC5cclxuICAgIC8vIENsaWNrIGFkdmFuY2VkIGV0YyB0byBhbGxvdyB0aGUgY2VydFxyXG4gICAgLy8gVGhlbiByZWxhdW5jaCB0aGlzIHNpdGUgYW5kIGl0IHNob3VsZCB3b3JrXHJcbiAgICAvLyBhbGVydCgnVGVzdCcpO1xyXG5cclxuICAgIC8vIGNvbnN0IHBhdGhBcnJheTogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcclxuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gaWYgKHBhdGhBcnJheVxyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXkubGVuZ3RoID09PSAyXHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheVsxXSA9PT0gXCJ0b3BpY3NcIikge1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuIGJ1aWxkVG9waWNzRGlzcGxheShzdGF0ZSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHBhdGhBcnJheVxyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXkubGVuZ3RoID09PSAzXHJcbiAgICAgICAgLy8gICAgICYmIHBhdGhBcnJheVsxXSA9PT0gXCJ0b3BpY1wiKSB7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gYnVpbGRBcnRpY2xlRGlzcGxheShcclxuICAgICAgICAvLyAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgIC8vICAgICAgICAgcGF0aEFycmF5WzJdLFxyXG4gICAgICAgIC8vICAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaFxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIGlmIChwYXRoQXJyYXlcclxuICAgICAgICAvLyAgICAgJiYgcGF0aEFycmF5Lmxlbmd0aCA9PT0gMlxyXG4gICAgICAgIC8vICAgICAmJiBwYXRoQXJyYXlbMV0gPT09IFwic3RlcFwiKSB7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gYnVpbGRTdGVwc0Rpc3BsYXkoXHJcbiAgICAgICAgLy8gICAgICAgICBzdGF0ZSxcclxuICAgICAgICAvLyAgICAgICAgIHBhdGhBcnJheVsyXVxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgaWYgKCFVLmlzTnVsbE9yV2hpdGVTcGFjZShxdWVyeVN0cmluZykpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBidWlsZFJlbmRlckNoYWluRGlzcGxheShcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgcXVlcnlTdHJpbmdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBidWlsZFJlbmRlckRpc3BsYXkoc3RhdGUpO1xyXG4gICAgICAgIC8vIHJldHVybiBidWlsZFRvcGljc0Rpc3BsYXkoc3RhdGUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGU6IGFueSkge1xyXG5cclxuICAgICAgICBzdGF0ZS5nZW5lcmljRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRTdGF0ZSA9IHtcclxuXHJcbiAgICBpbml0aWFsaXNlOiAoKTogSVN0YXRlQW55QXJyYXkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBzdGF0ZTogSVN0YXRlID0gaW5pdGlhbGlzZVN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGlmIChzdGF0ZT8udXNlcj8udXNlVnNDb2RlID09PSB0cnVlKVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICByZXR1cm4gaW5pdGlhbGlzZVdpdGhvdXRBdXRob3Jpc2F0aW9uKHN0YXRlKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIHJldHVybiBpbml0aWFsaXNlV2l0aEF1dGhvcmlzYXRpb24oc3RhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdFN0YXRlO1xyXG5cclxuIiwiaW1wb3J0IEZpbHRlcnMgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL2NvbnN0YW50cy9GaWx0ZXJzXCI7XHJcbmltcG9ydCBUcmVlU29sdmUgZnJvbSBcIi4uLy4uLy4uL3N0YXRlL3dpbmRvdy9UcmVlU29sdmVcIjtcclxuXHJcblxyXG5jb25zdCByZW5kZXJDb21tZW50cyA9IHtcclxuXHJcbiAgICByZWdpc3Rlckd1aWRlQ29tbWVudDogKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB0cmVlU29sdmVHdWlkZTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWx0ZXJzLnRyZWVTb2x2ZUd1aWRlSUQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodHJlZVNvbHZlR3VpZGVcclxuICAgICAgICAgICAgJiYgdHJlZVNvbHZlR3VpZGUuaGFzQ2hpbGROb2RlcygpID09PSB0cnVlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZE5vZGU6IENoaWxkTm9kZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVNvbHZlR3VpZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkTm9kZSA9IHRyZWVTb2x2ZUd1aWRlLmNoaWxkTm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3aW5kb3cuVHJlZVNvbHZlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVHJlZVNvbHZlID0gbmV3IFRyZWVTb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LlRyZWVTb2x2ZS5yZW5kZXJpbmdDb21tZW50ID0gY2hpbGROb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlbmRlckNvbW1lbnRzO1xyXG4iLCJpbXBvcnQgeyBhcHAgfSBmcm9tIFwiLi9oeXBlckFwcC9oeXBlci1hcHAtbG9jYWxcIjtcblxuaW1wb3J0IGluaXRTdWJzY3JpcHRpb25zIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L3N1YnNjcmlwdGlvbnMvaW5pdFN1YnNjcmlwdGlvbnNcIjtcbmltcG9ydCBpbml0RXZlbnRzIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdEV2ZW50c1wiO1xuaW1wb3J0IGluaXRWaWV3IGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L3ZpZXdzL2luaXRWaWV3XCI7XG5pbXBvcnQgaW5pdFN0YXRlIGZyb20gXCIuL21vZHVsZXMvY29tcG9uZW50cy9pbml0L2NvZGUvaW5pdFN0YXRlXCI7XG5pbXBvcnQgcmVuZGVyQ29tbWVudHMgZnJvbSBcIi4vbW9kdWxlcy9jb21wb25lbnRzL2luaXQvY29kZS9yZW5kZXJDb21tZW50c1wiO1xuXG5cbmluaXRFdmVudHMucmVnaXN0ZXJHbG9iYWxFdmVudHMoKTtcbnJlbmRlckNvbW1lbnRzLnJlZ2lzdGVyR3VpZGVDb21tZW50KCk7XG5cbih3aW5kb3cgYXMgYW55KS5Db21wb3NpdGVGbG93c0F1dGhvciA9IGFwcCh7XG4gICAgXG4gICAgbm9kZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmVlU29sdmVGcmFnbWVudHNcIiksXG4gICAgaW5pdDogaW5pdFN0YXRlLmluaXRpYWxpc2UsXG4gICAgdmlldzogaW5pdFZpZXcuYnVpbGRWaWV3LFxuICAgIHN1YnNjcmlwdGlvbnM6IGluaXRTdWJzY3JpcHRpb25zLFxuICAgIG9uRW5kOiBpbml0RXZlbnRzLm9uUmVuZGVyRmluaXNoZWRcbn0pO1xuXG5cbiJdLCJuYW1lcyI6WyJwcm9wcyIsIkRpc3BsYXlUeXBlIiwib3V0cHV0IiwiQWN0aW9uVHlwZSIsIlUiLCJlZmZlY3QiLCJodHRwRWZmZWN0IiwiU3RlcFR5cGUiLCJsb2NhdGlvbiIsInN0YXRlIiwibG9hZE9wdGlvbiIsIlNjcm9sbEhvcFR5cGUiLCJuYXZpZ2F0aW9uRGlyZWN0aW9uIiwiU3RlcEhpc3RvcnkiLCJnUmVuZGVyQWN0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksWUFBWTtBQUNoQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxZQUFZLENBQUU7QUFDbEIsSUFBSSxZQUFZLENBQUU7QUFDbEIsSUFBSSxNQUFNLFVBQVU7QUFDcEIsSUFB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
