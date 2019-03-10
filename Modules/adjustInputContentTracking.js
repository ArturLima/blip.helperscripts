exports.adjustInputContentTrackingScript = (function () {
	var fs = require('fs')

    function GetInputContentSubstringScript(){
        return {
            "type": "ExecuteScript",
            "$title": "Executar script - Input Content Substring",
            "$invalid": false,
            "settings": {
                "function": "run",
                "source": "\nfunction run(input) {\n    return input.substring(0, 255);\n}",
                "inputVariables": ["input.content"],
                "outputVariable": "inputContentSubstring"
            }
        }
    }

	return function (blipJson) {
		try {
			Object.keys(blipJson).forEach(function (k) {
                var blipblock = blipJson[k]		
                let leavingActions = Object.assign([], blipblock["$leavingCustomActions"])
                blipblock["$leavingCustomActions"].forEach((action, idx) => {
                    if (action.type === 'TrackEvent' && action.settings.action === '{{input.content}}') {
                        let script = GetInputContentSubstringScript()
                        leavingActions[idx].settings.action = "{{inputContentSubstring}}"
                        leavingActions.splice(idx, 0, script)
                    }
                })
                blipblock["$leavingCustomActions"] = leavingActions

                let enteringActions = Object.assign([], blipblock["$enteringCustomActions"])
                blipblock["$enteringCustomActions"].forEach((action, idx) => {
                    if (action.type === 'TrackEvent' && action.settings.action === '{{input.content}}') {
                        let script = GetInputContentSubstringScript()
                        leavingActions[idx].settings.action = "{{inputContentSubstring}}"
                        enteringActions.splice(idx, 0, script)
                    }
                })
                blipblock["$enteringCustomActions"] = enteringActions
			})

			return blipJson;
			
		} catch (error) {
			console.log(error)
		}
	}
})()