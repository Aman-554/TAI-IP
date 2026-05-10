// client/js/helper.js

const Helpers = {
    // Format date string to readable format
    formatDate: (dateString) => {
        if (!dateString || dateString === 'N/A') return 'N/A';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateString;
        }
    },
    
    // Format runtime in minutes to hours and minutes
    formatRuntime: (minutes) => {
        if (!minutes || isNaN(parseInt(minutes))) return 'N/A';
        const mins = parseInt(minutes);
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;
    },
    
    // Generate a random color based on string input
    stringToColor: (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }
};

// Make it available globally if needed
if (typeof window !== 'undefined') {
    window.Helpers = Helpers;
}
