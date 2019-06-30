<template>
	<div class="app-container">
		<div class="filter-container">
		
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

			<el-table-column label="管理员名称" width="110px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.username }}</span>
				</template>
			</el-table-column>


			<el-table-column label="创建时间" width="160px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>

			<el-table-column label="级别（个数）" width="120px">
				<template slot-scope="{row}">
					<span class="link-type" @click="handleUpdate(row)">{{ row.level }}</span>
				</template>
			</el-table-column>
			<el-table-column label="QQ" min-width="100px">
				<template slot-scope="{row}">
					<span class="link-type" @click="handleUpdate(row)">{{ row.qq }}</span>
				</template>
			</el-table-column>
			<el-table-column label="email" min-width="100px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.email }}</span>
				</template>
			</el-table-column>
			<el-table-column label="电话号码" min-width="110px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.telephone }}</span>
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
			
				<el-form-item label="username" v-if = temp.status>
					<el-input v-model="temp.username" />
				</el-form-item>
			
			
			
			
				<el-form-item label="QQ">
					<el-input v-model="temp.qq" />
				</el-form-item>
				<el-form-item label="email">
					<el-input v-model="temp.email" />
				</el-form-item>
				<el-form-item label="telephone">
					<el-input v-model="temp.telephone"  />
				</el-form-item>
				<el-form-item label="password">
					<el-input v-model="temp.password"  />
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

		<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel" />
				<el-table-column prop="pv" label="Pv" />
			</el-table>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
	import { fetchList,  createDemandManager, updateDemandManager } from '@/api/demandmanager'
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
			
				showReviewer: false,
				temp: {
					id: undefined,
	
					username: '',
					createTime: '',
					level: '',
					qq: '',
					email: '',
					telephone: '',
					editor: '',
					password:'',
					status:false
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
				title = this.listQuery.title
				this.getList(title)
			},
			handleModifyStatus(row, status) {
				this.$message({
					message: '操作Success',
					type: 'success'
				})
				
				axios.post('/demanddanager/delete', {
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
		
	
			
			resetTemp() {

			},
			handleCreate() {
				this.resetTemp()
				this.temp = {
					id: undefined,
				
					username: '',
					createTime: '',
					level: '',
					qq: '',
					email: '',
					telephone: '',
					editor: '',
					password:''
				}
				this.temp.status =true
				var this_ = this
				axios.get('/role/getthings')
					.then(function(response) {
						
						this_.temp.id = response.data.id
						this_.temp.createTime = response.data.date
						this_.temp.Editor = Cookies.get("username")
						
					})
					.catch(function(error) {
						console.log(error);
					});
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})

			},
			createData(temp) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {

						createDemandManager(this.temp).then(() => {

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
			updateData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						const tempData = Object.assign({}, this.temp)

						updateDemandManager(tempData).then(() => {
							for(const v of this.list) {
								if(v.id === this.temp.id) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1, this.temp)
									break
								}
							}
							this.dialogFormVisible = false
							this.$notify({
								title: 'Success',
								message: 'Update Successfully',
								type: 'success',
								duration: 2000
							})
						})
					}
				})
			},

		
		}
	}
</script>
