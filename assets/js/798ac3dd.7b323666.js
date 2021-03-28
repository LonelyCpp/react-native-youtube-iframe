(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{79:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return p}));var r=n(3),a=n(8),o=(n(0),n(88)),i={id:"elapsed-time",title:"Show elapsed time"},c={unversionedId:"elapsed-time",id:"elapsed-time",isDocsHomePage:!1,title:"Show elapsed time",description:"The player provides a way to fetch current time. Combining this with setInterval is the right way to go, since you can control the accuracy and frequency of the reading.",source:"@site/../docs/show-elapsed-time.mdx",slug:"/elapsed-time",permalink:"/react-native-youtube-iframe/elapsed-time",version:"current",sidebar:"sideBar",previous:{title:"Remove Context Menu",permalink:"/react-native-youtube-iframe/remove-context-share"}},s=[],l={toc:s};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"The player provides a way to fetch current time. Combining this with ",Object(o.b)("inlineCode",{parentName:"p"},"setInterval")," is the right way to go, since you can control the accuracy and frequency of the reading."),Object(o.b)("p",null,"example:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-javascript"},"import React, {useState, useRef, useEffect} from 'react';\nimport {Text, View} from 'react-native';\nimport YoutubePlayer from 'react-native-youtube-iframe';\n\nconst App = () => {\n  const [elapsed, setElapsed] = useState(0);\n  const playerRef = useRef();\n\n  useEffect(() => {\n    const interval = setInterval(async () => {\n      const elapsed_sec = await playerRef.current.getCurrentTime(); // this is a promise. dont forget to await\n\n      // calculations\n      const elapsed_ms = Math.floor(elapsed_sec * 1000);\n      const ms = elapsed_ms % 1000;\n      const min = Math.floor(elapsed_ms / 60000);\n      const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);\n\n      setElapsed(\n        min.toString().padStart(2, '0') +\n          ':' +\n          seconds.toString().padStart(2, '0') +\n          ':' +\n          ms.toString().padStart(3, '0'),\n      );\n    }, 100); // 100 ms refresh. increase it if you don't require millisecond precision\n\n    return () => {\n      clearInterval(interval);\n    };\n  }, []);\n\n  return (\n    <>\n      <YoutubePlayer\n        height={250}\n        ref={playerRef}\n        videoId={'DC471a9qrU4'}\n      />\n      <View>\n        <View style={{flexDirection: 'row'}}>\n          <Text style={{flex: 1}}>{'elapsed time'}</Text>\n          <Text style={{flex: 1, color: 'green'}}>{elapsed}</Text>\n        </View>\n    </>\n  );\n};\n")))}p.isMDXComponent=!0},88:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,d=u["".concat(i,".").concat(m)]||u[m]||f[m]||o;return n?a.a.createElement(d,c(c({ref:t},l),{},{components:n})):a.a.createElement(d,c({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<o;l++)i[l]=n[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);