
/**
 */
import vue from '../main.js'


export default {
    async apiFetchTask() {
        return ''
    },
    async getAllTasks(module_id) {
        var promise = new Promise((resolve) => {
            vue.HTTP.get(`/api/module/${module_id}/task/all/`)
                .then(response => {
                    if (response.data) {
                        resolve(response.data)
                    }
                })
                .catch(error => {
                    console.log(error)
                    return null
                })
                .finally(() => this.loading = false)
        })
        return await promise;
    },
    async apiSaveTask(task_data) {
        var promise = new Promise((resolve) => {
            console.log(task_data)
            vue.HTTP.post(`api/module/${task_data.module_id}/task/${task_data.username}/`, {task: task_data})
            .then(response => {
                console.log(response)
                if (response.data) {
                    console.log(response.data)
                    resolve(response.data)
                }
                this.loading = false
                // self.$bvModal.hide('createModuleModel')
            })
            .catch(error => {
                console.log(error)
                this.errored = true
                this.loading = false
                resolve(null)
            })
            .finally(() => this.loading = false)
        })

        return await promise;
    },
}