// const express = require("express");
// // require: node module을 어딘가에서 가져옴
// //(express라는 이름의 폴더를 내 파일 속에서 찾음, 못찾으면 node_modules 폴더에서 찾음)
// // node.js의 장점 -> 작은 블록 단위 작업 가능, 설치하고 원하는 것을 import, require하면 됌.

import express from "express";
import morgan from "morgan"; //로그(무슨 일이 어디서 일어났는지)를 저장하는 middleware
import helmet from "helmet"; // node.js 앱의 보안 요소 추가
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; // form을 받았을 때, 그 데이터를 갖고 있는 request object에 접근할 수 있길 원할 때 사용
//cookie와 body를 다루는 걸 도와줌
// body로부터 정보를 얻을 수 있게 해줌
//cookie에 session을 다루기 위해 유저 정보 저장
import { localsMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

const app = express();
//const app에 express를 실행해서 담은 것
// middleware : 원하는 만큼 가질 수 있음, 유저의 로그인 여부 체크,
//파일 전송할 때 중간에서 가로채기, 접속에 대한 로그를 작성

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
// middleware는  res.send를 실행하는 함수를 발동하면 연결을 끊을 수도 있음
// 서버를 설정하는 내용
app.use(cookieParser()); // 서버가 유저로부터 받은 cookie를 이해하는 방법
app.use(bodyParser.json()); // 서버가 유저로부터 받은 데이터를 이해하는 방법(json이나 html)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev")); // middleware 마운트할 때 사용

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter); // use : 누군가 이 경로에 들어오면 이 router 전체를 사용하겠다는 의미
app.use(routes.videos, videoRouter);

export default app;
