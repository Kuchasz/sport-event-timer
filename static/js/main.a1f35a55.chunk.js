(this["webpackJsonp@set/mobile"]=this["webpackJsonp@set/mobile"]||[]).push([[0],{61:function(e,t,n){},62:function(e,t,n){"use strict";n.r(t),n.d(t,"postActionsMiddleware",(function(){return Ke}));var r=n(7),a=n(10),i=n(35),c=n(24),d=n(17),m=n(0),s=Object(m.g)(a.g([Object(m.k)(i.a,d.a((function(e){return e.id})))]),a.d,c.b((function(e){return e.id})),c.a((function(){return 0}),m.j)),l=function(e,t){return Object(m.k)(e,a.b((function(e){return e.id!==t})))},o=n(18),u=[{id:0,playerId:0,timeKeeperId:0,time:8371218},{id:1,playerId:1,timeKeeperId:0,time:497679},{id:3,playerId:3,timeKeeperId:0,time:2973106},{id:4,playerId:4,timeKeeperId:0,time:3284624},{id:6,playerId:6,timeKeeperId:0,time:9102835},{id:9,playerId:9,timeKeeperId:0,time:7177585},{id:10,playerId:10,timeKeeperId:0,time:8134408},{id:11,playerId:11,timeKeeperId:0,time:5635620},{id:12,playerId:12,timeKeeperId:0,time:4980535},{id:13,playerId:13,timeKeeperId:0,time:3721598},{id:14,playerId:14,timeKeeperId:0,time:5334592},{id:18,playerId:18,timeKeeperId:0,time:591265},{id:20,timeKeeperId:0,time:5660824},{id:21,playerId:21,timeKeeperId:0,time:8767445},{id:22,playerId:22,timeKeeperId:0,time:1762512},{id:25,playerId:25,timeKeeperId:0,time:3517277},{id:26,playerId:26,timeKeeperId:0,time:5942456},{id:29,timeKeeperId:0,time:8280131},{id:30,playerId:30,timeKeeperId:0,time:6312055},{id:31,playerId:31,timeKeeperId:0,time:6214636},{id:35,playerId:35,timeKeeperId:0,time:6667701},{id:36,playerId:36,timeKeeperId:0,time:7930850},{id:37,playerId:37,timeKeeperId:0,time:1281939},{id:38,playerId:38,timeKeeperId:0,time:257523},{id:46,timeKeeperId:0,time:9301463}],b=Object(o.b)({name:"timeStamps",initialState:u,reducers:{add:function(e,t){return n=e,i=t.payload,Object(m.k)(n,a.a(Object(r.a)(Object(r.a)({},i),{},{id:s(n)})));var n,i},assignPlayer:function(e,t){return n=e,i=t.payload,Object(m.k)(n,a.f(Object(m.k)(n,a.c((function(e){return e.id===i.id})),c.a((function(){return-1}),(function(e){return e}))),(function(e){return Object(r.a)(Object(r.a)({},e),i)})),c.a((function(){return n}),(function(e){return e})));var n,i},reset:function(e,t){return n=e,r=t.payload.id,l(n,r);var n,r}}}),f=b.actions,h=f.add,j=f.reset,p=f.assignPlayer,g=b.reducer,x=n(37),O=n(8),y=n(21),N=n(1),v=n.n(N),I=n(3),w={addDigit:function(e){return function(t){return t.concat(e)}},back:function(e){return e.slice(0,-1)},reset:function(e){return""}},Y=[{char:"1",changeNumber:w.addDigit("1")},{char:"2",changeNumber:w.addDigit("2")},{char:"3",changeNumber:w.addDigit("3")},{char:"4",changeNumber:w.addDigit("4")},{char:"5",changeNumber:w.addDigit("5")},{char:"6",changeNumber:w.addDigit("6")},{char:"7",changeNumber:w.addDigit("7")},{char:"8",changeNumber:w.addDigit("8")},{char:"9",changeNumber:w.addDigit("9")},{char:"\u21ba",changeNumber:w.reset,alwaysEnabled:!0},{char:"0",changeNumber:w.addDigit("0")},{char:"\u2190",changeNumber:w.back,alwaysEnabled:!0}],K=function(e){var t=e.char,n=e.padClick,r=e.enabled,a=e.alwaysEnabled;return Object(I.jsx)("button",{onClick:n,disabled:!a&&!r,className:"disabled:opacity-20 border-gray-600 font-medium border-dashed text-2xl transition-opacity rounded-md text-gray-800 m-1.5 ",children:t})},S=function(e){return Object(I.jsx)("div",{className:"grid h-2/5 self-center w-4/5 grid-cols-3 grid-rows-4",children:Y.map((function(t){return Object(I.jsx)(K,{alwaysEnabled:t.alwaysEnabled,enabled:e.availableDigits.includes(t.char),padClick:function(){return function(t){var n=t.changeNumber(e.number);e.onNumberChange(n)}(t)},char:t.char},t.char)}))})},k=n(33),C=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return e.toLocaleString("en-US",{minimumIntegerDigits:t})},D=function(e){return"".concat(C(e.getHours()),":").concat(C(e.getMinutes()),":").concat(C(e.getSeconds()),".").concat(C(e.getMilliseconds(),3).slice(0,1))},M=function(e,t){return Object(m.k)(t,a.e(String),a.b(k.b(e)),a.e((function(t){return k.a(e.length,t.length)(t)})),a.e(k.a(0,1)),a.b((function(e){return!!e})))},A=n(32),E=function(){return Object(A.b)()},R=A.c,P=function(e){var t=e.playerNumber;return Object(I.jsxs)("div",{className:"text-gray-600 border-gray-600 flex justify-center text-2xl font-regular py-2",children:[t,"\xa0"]})},T=function(e){var t=e.player,n=e.onPlayerCheckIn;return Object(I.jsxs)("button",{onClick:function(){return n(t.id)},className:"bg-orange-500 flex mb-2 w-full px-4 py-2 items-center shadow-md rounded-md",children:[Object(I.jsx)("div",{className:"font-bold text-2xl mr-4",children:t.number}),Object(I.jsxs)("div",{children:[t.name," ",t.lastName]})]})},L=function(e){var t,n,i=e.onPlayerCheckIn,c=Object(N.useState)(""),d=Object(y.a)(c,2),s=d[0],l=d[1],o=R((function(e){return e.players})),u=R((function(e){return e.timeStamps})),b=o.map((function(e){return Object(r.a)(Object(r.a)({},e),{},{timeStamp:u.find((function(t){return t.playerId===e.id}))})})).filter((function(e){return void 0===e.timeStamp})),f=b.map((function(e){return e.number})),h=(n=f,""!==(t=s)?Object(m.k)(n,a.b(Object(m.g)(String,k.b(t)))):[]),j=b.filter((function(e){return h.includes(e.number)}));return Object(I.jsxs)("div",{className:"flex h-full flex-col",children:[Object(I.jsx)("div",{className:"flex-auto flex flex-col-reverse mx-12 mt-2 flex-wrap items-stretch overflow-hidden h-3/5",children:j.map((function(e){return Object(I.jsx)(T,{onPlayerCheckIn:function(e){i(e),l("")},player:e},e.id)}))}),Object(I.jsx)(P,{playerNumber:s}),Object(I.jsx)(S,{availableDigits:M(s,f),number:s,onNumberChange:l})]})},z=function(e){var t=e.players;return Object(I.jsx)("div",{className:"flex flex-wrap",children:t.map((function(e){return Object(I.jsx)("div",{className:"bg-gray-700 font-semibold text-2xl rounded-md px-8 py-2 m-2",children:e.number},e.number)}))})},F=n(23),H=n.n(F),J=n(20),B=function(e){e.time;var t=e.onReset;return Object(I.jsx)("button",{onClick:t,children:Object(I.jsx)(H.a,{path:J.c,size:1,color:"white"})})},_=function(e){e.timeKeeperName;var t=e.onRecord;return Object(I.jsx)("button",{onClick:t,children:Object(I.jsx)(H.a,{path:J.b,size:1,color:"white"})})},W=function(e){var t=e.players,n=e.timeKeeperName,r=e.onTimeRecord,a=e.onTimeReset,i=function(e){return function(){return r(e)}};return Object(I.jsx)("div",{className:"px-4 text-black",children:t.map((function(e){return Object(I.jsxs)("div",{className:"py-5 flex",children:[Object(I.jsx)("span",{className:"text-3xl mr-4",children:C(e.number,3)}),Object(I.jsxs)("span",{className:"flex-grow",children:[Object(I.jsx)("div",{className:"text-lg font-semibold ",children:Object(I.jsx)("span",{children:e.timeStamp?D(new Date(e.timeStamp.time)):"- - - - - - -"})}),Object(I.jsxs)("div",{className:"opacity-50 text-sm",children:[e.name," ",e.lastName]})]}),Object(I.jsx)("span",{className:"bg-gray-300 flex items-center rounded-md px-2 py-1 self-center text-white",children:e.timeStamp?Object(I.jsx)(B,{time:e.timeStamp.time,onReset:(t=e.timeStamp.id,function(){return a(t)})}):Object(I.jsx)(_,{timeKeeperName:n,onRecord:i(e.id)})}),e.timeStamp&&Object(I.jsxs)(I.Fragment,{children:[" ",Object(I.jsx)("span",{className:"ml-1 bg-gray-300 flex items-center rounded-md px-2 py-1 self-center text-white",children:Object(I.jsx)(H.a,{path:J.h,size:1,color:"white"})}),Object(I.jsx)("span",{className:"ml-1 bg-gray-300 flex items-center rounded-md px-2 py-1 self-center text-white",children:Object(I.jsx)(H.a,{path:J.a,size:1,color:"white"})})]})]},e.number);var t}))})},G=n(44),U=n(42),q=n.n(U),Q=function(e){return Object(G.a)(e).sort((function(e,t){return t.time-e.time}))},V=function(e){var t=e.times,n=e.onAddTime,r=Object(N.useState)(),a=Object(y.a)(r,2),i=a[0],c=a[1],d=q()({bindTo:document.getElementById("module-holder")}).Portal,m=E();return Object(I.jsxs)("div",{children:[void 0!==i&&Object(I.jsx)(d,{children:Object(I.jsx)("div",{className:"absolute inset-0 h-full w-full bg-orange-100",children:Object(I.jsx)(L,{onPlayerCheckIn:function(e){m(p({playerId:e,id:i})),c(void 0)}})})}),Object(I.jsx)("div",{className:"flex flex-col mt-2",children:Object(I.jsx)("button",{onClick:n,className:"self-end rounded-md text-center w-40 bg-orange-500 py-2 px-4",children:"ADD RECORD"})}),Q(t).map((function(e){return Object(I.jsxs)("div",{className:"flex justify-between my-2",children:[Object(I.jsx)("span",{className:"text-gray-600",children:D(new Date(e.time))}),e.player?Object(I.jsx)("div",{className:"rounded-md text-center w-40 bg-gray-500 py-2 px-4",children:e.player.number}):Object(I.jsx)("button",{onClick:function(){return c(e.id)},className:"hover:bg-orange-500 hover:text-white hover:border-transparent rounded-md text-center w-40 border-dashed border-2 font-semibold text-gray-500 border-gray-500 py-2 px-4",children:"CHOOSE PLAYER"})]},e.id)}))]})},X=n(54)("wss://wss.set-hub.pyszstudio.pl",{transports:["websocket"]}),Z=[],$=function(e){return Z.forEach((function(t){return t(e)}))};X.on("connect",(function(){$("connected")})),X.on("disconnect",(function(e){$("disconnected")})),X.on("connect_failed",(function(){$("disconnected")})),X.io.on("error",(function(){$("error")})),X.io.on("reconnect",(function(e){$("connected")})),X.io.on("reconnect_error",(function(e){$("reconnecting")})),X.io.on("reconnect_attempt",(function(e){$("reconnecting")})),X.io.on("reconnect_failed",(function(){$("disconnected")}));var ee=function(e){var t=e.time;return Object(I.jsx)("div",{className:"w-24 text-xl",children:D(t)})},te=function(){var e=Object(N.useState)(new Date),t=Object(y.a)(e,2),n=t[0],r=t[1];return Object(N.useEffect)((function(){setInterval((function(){return r(new Date)}),10)}),[]),Object(I.jsx)(ee,{time:n})},ne=function(e){switch(e){case"connected":return J.d;case"disconnected":return J.e;case"error":return J.f;case"reconnecting":return J.g;default:throw new Error("not handled connection state")}},re=function(e){var t=e.timeKeeperName,n=Object(N.useState)("disconnected"),r=Object(y.a)(n,2),a=r[0],i=r[1];return Object(N.useEffect)((function(){var e,t=(e=i,Z.push(e),function(){Z.splice(Z.indexOf(e),1)});return function(){return t()}}),[]),Object(I.jsxs)("div",{className:"px-5 w-screen flex-shrink-0 flex items-center justify-between bg-white font-semibold text-black border h-10",children:[Object(I.jsx)("span",{children:t}),Object(I.jsx)(te,{}),Object(I.jsx)(H.a,{path:ne(a),size:1})]})},ae=n.p+"static/media/dialpad.d813f511.svg",ie=n.p+"static/media/dots-grid.57b82462.svg",ce=n.p+"static/media/format-list-numbered.942f2bdf.svg",de=n.p+"static/media/timetable.ff6bd1a7.svg",me=function(e){var t=e.text,n=e.mode,r=e.icon,a=n===e.chosenMode?"opacity-100":"opacity-20";return Object(I.jsxs)(x.b,{to:"".concat("/sport-event-timer","/").concat(n),className:"".concat(a," transition-opacity flex flex-col items-center px-4 py-2 mr-4"),children:[Object(I.jsx)("img",{src:r,height:"20",width:"20",alt:""}),Object(I.jsx)("p",{className:"text-xs font-semibold",children:t})]})},se=function(){var e=Object(O.f)().pathname.split("/sport-event-timer")[1].slice(1);return Object(I.jsxs)("div",{className:"flex justify-around text-black",children:[Object(I.jsx)(me,{mode:"list",text:"List",icon:ce,chosenMode:e}),Object(I.jsx)(me,{mode:"grid",text:"Grid",icon:ie,chosenMode:e}),Object(I.jsx)(me,{mode:"pad",text:"Pad",icon:ae,chosenMode:e}),Object(I.jsx)(me,{mode:"times",text:"Times",icon:de,chosenMode:e})]})};var le=function(){var e=R((function(e){return e.players})),t=R((function(e){return e.timeStamps})),n=R((function(e){return e.timeKeepers})),a=E(),i=e.map((function(e){return Object(r.a)(Object(r.a)({},e),{},{timeStamp:t.find((function(t){return t.playerId===e.id}))})})),c=t.map((function(t){return Object(r.a)(Object(r.a)({},t),{},{player:e.find((function(e){return t.playerId===e.id}))})}));return Object(I.jsx)(x.a,{children:Object(I.jsxs)("div",{className:"bg-orange-100 flex flex-col overflow-hidden h-full w-screen text-white",children:[Object(I.jsx)(re,{timeKeeperName:"Start"}),Object(I.jsx)("div",{id:"module-holder",className:"relative overflow-hidden flex-col flex-1",children:Object(I.jsx)("div",{className:"h-full flex-1 overflow-y-scroll",children:Object(I.jsxs)(O.c,{children:[Object(I.jsx)(O.a,{exact:!0,path:"".concat("/sport-event-timer","/list"),children:Object(I.jsx)(W,{onTimeRecord:function(e){return a(h({playerId:e,timeKeeperId:0,time:(new Date).getTime()}))},onTimeReset:function(e){return a(j({id:e}))},timeKeeperName:n[0].name,players:i})}),Object(I.jsx)(O.a,{exact:!0,path:"".concat("/sport-event-timer","/grid"),children:Object(I.jsx)(z,{players:e})}),Object(I.jsx)(O.a,{exact:!0,path:"".concat("/sport-event-timer","/pad"),children:Object(I.jsx)(L,{onPlayerCheckIn:function(e){a(h({playerId:e,timeKeeperId:0,time:(new Date).getTime()}))}})}),Object(I.jsx)(O.a,{exact:!0,path:"".concat("/sport-event-timer","/times"),children:Object(I.jsx)(V,{onAddTime:function(){a(h({timeKeeperId:0,time:(new Date).getTime()}))},times:c})})]})})}),Object(I.jsx)("div",{children:Object(I.jsx)(se,{})})]})})},oe=n(29),ue=n.n(oe),be=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,63)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,i=t.getLCP,c=t.getTTFB;n(e),r(e),a(e),i(e),c(e)}))},fe=[{id:0,name:"Horne",lastName:"Huber",number:1,birthYear:1974,gender:"male"},{id:1,name:"Tonia",lastName:"Lindsey",number:2,birthYear:1993,gender:"female"},{id:2,name:"Eaton",lastName:"Head",number:3,birthYear:1974,gender:"male"},{id:3,name:"Humphrey",lastName:"Clayton",number:4,birthYear:1988,gender:"male"},{id:4,name:"Caitlin",lastName:"Lancaster",number:5,birthYear:1980,gender:"female"},{id:5,name:"Stout",lastName:"Jenkins",number:6,birthYear:1975,gender:"male"},{id:6,name:"Nichole",lastName:"Randolph",number:7,birthYear:1959,gender:"female"},{id:7,name:"Nannie",lastName:"Frost",number:8,birthYear:1990,gender:"female"},{id:8,name:"Cristina",lastName:"Spence",number:9,birthYear:1985,gender:"female"},{id:9,name:"Le",lastName:"Shepard",number:10,birthYear:1976,gender:"male"},{id:10,name:"Noel",lastName:"Ortega",number:11,birthYear:2e3,gender:"male"},{id:11,name:"Tabitha",lastName:"Mercer",number:12,birthYear:1984,gender:"female"},{id:12,name:"Lydia",lastName:"Carson",number:13,birthYear:1955,gender:"female"},{id:13,name:"Josefina",lastName:"Francis",number:14,birthYear:1958,gender:"female"},{id:14,name:"Kayla",lastName:"Sosa",number:15,birthYear:1955,gender:"female"},{id:15,name:"Ester",lastName:"Bonner",number:16,birthYear:1991,gender:"female"},{id:16,name:"Leta",lastName:"Savage",number:17,birthYear:1966,gender:"female"},{id:17,name:"Walton",lastName:"Reeves",number:18,birthYear:1990,gender:"male"},{id:18,name:"Bertha",lastName:"Roach",number:19,birthYear:1965,gender:"female"},{id:19,name:"Josefa",lastName:"Stanley",number:20,birthYear:1962,gender:"female"},{id:20,name:"Coleman",lastName:"Rutledge",number:21,birthYear:1993,gender:"male"},{id:21,name:"Mcpherson",lastName:"Smith",number:22,birthYear:1976,gender:"male"},{id:22,name:"Harper",lastName:"Klein",number:23,birthYear:1989,gender:"male"},{id:23,name:"Roberts",lastName:"Ortiz",number:24,birthYear:1972,gender:"male"},{id:24,name:"Simmons",lastName:"Kramer",number:25,birthYear:1951,gender:"male"},{id:25,name:"Jacobs",lastName:"Cabrera",number:26,birthYear:1989,gender:"male"},{id:26,name:"Natasha",lastName:"Nelson",number:27,birthYear:1999,gender:"female"},{id:27,name:"Mendoza",lastName:"Jensen",number:28,birthYear:1977,gender:"male"},{id:28,name:"Beasley",lastName:"Shaffer",number:29,birthYear:1954,gender:"male"},{id:29,name:"Kenya",lastName:"Sharp",number:30,birthYear:1970,gender:"female"},{id:30,name:"Francine",lastName:"Nicholson",number:31,birthYear:1990,gender:"female"},{id:31,name:"Parker",lastName:"Daniels",number:32,birthYear:1993,gender:"male"},{id:32,name:"Charles",lastName:"Hoffman",number:33,birthYear:1950,gender:"male"},{id:33,name:"Chaney",lastName:"Gilbert",number:34,birthYear:1973,gender:"male"},{id:34,name:"Wiggins",lastName:"Jarvis",number:35,birthYear:1989,gender:"male"},{id:35,name:"Davenport",lastName:"Kirby",number:36,birthYear:1959,gender:"male"},{id:36,name:"Mavis",lastName:"Copeland",number:37,birthYear:1959,gender:"female"},{id:37,name:"Sabrina",lastName:"Murray",number:38,birthYear:1995,gender:"female"},{id:38,name:"Annette",lastName:"Luna",number:39,birthYear:1975,gender:"female"},{id:39,name:"Casey",lastName:"Matthews",number:40,birthYear:1981,gender:"male"},{id:40,name:"Diana",lastName:"Haley",number:41,birthYear:1985,gender:"female"},{id:41,name:"Patti",lastName:"Alston",number:42,birthYear:1970,gender:"female"},{id:42,name:"Beatriz",lastName:"Slater",number:43,birthYear:1954,gender:"female"},{id:43,name:"Bonita",lastName:"Wagner",number:44,birthYear:1998,gender:"female"},{id:45,name:"Janoosh",lastName:"Polack",number:451,birthYear:1958,gender:"male"}],he=Object(o.b)({name:"players",initialState:fe,reducers:{register:function(e,t){return n=e,i=t.payload,Object(m.k)(n,a.a(Object(r.a)(Object(r.a)({},i),{},{id:s(n)})));var n,i},changeInfo:function(e,t){return n=e,r=t.payload,Object(m.k)(n,a.h(Object(m.k)(n,a.c((function(e){return e.id===r.id})),c.a((function(){return-1}),(function(e){return e}))),r),c.a((function(){return n}),(function(e){return e})));var n,r}}}),je=he.actions,pe=(je.register,je.changeInfo,he.reducer),ge=[{id:0,name:"M0",maxAge:20,gender:"male"},{id:1,name:"M1",maxAge:30,minAge:21,gender:"male"},{id:2,name:"M2",maxAge:40,minAge:31,gender:"male"},{id:3,name:"M3",minAge:41,gender:"male"},{id:4,name:"K0",maxAge:20,gender:"female"},{id:5,name:"K1",minAge:21,maxAge:30,gender:"female"},{id:6,name:"K2",minAge:31,gender:"female"}],xe=Object(o.b)({name:"raceCategories",initialState:ge,reducers:{add:function(e,t){return n=e,i=t.payload,Object(m.k)(n,a.a(Object(r.a)(Object(r.a)({},i),{},{id:s(n)})));var n,i},remove:function(e,t){return n=e,r=t.payload.id,l(n,r);var n,r}}}),Oe=xe.actions,ye=(Oe.add,Oe.remove,xe.reducer),Ne=[{id:0,name:"Start",type:"start"},{id:1,name:"Checkpoint I",type:"checkpoint"},{id:2,name:"Checkpoint II",type:"checkpoint"},{id:3,name:"Finish",type:"end"}],ve=Object(o.b)({name:"timeKeepers",initialState:Ne,reducers:{add:function(e,t){return n=e,i=t.payload,Object(m.k)(n,a.a(Object(r.a)(Object(r.a)({},i),{},{id:s(n)})));var n,i},remove:function(e,t){return n=e,r=t.payload.id,l(n,r);var n,r}}}),Ie=ve.actions,we=(Ie.add,Ie.remove,{players:pe,timeKeepers:ve.reducer,timeStamps:g,raceCategories:ye});Object(o.a)({reducer:we}),n(61);X.on("receive-action",(function(e){return Se.dispatch(Object(r.a)(Object(r.a)({},e),{},{__remote:!0}))}));var Ye,Ke=function(e){return function(e){return function(t){!t.__remote&&X.connected&&X.emit("post-action",t),e(t)}}},Se=(Ye=[Ke],Object(o.a)({reducer:we,middleware:function(e){return e().concat(Ye)}}));ue.a.render(Object(I.jsx)(v.a.StrictMode,{children:Object(I.jsx)(A.a,{store:Se,children:Object(I.jsx)(le,{})})}),document.getElementById("root")),be()}},[[62,1,2]]]);
//# sourceMappingURL=main.a1f35a55.chunk.js.map