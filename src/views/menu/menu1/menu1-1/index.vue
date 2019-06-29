<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.title"  style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				Search
			</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
				edit
			</el-button>

		</div>
		<br />
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
			
	
		</el-table>

	

	</div>
</template>

<script>
	import { fetchList, fetchPv, createRole, updateRole } from '@/api/role'
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
				
				axios.post('/role/delete', {
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

						createRole(this.temp).then(() => {

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

						updateRole(tempData).then(() => {
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
