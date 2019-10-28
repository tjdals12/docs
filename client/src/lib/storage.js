
const storage = {
    set: (key, object) => {
        if (!localStorage) return;
        localStorage[key] = typeof (object) === 'string' ? object : JSON.stringify(object)
    },
    get: (key) => {
        if (!localStorage || !localStorage[key])
            return null;

        try {
            return JSON.parse(localStorage[key]);
        } catch (e) {
            return localStorage[key]
        }
    },
    remove: (key) => {
        if (!localStorage)
            return null;

        if (localStorage[key])
            localStorage.removeItem(key);
    }
};

export default storage;