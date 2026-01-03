// SCORM API Wrapper for SCORM 1.2
// Based on pipwerks SCORM wrapper

var scorm = {
    version: null,
    handleCompletionStatus: true,
    handleExitMode: true,
    API: {
        handle: null,
        isFound: false
    },
    startTime: null,  // Track session start time

    // Initialize SCORM
    init: function() {
        var success = false;
        var API = this.API;

        if (!API.isFound) {
            API.handle = this.find(window);
        }

        if (API.handle) {
            success = (API.handle.LMSInitialize("") === "true");
            if (success) {
                console.log("SCORM initialized successfully");
                this.version = "1.2";
                this.startTime = new Date();  // Record session start
            } else {
                console.error("SCORM initialization failed");
            }
        } else {
            console.warn("SCORM API not found - running in standalone mode");
            success = true; // Allow standalone operation
            this.startTime = new Date();  // Record start even in standalone
        }

        return success;
    },
    
    // Find SCORM API
    find: function(win) {
        var API = null;
        var findAttempts = 0;
        var findAttemptLimit = 500;
        
        console.log("Searching for SCORM API...");
        
        // Check current window first
        if (win.API) {
            console.log("Found API in current window");
            API = win.API;
        }
        
        // Search parent windows
        while (!API && win.parent && win.parent !== win && findAttempts <= findAttemptLimit) {
            findAttempts++;
            
            if (win.parent.API) {
                console.log("Found API in parent window (attempt " + findAttempts + ")");
                API = win.parent.API;
            }
            
            win = win.parent;
        }
        
        // Check opener window
        if (!API && win.opener) {
            console.log("Checking opener window...");
            API = this.find(win.opener);
        }
        
        if (API) {
            console.log("SCORM API found!");
            this.API.isFound = true;
        } else {
            console.warn("SCORM API not found after " + findAttempts + " attempts");
        }
        
        return API;
    },
    
    // Get value from SCORM
    get: function(parameter) {
        var value = "";
        var API = this.API;
        
        if (API.handle) {
            value = API.handle.LMSGetValue(parameter);
            console.log("SCORM GET " + parameter + " = " + value);
        }
        
        return value;
    },
    
    // Set value in SCORM
    set: function(parameter, value) {
        var success = false;
        var API = this.API;
        
        if (API.handle) {
            success = (API.handle.LMSSetValue(parameter, value) === "true");
            if (!success) {
                console.error("Error setting " + parameter + " to " + value);
            }
        } else {
            console.log("Standalone mode - would set " + parameter + " to " + value);
            success = true;
        }
        
        return success;
    },
    
    // Save data to LMS
    save: function() {
        var success = false;
        var API = this.API;

        if (API.handle) {
            // Update session time before saving
            var sessionTime = this.getSessionTime();
            this.set("cmi.core.session_time", sessionTime);

            console.log("Committing SCORM data to LMS...");
            success = (API.handle.LMSCommit("") === "true");
            if (success) {
                console.log("SCORM data committed successfully (session time: " + sessionTime + ")");
            } else {
                console.error("SCORM commit failed");
                var errorCode = this.getLastError();
                console.error("Error code: " + errorCode);
            }
        } else {
            console.log("Standalone mode - no SCORM save needed");
            success = true;
        }

        return success;
    },
    
    // Calculate session time in SCORM format (HH:MM:SS)
    getSessionTime: function() {
        var sessionTime = "00:00:00";

        if (this.startTime) {
            var currentTime = new Date();
            var timeSpent = currentTime.getTime() - this.startTime.getTime();

            // Convert to seconds
            var totalSeconds = Math.floor(timeSpent / 1000);

            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds % 3600) / 60);
            var seconds = totalSeconds % 60;

            // Format as HH:MM:SS
            sessionTime = this.padTime(hours) + ":" + this.padTime(minutes) + ":" + this.padTime(seconds);
        }

        return sessionTime;
    },

    // Pad time values with leading zero
    padTime: function(val) {
        return val < 10 ? "0" + val : val;
    },

    // Quit/finish SCORM session
    quit: function() {
        var success = false;
        var API = this.API;
        var exitStatus = "suspend_data";
        var completionStatus = this.get("cmi.core.lesson_status");

        if (API.handle) {
            // Set session time before finishing
            var sessionTime = this.getSessionTime();
            console.log("Session time: " + sessionTime);
            this.set("cmi.core.session_time", sessionTime);

            if (this.handleExitMode && !completionStatus) {
                this.set("cmi.core.exit", exitStatus);
            }

            success = (API.handle.LMSFinish("") === "true");
        } else {
            success = true;
        }

        return success;
    },
    
    // Get last error
    getLastError: function() {
        var API = this.API;
        var code = 0;
        
        if (API.handle) {
            code = API.handle.LMSGetLastError();
        }
        
        return code;
    },
    
    // Set completion status
    setComplete: function() {
        return this.set("cmi.core.lesson_status", "completed");
    },
    
    // Set incomplete status
    setIncomplete: function() {
        return this.set("cmi.core.lesson_status", "incomplete");
    },
    
    // Set passed status
    setPassed: function() {
        console.log("Setting SCORM status to: passed");
        return this.set("cmi.core.lesson_status", "passed");
    },
    
    // Set failed status
    setFailed: function() {
        console.log("Setting SCORM status to: failed");
        return this.set("cmi.core.lesson_status", "failed");
    },
    
    // Set score
    setScore: function(score, min, max) {
        min = min || 0;
        max = max || 100;

        console.log(`Setting SCORM score: ${score} (min: ${min}, max: ${max})`);

        // Convert to strings as required by SCORM 1.2
        this.set("cmi.core.score.raw", String(score));
        this.set("cmi.core.score.min", String(min));
        this.set("cmi.core.score.max", String(max));

        return true;
    }
};

// Auto-initialize when page loads
window.addEventListener('load', function() {
    var initAttempts = 0;
    var maxAttempts = 10;
    
    function tryInit() {
        initAttempts++;
        console.log("SCORM initialization attempt " + initAttempts);
        
        var success = scorm.init();
        
        if (!scorm.API.isFound && initAttempts < maxAttempts) {
            console.log("Retrying SCORM init in 200ms...");
            setTimeout(tryInit, 200);
        } else if (scorm.API.isFound) {
            console.log("SCORM wrapper loaded and connected");
            
            // Debug: Check what values D2L has stored
            console.log("=== Checking stored SCORM values ===");
            var storedStatus = scorm.get("cmi.core.lesson_status");
            var storedScore = scorm.get("cmi.core.score.raw");
            var storedLocation = scorm.get("cmi.core.lesson_location");
            console.log("Stored status: " + storedStatus);
            console.log("Stored score: " + storedScore);
            console.log("Stored location: " + storedLocation);
            console.log("=== End stored values ===");
        } else {
            console.log("SCORM wrapper loaded in standalone mode");
        }
    }
    
    tryInit();
});

// Auto-quit when page unloads
window.addEventListener('beforeunload', function() {
    scorm.save();
    scorm.quit();
});
