const Koa = require("koa");
const app = new Koa();
const mysql = require("mysql");
//静态资源和接口
const static = require("koa-static");
const path = require("path");
const bodyparser = require("koa-bodyparser");
const router = require("koa-router")();
const query = require("./public/query");

app.use(static(path.join(process.cwd(), "public")));
app.use(bodyparser()); //ctx.request.body
app.use(router.routes());
app.use(router.allowedMethods());

//添加
router.post("/api/add", async ctx => {
  const { username, price, pic } = ctx.request.body;
  const $sql = `insert into store (username,price,pic) values (?,?,?)`;
  const $params = [username, price, pic];
  const result = await query($sql, $params);
  if (result.msg==='success') {
    ctx.body = {
      code: 1,
      msg: "添加成功"
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "添加失败"
    };
  }
});
//删除
router.post("/api/del", async ctx => {
  const { id } = ctx.request.body;
  const $sql = `delete from store where id=?`;
  const $params = [id];
  const result = await query($sql, $params);
  if (result.msg==='success') {
    ctx.body = {
      code: 1,
      msg: "删除成功"
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "删除失败"
    };
  }
});
//修改
router.post("/api/deit", async ctx => {
  const { username, pic, price, id } = ctx.request.body;
  const $sql = `update store set username=?,pic=?,price=? where id=?`;
  const $params = [username, pic, price, id];
  const result = await query($sql, $params);
  if (result.msg==='success') {
    ctx.body = {
      code: 1,
      msg: "修改成功"
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "修改失败"
    };
  }
});
//查询
router.post("/api/find", async ctx => {
  const result = await query("select * from store");
  if (result.msg==='success') {
    ctx.body = {
      code: 1,
      result
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "查询失败"
    };
  }
});

router.get("/api/page", async ctx => {
  const {pagesize=0,pagecont=2}=ctx.request.query;
  const $params=[pagesize,pagecont]
  const result = await query(`select * from store limit ${pagesize},${pagecont}`,$params);
  if (result.msg==='success') {
    ctx.body = {
      code: 1,
      result
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "查询失败"
    };
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running 3000");
});
