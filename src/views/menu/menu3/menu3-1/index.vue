<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder=""
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >Search</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add</el-button>
    </div>
    <br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.schoolname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="路线" min-width="150px">
        <template slot-scope="{row}">
          <span>
            <a>{{ row.route  }}</a>
          </span>
        </template>
      </el-table-column>
       <el-table-column label="编辑者" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Editor }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.status!='deleted'"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >Edit</el-button>

          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'deleted')"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="130px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="路线（通过,分割）">
          <el-input v-model="temp.route"/>
        </el-form-item>
        <el-form-item label="学校名称">
          <el-input v-model="temp.schoolname"/>
        </el-form-item>
          
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
        
          type="primary"
          @click="dialogStatus==='create'?createData('temp'):updateData()"
        >Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createRoad, updateRoad } from "@/api/road";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import axios from "axios";
import Cookies from 'js-cookie'
import { request } from 'http';





export default {
  name: "ComplexTable",
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: '',
        type: undefined,
        sort: "+id"
      },
      showReviewer: false,
      temp: {
        id: undefined,
        schoolname: "",
        createTime: "",
        title: "",
        route:'',
        editor:Cookies.get("username"),
        status:false
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],

      downloadLoading: false,

    };
  },
  created() {
    this.getList();
  },
  methods: {



    getList(data) {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        console.log(data);
        console.log(response.data);
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.2 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      var title;
      title = this.listQuery.title;
      this.getList(title);
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      console.log("sss");
      axios
        .post("/road/delect", {
          status: "delete",
          id: row.id
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      row.status = status;
    },
  

    resetTemp() {},
    handleCreate() {
      this.resetTemp();

      this.temp = {
        id: "",
        remark: "",
        createTime: "",
        title: "",
        status: false,
        type: "",
        editor: ""
      };

      var this_ = this;
      axios
        .get("/road/getthings")
        .then(function(response) {
          this_.temp.id = response.data.id;
          this_.temp.createTime = response.data.date;
          this_.temp.Editor = Cookies.get("username");      //前端更新显示，并未从后端获取，但是数据和后台一样
       
        })
        .catch(function(error) {
          console.log(error);
        });

      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(temp) {
      this.temp.status =true
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createRoad(this.temp).then(() => {
            
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
        location.reload();
      });
    },
    handleUpdate(row) {
      
      this.temp.status =true
      var this_ = this
      this.temp = Object.assign({}, row); // copy obj

      this_.temp.Editor = Cookies.get("username");

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRoad(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },

   
  }
};
</script>
