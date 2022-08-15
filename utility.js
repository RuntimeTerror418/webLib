const initCanvas2D = (id) => {
    let ctx;
    const canvas = document.getElementById(id);
    if(canvas) {
        ctx = canvas.getContext("2d");
        if(ctx) return {canvas, ctx};
        else throw new Error("Failed to initialise the canvas rendering context");
    } else 
        throw new Error(`Canvas:${id} --could not be found on this page`);
};


const accessLocalStorage = (metadata) => {
    try {
        metadata.storage = true;
        const table = window.localStorage.getItem(metadata.name);
        if(table) {
            return Promise.resolve({
                data: JSON.parse(table), table: window.localStorage});
        } else {
            window.localStorage.setItem(metadata.name, metadata.storageJSON);
            const table = window.localStorage.getItem(metadata.name);
            return Promise.resolve({data: JSON.parse(table), table: window.localStorage});
        }
    } catch {
        metadata.storage = false;
        return Promise.reject();
    }
};


/**
 * This function accepts a positional argument followed by a variable length
 * parameters denoting the url for the images to be loaded
 * 
 * @param {Object} container An object containing loaded image data
 * @param  {...any} src image  source
 * @returns {Promise}
 */
 function loadAllImages(container, ...src) {
    const loaded = [];
    for(let i of src) {
        const img = new Image();
        img.src = "assets/img/" + i + ".png";
        const promise = new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                container[i] = img;
                resolve(1);
            });
            img.addEventListener("error", () => reject(img));
        });
        loaded.push(promise);
    };
    return Promise.all(loaded);
};

const loadJSON = (url) => fetch(url).then(e => e.json());


// A manipulation of the window.setInterval method but using the requestAnimationFrame
// This function is not supposed to be called inside a loop
const setIntervalRaf = (() => {
    const api = {};
    api.t0 = new Date().getTime();
    const update = () => {
        api.t1 = new Date().getTime();
        api.diff = Math.abs(api.t1 - api.t0) * 1e-3;
        requestAnimationFrame(update);
    };
    api.start = () => {
        requestAnimationFrame(update);  
    };
    return api;
});


const getPropertyValue = (ele, prop) => window.getComputedStyle(ele).getPropertyValue(prop);

export {
    initCanvas2D,
    accessLocalStorage,
    loadAllImages,
    loadJSON,
    setIntervalRaf,
    getPropertyValue
};
