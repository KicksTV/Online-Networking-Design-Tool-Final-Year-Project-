
// Controllers
import connController from './connectionController.js'
import netController from './networkController.js'


// Collections
import allConnections from '../collections/allConnections.js';

const validationController = (function() {
    var instance;
    
    function init() {
     
        function runValidationCheck() {
            var any_issues = false;
            var bottomPanel = window.$vue.getVueComponent('BottomPanel')
            var incorrectLinkingComp = []

            bottomPanel.consoleInfoMsg(`
            <br>----------------<br>
            RUNNING VALIDATION TEST:<br>
            ----------------<br>
            This will test if devices have been misconfigured, check if the incorrect linking component has been used between two<br>
            devices, check if the correct supernet/subnet mask has been used and correct IP address have been assigned.
            `)

            // Check for any misconfigured components

            // Checking an incorrectly used linking component
            allConnections.getAll().forEach(e => {
                if (!connController.checkValidConnection(true, e.getComponent(0), e.getComponent(1))) {
                    incorrectLinkingComp.push(e)
                }
            });

            // Check for incorrect supernet mask
            var current_supernetmask = netController.getManualSupernetMask()
            var is_supernetmash_valid = netController.isValidSupernetMask(current_supernetmask)


            // Check for incorrect subnet mask
            var current_subnetmask = netController.getManualSubnetMask()
            var is_subnetmash_valid = netController.isValidSubnetMask(current_subnetmask)
            
            
            // Check for incorrecly assigned IP addresses
            var incorrect_ipaddresses = []
            allConnections.getAll().forEach(e => {
                incorrect_ipaddresses = incorrect_ipaddresses.concat(netController.checkValidIPAddress(e))
            })

            console.log(incorrect_ipaddresses)


            // Print to console

            if (incorrectLinkingComp.length > 0 ) {
                any_issues = true
                var str = ''
                incorrectLinkingComp.forEach(e => {
                    str += `${e.getComponent(0).displayName} -> ${e.getComponent(1).displayName}, `
                })
                // Remove comma at end if only one item
                if (incorrectLinkingComp.length == 1)
                    str.slice(-1)
                bottomPanel.consoleErrorMsg(`Incorrect linking component used between: ${str}`)
            }

            if (!is_supernetmash_valid) {
                any_issues = true
                bottomPanel.consoleErrorMsg(`Supernet mask is not valid: ${netController.getManualSupernetMask()}`)
            }

            if (!is_subnetmash_valid) {
                any_issues = true
                bottomPanel.consoleErrorMsg(`Subnet mask is not valid: ${netController.getManualSubnetMask()}`)
            }

            if (incorrect_ipaddresses.length > 0 ) {
                any_issues = true
                bottomPanel.consoleErrorMsg(`Incorrect ip addresses: ${incorrect_ipaddresses}`)
            }

            // No issues found, notify user
            if (!any_issues) {
                bottomPanel.consoleInfoMsg('No issues found!')
            }
        }

        // function createValidationError() {
            
        // }

        
        return {
            runValidationCheck:runValidationCheck,
        };   
    }
    return {
        getInstance: () => {
            if (!instance) {
                instance = init();
            }

            return instance
        }
    }
})();

export default validationController.getInstance();
