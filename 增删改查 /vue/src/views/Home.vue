<template>
  <div class="home">
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
      icon="el-icon-edit"
      style="margin-left:550px"
      >添加</el-button
    >

    <el-dialog title="商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-input v-model="pic" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="图片"
        ><template slot-scope="scope">
          <img :src="scope.row.pic" class="pic" />
        </template>
      </el-table-column>

      <el-table-column label="商品名称" prop="username"> </el-table-column>
      <el-table-column label="价格" prop="price"> </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="arr"
        :page-size="num"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDatas.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  components: {},
  data() {
    return {
      //分页页数
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 1, //input
      currentPage4: 1, //当期那页数
      pagenum: 0, //总页数
      tableData: [],
      tableDatas: [],
      pagesize: 0,
      num: 5,
      arr: [5, 10, 15, 20],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        pic: "",
        username: "",
        price: "",
        id: 0
      },
      formLabelWidth: "120px",
      search: "",
      pic: "",
      username: "",
      price: ""
    };
  },
  methods: {
    handleEdit(index, row) {
      this.id = index.id;
      this.pic = index.pic;
      this.username = index.username;
      this.price = index.price;
      //编辑按钮
      console.log(index, row);
      axios
        .post("/api/deit")
        .then(res => {
          console.log("编辑");
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      //删除按钮
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("/api/del", { id: row.id })
            //删除
            .then(res => {
              console.log("删除成功");
              axios.post("/api/find").then(res => {
                this.tableData = res.data.result.data;
              });
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      axios
        .get(`/api/page?pagesize=${this.pagesize}&pagecont=${val}`)
        .then(res => {
          this.tableData = res.data.result.data;
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagesize = val;
      axios.get(`/api/page?pagesize=${val}&pagecont=${this.num}`).then(res => {
        this.tableData = res.data.result.data;
        console.log(res);
      });
    },
    confirm() {
      //确定按钮 区分添加还是修改
      let url = "";
      if (this.id) {
        //修改
        url = "/api/deit";
      } else {
        //添加
        url = "/api/add";
      }
      axios
        .post(url, {
          //添加
          username: this.username,
          pic: this.pic,
          price: this.price,
          ...this.from,
          id: this.id
        })
        .then(res => {
          // console.log("增加");
          this.dialogTableVisible = false;
          this.dialogFormVisible = false;
          (this.username = ""), (this.pic = ""), (this.price = "");
          axios.post("/api/find").then(res => {
            this.tableData = res.data.result.data;
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.$notify({
        title: "添加成功",
        message: "这是一条成功的提示消息",
        type: "success"
      });
    }
  },
  created() {
    axios.post("/api/find").then(res => {
      this.tableDatas = res.data.result.data;
    });
    axios
      .get(`/api/page?pagesize=${this.pagesize}&pagecont=${this.num}`)
      .then(res => {
        this.tableData = res.data.result.data;
      });
  }
};
</script>

<style lang="scss" scoped>
.pic {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
</style>
