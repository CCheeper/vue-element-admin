<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.username"  style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				Search
			</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
				Add
			</el-button>
			

		</div>
		<br />
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
			
			<el-table-column label="ID" prop="id" sortable="custom" align="center" width="100">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column label="标题" width="110px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.title }}</span>
				</template>
			</el-table-column>


			<el-table-column label="信息" width="160px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.message }}</span>
				</template>
			</el-table-column>

<el-table-column label="修改时间" width="160px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.lasttime }}</span>
				</template>
			</el-table-column>
			
			<el-table-column label="编辑者" width="160px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.edtiorid }}</span>
          	</template>
            </el-table-column>
		
		
			

			<el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
          <el-button v-if="row.status!='deleted'" type="primary" size="mini" @click="handleUpdate(row)">
						Edit
					</el-button>
					<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
						Delete
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm"  :model="temp" label-position="left" label-width="170px" style="width: 400px; margin-left:50px;">
			
				<el-form-item label="标题">
					<el-input v-model="temp.title" />
				</el-form-item>

				<el-form-item label="信息">
					<el-input v-model="temp.message"   :autosize="{ minRows: 4, maxRows: 6}" type="textarea"/>
				</el-form-item>
		
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="dialogStatus==='create'?createData('temp'):updateData()">
					Confirm
				</el-button>
			</div>
		</el-dialog>
	
	</div>
</template>

<script>
	import { fetchList, fetchPv, fetchWorkdunamic,createWorkdynamic} from '@/api/workdynamic'
	import waves from '@/directive/waves' // waves directive
	import { parseTime } from '@/utils'
	import Pagination from '@/components/Pagination' // secondary package based on el-pagination
	import axios from 'axios'
	import Cookies from 'js-cookie'
	

	export default {
		name: 'ComplexTable',
		components: {
			Pagination
		},
		directives: {
			waves
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'info',
					deleted: 'danger'
				}
				return statusMap[status]
			},
			typeFilter(type) {
				return calendarTypeKeyValue[type]
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
					title: '',
					type: undefined,
					sort: '+id'
				},
				sortOptions: [{
					label: 'ID Ascending',
					key: '+id'
				}, {
					label: 'ID Descending',
					key: '-id'
				}],
				showReviewer: false,
				temp: {
					id: '',
					title: '',
					message: '',
					lasttime: '',
					editorid: '',
					
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: 'Edit',
					create: 'Create'
				},
				dialogPvVisible: false,
				pvData: [],



				downloadLoading: false
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList(data) {
				this.listLoading = true
				fetchList(this.listQuery).then(response => {
					console.log(data)
					console.log(response.data)
					this.list = response.data.items
					this.total = response.data.total


					setTimeout(() => {
						this.listLoading = false
					}, 1.5 * 1000)
				})
			},
			handleFilter() {
				this.listQuery.page = 1
				var title
				title = this.listQuery.username
				this.getList(title)
			},
			handleModifyStatus(row, status) {
				this.$message({
					message: '操作Success',
					type: 'success'
				})
				
				axios.post('/workdynamic/delete', {
						id: row.id
					})
					.then(function(response) {
						console.log(response);
					})
					.catch(function(error) {
						console.log(error);
					});
				row.status = status

			},
			sortChange(data) {
				const {
					prop,
					order
				} = data
				if(prop === 'id') {
					this.sortByID(order)
				}
			},
			sortByID(order) {
				if(order === 'ascending') {
					this.listQuery.sort = '+id'
				} else {
					this.listQuery.sort = '-id'
				}
				this.handleFilter()
			},

	
			
			resetTemp() {

			},
			handleCreate() {
				this.resetTemp()
				this.temp = {
				  id: '',
					title: '',
					message: '',
					lasttime: '',
					editorid: ''
				}
				this.temp.status =true
				var this_ = this
				
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})

			},
			createData(temp) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {

						createWorkdynamic(this.temp).then(() => {

							this.list.unshift(this.temp)
							this.dialogFormVisible = false
							this.$notify({
								title: 'Success',
								message: 'Created Successfully',
								type: 'success',
								duration: 2000
							})
						})
					}
				})
			},
			handleUpdate(row) {
				var this_ = this
				this.temp = Object.assign({}, row) // copy obj

				this_.temp.Editor = Cookies.get("username")
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			

			handleFetchPv(pv) {
				fetchPv(pv).then(response => {
					this.pvData = response.data.pvData
					this.dialogPvVisible = true
				})
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					if(j === 'timestamp') {
						return parseTime(v[j])
					} else {
						return v[j]
					}
				}))
			}
		}
	}
</script>
