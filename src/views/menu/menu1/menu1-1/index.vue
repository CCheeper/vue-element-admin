<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:30px">
      <el-input
        v-model="listQuery.title"
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
      >edit</el-button>
    </div>
    <br>
    <template v-if="listQuery.status" true-label="true" false-label="false">
      <el-checkbox-group
        v-model="listQuery.checkList"
        style=" border-radius: 4px;border: 1px solid #d7dae2; width: 412px;"
      >
        <el-checkbox
          label="power_edit"
          style="margin-bottom:14px; margin-left:20px;margin-top:20px"
        >权限管理</el-checkbox>
        <br>

        <el-checkbox label="role_edit" style="margin-bottom:14px; margin-left:20px;">角色管理</el-checkbox>

        <br>
        <el-checkbox label="school_edit" style="margin-bottom:14px; margin-left:20px;">学校管理</el-checkbox>

        <br>
        <el-checkbox label="road_edit" style="margin-bottom:14px; margin-left:20px;">路线管理</el-checkbox>
        <br>

        <el-checkbox label="workdata_edit" style="margin-bottom:14px; margin-left:20px;">工作动态</el-checkbox>
        <br>

        <el-checkbox label="helpZ_edit" style="margin-bottom:14px; margin-left:20px;">援藏政策</el-checkbox>
        <br>
        <el-checkbox label="helppeople_edit" style="margin-bottom:14px; margin-left:20px;">援藏人员</el-checkbox>
        <br>
        <el-checkbox label="need_edit" style="margin-bottom:14px; margin-left:20px;">需求管理</el-checkbox>
        <br>
        <el-checkbox label="personal_edit" style="margin-bottom:14px; margin-left:20px;">人才引进</el-checkbox>
      </el-checkbox-group>
    </template>
  </div>
</template>

	

	</div>
</template>

<script>
import { searchUser, editUserPower } from "@/api/power";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import axios from "axios";
import Cookies from "js-cookie";

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
        title: "",
         checkList: [],
        status: false
      },

      showReviewer: false,

      dialogFormVisible: false,
      dialogStatus: "",

      dialogPvVisible: false,
      pvData: [],

      downloadLoading: false
    };
  },

  methods: {


   
    handleCreate() {
     
      editUserPower(this.listQuery).then(response => {
        this.$message({
          message: "操作Success",
          type: "success"
        });
      });
    },

   

    handleFilter() {
      searchUser(this.listQuery).then(response => {
        this.listQuery.checkList = response.data.list;
        this.listQuery.status = response.data.status;

        console.log(this.listQuery.checkList, "asdasdasdasd");
      });
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
    }
  }
};
</script>
