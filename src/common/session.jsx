export const StoreinSession = (key, value) => {
    return sessionStorage.setItem(key, value);
};

export const lookinSession = (key) => {
    return sessionStorage.getItem(key);
};

export const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
};

export const logOutUser = () => {
    sessionStorage.clear();
};