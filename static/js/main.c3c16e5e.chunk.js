(this["webpackJsonp@set/mobile"]=this["webpackJsonp@set/mobile"]||[]).push([[0],{53:function(e,t,r){},54:function(e,t,r){"use strict";r.r(t);var a=r(10),n=r(9),i=r(33),d=r(21),c=r(17),m=r(0),l=Object(m.g)(n.g([Object(m.k)(i.a,c.a((function(e){return e.id})))]),n.d,d.b((function(e){return e.id})),d.a((function(){return 0}),m.j)),s=function(e,t){return Object(m.k)(e,n.b((function(e){return e.id===t})))},b=r(19),u=[{id:0,playerId:0,timeKeeperId:0,time:8371218},{id:1,playerId:1,timeKeeperId:0,time:497679},{id:3,playerId:3,timeKeeperId:0,time:2973106},{id:4,playerId:4,timeKeeperId:0,time:3284624},{id:6,playerId:6,timeKeeperId:0,time:9102835},{id:9,playerId:9,timeKeeperId:0,time:7177585},{id:10,playerId:10,timeKeeperId:0,time:8134408},{id:11,playerId:11,timeKeeperId:0,time:5635620},{id:12,playerId:12,timeKeeperId:0,time:4980535},{id:13,playerId:13,timeKeeperId:0,time:3721598},{id:14,playerId:14,timeKeeperId:0,time:5334592},{id:18,playerId:18,timeKeeperId:0,time:591265},{id:20,timeKeeperId:0,time:5660824},{id:21,playerId:21,timeKeeperId:0,time:8767445},{id:22,playerId:22,timeKeeperId:0,time:1762512},{id:25,playerId:25,timeKeeperId:0,time:3517277},{id:26,playerId:26,timeKeeperId:0,time:5942456},{id:29,timeKeeperId:0,time:8280131},{id:30,playerId:30,timeKeeperId:0,time:6312055},{id:31,playerId:31,timeKeeperId:0,time:6214636},{id:35,playerId:35,timeKeeperId:0,time:6667701},{id:36,playerId:36,timeKeeperId:0,time:7930850},{id:37,playerId:37,timeKeeperId:0,time:1281939},{id:38,playerId:38,timeKeeperId:0,time:257523},{id:46,timeKeeperId:0,time:9301463}],o=Object(b.b)({name:"timeStamps",initialState:u,reducers:{add:function(e,t){return r=e,i=t.payload,Object(m.k)(r,n.a(Object(a.a)(Object(a.a)({},i),{},{id:l(r)})));var r,i},assignPlayer:function(e,t){return r=e,i=t.payload,Object(m.k)(r,n.f(Object(m.k)(r,n.c((function(e){return e.id===i.id})),d.a((function(){return-1}),(function(e){return e}))),(function(e){return Object(a.a)(Object(a.a)({},e),i)})),d.a((function(){return r}),(function(e){return e})));var r,i},reset:function(e,t){return r=e,a=t.payload.id,s(r,a);var r,a}}}),h=o.actions,f=h.add,j=h.reset,p=h.assignPlayer,g=o.reducer,x=r(35),O=r(7),y=r(24),N=r(1),v=r.n(N),I=r(3),Y={addDigit:function(e){return function(t){return t.concat(e)}},back:function(e){return e.slice(0,-1)},reset:function(e){return""}},K=[{char:"1",changeNumber:Y.addDigit("1")},{char:"2",changeNumber:Y.addDigit("2")},{char:"3",changeNumber:Y.addDigit("3")},{char:"4",changeNumber:Y.addDigit("4")},{char:"5",changeNumber:Y.addDigit("5")},{char:"6",changeNumber:Y.addDigit("6")},{char:"7",changeNumber:Y.addDigit("7")},{char:"8",changeNumber:Y.addDigit("8")},{char:"9",changeNumber:Y.addDigit("9")},{char:"\u21ba",changeNumber:Y.reset,alwaysEnabled:!0},{char:"0",changeNumber:Y.addDigit("0")},{char:"\u2190",changeNumber:Y.back,alwaysEnabled:!0}],k=function(e){var t=e.char,r=e.padClick,a=e.enabled,n=e.alwaysEnabled;return n||a?Object(I.jsx)("button",{onClick:r,disabled:!n&&!a,className:"disabled:text-gray-200 border-gray-600 font-medium border-dashed text-2xl transition-colors rounded-md text-gray-800 m-1.5 ",children:t}):Object(I.jsx)("p",{className:"flex items-center justify-center font-medium text-gray-400 text-2xl m-1.5",children:t})},w=function(e){return Object(I.jsx)("div",{className:"grid h-3/5 flex-auto grid-cols-3 grid-rows-4",children:K.map((function(t){return Object(I.jsx)(k,{alwaysEnabled:t.alwaysEnabled,enabled:e.availableDigits.includes(t.char),padClick:function(){return function(t){var r=t.changeNumber(e.number);e.onNumberChange(r)}(t)},char:t.char},t.char)}))})},S=r(31),C=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return e.toLocaleString("en-US",{minimumIntegerDigits:t})},D=function(e){return"".concat(C(e.getHours()),":").concat(C(e.getMinutes()),":").concat(C(e.getSeconds()),".").concat(C(e.getMilliseconds(),3).slice(0,1))},R=function(e,t){return Object(m.k)(t,n.e(String),n.b(S.b(e)),n.e((function(t){return S.a(e.length,t.length)(t)})),n.e(S.a(0,1)),n.b((function(e){return!!e})))},P=r(30),T=function(){return Object(P.b)()},M=P.c,E=function(e){var t=e.playerNumber;return Object(I.jsxs)("div",{className:"text-gray-600 border-gray-600 flex justify-center text-2xl font-regular py-4",children:[t,"\xa0"]})},L=function(e){var t=e.player,r=e.onPlayerCheckIn;return Object(I.jsxs)("button",{onClick:function(){return r(t.id)},className:"bg-orange-500 flex mb-2 w-full px-4 py-2 items-center shadow-md rounded-md",children:[Object(I.jsx)("div",{className:"font-bold text-2xl mr-4",children:t.number}),Object(I.jsxs)("div",{children:[t.name," ",t.lastName]})]})},H=function(e){var t,r,i=e.onPlayerCheckIn,d=Object(N.useState)(""),c=Object(y.a)(d,2),l=c[0],s=c[1],b=M((function(e){return e.players})),u=M((function(e){return e.timeStamps})),o=b.map((function(e){return Object(a.a)(Object(a.a)({},e),{},{timeStamp:u.find((function(t){return t.playerId===e.id}))})})).filter((function(e){return void 0===e.timeStamp})),h=o.map((function(e){return e.number})),f=(t=l,r=h,Object(m.k)(r,n.b(Object(m.g)(String,S.b(t))))),j=o.filter((function(e){return f.includes(e.number)}));return Object(I.jsxs)("div",{className:"flex h-full flex-col px-12",children:[Object(I.jsx)(E,{playerNumber:l}),Object(I.jsx)("div",{className:"flex-auto flex flex-col flex-wrap items-stretch overflow-hidden h-2/5",children:j.map((function(e){return Object(I.jsx)(L,{onPlayerCheckIn:function(e){i(e),s("")},player:e},e.id)}))}),Object(I.jsx)(w,{availableDigits:R(l,h),number:l,onNumberChange:s})]})},J=function(e){var t=e.players;return Object(I.jsx)("div",{className:"flex flex-wrap",children:t.map((function(e){return Object(I.jsx)("div",{className:"bg-gray-700 font-semibold text-2xl rounded-md px-8 py-2 m-2",children:e.number},e.number)}))})},B=function(e){var t=e.time,r=e.onReset;return Object(I.jsxs)("span",{children:[Object(I.jsx)("span",{className:"font-semibold pr-4",children:t&&D(new Date(t))}),Object(I.jsx)("button",{onClick:r,children:"\u21ba"})]})},F=function(e){var t=e.timeKeeperName,r=e.onRecord;return Object(I.jsx)("span",{children:Object(I.jsx)("button",{onClick:r,children:t})})},A=function(e){var t=e.players,r=e.timeKeeperName,a=e.onTimeRecord,n=e.onTimeReset,i=function(e){return function(){return a(e)}};return Object(I.jsx)("div",{className:"text-black",children:t.map((function(e){return Object(I.jsxs)("div",{className:"py-5 flex ",children:[Object(I.jsx)("span",{className:"font-semibold pr-4",children:e.number}),Object(I.jsx)("span",{className:"flex-grow",children:e.name}),Object(I.jsx)("span",{className:"bg-gray-600 rounded-md px-8 py-3 text-white",children:e.timeStamp?Object(I.jsx)(B,{time:e.timeStamp.time,onReset:(t=e.timeStamp.id,function(){return n(t)})}):Object(I.jsx)(F,{timeKeeperName:r,onRecord:i(e.id)})})]},e.number);var t}))})},z=r(41),W=r(39),G=r.n(W),U=function(e){return Object(z.a)(e).sort((function(e,t){return t.time-e.time}))},q=function(e){var t=e.times,r=e.onAddTime,a=Object(N.useState)(),n=Object(y.a)(a,2),i=n[0],d=n[1],c=G()({bindTo:document.getElementById("module-holder")}).Portal,m=T();return Object(I.jsxs)("div",{children:[void 0!==i&&Object(I.jsx)(c,{children:Object(I.jsx)("div",{className:"absolute inset-0 h-full w-full bg-orange-100",children:Object(I.jsx)(H,{onPlayerCheckIn:function(e){m(p({playerId:e,id:i})),d(void 0)}})})}),Object(I.jsx)("div",{className:"flex flex-col mt-2",children:Object(I.jsx)("button",{onClick:r,className:"self-end rounded-md text-center w-40 bg-orange-500 py-2 px-4",children:"ADD RECORD"})}),U(t).map((function(e){return Object(I.jsxs)("div",{className:"flex justify-between my-2",children:[Object(I.jsx)("span",{className:"text-gray-600",children:D(new Date(e.time))}),e.player?Object(I.jsx)("div",{className:"rounded-md text-center w-40 bg-gray-500 py-2 px-4",children:e.player.number}):Object(I.jsx)("button",{onClick:function(){return d(e.id)},className:"hover:bg-orange-500 hover:text-white hover:border-transparent rounded-md text-center w-40 border-dashed border-2 font-semibold text-gray-500 border-gray-500 py-2 px-4",children:"CHOOSE PLAYER"})]},e.id)}))]})},Q=function(e){var t=e.time;return Object(I.jsx)("div",{className:"text-xl",children:D(t)})},V=function(){var e=Object(N.useState)(new Date),t=Object(y.a)(e,2),r=t[0],a=t[1];return Object(N.useEffect)((function(){setInterval((function(){return a(new Date)}),10)}),[]),Object(I.jsx)(Q,{time:r})},X=function(e){var t=e.timeKeeperName;return Object(I.jsxs)("div",{className:"px-5 w-screen flex-shrink-0 flex items-center justify-between bg-white font-semibold text-black border h-10",children:[Object(I.jsx)("span",{className:"mr-4",children:t}),Object(I.jsx)(V,{})]})},Z=r.p+"static/media/dialpad.d813f511.svg",$=r.p+"static/media/dots-grid.57b82462.svg",_=r.p+"static/media/format-list-numbered.942f2bdf.svg",ee=r.p+"static/media/timetable.ff6bd1a7.svg",te=function(e){var t=e.text,r=e.mode,a=e.icon,n=r===e.chosenMode?"opacity-100":"opacity-50";return Object(I.jsxs)(x.b,{to:"/".concat(r),className:"".concat(n," flex flex-col items-center px-4 py-2 mr-4"),children:[Object(I.jsx)("img",{src:a,height:"20",width:"20",alt:""}),Object(I.jsx)("p",{className:"text-xs font-semibold",children:t})]})},re=function(){var e=Object(O.f)().pathname.slice(1);return Object(I.jsxs)("div",{className:"flex justify-around text-black",children:[Object(I.jsx)(te,{mode:"list",text:"List",icon:_,chosenMode:e}),Object(I.jsx)(te,{mode:"grid",text:"Grid",icon:$,chosenMode:e}),Object(I.jsx)(te,{mode:"pad",text:"Pad",icon:Z,chosenMode:e}),Object(I.jsx)(te,{mode:"times",text:"Times",icon:ee,chosenMode:e})]})};var ae=function(){var e=M((function(e){return e.players})),t=M((function(e){return e.timeStamps})),r=M((function(e){return e.timeKeepers})),n=T(),i=e.map((function(e){return Object(a.a)(Object(a.a)({},e),{},{timeStamp:t.find((function(t){return t.playerId===e.id}))})})),d=t.map((function(t){return Object(a.a)(Object(a.a)({},t),{},{player:e.find((function(e){return t.playerId===e.id}))})}));return Object(I.jsx)(x.a,{children:Object(I.jsxs)("div",{className:"bg-orange-100 flex flex-col overflow-hidden h-screen w-screen text-white",children:[Object(I.jsx)(X,{timeKeeperName:"Start"}),Object(I.jsx)("div",{id:"module-holder",className:"relative overflow-hidden flex-col flex-1",children:Object(I.jsx)("div",{className:"px-5 h-full flex-1 overflow-y-scroll",children:Object(I.jsxs)(O.c,{children:[Object(I.jsx)(O.a,{exact:!0,path:"/list",children:Object(I.jsx)(A,{onTimeRecord:function(e){return n(f({playerId:e,timeKeeperId:0,time:(new Date).getTime()}))},onTimeReset:function(e){return n(j({id:e}))},timeKeeperName:r[0].name,players:i})}),Object(I.jsx)(O.a,{exact:!0,path:"/grid",children:Object(I.jsx)(J,{players:e})}),Object(I.jsx)(O.a,{exact:!0,path:"/pad",children:Object(I.jsx)(H,{onPlayerCheckIn:function(e){n(f({playerId:e,timeKeeperId:0,time:(new Date).getTime()}))}})}),Object(I.jsx)(O.a,{exact:!0,path:"/times",children:Object(I.jsx)(q,{onAddTime:function(){n(f({timeKeeperId:0,time:(new Date).getTime()}))},times:d})})]})})}),Object(I.jsx)("div",{children:Object(I.jsx)(re,{})})]})})},ne=r(26),ie=r.n(ne),de=function(e){e&&e instanceof Function&&r.e(3).then(r.bind(null,55)).then((function(t){var r=t.getCLS,a=t.getFID,n=t.getFCP,i=t.getLCP,d=t.getTTFB;r(e),a(e),n(e),i(e),d(e)}))},ce=[{id:0,name:"Horne",lastName:"Huber",number:1,birthYear:1974,gender:"male"},{id:1,name:"Tonia",lastName:"Lindsey",number:2,birthYear:1993,gender:"female"},{id:2,name:"Eaton",lastName:"Head",number:3,birthYear:1974,gender:"male"},{id:3,name:"Humphrey",lastName:"Clayton",number:4,birthYear:1988,gender:"male"},{id:4,name:"Caitlin",lastName:"Lancaster",number:5,birthYear:1980,gender:"female"},{id:5,name:"Stout",lastName:"Jenkins",number:6,birthYear:1975,gender:"male"},{id:6,name:"Nichole",lastName:"Randolph",number:7,birthYear:1959,gender:"female"},{id:7,name:"Nannie",lastName:"Frost",number:8,birthYear:1990,gender:"female"},{id:8,name:"Cristina",lastName:"Spence",number:9,birthYear:1985,gender:"female"},{id:9,name:"Le",lastName:"Shepard",number:10,birthYear:1976,gender:"male"},{id:10,name:"Noel",lastName:"Ortega",number:11,birthYear:2e3,gender:"male"},{id:11,name:"Tabitha",lastName:"Mercer",number:12,birthYear:1984,gender:"female"},{id:12,name:"Lydia",lastName:"Carson",number:13,birthYear:1955,gender:"female"},{id:13,name:"Josefina",lastName:"Francis",number:14,birthYear:1958,gender:"female"},{id:14,name:"Kayla",lastName:"Sosa",number:15,birthYear:1955,gender:"female"},{id:15,name:"Ester",lastName:"Bonner",number:16,birthYear:1991,gender:"female"},{id:16,name:"Leta",lastName:"Savage",number:17,birthYear:1966,gender:"female"},{id:17,name:"Walton",lastName:"Reeves",number:18,birthYear:1990,gender:"male"},{id:18,name:"Bertha",lastName:"Roach",number:19,birthYear:1965,gender:"female"},{id:19,name:"Josefa",lastName:"Stanley",number:20,birthYear:1962,gender:"female"},{id:20,name:"Coleman",lastName:"Rutledge",number:21,birthYear:1993,gender:"male"},{id:21,name:"Mcpherson",lastName:"Smith",number:22,birthYear:1976,gender:"male"},{id:22,name:"Harper",lastName:"Klein",number:23,birthYear:1989,gender:"male"},{id:23,name:"Roberts",lastName:"Ortiz",number:24,birthYear:1972,gender:"male"},{id:24,name:"Simmons",lastName:"Kramer",number:25,birthYear:1951,gender:"male"},{id:25,name:"Jacobs",lastName:"Cabrera",number:26,birthYear:1989,gender:"male"},{id:26,name:"Natasha",lastName:"Nelson",number:27,birthYear:1999,gender:"female"},{id:27,name:"Mendoza",lastName:"Jensen",number:28,birthYear:1977,gender:"male"},{id:28,name:"Beasley",lastName:"Shaffer",number:29,birthYear:1954,gender:"male"},{id:29,name:"Kenya",lastName:"Sharp",number:30,birthYear:1970,gender:"female"},{id:30,name:"Francine",lastName:"Nicholson",number:31,birthYear:1990,gender:"female"},{id:31,name:"Parker",lastName:"Daniels",number:32,birthYear:1993,gender:"male"},{id:32,name:"Charles",lastName:"Hoffman",number:33,birthYear:1950,gender:"male"},{id:33,name:"Chaney",lastName:"Gilbert",number:34,birthYear:1973,gender:"male"},{id:34,name:"Wiggins",lastName:"Jarvis",number:35,birthYear:1989,gender:"male"},{id:35,name:"Davenport",lastName:"Kirby",number:36,birthYear:1959,gender:"male"},{id:36,name:"Mavis",lastName:"Copeland",number:37,birthYear:1959,gender:"female"},{id:37,name:"Sabrina",lastName:"Murray",number:38,birthYear:1995,gender:"female"},{id:38,name:"Annette",lastName:"Luna",number:39,birthYear:1975,gender:"female"},{id:39,name:"Casey",lastName:"Matthews",number:40,birthYear:1981,gender:"male"},{id:40,name:"Diana",lastName:"Haley",number:41,birthYear:1985,gender:"female"},{id:41,name:"Patti",lastName:"Alston",number:42,birthYear:1970,gender:"female"},{id:42,name:"Beatriz",lastName:"Slater",number:43,birthYear:1954,gender:"female"},{id:43,name:"Bonita",lastName:"Wagner",number:44,birthYear:1998,gender:"female"},{id:45,name:"Janoosh",lastName:"Polack",number:451,birthYear:1958,gender:"male"}],me=Object(b.b)({name:"players",initialState:ce,reducers:{register:function(e,t){return r=e,i=t.payload,Object(m.k)(r,n.a(Object(a.a)(Object(a.a)({},i),{},{id:l(r)})));var r,i},changeInfo:function(e,t){return r=e,a=t.payload,Object(m.k)(r,n.h(Object(m.k)(r,n.c((function(e){return e.id===a.id})),d.a((function(){return-1}),(function(e){return e}))),a),d.a((function(){return r}),(function(e){return e})));var r,a}}}),le=me.actions,se=(le.register,le.changeInfo,me.reducer),be=[{id:0,name:"Start",type:"start"},{id:1,name:"Checkpoint I",type:"checkpoint"},{id:2,name:"Checkpoint II",type:"checkpoint"},{id:3,name:"Finish",type:"end"}],ue=Object(b.b)({name:"timeKeepers",initialState:be,reducers:{add:function(e,t){return r=e,i=t.payload,Object(m.k)(r,n.a(Object(a.a)(Object(a.a)({},i),{},{id:l(r)})));var r,i},remove:function(e,t){return r=e,a=t.payload.id,s(r,a);var r,a}}}),oe=ue.actions,he=(oe.add,oe.remove,ue.reducer),fe=Object(b.a)({reducer:{players:se,timeKeepers:he,timeStamps:g}});r(53);ie.a.render(Object(I.jsx)(v.a.StrictMode,{children:Object(I.jsx)(P.a,{store:fe,children:Object(I.jsx)(ae,{})})}),document.getElementById("root")),de()}},[[54,1,2]]]);
//# sourceMappingURL=main.c3c16e5e.chunk.js.map