
/**
 */
import vue from '../main.js'


export default {
    async apiFetchModules() {
        return ''
    },
    async getAllModules() {
        var promise = new Promise((resolve) => {
            vue.HTTP.get(`/api/module/all/`)
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
    async apiSaveModule(module_data) {
        var promise = new Promise((resolve) => {
            console.log(module_data)
            vue.HTTP.post(`api/module/${module_data.username}/`, {module: module_data})
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
    // getModuleData: function() {
    //     var self = this;
    //     self.HTTP.get(`/api/module/${self.user.username}/`)
    //         .then(response => {
    //             // console.log(response, response.data)
    //             if (response.data) {
    //                 // console.log(response.data)
    //                 self.saved_modules = response.data
    //                 // console.log(self.saved_modules)
    //             }
    //             this.loading = false
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             this.errored = true
    //             this.loading = false
    //             return null
    //         })
    //         .finally(() => this.loading = false)
    // },
}