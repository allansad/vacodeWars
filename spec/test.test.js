const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");

async function login(request, app) {
  const agent = request.agent(app);

  await agent
    .post("/login")
    .send("username=111&password=111")
    .set("Content-Type", "application/x-www-form-urlencoded");

  return agent;
}

describe("로그인 완료시", () => {
  it("홈 화면이 보여아 합니다.", async () => {
    const agent = await login(request, app);
    const res = await agent.get("/");

    expect(res.status).to.equal(200);
  });

  it("문제 화면이 보여야 합니다.", async () => {
    const agent = await login(request, app);
    const fixtures = [
      { url: "/problems/66967a72b80c253398d6a4f0", h1: "피보나치 수열" },
      { url: "/problems/66967a72b80c253398d6a4f1", h1: "서울에서 김서방 찾기" },
      { url: "/problems/66967a72b80c253398d6a4f2", h1: "수박수박수박수박수" },
      { url: "/problems/66967a72b80c253398d6a4f3", h1: "하샤드 수" },
    ];

    for (const { url, h1 } of fixtures) {
      const res = await agent.get(url);

      expect(res.status).to.equal(200);
      expect(res.text).to.include(h1);
    }
  });

  it("제출된 코드가 모든 케이스를 통과한 경우 축하 메세지가 보여야 합니다.", async () => {
    const agent = await login(request, app);
    const fixture = {
      url: "/problems/66967a72b80c253398d6a4f0",
      code: "code=function+solution%28n%29+%7B%0D%0A++if+%28n+%3D%3D%3D+1%29+return+1%3B%0D%0A++if+%28n+%3D%3D%3D+2%29+return+1%3B%0D%0A++%0D%0A++return+solution%28n+-+1%29+%2B+solution%28n+-+2%29%3B%0D%0A%7D"
    }

    const res = await agent.post(fixture.url).send(fixture.code);

    expect(res.text).to.include("축하합니다!");
  });

  it("제출된 코드가 모든 케이스를 통과하지 못한 경우 실패 메세지가 보여야 합니다.", async () => {
    const agent = await login(request, app);
    const fixture = {
      url: "/problems/66967a72b80c253398d6a4f0",
      code: "code=const+solution+%3D+function%28%29+%7B%0D%0A++%2F%2F+your+code..%0D%0A%7D%0D%0A++++++"
    }

    const res = await agent.post(fixture.url).send(fixture.code);

    expect(res.text).to.include("실패!");
  });
});

describe("로그인을 안한 경우", () => {
  it("홈 화면이 아닌 로그인 화면이 보여야 합니다.", async () => {
    await request(app)
      .get("/")
      .expect(302)
      .expect("Location", "/login");
  });

  it("문제 화면이 아닌 로그인 화면이 보여야 합니다.", async () => {
    const fixtures = [
      { url: "/problems/66967a72b80c253398d6a4f0" },
      { url: "/problems/66967a72b80c253398d6a4f1" },
      { url: "/problems/66967a72b80c253398d6a4f2" },
      { url: "/problems/66967a72b80c253398d6a4f3" },
    ];

    for (const { url } of fixtures) {
      await request(app)
        .get(url)
        .expect(302)
        .expect("Location", "/login");
    }
  });
});
